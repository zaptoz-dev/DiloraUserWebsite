/**
 * WebSocket transport for the interactive voice demo.
 *
 * Mounted on the site's existing HTTP server, so it inherits the origin and the
 * TLS that Caddy already terminates — the browser connects to wss:// on the same
 * host it loaded the page from, and there is no second service to deploy or
 * certificate to manage.
 *
 * Wire protocol
 *
 *   client -> server
 *     binary                        raw PCM, 16 kHz, signed 16-bit LE, mono
 *     {"type":"start","personaId"}  begin a session with the chosen industry
 *     {"type":"stop"}               hang up
 *
 *   server -> client
 *     binary                            PCM to play, same format
 *     {"type":"ready",...}              session open, persona confirmed
 *     {"type":"state","state":...}      listening | thinking | speaking
 *     {"type":"transcript",role,text}   what was heard / what was said
 *     {"type":"vad","speaking":bool}    caller voice activity, for the UI
 *     {"type":"speaking","ttfbMs"}      first audio byte of a reply
 *     {"type":"clear"}                  barge-in: drop queued audio
 *     {"type":"interrupted"}            barge-in, for the UI
 *     {"type":"ended","reason"}         session over
 *     {"type":"error","message"}        something went wrong, plainly worded
 *
 * SECURITY: this endpoint spends Deepgram, Polly and Bedrock credits on every
 * session and has no authentication in front of it — it cannot, since it serves
 * anonymous visitors. Four controls stand in for auth: an exact-match origin
 * allowlist, a per-IP hourly cap, a ceiling on concurrent sessions, and a hard
 * wall-clock limit per session enforced inside VoiceSession. Weakening any of
 * them turns this into an open API billed to us.
 */

import { WebSocketServer } from "ws";
import { allowedOrigins, limits, configSummary } from "./config.js";
import { isValidPersonaId, DEFAULT_PERSONA_ID, listPersonas } from "./personas.js";
import { ttsStatus } from "./tts.js";
import { VoiceSession } from "./session.js";

export const VOICE_WS_PATH = "/api/voice/stream";

/** Close codes. 1008 = policy violation, 1013 = try again later. */
const CLOSE_POLICY = 1008;
const CLOSE_TRY_LATER = 1013;

// ---------------------------------------------------------------------------
// Abuse controls
//
// In-memory, so both counters reset on restart and are per-process. That is
// correct for a single-instance deployment and wrong the moment this runs more
// than one — the same caveat the site's existing demo-call limiter carries. Move
// both to Redis before scaling out.
// ---------------------------------------------------------------------------
const ipHits = new Map();
let activeSessions = 0;

function rateLimitOk(ip) {
  const now = Date.now();
  const windowStart = now - 3600_000;
  const hits = (ipHits.get(ip) ?? []).filter((t) => t > windowStart);

  if (hits.length >= limits.maxPerIpPerHour) {
    ipHits.set(ip, hits);
    return false;
  }
  hits.push(now);
  ipHits.set(ip, hits);
  return true;
}

/** Keep the map from growing without bound on a long-lived process. */
function pruneIpHits() {
  const windowStart = Date.now() - 3600_000;
  for (const [ip, hits] of ipHits) {
    const live = hits.filter((t) => t > windowStart);
    if (live.length) ipHits.set(ip, live);
    else ipHits.delete(ip);
  }
}
setInterval(pruneIpHits, 600_000).unref();

/**
 * Caddy appends the real client IP to X-Forwarded-For, so the *last* entry is
 * the one it added and the only one a client cannot forge by sending its own
 * header. This mirrors Express's `trust proxy: 1` — taking the first entry
 * instead would let any visitor spoof their way around the per-IP cap.
 */
function clientIpOf(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    const parts = forwarded.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length) return parts[parts.length - 1];
  }
  return req.socket?.remoteAddress ?? "unknown";
}

function originAllowed(req) {
  const origin = (req.headers.origin ?? "").replace(/\/$/, "");
  // Empty allowlist means same-origin only, which is the normal deployment: a
  // browser always sends Origin, so a cross-site page is still rejected below
  // by the host comparison.
  if (allowedOrigins.length) return allowedOrigins.includes(origin);
  if (!origin) return false;
  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Attach
// ---------------------------------------------------------------------------

/**
 * @param {import("node:http").Server} server
 */
export function attachVoiceWebSocket(server) {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (req, socket, head) => {
    let pathname;
    try {
      pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
    } catch {
      socket.destroy();
      return;
    }

    // Leave other upgrade paths alone — Vite's HMR socket shares this server in
    // dev, and destroying every non-voice upgrade would break it.
    if (pathname !== VOICE_WS_PATH) return;

    if (!limits.enabled) {
      socket.write("HTTP/1.1 503 Service Unavailable\r\n\r\n");
      socket.destroy();
      return;
    }

    if (!originAllowed(req)) {
      console.warn(`[voice/ws] rejected origin: ${req.headers.origin ?? "(none)"}`);
      socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
      socket.destroy();
      return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  });

  wss.on("connection", (ws, req) => {
    const ip = clientIpOf(req);

    if (!rateLimitOk(ip)) {
      ws.close(CLOSE_TRY_LATER, "Demo limit reached, try again later");
      return;
    }
    if (activeSessions >= limits.maxConcurrent) {
      ws.close(CLOSE_TRY_LATER, "All demo lines are busy, try again shortly");
      return;
    }

    activeSessions++;
    const id = Math.random().toString(36).slice(2, 8);
    let session = null;
    let released = false;

    const release = () => {
      if (released) return;
      released = true;
      activeSessions = Math.max(0, activeSessions - 1);
    };

    const sendJson = (payload) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify(payload));
      }
    };
    const sendAudio = (pcm) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(pcm, { binary: true });
      }
    };

    console.log(`[voice/${id}] connected (ip=${ip} active=${activeSessions})`);

    // A client that connects and never sends `start` would hold a concurrency
    // slot indefinitely.
    const startDeadline = setTimeout(() => {
      if (!session) {
        sendJson({ type: "error", message: "No session was started." });
        ws.close(CLOSE_POLICY, "start timeout");
      }
    }, 15_000);

    ws.on("message", async (data, isBinary) => {
      if (isBinary) {
        session?.onAudio(Buffer.from(data));
        return;
      }

      let message;
      try {
        message = JSON.parse(data.toString());
      } catch {
        return;
      }

      if (message.type === "start") {
        if (session) return;
        clearTimeout(startDeadline);

        const personaId = isValidPersonaId(message.personaId)
          ? message.personaId
          : DEFAULT_PERSONA_ID;

        session = new VoiceSession({ id, personaId, sendAudio, sendJson });
        session.once("ended", () => {
          // Let the final `ended` frame flush before closing the socket.
          setTimeout(() => {
            if (ws.readyState === ws.OPEN) ws.close(1000, "session ended");
          }, 250);
        });

        try {
          await session.start();
        } catch (error) {
          console.error(`[voice/${id}] start failed: ${error.message}`);
          sendJson({
            type: "error",
            message: "Could not start the demo. Please try again.",
          });
          ws.close(1011, "start failed");
        }
        return;
      }

      if (message.type === "stop") {
        await session?.stop("caller_hung_up");
        if (ws.readyState === ws.OPEN) ws.close(1000, "client stopped");
      }
    });

    ws.on("close", () => {
      clearTimeout(startDeadline);
      release();
      session?.stop("disconnected").catch(() => {});
      console.log(`[voice/${id}] closed (active=${activeSessions})`);
    });

    ws.on("error", (error) => {
      console.error(`[voice/${id}] socket error: ${error.message}`);
      clearTimeout(startDeadline);
      release();
      session?.stop("socket_error").catch(() => {});
    });
  });

  console.log(`Voice demo WebSocket mounted at ${VOICE_WS_PATH}`);
  return wss;
}

/** Capacity snapshot for /api/voice/health. */
export function voiceStatus() {
  const summary = configSummary();
  return {
    ...summary,
    // Live provider state, not just what was configured — this is what reveals
    // that Murf has been latched off and Polly is doing the talking.
    tts: { ...summary.tts, ...ttsStatus() },
    personas: listPersonas(),
    activeSessions,
    slotsAvailable: Math.max(0, limits.maxConcurrent - activeSessions),
  };
}

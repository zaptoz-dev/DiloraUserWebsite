/**
 * Deepgram speech-to-text.
 *
 * Buffered one-shot per utterance against the pre-recorded /v1/listen endpoint,
 * matching how the main product does it. A streaming websocket would be faster
 * still (see the note at the bottom), but it also hands endpointing to Deepgram —
 * and endpointing is exactly what we want to control locally, since browser audio
 * needs a much shorter silence window than telephony does.
 *
 * ---------------------------------------------------------------------------
 * Why this uses node:https and a hand-rolled pool
 *
 * Measured from an India-based host, the same 3.3s utterance transcribes in
 * either ~700-900ms or ~2000-2600ms, with nothing in between. Instrumenting the
 * socket showed exactly what splits them:
 *
 *     socket=reused  ->   710ms,  833ms,  715ms,  710ms
 *     socket=NEW     ->  2558ms, 2012ms, 2254ms, 2018ms
 *
 * and after any gap of ~6s the socket is always NEW. Deepgram closes idle
 * connections quickly, so in a real conversation — where turns are naturally
 * seconds apart — practically every turn paid a fresh TLS handshake worth
 * 1.3-1.8s. That was the single largest cost in a turn, larger than the LLM.
 *
 * Raising keepAliveMsecs does not help: the remote side is the one hanging up.
 * What does help is `preconnect()`. The handshake cannot be avoided, but it can
 * be moved off the critical path — we know a transcription request is coming the
 * instant the caller starts talking, so the connection is established while they
 * are still mid-sentence and is waiting in the pool by the time it is needed.
 *
 * fetch() cannot express this: undici's connection pool is not configurable
 * without adding a dependency, and there is no way to observe or pre-warm a
 * socket. node:https gives both, with nothing to install.
 * ---------------------------------------------------------------------------
 */

import https from "node:https";
import { SAMPLE_RATE, stt } from "./config.js";

const HOSTNAME = "api.deepgram.com";

/**
 * Shared across the process. maxSockets is well above the concurrent-session cap
 * so two callers talking at once never queue behind each other.
 */
const agent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 10_000,
  maxSockets: 16,
  maxFreeSockets: 8,
  timeout: 120_000,
});

function listenPath(language) {
  const params = new URLSearchParams({
    model: stt.model,
    encoding: "linear16",
    sample_rate: String(SAMPLE_RATE),
    channels: "1",
    language,
    smart_format: "true",
    punctuate: "true",
  });
  return `/v1/listen?${params}`;
}

/**
 * @returns {Promise<{status: number, body: string, reusedSocket: boolean}>}
 */
function post(pcm, language, timeoutMs) {
  const apiKey = stt.apiKey();

  return new Promise((resolve, reject) => {
    let reusedSocket = false;

    const request = https.request(
      {
        hostname: HOSTNAME,
        path: listenPath(language),
        method: "POST",
        agent,
        headers: {
          Authorization: `Token ${apiKey}`,
          "Content-Type": "audio/raw",
          "Content-Length": pcm.length,
        },
      },
      (response) => {
        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () =>
          resolve({
            status: response.statusCode ?? 0,
            body: Buffer.concat(chunks).toString("utf8"),
            reusedSocket,
          })
        );
      }
    );

    // A socket that is not still connecting came from the pool — this is the
    // measurement that identified the handshake as the dominant cost.
    request.on("socket", (socket) => {
      reusedSocket = !socket.connecting;
    });

    request.setTimeout(timeoutMs, () => {
      request.destroy(new Error("deepgram timeout"));
    });
    request.on("error", reject);
    request.end(pcm);
  });
}

/**
 * Open a connection ahead of the request that will need it.
 *
 * Called the moment voice activity is detected, so the TLS handshake overlaps
 * with the caller still speaking instead of delaying their reply. Fire and
 * forget: if it fails, the real request simply opens its own socket as before.
 *
 * The request body is 50ms of silence — the cheapest thing that completes a real
 * handshake and leaves a usable socket in the pool.
 */
export function preconnect() {
  if (!stt.apiKey()) return;
  // A socket is already available; nothing to do.
  if (agent.freeSockets[`${HOSTNAME}:443:`]?.length) return;

  post(Buffer.alloc(1600), stt.language, 8000).catch(() => {
    /* Best effort only. */
  });
}

/**
 * Transcribe one buffered utterance.
 *
 * @param {Buffer} pcm Raw signed 16-bit LE mono PCM at SAMPLE_RATE.
 * @returns {Promise<string>} The transcript, or "" if nothing was recognised.
 */
export async function transcribe(pcm) {
  if (!stt.apiKey()) throw new Error("DEEPGRAM_API_KEY is not set");
  if (!pcm?.length) return "";

  try {
    let response = await post(pcm, stt.language, stt.timeoutMs);

    // Not every language is valid for every model — nova-3 rejects some with a
    // 400 rather than degrading. `multi` auto-detects across 36+ languages, so
    // it is a safe second attempt rather than a hard failure.
    if (
      response.status === 400 &&
      stt.language !== "multi" &&
      /no such model|language/i.test(response.body)
    ) {
      console.warn(
        `[voice/stt] language "${stt.language}" rejected, retrying as multi`
      );
      response = await post(pcm, "multi", stt.timeoutMs);
    }

    if (response.status !== 200) {
      console.error(
        `[voice/stt] HTTP ${response.status}: ${response.body.slice(0, 200)}`
      );
      return "";
    }

    const data = JSON.parse(response.body);
    const alternative = data?.results?.channels?.[0]?.alternatives?.[0] ?? null;
    return (alternative?.transcript ?? "").trim();
  } catch (error) {
    // A timeout or network blip loses this turn, not the session — the caller
    // treats "" as "didn't catch that" and keeps listening.
    console.error(`[voice/stt] failed: ${error.message}`);
    return "";
  }
}

/** Pay the first handshake at boot rather than on the first visitor. */
export async function warmUp() {
  if (!stt.apiKey()) return false;
  try {
    const response = await post(Buffer.alloc(3200), stt.language, 10_000);
    return response.status === 200;
  } catch {
    return false;
  }
}

/**
 * NEXT OPTIMIZATION, if turn latency ever needs to come down further: Deepgram's
 * streaming WebSocket holds one connection for the whole session, which removes
 * the per-turn handshake entirely *and* transcribes while the caller is still
 * talking — so instead of ~800ms after they stop, only the final fragment is
 * outstanding (~150-300ms). Keep local endpointing and simply collect the final
 * results; do not adopt Deepgram's utterance_end_ms, or the carefully tuned
 * 650ms silence window moves out of our hands.
 */

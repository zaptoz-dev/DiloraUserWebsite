/**
 * Dialora website server.
 *
 * Serves the built Vite SPA out of dist/ and exposes the one endpoint that
 * needs a secret: POST /api/demo-call, which places a Bolna call on behalf of
 * a visitor who filled in the Demo form.
 *
 * The site and the API share an origin on purpose — the browser calls
 * /api/demo-call with a relative path, so there is no CORS setup and no API
 * base URL to keep in sync between environments.
 */

import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { placeInstantCall, getExecution } from "./bolna.js";
import { toE164 } from "../shared/phone.js";
import { checkAllowance, getLimits } from "./rateLimit.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, "..", "dist");

const app = express();

/**
 * Caddy/nginx terminates TLS in front of this, so req.ip would otherwise be
 * 127.0.0.1 for every visitor and the per-IP limit would be a single global
 * bucket. One hop is trusted — not `true`, which would let a client forge
 * X-Forwarded-For and walk straight past the limit.
 */
app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(express.json({ limit: "16kb" }));

/**
 * Only needed when the site is served from somewhere other than this server
 * (e.g. still on GitHub Pages while the API runs here). Same-origin deployment
 * needs none of this, so the allowlist is empty by default. Comma-separated
 * exact origins — never a bare "*", which would let any site on the internet
 * spend our Bolna balance.
 */
const CORS_ORIGINS = (process.env.DEMO_CORS_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use("/api", (req, res, next) => {
  const origin = req.headers.origin;
  if (origin && CORS_ORIGINS.includes(origin.replace(/\/$/, ""))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  }
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// ---------------------------------------------------------------------------
// Demo call
// ---------------------------------------------------------------------------

/** Trim, collapse whitespace and cap length before anything reaches Bolna. */
function clean(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

const INTENT_LABELS = {
  sales: "Sales & Lead Generation",
  support: "Customer Support",
  booking: "Appointment Booking",
  collections: "Collections & Recovery",
  other: "Other",
};

// ---------------------------------------------------------------------------
// Calling hours
//
// Bolna enforces India's TRAI telemarketing window (9 AM-9 PM IST) on its own
// side for +91 numbers. It doesn't reject an out-of-window /call — it accepts
// the request (status "queued"), then flips the execution to "rescheduled"
// for the next 9 AM IST a moment later, with no error and no webhook to us.
// Confirmed 2026-09-03: a call placed at 9:35 PM IST came back "queued" and
// was "rescheduled" to 08:59:59 AM IST the next day within 300ms.
//
// So this is checked twice: up front, to give an honest error instead of a
// false "calling you now" (checkIndiaCallingHours); and again just after
// placing the call, to catch a reschedule for any other reason — a DND-listed
// number, for instance — that the pre-check can't see coming
// (confirmCallWasPlaced).
// ---------------------------------------------------------------------------

const IST_OFFSET_MS = (5 * 60 + 30) * 60_000;
const CALL_WINDOW_START_HOUR = 9; // 9 AM IST
const CALL_WINDOW_END_HOUR = 21; // 9 PM IST

function istHourNow() {
  // Lets the smoke test exercise both branches deterministically instead of
  // depending on whatever time it happens to run.
  const override = process.env.DEMO_TEST_IST_HOUR;
  if (override !== undefined) return Number(override);
  return new Date(Date.now() + IST_OFFSET_MS).getUTCHours();
}

function isWithinIndiaCallingHours() {
  const hour = istHourNow();
  return hour >= CALL_WINDOW_START_HOUR && hour < CALL_WINDOW_END_HOUR;
}

function checkIndiaCallingHours(phoneNumber) {
  if (!phoneNumber.startsWith("+91")) return { ok: true };
  if (isWithinIndiaCallingHours()) return { ok: true };
  return {
    ok: false,
    reason:
      "Indian telecom rules only allow us to call between 9 AM and 9 PM IST. Please try again during those hours.",
  };
}

function formatIstClock(date) {
  const ist = new Date(date.getTime() + IST_OFFSET_MS);
  const h24 = ist.getUTCHours();
  const m = String(ist.getUTCMinutes()).padStart(2, "0");
  const h12 = ((h24 + 11) % 12) + 1;
  return `${h12}:${m} ${h24 < 12 ? "AM" : "PM"} IST`;
}

/**
 * Bolna's synchronous /call response only ever says "queued" — the reschedule
 * happens a moment later, entirely on Bolna's side. So after placing a call we
 * re-fetch the execution once, after a short delay, to see whether it actually
 * held. Bounded to ~1.5s total: long enough to catch the reschedule (observed
 * at ~250ms), short enough not to make the visitor wait on a spinner.
 */
const CONFIRM_DELAY_MS = Number(process.env.DEMO_CONFIRM_DELAY_MS) || 1200;

async function confirmCallWasPlaced(executionId) {
  await new Promise((r) => setTimeout(r, CONFIRM_DELAY_MS));
  try {
    const execution = await getExecution(executionId);
    if (execution.status === "rescheduled" && execution.scheduled_at) {
      return { rescheduled: true, scheduledAt: execution.scheduled_at };
    }
  } catch {
    // Can't confirm — fall through and tell the visitor it's in progress
    // rather than blocking the response on a Bolna hiccup.
  }
  return { rescheduled: false };
}

app.post("/api/demo-call", async (req, res) => {
  const body = req.body ?? {};

  const name = clean(body.name, 80);
  const company = clean(body.company, 80);
  const email = clean(body.email, 120);
  const notes = clean(body.notes, 500);
  const intentKey = clean(body.intent, 32);

  const phoneNumber = toE164(body.phone, body.countryCode);
  if (!phoneNumber) {
    return res.status(400).json({
      error:
        "That doesn't look like a valid mobile number. Check the country code and try again.",
      field: "phone",
    });
  }

  if (!name) {
    return res.status(400).json({ error: "Please tell us your name.", field: "name" });
  }

  // Deliberately loose: the point is to catch a typo, not to police addresses.
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res
      .status(400)
      .json({ error: "That email address doesn't look right.", field: "email" });
  }

  const hours = checkIndiaCallingHours(phoneNumber);
  if (!hours.ok) {
    return res.status(422).json({ error: hours.reason, field: "phone" });
  }

  const allowance = checkAllowance(req.ip, phoneNumber);
  if (!allowance.ok) {
    return res.status(429).json({ error: allowance.reason });
  }

  // Values become {placeholders} in the agent's prompt. Blanks are dropped so
  // the agent never reads out an empty variable.
  const userData = Object.fromEntries(
    Object.entries({
      first_name: name.split(" ")[0],
      full_name: name,
      company_name: company,
      email,
      intent: INTENT_LABELS[intentKey] ?? "",
      notes,
    }).filter(([, v]) => typeof v === "string" && v !== "")
  );

  try {
    const result = await placeInstantCall(phoneNumber, userData);

    // Only now — a Bolna failure shouldn't burn the visitor's allowance.
    allowance.commit();

    // Logged without the phone number; the execution id is enough to find the
    // call in Bolna, and this log is not the place for a visitor's mobile.
    console.log(
      `[demo-call] placed execution=${result.execution_id} status=${result.status}`
    );

    const confirmation = await confirmCallWasPlaced(result.execution_id);
    if (confirmation.rescheduled) {
      console.log(
        `[demo-call] execution=${result.execution_id} was rescheduled to ${confirmation.scheduledAt}`
      );
      return res.json({
        executionId: result.execution_id,
        status: "rescheduled",
        message: `That number couldn't be reached right now, so Bolna has scheduled the call for ${formatIstClock(
          new Date(confirmation.scheduledAt)
        )} instead.`,
      });
    }

    return res.json({
      executionId: result.execution_id,
      status: result.status,
      message: result.message,
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error(`[demo-call] failed: ${detail}`);

    // Bolna's raw complaint can name the agent id or account state, so the
    // visitor gets a generic line while the real reason goes to the log.
    return res.status(502).json({
      error:
        "We couldn't place the call just now. Please try again in a moment, or email us and we'll call you back.",
    });
  }
});

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    // Echoes the caller's own IP so a deploy can verify the reverse proxy is
    // passing X-Forwarded-For through. If this reads 127.0.0.1 from outside the
    // box, `trust proxy` is wrong and every visitor shares one rate-limit
    // bucket, which would silently neuter the per-IP cap.
    clientIp: req.ip,
    // Confirms the box is configured without ever echoing the values.
    bolnaConfigured: Boolean(process.env.BOLNA_API_KEY && process.env.BOLNA_AGENT_ID),
    limits: getLimits(),
  });
});

// ---------------------------------------------------------------------------
// Static site
// ---------------------------------------------------------------------------

// Hashed filenames from the Vite build are safe to cache hard.
app.use(
  "/assets",
  express.static(path.join(DIST_DIR, "assets"), {
    immutable: true,
    maxAge: "1y",
  })
);

app.use(express.static(DIST_DIR, { index: false }));

// The app uses HashRouter, so every route is really index.html. This also
// covers a direct hit on a path-style URL rather than 404ing it.
app.get(/^(?!\/api\/).*/, (_req, res) => {
  res.sendFile(path.join(DIST_DIR, "index.html"));
});

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "127.0.0.1";

app.listen(PORT, HOST, () => {
  console.log(`Dialora site listening on http://${HOST}:${PORT}`);
  if (!process.env.BOLNA_API_KEY || !process.env.BOLNA_AGENT_ID) {
    console.warn(
      "WARNING: BOLNA_API_KEY / BOLNA_AGENT_ID are not set — /api/demo-call will fail."
    );
  }
});

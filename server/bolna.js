/**
 * Bolna API client. Ported from the TSI Stock Brokers dashboard
 * (src/lib/bolna.ts), trimmed to the one thing the Dilora site needs: firing a
 * single instant demo call.
 *
 * The API key is read from the environment and never leaves this process — the
 * browser only ever talks to our own /api/demo-call.
 */

const BASE_URL = "https://api.bolna.ai";

function getApiKey() {
  const apiKey = process.env.BOLNA_API_KEY;
  if (!apiKey) throw new Error("BOLNA_API_KEY is not set");
  return apiKey;
}

export function getAgentId() {
  const agentId = process.env.BOLNA_AGENT_ID;
  if (!agentId) throw new Error("BOLNA_AGENT_ID is not set");
  return agentId;
}

function jsonHeaders() {
  return {
    Authorization: `Bearer ${getApiKey()}`,
    "Content-Type": "application/json",
  };
}

/**
 * Bolna reports errors three different ways depending on the endpoint:
 * `{message}`, `{detail: string}` and FastAPI's `{detail: [{loc, msg}]}`
 * (validation). Surface whichever we get so failures name the real cause.
 */
function extractMessage(body) {
  if (!body || typeof body !== "object") return null;
  if (typeof body.message === "string" && body.message) return body.message;
  if (typeof body.error === "string" && body.error) return body.error;

  const detail = body.detail;
  if (typeof detail === "string" && detail) return detail;
  if (Array.isArray(detail)) {
    const parts = detail
      .map((d) => {
        if (!d || typeof d !== "object") return String(d);
        const loc = Array.isArray(d.loc)
          ? d.loc.filter((x) => typeof x === "string").join(".")
          : "";
        const msg = typeof d.msg === "string" ? d.msg : JSON.stringify(d);
        return loc ? `${loc}: ${msg}` : msg;
      })
      .filter(Boolean);
    if (parts.length) return parts.join("; ");
  }
  return null;
}

async function toError(res) {
  let body = null;
  try {
    body = await res.json();
  } catch {
    // Non-JSON error body — fall through to the status line.
  }
  const message = extractMessage(body);
  const error = new Error(
    message
      ? `Bolna API ${res.status}: ${message}`
      : `Bolna API error: ${res.status} ${res.statusText}`
  );
  error.status = res.status;
  return error;
}

/** Bolna occasionally hangs; don't let a demo request hang with it. */
const REQUEST_TIMEOUT_MS = 20_000;

async function request(path, init) {
  const res = await fetch(`${BASE_URL}${path}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    ...init,
  });
  if (!res.ok) throw await toError(res);
  return res.json();
}

/**
 * POST /call — fires immediately. Returns `{message, status, execution_id}`.
 *
 * `userData` values are interpolated into the agent's prompt as {key}, so blank
 * entries are dropped by the caller rather than injected as empty strings.
 */
export async function placeInstantCall(recipientPhoneNumber, userData) {
  const body = {
    agent_id: getAgentId(),
    recipient_phone_number: recipientPhoneNumber,
  };

  if (userData && Object.keys(userData).length > 0) {
    body.user_data = userData;
  }

  // Omitted entirely when unset — Bolna then uses the account's default number.
  const fromNumber = process.env.BOLNA_FROM_PHONE_NUMBER?.trim();
  if (fromNumber) body.from_phone_number = fromNumber;

  return request("/call", {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify(body),
  });
}

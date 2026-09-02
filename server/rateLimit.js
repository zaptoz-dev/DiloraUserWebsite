/**
 * Abuse guard for the public demo-call endpoint.
 *
 * The endpoint dials any number a stranger types into a public form, so without
 * a limit it is a free spam-dialler pointed at third parties and a way to drain
 * the Bolna balance. Three sliding windows, all enforced together:
 *
 *   - per IP      — how many calls one visitor may trigger
 *   - per number  — so one target can't be dialled repeatedly from many IPs
 *   - global      — a ceiling on the whole endpoint per day
 *
 * State is in-memory: it resets when the service restarts and is per-process,
 * which is fine for the single systemd process this runs as. If it ever runs
 * behind more than one instance, move these counters to Redis.
 */

function num(name, fallback) {
  const raw = Number(process.env[name]);
  return Number.isFinite(raw) && raw > 0 ? raw : fallback;
}

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

export function getLimits() {
  return {
    perIpPerHour: num("DEMO_MAX_PER_IP_PER_HOUR", 3),
    perIpPerDay: num("DEMO_MAX_PER_IP_PER_DAY", 10),
    perNumberPerHour: num("DEMO_MAX_PER_NUMBER_PER_HOUR", 1),
    perNumberPerDay: num("DEMO_MAX_PER_NUMBER_PER_DAY", 3),
    globalPerDay: num("DEMO_MAX_GLOBAL_PER_DAY", 100),
  };
}

/** key -> array of epoch-ms timestamps, newest last. */
const hits = new Map();

function record(key, now) {
  const list = hits.get(key);
  if (list) list.push(now);
  else hits.set(key, [now]);
}

function countWithin(key, windowMs, now) {
  const list = hits.get(key);
  if (!list) return 0;
  const cutoff = now - windowMs;
  // Timestamps are appended in order, so drop the expired prefix in place.
  let i = 0;
  while (i < list.length && list[i] <= cutoff) i++;
  if (i > 0) list.splice(0, i);
  if (list.length === 0) hits.delete(key);
  return list.length;
}

/** Stops the Map growing without bound on a long-running process. */
function sweep(now) {
  for (const [key, list] of hits) {
    const cutoff = now - DAY_MS;
    let i = 0;
    while (i < list.length && list[i] <= cutoff) i++;
    if (i > 0) list.splice(0, i);
    if (list.length === 0) hits.delete(key);
  }
}

let lastSweep = 0;

function minutesUntilFree(key, windowMs, now) {
  const list = hits.get(key);
  if (!list || list.length === 0) return 1;
  return Math.max(1, Math.ceil((list[0] + windowMs - now) / 60_000));
}

function retryMessage(minutes) {
  if (minutes >= 120) return `Try again in about ${Math.round(minutes / 60)} hours.`;
  if (minutes >= 60) return "Try again in about an hour.";
  return `Try again in about ${minutes} minute${minutes === 1 ? "" : "s"}.`;
}

/**
 * Checks every window without recording anything. Call `commit()` on the result
 * only once the call has actually been placed, so a Bolna failure doesn't burn
 * the visitor's allowance.
 */
export function checkAllowance(ip, phoneNumber) {
  const now = Date.now();
  if (now - lastSweep > HOUR_MS) {
    sweep(now);
    lastSweep = now;
  }

  const limits = getLimits();
  const ipKey = `ip:${ip}`;
  const numKey = `num:${phoneNumber}`;
  const globalKey = "global";

  const checks = [
    {
      key: numKey,
      window: HOUR_MS,
      max: limits.perNumberPerHour,
      reason: "This number has already been sent a demo call recently.",
    },
    {
      key: numKey,
      window: DAY_MS,
      max: limits.perNumberPerDay,
      reason: "This number has had its demo calls for today.",
    },
    {
      key: ipKey,
      window: HOUR_MS,
      max: limits.perIpPerHour,
      reason: "Too many demo calls requested from here in the last hour.",
    },
    {
      key: ipKey,
      window: DAY_MS,
      max: limits.perIpPerDay,
      reason: "Too many demo calls requested from here today.",
    },
  ];

  for (const c of checks) {
    if (countWithin(c.key, c.window, now) >= c.max) {
      return {
        ok: false,
        reason: `${c.reason} ${retryMessage(minutesUntilFree(c.key, c.window, now))}`,
      };
    }
  }

  if (countWithin(globalKey, DAY_MS, now) >= limits.globalPerDay) {
    return {
      ok: false,
      // Deliberately vague — a stranger doesn't need to know the ceiling.
      reason:
        "Demo calls are temporarily unavailable. Please try again later or reach us directly.",
    };
  }

  return {
    ok: true,
    commit() {
      const at = Date.now();
      record(ipKey, at);
      record(numKey, at);
      record(globalKey, at);
    },
  };
}

/** Test seam — lets the smoke test start from a clean slate. */
export function __resetRateLimit() {
  hits.clear();
  lastSweep = 0;
}

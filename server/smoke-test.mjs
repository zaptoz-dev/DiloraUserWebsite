/**
 * End-to-end smoke test for /api/demo-call with Bolna stubbed out, so the
 * route, validation, rate limiter and payload shape can be verified without
 * placing (or paying for) a real call.
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SERVER_ENTRY = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "index.js"
);

const PORT = 3999;
const BASE = `http://127.0.0.1:${PORT}`;

/**
 * Stub api.bolna.ai by intercepting fetch inside the server process.
 *
 * POST /call always succeeds. GET /executions/{id} returns "rescheduled" for
 * an execution id containing "RESCHED", so confirmCallWasPlaced's post-place
 * check can be exercised deterministically — any other id looks like a call
 * still in progress, matching the ordinary happy path.
 */
const bootstrap = `
  const realFetch = globalThis.fetch;
  globalThis.__calls = [];
  globalThis.fetch = async (url, init) => {
    const urlStr = String(url);
    if (urlStr.includes("api.bolna.ai/call")) {
      const body = JSON.parse(init.body);
      globalThis.__calls.push({ body, auth: init.headers.Authorization });
      console.log("STUB_BOLNA " + JSON.stringify({ body, auth: init.headers.Authorization }));
      const suffix = body.recipient_phone_number.includes("77777") ? "_RESCHED" : "";
      return new Response(JSON.stringify({
        message: "Call initiated", status: "queued",
        execution_id: "exec_" + globalThis.__calls.length + suffix,
      }), { status: 200, headers: { "content-type": "application/json" } });
    }
    if (urlStr.includes("api.bolna.ai/executions/")) {
      const id = urlStr.split("/executions/")[1];
      if (id.includes("RESCHED")) {
        return new Response(JSON.stringify({
          status: "rescheduled", scheduled_at: "2026-09-04T03:29:59.746590+00:00",
        }), { status: 200, headers: { "content-type": "application/json" } });
      }
      return new Response(JSON.stringify({ status: "in-progress" }), {
        status: 200, headers: { "content-type": "application/json" },
      });
    }
    return realFetch(url, init);
  };
  await import(${JSON.stringify(SERVER_ENTRY)});
`;

function spawnServer(port, extraEnv) {
  const child = spawn("node", ["--input-type=module", "--eval", bootstrap], {
    env: { ...process.env, PORT: String(port), HOST: "127.0.0.1",
           BOLNA_API_KEY: "test_key_abc", BOLNA_AGENT_ID: "agent_test_123",
           DEMO_MAX_PER_IP_PER_HOUR: "3", DEMO_MAX_PER_NUMBER_PER_HOUR: "1",
           DEMO_CONFIRM_DELAY_MS: "20", ...extraEnv },
    stdio: ["ignore", "pipe", "pipe"],
  });
  child.stdout.on("data", (d) => process.stdout.write("  [server] " + d));
  child.stderr.on("data", (d) => process.stdout.write("  [server:err] " + d));
  return child;
}

// Fixed at midday IST so the happy path and rate limiter run regardless of
// when this test actually executes.
const child = spawnServer(PORT, { DEMO_TEST_IST_HOUR: "12" });

// Wait for listen.
for (let i = 0; i < 50; i++) {
  try { await fetch(`${BASE}/api/health`); break; } catch { await new Promise(r => setTimeout(r, 100)); }
}

let pass = 0, fail = 0;
async function check(label, fn) {
  try { await fn(); console.log(`  PASS  ${label}`); pass++; }
  catch (e) { console.log(`  FAIL  ${label}\n        ${e.message}`); fail++; }
}
const assert = (cond, msg) => { if (!cond) throw new Error(msg); };

async function post(body, headers = {}) {
  const res = await fetch(`${BASE}/api/demo-call`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: await res.json() };
}

const good = { name: "Aarav Sharma", company: "Northline", countryCode: "+91",
               phone: "98765 43210", email: "a@northline.com", intent: "sales", notes: "Hindi + Marathi" };

console.log("\n--- health ---");
await check("health reports Bolna configured", async () => {
  const r = await (await fetch(`${BASE}/api/health`)).json();
  assert(r.ok && r.bolnaConfigured === true, JSON.stringify(r));
  assert(!JSON.stringify(r).includes("test_key_abc"), "health leaked the API key!");
});

console.log("\n--- validation ---");
await check("rejects a junk phone number", async () => {
  const r = await post({ ...good, phone: "123" });
  assert(r.status === 400 && r.body.field === "phone", JSON.stringify(r));
});
await check("rejects a missing name", async () => {
  const r = await post({ ...good, phone: "9111111111", name: "" });
  assert(r.status === 400 && r.body.field === "name", JSON.stringify(r));
});
await check("rejects a malformed email", async () => {
  const r = await post({ ...good, phone: "9222222222", email: "not-an-email" });
  assert(r.status === 400 && r.body.field === "email", JSON.stringify(r));
});

console.log("\n--- happy path ---");
await check("places a call and returns the execution id", async () => {
  const r = await post(good);
  assert(r.status === 200, JSON.stringify(r));
  assert(r.body.executionId === "exec_1", JSON.stringify(r.body));
  assert(r.body.status === "queued", JSON.stringify(r.body));
});

console.log("\n--- rate limiting ---");
await check("same number is blocked on the second attempt", async () => {
  const r = await post(good);
  assert(r.status === 429, `expected 429, got ${r.status} ${JSON.stringify(r.body)}`);
  assert(/already been sent/i.test(r.body.error), r.body.error);
});
await check("second distinct number from same IP allowed", async () => {
  const r = await post({ ...good, phone: "9333333333" });
  assert(r.status === 200, JSON.stringify(r));
});
// Only successful calls burn allowance, so at this point 2 have committed
// (the 400s and the number-limit 429 correctly did not). The 3rd is the last
// one the per-IP hourly cap of 3 permits.
await check("third committed call from same IP is still allowed", async () => {
  const r = await post({ ...good, phone: "9444444444" });
  assert(r.status === 200, `expected 200, got ${r.status} ${JSON.stringify(r.body)}`);
});
await check("fourth committed call from same IP hits the per-IP hourly cap", async () => {
  const r = await post({ ...good, phone: "9555555555" });
  assert(r.status === 429, `expected 429, got ${r.status} ${JSON.stringify(r.body)}`);
  assert(/from here in the last hour/i.test(r.body.error), r.body.error);
});
await check("a blocked call did not burn Bolna quota (no extra execution)", async () => {
  const r = await post({ ...good, phone: "9666666666" });
  assert(r.status === 429, `expected 429, got ${r.status}`);
});

console.log("\n--- reschedule detection ---");
// Own server/port so this doesn't compete with the rate-limit tests above for
// the shared per-IP quota.
const reschedPort = PORT + 2;
const reschedBase = `http://127.0.0.1:${reschedPort}`;
const reschedChild = spawnServer(reschedPort, { DEMO_TEST_IST_HOUR: "12" });
for (let i = 0; i < 50; i++) {
  try { await fetch(`${reschedBase}/api/health`); break; } catch { await new Promise(r => setTimeout(r, 100)); }
}
await check("a call Bolna silently reschedules is reported honestly, not as 'calling now'", async () => {
  // "77777" in the phone number is the stub's signal to report this execution
  // as rescheduled when confirmCallWasPlaced polls it.
  const res = await fetch(`${reschedBase}/api/demo-call`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...good, phone: "9777777777" }),
  });
  const body = await res.json();
  assert(res.status === 200, JSON.stringify({ status: res.status, body }));
  assert(body.status === "rescheduled", JSON.stringify(body));
  assert(/8:59 AM IST/.test(body.message), body.message);
  assert(!/dialling|calling you now/i.test(body.message), body.message);
});
reschedChild.kill();

console.log("\n--- India calling-hours guard ---");
const outOfHoursPort = PORT + 1;
const outOfHoursBase = `http://127.0.0.1:${outOfHoursPort}`;
const outOfHoursChild = spawnServer(outOfHoursPort, { DEMO_TEST_IST_HOUR: "22" }); // 10 PM IST
for (let i = 0; i < 50; i++) {
  try { await fetch(`${outOfHoursBase}/api/health`); break; } catch { await new Promise(r => setTimeout(r, 100)); }
}
await check("an Indian number is rejected outside the 9 AM-9 PM IST window", async () => {
  const res = await fetch(`${outOfHoursBase}/api/demo-call`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...good, phone: "9888888888" }),
  });
  const body = await res.json();
  assert(res.status === 422, JSON.stringify({ status: res.status, body }));
  assert(/9 AM and 9 PM IST/.test(body.error), body.error);
});
await check("a non-Indian number is unaffected by the India calling-hours guard", async () => {
  const res = await fetch(`${outOfHoursBase}/api/demo-call`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...good, countryCode: "+44", phone: "7700 900123" }),
  });
  const body = await res.json();
  assert(res.status === 200, JSON.stringify({ status: res.status, body }));
});
outOfHoursChild.kill();

console.log("\n--- static site ---");
await check("serves the SPA at /", async () => {
  const res = await fetch(`${BASE}/`);
  const html = await res.text();
  assert(res.status === 200 && html.includes("<div id=\"root\""), `status ${res.status}`);
});
await check("unknown path falls through to index.html", async () => {
  const res = await fetch(`${BASE}/pricing`);
  assert(res.status === 200, `status ${res.status}`);
});
await check("unknown /api path 404s rather than serving HTML", async () => {
  const res = await fetch(`${BASE}/api/nope`);
  assert(res.status === 404, `status ${res.status}`);
});

child.kill();
console.log(`\n${fail === 0 ? "ALL PASSED" : "FAILURES"} — ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);

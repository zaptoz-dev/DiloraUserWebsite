/**
 * Manual end-to-end check of the live voice loop. No browser involved.
 *
 *   node --env-file=.env server/voice/verify-live.mjs
 *
 * Boots the real server, holds an actual conversation with it over the real
 * WebSocket, and asserts the whole chain: greeting audio, transcription of
 * caller speech, coherent replies, spoken audio back, and barge-in.
 *
 * Speech is generated locally by macOS `say` and streamed at realtime pace,
 * because the endpointing logic keys off wall-clock silence — blasting the audio
 * in one go would never trigger a turn.
 *
 * DELIBERATELY NOT part of `npm run test:smoke`. It calls Deepgram, Bedrock and
 * Polly for real, so every run costs credits and needs live network. The smoke
 * suite stays free and offline; this is the thing you run by hand after touching
 * anything under server/voice/.
 *
 * Requires macOS (`say`). On Linux, swap speechPcm() for espeak or a fixture.
 */

import WebSocket from "ws";
import { execFileSync } from "node:child_process";
import { readFileSync, unlinkSync } from "node:fs";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";

const PORT = 4321;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const SAMPLE_RATE = 16000;
const FRAME_SAMPLES = 320; // 20ms
const FRAME_BYTES = FRAME_SAMPLES * 2;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function speechPcm(sentence) {
  const out = path.join(tmpdir(), `audeora-e2e-${Date.now()}.wav`);
  execFileSync("say", ["-o", out, "--data-format=LEI16@16000", sentence]);
  const wav = readFileSync(out);
  unlinkSync(out);
  const idx = wav.indexOf(Buffer.from("data"));
  return wav.subarray(idx + 8);
}

// ---------------------------------------------------------------------------
// Boot the real server
// ---------------------------------------------------------------------------
const server = spawn(
  process.execPath,
  ["--env-file=.env", "server/index.js"],
  { env: { ...process.env, PORT: String(PORT), HOST: "127.0.0.1" }, stdio: "pipe" }
);
const serverLog = [];
server.stdout.on("data", (d) => serverLog.push(d.toString()));
server.stderr.on("data", (d) => serverLog.push(d.toString()));

const fail = (message) => {
  console.error(`\nFAIL: ${message}`);
  console.error("\n--- server log ---");
  console.error(serverLog.join(""));
  server.kill();
  process.exit(1);
};

// Wait for warm-up to finish so the first turn isn't paying for handshakes.
for (let i = 0; i < 60; i++) {
  await sleep(500);
  if (serverLog.join("").includes("warm-up in")) break;
}
const warmLine = serverLog.join("").match(/\[voice\] warm-up.*/)?.[0];
console.log(`server up — ${warmLine ?? "(no warm-up line)"}`);

// ---------------------------------------------------------------------------
// Origin enforcement must actually work
// ---------------------------------------------------------------------------
await new Promise((resolve) => {
  const bad = new WebSocket(`ws://127.0.0.1:${PORT}/api/voice/stream`, {
    origin: "https://evil.example.com",
  });
  bad.on("open", () => {
    fail("origin allowlist did not reject a foreign origin");
  });
  bad.on("error", () => {
    console.log("origin check: foreign origin rejected \u2713");
    resolve();
  });
});

// ---------------------------------------------------------------------------
// The conversation
// ---------------------------------------------------------------------------
const events = [];
const transcripts = [];
let audioBytes = 0;
let ttfbMs = null;
let persona = null;
let currentState = null;

const ws = new WebSocket(`ws://127.0.0.1:${PORT}/api/voice/stream`, {
  origin: ORIGIN,
});

const opened = new Promise((resolve, reject) => {
  ws.on("open", resolve);
  ws.on("error", reject);
});

ws.on("message", (data, isBinary) => {
  if (isBinary) {
    audioBytes += data.length;
    return;
  }
  const message = JSON.parse(data.toString());
  events.push(message.type);
  if (message.type === "ready") persona = message.persona;
  if (message.type === "state") currentState = message.state;
  if (message.type === "speaking" && ttfbMs === null) ttfbMs = message.ttfbMs;
  if (message.type === "transcript") {
    transcripts.push(message);
    console.log(
      `  ${message.role === "user" ? "caller" : "agent "} | ${message.text}` +
        (message.timings
          ? `   (audio=${message.timings.audioMs ?? "-"}ms stt=${message.timings.sttMs ?? "-"}ms llm=${message.timings.llmMs ?? "-"}ms)`
          : "")
    );
  }
  if (message.type === "error") console.log(`  [error] ${message.message}`);
});

await opened;
console.log("\nconnected — starting retail persona");
ws.send(JSON.stringify({ type: "start", personaId: "retail" }));

/** Stream PCM at realtime, which is what the server's timing logic expects. */
async function sendRealtime(pcm) {
  for (let offset = 0; offset < pcm.length; offset += FRAME_BYTES) {
    if (ws.readyState !== WebSocket.OPEN) return;
    ws.send(pcm.subarray(offset, offset + FRAME_BYTES), { binary: true });
    await sleep(20);
  }
}

const silence = Buffer.alloc(FRAME_BYTES);
async function sendSilence(ms) {
  for (let elapsed = 0; elapsed < ms; elapsed += 20) {
    if (ws.readyState !== WebSocket.OPEN) return;
    ws.send(silence, { binary: true });
    await sleep(20);
  }
}

// Let the greeting play out before talking over it.
await sleep(6000);
const greetingAudio = audioBytes;
console.log(
  `\ngreeting: ${greetingAudio} bytes (${(greetingAudio / 32000).toFixed(2)}s audio), ttfb=${ttfbMs}ms`
);

const turns = [
  "I want to return a shirt I bought last week.",
  "My order number is four five six seven.",
];

for (const [i, sentence] of turns.entries()) {
  console.log(`\nturn ${i + 1}: speaking "${sentence}"`);
  const before = audioBytes;
  await sendRealtime(speechPcm(sentence));
  // Past the 650ms endpoint threshold, then room for STT + LLM + TTS.
  await sendSilence(1200);
  const deadline = Date.now() + 15000;
  while (audioBytes === before && Date.now() < deadline) {
    await sendSilence(200);
  }
  await sleep(2500);
}

// ---------------------------------------------------------------------------
// Barge-in: talk over the agent *while it is still speaking* and confirm it
// stops. Sleeping a fixed amount made this flaky — once STT got faster the
// agent had already finished, so there was nothing left to interrupt. Drive it
// off the state events instead.
// ---------------------------------------------------------------------------
console.log("\nbarge-in: waiting for the agent to start speaking");
const beforeInterrupt = events.filter((e) => e === "clear").length;

const interruptSpeech = speechPcm(
  "Actually wait, forget all that, I have a completely different question for you."
);

let sawClear = false;
currentState = null;
await sendRealtime(speechPcm("What is your refund policy exactly?"));

// Wait for the reply to begin playing.
const speakDeadline = Date.now() + 20000;
while (currentState !== "speaking" && Date.now() < speakDeadline) {
  await sendSilence(100);
}

if (currentState !== "speaking") {
  console.log("  (agent never entered speaking state - cannot test barge-in)");
} else {
  console.log("  agent is speaking, talking over it now");
  // Past the server's barge-in grace window, which exists so the agent does not
  // interrupt itself on its own leaked audio.
  await sendSilence(600);
  await sendRealtime(interruptSpeech);
  const clearDeadline = Date.now() + 4000;
  while (
    events.filter((e) => e === "clear").length <= beforeInterrupt &&
    Date.now() < clearDeadline
  ) {
    await sendSilence(100);
  }
  sawClear = events.filter((e) => e === "clear").length > beforeInterrupt;
}
await sendSilence(4000);

ws.send(JSON.stringify({ type: "stop" }));
await sleep(600);
ws.close();
await sleep(300);

// ---------------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------------
console.log("\n" + "=".repeat(60));
const userTurns = transcripts.filter((t) => t.role === "user");
const agentTurns = transcripts.filter((t) => t.role === "agent");

const checks = [
  ["session opened with a persona", Boolean(persona?.agentName)],
  ["greeting audio was produced", greetingAudio > 10000],
  ["caller speech was transcribed", userTurns.length >= 1],
  ["agent replied in words", agentTurns.length >= 2],
  ["agent replies were spoken as audio", audioBytes > greetingAudio * 1.5],
  ["state events were emitted", events.includes("state")],
  ["barge-in cleared playback", sawClear],
  ["session ended cleanly", events.includes("ended")],
];

let failed = 0;
for (const [label, ok] of checks) {
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${label}`);
  if (!ok) failed++;
}

console.log("");
console.log(`  persona:        ${persona?.agentName} at ${persona?.company}`);
console.log(`  caller turns:   ${userTurns.length}`);
console.log(`  agent turns:    ${agentTurns.length}`);
console.log(`  total audio:    ${audioBytes} bytes (${(audioBytes / 32000).toFixed(1)}s)`);
console.log(`  tts ttfb:       ${ttfbMs}ms`);
const sttTimes = transcripts.map((t) => t.timings?.sttMs).filter(Boolean);
const llmTimes = transcripts.map((t) => t.timings?.llmMs).filter(Boolean);
if (sttTimes.length) {
  console.log(`  stt:            ${sttTimes.join(", ")} ms`);
}
if (llmTimes.length) {
  console.log(`  llm:            ${llmTimes.join(", ")} ms`);
}
console.log("");

if (failed) {
  console.error("--- server log ---");
  console.error(serverLog.join(""));
}
server.kill();
console.log(failed ? `${failed} CHECK(S) FAILED` : "ALL CHECKS PASSED");
process.exit(failed ? 1 : 0);

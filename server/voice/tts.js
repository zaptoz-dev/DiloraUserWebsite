/**
 * Text-to-speech across interchangeable providers.
 *
 * Every provider exposes the same shape — an async generator of raw PCM chunks
 * at SAMPLE_RATE — so the conversation loop never knows or cares which one is
 * speaking. Chunks are yielded as they arrive rather than buffered whole, so
 * playback starts on the first one; waiting for a complete utterance would add
 * most of a second of silence to every turn.
 *
 * The indirection is not speculative. In the space of this project Murf ran out
 * of characters mid-build and Sarvam replaced it, with Polly underneath both.
 * A provider is one env var, not a refactor.
 *
 * Order and measured cost live in `ttsChain` in config.js.
 *
 * Failure handling: a provider that throws before yielding any bytes is latched
 * off for a few minutes and the chain moves on. Latching matters because an
 * out-of-quota vendor answers *fast* — without it every turn would pay a pointless
 * round trip and log an error. Re-probing on a timer rather than latching off
 * permanently means a topped-up account recovers on its own.
 */

import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { SAMPLE_RATE, tts, ttsChain } from "./config.js";
import * as sarvam from "./sarvam.js";

const MURF_STREAM_URL = "https://global.api.murf.ai/v1/speech/stream";
const MAX_TTS_CHARS = 1500;
const LATCH_MS = 5 * 60 * 1000;

let pollyClient = null;
function getPolly() {
  if (!pollyClient) pollyClient = new PollyClient({ region: tts.polly.region });
  return pollyClient;
}

// ---------------------------------------------------------------------------
// Latch
// ---------------------------------------------------------------------------
/** @type {Map<string, {until: number, error: string}>} */
const latched = new Map();

function isLatched(name) {
  const entry = latched.get(name);
  if (!entry) return false;
  if (Date.now() >= entry.until) {
    latched.delete(name);
    return false;
  }
  return true;
}

function latchOff(name, error) {
  latched.set(name, { until: Date.now() + LATCH_MS, error });
  console.warn(
    `[voice/tts] ${name} unavailable (${error}); skipping it for ${LATCH_MS / 60000} minutes`
  );
}

/**
 * Strip anything that should never be read aloud.
 *
 * The model is told to answer in plain conversational prose, but it still
 * occasionally emits a control token or a stray markdown artifact, and a TTS
 * engine will happily pronounce "asterisk asterisk" or "END_CALL".
 */
export function sanitizeForSpeech(text) {
  if (!text) return "";
  return text
    .replace(/\[END_CALL\]/gi, "")
    .replace(/[*_`#]+/g, "")
    .replace(/^\s*[-•]\s*/gm, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_TTS_CHARS);
}

// ---------------------------------------------------------------------------
// Providers
// ---------------------------------------------------------------------------

/**
 * Polly. `OutputFormat: "pcm"` gives signed 16-bit LE mono — byte-for-byte what
 * the browser expects, with no decode step.
 *
 * This format accepts only 8000 or 16000 Hz; 24000 raises
 * InvalidSampleRateException, which is why SAMPLE_RATE is capped at 16 kHz.
 */
async function* pollyStream(text) {
  const output = await getPolly().send(
    new SynthesizeSpeechCommand({
      Text: text,
      OutputFormat: "pcm",
      SampleRate: String(SAMPLE_RATE),
      VoiceId: tts.polly.voiceId,
      Engine: tts.polly.engine,
    })
  );
  if (!output.AudioStream) return;

  const reader = output.AudioStream.transformToWebStream().getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value?.length) yield Buffer.from(value);
  }
}

/**
 * Murf. Returns header-less raw PCM over chunked transfer for `format: "PCM"`;
 * the RIFF check is defensive only, never actually observed on this endpoint.
 */
async function* murfStream(text) {
  const apiKey = tts.murf.apiKey();
  if (!apiKey) throw new Error("MURF_API_KEY is not set");

  const response = await fetch(MURF_STREAM_URL, {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      voiceId: tts.murf.voiceId,
      model: tts.murf.model,
      format: "PCM",
      sampleRate: SAMPLE_RATE,
      channelType: "MONO",
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Murf HTTP ${response.status}: ${detail.slice(0, 160)}`);
  }

  const reader = response.body.getReader();
  let first = true;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value?.length) continue;
    let chunk = Buffer.from(value);
    if (first) {
      first = false;
      if (chunk.subarray(0, 4).toString("ascii") === "RIFF" && chunk.length > 44) {
        chunk = chunk.subarray(44);
      }
    }
    yield chunk;
  }
}

/** name -> { stream(text, options), available() } */
const providers = {
  sarvam: {
    stream: (text, options) => sarvam.stream(text, options),
    available: () => Boolean(tts.sarvam.apiKey()),
  },
  polly: {
    stream: (text) => pollyStream(text),
    // Credentials come from the standard AWS chain, which Bedrock needs anyway.
    available: () => true,
  },
  murf: {
    stream: (text) => murfStream(text),
    available: () => Boolean(tts.murf.apiKey()),
  },
};

/** Providers to try, in order, for this request. */
function candidates() {
  if (tts.provider !== "auto") {
    // Pinned explicitly: honour it and do not fall back, so a misconfiguration
    // is loud rather than silently papered over by a different voice.
    return providers[tts.provider] ? [tts.provider] : [];
  }
  return ttsChain.filter(
    (name) => providers[name] && providers[name].available() && !isLatched(name)
  );
}

// ---------------------------------------------------------------------------
// Public interface
// ---------------------------------------------------------------------------

/**
 * Speak `rawText`, yielding PCM chunks as they arrive.
 *
 * @param {string} rawText
 * @param {object} [options]
 * @param {string} [options.voice] Provider-specific voice id (a Sarvam speaker).
 * @returns {AsyncGenerator<Buffer>}
 */
export async function* synthesize(rawText, options = {}) {
  const text = sanitizeForSpeech(rawText);
  if (!text) return;

  const chain = candidates();
  if (!chain.length) {
    console.error("[voice/tts] no TTS provider is available");
    return;
  }

  for (const [index, name] of chain.entries()) {
    const isLast = index === chain.length - 1;
    let yielded = false;

    try {
      for await (const chunk of providers[name].stream(text, options)) {
        if (chunk?.length) {
          yielded = true;
          yield chunk;
        }
      }
    } catch (error) {
      if (yielded) {
        // Already speaking when it broke. Switching providers mid-utterance
        // would splice two different voices together, which sounds far worse
        // than a truncated sentence.
        console.error(`[voice/tts] ${name} failed mid-stream: ${error.message}`);
        return;
      }
      if (tts.provider !== "auto" || isLast) {
        console.error(`[voice/tts] ${name} failed: ${error.message}`);
        return;
      }
      latchOff(name, error.message);
      continue;
    }

    if (yielded) return;

    // 200 with an empty body. Treat as a failure so something still gets said.
    if (tts.provider !== "auto" || isLast) return;
    latchOff(name, "empty response");
  }
}

/** Which provider a call right now would use. Surfaced on /api/voice/health. */
export function activeProvider() {
  return candidates()[0] ?? null;
}

export function ttsStatus() {
  return {
    // "mode", not "configured" — the top level already reports a boolean
    // `configured`, and two different meanings under one name is a trap.
    mode: tts.provider,
    chain: ttsChain,
    active: activeProvider(),
    latched: Object.fromEntries(
      [...latched.entries()].map(([name, entry]) => [
        name,
        { secondsRemaining: Math.max(0, Math.round((entry.until - Date.now()) / 1000)), error: entry.error },
      ])
    ),
  };
}

/**
 * Pay the TLS/SDK setup cost at boot rather than on the first visitor's first
 * word.
 *
 * Runs the real `synthesize()` path rather than probing one provider directly.
 * That matters for honesty as much as latency: if the leading provider is out of
 * quota, this is what latches it off, so /api/voice/health reports the provider
 * that would actually speak instead of the one we hoped would.
 */
export async function warmUp() {
  try {
    for await (const chunk of synthesize("Hi")) {
      if (chunk.length) return true;
    }
    return false;
  } catch {
    return false;
  }
}

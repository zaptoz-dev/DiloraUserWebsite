/**
 * Sarvam AI text-to-speech.
 *
 * Indian-language TTS, and the primary voice for this demo now that the Murf
 * balance is exhausted. Its speakers sound markedly more natural for an
 * India-facing product than a US English voice does.
 *
 * API
 *   POST {SARVAM_API_URL}/text-to-speech/stream
 *   Header: api-subscription-key: <key>
 *   Body:  { text, target_language_code, speaker, model,
 *            speech_sample_rate, output_audio_codec, enable_preprocessing }
 *   Response: chunked raw PCM (Content-Type: audio/pcm)
 *
 * ---------------------------------------------------------------------------
 * Three things the main product's implementation gets wrong or does the hard
 * way, all confirmed by measurement against this account:
 *
 * 1. NO FFMPEG NEEDED. The product streams MP3 and pipes it through an ffmpeg
 *    subprocess to get PCM. The streaming endpoint accepts
 *    `output_audio_codec: "linear16"` and returns raw PCM directly, so the whole
 *    subprocess — and a system binary that would have to be installed on the
 *    Graviton box — simply is not required.
 *
 * 2. STREAM, DON'T BATCH. The non-streaming /text-to-speech endpoint measured
 *    ~1580ms median for a single short sentence. The streaming endpoint reaches
 *    first byte in ~429ms. For a conversation that difference is a second of
 *    dead air after every single turn.
 *
 * 3. THE PRODUCT'S SPEAKER LIST IS STALE. Its SARVAM_VOICES map advertises 18
 *    speakers, of which 8 are rejected outright by bulbul:v3
 *    ("Speaker 'X' is not compatible with model bulbul:v3") while 27 valid ones
 *    are missing. The list below is the authoritative set, read back from the
 *    API's own validation error.
 *
 * Also carried over from the product's hard-won notes: only bulbul:v3 is
 * accepted, and `pitch`/`loudness` must never be sent — v3 rejects them.
 * ---------------------------------------------------------------------------
 *
 * Measured alternative: `output_audio_codec: "wav"` reaches first byte ~145ms
 * sooner (median 284ms vs 429ms). Not used, deliberately. WAV means stripping a
 * header mid-stream, and being wrong by an odd number of bytes misaligns every
 * 16-bit sample after it — turning the reply into white noise rather than
 * producing a mild glitch. That is a bad trade for 145ms.
 */

import { SAMPLE_RATE, tts } from "./config.js";

/**
 * Authoritative bulbul:v3 speakers, read back from the API's validation error
 * rather than copied from documentation. Used to fail fast on a typo instead of
 * discovering it as silence mid-conversation.
 */
export const SARVAM_SPEAKERS = new Set([
  "aditya", "ritu", "ashutosh", "priya", "neha", "rahul", "pooja", "rohan",
  "simran", "kavya", "amit", "dev", "ishita", "shreya", "ratan", "varun",
  "manan", "sumit", "roopa", "kabir", "aayan", "shubh", "advait", "anand",
  "tanya", "tarun", "sunny", "mani", "gokul", "vijay", "shruti", "suhani",
  "mohit", "kavitha", "rehan", "soham", "rupali",
]);

/** bulbul:v3 comfortably handles a voice turn; this is a guard, not a real limit. */
const MAX_CHARS = 1500;

export function isValidSpeaker(speaker) {
  return SARVAM_SPEAKERS.has(String(speaker ?? "").trim().toLowerCase());
}

/**
 * Resolve a requested speaker to one the model will actually accept.
 *
 * Falling back loudly matters here: an unknown speaker returns a 400, which
 * would otherwise surface as an agent that simply never speaks.
 */
export function resolveSpeaker(requested) {
  const key = String(requested ?? "").trim().toLowerCase();
  if (SARVAM_SPEAKERS.has(key)) return key;
  if (key) {
    console.warn(
      `[voice/tts] unknown Sarvam speaker "${key}", using "${tts.sarvam.speaker}"`
    );
  }
  return tts.sarvam.speaker;
}

/**
 * Stream PCM for `text`.
 *
 * @param {string} text
 * @param {object} [options]
 * @param {string} [options.speaker] Overrides the configured default.
 * @returns {AsyncGenerator<Buffer>}
 */
export async function* stream(text, { speaker } = {}) {
  const apiKey = tts.sarvam.apiKey();
  if (!apiKey) throw new Error("SARVAM_API_KEY is not set");

  const baseUrl = tts.sarvam.apiUrl.replace(/\/$/, "");
  const response = await fetch(`${baseUrl}/text-to-speech/stream`, {
    method: "POST",
    headers: {
      "api-subscription-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: text.slice(0, MAX_CHARS),
      target_language_code: tts.sarvam.language,
      speaker: resolveSpeaker(speaker),
      // bulbul:v3 only. v1/v2 reject these speakers outright.
      model: "bulbul:v3",
      speech_sample_rate: SAMPLE_RATE,
      // The reason no ffmpeg is needed — raw PCM straight out of the endpoint.
      output_audio_codec: "linear16",
      enable_preprocessing: true,
      // Deliberately no `pitch` and no `loudness`: bulbul:v3 rejects both.
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    // Thrown before any bytes are yielded, so the caller can fall through to
    // another provider cleanly rather than splicing two voices together.
    throw new Error(`Sarvam HTTP ${response.status}: ${detail.slice(0, 200)}`);
  }

  const reader = response.body.getReader();
  /**
   * PCM is 16-bit, so a chunk boundary can land mid-sample. Carrying the odd
   * trailing byte to the next chunk keeps every buffer we emit sample-aligned;
   * emitting it as-is would shift the stream by one byte and the rest of the
   * utterance would decode as noise.
   */
  let carry = Buffer.alloc(0);

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value?.length) continue;

    let chunk = carry.length
      ? Buffer.concat([carry, Buffer.from(value)])
      : Buffer.from(value);

    const aligned = chunk.length - (chunk.length % 2);
    carry = chunk.subarray(aligned);
    if (aligned > 0) yield chunk.subarray(0, aligned);
  }
}

/** Open the connection and prove the key works, before a visitor depends on it. */
export async function warmUp() {
  if (!tts.sarvam.apiKey()) return false;
  try {
    for await (const chunk of stream("Hi")) {
      if (chunk.length) return true;
    }
    return false;
  } catch (error) {
    console.warn(`[voice/tts] Sarvam warm-up failed: ${error.message}`);
    return false;
  }
}

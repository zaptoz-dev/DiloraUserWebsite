/**
 * ElevenLabs text-to-speech.
 *
 * API
 *   POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/stream?output_format=pcm_16000
 *   Header: xi-api-key: <key>
 *   Body:   { text, model_id }
 *   Response: chunked raw PCM, signed 16-bit LE mono, 16 kHz (Content-Type: audio/pcm)
 *
 * `pcm_16000` matches the pipeline's sample rate exactly, so there is no
 * resampling, no container to strip and no decoder. Verified: the body has no
 * RIFF header and the byte count matches the audio's duration at 16 kHz.
 *
 * Model choice, measured on this endpoint with the account's Indian voices
 * (9 calls each, warm connection):
 *
 *   eleven_v4_turbo     p50  249ms   p90 2666ms
 *   eleven_v4           p50 1510ms   p90 1912ms
 *   eleven_flash_v2_5   p50  185ms   p90  290ms
 *
 * v4 Turbo is the default. Full v4 adds ~1.3s before every reply starts, which
 * would make TTS the slowest hop in the turn. Flash v2.5 is a little faster
 * still and is one env var away (ELEVENLABS_MODEL) if latency ever matters more
 * than v4-generation voice quality.
 */

import { SAMPLE_RATE, tts } from "./config.js";

const BASE_URL = "https://api.elevenlabs.io/v1/text-to-speech";

/** Matches the pipeline rate; ElevenLabs names formats by rate. */
const OUTPUT_FORMAT = `pcm_${SAMPLE_RATE}`;

const MAX_CHARS = 1500;

/**
 * Stream PCM for `text`.
 *
 * @param {string} text
 * @param {object} [options]
 * @param {string} [options.voiceId] Overrides the configured default voice.
 * @returns {AsyncGenerator<Buffer>}
 */
export async function* stream(text, { voiceId } = {}) {
  const apiKey = tts.elevenlabs.apiKey();
  if (!apiKey) throw new Error("ELEVEN_LABS_API_KEY is not set");

  const voice = voiceId || tts.elevenlabs.voiceId;
  const url = `${BASE_URL}/${encodeURIComponent(voice)}/stream?output_format=${OUTPUT_FORMAT}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/pcm",
    },
    body: JSON.stringify({
      text: text.slice(0, MAX_CHARS),
      model_id: tts.elevenlabs.model,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    // Thrown before any bytes are yielded, so the chain can fall through to the
    // next provider cleanly instead of splicing two voices together. 401 (bad
    // key), 402/quota (out of characters) and 429 (rate limit) all land here.
    throw new Error(`ElevenLabs HTTP ${response.status}: ${detail.slice(0, 200)}`);
  }

  const reader = response.body.getReader();
  /**
   * 16-bit samples: a chunk boundary can fall mid-sample. Carry the odd byte
   * forward so every emitted buffer stays sample-aligned; emitting it as-is
   * shifts the stream by one byte and the rest of the reply decodes as noise.
   */
  let carry = Buffer.alloc(0);

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value?.length) continue;

    const chunk = carry.length
      ? Buffer.concat([carry, Buffer.from(value)])
      : Buffer.from(value);

    const aligned = chunk.length - (chunk.length % 2);
    carry = chunk.subarray(aligned);
    if (aligned > 0) yield chunk.subarray(0, aligned);
  }
}

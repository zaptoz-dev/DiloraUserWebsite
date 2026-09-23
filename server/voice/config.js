/**
 * Voice-demo configuration.
 *
 * Every number in here was picked from a measurement, not a guess — the probe
 * results are recorded alongside each one so a future change is an informed
 * one. Nothing here is secret; the credentials themselves stay in process.env
 * and are only read at call time by the service modules.
 */

const num = (value, fallback) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

// ---------------------------------------------------------------------------
// Audio format
//
// The main product runs the whole pipeline at 8 kHz because Exotel telephony
// demands it. This is a browser, so there is no telephony leg and no reason to
// inherit that ceiling: 16 kHz measurably improves Deepgram accuracy and sounds
// far less muffled, which matters on a page where the voice *is* the product.
//
// 16 kHz is also the hard ceiling, not a preference — Polly's `pcm` output
// format accepts only 8000 and 16000 and raises InvalidSampleRateException for
// 24000 (verified). Both directions use the same rate to keep the maths simple.
// ---------------------------------------------------------------------------
export const SAMPLE_RATE = 16000;
export const BYTES_PER_SAMPLE = 2; // signed 16-bit LE mono
export const BYTES_PER_SECOND = SAMPLE_RATE * BYTES_PER_SAMPLE; // 32000

/** Milliseconds of audio a byte count represents. */
export const bytesToMs = (bytes) => (bytes / BYTES_PER_SECOND) * 1000;

// ---------------------------------------------------------------------------
// Turn-taking
// ---------------------------------------------------------------------------
export const turn = {
  /**
   * How long a pause ends the caller's turn.
   *
   * The product uses 950ms (500 silence + 450 "linear delay") to absorb
   * telephony jitter and packet timing slop. Browser audio arrives through an
   * AudioWorklet with none of that, so the extra grace buys nothing but dead
   * air. 650ms is long enough to survive a mid-sentence breath and noticeably
   * snappier than the phone path.
   */
  silenceMs: num(process.env.VOICE_SILENCE_MS, 650),

  /**
   * RMS amplitude above which a frame counts as speech. Carried over from the
   * product's tuned value; it is an amplitude measure so it transfers across
   * sample rates unchanged.
   */
  speechRmsThreshold: num(process.env.VOICE_SPEECH_RMS, 800),

  /**
   * Utterances shorter than this are dropped without calling Deepgram — a
   * click, a cough, a door. The product uses a full second, which also
   * swallows real one-word answers ("yes", "sure"); 350ms keeps those while
   * still filtering noise.
   */
  minUtteranceBytes: Math.round(0.35 * BYTES_PER_SECOND),

  /**
   * Hard cap on a single utterance. Without it, a caller who never pauses (or
   * a stuck-open mic in a noisy room) grows the buffer without bound and we
   * eventually post a huge body to Deepgram.
   */
  maxUtteranceBytes: Math.round(20 * BYTES_PER_SECOND),

  /**
   * While waiting for the caller to start, keep a rolling window of recent
   * audio. VAD only fires once speech is already underway, so without this the
   * first syllable is always missing from the transcript.
   */
  preSpeechBufferBytes: Math.round(0.4 * BYTES_PER_SECOND),

  /** Tick interval for the endpointing/timeout checks. */
  tickMs: 30,
};

// ---------------------------------------------------------------------------
// Barge-in
// ---------------------------------------------------------------------------
export const bargeIn = {
  /**
   * Ignore input for this long after the agent starts talking. Echo
   * cancellation is imperfect and the agent's own first syllable often leaks
   * back through the mic; without a grace window it interrupts itself
   * immediately.
   */
  graceMs: num(process.env.VOICE_BARGEIN_GRACE_MS, 500),

  /**
   * Consecutive above-threshold frames required to count as a real
   * interruption rather than a cough or a keyboard. At ~20ms per frame this is
   * roughly 100ms of sustained speech.
   */
  minFrames: num(process.env.VOICE_BARGEIN_MIN_FRAMES, 5),

  /** A frame must be this much louder than the speech floor to interrupt. */
  rmsThreshold: num(process.env.VOICE_BARGEIN_RMS, 1100),
};

// ---------------------------------------------------------------------------
// Playback pacing
// ---------------------------------------------------------------------------
export const playback = {
  /**
   * Audio is written to the socket in small chunks with a pause between them
   * rather than in one blast. The pause is the whole point: it leaves the
   * server able to abandon the rest of an utterance mid-sentence when the
   * caller interrupts. Blast it all at once and barge-in has nothing left to
   * cancel — the client would keep playing audio the server already gave up on.
   */
  chunkBytes: Math.round(0.1 * BYTES_PER_SECOND), // 100ms of audio

  /**
   * Sent at ~4x realtime, so the client always has a healthy scheduling buffer
   * while the server still holds enough back to stay interruptible.
   */
  chunkDelayMs: 25,

  /**
   * Added to the computed audio duration when estimating when the caller has
   * actually finished *hearing* a reply. Sending finishes well before playback
   * does, so "am I still speaking?" has to be answered from a time estimate,
   * not from whether the write loop has returned.
   */
  tailPaddingMs: 400,
};

// ---------------------------------------------------------------------------
// Session limits
// ---------------------------------------------------------------------------
export const limits = {
  enabled: (process.env.VOICE_DEMO_ENABLED ?? "true") !== "false",
  maxPerIpPerHour: num(process.env.VOICE_MAX_PER_IP_PER_HOUR, 3),
  maxConcurrent: num(process.env.VOICE_MAX_CONCURRENT, 5),
  maxSessionSeconds: num(process.env.VOICE_MAX_SESSION_SECONDS, 90),

  /** Stop paying for an idle session that the browser never closed. */
  hangupAfterSilenceSeconds: num(process.env.VOICE_HANGUP_SILENCE_SEC, 20),

  /** Belt and braces against a runaway loop burning Bedrock credits. */
  maxTurns: num(process.env.VOICE_MAX_TURNS, 25),
};

/**
 * Exact-match origin allowlist. This endpoint spends Deepgram, Polly and
 * Bedrock credits per session with no authentication in front of it, so it must
 * not be callable from any page on the internet. Empty means same-origin only,
 * which is the normal deployment. Never set this to "*".
 */
export const allowedOrigins = (process.env.VOICE_ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""))
  .filter(Boolean);

// ---------------------------------------------------------------------------
// Providers
// ---------------------------------------------------------------------------
export const stt = {
  apiKey: () => process.env.DEEPGRAM_API_KEY,
  /**
   * nova-3. The product's own comparison: nova-2 was mostly fine but spiked to
   * 11-13s at random, and the whisper-* models timed out entirely on this REST
   * endpoint. nova-3 measured 0.3-1.4s consistently.
   */
  model: process.env.DEEPGRAM_STT_MODEL || "nova-3",
  language: process.env.DEEPGRAM_LANGUAGE || "en",
  timeoutMs: num(process.env.DEEPGRAM_TIMEOUT_MS, 12000),
};

export const llm = {
  region: process.env.AWS_REGION || "ap-south-1",
  /**
   * Haiku 4.5 over Sonnet deliberately. Replies here are capped at 1-2
   * sentences, so Sonnet's extra quality has almost nothing to act on while
   * costing several hundred ms per turn — and in a conversation, latency *is*
   * the quality.
   *
   * Region matters more than the model choice: measured 1139ms from
   * ap-south-1 against 1649ms from us-east-1 for the identical request.
   */
  modelId:
    process.env.BEDROCK_MODEL_ID ||
    "global.anthropic.claude-haiku-4-5-20251001-v1:0",
  maxTokens: num(process.env.BEDROCK_MAX_TOKENS, 120),
  temperature: num(process.env.BEDROCK_TEMPERATURE, 0.7),
  /** Trim history so a long session can't grow the prompt without bound. */
  maxHistoryMessages: num(process.env.VOICE_MAX_HISTORY, 20),

  /** Per-attempt ceiling inside the AWS SDK. */
  timeoutMs: num(process.env.BEDROCK_TIMEOUT_MS, 7000),

  /**
   * Hard wall-clock budget for a whole turn, across SDK retries.
   *
   * Measured distribution over 20 calls: p50 1101ms, p90 1628ms, p95 3273ms
   * (the p95 being the cold first call, which boot warm-up now absorbs). One
   * turn was separately observed at 8858ms, so the tail is real though rare.
   * 8s sits comfortably beyond normal variance while still cutting off a turn
   * that has already lost its value.
   */
  deadlineMs: num(process.env.BEDROCK_DEADLINE_MS, 8000),
};

export const tts = {
  /**
   * "auto" walks `ttsChain` in order and uses the first provider that answers,
   * latching a failing one off for a few minutes so a dead vendor is not retried
   * on every single turn. Name a single provider ("sarvam", "polly", "murf") to
   * pin it and disable fallback.
   */
  provider: process.env.VOICE_TTS_PROVIDER || "auto",

  sarvam: {
    apiKey: () => process.env.SARVAM_API_KEY,
    apiUrl: process.env.SARVAM_API_URL || "https://api.sarvam.ai",
    /**
     * Default when a persona does not name its own voice. Sarvam's catalogue
     * happens to include exact matches for several persona names, so most
     * agents get a distinct voice — see personas.js.
     */
    speaker: process.env.SARVAM_SPEAKER || "priya",
    /**
     * en-IN rather than hi-IN: the demo personas speak English, and en-IN keeps
     * Indian names, places and rupee amounts sounding right. Sarvam handles
     * Hinglish in Latin script acceptably under this setting too.
     */
    language: process.env.SARVAM_LANGUAGE || "en-IN",
  },

  polly: {
    region: process.env.POLLY_REGION || process.env.AWS_REGION || "ap-south-1",
    /**
     * Kajal is en-IN neural — a better fit for an India-facing demo than the
     * product's en-US Joanna, and measured just as fast (198ms to first byte
     * from ap-south-1, against 871ms for the same call to us-east-1).
     */
    voiceId: process.env.POLLY_VOICE_ID || "Kajal",
    engine: process.env.POLLY_ENGINE || "neural",
  },

  murf: {
    apiKey: () => process.env.MURF_API_KEY,
    voiceId: process.env.MURF_VOICE_ID || "en-US-natalie",
    /** falcon-2 is the only model the streaming endpoint accepts. */
    model: process.env.MURF_MODEL || "falcon-2",
  },
};

/**
 * Provider preference order for "auto".
 *
 * Sarvam leads because its Indian voices suit this product, and because it is
 * the account with credit on it. Polly sits behind it as the safety net: it runs
 * on the AWS credentials Bedrock already needs, so it cannot be separately
 * out of quota.
 *
 * Measured time-to-first-byte, so the cost of the ordering is explicit:
 *   Polly  Kajal            ~200ms
 *   Sarvam bulbul:v3        ~429ms   (streaming, linear16)
 *   Murf   falcon-2         ~130-300ms  — but currently HTTP 402, out of characters
 *
 * Sarvam is therefore ~230ms slower to first audio than Polly. That is a
 * deliberate trade for voice quality on an India-facing demo. To prefer speed,
 * set VOICE_TTS_PROVIDER=polly.
 *
 * Murf is last rather than removed: the integration is intact and it returns to
 * service on its own the moment the balance is topped up.
 */
export const ttsChain = (
  process.env.VOICE_TTS_CHAIN || "sarvam,polly,murf"
)
  .split(",")
  .map((p) => p.trim().toLowerCase())
  .filter(Boolean);

/** True when the demo has everything it needs to actually run a session. */
export function isConfigured() {
  const hasStt = Boolean(stt.apiKey());
  // AWS credentials are required regardless of the TTS choice, because Bedrock
  // writes the replies. A session without them has nothing to say.
  const hasLlm = Boolean(
    process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
  );
  // Any one working voice is enough. Polly rides on the same AWS credentials, so
  // in practice hasLlm already implies a usable fallback.
  const hasTts = Boolean(tts.sarvam.apiKey()) || hasLlm || Boolean(tts.murf.apiKey());
  return hasStt && hasLlm && hasTts;
}

/** Health-check shape. Reports what is set, never what it is set to. */
export function configSummary() {
  return {
    enabled: limits.enabled,
    configured: isConfigured(),
    sampleRate: SAMPLE_RATE,
    stt: { provider: "deepgram", model: stt.model, keyPresent: Boolean(stt.apiKey()) },
    llm: { provider: "bedrock", model: llm.modelId, region: llm.region },
    tts: {
      provider: tts.provider,
      chain: ttsChain,
      sarvam: {
        keyPresent: Boolean(tts.sarvam.apiKey()),
        speaker: tts.sarvam.speaker,
        language: tts.sarvam.language,
      },
      polly: { voice: tts.polly.voiceId, region: tts.polly.region },
      murf: { keyPresent: Boolean(tts.murf.apiKey()), voice: tts.murf.voiceId },
    },
    limits: {
      maxPerIpPerHour: limits.maxPerIpPerHour,
      maxConcurrent: limits.maxConcurrent,
      maxSessionSeconds: limits.maxSessionSeconds,
    },
  };
}

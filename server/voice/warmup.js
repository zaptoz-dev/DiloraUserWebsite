/**
 * Provider warm-up.
 *
 * Every provider here is reached over HTTPS, and the first request to each pays
 * DNS plus a TLS handshake. Measured on Deepgram that is the difference between
 * ~5.0s and ~0.9s — large enough that the first visitor of the day would
 * conclude the demo is broken. Paying it at boot moves the cost somewhere nobody
 * is waiting.
 *
 * It doubles as a startup check: the log line says plainly whether the
 * credentials and model access actually work, rather than leaving that to be
 * discovered by a visitor mid-conversation.
 *
 * Deliberately fire-and-forget. A provider being unreachable at boot must not
 * stop the website from serving pages — the voice demo is one section of one
 * page, and /api/voice/health reports the real state either way.
 */

import { isConfigured, limits } from "./config.js";
import { warmUp as warmUpStt } from "./deepgram.js";
import { warmUp as warmUpTts, activeProvider } from "./tts.js";
import { warmUp as warmUpLlm } from "./bedrock.js";

export function warmUpVoiceProviders() {
  if (!limits.enabled) {
    console.log("[voice] demo disabled (VOICE_DEMO_ENABLED=false)");
    return;
  }

  if (!isConfigured()) {
    console.warn(
      "WARNING: voice demo is missing credentials — needs DEEPGRAM_API_KEY plus " +
        "AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY (Bedrock writes the replies, and " +
        "Polly is the TTS fallback). /api/voice/stream will refuse sessions."
    );
    return;
  }

  const started = Date.now();
  Promise.allSettled([warmUpStt(), warmUpTts(), warmUpLlm()])
    .then(([stt, tts, llm]) => {
      const ok = (r) => (r.status === "fulfilled" && r.value ? "ok" : "FAILED");
      console.log(
        `[voice] warm-up in ${Date.now() - started}ms — ` +
          `stt=${ok(stt)} tts=${ok(tts)}(${activeProvider()}) llm=${ok(llm)}`
      );
    })
    .catch(() => {
      /* allSettled never rejects; here for safety only. */
    });
}

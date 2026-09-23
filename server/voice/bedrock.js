/**
 * Conversation LLM on AWS Bedrock.
 *
 * Uses InvokeModel with the raw Anthropic-on-Bedrock body rather than the
 * Converse API, matching the main product so prompts and behaviour stay
 * comparable between the two.
 *
 * Not streamed, on purpose. Streaming wins when you can pipe partial output
 * somewhere useful, but replies here are capped at one or two sentences and the
 * TTS call needs a complete clause before it can synthesize anything. For ~25
 * output tokens the bookkeeping buys no real latency.
 *
 * Three quirks below are carried over from the product's hard-won handling
 * rather than rediscovered: the temperature rejection, the `thinking` content
 * block, and the user-first history requirement. Each is commented where it
 * bites.
 */

import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { llm } from "./config.js";

let client = null;
function getClient() {
  if (!client) {
    client = new BedrockRuntimeClient({
      region: llm.region,
      // Per-attempt ceiling. maxAttempts covers a transient throttle, which
      // fails fast and so retries cheaply.
      requestHandler: { requestTimeout: llm.timeoutMs },
      maxAttempts: 2,
    });
  }
  return client;
}

/**
 * Overall deadline across all SDK attempts.
 *
 * Per-attempt timeouts alone do not bound the wall clock a caller experiences:
 * two attempts at the per-attempt ceiling stack up. Measured distribution over
 * 20 calls was p50 1101ms / p90 1628ms, but a single turn was once observed at
 * 8858ms, so the tail is real even if it is rare.
 *
 * A late voice turn has no value — the caller has already been sitting in
 * silence. Past this budget the turn is abandoned and the agent asks them to
 * repeat, which recovers in about a second instead of however long the vendor
 * would have taken.
 */
const OVERALL_DEADLINE_MS = llm.deadlineMs;

/**
 * Models that reject sampling parameters. The Claude 5 family answers a request
 * carrying `temperature` with a ValidationException naming it as deprecated, so
 * the first time we see that we drop the parameter, remember the model, and
 * retry. Memoized because it is a property of the model, not of the request.
 */
const noSamplingParams = new Set();

/**
 * Formatting rules applied to every persona.
 *
 * The length limit is the single most important line here. Left unconstrained,
 * the model writes prose that reads fine and sounds terrible — a caller hears
 * forty seconds of monologue with no opening to reply, and the whole thing stops
 * feeling like a conversation.
 */
export const VOICE_RULES = `You are a voice agent on a live phone call. Speak like a real person, not a chatbot.

LENGTH — THE MOST IMPORTANT RULE:
- Maximum 1-2 short sentences per reply. Never more.
- Stay under 30 words. Going over is a failure.
- Answer, then stop. Do not over-explain or list options.

MANNER:
- Never use bullet points, numbered lists, markdown, or emoji. Everything you say is spoken aloud.
- Ask at most ONE question per reply.
- Use contractions and plain words. Sound relaxed, not scripted.
- Write numbers, prices and times the way a person says them ("two thirty", "fifteen hundred rupees").
- If you did not understand, say so briefly and ask them to repeat.
- Never mention that you are an AI model, or name the systems behind you.

ENDING:
- When the conversation has genuinely finished, end your final reply with [END_CALL].
- Do not end merely because you answered one question.`;

/**
 * Bedrock requires the first message to be from the user. A session opens with
 * the agent's greeting, so history legitimately starts with an assistant turn —
 * this inserts a synthetic opener rather than dropping the greeting, which would
 * make the model repeat itself.
 */
function normalizeHistory(history) {
  const valid = (history ?? []).filter(
    (m) =>
      m &&
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string" &&
      m.content.trim() !== ""
  );

  const trimmed = valid.slice(-llm.maxHistoryMessages);
  if (trimmed.length && trimmed[0].role === "assistant") {
    return [{ role: "user", content: "[Call connected]" }, ...trimmed];
  }
  return trimmed;
}

/** Pull the spoken text out of a response that may lead with a `thinking` block. */
function extractText(body) {
  const blocks = Array.isArray(body?.content) ? body.content : [];
  const textBlock = blocks.find((b) => b?.type === "text");
  return (textBlock?.text ?? "").trim();
}

async function invoke(systemPrompt, messages, { allowSampling, abortSignal }) {
  const payload = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: llm.maxTokens,
    system: systemPrompt,
    messages,
  };
  if (allowSampling) payload.temperature = llm.temperature;

  const response = await getClient().send(
    new InvokeModelCommand({
      modelId: llm.modelId,
      contentType: "application/json",
      body: JSON.stringify(payload),
    }),
    // Cancels in-flight work and stops any further retries, which is what makes
    // the deadline an actual ceiling rather than a suggestion.
    abortSignal ? { abortSignal } : undefined
  );

  return JSON.parse(Buffer.from(response.body).toString("utf8"));
}

/**
 * Generate the agent's next line.
 *
 * @param {object} args
 * @param {string} args.systemPrompt The persona, without the shared voice rules.
 * @param {Array<{role: string, content: string}>} args.history
 * @returns {Promise<{text: string, shouldEnd: boolean, latencyMs: number}>}
 */
export async function generateReply({ systemPrompt, history }) {
  const started = Date.now();
  const fullSystem = `${VOICE_RULES}\n\n--- YOUR ROLE ---\n${systemPrompt}`;
  const messages = normalizeHistory(history);

  if (!messages.length) {
    return { text: "", shouldEnd: false, latencyMs: 0 };
  }

  const deadline = AbortSignal.timeout(OVERALL_DEADLINE_MS);

  let body;
  try {
    body = await invoke(fullSystem, messages, {
      allowSampling: !noSamplingParams.has(llm.modelId),
      abortSignal: deadline,
    });
  } catch (error) {
    const message = String(error?.message ?? "");

    // Out of time. Returning empty rather than throwing lets the session fall
    // into its "sorry, could you say that again?" path, which is a far better
    // outcome for the caller than an error state or more silence.
    if (deadline.aborted || error?.name === "TimeoutError" || error?.name === "AbortError") {
      console.error(
        `[voice/llm] abandoned turn after ${OVERALL_DEADLINE_MS}ms deadline`
      );
      return { text: "", shouldEnd: false, latencyMs: Date.now() - started, timedOut: true };
    }

    // Some newer models reject `temperature` outright. Learn it once, retry now.
    if (/temperature|sampling|deprecated for this model/i.test(message)) {
      noSamplingParams.add(llm.modelId);
      console.warn(
        `[voice/llm] ${llm.modelId} rejected sampling params; retrying without them`
      );
      body = await invoke(fullSystem, messages, {
        allowSampling: false,
        abortSignal: deadline,
      });
    } else {
      throw error;
    }
  }

  const raw = extractText(body);
  const shouldEnd = /\[END_CALL\]/i.test(raw);
  const text = raw.replace(/\[END_CALL\]/gi, "").trim();

  return { text, shouldEnd, latencyMs: Date.now() - started };
}

/**
 * Establish the connection and, incidentally, prove the credentials and model
 * access are real before a visitor depends on them.
 */
export async function warmUp() {
  try {
    await invoke("Reply with the single word: ok", [{ role: "user", content: "ping" }], {
      allowSampling: !noSamplingParams.has(llm.modelId),
    });
    return true;
  } catch (error) {
    console.warn(`[voice/llm] warm-up failed: ${error.name}: ${error.message}`);
    return false;
  }
}

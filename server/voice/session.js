/**
 * One live voice conversation.
 *
 * This is the part that makes a demo feel like a phone call rather than a
 * walkie-talkie, and it is almost entirely timing rather than AI. The three
 * vendor calls are ordinary HTTP; what follows is the turn-taking around them:
 * deciding when the caller has stopped talking, noticing when they talk over the
 * agent, and staying able to abandon a reply halfway through.
 *
 * Ported from the main product's ConversationGovernor, reduced to what a
 * 90-second browser demo needs. Dropped along the way: RAG, tool calls, call
 * transfer, voicemail-beep detection, DTMF, language switching, DB persistence.
 * Kept, because they are what the feel depends on: energy VAD, silence
 * endpointing, the barge-in grace window, and paced playback.
 *
 * One turn, end to end:
 *
 *   caller stops talking
 *     -> tick() sees silence past the endpoint threshold
 *     -> Deepgram transcribes the buffered utterance
 *     -> Bedrock writes a reply
 *     -> TTS streams PCM, sent in paced chunks the caller can cut off
 *     -> back to listening
 */

import { EventEmitter } from "node:events";
import {
  SAMPLE_RATE,
  bargeIn,
  bytesToMs,
  limits,
  playback,
  turn,
} from "./config.js";
import { transcribe, preconnect } from "./deepgram.js";
import { synthesize, activeProvider } from "./tts.js";
import { generateReply } from "./bedrock.js";
import { getPersona } from "./personas.js";

/** Root-mean-square amplitude of a signed-16-bit-LE frame. */
function rms(buffer) {
  const samples = Math.floor(buffer.length / 2);
  if (samples === 0) return 0;
  let sumSquares = 0;
  for (let i = 0; i < samples; i++) {
    const sample = buffer.readInt16LE(i * 2);
    sumSquares += sample * sample;
  }
  return Math.sqrt(sumSquares / samples);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const STATE = {
  STARTING: "starting",
  LISTENING: "listening",
  THINKING: "thinking",
  SPEAKING: "speaking",
  ENDED: "ended",
};

export class VoiceSession extends EventEmitter {
  /**
   * @param {object} options
   * @param {string} options.personaId
   * @param {(pcm: Buffer) => void} options.sendAudio
   * @param {(payload: object) => void} options.sendJson
   * @param {string} [options.id]
   */
  constructor({ personaId, sendAudio, sendJson, id = "voice" }) {
    super();
    this.id = id;
    this.persona = getPersona(personaId);
    this.sendAudio = sendAudio;
    this.sendJson = sendJson;

    this.state = STATE.STARTING;
    this.history = [];
    this.turns = 0;
    this.startedAt = Date.now();

    // --- caller audio ---
    this.utterance = [];
    this.utteranceBytes = 0;
    /**
     * VAD can only notice speech that has already begun, so the first syllable
     * is always in the frames *before* the trigger. Keeping a short rolling
     * window and prepending it is what stops every transcript losing its
     * opening word.
     */
    this.preSpeech = [];
    this.preSpeechBytes = 0;
    this.userSpeaking = false;
    this.lastSpeechAt = 0;
    this.lastCallerActivityAt = Date.now();

    // --- agent audio ---
    this.botSpeaking = false;
    this.botPlaybackEndsAt = 0;
    /**
     * Bumped on every interruption. The send loop captures the value it started
     * with and bails the moment it changes, which is how a reply gets abandoned
     * mid-sentence instead of playing to the end over the caller's voice.
     */
    this.playbackGeneration = 0;
    this.playbackEndTimer = null;

    this.loudFrames = 0;
    this.processing = false;
    this.unheardCount = 0;
    this.closed = false;
    this.ticker = null;
  }

  // -------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------

  async start() {
    this.sendJson({
      type: "ready",
      sampleRate: SAMPLE_RATE,
      persona: {
        id: this.persona.id,
        label: this.persona.label,
        agentName: this.persona.agentName,
        company: this.persona.company,
      },
      voiceProvider: activeProvider(),
      maxSeconds: limits.maxSessionSeconds,
    });

    this.ticker = setInterval(() => {
      this.tick().catch((error) =>
        console.error(`[voice/${this.id}] tick failed: ${error.message}`)
      );
    }, turn.tickMs);

    // The greeting is a constant, so the agent is talking within milliseconds
    // instead of after an LLM round trip.
    await this.speak(this.persona.greeting, { isGreeting: true });
  }

  async stop(reason = "closed") {
    if (this.closed) return;
    this.closed = true;
    this.state = STATE.ENDED;
    this.playbackGeneration++; // abandon anything still being written

    if (this.ticker) clearInterval(this.ticker);
    if (this.playbackEndTimer) clearTimeout(this.playbackEndTimer);

    this.sendJson({
      type: "ended",
      reason,
      durationSeconds: Math.round((Date.now() - this.startedAt) / 1000),
      turns: this.turns,
    });
    this.emit("ended", reason);
  }

  setState(state) {
    if (this.state === state || this.closed) return;
    this.state = state;
    this.sendJson({ type: "state", state });
  }

  // -------------------------------------------------------------------------
  // Inbound audio
  // -------------------------------------------------------------------------

  /** @param {Buffer} frame Raw signed 16-bit LE mono PCM at SAMPLE_RATE. */
  onAudio(frame) {
    if (this.closed || !frame?.length) return;

    const level = rms(frame);

    // While the agent is audible, the caller's voice is an interruption, not
    // input — buffering it would splice their interruption onto the front of
    // their next actual utterance.
    if (this.botSpeaking) {
      this.handlePossibleBargeIn(level);
      return;
    }

    const isSpeech = level > turn.speechRmsThreshold;

    if (isSpeech) {
      this.lastSpeechAt = Date.now();
      this.lastCallerActivityAt = Date.now();

      if (!this.userSpeaking) {
        this.userSpeaking = true;
        // Recover the syllable that VAD missed.
        if (this.preSpeech.length) {
          this.utterance.push(...this.preSpeech);
          this.utteranceBytes += this.preSpeechBytes;
          this.preSpeech = [];
          this.preSpeechBytes = 0;
        }
        /**
         * A transcription request is now certain, and it is at least
         * silenceMs away. Deepgram drops idle connections within a few
         * seconds, so without this almost every turn pays a 1.3-1.8s TLS
         * handshake. Starting it here hides that entirely behind the caller
         * still speaking.
         */
        preconnect();
        this.sendJson({ type: "vad", speaking: true });
      }
    }

    if (this.userSpeaking) {
      // Keep trailing silence in the buffer: Deepgram uses it as a cue that the
      // utterance has finished, and trimming it costs accuracy on final words.
      this.utterance.push(frame);
      this.utteranceBytes += frame.length;

      if (this.utteranceBytes >= turn.maxUtteranceBytes) {
        this.processUtterance("max_length").catch((error) =>
          console.error(`[voice/${this.id}] ${error.message}`)
        );
      }
      return;
    }

    // Not speaking yet — hold a rolling pre-roll window and discard the rest.
    this.preSpeech.push(frame);
    this.preSpeechBytes += frame.length;
    while (
      this.preSpeechBytes > turn.preSpeechBufferBytes &&
      this.preSpeech.length > 1
    ) {
      this.preSpeechBytes -= this.preSpeech.shift().length;
    }
  }

  handlePossibleBargeIn(level) {
    // Echo cancellation is good, not perfect. Without this window the agent's
    // own opening syllable leaks back through the mic and it interrupts itself
    // on every single turn.
    const sinceStart = Date.now() - this.botSpeakStartedAt;
    if (sinceStart < bargeIn.graceMs) return;

    if (level > bargeIn.rmsThreshold) {
      this.loudFrames++;
      if (this.loudFrames >= bargeIn.minFrames) this.interrupt();
    } else if (this.loudFrames > 0) {
      // Require *sustained* speech. A cough or a chair creak decays away here
      // instead of cutting the agent off.
      this.loudFrames--;
    }
  }

  interrupt() {
    this.loudFrames = 0;
    this.playbackGeneration++;
    this.botSpeaking = false;
    if (this.playbackEndTimer) {
      clearTimeout(this.playbackEndTimer);
      this.playbackEndTimer = null;
    }

    // Tells the client to drop everything it has queued. Without it the browser
    // keeps playing audio the server has already given up on.
    this.sendJson({ type: "clear" });
    this.sendJson({ type: "interrupted" });

    this.utterance = [];
    this.utteranceBytes = 0;
    this.userSpeaking = true;
    this.lastSpeechAt = Date.now();
    this.lastCallerActivityAt = Date.now();
    this.setState(STATE.LISTENING);
  }

  // -------------------------------------------------------------------------
  // Timers
  // -------------------------------------------------------------------------

  async tick() {
    if (this.closed) return;

    const now = Date.now();

    if ((now - this.startedAt) / 1000 >= limits.maxSessionSeconds) {
      await this.stop("time_limit");
      return;
    }

    if (this.turns >= limits.maxTurns) {
      await this.stop("turn_limit");
      return;
    }

    // Nobody there. Stop paying for STT polling on an abandoned tab.
    const idleSeconds = (now - this.lastCallerActivityAt) / 1000;
    if (
      !this.botSpeaking &&
      !this.processing &&
      idleSeconds >= limits.hangupAfterSilenceSeconds
    ) {
      await this.stop("caller_silent");
      return;
    }

    if (this.processing || this.botSpeaking) return;

    // The endpoint: caller was speaking, and has now been quiet long enough.
    if (this.userSpeaking && now - this.lastSpeechAt >= turn.silenceMs) {
      await this.processUtterance("endpoint");
    }
  }

  // -------------------------------------------------------------------------
  // The turn
  // -------------------------------------------------------------------------

  async processUtterance(trigger) {
    if (this.processing || this.closed) return;

    const pcm = Buffer.concat(this.utterance);
    this.utterance = [];
    this.utteranceBytes = 0;
    this.userSpeaking = false;
    this.sendJson({ type: "vad", speaking: false });

    // Too short to be words. Discarding here avoids an STT call per cough.
    if (pcm.length < turn.minUtteranceBytes) return;

    this.processing = true;
    this.setState(STATE.THINKING);

    try {
      const sttStarted = Date.now();
      const transcript = await transcribe(pcm);
      const sttMs = Date.now() - sttStarted;
      // Utterance length is reported alongside the timing because the two move
      // together: a long buffer is usually trailing silence that endpointing
      // should have cut sooner, and without the byte count a slow turn looks
      // like a slow vendor.
      const audioMs = Math.round(bytesToMs(pcm.length));

      if (this.closed) return;

      if (!transcript) {
        await this.handleUnheard(pcm.length);
        return;
      }

      this.unheardCount = 0;
      this.turns++;
      this.history.push({ role: "user", content: transcript });
      this.sendJson({
        type: "transcript",
        role: "user",
        text: transcript,
        timings: { sttMs, audioMs },
      });

      const reply = await generateReply({
        systemPrompt: this.persona.systemPrompt,
        history: this.history,
      });

      if (this.closed) return;

      if (!reply.text) {
        await this.speak("Sorry, could you say that again?");
        return;
      }

      this.history.push({ role: "assistant", content: reply.text });
      this.sendJson({
        type: "transcript",
        role: "agent",
        text: reply.text,
        timings: { sttMs, audioMs, llmMs: reply.latencyMs },
      });

      // Release the lock before speaking: speak() runs long, and holding it
      // would block tick() from noticing a barge-in for the whole utterance.
      this.processing = false;
      await this.speak(reply.text);

      if (reply.shouldEnd) await this.stop("agent_ended");
      return;
    } catch (error) {
      console.error(`[voice/${this.id}] turn failed (${trigger}): ${error.message}`);
      if (!this.closed) {
        this.sendJson({
          type: "error",
          // The vendor's own wording can leak model ids and account state, so
          // the caller gets something plain and the detail goes to the log.
          message: "The agent hit a problem. Try speaking again.",
        });
        this.setState(STATE.LISTENING);
      }
    } finally {
      this.processing = false;
      if (!this.closed && !this.botSpeaking) this.setState(STATE.LISTENING);
    }
  }

  /**
   * Deepgram returned nothing. Silence back would read as a broken demo, so say
   * something the first couple of times — then stop, because a caller in a noisy
   * room should not get an endless loop of the same prompt.
   */
  async handleUnheard(byteLength) {
    this.unheardCount++;
    const wasSubstantial = byteLength > 0.6 * SAMPLE_RATE * 2;

    if (wasSubstantial && this.unheardCount <= 2) {
      this.processing = false;
      await this.speak(
        this.unheardCount === 1
          ? "Sorry, I didn't catch that."
          : "I'm still not getting that — could you speak a little louder?"
      );
      return;
    }
    this.setState(STATE.LISTENING);
  }

  // -------------------------------------------------------------------------
  // Speaking
  // -------------------------------------------------------------------------

  /**
   * Synthesize and stream `text` to the caller.
   *
   * Audio goes out in small paced chunks rather than one write. The pacing is
   * the entire reason barge-in works: it keeps most of the utterance on the
   * server, so an interruption can drop what has not been sent. Write it all at
   * once and the browser holds the whole reply — cancelling then means fighting
   * a buffer the server no longer controls.
   */
  async speak(text, { isGreeting = false } = {}) {
    if (this.closed || !text) return;

    const generation = this.playbackGeneration;
    const ttsStarted = Date.now();

    this.botSpeaking = true;
    this.botSpeakStartedAt = Date.now();
    this.loudFrames = 0;
    this.setState(STATE.SPEAKING);

    if (isGreeting) {
      this.history.push({ role: "assistant", content: text });
      this.sendJson({ type: "transcript", role: "agent", text });
    }

    let totalBytes = 0;
    let firstChunkAt = null;
    let pending = Buffer.alloc(0);

    const flush = async (buffer) => {
      for (let offset = 0; offset < buffer.length; offset += playback.chunkBytes) {
        if (this.closed || generation !== this.playbackGeneration) return false;
        const chunk = buffer.subarray(offset, offset + playback.chunkBytes);
        this.sendAudio(chunk);
        if (firstChunkAt === null) {
          firstChunkAt = Date.now();
          this.sendJson({
            type: "speaking",
            ttfbMs: firstChunkAt - ttsStarted,
          });
        }
        totalBytes += chunk.length;
        await sleep(playback.chunkDelayMs);
      }
      return true;
    };

    try {
      // Each persona names its own voice, so the seven industries sound like
      // seven different people. Providers without a per-voice catalogue ignore
      // this and use their configured default.
      for await (const chunk of synthesize(text, { voice: this.persona.voice })) {
        if (this.closed || generation !== this.playbackGeneration) break;

        // Vendor chunk sizes are arbitrary; re-slice to a fixed pace so the
        // cadence of the send loop doesn't depend on how the vendor framed it.
        pending = pending.length ? Buffer.concat([pending, chunk]) : chunk;
        const sendable = pending.length - (pending.length % playback.chunkBytes);
        if (sendable > 0) {
          const ok = await flush(pending.subarray(0, sendable));
          pending = pending.subarray(sendable);
          if (!ok) break;
        }
      }

      if (
        pending.length &&
        !this.closed &&
        generation === this.playbackGeneration
      ) {
        await flush(pending);
      }
    } catch (error) {
      console.error(`[voice/${this.id}] speak failed: ${error.message}`);
    }

    if (this.closed || generation !== this.playbackGeneration) return;

    if (totalBytes === 0) {
      // Nothing was synthesized — don't leave the caller waiting on silence.
      this.botSpeaking = false;
      this.setState(STATE.LISTENING);
      return;
    }

    // Sending finished long before the caller finishes *hearing* it: chunks go
    // out at roughly 4x realtime. So "is the agent still talking?" has to come
    // from the audio's own duration, not from this loop having returned.
    const playbackEndsAt =
      (firstChunkAt ?? Date.now()) +
      bytesToMs(totalBytes) +
      playback.tailPaddingMs;
    this.botPlaybackEndsAt = playbackEndsAt;

    const remaining = Math.max(0, playbackEndsAt - Date.now());
    await new Promise((resolve) => {
      this.playbackEndTimer = setTimeout(() => {
        this.playbackEndTimer = null;
        resolve();
      }, remaining);
    });

    if (this.closed || generation !== this.playbackGeneration) return;

    this.botSpeaking = false;
    this.loudFrames = 0;
    this.lastCallerActivityAt = Date.now();
    this.setState(STATE.LISTENING);
  }
}

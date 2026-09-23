/**
 * Browser end of the live voice demo.
 *
 * Owns the microphone, the WebSocket and playback scheduling, and reports what
 * happened through callbacks so the React component stays presentational. All
 * the fiddly parts live here: resampling, frame batching, and cancelling audio
 * that is already queued.
 *
 * Audio format is raw signed 16-bit LE mono PCM at 16 kHz in both directions,
 * matching the server. No container, no codec, no decode step.
 */

const SAMPLE_RATE = 16000;

/** ~20ms per frame at 16 kHz. */
const FRAME_SAMPLES = 320;

/**
 * An AudioWorklet hands over 128 samples at a time — around 2.7ms. Sending each
 * one individually would mean ~370 WebSocket messages a second, and the server's
 * energy VAD would be computing RMS over slices too short to be meaningful.
 * Batching to 20ms fixes both.
 */
const workletSource = `
class CaptureProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const channel = inputs[0] && inputs[0][0];
    if (channel) this.port.postMessage(channel.slice(0));
    return true;
  }
}
registerProcessor('audeora-capture', CaptureProcessor);
`;

export type VoiceState =
  | "idle"
  | "requesting-mic"
  | "connecting"
  | "listening"
  | "thinking"
  | "speaking"
  | "ended";

export interface TranscriptEntry {
  id: number;
  role: "user" | "agent";
  text: string;
}

export interface VoicePersona {
  id: string;
  label: string;
  agentName: string;
  company: string;
}

export interface VoiceClientHandlers {
  onState?: (state: VoiceState) => void;
  onTranscript?: (entry: TranscriptEntry) => void;
  onPersona?: (persona: VoicePersona) => void;
  /** 0..1, for the waveform. Reflects whoever is currently talking. */
  onLevel?: (level: number) => void;
  onUserSpeaking?: (speaking: boolean) => void;
  onInterrupted?: () => void;
  onEnded?: (reason: string) => void;
  onError?: (message: string) => void;
}

/** Linear-interpolation resample from the context rate to 16 kHz, then to Int16. */
function resampleToPcm16(input: Float32Array, inputRate: number): Int16Array {
  if (inputRate === SAMPLE_RATE) {
    const out = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
      out[i] = Math.max(-32768, Math.min(32767, Math.round(input[i] * 32767)));
    }
    return out;
  }

  const ratio = inputRate / SAMPLE_RATE;
  const outLength = Math.floor(input.length / ratio);
  const out = new Int16Array(outLength);
  for (let i = 0; i < outLength; i++) {
    const position = i * ratio;
    const low = Math.floor(position);
    const high = Math.min(low + 1, input.length - 1);
    const sample = input[low] + (input[high] - input[low]) * (position - low);
    out[i] = Math.max(-32768, Math.min(32767, Math.round(sample * 32767)));
  }
  return out;
}

function peakLevel(samples: Int16Array): number {
  let peak = 0;
  // Every 4th sample is plenty for a visual meter and a quarter of the work.
  for (let i = 0; i < samples.length; i += 4) {
    const value = Math.abs(samples[i]);
    if (value > peak) peak = value;
  }
  return Math.min(1, peak / 12000);
}

export function voiceSocketUrl(): string {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/api/voice/stream`;
}

export class VoiceClient {
  private handlers: VoiceClientHandlers;
  private socket: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private micStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private workletNode: AudioWorkletNode | null = null;

  /** Partial frame carried between worklet callbacks. */
  private pending: Int16Array = new Int16Array(0);

  /** Scheduled playback sources, so barge-in can stop them. */
  private queued: AudioBufferSourceNode[] = [];
  private nextPlayTime = 0;

  private transcriptId = 0;
  private state: VoiceState = "idle";
  private stopped = false;
  private levelTimer: number | null = null;
  private agentLevel = 0;

  constructor(handlers: VoiceClientHandlers = {}) {
    this.handlers = handlers;
  }

  private setState(state: VoiceState) {
    if (this.state === state) return;
    this.state = state;
    this.handlers.onState?.(state);
  }

  getState(): VoiceState {
    return this.state;
  }

  /**
   * Request the mic, open the socket, and start the chosen persona.
   *
   * Mic permission is requested before the socket opens on purpose: a visitor
   * who declines should not have consumed one of their rate-limited sessions.
   */
  async start(personaId: string): Promise<void> {
    this.stopped = false;
    this.setState("requesting-mic");

    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          // Without echo cancellation the agent hears its own voice through the
          // speakers and interrupts itself on every turn.
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        },
      });
    } catch (error) {
      const name = (error as DOMException)?.name;
      this.setState("idle");
      this.handlers.onError?.(
        name === "NotAllowedError" || name === "SecurityError"
          ? "Microphone access was blocked. Allow it in your browser and try again."
          : name === "NotFoundError"
            ? "No microphone was found on this device."
            : "Could not access the microphone."
      );
      return;
    }

    if (this.stopped) {
      this.teardown();
      return;
    }

    this.setState("connecting");

    try {
      this.audioContext = new AudioContext();
      // Browsers start contexts suspended until a user gesture; the click that
      // got us here counts, but resume() is still required in some browsers.
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }
    } catch {
      this.handlers.onError?.("Audio is not supported in this browser.");
      this.teardown();
      this.setState("idle");
      return;
    }

    const socket = new WebSocket(voiceSocketUrl());
    socket.binaryType = "arraybuffer";
    this.socket = socket;

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "start", personaId }));
      void this.startCapture();
      this.startLevelDecay();
    };

    socket.onmessage = (event) => this.handleMessage(event);

    socket.onerror = () => {
      if (!this.stopped) {
        this.handlers.onError?.("Connection to the demo failed.");
      }
    };

    socket.onclose = (event) => {
      // 1013 is the server saying "try later" — rate limited or at capacity.
      // Its reason text is written for a visitor, so surface it as-is.
      if (!this.stopped && event.code === 1013) {
        this.handlers.onError?.(
          event.reason || "The demo is busy right now. Try again shortly."
        );
      } else if (!this.stopped && event.code === 1008) {
        this.handlers.onError?.("The demo rejected this session.");
      }
      this.teardown();
      this.setState("ended");
    };
  }

  private async startCapture(): Promise<void> {
    const context = this.audioContext;
    const stream = this.micStream;
    if (!context || !stream) return;

    const blobUrl = URL.createObjectURL(
      new Blob([workletSource], { type: "application/javascript" })
    );
    try {
      await context.audioWorklet.addModule(blobUrl);
    } catch {
      this.handlers.onError?.("This browser cannot capture audio for the demo.");
      return;
    } finally {
      URL.revokeObjectURL(blobUrl);
    }

    if (this.stopped) return;

    this.sourceNode = context.createMediaStreamSource(stream);
    this.workletNode = new AudioWorkletNode(context, "audeora-capture");

    this.workletNode.port.onmessage = (event: MessageEvent<Float32Array>) => {
      if (this.socket?.readyState !== WebSocket.OPEN) return;

      const pcm = resampleToPcm16(event.data, context.sampleRate);

      if (this.state === "listening" || this.state === "thinking") {
        const level = peakLevel(pcm);
        if (level > 0.04) this.handlers.onLevel?.(level);
      }

      // Accumulate to whole frames so the server's VAD sees a meaningful window.
      const merged = new Int16Array(this.pending.length + pcm.length);
      merged.set(this.pending, 0);
      merged.set(pcm, this.pending.length);

      let offset = 0;
      while (merged.length - offset >= FRAME_SAMPLES) {
        const frame = merged.slice(offset, offset + FRAME_SAMPLES);
        this.socket.send(frame.buffer);
        offset += FRAME_SAMPLES;
      }
      this.pending = merged.slice(offset);
    };

    /**
     * A worklet is only pulled if it reaches a destination, but routing the mic
     * to the speakers would echo. A zero gain node satisfies the graph without
     * making a sound.
     */
    const mute = context.createGain();
    mute.gain.value = 0;
    this.sourceNode.connect(this.workletNode);
    this.workletNode.connect(mute);
    mute.connect(context.destination);
  }

  private handleMessage(event: MessageEvent): void {
    if (event.data instanceof ArrayBuffer) {
      this.playPcm(event.data);
      return;
    }

    let message: Record<string, unknown>;
    try {
      message = JSON.parse(String(event.data));
    } catch {
      return;
    }

    switch (message.type) {
      case "ready":
        if (message.persona) {
          this.handlers.onPersona?.(message.persona as VoicePersona);
        }
        this.setState("listening");
        break;

      case "state": {
        const next = message.state as string;
        if (next === "listening" || next === "thinking" || next === "speaking") {
          this.setState(next);
        }
        break;
      }

      case "transcript":
        this.handlers.onTranscript?.({
          id: ++this.transcriptId,
          role: message.role === "user" ? "user" : "agent",
          text: String(message.text ?? ""),
        });
        break;

      case "vad":
        this.handlers.onUserSpeaking?.(Boolean(message.speaking));
        break;

      case "clear":
        this.clearPlayback();
        break;

      case "interrupted":
        this.handlers.onInterrupted?.();
        break;

      case "ended":
        this.stopped = true;
        this.handlers.onEnded?.(String(message.reason ?? "ended"));
        this.teardown();
        this.setState("ended");
        break;

      case "error":
        this.handlers.onError?.(String(message.message ?? "Something went wrong."));
        break;
    }
  }

  /**
   * Queue a chunk for playback.
   *
   * Chunks are scheduled back-to-back against the context clock rather than
   * played on arrival. Arrival timing is jittery, and starting each chunk
   * "now" produces audible gaps and clicks; scheduling against an advancing
   * cursor butts them together seamlessly.
   */
  private playPcm(buffer: ArrayBuffer): void {
    const context = this.audioContext;
    if (!context || this.stopped) return;

    const pcm = new Int16Array(buffer);
    if (!pcm.length) return;

    this.agentLevel = Math.max(this.agentLevel, peakLevel(pcm));

    const audioBuffer = context.createBuffer(1, pcm.length, SAMPLE_RATE);
    const channel = audioBuffer.getChannelData(0);
    for (let i = 0; i < pcm.length; i++) channel[i] = pcm[i] / 32768;

    const source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(context.destination);

    const now = context.currentTime;
    // A small lead-in absorbs scheduling jitter without a perceptible delay.
    if (this.nextPlayTime < now + 0.02) this.nextPlayTime = now + 0.02;
    source.start(this.nextPlayTime);
    this.nextPlayTime += audioBuffer.duration;

    this.queued.push(source);
    source.onended = () => {
      this.queued = this.queued.filter((s) => s !== source);
    };
  }

  /**
   * Barge-in. The server has stopped sending, but whatever is already scheduled
   * would otherwise keep playing over the caller — so stop it and reset the
   * cursor, or the next reply would be queued behind audio we just abandoned.
   */
  private clearPlayback(): void {
    for (const source of this.queued) {
      try {
        source.stop();
      } catch {
        /* already finished */
      }
    }
    this.queued = [];
    this.nextPlayTime = 0;
    this.agentLevel = 0;
  }

  /**
   * Drive the waveform while the agent talks. The agent's level is sampled from
   * chunks as they arrive, which is bursty, so it decays smoothly between them
   * instead of snapping to zero.
   */
  private startLevelDecay(): void {
    if (this.levelTimer !== null) return;
    this.levelTimer = window.setInterval(() => {
      if (this.state === "speaking") {
        this.handlers.onLevel?.(this.agentLevel);
        this.agentLevel *= 0.82;
      }
    }, 60);
  }

  /** Hang up. Safe to call more than once. */
  stop(): void {
    this.stopped = true;
    if (this.socket?.readyState === WebSocket.OPEN) {
      try {
        this.socket.send(JSON.stringify({ type: "stop" }));
      } catch {
        /* closing anyway */
      }
    }
    this.teardown();
    this.setState("ended");
  }

  private teardown(): void {
    if (this.levelTimer !== null) {
      window.clearInterval(this.levelTimer);
      this.levelTimer = null;
    }
    this.clearPlayback();

    this.workletNode?.port.close();
    try {
      this.workletNode?.disconnect();
    } catch {
      /* not connected */
    }
    try {
      this.sourceNode?.disconnect();
    } catch {
      /* not connected */
    }
    this.workletNode = null;
    this.sourceNode = null;

    this.micStream?.getTracks().forEach((track) => track.stop());
    this.micStream = null;

    void this.audioContext?.close().catch(() => {});
    this.audioContext = null;

    if (this.socket) {
      this.socket.onopen = null;
      this.socket.onmessage = null;
      this.socket.onerror = null;
      this.socket.onclose = null;
      if (
        this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING
      ) {
        this.socket.close();
      }
      this.socket = null;
    }

    this.pending = new Int16Array(0);
  }
}

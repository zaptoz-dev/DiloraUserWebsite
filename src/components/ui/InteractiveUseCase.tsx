import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  VoiceClient,
  type TranscriptEntry,
  type VoicePersona,
  type VoiceState,
} from '../../lib/voiceClient';

/**
 * Interactive industry demo — a real conversation, not a simulation.
 *
 * Clicking through opens a WebSocket to /api/voice/stream, streams microphone
 * audio up, and plays the agent's spoken replies back. The industry chip selects
 * a server-side persona, so each one has its own voice, opening line and
 * business knowledge.
 *
 * The transcript is deliberately prominent. A visitor wearing headphones is the
 * only one who can hear the demo — on-screen captions are what make it legible
 * to everyone else, and they show the speech recognition working rather than
 * asking anyone to take it on trust.
 */

const USE_CASES = [
  { id: 'real-estate', label: 'Real Estate' },
  { id: 'hr', label: 'Human Resources' },
  { id: 'retail', label: 'Retail' },
  { id: 'legal', label: 'Legal' },
  { id: 'sales', label: 'Sales Teams' },
  { id: 'services', label: 'Services' },
  { id: 'healthcare', label: 'Healthcare' },
];

/** Fixed per-bar multipliers so the waveform tracks the voice instead of flickering. */
const BAR_SCALES = [0.55, 0.85, 1, 0.75, 0.95, 0.6];

const LIVE_STATES: VoiceState[] = ['listening', 'thinking', 'speaking'];

interface VoiceAvailability {
  enabled: boolean;
  configured: boolean;
  slotsAvailable: number;
}

export default function InteractiveUseCase() {
  const [activeCase, setActiveCase] = useState(USE_CASES[0]);
  const [state, setState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [persona, setPersona] = useState<VoicePersona | null>(null);
  const [level, setLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [endReason, setEndReason] = useState<string | null>(null);
  const [availability, setAvailability] = useState<VoiceAvailability | null>(null);

  const clientRef = useRef<VoiceClient | null>(null);
  const transcriptRef = useRef<HTMLDivElement | null>(null);

  const isLive = LIVE_STATES.includes(state);
  const isConnecting = state === 'requesting-mic' || state === 'connecting';

  // Ask the server whether the demo can actually run before offering it. Better
  // a clear message up front than a button that opens a socket and dies.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/voice/health')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        setAvailability({
          enabled: Boolean(data.enabled),
          configured: Boolean(data.configured),
          slotsAvailable: Number(data.slotsAvailable ?? 0),
        });
      })
      .catch(() => {
        /* Leave availability null — the button stays enabled and any real
           failure surfaces through the socket with a specific message. */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Never leave the microphone open on unmount.
  useEffect(() => {
    return () => {
      clientRef.current?.stop();
      clientRef.current = null;
    };
  }, []);

  useEffect(() => {
    const node = transcriptRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [transcript]);

  const handleStart = useCallback(() => {
    if (clientRef.current) clientRef.current.stop();

    setTranscript([]);
    setError(null);
    setEndReason(null);
    setPersona(null);
    setLevel(0);

    const client = new VoiceClient({
      onState: setState,
      onPersona: setPersona,
      onTranscript: (entry) => setTranscript((prev) => [...prev, entry]),
      onLevel: setLevel,
      onEnded: (reason) => {
        setEndReason(reason);
        setLevel(0);
      },
      onError: (message) => setError(message),
    });

    clientRef.current = client;
    void client.start(activeCase.id);
  }, [activeCase.id]);

  const handleStop = useCallback(() => {
    clientRef.current?.stop();
    clientRef.current = null;
  }, []);

  const handleReset = useCallback(() => {
    clientRef.current?.stop();
    clientRef.current = null;
    setState('idle');
    setTranscript([]);
    setError(null);
    setEndReason(null);
    setLevel(0);
  }, []);

  const selectCase = useCallback(
    (useCase: (typeof USE_CASES)[number]) => {
      setActiveCase(useCase);
      // Switching industry mid-call would leave the transcript attached to the
      // wrong agent, so end the session rather than silently mismatching.
      if (clientRef.current) {
        clientRef.current.stop();
        clientRef.current = null;
      }
      setState('idle');
      setTranscript([]);
      setError(null);
      setEndReason(null);
    },
    []
  );

  const statusLabel = useMemo(() => {
    switch (state) {
      case 'requesting-mic':
        return 'Allow microphone access\u2026';
      case 'connecting':
        return 'Connecting\u2026';
      case 'thinking':
        return 'Thinking\u2026';
      case 'speaking':
        return `${persona?.agentName ?? 'Agent'} is speaking`;
      case 'listening':
        return 'Listening\u2026';
      default:
        return '';
    }
  }, [state, persona]);

  const unavailableReason =
    availability && !availability.enabled
      ? 'The live demo is turned off right now.'
      : availability && !availability.configured
        ? 'The live demo is not configured on this server.'
        : null;

  return (
    <section className="py-24 px-4 w-full relative z-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left Side: Text and Selector */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-[#60a5fa] font-bold tracking-widest text-xs uppercase mb-6">
            <span className="w-2 h-2 rounded-full bg-[#d6f549] animate-pulse"></span>
            Interactive Demo
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white leading-tight">
            See Audeora in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60a5fa] to-[#245ae2]">Your Industry</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-400 mb-10 leading-relaxed">
            Select an industry below and start a live call to hear how our voice
            agent handles sector-specific workflows. You'll talk to it, and it
            talks back &mdash; headphones recommended.
          </p>

          <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Choose an industry">
            {USE_CASES.map((uc) => {
              const isActive = activeCase.id === uc.id;
              return (
                <button
                  key={uc.id}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => selectCase(uc)}
                  className={`flex items-center gap-3 px-5 py-2.5 rounded-full transition-all duration-300 text-sm font-semibold border ${
                    isActive
                      ? 'bg-[#245ae2]/15 border-[#245ae2] text-[#60a5fa] shadow-[0_0_15px_rgba(36,90,226,0.25)]'
                      : 'bg-[#0f1422] border-white/10 text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                    isActive ? 'border-[#60a5fa]' : 'border-slate-600'
                  }`}>
                    {isActive && <div className="w-1.5 h-1.5 bg-[#60a5fa] rounded-full" />}
                  </div>
                  {uc.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: The Live Call Card */}
        <div className="relative w-full min-h-[420px] md:aspect-[4/3] rounded-[2rem] bg-[#0f1422] border border-white/10 shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center p-8 overflow-hidden">

          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#245ae2]/15 rounded-full blur-[80px] pointer-events-none" />

          {state === 'idle' && (
            <div className="animate-in fade-in duration-500 flex flex-col items-center text-center z-10 w-full">
              <div className="w-20 h-20 rounded-full bg-[#245ae2] flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(36,90,226,0.5)]">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{activeCase.label} AI Agent</h3>
              <p className="text-slate-400 text-sm mb-8 max-w-[280px]">
                Have a real conversation about {activeCase.label.toLowerCase()} &mdash;
                speak naturally, and interrupt whenever you like.
              </p>

              {error && (
                <p className="text-red-400 text-sm mb-5 max-w-[280px]" role="alert">
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={handleStart}
                disabled={Boolean(unavailableReason)}
                className="w-full max-w-[280px] bg-[#245ae2] hover:bg-[#1d4ed8] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#245ae2] text-white font-bold py-4 px-8 rounded-xl transition-all shadow-[0_0_25px_rgba(36,90,226,0.35)] hover:scale-105 active:scale-95 disabled:hover:scale-100 flex items-center justify-center gap-2.5"
              >
                <div className="w-2 h-2 rounded-full bg-[#d6f549] animate-pulse" />
                Start Live Call
              </button>

              <p className="text-[11px] text-gray-500 mt-5 uppercase tracking-widest font-semibold">
                {unavailableReason ?? 'Uses your microphone \u00b7 90 seconds'}
              </p>
            </div>
          )}

          {isConnecting && (
            <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center justify-center z-10">
              <div className="relative flex items-center justify-center w-28 h-28 mb-8">
                <div className="absolute inset-0 border-4 border-[#245ae2]/20 rounded-full animate-ping" />
                <div className="absolute inset-0 border-4 border-[#245ae2] rounded-full border-t-transparent animate-spin" />
                <div className="w-20 h-20 bg-[#245ae2]/10 rounded-full flex items-center justify-center backdrop-blur-md">
                  <svg className="w-8 h-8 text-[#60a5fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {state === 'requesting-mic' ? 'Microphone' : 'Connecting'}
              </h3>
              <p className="text-[#60a5fa] text-sm uppercase tracking-widest font-mono" role="status">
                {statusLabel}
              </p>
            </div>
          )}

          {isLive && (
            <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center w-full h-full z-10">
              {/* Orb + live waveform, driven by the actual audio level */}
              <div className="relative mb-4 mt-1 shrink-0">
                <div
                  className="absolute -inset-5 bg-[#245ae2]/30 blur-2xl rounded-full transition-opacity duration-200"
                  style={{ opacity: 0.35 + level * 0.65 }}
                />
                <div className="relative w-24 h-24 bg-[#080b11] rounded-full border border-white/20 flex items-center justify-center shadow-2xl backdrop-blur-xl">
                  <div className="flex items-end gap-1.5 h-10">
                    {BAR_SCALES.map((scale, i) => (
                      <div
                        key={i}
                        className={`w-1.5 rounded-full transition-all duration-100 ${
                          state === 'speaking' ? 'bg-[#60a5fa]' : 'bg-[#d6f549]'
                        }`}
                        style={{
                          height: `${Math.max(12, Math.min(100, level * scale * 130))}%`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-center shrink-0 mb-3">
                <h3 className="text-lg font-bold text-white leading-tight">
                  {persona ? `${persona.agentName} \u00b7 ${persona.company}` : activeCase.label}
                </h3>
                <p
                  className={`text-xs uppercase tracking-widest font-mono mt-1 ${
                    state === 'speaking' ? 'text-[#60a5fa]' : 'text-[#d6f549]'
                  }`}
                  role="status"
                  aria-live="polite"
                >
                  {statusLabel}
                </p>
              </div>

              {/* Transcript */}
              <div
                ref={transcriptRef}
                className="flex-1 w-full min-h-0 overflow-y-auto rounded-xl bg-[#080b11]/60 border border-white/5 p-3 space-y-2 text-left"
                aria-live="polite"
                aria-label="Call transcript"
              >
                {transcript.length === 0 ? (
                  <p className="text-slate-500 text-xs text-center py-4">
                    Say hello to get started.
                  </p>
                ) : (
                  transcript.map((entry) => (
                    <div
                      key={entry.id}
                      className={`flex ${entry.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg px-3 py-1.5 text-[13px] leading-snug ${
                          entry.role === 'user'
                            ? 'bg-[#245ae2]/20 text-slate-200'
                            : 'bg-white/5 text-slate-300'
                        }`}
                      >
                        <span className="block text-[9px] uppercase tracking-widest text-slate-500 mb-0.5">
                          {entry.role === 'user' ? 'You' : (persona?.agentName ?? 'Agent')}
                        </span>
                        {entry.text}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {error && (
                <p className="text-red-400 text-xs mt-2 shrink-0" role="alert">
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={handleStop}
                className="mt-3 shrink-0 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-5 py-2.5 rounded-full transition-all flex items-center gap-2 text-sm font-semibold"
                aria-label="End call"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
                End Call
              </button>
            </div>
          )}

          {state === 'ended' && (
            <div className="animate-in fade-in duration-500 flex flex-col items-center w-full h-full z-10">
              <h3 className="text-xl font-bold text-white mb-1 mt-2 shrink-0">
                Call ended
              </h3>
              <p className="text-slate-400 text-xs mb-3 shrink-0">
                {endReason === 'time_limit'
                  ? 'The 90-second demo limit was reached.'
                  : endReason === 'caller_silent'
                    ? 'The call ended after a long silence.'
                    : `${transcript.length} message${transcript.length === 1 ? '' : 's'} exchanged.`}
              </p>

              {transcript.length > 0 && (
                <div className="flex-1 w-full min-h-0 overflow-y-auto rounded-xl bg-[#080b11]/60 border border-white/5 p-3 space-y-2 text-left mb-3">
                  {transcript.map((entry) => (
                    <div
                      key={entry.id}
                      className={`flex ${entry.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg px-3 py-1.5 text-[13px] leading-snug ${
                          entry.role === 'user'
                            ? 'bg-[#245ae2]/20 text-slate-200'
                            : 'bg-white/5 text-slate-300'
                        }`}
                      >
                        <span className="block text-[9px] uppercase tracking-widest text-slate-500 mb-0.5">
                          {entry.role === 'user' ? 'You' : (persona?.agentName ?? 'Agent')}
                        </span>
                        {entry.text}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <p className="text-red-400 text-xs mb-3 shrink-0" role="alert">
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={handleReset}
                className="shrink-0 bg-[#245ae2] hover:bg-[#1d4ed8] text-white font-bold py-3 px-7 rounded-xl transition-all shadow-[0_0_25px_rgba(36,90,226,0.35)] hover:scale-105 active:scale-95"
              >
                Start Another Call
              </button>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}

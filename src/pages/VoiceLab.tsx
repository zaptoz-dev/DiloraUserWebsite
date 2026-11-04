import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Pause, Play } from 'lucide-react';
import Badge from '../components/ui/Badge';
import TryItLiveCTA from '../components/TryItLiveCTA';

type Gender = 'female' | 'male';

interface VoiceItem {
  id: string;
  name: string;
  nativeScript: string;
  code: string;
  color: string;
  greeting: string;
  /** Masculine form of the greeting, for languages where the wording is gendered. */
  greetingMale?: string;
  translation: string;
  /** Recorded samples. Omitted while a language has no clips yet ("Coming soon"). */
  audio?: {
    female: string;
    male: string;
  };
}

const VOICES: VoiceItem[] = [
  {
    id: 'hindi',
    name: 'Hindi',
    nativeScript: 'हिन्दी',
    code: 'HI-IN',
    color: 'from-amber-500 to-rose-600',
    greeting: 'नमस्ते! मैं ऑडिओरा बोल रही हूँ।',
    greetingMale: 'नमस्ते! मैं ऑडिओरा बोल रहा हूँ।',
    translation: 'Namaste! This is Audeora speaking.',
    audio: {
      female: 'audio/Hindi_female.mp3',
      male: 'audio/Hindi_male.mp3'
    }
  },
  {
    id: 'english',
    name: 'English',
    nativeScript: 'English (India)',
    code: 'EN-IN',
    color: 'from-blue-500 to-indigo-600',
    greeting: 'Hi, this is Audeora calling.',
    translation: 'Hi, this is Audeora calling.',
    audio: {
      female: 'audio/English_female.m4a',
      male: 'audio/English_male.mp3'
    }
  },
  {
    id: 'telugu',
    name: 'Telugu',
    nativeScript: 'తెలుగు',
    code: 'TE-IN',
    color: 'from-emerald-500 to-teal-600',
    greeting: 'నమస్కారం, నేను ఆడియోరా.',
    translation: 'Namaskaram, this is Audeora.',
    audio: {
      female: 'audio/Telugu_female.mp3',
      male: 'audio/Telugu_male.mp3'
    }
  },
  {
    id: 'gujarati',
    name: 'Gujarati',
    nativeScript: 'ગુજરાતી',
    code: 'GU-IN',
    color: 'from-orange-500 to-amber-600',
    greeting: 'નમસ્તે, હું ઓડિયોરા.',
    translation: 'Namaste, this is Audeora.',
    audio: {
      female: 'audio/Gujarati_female.mp3',
      male: 'audio/Gujarati_male.mp3'
    }
  },
  {
    id: 'tamil',
    name: 'Tamil',
    nativeScript: 'தமிழ்',
    code: 'TA-IN',
    color: 'from-red-500 to-orange-600',
    greeting: 'வணக்கம், நான் ஆடியோரா.',
    translation: 'Vanakkam, this is Audeora.',
    audio: {
      female: 'audio/Tamil_female.mp3',
      male: 'audio/Tamil_male.mp3'
    }
  },
  {
    id: 'marathi',
    name: 'Marathi',
    nativeScript: 'मराठी',
    code: 'MR-IN',
    color: 'from-purple-500 to-indigo-600',
    greeting: 'नमस्कार, मी ऑडिओरा.',
    translation: 'Namaskar, this is Audeora.',
    audio: {
      female: 'audio/Marathi_female.mp3',
      male: 'audio/Marathi_male.mp3'
    }
  },
  {
    id: 'kannada',
    name: 'Kannada',
    nativeScript: 'ಕನ್ನಡ',
    code: 'KN-IN',
    color: 'from-yellow-500 to-amber-600',
    greeting: 'ನಮಸ್ಕಾರ, ನಾನು ಆಡಿಯೋರಾ.',
    translation: 'Namaskara, this is Audeora.',
    audio: {
      female: 'audio/Kannada_female.mp3',
      male: 'audio/Kannada_male.mp3'
    }
  },
  {
    id: 'malayalam',
    name: 'Malayalam',
    nativeScript: 'മലയാളം',
    code: 'ML-IN',
    color: 'from-teal-500 to-emerald-600',
    greeting: 'നമസ്കാരം, ഞാൻ ഓഡിയോറ.',
    translation: 'Namaskaram, this is Audeora.',
    audio: {
      female: 'audio/Malayalam_female.mp3',
      male: 'audio/Malayalam_male.mp3'
    }
  },
  {
    id: 'bengali',
    name: 'Bengali',
    nativeScript: 'বাংলা',
    code: 'BN-IN',
    color: 'from-pink-500 to-rose-600',
    greeting: 'নমস্কার, আমি অডিওরা।',
    translation: 'Nomoshkar, this is Audeora.',
    audio: {
      female: 'audio/Bengali_female.mp3',
      male: 'audio/Bengali_male.mp3'
    }
  },
  // International and regional additions. No recorded sample exists yet, so
  // they render as "Coming soon" until `audio` is filled in with real clips.
  {
    id: 'arabic',
    name: 'Arabic',
    nativeScript: 'العربية',
    code: 'AR-AE',
    color: 'from-emerald-500 to-green-600',
    greeting: 'مرحباً، معكم أوديورا.',
    translation: 'Hello, this is Audeora.'
  },
  {
    id: 'urdu',
    name: 'Urdu',
    nativeScript: 'اردو',
    code: 'UR-PK',
    color: 'from-lime-500 to-emerald-600',
    greeting: 'السلام علیکم، میں آڈیورا بول رہی ہوں۔',
    greetingMale: 'السلام علیکم، میں آڈیورا بول رہا ہوں۔',
    translation: 'Assalam o alaikum, this is Audeora speaking.'
  },
  {
    id: 'assamese',
    name: 'Assamese',
    nativeScript: 'অসমীয়া',
    code: 'AS-IN',
    color: 'from-rose-500 to-pink-600',
    greeting: 'নমস্কাৰ, মই অডিঅ’ৰা।',
    translation: 'Nomoskar, this is Audeora.'
  },
  {
    id: 'vietnamese',
    name: 'Vietnamese',
    nativeScript: 'Tiếng Việt',
    code: 'VI-VN',
    color: 'from-red-500 to-yellow-600',
    greeting: 'Xin chào, tôi là Audeora.',
    translation: 'Hello, this is Audeora.'
  },
  {
    id: 'malay',
    name: 'Bahasa Malaysia',
    nativeScript: 'Bahasa Malaysia',
    code: 'MS-MY',
    color: 'from-sky-500 to-blue-600',
    greeting: 'Hai, saya Audeora.',
    translation: 'Hello, this is Audeora.'
  },
  {
    id: 'mandarin',
    name: 'Mandarin (Singapore)',
    nativeScript: '中文',
    code: 'ZH-SG',
    color: 'from-red-500 to-rose-600',
    greeting: '您好，我是 Audeora。',
    translation: 'Hello, this is Audeora.'
  },
  {
    id: 'filipino',
    name: 'Filipino',
    nativeScript: 'Filipino',
    code: 'FIL-PH',
    color: 'from-indigo-500 to-blue-600',
    greeting: 'Kumusta, ito si Audeora.',
    translation: 'Hello, this is Audeora.'
  },
  {
    id: 'thai',
    name: 'Thai',
    nativeScript: 'ไทย',
    code: 'TH-TH',
    color: 'from-fuchsia-500 to-purple-600',
    greeting: 'สวัสดีค่ะ ดิฉันคือ Audeora',
    greetingMale: 'สวัสดีครับ ผมคือ Audeora',
    translation: 'Hello, this is Audeora.'
  }
];

const GENDERS: Gender[] = ['female', 'male'];
const GENDER_LABEL: Record<Gender, string> = { female: 'Female', male: 'Male' };
/** Seconds to jump per arrow key on the progress bar. */
const SEEK_STEPS: Record<string, number> = { ArrowLeft: -2, ArrowDown: -2, ArrowRight: 2, ArrowUp: 2 };

// Audio paths are relative, so prefixing Vite's base URL resolves them under
// both the GitHub Pages build (/DiloraUserWebsite/) and the server build (/).
function audioUrl(path: string) {
  return `${import.meta.env.BASE_URL}${path}`;
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}

function greetingFor(voice: VoiceItem, gender: Gender) {
  return gender === 'male' && voice.greetingMale ? voice.greetingMale : voice.greeting;
}

/** 'HI-IN' -> 'hi-IN', for the lang attribute on native-script text. */
function langTag(code: string) {
  const [language, region] = code.split('-');
  return `${language.toLowerCase()}-${region}`;
}

// ---------------------------------------------------------------------------
// Waveform
// ---------------------------------------------------------------------------

const BAR_COUNT = 32;
const CENTRE = (BAR_COUNT - 1) / 2;

// Resting shape: tallest in the middle and tapering out, with a fixed ripple so
// it reads as a voice. Fixed rather than random so every render is identical.
const REST_LEVELS = Array.from({ length: BAR_COUNT }, (_, i) => {
  const fromCentre = Math.abs(i - CENTRE) / CENTRE;
  return 0.15 + 0.4 * (1 - fromCentre) * (0.55 + 0.45 * Math.abs(Math.sin(i * 1.9)));
});

interface WaveformProps {
  /** This card owns the shared audio element. */
  live: boolean;
  playing: boolean;
  /** False under prefers-reduced-motion: the bars stay still. */
  animate: boolean;
  analyserRef: RefObject<AnalyserNode>;
  audioRef: RefObject<HTMLAudioElement>;
}

/**
 * Decorative bars that follow the real audio through an AnalyserNode. Low
 * frequencies, where most speech energy sits, drive the middle bars. When no
 * analyser is available the bars are driven from the playback position
 * instead, so the card still looks alive. Bars are updated directly in a
 * requestAnimationFrame loop rather than through React state.
 */
function Waveform({ live, playing, animate, analyserRef, audioRef }: WaveformProps) {
  const barsRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!live || !playing || !animate) return;
    const analyser = analyserRef.current;
    const bins = analyser ? new Uint8Array(analyser.frequencyBinCount) : null;
    let frame = 0;

    const draw = () => {
      if (analyser && bins) analyser.getByteFrequencyData(bins);
      const t = audioRef.current?.currentTime ?? 0;
      barsRef.current.forEach((bar, i) => {
        if (!bar) return;
        const fromCentre = Math.abs(i - CENTRE) / CENTRE;
        const level =
          analyser && bins
            ? (bins[1 + Math.round(fromCentre * 40)] / 255) * (0.85 + fromCentre * 0.6)
            : (0.3 + 0.7 * Math.abs(Math.sin(t * 6 + i * 0.55))) * (1 - fromCentre * 0.55);
        bar.style.transform = `scaleY(${Math.min(1, Math.max(0.08, level))})`;
      });
      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [live, playing, animate, analyserRef, audioRef]);

  return (
    <div aria-hidden="true" className="flex h-8 w-full items-center justify-between">
      {REST_LEVELS.map((level, i) => (
        <span
          key={i}
          ref={(el) => {
            barsRef.current[i] = el;
          }}
          className={`h-full w-[3px] rounded-full ${
            live ? 'bg-gradient-to-t from-[#245ae2] to-[#60a5fa]' : 'bg-slate-500/40'
          }`}
          style={{ transform: `scaleY(${level})` }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

interface ActiveClip {
  index: number;
  gender: Gender;
}

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

function usePrefersReducedMotion() {
  const query = '(prefers-reduced-motion: reduce)';
  const [reduced, setReduced] = useState(() => window.matchMedia?.(query).matches ?? false);
  useEffect(() => {
    const media = window.matchMedia?.(query);
    if (!media) return;
    const onChange = () => setReduced(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

export default function VoiceLab() {
  // One <audio> element for the whole page, so only one clip can ever play.
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioGraphFailedRef = useRef(false);
  const activeRef = useRef<ActiveClip | null>(null);
  // Incremented on every play() call, so a late rejection from an earlier
  // request cannot show an error on the wrong card.
  const playRequestRef = useRef(0);

  const [active, setActiveState] = useState<ActiveClip | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<{ index: number; message: string } | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const setActive = (clip: ActiveClip | null) => {
    activeRef.current = clip;
    setActiveState(clip);
  };

  const resetToIdle = () => {
    setActive(null);
    setPlaying(false);
    setLoading(false);
    setCurrentTime(0);
    setDuration(0);
  };

  const fail = (index: number, message: string) => {
    resetToIdle();
    setError({ index, message });
  };

  // Route the audio element through an AnalyserNode so the waveform follows
  // the real sound. This runs inside the click handler because browsers only
  // let an AudioContext start or resume after a user gesture. If Web Audio is
  // unavailable the element keeps playing on its own and the waveform falls
  // back to following the playback position.
  const connectAnalyser = (audio: HTMLAudioElement) => {
    if (audioGraphFailedRef.current) return;
    try {
      if (!audioCtxRef.current) {
        const Ctx = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
        if (!Ctx) throw new Error('Web Audio is not supported');
        const ctx = new Ctx();
        audioCtxRef.current = ctx;
        const source = ctx.createMediaElementSource(audio);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.75;
        // Once the element is routed into the graph this is the only path its
        // sound takes, so the analyser must feed the speakers too.
        source.connect(analyser);
        analyser.connect(ctx.destination);
        analyserRef.current = analyser;
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {});
      }
    } catch {
      audioGraphFailedRef.current = true;
      analyserRef.current = null;
      audioCtxRef.current?.close().catch(() => {});
      audioCtxRef.current = null;
    }
  };

  const startPlayback = (audio: HTMLAudioElement, index: number) => {
    const request = ++playRequestRef.current;
    audio.play().catch((err: unknown) => {
      if (request !== playRequestRef.current) return;
      const name = err instanceof DOMException ? err.name : '';
      // AbortError means a pause or a new clip interrupted this one: expected.
      if (name === 'AbortError') return;
      fail(
        index,
        name === 'NotAllowedError'
          ? 'Your browser blocked playback. Press play again.'
          : 'This clip could not be played. Please try again.'
      );
    });
  };

  const handleToggle = (index: number, gender: Gender) => {
    const audio = audioRef.current;
    const clip = VOICES[index].audio?.[gender];
    if (!audio || !clip) return;
    connectAnalyser(audio);
    setError(null);

    const current = activeRef.current;
    if (current && current.index === index && current.gender === gender) {
      if (audio.paused) startPlayback(audio, index);
      else audio.pause();
      return;
    }

    audio.pause();
    audio.src = audioUrl(clip);
    setActive({ index, gender });
    setPlaying(false);
    setLoading(true);
    setCurrentTime(0);
    setDuration(0);
    startPlayback(audio, index);
  };

  const seekTo = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    const target = Math.min(Math.max(seconds, 0), audio.duration);
    audio.currentTime = target;
    setCurrentTime(target);
  };

  // Stop playback when leaving the page: a detached <audio> element keeps
  // playing otherwise.
  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      playRequestRef.current++;
      if (audio) {
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
      }
      audioCtxRef.current?.close().catch(() => {});
      audioCtxRef.current = null;
      analyserRef.current = null;
    };
  }, []);

  return (
    <div className="pt-28 pb-24 bg-[#080b11] text-slate-100 min-h-screen">
      {/* Header */}
      <section className="py-12 px-4 text-center relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#245ae2]/15 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <Badge className="mb-6">VOICE LAB</Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 text-white leading-tight">
            Hear Audeora<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60a5fa] via-[#245ae2] to-[#93c5fd]">
              in your language.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto">
            Pick a language and press play to hear a female or male voice. Indian, Middle East,
            South-East Asian and other international languages, with Arabic and Urdu for EMEA callers.
          </p>
        </div>
      </section>

      {/* Language cards */}
      <section aria-label="Voice samples" className="px-4 max-w-7xl mx-auto">
        <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          {VOICES.map((voice, index) => {
            const hasAudio = Boolean(voice.audio);
            const isActive = active?.index === index;
            const activeGender = isActive ? active.gender : null;
            const lang = langTag(voice.code);
            const cardError = error?.index === index ? error.message : null;
            const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

            const onSeekKey = (e: KeyboardEvent<HTMLDivElement>) => {
              const step = SEEK_STEPS[e.key];
              if (step !== undefined) seekTo(currentTime + step);
              else if (e.key === 'Home') seekTo(0);
              else if (e.key === 'End') seekTo(duration);
              else return;
              e.preventDefault();
            };

            return (
              <li
                key={voice.id}
                className={`flex flex-col rounded-2xl border p-4 transition-all duration-300 ${
                  isActive
                    ? 'bg-[#0f1422] border-[#245ae2]/70 shadow-[0_0_40px_rgba(36,90,226,0.28)]'
                    : 'bg-[#0d121f] border-white/10 hover:border-white/20'
                }`}
              >
                {/* Language */}
                <p lang={lang} className="truncate text-2xl font-bold text-white leading-tight">
                  {voice.nativeScript}
                </p>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <h2 className="text-sm font-medium text-slate-400 tracking-normal">{voice.name}</h2>
                  <span className="flex shrink-0 items-center gap-1.5">
                    {!hasAudio && (
                      <span className="rounded-md bg-[#d6f549]/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-[#d6f549]">
                        Coming soon
                      </span>
                    )}
                    <span className="rounded-md border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
                      {voice.code}
                    </span>
                  </span>
                </div>

                {/* Player: same height whether idle or playing, so cards never shift */}
                <div
                  className={`mt-4 h-[124px] rounded-xl border px-3 py-3 transition-colors ${
                    isActive ? 'bg-[#080b11] border-[#245ae2]/25' : 'bg-[#080b11]/60 border-white/5'
                  }`}
                >
                  {cardError ? (
                    <p role="alert" className="flex h-full items-center justify-center text-center text-xs leading-relaxed text-amber-300">
                      {cardError}
                    </p>
                  ) : activeGender ? (
                    <div className="flex h-full flex-col justify-between">
                      <div className="text-[11px] leading-4">
                        <div className="flex items-center justify-between gap-2">
                          <span className="flex items-center gap-1.5 font-semibold text-white">
                            <span
                              className={`h-1.5 w-1.5 rounded-full bg-[#d6f549] ${
                                playing ? 'motion-safe:animate-pulse' : 'opacity-50'
                              }`}
                            />
                            Audeora
                          </span>
                          <span className="font-mono tabular-nums text-slate-400">
                            {formatTime(currentTime)} / {formatTime(duration)}
                          </span>
                        </div>
                        <p className="truncate text-slate-400">
                          {voice.name} · {GENDER_LABEL[activeGender]} voice
                        </p>
                      </div>

                      <Waveform
                        live
                        playing={playing}
                        animate={!reducedMotion}
                        analyserRef={analyserRef}
                        audioRef={audioRef}
                      />

                      <div
                        role="slider"
                        tabIndex={0}
                        aria-label={`Seek ${voice.name} ${activeGender} voice`}
                        aria-valuemin={0}
                        aria-valuemax={Math.round(duration)}
                        aria-valuenow={Math.round(currentTime)}
                        aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          seekTo(((e.clientX - rect.left) / rect.width) * duration);
                        }}
                        onKeyDown={onSeekKey}
                        className="group flex h-5 cursor-pointer items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60a5fa]"
                      >
                        <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/10 transition-[height] group-hover:h-1.5">
                          <div
                            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#245ae2] to-[#60a5fa]"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-full items-center">
                      <Waveform
                        live={false}
                        playing={false}
                        animate={false}
                        analyserRef={analyserRef}
                        audioRef={audioRef}
                      />
                    </div>
                  )}
                </div>

                {/* Greeting */}
                <div className="mt-4">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">Greeting</p>
                  <p lang={lang} className={`mt-1 text-sm leading-snug ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    "{greetingFor(voice, activeGender ?? 'female')}"
                  </p>
                  {voice.translation !== voice.greeting && (
                    <p className="mt-1 text-xs italic leading-snug text-slate-400">{voice.translation}</p>
                  )}
                </div>

                {/* Female / Male */}
                <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
                  {GENDERS.map((gender) => {
                    const isThis = activeGender === gender;
                    const isPlayingThis = isThis && playing;
                    const isLoadingThis = isThis && loading;
                    const Icon = isLoadingThis ? Loader2 : isPlayingThis ? Pause : Play;
                    return (
                      <button
                        key={gender}
                        type="button"
                        onClick={() => handleToggle(index, gender)}
                        disabled={!hasAudio}
                        aria-pressed={isPlayingThis}
                        aria-label={
                          hasAudio
                            ? `${isPlayingThis ? 'Pause' : 'Play'} ${voice.name} ${gender} voice`
                            : `${voice.name} ${gender} voice, coming soon`
                        }
                        className={`inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border px-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60a5fa] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d121f] disabled:cursor-not-allowed disabled:opacity-40 ${
                          isPlayingThis
                            ? 'bg-[#245ae2] border-[#245ae2] text-white shadow-[0_0_20px_rgba(36,90,226,0.45)]'
                            : isThis
                              ? 'bg-[#245ae2]/15 border-[#245ae2]/70 text-white'
                              : 'bg-white/[0.04] border-white/10 text-slate-200 hover:bg-[#245ae2]/10 hover:border-[#245ae2]/50 hover:text-white'
                        }`}
                      >
                        <Icon
                          aria-hidden="true"
                          className={`h-4 w-4 shrink-0 ${isLoadingThis ? 'motion-safe:animate-spin' : ''}`}
                          fill={isLoadingThis ? 'none' : 'currentColor'}
                        />
                        {GENDER_LABEL[gender]}
                      </button>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ul>

        <p className="mt-10 text-center text-sm text-slate-400">
          Want to hear Audeora on a real call?{' '}
          <Link to="/demo" className="font-semibold text-[#60a5fa] hover:text-white transition-colors">
            Test on your phone &rarr;
          </Link>
        </p>
      </section>

      <audio
        ref={audioRef}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPlaying={() => setLoading(false)}
        onWaiting={() => setLoading(true)}
        onPause={() => {
          setPlaying(false);
          setLoading(false);
        }}
        onEnded={resetToIdle}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onError={() => {
          const current = activeRef.current;
          if (current) fail(current.index, 'This clip could not be loaded. Please try again.');
        }}
      />

      <TryItLiveCTA />
    </div>
  );
}

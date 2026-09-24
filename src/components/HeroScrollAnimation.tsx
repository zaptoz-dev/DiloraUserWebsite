import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface LanguageSample {
  id: string;
  name: string;
  native: string;
  greeting: string;
  translation: string;
  audioPath: string;
}

const SAMPLES: LanguageSample[] = [
  {
    id: 'hindi',
    name: 'Hindi',
    native: 'हिन्दी',
    greeting: 'नमस्ते! मैं ऑडिओरा बोल रही हूँ।',
    translation: 'Namaste! This is Audeora speaking.',
    audioPath: 'audio/Hindi_female.mp3'
  },
  {
    id: 'english',
    name: 'English',
    native: 'English (IN)',
    greeting: 'Hi, this is Audeora calling.',
    translation: 'Hi, this is Audeora calling.',
    audioPath: 'audio/English_female.m4a'
  },
  {
    id: 'telugu',
    name: 'Telugu',
    native: 'తెలుగు',
    greeting: 'నమస్కారం, నేను ఆడియోరా.',
    translation: 'Namaskaram, this is Audeora.',
    audioPath: 'audio/Telugu_female.mp3'
  },
  {
    id: 'tamil',
    name: 'Tamil',
    native: 'தமிழ்',
    greeting: 'வணக்கம், நான் ஆடியோரா.',
    translation: 'Vanakkam, this is Audeora.',
    audioPath: 'audio/Tamil_female.mp3'
  },
  {
    id: 'gujarati',
    name: 'Gujarati',
    native: 'ગુજરાતી',
    greeting: 'નમસ્તે, હું ઓડિયોરા.',
    translation: 'Namaste, this is Audeora.',
    audioPath: 'audio/Gujarati_female.mp3'
  },
  {
    id: 'marathi',
    name: 'Marathi',
    native: 'मराठी',
    greeting: 'नमस्कार, मी ऑडिओरा.',
    translation: 'Namaskar, this is Audeora.',
    audioPath: 'audio/Marathi_female.mp3'
  }
];

export default function HeroScrollAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeLang, setActiveLang] = useState<LanguageSample>(SAMPLES[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const baseUrl = import.meta.env.BASE_URL || '/';

  // Smooth scroll progress tracking for expanding acoustic ripple effect
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrolled = -rect.top;
      const totalDistance = rect.height - windowHeight * 0.4;

      if (totalDistance > 0) {
        const progress = Math.max(0, Math.min(1, scrolled / totalDistance));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle live audio play/pause
  const togglePlay = useCallback((sample: LanguageSample) => {
    if (isPlaying && activeLang.id === sample.id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setActiveLang(sample);
    const fullPath = sample.audioPath.startsWith('/')
      ? `${baseUrl}${sample.audioPath.slice(1)}`
      : `${baseUrl}${sample.audioPath}`;

    const audio = new Audio(fullPath);
    audioRef.current = audio;

    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => setIsPlaying(false);

    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(() => {
      setIsPlaying(false);
    });
  }, [isPlaying, activeLang, baseUrl]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // 36 dynamic audio equalizer bar profile
  const waveformBars = [
    25, 40, 68, 85, 95, 70, 45, 88, 100, 80, 55, 92,
    75, 45, 85, 98, 65, 40, 85, 95, 75, 50, 90, 100,
    82, 55, 70, 92, 60, 42, 75, 88, 65, 48, 70, 35
  ];

  return (
    <section 
      ref={containerRef}
      className="relative pt-32 sm:pt-36 pb-20 px-4 overflow-hidden"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] sm:w-[1100px] h-[550px] bg-[#245ae2]/15 blur-[170px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-[#9b66ff]/10 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-[#d6f549]/5 blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* Hero Typography & CTAs */}
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10 mb-12 sm:mb-16">
        
        {/* Top Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#245ae2]/10 border border-[#245ae2]/30 mb-6 sm:mb-8 backdrop-blur-md shadow-[0_0_25px_rgba(36,90,226,0.3)]">
          <span className="w-2 h-2 rounded-full bg-[#d6f549] animate-pulse" />
          <span className="text-xs font-semibold text-[#93c5fd] tracking-wide uppercase">
            Enterprise AI Voice Platform
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-[76px] font-bold leading-[1.08] mb-6 sm:mb-8 text-white tracking-tight">
          Calls that sound <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60a5fa] via-[#245ae2] to-[#93c5fd]">human</span>.<br />
          Outcomes that <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">scale</span>.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-300 mb-8 sm:mb-10 max-w-2xl leading-relaxed">
          Audeora answers, qualifies, schedules, and resolves calls in 10+ Indian and global languages—with the natural pace and tone of your best tele-caller.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link 
            to="/demo" 
            className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#245ae2] hover:bg-[#1d4ed8] px-8 py-4 rounded-full text-[15px] font-semibold text-white transition-all duration-300 shadow-[0_0_35px_rgba(36,90,226,0.5)] hover:shadow-[0_0_55px_rgba(36,90,226,0.7)] hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Get a demo call
          </Link>
          
          <Link 
            to="/voice-lab" 
            className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#0d1220]/80 backdrop-blur-md border border-white/15 hover:border-white/30 px-8 py-4 rounded-full text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
          >
            Explore Voice Lab
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Eye-Catching Animated Voice Core & Acoustic Orbit */}
      <div className="relative max-w-5xl mx-auto flex flex-col items-center justify-center">
        
        {/* Floating Clean Feature Pills in 3D Space */}
        <div className="w-full flex flex-wrap items-center justify-between gap-4 px-4 sm:px-8 mb-6 z-20 pointer-events-none">
          {/* Left Pill */}
          <div className="bg-[#0b101d]/85 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex items-center gap-2 text-xs font-medium text-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>&lt;300ms Turnaround</span>
            <span className="text-slate-500 font-mono text-[10px]">ZERO AWKWARD PAUSES</span>
          </div>

          {/* Right Pill */}
          <div className="bg-[#0b101d]/85 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex items-center gap-2 text-xs font-medium text-slate-200">
            <span className="text-sm">🗣️</span>
            <span>10+ Native Indian Accents</span>
            <span className="text-[#60a5fa] font-mono text-[10px]">AUTO DETECT</span>
          </div>
        </div>

        {/* Central Luminous Acoustic Sphere & Orbital Rings */}
        <div 
          className="relative w-[340px] sm:w-[460px] h-[340px] sm:h-[460px] flex items-center justify-center"
          style={{
            transform: `scale(${1 + scrollProgress * 0.18})`,
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Outermost Expanding Acoustic Ripple Wave */}
          <div className="absolute inset-0 rounded-full border border-[#245ae2]/25 animate-ripple-pulse pointer-events-none" />
          
          {/* Orbital Ring 1: Clockwise Rotating Vector Circle with Light Particle */}
          <div className="absolute inset-4 sm:inset-6 rounded-full border border-[#245ae2]/40 animate-spin-slow pointer-events-none">
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#60a5fa] shadow-[0_0_15px_#60a5fa]" />
          </div>

          {/* Orbital Ring 2: Counter-Clockwise Dashed Ring */}
          <div className="absolute inset-10 sm:inset-14 rounded-full border border-dashed border-[#60a5fa]/30 animate-spin-reverse-slow pointer-events-none">
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#d6f549] shadow-[0_0_12px_#d6f549]" />
          </div>

          {/* Core Ambient Radiance Glow */}
          <div className="absolute w-44 sm:w-60 h-44 sm:h-60 rounded-full bg-gradient-to-tr from-[#245ae2] via-[#60a5fa] to-[#d6f549] blur-[50px] opacity-40 animate-orb-pulse pointer-events-none" />

          {/* The Glass Voice Sphere */}
          <div className="relative w-56 sm:w-72 h-56 sm:h-72 rounded-full bg-[#0a0f1d]/90 backdrop-blur-2xl border border-white/20 shadow-[0_0_60px_rgba(36,90,226,0.35),inset_0_0_40px_rgba(36,90,226,0.2)] flex flex-col items-center justify-center overflow-hidden p-6 z-10 group">
            
            {/* Top Specular Glass Reflection */}
            <div className="absolute top-0 inset-x-8 h-20 bg-gradient-to-b from-white/30 via-white/5 to-transparent rounded-full blur-sm pointer-events-none" />

            {/* Inner Radial Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(36,90,226,0.45)_0%,_transparent_70%)] pointer-events-none" />

            {/* Center Status Dot */}
            <div className="flex items-center gap-2 mb-3 z-10">
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-[#d6f549] animate-ping' : 'bg-[#60a5fa]'}`} />
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-300">
                {isPlaying ? 'AUDEORA SPEAKING' : 'READY TO TALK'}
              </span>
            </div>

            {/* Living Sonic Audio Waveform Equalizer */}
            <div className="w-full flex items-center justify-center gap-1 h-16 px-2 z-10">
              {waveformBars.slice(0, 24).map((h, i) => {
                const isCenter = i >= 6 && i <= 17;
                return (
                  <div
                    key={i}
                    className="w-1 sm:w-1.5 rounded-full transition-all duration-200"
                    style={{
                      height: isPlaying ? `${h}%` : `${Math.max(15, h * 0.35)}%`,
                      background: isCenter
                        ? 'linear-gradient(to top, #245ae2, #d6f549)'
                        : 'linear-gradient(to top, #1e3a8a, #60a5fa)',
                      opacity: isPlaying ? 1 : 0.6,
                      animation: isPlaying 
                        ? `waveform ${0.8 + (i % 4) * 0.25}s ease-in-out infinite alternate ${i * 0.05}s`
                        : 'none'
                    }}
                  />
                );
              })}
            </div>

            {/* Native Script / Live Turn-taking Subtitle */}
            <div className="mt-3 text-center z-10">
              <div className="text-xs font-semibold text-white tracking-wide">
                {activeLang.native}
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                Sub-300ms Voice Pipeline
              </div>
            </div>
          </div>
        </div>

        {/* Clean Interactive Language Player Pill */}
        <div className="mt-8 z-20 w-full max-w-2xl bg-[#090e1a]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 sm:p-5 shadow-[0_15px_40px_rgba(0,0,0,0.6)] flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Active Greeting & Play Button */}
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <button
              onClick={() => togglePlay(activeLang)}
              className="w-11 h-11 rounded-full bg-[#245ae2] hover:bg-[#1d4ed8] text-white flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(36,90,226,0.6)] transition-all hover:scale-105"
              title={isPlaying ? 'Pause' : 'Play voice sample'}
            >
              {isPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate">
                {activeLang.greeting}
              </div>
              <div className="text-[11px] text-slate-400 font-normal truncate">
                {activeLang.translation}
              </div>
            </div>
          </div>

          {/* Quick Language Switcher Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
            {SAMPLES.map((sample) => {
              const isSelected = activeLang.id === sample.id;
              return (
                <button
                  key={sample.id}
                  onClick={() => togglePlay(sample)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                    isSelected
                      ? 'bg-[#245ae2] text-white shadow-[0_0_15px_rgba(36,90,226,0.5)]'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                  }`}
                >
                  {sample.name}
                </button>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}

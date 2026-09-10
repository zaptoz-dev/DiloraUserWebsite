import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import TryItLiveCTA from '../components/TryItLiveCTA';

interface VoiceItem {
  id: string;
  name: string;
  nativeScript: string;
  code: string;
  color: string;
  greeting: string;
  translation: string;
  audio: {
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
    greeting: 'नमस्ते! मैं डायलोरा बोल रही हूँ।',
    translation: 'Namaste! This is Dialora speaking.',
    audio: {
      female: 'audio/Hindi_female.mp3',
      male: 'audio/Hindi_Male.mp3'
    }
  },
  {
    id: 'english',
    name: 'English',
    nativeScript: 'English (India)',
    code: 'EN-IN',
    color: 'from-blue-500 to-indigo-600',
    greeting: 'Hi, this is Dialora calling.',
    translation: 'Hi, this is Dialora calling.',
    audio: {
      female: 'audio/English_female.mp3',
      male: 'audio/English_Male.mp3'
    }
  },
  {
    id: 'telugu',
    name: 'Telugu',
    nativeScript: 'తెలుగు',
    code: 'TE-IN',
    color: 'from-emerald-500 to-teal-600',
    greeting: 'నమస్కారం, నేను డయలోరా.',
    translation: 'Namaskaram, this is Dialora.',
    audio: {
      female: 'audio/Telugu_female.mp3',
      male: 'audio/Telugu_Male.mp3'
    }
  },
  {
    id: 'gujarati',
    name: 'Gujarati',
    nativeScript: 'ગુજરાતી',
    code: 'GU-IN',
    color: 'from-orange-500 to-amber-600',
    greeting: 'નમસ્તે, હું ડાયલોરા.',
    translation: 'Namaste, this is Dialora.',
    audio: {
      female: 'audio/Gujrati_female.mp3',
      male: 'audio/Gujrati_Male.mp3'
    }
  },
  {
    id: 'tamil',
    name: 'Tamil',
    nativeScript: 'தமிழ்',
    code: 'TA-IN',
    color: 'from-red-500 to-orange-600',
    greeting: 'வணக்கம், நான் டயலோரா.',
    translation: 'Vanakkam, this is Dialora.',
    audio: {
      female: 'audio/Tamil_female.mp3',
      male: 'audio/Tamil_Male.mp3'
    }
  },
  {
    id: 'marathi',
    name: 'Marathi',
    nativeScript: 'मराठी',
    code: 'MR-IN',
    color: 'from-purple-500 to-indigo-600',
    greeting: 'नमस्कार, मी डायलोरा.',
    translation: 'Namaskar, this is Dialora.',
    audio: {
      female: 'audio/Marathi_female.mp3',
      male: 'audio/Marathi_Male.mp3'
    }
  },
  {
    id: 'kannada',
    name: 'Kannada',
    nativeScript: 'ಕನ್ನಡ',
    code: 'KN-IN',
    color: 'from-yellow-500 to-amber-600',
    greeting: 'ನಮಸ್ಕಾರ, ನಾನು ಡಯಲೋರಾ.',
    translation: 'Namaskara, this is Dialora.',
    audio: {
      female: 'audio/Kannada_female.mp3',
      male: 'audio/Kannada_Male.mp3'
    }
  },
  {
    id: 'malayalam',
    name: 'Malayalam',
    nativeScript: 'മലയാളം',
    code: 'ML-IN',
    color: 'from-teal-500 to-emerald-600',
    greeting: 'നമസ്കാരം, ഞാൻ ഡയലോറ.',
    translation: 'Namaskaram, this is Dialora.',
    audio: {
      female: 'audio/Malayalam_female.mp3',
      male: 'audio/Malayalam_Male.mp3'
    }
  },
  {
    id: 'bengali',
    name: 'Bengali',
    nativeScript: 'বাংলা',
    code: 'BN-IN',
    color: 'from-pink-500 to-rose-600',
    greeting: 'নমস্কার, আমি ডায়ালোরা।',
    translation: 'Nomoshkar, this is Dialora.',
    audio: {
      female: 'audio/Bengali_female.mp3',
      male: 'audio/Bengali_Male.mp3'
    }
  },
  {
    id: 'odia',
    name: 'Odia',
    nativeScript: 'ଓଡ଼ିଆ',
    code: 'OR-IN',
    color: 'from-cyan-500 to-blue-600',
    greeting: 'ନମସ୍କାର, ମୁଁ ଡାୟଲୋରା।',
    translation: 'Namaskara, this is Dialora.',
    audio: {
      female: 'audio/Odia_female.mp3',
      male: 'audio/Odia_Male.mp3'
    }
  }
];

export default function VoiceLab() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [gender, setGender] = useState<'female' | 'male'>('female');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isEjected, setIsEjected] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const activeVoice = VOICES[activeIdx];

  // Play/Pause current audio track
  const togglePlay = (index = activeIdx, currentGender = gender) => {
    const target = VOICES[index];
    const path = currentGender === 'female' ? target.audio.female : target.audio.male;
    const baseUrl = import.meta.env.BASE_URL || '/';
    const fullAudioPath = path.startsWith('/') ? `${baseUrl}${path.slice(1)}` : `${baseUrl}${path}`;

    if (isPlaying && index === activeIdx && currentGender === gender && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setIsEjected(false);
    setActiveIdx(index);

    const audio = new Audio(fullAudioPath);
    audioRef.current = audio;

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    audio.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.play().then(() => {
      setIsPlaying(true);
    }).catch((err) => {
      console.warn("Audio play blocked or unavailable:", err);
      setIsPlaying(false);
    });
  };

  // Change gender and immediately switch track if playing
  const handleGenderSwitch = (newGender: 'female' | 'male') => {
    setGender(newGender);
    if (isPlaying) {
      togglePlay(activeIdx, newGender);
    }
  };

  // Stop playback and reset
  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Eject disc tray
  const handleEject = () => {
    handleStop();
    setIsEjected(true);
  };

  // Previous Track
  const handlePrev = () => {
    const prevIdx = activeIdx === 0 ? VOICES.length - 1 : activeIdx - 1;
    setActiveIdx(prevIdx);
    if (isPlaying) {
      togglePlay(prevIdx, gender);
    }
  };

  // Next Track
  const handleNext = () => {
    const nextIdx = (activeIdx + 1) % VOICES.length;
    setActiveIdx(nextIdx);
    if (isPlaying) {
      togglePlay(nextIdx, gender);
    }
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '00:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="pt-28 pb-24 bg-[#080b11] text-slate-100 min-h-screen">
      
      {/* Header */}
      <section className="py-12 px-4 text-center relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#245ae2]/15 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <Badge className="mb-6">VOICE ARCHITECTURE</Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 text-white leading-tight">
            10 Indian &amp; Global Voices.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60a5fa] via-[#245ae2] to-[#93c5fd]">
              Optical DVD Sound Deck.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto mb-6">
            Select any language disc, toggle between male and female personas, and experience crystal-clear studio acoustics.
          </p>

          {/* Master Gender Pill */}
          <div className="inline-flex bg-[#0f1422] rounded-full p-1.5 border border-white/10 shadow-2xl">
            <button
              onClick={() => handleGenderSwitch('female')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                gender === 'female'
                  ? 'bg-[#245ae2] text-white shadow-[0_0_20px_rgba(36,90,226,0.6)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>♀</span> Female Voice
            </button>
            <button
              onClick={() => handleGenderSwitch('male')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                gender === 'male'
                  ? 'bg-[#245ae2] text-white shadow-[0_0_20px_rgba(36,90,226,0.6)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>♂</span> Male Voice
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* THE DVD AUDIO CONSOLE DECK                                    */}
      {/* ============================================================ */}
      <section className="px-4 max-w-5xl mx-auto mb-16">
        
        {/* DVD Player Housing Chassis */}
        <div className="bg-gradient-to-b from-[#141b2e] via-[#0d121f] to-[#080b11] border-2 border-[#245ae2]/40 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_0_80px_rgba(36,90,226,0.25)] relative overflow-hidden">
          
          {/* Top Chassis Details & Branding */}
          <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-8">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded bg-[#245ae2]/20 border border-[#245ae2]/40 font-mono text-[11px] font-bold text-[#93c5fd] uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#d6f549] animate-pulse" />
                DVD AUDIO OPTICAL DECK
              </div>
              <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                DOLBY DIGITAL STEREO // 48kHz 24-BIT
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="text-slate-500">DISC {activeIdx + 1} OF 10</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#245ae2]" />
              <span className="text-white font-bold uppercase">{gender}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left: The Spinning Holographic Optical DVD Disc */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center">
              
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
                
                {/* Laser Ray Beam Effect */}
                <div className={`absolute -top-6 right-10 w-2 h-32 bg-gradient-to-b from-[#60a5fa] to-transparent blur-[1px] rotate-45 pointer-events-none transition-opacity duration-300 ${
                  isPlaying ? 'opacity-80' : 'opacity-0'
                }`} />

                {/* Outer Glow Halo */}
                <div className={`absolute inset-0 rounded-full blur-2xl transition-all duration-500 ${
                  isPlaying ? 'bg-[#245ae2]/30 scale-105' : 'bg-transparent'
                }`} />

                {/* The Physical Optical DVD Disc */}
                <div
                  onClick={() => togglePlay()}
                  className={`relative w-full h-full rounded-full cursor-pointer select-none transition-all duration-700 shadow-2xl flex items-center justify-center border-4 border-slate-700/60 ${
                    isPlaying ? 'animate-[spin_6s_linear_infinite]' : ''
                  } ${isEjected ? 'scale-75 opacity-40 translate-y-6' : 'hover:scale-105'}`}
                  style={{
                    background: `
                      radial-gradient(circle at center, transparent 32%, rgba(0,0,0,0.7) 33%, transparent 35%),
                      repeating-radial-gradient(circle at center, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 2px, transparent 4px),
                      conic-gradient(from 0deg, #1e293b, #245ae2 60deg, #d6f549 120deg, #60a5fa 180deg, #ec4899 240deg, #06b6d4 300deg, #1e293b 360deg)
                    `
                  }}
                  title="Click disc to Play/Pause"
                >
                  {/* Prismatic Holographic Sheen Overlays */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/15 via-transparent to-black/40 pointer-events-none" />

                  {/* Concentric Mirror Ring */}
                  <div className="w-44 h-44 rounded-full border border-white/25 flex items-center justify-center bg-black/40 backdrop-blur-sm shadow-inner relative">
                    
                    {/* Disc Print Text */}
                    <div className="text-center px-2 pointer-events-none">
                      <div className="text-[10px] font-mono tracking-widest text-[#d6f549] font-bold uppercase">
                        DIALORA DVD
                      </div>
                      <div className="text-lg font-extrabold text-white tracking-tight leading-tight mt-0.5">
                        {activeVoice.name}
                      </div>
                      <div className="text-xs font-semibold text-slate-300">
                        {activeVoice.nativeScript}
                      </div>
                      <div className="text-[9px] font-mono text-[#93c5fd] uppercase tracking-wider mt-1">
                        {gender} VOCAL
                      </div>
                    </div>

                    {/* Center Polycarbonate Spindle Clamping Hole */}
                    <div className="absolute w-14 h-14 rounded-full bg-[#080b11] border-4 border-slate-600 shadow-2xl flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-slate-900 border border-white/30" />
                    </div>
                  </div>
                </div>

              </div>

              {/* Status Under Disc */}
              <div className="mt-4 text-xs font-mono text-slate-400 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                <span>{isPlaying ? `SPINNING: ${activeVoice.code}` : (isEjected ? 'TRAY OPEN / EJECTED' : 'READY IN DRIVE')}</span>
              </div>
            </div>

            {/* Right: VFD Digital Display Screen & Controls */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* DVD VFD Green-Blue Digital Display Screen */}
              <div className="bg-[#05080e] border-2 border-[#1e293b] rounded-2xl p-5 shadow-[inset_0_2px_15px_rgba(0,0,0,0.8)] relative font-mono text-cyan-400">
                <div className="flex items-center justify-between text-[11px] border-b border-cyan-900/40 pb-2 mb-3">
                  <span className="text-[#d6f549] font-bold flex items-center gap-1.5">
                    <span className={`inline-block w-2 h-2 rounded-full ${isPlaying ? 'bg-[#d6f549]' : 'bg-cyan-900'}`} />
                    {isPlaying ? 'PLAY' : (isEjected ? 'EJECT' : 'STOP')}
                  </span>
                  <span className="text-slate-400">{activeVoice.code}</span>
                  <span className="text-cyan-300 uppercase font-bold">{gender} VOICE</span>
                </div>

                {/* Large Track & Time Display */}
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <span className="text-xs text-slate-500 block">TRACK</span>
                    <span className="text-2xl sm:text-3xl font-bold tracking-wider text-white">
                      0{activeIdx + 1}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">ELAPSED / TOTAL</span>
                    <span className="text-xl sm:text-2xl font-bold tracking-wider text-[#60a5fa]">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                </div>

                {/* Spoken Audio Subtitle Display */}
                <div className="bg-black/50 p-3 rounded-xl border border-cyan-950/60 mb-3">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">
                    Spoken Dialogue
                  </div>
                  <div className="text-sm font-semibold text-white font-sans">
                    "{activeVoice.greeting}"
                  </div>
                  <div className="text-xs text-slate-400 font-sans italic mt-0.5">
                    "{activeVoice.translation}"
                  </div>
                </div>

                {/* Animated Audio Equalizer Spectrum */}
                <div className="flex items-end justify-between gap-1 h-8 pt-1">
                  {[...Array(24)].map((_, i) => (
                    <span
                      key={i}
                      className={`w-full rounded-sm transition-all duration-100 ${
                        isPlaying 
                          ? 'bg-gradient-to-t from-cyan-600 via-[#60a5fa] to-[#d6f549]' 
                          : 'bg-cyan-950/40 h-1'
                      }`}
                      style={isPlaying ? {
                        height: `${Math.max(10, Math.sin(i * 0.8 + currentTime * 10) * 85 + 15)}%`
                      } : {}}
                    />
                  ))}
                </div>
              </div>

              {/* Physical DVD Deck Buttons */}
              <div className="bg-[#0f1422] border border-white/10 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
                
                {/* Previous Button */}
                <button
                  onClick={handlePrev}
                  className="p-3 rounded-xl bg-[#141b2c] hover:bg-[#1d273f] text-slate-300 hover:text-white border border-white/5 transition-all shadow-md active:scale-95"
                  title="Previous Track (Prev Language)"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                  </svg>
                </button>

                {/* Master Play / Pause Button */}
                <button
                  onClick={() => togglePlay()}
                  className="flex-1 min-w-[140px] py-3.5 px-6 rounded-xl bg-[#245ae2] hover:bg-[#1d4ed8] text-white font-bold text-sm transition-all shadow-[0_0_25px_rgba(36,90,226,0.5)] active:scale-95 flex items-center justify-center gap-2"
                >
                  {isPlaying ? (
                    <>
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </svg>
                      <span>PAUSE</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      <span>PLAY DISC</span>
                    </>
                  )}
                </button>

                {/* Stop Button */}
                <button
                  onClick={handleStop}
                  className="p-3 rounded-xl bg-[#141b2c] hover:bg-[#1d273f] text-slate-300 hover:text-white border border-white/5 transition-all shadow-md active:scale-95"
                  title="Stop Audio"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M6 6h12v12H6z" />
                  </svg>
                </button>

                {/* Next Button */}
                <button
                  onClick={handleNext}
                  className="p-3 rounded-xl bg-[#141b2c] hover:bg-[#1d273f] text-slate-300 hover:text-white border border-white/5 transition-all shadow-md active:scale-95"
                  title="Next Track (Next Language)"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                  </svg>
                </button>

                {/* Eject Button */}
                <button
                  onClick={handleEject}
                  className={`p-3 rounded-xl border transition-all shadow-md active:scale-95 ${
                    isEjected 
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300' 
                      : 'bg-[#141b2c] hover:bg-[#1d273f] border-white/5 text-slate-400 hover:text-white'
                  }`}
                  title="Eject / Open Tray"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M5 17h14v2H5zm7-12L5.33 15h13.34z" />
                  </svg>
                </button>
              </div>

              {/* Bottom Direct Callback Link */}
              <div className="flex items-center justify-between text-xs pt-1 px-1">
                <span className="text-slate-400">Sub-500ms Audio Turnaround</span>
                <Link to="/demo" className="text-[#60a5fa] hover:text-white font-semibold transition-colors flex items-center gap-1">
                  Test On Your Phone &rarr;
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 10 VOICES DISC RACK (THE OPTICAL DISC SELECTOR)              */}
      {/* ============================================================ */}
      <section className="px-4 max-w-6xl mx-auto mb-20">
        <div className="text-center mb-10">
          <div className="inline-block px-3 py-1 rounded-full bg-[#245ae2]/10 border border-[#245ae2]/25 text-xs font-semibold text-[#60a5fa] mb-3">
            SELECT A VOICE DISC
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Pick from 10 Regional Language Discs
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Click any disc to insert it into the DVD player deck above.
          </p>
        </div>

        {/* 10 Language Disc Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {VOICES.map((v, idx) => {
            const isSelected = activeIdx === idx;
            const isCurrentPlaying = isPlaying && isSelected;

            return (
              <div
                key={v.id}
                onClick={() => togglePlay(idx, gender)}
                className={`rounded-2xl p-4 cursor-pointer transition-all duration-300 flex flex-col items-center text-center group relative overflow-hidden border ${
                  isSelected
                    ? 'bg-[#141b2c] border-[#245ae2] shadow-[0_0_25px_rgba(36,90,226,0.3)] scale-105'
                    : 'bg-[#0d121f] border-white/10 hover:border-white/20 hover:bg-[#101626]'
                }`}
              >
                {/* Mini Disc Icon */}
                <div
                  className={`w-14 h-14 rounded-full border-2 border-white/20 flex items-center justify-center mb-3 shadow-lg relative ${
                    isCurrentPlaying ? 'animate-[spin_4s_linear_infinite]' : 'group-hover:scale-110 transition-transform'
                  }`}
                  style={{
                    background: `
                      radial-gradient(circle at center, #080b11 25%, transparent 28%),
                      conic-gradient(from 0deg, #1e293b, #245ae2, #d6f549, #60a5fa, #ec4899, #1e293b)
                    `
                  }}
                >
                  <div className="w-4 h-4 rounded-full bg-[#080b11] border border-white/40" />
                </div>

                {/* Language Info */}
                <h3 className="text-sm font-bold text-white tracking-tight">
                  {v.name}
                </h3>
                <span className="text-xs text-slate-400 font-medium">
                  {v.nativeScript}
                </span>

                {/* Playing Indicator or Track # */}
                <div className="mt-3 pt-2 border-t border-white/5 w-full flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-500">TRK 0{idx + 1}</span>
                  <span className={isCurrentPlaying ? 'text-[#d6f549] font-bold' : 'text-[#60a5fa]'}>
                    {isCurrentPlaying ? 'PLAYING' : 'LOAD ⏏'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <TryItLiveCTA />
    </div>
  );
}


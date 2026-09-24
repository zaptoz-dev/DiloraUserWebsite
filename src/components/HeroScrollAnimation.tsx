import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export default function HeroScrollAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);

  const [tilt, setTilt] = useState({ rotateX: 16, scale: 0.94, translateY: 20 });
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });
  const [isPlayingWave, setIsPlayingWave] = useState(true);

  // Scroll listener to smoothly tilt console from 16deg -> 0deg as user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress of scroll through hero: 0 when at top, 1 when scrolled ~400px
      const scrolled = -rect.top;
      const scrollRange = windowHeight * 0.55;
      const progress = Math.max(0, Math.min(1, scrolled / scrollRange));

      // Interpolate 3D perspective
      const rotateX = 16 * (1 - progress);
      const scale = 0.94 + 0.06 * progress;
      const translateY = 20 * (1 - progress);

      setTilt({ rotateX, scale, translateY });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Subtle mouse movement parallax on desktop
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseTilt({ x: x * 6, y: -y * 6 });
  };

  const handleMouseLeave = () => {
    setMouseTilt({ x: 0, y: 0 });
  };

  // 24 waveform bar heights for fluid equalizer animation
  const waveformHeights = [
    24, 45, 78, 92, 60, 35, 88, 100, 72, 40, 95, 80,
    65, 40, 85, 98, 55, 30, 75, 90, 60, 42, 80, 50
  ];

  return (
    <section 
      ref={containerRef}
      className="relative pt-32 sm:pt-36 pb-20 px-4 overflow-hidden"
    >
      {/* Background ambient lighting - blends with site mesh & grid lines */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] sm:w-[1000px] h-[450px] bg-[#245ae2]/15 blur-[160px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-10 w-[400px] h-[350px] bg-[#9b66ff]/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* Hero Typography & CTAs */}
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10 mb-12 sm:mb-16">
        
        {/* Top Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#245ae2]/10 border border-[#245ae2]/30 mb-6 sm:mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(36,90,226,0.25)]">
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
        <p className="text-base sm:text-xl text-slate-400 mb-8 sm:mb-10 max-w-2xl leading-relaxed">
          Audeora answers, qualifies, schedules, and resolves calls in 10+ Indian and global languages—with the natural pace and tone of your best tele-caller.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link 
            to="/demo" 
            className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#245ae2] hover:bg-[#1d4ed8] px-8 py-4 rounded-full text-[15px] font-semibold text-white transition-all duration-300 shadow-[0_0_30px_rgba(36,90,226,0.4)] hover:shadow-[0_0_45px_rgba(36,90,226,0.6)] hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Get a demo call
          </Link>
          
          <Link 
            to="/voice-lab" 
            className="flex items-center justify-center gap-2 w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 px-8 py-4 rounded-full text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
          >
            Explore Voice Lab
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* Live Reliability Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="text-emerald-400">⚡</span> &lt;300ms Turnaround
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5">
            <span className="text-[#60a5fa]">🗣️</span> 10+ Indian Accents
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5">
            <span className="text-[#d6f549]">♾️</span> 5,000+ Parallel Calls
          </span>
        </div>
      </div>

      {/* 3D Perspective Tilt Enterprise Voice Console */}
      <div 
        className="max-w-6xl mx-auto"
        style={{ perspective: '1400px' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={consoleRef}
          style={{
            transform: `rotateX(${tilt.rotateX + mouseTilt.y}deg) rotateY(${mouseTilt.x}deg) scale(${tilt.scale}) translateY(${tilt.translateY}px)`,
            transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
            transformStyle: 'preserve-3d',
          }}
          className="relative rounded-3xl bg-[#090d16]/95 border border-[#245ae2]/40 shadow-[0_20px_80px_rgba(0,0,0,0.8),0_0_80px_rgba(36,90,226,0.22)] backdrop-blur-2xl overflow-hidden group"
        >
          {/* Top Window Bar */}
          <div className="px-5 py-3.5 border-b border-white/10 bg-[#0c1220]/80 flex items-center justify-between">
            {/* macOS Window Controls */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-500/30 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-500/30 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-500/30 inline-block" />
              <span className="text-[11px] font-mono text-slate-400 ml-3 hidden sm:inline">
                Audeora Voice Kernel v2.4 • SIP Trunk Session
              </span>
            </div>

            {/* Active Session Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE CALL SESSION ACTIVE</span>
            </div>

            {/* Latency & Telemetry */}
            <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-slate-300">
              <span className="text-[#d6f549] font-bold">240ms TURN</span>
              <span className="text-slate-600">//</span>
              <span className="text-[#60a5fa]">48kHz OPUS</span>
            </div>
          </div>

          {/* Main Console Body: Split into Dialogue Stream & Audio/CRM Intelligence */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            
            {/* Left 7 Columns: Live Call Dialogue Stream */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              
              {/* Caller Identification Ribbon */}
              <div className="flex items-center justify-between pb-5 border-b border-white/5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#245ae2] to-[#60a5fa] flex items-center justify-center font-bold text-white shadow-md">
                    VS
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white flex items-center gap-2">
                      <span>Vikram Sharma</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-white/10 text-slate-300 font-mono">+91 98201 •••••</span>
                    </div>
                    <div className="text-xs text-slate-400">Inbound Call • Mumbai, India</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-[#d6f549]">01:42 LIVE</div>
                  <div className="text-[11px] text-slate-400">Queue Time: 0.0s</div>
                </div>
              </div>

              {/* Turn-by-Turn Speech Bubbles */}
              <div className="space-y-4 text-xs sm:text-sm">
                
                {/* Caller Turn 1 */}
                <div className="flex items-start gap-3">
                  <span className="px-2 py-1 rounded bg-slate-800 text-slate-400 font-mono text-[10px] shrink-0 mt-1">CALLER</span>
                  <div className="bg-[#121829] border border-white/5 rounded-2xl rounded-tl-sm p-3.5 text-slate-200 max-w-lg leading-relaxed">
                    "Namaste, I run operations for a logistics firm. Can Audeora handle delivery confirmation calls in Hindi and Marathi during festive rush?"
                  </div>
                </div>

                {/* Audeora AI Agent Turn 1 */}
                <div className="flex items-start gap-3 justify-end">
                  <div className="bg-gradient-to-r from-[#245ae2]/25 to-[#1a3880]/40 border border-[#245ae2]/50 rounded-2xl rounded-tr-sm p-4 text-white max-w-lg shadow-[0_0_30px_rgba(36,90,226,0.15)] leading-relaxed">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#d6f549] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d6f549] animate-pulse" />
                        AUDEORA AGENT (240ms)
                      </span>
                      <span className="text-[10px] text-[#93c5fd] font-mono">Hindi Detected</span>
                    </div>
                    "Haanji Vikram ji! Audeora answers instantly without queues. We detect Hindi and Marathi in the first 2 seconds, verify delivery addresses, and update your CRM with zero agent fatigue. Would you like a live demo on your team’s numbers tomorrow?"
                  </div>
                  <span className="px-2 py-1 rounded bg-[#245ae2]/20 border border-[#245ae2]/30 text-[#93c5fd] font-mono text-[10px] shrink-0 mt-1">AI</span>
                </div>

                {/* Caller Turn 2 */}
                <div className="flex items-start gap-3">
                  <span className="px-2 py-1 rounded bg-slate-800 text-slate-400 font-mono text-[10px] shrink-0 mt-1">CALLER</span>
                  <div className="bg-[#121829] border border-white/5 rounded-2xl rounded-tl-sm p-3.5 text-slate-200 max-w-lg leading-relaxed">
                    "Yes, tomorrow at 3:00 PM works best for me."
                  </div>
                </div>

                {/* Audeora AI Agent Turn 2 */}
                <div className="flex items-start gap-3 justify-end">
                  <div className="bg-gradient-to-r from-[#245ae2]/25 to-[#1a3880]/40 border border-[#245ae2]/50 rounded-2xl rounded-tr-sm p-3.5 text-white max-w-lg shadow-[0_0_20px_rgba(36,90,226,0.15)] leading-relaxed">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#d6f549] font-bold mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d6f549] animate-pulse" />
                      AUDEORA AGENT (220ms)
                    </div>
                    "Done! I have booked your enterprise walkthrough for tomorrow at 3:00 PM IST and sent the calendar invite to your WhatsApp. Talk soon!"
                  </div>
                  <span className="px-2 py-1 rounded bg-[#245ae2]/20 border border-[#245ae2]/30 text-[#93c5fd] font-mono text-[10px] shrink-0 mt-1">AI</span>
                </div>

              </div>

              {/* Bottom Barge-in / Interrupt note */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Natural Interruption & Barge-in Enabled
                </span>
                <span className="font-mono text-[#93c5fd]">Lossless Turn-taking</span>
              </div>
            </div>

            {/* Right 5 Columns: Audio Waveform & CRM Intelligence */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-[#070b14]/70 flex flex-col justify-between">
              
              <div>
                {/* Waveform Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#d6f549] animate-ping" />
                    Live Full-Duplex Audio Stream
                  </div>
                  <button 
                    onClick={() => setIsPlayingWave(!isPlayingWave)}
                    className="text-[11px] font-mono text-[#60a5fa] hover:underline"
                  >
                    {isPlayingWave ? 'Pause Wave' : 'Resume'}
                  </button>
                </div>

                {/* Dynamic Real-time Audio Waveform Equalizer */}
                <div className="bg-[#0b101d] border border-white/10 rounded-2xl p-5 mb-6">
                  <div className="flex items-center justify-between h-20 gap-1 px-1">
                    {waveformHeights.map((h, i) => {
                      const isCenter = i >= 8 && i <= 16;
                      return (
                        <div
                          key={i}
                          className="flex-1 rounded-full transition-all duration-300"
                          style={{
                            height: isPlayingWave ? `${h}%` : '20%',
                            background: isCenter
                              ? 'linear-gradient(to top, #245ae2, #d6f549)'
                              : 'linear-gradient(to top, #1e3a8a, #60a5fa)',
                            opacity: isPlayingWave ? 0.9 : 0.4,
                            animation: isPlayingWave ? `pulse 1.${(i % 5) + 2}s infinite ease-in-out alternate` : 'none'
                          }}
                        />
                      );
                    })}
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Peak Clarity: 99.4%</span>
                    <span className="text-emerald-400 font-bold">Latency: 240ms (&lt;300ms)</span>
                  </div>
                </div>

                {/* Real-Time Extraction Cards */}
                <div className="space-y-3">
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                    Real-time CRM Entity Extraction
                  </div>

                  <div className="bg-[#0e1424] border border-white/5 rounded-xl p-3 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Caller Intent:</span>
                    <span className="font-semibold text-white px-2 py-0.5 rounded bg-[#245ae2]/20 border border-[#245ae2]/40 text-[#93c5fd]">
                      Demo Walkthrough
                    </span>
                  </div>

                  <div className="bg-[#0e1424] border border-white/5 rounded-xl p-3 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Calendar Action:</span>
                    <span className="font-semibold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                      Tomorrow 3:00 PM IST ✓
                    </span>
                  </div>

                  <div className="bg-[#0e1424] border border-white/5 rounded-xl p-3 flex items-center justify-between text-xs">
                    <span className="text-slate-400">CRM Dispatch:</span>
                    <span className="font-semibold text-[#d6f549] px-2 py-0.5 rounded bg-[#d6f549]/10 border border-[#d6f549]/30">
                      Salesforce & WhatsApp Synced
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Link to Live Voice Lab */}
              <div className="mt-6 pt-5 border-t border-white/5">
                <Link
                  to="/voice-lab"
                  className="w-full bg-[#245ae2]/20 hover:bg-[#245ae2]/30 border border-[#245ae2]/50 text-white rounded-xl py-3 px-4 flex items-center justify-between text-xs font-semibold transition-all group"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">🎙️</span>
                    <span>Listen to 10+ Native Voices in Voice Lab</span>
                  </span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </Link>
              </div>

            </div>

          </div>

          {/* Bottom Dock: 10 Indian Regional Languages */}
          <div className="px-6 py-4 bg-[#080c16] border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-400 font-mono text-[11px] uppercase tracking-wider">
              Native Languages Ready:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {['Hindi (हिन्दी)', 'English (IN)', 'Telugu (తెలుగు)', 'Tamil (தமிழ்)', 'Gujarati (ગુજરાતી)', 'Marathi (मराठी)', 'Kannada (ಕನ್ನಡ)', 'Malayalam (മലയാളം)', 'Bengali (বাংলা)', 'Odia (ଓଡ଼ିଆ)'].map((lang, idx) => (
                <span 
                  key={idx}
                  className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-medium transition-colors"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

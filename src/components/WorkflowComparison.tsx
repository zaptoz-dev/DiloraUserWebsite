import { useState, useEffect, useRef } from 'react';

interface Step {
  num: string;
  title: string;
  badgeWithout: { label: string; type: 'human' | 'automated' };
  badgeWith: { label: string; type: 'agent' | 'automated' | 'human' };
  icon: string;
}

const STEPS: Step[] = [
  {
    num: 'Step 1',
    title: 'Call Intake & Greeting',
    badgeWithout: { label: 'Human', type: 'human' },
    badgeWith: { label: 'Agent', type: 'agent' },
    icon: '📞'
  },
  {
    num: 'Step 2',
    title: 'Language & Intent',
    badgeWithout: { label: 'Automated', type: 'automated' },
    badgeWith: { label: 'Automated', type: 'automated' },
    icon: '🌐'
  },
  {
    num: 'Step 3',
    title: 'Identity & Context',
    badgeWithout: { label: 'Human', type: 'human' },
    badgeWith: { label: 'Agent', type: 'agent' },
    icon: '🔍'
  },
  {
    num: 'Step 4',
    title: 'Query Resolution',
    badgeWithout: { label: 'Human', type: 'human' },
    badgeWith: { label: 'Agent', type: 'agent' },
    icon: '⚡'
  },
  {
    num: 'Step 5',
    title: 'Edge Exceptions',
    badgeWithout: { label: 'Human', type: 'human' },
    badgeWith: { label: 'Human', type: 'human' },
    icon: '👤'
  },
  {
    num: 'Step 6',
    title: 'CRM Disposition',
    badgeWithout: { label: 'Automated', type: 'automated' },
    badgeWith: { label: 'Automated', type: 'automated' },
    icon: '📋'
  }
];

export default function WorkflowComparison() {
  const [withDialora, setWithDialora] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-toggle demonstration when scrolled into view
  useEffect(() => {
    let interval: any;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Toggle gently every 5 seconds to showcase both states
          interval = setInterval(() => {
            setWithDialora((prev) => !prev);
          }, 6000);
        } else {
          if (interval) clearInterval(interval);
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      if (interval) clearInterval(interval);
    };
  }, []);

  return (
    <section ref={containerRef} className="py-28 px-4 w-full bg-[#080b11] relative overflow-hidden border-t border-white/5">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] bg-[#245ae2]/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#245ae2]/10 border border-[#245ae2]/30 mb-5">
            <span className="w-2 h-2 rounded-full bg-[#d6f549] animate-pulse" />
            <span className="text-xs font-semibold text-[#93c5fd] uppercase tracking-wider">
              Workflow Transformation
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            How your operation evolves
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            See the shift from linear human bottlenecks to continuous, self-improving autonomous calling.
          </p>
        </div>

        {/* The Toggle Switch (Replicating user image exactly) */}
        <div className="flex items-center justify-center gap-5 mb-16 select-none">
          <span 
            onClick={() => setWithDialora(false)}
            className={`text-base sm:text-lg font-bold transition-all duration-300 cursor-pointer ${
              !withDialora ? 'text-white' : 'text-slate-500 hover:text-slate-400'
            }`}
          >
            Without Dialora
          </span>

          {/* Interactive Toggle Pill */}
          <button
            onClick={() => setWithDialora(!withDialora)}
            className={`relative w-20 h-10 rounded-full p-1 transition-all duration-500 border ${
              withDialora 
                ? 'bg-[#1847bd] border-[#245ae2] shadow-[0_0_25px_rgba(36,90,226,0.6)]' 
                : 'bg-[#141926] border-white/20 shadow-inner'
            }`}
            aria-label="Toggle workflow comparison"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 transform ${
                withDialora
                  ? 'translate-x-10 bg-[#245ae2] text-white shadow-md'
                  : 'translate-x-0 bg-white text-slate-800 shadow-md'
              }`}
            >
              {withDialora ? (
                /* Sparkle Icon */
                <svg className="w-4 h-4 text-white animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                </svg>
              ) : (
                <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              )}
            </div>
          </button>

          <span 
            onClick={() => setWithDialora(true)}
            className={`text-base sm:text-lg font-bold transition-all duration-300 cursor-pointer ${
              withDialora ? 'text-[#3b82f6]' : 'text-slate-500 hover:text-slate-400'
            }`}
          >
            With Dialora
          </span>
        </div>

        {/* Dynamic Display Area */}
        <div className="w-full min-h-[440px] flex items-center justify-center relative">
          
          {/* ============================================================ */}
          {/* STATE 1: WITHOUT DIALORA (Linear Chain with Human Bottlenecks) */}
          {/* ============================================================ */}
          {!withDialora && (
            <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
              
              {/* Bottleneck Warning Banner */}
              <div className="mb-10 px-5 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-3 text-xs sm:text-sm text-amber-300">
                <span className="text-base">⚠️</span>
                <span>
                  <strong>Traditional Operation:</strong> 4 of 6 steps require human staff. Queue hold times average 8-12 minutes.
                </span>
              </div>

              {/* Horizontal Chain of 6 Steps */}
              <div className="w-full overflow-x-auto pb-6 scrollbar-none">
                <div className="flex items-center justify-center gap-3 min-w-[980px] px-4">
                  {STEPS.map((step, idx) => (
                    <div key={idx} className="flex items-center">
                      
                      {/* Step Card */}
                      <div className="w-[155px] bg-[#0f1422] border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col justify-between h-[125px] hover:border-white/20 transition-all">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono text-slate-400">{step.num}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            step.badgeWithout.type === 'human'
                              ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
                              : 'bg-slate-700/40 border border-slate-600 text-slate-300'
                          }`}>
                            {step.badgeWithout.label}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-lg">{step.icon}</span>
                          <h4 className="text-xs font-bold text-white leading-snug">
                            {step.title}
                          </h4>
                        </div>
                      </div>

                      {/* Right Arrow (except last step) */}
                      {idx < STEPS.length - 1 && (
                        <div className="px-2 text-slate-600">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STATE 2: WITH DIALORA (The Infinity Loop - Figure-8) */}
          {/* ============================================================ */}
          {withDialora && (
            <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
              
              {/* Success Badge */}
              <div className="mb-8 px-5 py-2.5 rounded-2xl bg-[#245ae2]/15 border border-[#245ae2]/35 flex items-center gap-3 text-xs sm:text-sm text-[#93c5fd]">
                <span className="text-base">⚡</span>
                <span>
                  <strong>Autonomous Infinity Loop:</strong> 85%+ handled instantly by Voice Agents & Automation. Zero hold times.
                </span>
              </div>

              {/* Responsive Container for Infinity Loop */}
              <div className="relative w-full max-w-5xl h-[380px] sm:h-[440px] md:h-[480px] flex items-center justify-center">
                
                {/* SVG Infinity Loop Curve */}
                <svg 
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 1000 480" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="infinityGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#245ae2" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#60a5fa" stopOpacity="1" />
                      <stop offset="100%" stopColor="#245ae2" stopOpacity="0.8" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Faint background track */}
                  <path 
                    d="M 280 240 C 130 90, 80 390, 280 240 C 480 90, 520 390, 720 240 C 920 90, 870 390, 720 240 C 520 90, 480 390, 280 240 Z" 
                    stroke="rgba(255,255,255,0.06)" 
                    strokeWidth="32" 
                    fill="none" 
                  />

                  {/* Flowing Dashed Line */}
                  <path 
                    d="M 280 240 C 130 90, 80 390, 280 240 C 480 90, 520 390, 720 240 C 920 90, 870 390, 720 240 C 520 90, 480 390, 280 240 Z" 
                    stroke="url(#infinityGrad)" 
                    strokeWidth="3" 
                    strokeDasharray="10 10" 
                    className="animate-dash-flow" 
                    fill="none" 
                    filter="url(#glow)"
                  />
                </svg>

                {/* 6 Step Cards Positioned Along the Infinity Loop */}
                
                {/* Step 1: Top-Left */}
                <div className="absolute top-[8%] left-[4%] sm:left-[8%] md:left-[12%]">
                  <div className="w-[145px] sm:w-[170px] bg-[#0f1422]/95 border border-[#245ae2]/40 rounded-2xl p-3.5 sm:p-4 shadow-2xl backdrop-blur-xl hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-slate-400">Step 1</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#d6f549] text-black">
                        Agent
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base">{STEPS[0].icon}</span>
                      <h4 className="text-[11px] sm:text-xs font-bold text-white leading-tight">
                        {STEPS[0].title}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Step 2: Center-Left */}
                <div className="absolute top-[28%] left-[28%] sm:left-[30%] md:left-[32%]">
                  <div className="w-[145px] sm:w-[170px] bg-[#0f1422]/95 border border-white/10 rounded-2xl p-3.5 sm:p-4 shadow-2xl backdrop-blur-xl hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-slate-400">Step 2</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-700/60 text-slate-200">
                        Automated
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base">{STEPS[1].icon}</span>
                      <h4 className="text-[11px] sm:text-xs font-bold text-white leading-tight">
                        {STEPS[1].title}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Step 3: Bottom-Center Right */}
                <div className="absolute bottom-[10%] right-[32%] sm:right-[34%] md:right-[36%]">
                  <div className="w-[145px] sm:w-[170px] bg-[#0f1422]/95 border border-[#245ae2]/40 rounded-2xl p-3.5 sm:p-4 shadow-2xl backdrop-blur-xl hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-slate-400">Step 3</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#d6f549] text-black">
                        Agent
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base">{STEPS[2].icon}</span>
                      <h4 className="text-[11px] sm:text-xs font-bold text-white leading-tight">
                        {STEPS[2].title}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Step 4: Far-Right */}
                <div className="absolute top-[46%] right-[2%] sm:right-[6%] md:right-[10%]">
                  <div className="w-[145px] sm:w-[170px] bg-[#0f1422]/95 border border-[#245ae2]/40 rounded-2xl p-3.5 sm:p-4 shadow-2xl backdrop-blur-xl hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-slate-400">Step 4</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#d6f549] text-black">
                        Agent
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base">{STEPS[3].icon}</span>
                      <h4 className="text-[11px] sm:text-xs font-bold text-white leading-tight">
                        {STEPS[3].title}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Step 5: Top-Right (Human Handoff Exception) */}
                <div className="absolute top-[8%] right-[20%] sm:right-[24%] md:right-[28%]">
                  <div className="w-[145px] sm:w-[170px] bg-[#0f1422]/95 border border-amber-500/30 rounded-2xl p-3.5 sm:p-4 shadow-2xl backdrop-blur-xl hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-slate-400">Step 5</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Human
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base">{STEPS[4].icon}</span>
                      <h4 className="text-[11px] sm:text-xs font-bold text-white leading-tight">
                        {STEPS[4].title}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Step 6: Bottom-Left */}
                <div className="absolute bottom-[10%] left-[8%] sm:left-[12%] md:left-[16%]">
                  <div className="w-[145px] sm:w-[170px] bg-[#0f1422]/95 border border-white/10 rounded-2xl p-3.5 sm:p-4 shadow-2xl backdrop-blur-xl hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-slate-400">Step 6</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-700/60 text-slate-200">
                        Automated
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base">{STEPS[5].icon}</span>
                      <h4 className="text-[11px] sm:text-xs font-bold text-white leading-tight">
                        {STEPS[5].title}
                      </h4>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}

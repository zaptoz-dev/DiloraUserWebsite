import { useState, useEffect } from 'react';

const USE_CASES = [
  { id: 'real-estate', label: 'Real Estate' },
  { id: 'hr', label: 'Human Resources' },
  { id: 'retail', label: 'Retail' },
  { id: 'legal', label: 'Legal' },
  { id: 'sales', label: 'Sales Teams' },
  { id: 'services', label: 'Services' },
  { id: 'healthcare', label: 'Healthcare' }
];

export default function InteractiveUseCase() {
  const [activeCase, setActiveCase] = useState(USE_CASES[0]);
  const [callState, setCallState] = useState<'idle' | 'connecting' | 'connected'>('idle');

  useEffect(() => {
    if (callState === 'connecting') {
      const timer = setTimeout(() => {
        setCallState('connected');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [callState]);

  const handleConnect = () => setCallState('connecting');
  const handleDisconnect = () => setCallState('idle');

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
            See Dialora in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60a5fa] to-[#245ae2]">Your Industry</span>
          </h2>
          
          <p className="text-base sm:text-lg text-slate-400 mb-10 leading-relaxed">
            Select an industry below and initiate a simulated live call to experience how our voice agent handles sector-specific workflows naturally.
          </p>

          <div className="flex flex-wrap gap-3">
            {USE_CASES.map((uc) => {
              const isActive = activeCase.id === uc.id;
              return (
                <button
                  key={uc.id}
                  onClick={() => {
                    setActiveCase(uc);
                    if (callState !== 'idle') setCallState('idle');
                  }}
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

        {/* Right Side: The Simulation Glass Card */}
        <div className="relative w-full aspect-square md:aspect-[4/3] rounded-[2rem] bg-[#0f1422] border border-white/10 shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center p-8 overflow-hidden">
          
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#245ae2]/15 rounded-full blur-[80px] pointer-events-none" />

          {callState === 'idle' && (
            <div className="animate-in fade-in duration-500 flex flex-col items-center text-center z-10 w-full">
              <div className="w-20 h-20 rounded-full bg-[#245ae2] flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(36,90,226,0.5)]">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{activeCase.label} AI Agent</h3>
              <p className="text-slate-400 text-sm mb-10 max-w-[260px]">
                Test how Dialora handles {activeCase.label.toLowerCase()} customer conversations naturally.
              </p>
              <button 
                onClick={handleConnect}
                className="w-full max-w-[280px] bg-[#245ae2] hover:bg-[#1d4ed8] text-white font-bold py-4 px-8 rounded-xl transition-all shadow-[0_0_25px_rgba(36,90,226,0.35)] hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5"
              >
                <div className="w-2 h-2 rounded-full bg-[#d6f549] animate-pulse" />
                Start Live Simulation
              </button>
            </div>
          )}

          {callState === 'connecting' && (
            <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center justify-center z-10">
              <div className="relative flex items-center justify-center w-28 h-28 mb-8">
                <div className="absolute inset-0 border-4 border-[#245ae2]/20 rounded-full animate-ping" />
                <div className="absolute inset-0 border-4 border-[#245ae2] rounded-full border-t-transparent animate-spin" />
                <div className="w-20 h-20 bg-[#245ae2]/10 rounded-full flex items-center justify-center backdrop-blur-md">
                  <svg className="w-8 h-8 text-[#60a5fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Connecting...</h3>
              <p className="text-[#60a5fa] text-sm uppercase tracking-widest font-mono">Simulating session</p>
            </div>
          )}

          {callState === 'connected' && (
            <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center justify-center w-full z-10">
              <div className="relative mb-10">
                <div className="absolute -inset-6 bg-[#245ae2]/30 blur-2xl rounded-full animate-orb-pulse" />
                <div className="relative w-32 h-32 bg-[#080b11] rounded-full border border-white/20 flex items-center justify-center shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center gap-1.5">
                    {[...Array(6)].map((_, i) => (
                      <div 
                        key={i}
                        className="w-1.5 bg-[#60a5fa] rounded-full"
                        style={{
                          height: `${30 + Math.random() * 70}%`,
                          animation: `waveform ${0.4 + Math.random() * 0.4}s ease-in-out infinite alternate ${i * 0.15}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-8">Agent is Listening...</h3>
              
              <button 
                onClick={handleDisconnect}
                className="bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white p-4 rounded-full transition-all mb-8 shadow-inner"
                title="End Call"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold">
                This calling live demo supports English and Hindi
              </p>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}

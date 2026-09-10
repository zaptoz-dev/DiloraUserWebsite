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
          <div className="flex items-center gap-2 text-[#00a3ff] font-bold tracking-widest text-xs uppercase mb-6">
            <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Interactive Demo
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white leading-tight">
            See Dialora in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a3ff] to-[#9b66ff]">Your Industry</span>
          </h2>
          
          <p className="text-lg text-gray-400 mb-10 leading-relaxed">
            Select a use case below and instantly initiate a simulated live call to experience how our AI handles industry-specific scenarios.
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
                      ? 'bg-[#00a3ff]/10 border-[#00a3ff]/30 text-[#00a3ff] shadow-[0_0_15px_rgba(0,163,255,0.15)]' 
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                    isActive ? 'border-[#00a3ff]' : 'border-gray-500'
                  }`}>
                    {isActive && <div className="w-1.5 h-1.5 bg-[#00a3ff] rounded-full" />}
                  </div>
                  {uc.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: The Simulation Glass Card */}
        <div className="relative w-full aspect-square md:aspect-[4/3] rounded-[2rem] bg-gradient-to-br from-[#1a1333]/80 to-[#0d061c]/80 border border-white/10 shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center p-8 overflow-hidden">
          
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#00a3ff]/10 rounded-full blur-[80px] pointer-events-none" />

          {callState === 'idle' && (
            <div className="animate-in fade-in duration-500 flex flex-col items-center text-center z-10 w-full">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00a3ff] to-[#5828dc] flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,163,255,0.3)]">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{activeCase.label} AI Agent</h3>
              <p className="text-gray-400 text-sm mb-10 max-w-[250px]">
                Start a live simulated call to see how Dialora handles inquiries and support perfectly.
              </p>
              <button 
                onClick={handleConnect}
                className="w-full max-w-[280px] bg-white text-black font-bold py-4 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Start Live Simulation
              </button>
            </div>
          )}

          {callState === 'connecting' && (
            <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center justify-center z-10">
              <div className="relative flex items-center justify-center w-28 h-28 mb-8">
                <div className="absolute inset-0 border-4 border-[#00a3ff]/20 rounded-full animate-ping" />
                <div className="absolute inset-0 border-4 border-[#00a3ff] rounded-full border-t-transparent animate-spin" />
                <div className="w-20 h-20 bg-[#00a3ff]/10 rounded-full flex items-center justify-center backdrop-blur-md">
                  <svg className="w-8 h-8 text-[#00a3ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Connecting...</h3>
              <p className="text-[#00a3ff] text-sm uppercase tracking-widest">Establishing session</p>
            </div>
          )}

          {callState === 'connected' && (
            <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center justify-center w-full z-10">
              <div className="relative mb-10">
                <div className="absolute -inset-6 bg-gradient-to-br from-[#00a3ff] to-[#9b66ff] opacity-40 blur-2xl rounded-full animate-orb-pulse" />
                <div className="relative w-32 h-32 bg-[#090412]/80 rounded-full border border-white/20 flex items-center justify-center shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center gap-1.5">
                    {[...Array(6)].map((_, i) => (
                      <div 
                        key={i}
                        className="w-1.5 bg-[#00a3ff] rounded-full"
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

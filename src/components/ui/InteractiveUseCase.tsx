import { useState, useEffect } from 'react';

const USE_CASES = [
  { 
    id: 'real-estate', 
    label: 'Real Estate', 
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeefa?auto=format&fit=crop&q=80&w=1200',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  },
  { 
    id: 'hr', 
    label: 'Human Resources', 
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  },
  { 
    id: 'retail', 
    label: 'Retail', 
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  },
  { 
    id: 'legal', 
    label: 'Legal', 
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1200',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
  },
  { 
    id: 'sales', 
    label: 'Sales Teams', 
    image: 'https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&q=80&w=1200',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  },
  { 
    id: 'services', 
    label: 'Services', 
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  },
  { 
    id: 'healthcare', 
    label: 'Healthcare', 
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  }
];

export default function InteractiveUseCase() {
  const [activeCase, setActiveCase] = useState(USE_CASES[0]);
  const [callState, setCallState] = useState<'idle' | 'connecting' | 'connected'>('idle');
  const [language, setLanguage] = useState<'english' | 'hindi'>('english');

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
    <section className="py-24 px-4 w-full relative">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        
        {/* Header section */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center p-1.5 mb-6 rounded-full bg-[#00a3ff]/10 border border-[#00a3ff]/20">
            <span className="px-4 py-1.5 rounded-full bg-[#00a3ff] text-white text-xs font-bold uppercase tracking-wider">
              Live Agent Simulation
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white leading-tight">
            See Dialora in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a3ff] to-[#9b66ff]">Your Industry</span>
          </h2>
          <p className="text-lg text-gray-400">
            Select a use case below and instantly initiate a simulated live call to experience how our AI handles industry-specific scenarios perfectly.
          </p>
        </div>

        {/* The Massive Interactive Stage */}
        <div className="relative w-full h-[650px] md:h-[700px] rounded-[40px] overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(0,163,255,0.08)] bg-[#090412]">
          
          {/* Background Image transitioning */}
          {USE_CASES.map((uc) => (
            <img 
              key={uc.id}
              src={uc.image} 
              alt={uc.label}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
                activeCase.id === uc.id 
                  ? (callState === 'idle' ? 'opacity-70 scale-100' : 'opacity-20 blur-md grayscale scale-105') 
                  : 'opacity-0 scale-95'
              }`}
            />
          ))}
          
          {/* Gradient Overlay for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090412] via-[#090412]/50 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#090412]/80 via-transparent to-transparent pointer-events-none" />

          {/* The "Dock" of Use Cases at the top */}
          <div className="absolute top-8 left-0 right-0 px-4 md:px-8 flex justify-center z-20">
            <div className="flex flex-wrap justify-center gap-2 bg-[#1a1333]/80 backdrop-blur-xl p-2 rounded-[2rem] border border-white/10 shadow-2xl max-w-5xl">
              {USE_CASES.map((uc) => {
                const isActive = activeCase.id === uc.id;
                return (
                  <button
                    key={uc.id}
                    onClick={() => {
                      setActiveCase(uc);
                      if (callState !== 'idle') setCallState('idle');
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 text-sm font-semibold whitespace-nowrap ${
                      isActive 
                        ? 'bg-[#00a3ff] text-white shadow-[0_0_20px_rgba(0,163,255,0.4)]' 
                        : 'bg-transparent text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {uc.icon}
                    </svg>
                    {uc.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* The Center Interaction Box */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pt-16">
            
            {callState === 'idle' && (
              <div className="animate-in fade-in zoom-in duration-700 flex flex-col items-center">
                <div className="bg-[#1a1333]/40 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00a3ff] to-[#5828dc] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,163,255,0.4)]">
                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{activeCase.label} AI Agent</h3>
                  <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                    Start a live simulated call to see how Dialora handles {activeCase.label.toLowerCase()} inquiries, bookings, and support perfectly.
                  </p>
                  <button 
                    onClick={handleConnect}
                    className="w-full bg-white text-[#090412] hover:bg-gray-100 font-bold py-4 px-8 rounded-2xl transition-all shadow-xl hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Start Live Simulation
                  </button>
                </div>
              </div>
            )}

            {callState === 'connecting' && (
              <div className="flex flex-col items-center justify-center w-full h-full animate-in fade-in duration-500">
                <div className="relative flex items-center justify-center w-32 h-32 mb-8">
                  <div className="absolute inset-0 border-4 border-[#00a3ff]/20 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
                  <div className="absolute inset-2 border-4 border-[#9b66ff]/40 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite_0.5s]" />
                  <div className="absolute inset-0 border-4 border-[#00a3ff] rounded-full border-t-transparent border-l-transparent animate-spin" />
                  <div className="w-24 h-24 bg-[#1a1333]/90 rounded-full flex items-center justify-center backdrop-blur-xl shadow-[0_0_50px_rgba(0,163,255,0.3)]">
                    <svg className="w-10 h-10 text-[#00a3ff] animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-3">Connecting to Dialora...</h3>
                <p className="text-[#00a3ff] font-medium tracking-widest uppercase text-sm">Establishing secure AI session</p>
              </div>
            )}

            {callState === 'connected' && (
              <div className="flex flex-col items-center justify-center w-full h-full animate-in zoom-in-95 duration-500">
                <div className="relative mb-12">
                  <div className="absolute -inset-8 bg-gradient-to-br from-[#00a3ff] to-[#9b66ff] opacity-40 blur-3xl rounded-full animate-orb-pulse" />
                  <div className="relative w-40 h-40 bg-[#090412]/90 rounded-[2rem] border border-white/20 flex flex-col items-center justify-center backdrop-blur-2xl shadow-2xl rotate-45">
                    <div className="flex items-center gap-2 -rotate-45">
                      {[...Array(6)].map((_, i) => (
                        <div 
                          key={i}
                          className="w-2 bg-gradient-to-t from-[#00a3ff] to-[#9b66ff] rounded-full shadow-[0_0_10px_rgba(0,163,255,0.6)]"
                          style={{
                            height: `${30 + Math.random() * 70}%`,
                            animation: `waveform ${0.4 + Math.random() * 0.4}s ease-in-out infinite alternate ${i * 0.15}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-3 tracking-tight drop-shadow-lg">Agent is Listening...</h3>
                <p className="text-gray-300 mb-10 text-lg">Change language dynamically</p>

                <div className="flex items-center gap-3 bg-[#1a1333]/90 backdrop-blur-2xl p-2.5 rounded-full border border-white/10 shadow-2xl">
                  <button 
                    onClick={() => setLanguage('english')}
                    className={`px-8 py-3.5 rounded-full text-[15px] font-bold transition-all ${
                      language === 'english' 
                        ? 'bg-gradient-to-r from-[#00a3ff] to-[#0082cc] text-white shadow-[0_0_20px_rgba(0,163,255,0.4)]' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    English
                  </button>
                  <button 
                    onClick={() => setLanguage('hindi')}
                    className={`px-8 py-3.5 rounded-full text-[15px] font-bold transition-all ${
                      language === 'hindi' 
                        ? 'bg-gradient-to-r from-[#00a3ff] to-[#0082cc] text-white shadow-[0_0_20px_rgba(0,163,255,0.4)]' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Hindi
                  </button>
                  <div className="w-[1px] h-8 bg-white/10 mx-2" />
                  <button 
                    onClick={handleDisconnect}
                    className="p-3.5 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all mr-1 group shadow-inner"
                    title="End Call"
                  >
                    <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}

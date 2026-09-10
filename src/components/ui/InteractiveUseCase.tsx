import { useState, useEffect } from 'react';

const USE_CASES = [
  { id: 'real-estate', label: 'Real Estate', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeefa?auto=format&fit=crop&q=80&w=800' },
  { id: 'hr', label: 'Human Resources', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800' },
  { id: 'retail', label: 'Retail', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800' },
  { id: 'legal', label: 'Legal', image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800' },
  { id: 'sales', label: 'Sales Teams', image: 'https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&q=80&w=800' },
  { id: 'services', label: 'Services/Utilities', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800' },
  { id: 'hospitality', label: 'Hospitality', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800' },
  { id: 'education', label: 'Education', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800' },
  { id: 'healthcare', label: 'Healthcare', image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800' }
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
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Side: Text and Selector Grid */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-[#00a3ff] font-medium mb-4">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="tracking-wide text-lg">Use-Cases</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tight mb-10 text-white">
            Built for Small Business Owners, Agencies, and SaaS Founders
          </h2>

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
                  className={`flex items-center gap-3 px-5 py-3 rounded-full border transition-all duration-300 text-[15px] font-medium ${
                    isActive 
                      ? 'border-[#00a3ff]/50 bg-[#00a3ff]/10 text-[#00a3ff]' 
                      : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
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

        {/* Right Side: Interactive Image Container */}
        <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#110b29]">
          <img 
            src={activeCase.image} 
            alt={activeCase.label}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${callState === 'idle' ? 'opacity-80 scale-100' : 'opacity-30 blur-sm grayscale scale-105'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d061c] via-[#0d061c]/40 to-transparent opacity-90" />

          <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 px-4 z-10">
            {callState === 'idle' && (
              <div className="bg-[#1a1333]/60 backdrop-blur-md border border-white/10 p-2 rounded-full shadow-2xl flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <button 
                  onClick={handleConnect}
                  className="bg-[#00a3ff] hover:bg-[#0082cc] text-white font-bold py-3 px-8 rounded-full transition-all shadow-[0_0_20px_rgba(0,163,255,0.4)] hover:shadow-[0_0_30px_rgba(0,163,255,0.6)] hover:scale-105 active:scale-95"
                >
                  Hear the Agent in Action
                </button>
              </div>
            )}

            {callState === 'connecting' && (
              <div className="flex flex-col items-center justify-center w-full h-full mb-12 animate-in fade-in duration-500">
                <div className="relative flex items-center justify-center w-24 h-24 mb-6">
                  <div className="absolute inset-0 border-4 border-[#00a3ff]/30 rounded-full animate-ping" />
                  <div className="absolute inset-0 border-4 border-[#00a3ff] rounded-full border-t-transparent animate-spin" />
                  <div className="w-16 h-16 bg-[#00a3ff]/20 rounded-full flex items-center justify-center backdrop-blur-md">
                    <svg className="w-8 h-8 text-[#00a3ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Connecting to Agent...</h3>
                <p className="text-gray-400">Initiating live voice session</p>
              </div>
            )}

            {callState === 'connected' && (
              <div className="flex flex-col items-center justify-center w-full h-full mb-8 animate-in zoom-in-95 duration-500">
                <div className="relative mb-8">
                  <div className="absolute -inset-4 bg-gradient-to-br from-[#00a3ff] to-[#9b66ff] opacity-40 blur-2xl rounded-full animate-orb-pulse" />
                  <div className="relative w-32 h-32 bg-[#1a1333]/90 rounded-full border border-white/20 flex flex-col items-center justify-center backdrop-blur-xl shadow-2xl">
                    <div className="flex items-center gap-1.5 h-8">
                      {[...Array(8)].map((_, i) => (
                        <div 
                          key={i}
                          className="w-1.5 bg-[#00a3ff] rounded-full"
                          style={{
                            height: `${30 + Math.random() * 70}%`,
                            animation: `waveform ${0.5 + Math.random() * 0.5}s ease-in-out infinite alternate ${i * 0.1}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Agent is active</h3>
                <p className="text-gray-400 mb-8">Choose your preferred language</p>

                <div className="flex items-center gap-3 bg-[#1a1333]/80 backdrop-blur-md p-2 rounded-full border border-white/10">
                  <button 
                    onClick={() => setLanguage('english')}
                    className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                      language === 'english' 
                        ? 'bg-[#00a3ff] text-white shadow-lg' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    English
                  </button>
                  <button 
                    onClick={() => setLanguage('hindi')}
                    className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                      language === 'hindi' 
                        ? 'bg-[#00a3ff] text-white shadow-lg' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Hindi
                  </button>
                  <div className="w-[1px] h-6 bg-white/10 mx-1" />
                  <button 
                    onClick={handleDisconnect}
                    className="p-2.5 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-all mr-1 group"
                    title="End Call"
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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

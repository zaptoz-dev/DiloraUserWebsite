import { useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import GlassCard from '../components/ui/GlassCard';

export default function VoiceLab() {
  const [voiceType, setVoiceType] = useState<'female' | 'male'>('female');
  const [playingLang, setPlayingLang] = useState<string | null>(null);

  const languages = [
    { lang: "Hindi", script: "हिन्दी", text: "नमस्ते! मैं दिलोरा बोल रही हूँ।" },
    { lang: "English", script: "English (IN)", text: "Hi, this is Dilora calling." },
    { lang: "Tamil", script: "தமிழ்", text: "வணக்கம், நான் திலோரா." },
    { lang: "Telugu", script: "తెలుగు", text: "నమస్కారం, నేను దిలోరా." },
    { lang: "Kannada", script: "ಕನ್ನಡ", text: "ನಮಸ್ಕಾರ, ನಾನು ದಿಲೋರಾ." },
    { lang: "Malayalam", script: "മലയാളം", text: "നമസ്കാരം, ഞാൻ ദിലോറ." },
    { lang: "Marathi", script: "मराठी", text: "नमस्कार, मी दिलोरा." },
    { lang: "Gujarati", script: "ગુજરાતી", text: "નમસ્તે, હું દિલોરા." },
    { lang: "Odia", script: "ଓଡ଼ିଆ", text: "ନମସ୍କାର, ମୁଁ ଦିଲୋରା।" },
  ];

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6">VOICE & LANGUAGE LAB</Badge>
          <h1 className="text-5xl md:text-6xl font-semibold leading-tight tracking-tight mb-6">
            A voice your customers will <span className="text-gradient">stay on the line</span> for.
          </h1>
          <p className="text-xl text-[var(--muted-foreground)] leading-relaxed mb-12">
            Switch voice and language, then preview how Dilora sounds in the moments that matter.
          </p>
          
          <div className="inline-flex glass rounded-full p-1 mb-16 border border-white/10">
            <button 
              onClick={() => setVoiceType('female')}
              className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                voiceType === 'female' ? 'bg-gradient-to-r from-[#9b66ff] to-[#ff3c00] text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              Female Voice
            </button>
            <button 
              onClick={() => setVoiceType('male')}
              className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                voiceType === 'male' ? 'bg-gradient-to-r from-[#9b66ff] to-[#ff3c00] text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              Male Voice
            </button>
          </div>
        </div>
      </section>

      {/* Voice Grid */}
      <section className="pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {languages.map((voice, idx) => {
              const isPlaying = playingLang === voice.lang;
              
              return (
                <GlassCard 
                  key={idx} 
                  className={`group cursor-pointer transition-all duration-500 relative overflow-hidden h-[240px] flex flex-col justify-between ${
                    isPlaying ? 'bg-gradient-to-br from-[#ff3c00]/40 to-[#9b66ff]/40 border-white/30 scale-[1.02]' : 'hover:bg-white/5 border-white/10'
                  }`}
                  onMouseEnter={() => setPlayingLang(voice.lang)}
                  onMouseLeave={() => setPlayingLang(null)}
                >
                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <h3 className="font-bold text-xl">{voice.lang}</h3>
                      <span className="text-gray-400 text-sm">{voice.script}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white bg-black/20 group-hover:bg-white/10 transition-colors">
                      {isPlaying ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-lg text-white font-medium leading-relaxed relative z-10 mb-8">{voice.text}</p>
                  
                  <div className="relative z-10 flex flex-col gap-4">
                    {/* Waveform Visualization */}
                    <div className="flex items-center gap-1.5 h-8">
                      {[...Array(24)].map((_, i) => {
                        const delay = `${i * 0.05}s`;
                        return (
                          <div 
                            key={i} 
                            className={`w-1.5 rounded-full transition-all duration-300 origin-center ${
                              isPlaying 
                                ? 'bg-gradient-to-t from-[#ff9d00] via-[#ff3c00] to-[#5828dc] shadow-[0_0_8px_rgba(255,60,0,0.5)]' 
                                : 'bg-[#5828dc]/40 h-1.5'
                            }`}
                            style={isPlaying ? { 
                              height: `${30 + Math.random() * 70}%`,
                              animation: `waveform ${0.5 + Math.random() * 0.5}s ease-in-out infinite alternate ${delay}`
                            } : {}}
                          ></div>
                        );
                      })}
                    </div>
                    
                    {/* Status Text */}
                    <div className="flex items-center gap-2">
                      {isPlaying ? (
                        <>
                          <svg className="w-4 h-4 text-[#ffb000]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                          </svg>
                          <span className="text-xs text-[#ffb000] font-medium">Now playing — {voiceType} voice</span>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium transition-opacity">
                          Hover or tap to hear Dilora
                        </span>
                      )}
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
          
          <div className="mt-12 text-center text-[var(--muted-foreground)] text-sm">
            <p>Demo previews use placeholder audio. Production voices are studio-recorded per language.</p>
          </div>
          
          <div className="mt-20 flex justify-center">
             <Link to="/demo" className="bg-gradient-to-r from-[#5828dc] via-[#9b66ff] to-[#ff6b00] px-8 py-4 rounded-full text-lg font-semibold text-white hover:scale-105 transition-transform hover:shadow-[0_0_30px_rgba(255,107,0,0.5)]">
                Get a demo call
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import GlassCard from '../components/ui/GlassCard';
import Orb from '../components/Orb';

export default function Home() {
  const [voiceType, setVoiceType] = useState<'female' | 'male'>('female');
  const [playingLang, setPlayingLang] = useState<string | null>(null);

  const features = [
    { title: "Multi-agent, multi-agency", desc: "Run unlimited agents across client workspaces with isolated data and billing." },
    { title: "Voice that passes for human", desc: "Sub-500ms turn taking, natural fillers, barge-in and real interruptions." },
    { title: "9 Indian languages", desc: "Hindi, English, Tamil, Telugu, Kannada, Malayalam, Marathi, Gujarati, Marwari." },
    { title: "Always on the line", desc: "24/7 pickup, zero queue, thousands of concurrent conversations." },
    { title: "Live analytics & summaries", desc: "Transcripts, intent, sentiment and outcome on every single call." },
    { title: "Telephony & CRM ready", desc: "Exotel, Twilio, Plivo, Zoho, Salesforce, HubSpot, Google Sheets." },
  ];

  const steps = [
    { num: "01", title: "Set up your agent", desc: "Describe the job in plain language, or start from a proven template for your sector. Guardrails and objectives in minutes, not sprints." },
    { num: "02", title: "Choose voice & language", desc: "Pick a male or female voice in any of nine Indian languages. Tune pace, warmth and how assertive the agent should be." },
    { num: "03", title: "Connect calls & CRM", desc: "Attach your numbers from Exotel, Twilio or Plivo, then point Dilora at your CRM so every outcome is written back." },
    { num: "04", title: "Dilora handles the calls", desc: "Inbound and outbound, at any volume, with transcripts, summaries and escalations landing in your dashboard live." },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-24 px-4 pb-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
          <div className="flex-1 text-left max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="text-xs font-bold tracking-[0.2em] text-[#F59E0B] uppercase mb-8">
              AI VOICE CALLING, BUILT FOR INDIA
            </div>
            <h1 className="text-6xl md:text-[80px] font-bold leading-[1.1] mb-8">
              Calls that sound<br />
              human. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b66ff] to-[#ff3c00]">Outcomes</span><br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff3c00] to-[#ff9d00]">that scale.</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-[450px] leading-relaxed">
              Dilora answers, qualifies, books and follows up in nine Indian languages—with the natural pace of your best agent.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-start gap-4">
              <Link to="/demo" className="flex items-center justify-center gap-2 w-full sm:w-auto bg-gradient-to-r from-[#5828dc] via-[#9b66ff] to-[#ff6b00] px-8 py-3.5 rounded-full text-[15px] font-semibold text-white hover:scale-105 transition-transform hover:shadow-[0_0_30px_rgba(255,107,0,0.5)]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Get a demo call
              </Link>
              <Link to="/voice-lab" className="flex items-center justify-center gap-2 w-full sm:w-auto bg-white/10 border border-white/20 hover:bg-white/20 px-8 py-3.5 rounded-full text-[15px] font-semibold text-white hover:scale-105 transition-transform">
                Hear the voices
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center lg:justify-end mt-12 lg:mt-0 animate-in fade-in zoom-in duration-1000 delay-300 fill-mode-both">
            <Orb />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-6 border-white/20 text-gray-300 tracking-widest text-[10px]">BUILT FOR THE LINE</Badge>
          <h2 className="text-4xl md:text-[44px] font-bold mb-4 tracking-tight leading-tight">
            A complete calling operation,<br />inside one voice.
          </h2>
          <p className="text-sm md:text-base text-gray-400 mb-16">
            From first hello to CRM disposition, Dilora runs the conversation end to end.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-[#1e1536]/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:-translate-y-1 transition-transform duration-500 shadow-xl">
                <div className="text-[#ff9d00] mb-4">
                  {/* Generic icon placeholder representing the orange icons in the image */}
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-[17px] font-bold mb-3 tracking-tight text-white">{feature.title}</h3>
                <p className="text-[13px] text-gray-400 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 px-4 relative border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
            <Badge className="mb-8 border-white/20 text-gray-300 tracking-widest text-[10px] uppercase">How it works</Badge>
            <h2 className="text-4xl md:text-[44px] font-bold tracking-tight text-white">
              Live in four clear steps.
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16 text-left items-start">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="text-[12px] font-bold text-[#ff9d00] mb-5">{step.num}</div>
                <h3 className="text-[15px] font-bold mb-3 text-white tracking-tight leading-snug">{step.title}</h3>
                <p className="text-[13px] text-gray-400 leading-[1.7] font-medium pr-2">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Voice Lab Preview */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-6">VOICE LAB</Badge>
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tight">
            Hear Dilora speak your customer's language.
          </h2>
          
          <div className="inline-flex glass rounded-full p-1 mb-12 border border-white/10">
            <button 
              onClick={() => setVoiceType('female')}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                voiceType === 'female' ? 'bg-gradient-to-r from-[#9b66ff] to-[#ff3c00] text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              Female Voice
            </button>
            <button 
              onClick={() => setVoiceType('male')}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                voiceType === 'male' ? 'bg-gradient-to-r from-[#9b66ff] to-[#ff3c00] text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              Male Voice
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {[
              { lang: "Hindi", script: "हिन्दी", text: "नमस्ते! मैं दिलोरा बोल रही हूँ।" },
              { lang: "English", script: "English (IN)", text: "Hi, this is Dilora calling." },
              { lang: "Tamil", script: "தமிழ்", text: "வணக்கம், நான் திலோரா." },
              { lang: "Telugu", script: "తెలుగు", text: "నమస్కారం, నేను దిలోరా." },
              { lang: "Kannada", script: "ಕನ್ನಡ", text: "ನಮಸ್ಕಾರ, ನಾನು ದಿಲೋರಾ." },
              { lang: "Malayalam", script: "മലയാളം", text: "നമസ്കാരം, ഞാൻ ദിലോറ." },
              { lang: "Marathi", script: "मराठी", text: "नमस्कार, मी दिलोरा." },
              { lang: "Gujarati", script: "ગુજરાતી", text: "નમસ્તે, હું દિલોરા." },
              { lang: "Marwari", script: "मारवाड़ी", text: "राम राम सा, म्हैं दिलोरा।" },
            ].map((voice, idx) => {
              const isPlaying = playingLang === voice.lang;

              return (
                <GlassCard 
                  key={idx} 
                  className={`group cursor-pointer transition-all duration-500 relative overflow-hidden h-[220px] flex flex-col justify-between ${
                    isPlaying ? 'bg-gradient-to-br from-[#ff3c00]/40 to-[#9b66ff]/40 border-white/30 scale-[1.02]' : 'hover:bg-white/5 border-white/10'
                  }`}
                  onMouseEnter={() => setPlayingLang(voice.lang)}
                  onMouseLeave={() => setPlayingLang(null)}
                >
                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <h3 className="font-bold text-lg">{voice.lang}</h3>
                      <span className="text-gray-400 text-sm">{voice.script}</span>
                    </div>
                    <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white bg-black/20 group-hover:bg-white/10 transition-colors">
                      {isPlaying ? (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-base text-white font-medium leading-relaxed relative z-10 mb-6">{voice.text}</p>
                  
                  <div className="relative z-10 flex flex-col gap-3">
                    {/* Waveform Visualization */}
                    <div className="flex items-center gap-1.5 h-6">
                      {[...Array(24)].map((_, i) => {
                        const delay = `${i * 0.05}s`;
                        return (
                          <div 
                            key={i} 
                            className={`w-1 rounded-full transition-all duration-300 origin-center ${
                              isPlaying 
                                ? 'bg-gradient-to-t from-[#ff9d00] via-[#ff3c00] to-[#5828dc] shadow-[0_0_8px_rgba(255,60,0,0.5)]' 
                                : 'bg-[#5828dc]/40 h-1'
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
                          <svg className="w-3.5 h-3.5 text-[#ffb000]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                          </svg>
                          <span className="text-[11px] text-[#ffb000] font-medium uppercase tracking-wide">Now playing — {voiceType}</span>
                        </>
                      ) : (
                        <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wide transition-opacity">
                          Hover to hear
                        </span>
                      )}
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
          <p className="text-sm text-[var(--muted-foreground)] mt-12">
            Note: Demo previews use placeholder audio. Production voices are studio-recorded per language.
          </p>
        </div>
      </section>
    </div>
  );
}

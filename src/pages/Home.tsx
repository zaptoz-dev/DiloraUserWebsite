import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import GlassCard from '../components/ui/GlassCard';
import Orb from '../components/Orb';

export default function Home() {
  const [voiceType, setVoiceType] = useState<'female' | 'male'>('female');
  const [playingLang, setPlayingLang] = useState<string | null>(null);

  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const languages = [
    { lang: "Hindi", script: "हिन्दी", text: "नमस्ते! मैं डायलोरा बोल रही हूँ।", audio: { female: "/audio/Hindi_female.mp3", male: "/audio/Hindi_Male.mp3" } },
    { lang: "English", script: "English (IN)", text: "Hi, this is Dialora calling.", audio: { female: "/audio/English_female.mp3", male: "/audio/English_Male.mp3" } },
    { lang: "Tamil", script: "தமிழ்", text: "வணக்கம், நான் டயலோரா.", audio: { female: "/audio/Tamil_female.mp3", male: "/audio/Tamil_Male.mp3" } },
    { lang: "Telugu", script: "తెలుగు", text: "నమస్కారం, నేను డయలోరా.", audio: { female: "/audio/Telugu_female.mp3", male: "/audio/Telugu_Male.mp3" } },
    { lang: "Kannada", script: "ಕನ್ನಡ", text: "ನಮಸ್ಕಾರ, ನಾನು ಡಯಲೋರಾ.", audio: { female: "/audio/Kannada_female.mp3", male: "/audio/Kannada_Male.mp3" } },
    { lang: "Malayalam", script: "മലയാളം", text: "നമസ്കാരം, ഞാൻ ഡയലോറ.", audio: { female: "/audio/Malayalam_female.mp3", male: "/audio/Malayalam_Male.mp3" } },
    { lang: "Marathi", script: "मराठी", text: "नमस्कार, मी डायलोरा.", audio: { female: "/audio/Marathi_female.mp3", male: "/audio/Marathi_Male.mp3" } },
    { lang: "Gujarati", script: "ગુજરાતી", text: "નમસ્તે, હું ડાયલોરા.", audio: { female: "/audio/Gujrati_female.mp3", male: "/audio/Gujrati_Male.mp3" } },
    { lang: "Odia", script: "ଓଡ଼ିଆ", text: "ନମସ୍କାର, ମୁଁ ଡାୟଲୋରା।", audio: { female: "/audio/Odia_female.mp3", male: "/audio/Odia_Male.mp3" } },
    { lang: "Bengali", script: "বাংলা", text: "নমস্কার, আমি ডায়ালোরা।", audio: { female: "/audio/Bengali_female.mp3", male: "/audio/Bengali_Male.mp3" } },
  ];

  const handleMouseEnter = (lang: string, audioPath?: string) => {
    setPlayingLang(lang);
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }
    if (audioPath) {
      const baseUrl = import.meta.env.BASE_URL || '/';
      const fullAudioPath = audioPath.startsWith('/') ? `${baseUrl}${audioPath.slice(1)}` : `${baseUrl}${audioPath}`;
      const audio = new Audio(fullAudioPath);
      audio.play().catch(e => console.log("Audio play failed or file missing:", e));
      currentAudioRef.current = audio;
    }
  };

  const handleMouseLeave = () => {
    setPlayingLang(null);
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
  };

  const features = [
    { title: "Voice recording", desc: "Automatically record, store, and playback every conversation for quality assurance and training." },
    { title: "Lead gathering", desc: "Intelligently capture, qualify, and route leads directly to your CRM during the call." },
    { title: "Voice that passes for human", desc: "Sub-500ms turn taking, natural fillers, barge-in and real interruptions." },
    { title: "10+ Indian & Int'l Voices", desc: "Hindi, English, Tamil, Telugu, Kannada, Malayalam, Marathi, Gujarati, Odia, Bengali and more." },
    { title: "Always on the line", desc: "24/7 pickup, zero queue, thousands of concurrent conversations." },
    { title: "Live analytics & summaries", desc: "Transcripts, intent, sentiment and outcome on every single call." },
    { title: "Telephony & CRM ready", desc: "Exotel, Twilio, Plivo, Zoho, Salesforce, HubSpot, Google Sheets." },
    { title: "Multi-agent, multi-agency", desc: "Run unlimited agents across client workspaces with isolated data and billing." },
  ];

  const steps = [
    { num: "01", title: "Set up your agent", desc: "Describe the job in plain language, or start from a proven template for your sector. Guardrails and objectives in minutes, not sprints." },
    { num: "02", title: "Choose voice & language", desc: "Pick a male or female voice across 10+ Indian and international languages. Tune pace, warmth and how assertive the agent should be." },
    { num: "03", title: "Connect calls & CRM", desc: "Attach your numbers from Exotel, Twilio or Plivo, then point Dialora at your CRM so every outcome is written back." },
    { num: "04", title: "Dialora handles the calls", desc: "Inbound and outbound, at any volume, with transcripts, summaries and escalations landing in your dashboard live." },
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
            <p className="text-lg md:text-xl text-[var(--muted-foreground)] mb-12 max-w-2xl leading-relaxed">
            Dialora answers, qualifies, books and follows up in 10+ Indian and international languages—with the natural pace of your best agent.
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
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 border-white/20 text-gray-300 tracking-widest text-[10px]">BUILT FOR THE LINE</Badge>
          <h2 className="text-4xl md:text-[44px] font-bold mb-16 tracking-tight leading-tight">
            A complete calling operation,<br />inside one voice.
          </h2>
          <p className="text-sm md:text-base text-gray-400 mb-16">
            From first hello to CRM disposition, Dialora runs the conversation end to end.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
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
          <h2 className="text-4xl md:text-5xl font-semibold mb-8 tracking-tight">
            Hear Dialora speak your customer's language.
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl shadow-xl hover:bg-white/10 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#ff3c00]/20 transition-all cursor-default">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff3c00] to-[#ff9d00] text-white font-bold shadow-inner">
                10+
              </span>
              <div className="text-left">
                <p className="text-sm font-bold text-white tracking-tight">Indian & Global Voices</p>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">Fluent in multiple languages</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl shadow-xl hover:bg-white/10 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#9b66ff]/20 transition-all cursor-default">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#9b66ff] to-[#5828dc] text-white shadow-inner">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </span>
              <div className="text-left">
                <p className="text-sm font-bold text-white tracking-tight">Native Regional Accents</p>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">Hyper-local authentic tone</p>
              </div>
            </div>
          </div>
          
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
          
          <div className="flex flex-wrap justify-center gap-5 max-w-7xl mx-auto">
            {languages.map((voice, idx) => {
              const isPlaying = playingLang === voice.lang;
              const currentAudioPath = voiceType === 'female' ? voice.audio.female : voice.audio.male;

              const activeClasses = voiceType === 'female'
                ? 'bg-gradient-to-br from-[#ff3c00]/40 to-[#9b66ff]/40 border-white/30 shadow-[0_0_30px_rgba(255,107,0,0.15)] scale-[1.02]'
                : 'bg-gradient-to-br from-[#00f2fe]/40 to-[#4facfe]/40 border-white/30 shadow-[0_0_30px_rgba(0,242,254,0.15)] scale-[1.02]';

              return (
                <GlassCard 
                  key={idx} 
                  className={`w-full sm:w-[calc(50%-10px)] md:w-[calc(33.33%-14px)] lg:w-[calc(20%-16px)] group cursor-pointer transition-all duration-500 relative overflow-hidden min-h-[240px] flex flex-col justify-between ${
                    isPlaying ? activeClasses : 'hover:bg-white/5 border-white/10'
                  }`}
                  onMouseEnter={() => handleMouseEnter(voice.lang, currentAudioPath)}
                  onMouseLeave={handleMouseLeave}
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

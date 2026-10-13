import { Link } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import TryItLiveCTA from '../components/TryItLiveCTA';

export default function Features() {
  const capabilities = [
    {
      category: "Conversational Core",
      tag: "Neural Engine",
      title: "Full-Duplex Speech & Interruption Recovery",
      desc: "Callers speak like real humans: they interrupt mid-sentence, change their minds, or clarify names. Audeora listens while it speaks and picks the conversation back up.",
      stat: "Natural",
      statLabel: "Conversation flow",
      features: [
        "Natural barge-in handling",
        "Context-aware responses",
        "Adjustable speaking pace and tone"
      ]
    },
    {
      category: "Multilingual Intelligence",
      tag: "Regional AI",
      title: "Native Indian & Global Accents",
      desc: "Talk to callers in the language they are comfortable with, including English, Hindi and Hinglish, with replies in the same language.",
      stat: "Multilingual",
      statLabel: "Languages & Accents",
      features: [
        "Voices that sound familiar to Indian callers",
        "English + Hindi (Hinglish) conversations",
        "Pre-configured regional male and female vocal personas"
      ]
    },
    {
      category: "Telephony Infrastructure",
      tag: "Telephony",
      title: "Parallel Calling for Busy Periods",
      desc: "Take more calls at once during flash sales or campaign spikes. Connects to your existing phone numbers and carrier.",
      stat: "Parallel",
      statLabel: "Calling",
      features: [
        "SIP trunking with your telephony provider",
        "Fewer callers left waiting on hold",
        "Multi-agency isolation with dedicated number routing"
      ]
    },
    {
      category: "Data & Workflows",
      tag: "CRM Sync",
      title: "Transcription & CRM Dispositioning",
      desc: "Calls can produce a transcript, structured details (budget, date, pin code) and a call outcome, delivered into your systems.",
      stat: "Synced",
      statLabel: "Transcripts & CRM",
      features: [
        "Webhooks into your CRM",
        "Lead status dispositioning and follow-up scheduling",
        "Human handoff with a call summary"
      ]
    }
  ];

  const integrationPartners = [
    { name: "Telephony", type: "Your existing numbers" },
    { name: "SIP Trunks", type: "Carrier connection" },
    { name: "Inbound", type: "Answer incoming calls" },
    { name: "Outbound", type: "Place follow-up calls" },
    { name: "CRM", type: "Push call outcomes" },
    { name: "Calendars", type: "Book appointments" },
    { name: "Messaging", type: "Send confirmations" },
    { name: "Webhooks / REST", type: "Custom API" }
  ];

  return (
    <div className="pt-28 pb-20 bg-[#080b11] text-slate-100 min-h-screen">
      
      {/* Hero Section */}
      <section className="py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#245ae2]/15 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <Badge className="mb-6">ENTERPRISE ARCHITECTURE</Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 text-white leading-tight">
            Every call, handled like your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60a5fa] via-[#245ae2] to-[#93c5fd]">best tele-caller</span>.
          </h1>
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10">
            Built for natural phone conversations, with telephony and CRM integration for automated phone operations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/demo"
              className="bg-[#245ae2] hover:bg-[#1d4ed8] text-white px-8 py-3.5 rounded-full font-semibold text-sm transition-all shadow-[0_0_30px_rgba(36,90,226,0.4)]"
            >
              Request a Live Test Call
            </Link>
            <Link
              to="/voice-lab"
              className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 py-3.5 rounded-full font-semibold text-sm transition-all"
            >
              Audition Voice Lab
            </Link>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {capabilities.map((cap, idx) => (
            <div
              key={idx}
              className="bg-[#0d121f] border border-white/10 rounded-3xl p-8 sm:p-10 flex flex-col justify-between hover:border-[#245ae2]/50 transition-all duration-300 shadow-xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#245ae2]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#245ae2]/20 transition-all" />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3 py-1 rounded-full bg-[#245ae2]/15 border border-[#245ae2]/30 text-xs font-semibold text-[#93c5fd]">
                    {cap.category}
                  </span>
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                    {cap.tag}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4 group-hover:text-[#60a5fa] transition-colors">
                  {cap.title}
                </h2>

                <p className="text-sm text-slate-400 leading-relaxed mb-8">
                  {cap.desc}
                </p>

                {/* Stat Highlight Card */}
                <div className="bg-[#080b11] border border-white/5 rounded-2xl p-5 mb-8 flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-white tracking-tight">{cap.stat}</div>
                    <div className="text-xs text-slate-400">{cap.statLabel}</div>
                  </div>
                  {/* Waveform graphic */}
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-6 bg-[#245ae2] rounded-full animate-pulse" />
                    <span className="w-1 h-10 bg-[#60a5fa] rounded-full animate-pulse" />
                    <span className="w-1 h-4 bg-[#d6f549] rounded-full animate-pulse" />
                    <span className="w-1 h-8 bg-[#245ae2] rounded-full animate-pulse" />
                    <span className="w-1 h-5 bg-[#60a5fa] rounded-full animate-pulse" />
                  </div>
                </div>

                {/* Checklist */}
                <div className="space-y-3">
                  {cap.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0">
                        ✓
                      </span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">Audeora platform</span>
                <Link to="/demo" className="text-xs font-semibold text-[#60a5fa] hover:text-white flex items-center gap-1 transition-colors">
                  See in action &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Integration Marquee Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge className="mb-4">INTEGRATION ECOSYSTEM</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Connects to your telecom & CRM stack
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Bring your existing numbers, keep your current phone carrier, and feed qualified data into your CRM in real time.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {integrationPartners.map((item, i) => (
            <div
              key={i}
              className="bg-[#0f1422] border border-white/10 rounded-2xl p-5 text-center hover:border-[#245ae2]/40 transition-all group"
            >
              <div className="text-lg font-bold text-white mb-1 group-hover:text-[#60a5fa] transition-colors">
                {item.name}
              </div>
              <div className="text-xs text-slate-400 font-mono">
                {item.type}
              </div>
            </div>
          ))}
        </div>
      </section>

      <TryItLiveCTA />
    </div>
  );
}

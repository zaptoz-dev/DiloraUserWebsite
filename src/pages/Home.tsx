import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import InteractiveUseCase from '../components/ui/InteractiveUseCase';
import WorkflowComparison from '../components/WorkflowComparison';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'support' | 'sales' | 'operations' | 'collections'>('support');
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Automatic scroll-based video play/pause
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().then(() => setIsVideoPlaying(true)).catch(() => {
            // Autoplay policy might require mute
            video.muted = true;
            setIsVideoMuted(true);
            video.play();
          });
        } else {
          video.pause();
          setIsVideoPlaying(false);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const toggleVideoSound = () => {
    if (videoRef.current) {
      const nextMute = !isVideoMuted;
      videoRef.current.muted = nextMute;
      setIsVideoMuted(nextMute);
    }
  };

  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsVideoPlaying(true);
      } else {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  const stats = [
    {
      metric: "10+",
      label: "Indian & Global Languages",
      detail: "Hindi, English, Tamil, Telugu, Marathi, Gujarati & more",
      badge: "Multilingual"
    },
    {
      metric: "<500ms",
      label: "Voice Response Latency",
      detail: "Natural turn-taking with zero awkward pauses",
      badge: "Real-time"
    },
    {
      metric: "24/7",
      label: "Parallel Calling Capacity",
      detail: "Handles hundreds of concurrent inbound and outbound calls",
      badge: "High Availability"
    },
    {
      metric: "100%",
      label: "Logged & Transcribed",
      detail: "Full transcripts, intent analysis and CRM dispositioning",
      badge: "Enterprise Ready"
    }
  ];

  const functionalTabs = [
    {
      id: 'support',
      title: 'Customer Support',
      headline: 'Resolve customer inquiries with zero wait time',
      description: 'Dialora handles inbound queries, order tracking, address verification, and common FAQs naturally in the caller’s preferred language.',
      features: [
        'Instant answers without robotic IVR menus',
        'Automatic language detection in first 2 seconds',
        'Warm handoff with summary when human agents are needed'
      ],
      tag: 'Inbound Resolution'
    },
    {
      id: 'sales',
      title: 'Sales & Lead Qualification',
      headline: 'Qualify portal and campaign leads in seconds',
      description: 'Connect with prospective buyers within seconds of their enquiry, identify budget and timeline, and book meetings directly into sales calendars.',
      features: [
        'Sub-60-second follow-up on fresh inquiries',
        'Consistent discovery and qualification questions',
        'Calendar booking and direct CRM record creation'
      ],
      tag: 'Pipeline Acceleration'
    },
    {
      id: 'operations',
      title: 'Operations & Dispatch',
      headline: 'Automate delivery confirmations and updates',
      description: 'Confirm cash-on-delivery orders, verify delivery addresses, schedule technician visits, and update dispatch status without a call center shift.',
      features: [
        'Pre-dispatch address and availability checks',
        'Rescheduling management without agent intervention',
        'Instant webhook updates back into your operational database'
      ],
      tag: 'Workflow Automation'
    },
    {
      id: 'collections',
      title: 'Reminders & Follow-ups',
      headline: 'Consistent, polite follow-ups that get results',
      description: 'Automate payment reminders, renewal notices, appointment follow-ups, and KYC nudges with clear, respectful compliance scripting.',
      features: [
        'Promise-to-pay capture and scheduled callbacks',
        'Full call recordings and transcripts for compliance',
        'Zero script drift or tired tele-caller tone'
      ],
      tag: 'Compliance & Recovery'
    }
  ];

  const features = [
    { 
      title: "Voice recording & transcripts", 
      desc: "Automatically record, store, and transcribe every conversation for quality assurance, compliance, and team review." 
    },
    { 
      title: "Lead qualification & routing", 
      desc: "Intelligently capture intent, qualify leads against your criteria, and route details directly into your CRM." 
    },
    { 
      title: "Human-like conversation flow", 
      desc: "Sub-500ms turn-taking, natural fillers, barge-in support, and intelligent interruption handling." 
    },
    { 
      title: "10+ Indian & Global Voices", 
      desc: "Hindi, English, Tamil, Telugu, Kannada, Malayalam, Marathi, Gujarati, Odia, Bengali and more." 
    },
    { 
      title: "Zero queue capacity", 
      desc: "Festival spikes or Monday morning surges—Dialora answers all calls simultaneously without putting customers on hold." 
    },
    { 
      title: "Actionable call summaries", 
      desc: "Transcripts, extracted parameters, caller sentiment, and disposition logged right after the call ends." 
    },
    { 
      title: "Telephony & CRM ready", 
      desc: "Plug your numbers from Exotel, Twilio, or Plivo, and push call data to Zoho, Salesforce, HubSpot, or webhooks." 
    },
    { 
      title: "Multi-agent workspaces", 
      desc: "Run dedicated agents across campaigns or client accounts with isolated numbers, instructions, and reports." 
    },
  ];

  const steps = [
    { 
      num: "01", 
      title: "Define your workflow", 
      desc: "Specify your call objective, qualification questions, and business rules in plain English. No complex coding required." 
    },
    { 
      num: "02", 
      title: "Select voice & language", 
      desc: "Choose male or female voices across 10+ languages. Set speaking pace, persona tone, and language switching rules." 
    },
    { 
      num: "03", 
      title: "Connect telephony & CRM", 
      desc: "Attach your existing numbers (Exotel, Twilio, Plivo) and map CRM fields for automatic data logging." 
    },
    { 
      num: "04", 
      title: "Deploy & monitor live", 
      desc: "Dialora starts handling inbound and outbound calls with real-time logs, recordings, and analytics on your dashboard." 
    },
  ];

  const currentTab = functionalTabs.find(t => t.id === activeTab) || functionalTabs[0];

  return (
    <div className="bg-[#080b11] text-slate-100 overflow-hidden">
      
      {/* Hero Section */}
      <section className="min-h-[92vh] flex items-center justify-center pt-32 px-4 pb-20 relative">
        {/* Subtle background electric glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#245ae2]/15 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
          <div className="flex-1 text-left max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#245ae2]/10 border border-[#245ae2]/30 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#d6f549] animate-pulse"></span>
              <span className="text-xs font-semibold text-[#93c5fd] tracking-wide uppercase">
                Enterprise AI Voice Platform
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-[76px] font-bold leading-[1.08] mb-8 text-white tracking-tight">
              Calls that sound <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60a5fa] via-[#245ae2] to-[#93c5fd]">human</span>.<br />
              Outcomes that <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">scale</span>.
            </h1>

            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-xl leading-relaxed">
              Dialora answers, qualifies, schedules, and resolves calls in 10+ Indian and global languages—with the natural pace and tone of your best tele-caller.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-start gap-4">
              <Link 
                to="/demo" 
                className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#245ae2] hover:bg-[#1d4ed8] px-8 py-4 rounded-full text-[15px] font-semibold text-white transition-all duration-300 shadow-[0_0_30px_rgba(36,90,226,0.4)] hover:shadow-[0_0_40px_rgba(36,90,226,0.6)] hover:-translate-y-0.5"
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
          </div>

          <div className="flex-1 w-full max-w-xl lg:max-w-none flex justify-center lg:justify-end mt-8 lg:mt-0 animate-in fade-in zoom-in duration-1000 delay-200 fill-mode-both relative">
            {/* Ambient glowing background */}
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-[#245ae2]/30 rounded-full blur-[90px] pointer-events-none -z-10" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#d6f549]/15 rounded-full blur-[90px] pointer-events-none -z-10" />

            {/* High-Tech Terminal Video Card */}
            <div className="w-full max-w-lg rounded-3xl bg-[#0d121f]/90 border border-[#245ae2]/40 shadow-[0_0_50px_rgba(36,90,226,0.25)] backdrop-blur-xl overflow-hidden group">
              {/* Terminal Titlebar */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#090d17]/80">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-[11px] font-mono text-slate-400 ml-2 tracking-wider">
                    dialora-live-stream // session#0491
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#d6f549] animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#93c5fd]">
                    Active Stream
                  </span>
                </div>
              </div>

              {/* Video Player Container */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-black/80 overflow-hidden">
                <video
                  ref={videoRef}
                  src={`${import.meta.env.BASE_URL}video/hero-demo.mp4`}
                  autoPlay
                  loop
                  muted={isVideoMuted}
                  playsInline
                  className="w-full h-full object-cover object-center"
                />

                {/* Floating Sound & Playback Controls Overlay */}
                <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
                  <button
                    onClick={toggleVideoSound}
                    title={isVideoMuted ? "Unmute Audio" : "Mute Audio"}
                    className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white backdrop-blur-md transition-all shadow-lg hover:scale-105"
                  >
                    {isVideoMuted ? (
                      <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-[#d6f549]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    )}
                  </button>

                  <button
                    onClick={toggleVideoPlayback}
                    title={isVideoPlaying ? "Pause Video" : "Play Video"}
                    className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white backdrop-blur-md transition-all shadow-lg hover:scale-105"
                  >
                    {isVideoPlaying ? (
                      <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Bottom telemetry HUD */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#080b11]/95 via-[#080b11]/60 to-transparent p-4 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-slate-300 font-semibold">Sub-500ms Turn Latency</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                    <span className="bg-[#245ae2]/20 text-[#93c5fd] px-2 py-0.5 rounded border border-[#245ae2]/30">Auto Scroll Sync</span>
                    <span>1080p Neural Stream</span>
                  </div>
                </div>
              </div>

              {/* Console Info Footer */}
              <div className="p-4 bg-[#0d121f] flex items-center justify-between text-xs border-t border-white/5">
                <div className="flex items-center gap-2 text-slate-300 font-medium">
                  <svg className="w-4 h-4 text-[#245ae2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
                  </svg>
                  <span>Autonomous Inbound/Outbound Engine</span>
                </div>
                <Link to="/demo" className="text-[#60a5fa] hover:text-white font-semibold flex items-center gap-1 transition-colors">
                  Try On Your Phone &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics / Impact Bento Grid */}
      <section className="py-20 px-4 border-y border-white/5 bg-[#0b0f19]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div 
                key={idx} 
                className="bg-[#0f1422] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#245ae2]/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="inline-block px-2.5 py-1 rounded-full bg-[#245ae2]/10 border border-[#245ae2]/25 text-[11px] font-semibold text-[#60a5fa] mb-4">
                    {stat.badge}
                  </div>
                  <div className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-2 group-hover:text-[#60a5fa] transition-colors">
                    {stat.metric}
                  </div>
                  <div className="text-[15px] font-semibold text-slate-200 mb-1">
                    {stat.label}
                  </div>
                </div>
                <div className="text-xs text-slate-400 mt-4 leading-relaxed">
                  {stat.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Animated Workflow Evolution (Without Dialora vs With Dialora Infinity Loop) */}
      <WorkflowComparison />

      {/* The Part That Makes Dialora Different (NuPlay Inspired Comparison) */}
      <section className="py-28 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4">ARCHITECTED FOR REAL CONVERSATIONS</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
              Beyond traditional IVR & static chatbots
            </h2>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
              Old voice trees force callers through repetitive keypad numbers. Dialora provides continuous, real-time voice intelligence that adapts to interruptions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Traditional Voice Tree */}
            <div className="bg-[#0f1422]/60 border border-white/5 rounded-3xl p-8 flex flex-col justify-between opacity-80">
              <div>
                <div className="text-xs font-semibold text-rose-400 tracking-wider uppercase mb-3">
                  Traditional Phone Trees (IVR)
                </div>
                <h3 className="text-2xl font-bold text-slate-300 mb-4">Rigid menus and long wait times</h3>
                <ul className="flex flex-col gap-3 text-sm text-slate-400">
                  <li className="flex items-start gap-3">
                    <span className="text-rose-500 mt-0.5">✕</span>
                    "Press 1 for Sales, Press 2 for Support" keypad frustration
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-rose-500 mt-0.5">✕</span>
                    Awkward silences, unable to handle caller interruptions or barge-in
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-rose-500 mt-0.5">✕</span>
                    Restricted to monotone robotic English without regional Indian accents
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-rose-500 mt-0.5">✕</span>
                    Spikes lead to dropped calls and lost business opportunities
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-white/5 text-xs text-slate-500">
                Typical customer experience: Frustrated hang-ups & high abandonment
              </div>
            </div>

            {/* Dialora Intelligent Voice Agents */}
            <div className="bg-gradient-to-b from-[#131b2e] to-[#0f1422] border border-[#245ae2]/40 rounded-3xl p-8 flex flex-col justify-between shadow-[0_0_50px_rgba(36,90,226,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#245ae2]/20 rounded-full blur-3xl pointer-events-none"></div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#245ae2]/20 border border-[#245ae2]/30 text-xs font-semibold text-[#93c5fd] uppercase tracking-wider mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d6f549]"></span>
                  Dialora Voice Engine
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Natural, fluid human conversation</h3>
                <ul className="flex flex-col gap-3 text-sm text-slate-200">
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                    Speaks naturally and listens simultaneously—recovers when interrupted
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                    10+ native Indian regional accents for authentic, local customer connection
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                    Instant answers in under 500ms without robotic pauses
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                    Live notes, dispositioning, and CRM records generated after every call
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-white/10 text-xs text-[#93c5fd] font-medium flex items-center justify-between">
                <span>Enterprise ready on Exotel, Twilio & Plivo</span>
                <Link to="/voice-lab" className="hover:underline flex items-center gap-1">Hear Voices &rarr;</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Purpose-Built Voice Agents By Function (Interactive Tabs) */}
      <section className="py-24 px-4 bg-[#0b0f19] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <Badge className="mb-4">ONE PLATFORM, EVERY CALL FUNCTION</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
              Tailored voice agents for your workflow
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Switch between key use cases to see how Dialora handles diverse call scenarios in production.
            </p>
          </div>

          {/* Tabs bar */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {functionalTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                  activeTab === tab.id
                    ? 'bg-[#245ae2] border-[#245ae2] text-white shadow-[0_0_20px_rgba(36,90,226,0.4)]'
                    : 'bg-[#0f1422] border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                {tab.title}
              </button>
            ))}
          </div>

          {/* Active Tab Card */}
          <div className="bg-[#0f1422] border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
              <div className="lg:col-span-2">
                <div className="inline-block px-3 py-1 rounded-full bg-[#245ae2]/10 border border-[#245ae2]/25 text-xs font-semibold text-[#60a5fa] mb-4">
                  {currentTab.tag}
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  {currentTab.headline}
                </h3>
                <p className="text-slate-300 text-base leading-relaxed mb-8">
                  {currentTab.description}
                </p>
                <div className="flex flex-col gap-3">
                  {currentTab.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-[#245ae2]/20 border border-[#245ae2]/40 flex items-center justify-center text-[#60a5fa] shrink-0 text-xs">
                        ✓
                      </div>
                      {feat}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Side Box */}
              <div className="bg-[#080b11] border border-white/10 rounded-2xl p-6 flex flex-col justify-between h-full">
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider mb-2 font-medium">Ready to test?</div>
                  <h4 className="text-lg font-bold text-white mb-3">Experience {currentTab.title} live</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    Enter your phone number to receive a live test call and hear Dialora run this workflow on your own phone.
                  </p>
                </div>
                <Link
                  to="/demo"
                  className="w-full bg-[#245ae2] hover:bg-[#1d4ed8] text-white py-3 px-4 rounded-xl text-sm font-semibold text-center transition-all shadow-md"
                >
                  Request a Demo Call
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Use Cases Component */}
      <InteractiveUseCase />

      {/* Features Grid */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4">COMPLETE OPERATIONAL TOOLKIT</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">
            A complete call center, inside software
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mb-16 max-w-2xl mx-auto">
            From first hello to CRM disposition, Dialora runs the conversation end to end.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="bg-[#0f1422] border border-white/10 rounded-2xl p-7 hover:border-[#245ae2]/40 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#245ae2]/10 border border-[#245ae2]/25 flex items-center justify-center text-[#60a5fa] mb-5 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold mb-2.5 text-white tracking-tight">{feature.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - 4 Clear Steps */}
      <section className="py-24 px-4 bg-[#0b0f19] border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4">HOW WE WORK WITH YOU</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Live in four clear steps
            </h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              From workflow definition to production calls with real-time logs and CRM integration.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-[#0f1422] border border-white/10 rounded-2xl p-7 flex flex-col justify-between">
                <div>
                  <div className="text-sm font-bold text-[#60a5fa] tracking-wider mb-4 font-mono">{step.num}.</div>
                  <h3 className="text-lg font-bold mb-3 text-white tracking-tight leading-snug">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-24 px-4 relative">
        <div className="max-w-5xl mx-auto bg-gradient-to-b from-[#131b2e] to-[#0f1422] border border-[#245ae2]/40 rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden shadow-[0_0_60px_rgba(36,90,226,0.18)]">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Ready to see this on your own phone?
            </h2>
            <p className="text-slate-300 text-base sm:text-lg mb-10 leading-relaxed">
              Test how Dialora handles language switching, interruptions, and questions in real time.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/demo" 
                className="w-full sm:w-auto bg-[#245ae2] hover:bg-[#1d4ed8] text-white px-8 py-4 rounded-full font-semibold text-[15px] transition-all shadow-lg hover:shadow-[0_0_30px_rgba(36,90,226,0.5)]"
              >
                Schedule a Demo Call
              </Link>
              <Link 
                to="/voice-lab" 
                className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-full font-semibold text-[15px] transition-all"
              >
                Listen to 10+ Voices
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

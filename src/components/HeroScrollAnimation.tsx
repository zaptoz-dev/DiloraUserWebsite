import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

interface WorkflowScenario {
  id: string;
  tabLabel: string;
  icon: string;
  leftPhone: {
    callerName: string;
    callerNumber: string;
    callerAvatar: string;
    userQuery: string;
    aiResponse: string;
    statusTag: string;
    actionNote: string;
  };
  centerSteps: {
    icon: string;
    title: string;
    color: string;
  }[];
  rightPhone: {
    title: string;
    columns: string[];
    rows: string[][];
  };
  leftBadgeIcon: string;
  rightBadges: { name: string; icon: string; bg: string }[];
}

const SCENARIOS: WorkflowScenario[] = [
  {
    id: 'appointment',
    tabLabel: 'Doctor Consultation & Clinic',
    icon: '🩺',
    leftPhone: {
      callerName: 'Rahul Verma',
      callerNumber: '+91 98201 •••••',
      callerAvatar: 'RV',
      userQuery: 'Namaste, mujhe Dr. Sharma ke saath kal shaam 4 baje consultation book karna hai.',
      aiResponse: 'Haanji Rahul ji! Kal 4:00 PM Dr. Sharma ke saath slot confirm kar diya hai. WhatsApp confirmation bhej diya hai.',
      statusTag: 'Using Audeora Voice',
      actionNote: 'Appointment scheduled and confirmed in clinic calendar.'
    },
    centerSteps: [
      { icon: '📞', title: 'Answer in 240ms (Hindi)', color: 'text-blue-400' },
      { icon: '🗣️', title: 'Extract intent: Dental Checkup', color: 'text-emerald-400' },
      { icon: '📅', title: 'Check Google Calendar slot', color: 'text-amber-400' },
      { icon: '💬', title: 'Sync to CRM & send WhatsApp', color: 'text-teal-400' }
    ],
    rightPhone: {
      title: 'Clinic Bookings (Live)',
      columns: ['Patient', 'Slot', 'Doctor', 'Status'],
      rows: [
        ['Rahul V.', 'Tomorrow 4 PM', 'Dr. Sharma', 'Confirmed ✓'],
        ['Ananya S.', 'Tomorrow 5 PM', 'Dr. Sharma', 'Confirmed ✓'],
        ['Kunal M.', 'Tomorrow 6 PM', 'Dr. Patel', 'Confirmed ✓']
      ]
    },
    leftBadgeIcon: '📞',
    rightBadges: [
      { name: 'Calendar', icon: '📅', bg: 'bg-blue-500/20 border-blue-500/40 text-blue-300' },
      { name: 'WhatsApp', icon: '💬', bg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' }
    ]
  },
  {
    id: 'ecommerce',
    tabLabel: 'COD Order Confirmation',
    icon: '📦',
    leftPhone: {
      callerName: 'Priya Sundaram',
      callerNumber: '+91 94450 •••••',
      callerAvatar: 'PS',
      userQuery: 'Yes, I placed the order #4892 of ₹2,499. Please deliver post 3 PM tomorrow.',
      aiResponse: 'Thank you Priya! Your address & preferred slot (post 3 PM) are verified. Package is marked for dispatch.',
      statusTag: 'Using Audeora Voice',
      actionNote: 'Order verified and tagged as ready-to-ship.'
    },
    centerSteps: [
      { icon: '📞', title: 'Outbound trigger on fresh order', color: 'text-blue-400' },
      { icon: '📦', title: 'Verify address & landmark', color: 'text-emerald-400' },
      { icon: '✅', title: 'Customer confirmed COD order', color: 'text-amber-400' },
      { icon: '⚡', title: 'Update Shopify & Shiprocket', color: 'text-teal-400' }
    ],
    rightPhone: {
      title: 'Orders & Dispatch Queue',
      columns: ['Order ID', 'Amount', 'Slot Pref', 'Dispatch'],
      rows: [
        ['#4892 (Priya)', '₹2,499', 'Post 3 PM', 'Ready ✓'],
        ['#4891 (Amit)', '₹1,850', 'Morning', 'Ready ✓'],
        ['#4890 (Karan)', '₹3,200', 'Anytime', 'Ready ✓']
      ]
    },
    leftBadgeIcon: '📦',
    rightBadges: [
      { name: 'Shopify', icon: '🛍️', bg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' },
      { name: 'Shiprocket', icon: '🚚', bg: 'bg-purple-500/20 border-purple-500/40 text-purple-300' }
    ]
  },
  {
    id: 'banking',
    tabLabel: 'EMI & Payment Reminder',
    icon: '💳',
    leftPhone: {
      callerName: 'Amitabh Joshi',
      callerNumber: '+91 98112 •••••',
      callerAvatar: 'AJ',
      userQuery: 'Main aaj shaam tak UPI se ₹8,500 pay kar doonga, WhatsApp pe payment link bhej dijiye.',
      aiResponse: 'Bilkul Amitabh ji! Razorpay UPI payment link aapke WhatsApp par bhej diya gaya hai. Thank you!',
      statusTag: 'Using Audeora Voice',
      actionNote: 'Promise-to-pay captured and ledger updated.'
    },
    centerSteps: [
      { icon: '📞', title: 'Compliant polite reminder (Hindi)', color: 'text-blue-400' },
      { icon: '💳', title: 'Capture promise-to-pay date', color: 'text-emerald-400' },
      { icon: '📲', title: 'Generate & send instant UPI link', color: 'text-amber-400' },
      { icon: '📊', title: 'Update loan ledger in Salesforce', color: 'text-teal-400' }
    ],
    rightPhone: {
      title: 'Collections Ledger (Real-time)',
      columns: ['Account', 'EMI Due', 'Disposition', 'Status'],
      rows: [
        ['Amitabh J.', '₹8,500', 'PTP Today', 'UPI Sent ✓'],
        ['Sunita R.', '₹12,400', 'Paid Online', 'Cleared ✓'],
        ['Deepak S.', '₹6,200', 'Callback 6PM', 'Pending']
      ]
    },
    leftBadgeIcon: '💳',
    rightBadges: [
      { name: 'Salesforce', icon: '☁️', bg: 'bg-blue-500/20 border-blue-500/40 text-blue-300' },
      { name: 'Razorpay', icon: '⚡', bg: 'bg-amber-500/20 border-amber-500/40 text-amber-300' }
    ]
  }
];

export default function HeroScrollAnimation() {
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const scenario = SCENARIOS[activeScenarioIdx];

  // Auto-cycle through scenarios if playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveScenarioIdx((prev) => (prev + 1) % SCENARIOS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Scroll listener for subtle parallax floating effect
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / (windowHeight * 0.8)));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative pt-32 sm:pt-36 pb-24 px-4 overflow-hidden"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] sm:w-[1200px] h-[500px] bg-[#245ae2]/15 blur-[160px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-[#60a5fa]/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* Hero Header Section */}
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10 mb-12 sm:mb-16">
        
        {/* Top Composio-style pill badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-medium text-slate-300 tracking-wider uppercase mb-6 sm:mb-8">
          <span className="w-2 h-2 rounded-full bg-[#d6f549] animate-pulse" />
          <span>HOW IT WORKS</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-[72px] font-bold leading-[1.08] mb-6 sm:mb-8 text-white tracking-tight">
          Audeora turns voice calls into <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60a5fa] via-[#245ae2] to-[#93c5fd]">actions</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-300 mb-8 sm:mb-10 max-w-2xl leading-relaxed">
          Audeora sits between your callers and your apps, turning real-time spoken conversations into completed business workflows in under 300ms.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link 
            to="/demo" 
            className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#245ae2] hover:bg-[#1d4ed8] px-8 py-3.5 rounded-full text-[15px] font-semibold text-white transition-all duration-300 shadow-[0_0_35px_rgba(36,90,226,0.5)] hover:shadow-[0_0_50px_rgba(36,90,226,0.7)] hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Get a demo call
          </Link>
          
          <Link 
            to="/voice-lab" 
            className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#0d1220]/80 backdrop-blur-md border border-white/15 hover:border-white/30 px-8 py-3.5 rounded-full text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
          >
            Explore Voice Lab
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Main Dual-Phone & Central Engine Visual (Composio Style) */}
      <div className="max-w-6xl mx-auto relative">
        
        {/* Animated Curved Connecting Lines (Desktop Only) */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none z-10">
          <svg className="w-full h-full" viewBox="0 0 1152 480" fill="none" preserveAspectRatio="none">
            {/* Left Phone -> Center Hub Path */}
            <path
              d="M 330 220 C 420 220, 430 160, 520 160"
              stroke="url(#lineGradientLeft)"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              className="animate-dash-flow"
            />
            {/* Center Hub -> Right Phone Path */}
            <path
              d="M 632 160 C 720 160, 730 220, 822 220"
              stroke="url(#lineGradientRight)"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              className="animate-dash-flow"
            />

            <defs>
              <linearGradient id="lineGradientLeft" x1="330" y1="220" x2="520" y2="160" gradientUnits="userSpaceOnUse">
                <stop stopColor="#60a5fa" stopOpacity="0.8" />
                <stop offset="1" stopColor="#245ae2" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="lineGradientRight" x1="632" y1="160" x2="822" y2="220" gradientUnits="userSpaceOnUse">
                <stop stopColor="#245ae2" stopOpacity="0.9" />
                <stop offset="1" stopColor="#d6f549" stopOpacity="0.9" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* 3-Column Grid: Left Phone, Center Audeora Engine, Right Phone */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-20">
          
          {/* ================= LEFT PHONE: CALLER / VOICE INPUT ================= */}
          <div 
            className="lg:col-span-4 flex flex-col items-center"
            style={{
              transform: `translateY(${scrollProgress * -15}px)`,
              transition: 'transform 0.2s ease-out'
            }}
          >
            {/* Phone Bezel Frame */}
            <div className="relative w-[280px] sm:w-[310px] h-[520px] rounded-[42px] bg-[#0c121e] border-4 border-slate-700/60 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(36,90,226,0.2)] p-3.5 flex flex-col justify-between overflow-hidden">
              
              {/* Dynamic Island Notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full flex items-center justify-between px-3 z-30">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 animate-pulse" />
                <span className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700" />
              </div>

              {/* Status Header */}
              <div className="pt-2 px-3 flex items-center justify-between text-[11px] font-mono text-slate-400 z-20">
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  <span>5G</span>
                  <span className="w-4 h-2 rounded-sm border border-slate-400 inline-block p-0.5">
                    <span className="w-full h-full bg-emerald-400 block rounded-2xs" />
                  </span>
                </div>
              </div>

              {/* Inner Phone Screen Content */}
              <div className="flex-1 mt-7 flex flex-col justify-between py-2">
                
                {/* Caller Identification Bar */}
                <div className="bg-[#141b2d] rounded-2xl p-3 border border-white/5 flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#245ae2] to-[#60a5fa] flex items-center justify-center font-bold text-white text-xs shadow-md">
                      {scenario.leftPhone.callerAvatar}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white leading-tight">
                        {scenario.leftPhone.callerName}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {scenario.leftPhone.callerNumber}
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
                    Live Call
                  </span>
                </div>

                {/* Dialog Messages */}
                <div className="space-y-3 my-auto">
                  
                  {/* Caller Query Bubble */}
                  <div className="bg-[#1b2338] border border-white/10 rounded-2xl rounded-tl-sm p-3.5 text-xs text-slate-100 shadow-md">
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                      Spoken to AI:
                    </div>
                    "{scenario.leftPhone.userQuery}"
                  </div>

                  {/* Audeora Response Bubble */}
                  <div className="bg-gradient-to-br from-[#1a3880]/70 to-[#0e1f4d]/90 border border-[#245ae2]/60 rounded-2xl rounded-tr-sm p-3.5 text-xs text-white shadow-[0_0_25px_rgba(36,90,226,0.3)]">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#d6f549] font-bold mb-1">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d6f549] animate-pulse" />
                        Audeora Response (&lt;300ms)
                      </span>
                    </div>
                    "{scenario.leftPhone.aiResponse}"
                  </div>

                  {/* Composio-style "Using Audeora" Status Tag */}
                  <div className="bg-[#0b101c] border border-white/10 rounded-xl px-3 py-2 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                      <span className="text-[#60a5fa]">⚡</span>
                      <span>{scenario.leftPhone.statusTag}</span>
                    </div>
                    <span className="text-emerald-400 font-bold">✓</span>
                  </div>

                  {/* Action summary note */}
                  <div className="text-[11px] text-slate-400 px-1 leading-relaxed">
                    {scenario.leftPhone.actionNote}
                  </div>
                </div>

                {/* Micro Audio Equalizer at bottom */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#60a5fa] animate-ping" />
                    Audio Connected
                  </span>
                  <span className="text-[#d6f549]">48kHz Opus</span>
                </div>
              </div>

              {/* Bottom Home Indicator Bar */}
              <div className="w-24 h-1 bg-slate-600 rounded-full mx-auto mt-1" />
            </div>

            {/* Left Floating App Icon Badge */}
            <div className="mt-4 w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#245ae2] to-[#60a5fa] flex items-center justify-center text-xl shadow-[0_0_25px_rgba(36,90,226,0.5)] border border-white/20">
              {scenario.leftBadgeIcon}
            </div>
          </div>

          {/* ================= CENTER: AUDEORA STEP PIPELINE ================= */}
          <div className="lg:col-span-4 flex flex-col items-center text-center px-2">
            
            {/* Audeora Logo & Branding */}
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-[#245ae2] flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(36,90,226,0.6)]">
                A
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Audeora
              </span>
            </div>

            {/* Steps Checklist Card (Composio Style) */}
            <div className="w-full bg-[#0d1424] border border-[#245ae2]/40 rounded-3xl p-5 sm:p-6 shadow-[0_0_50px_rgba(36,90,226,0.25)] backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#245ae2]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-4 text-left">
                Autonomous Action Pipeline
              </div>

              <div className="space-y-3 text-left">
                {scenario.centerSteps.map((step, idx) => (
                  <div 
                    key={idx}
                    className="bg-[#121a2e] border border-white/5 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs transition-all hover:border-[#245ae2]/40"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{step.icon}</span>
                      <span className="text-slate-200 font-medium">
                        {step.title}
                      </span>
                    </div>
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                      ✓
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Latency</span>
                <span className="text-emerald-400 font-bold">&lt;300ms Turnaround</span>
              </div>
            </div>
          </div>

          {/* ================= RIGHT PHONE: ACTION / DESTINATION ================= */}
          <div 
            className="lg:col-span-4 flex flex-col items-center"
            style={{
              transform: `translateY(${scrollProgress * 15}px)`,
              transition: 'transform 0.2s ease-out'
            }}
          >
            {/* Phone Bezel Frame */}
            <div className="relative w-[280px] sm:w-[310px] h-[520px] rounded-[42px] bg-[#0c121e] border-4 border-slate-700/60 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(36,90,226,0.2)] p-3.5 flex flex-col justify-between overflow-hidden">
              
              {/* Dynamic Island Notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full flex items-center justify-between px-3 z-30">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500/80 animate-pulse" />
                <span className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700" />
              </div>

              {/* Status Header */}
              <div className="pt-2 px-3 flex items-center justify-between text-[11px] font-mono text-slate-400 z-20">
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  <span>5G</span>
                  <span className="w-4 h-2 rounded-sm border border-slate-400 inline-block p-0.5">
                    <span className="w-full h-full bg-emerald-400 block rounded-2xs" />
                  </span>
                </div>
              </div>

              {/* Inner Screen Content: Live CRM / Spreadsheet / Calendar Table */}
              <div className="flex-1 mt-7 flex flex-col justify-between py-2">
                
                <div>
                  {/* Screen Header Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-xs">&lt;</span>
                      <span className="text-xs font-semibold text-white truncate max-w-[170px]">
                        {scenario.rightPhone.title}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                      Synced ✓
                    </span>
                  </div>

                  {/* Spreadsheet Grid / CRM Table */}
                  <div className="border border-white/10 rounded-xl overflow-hidden bg-[#0e1424] text-[10px]">
                    
                    {/* Table Headers */}
                    <div className="grid grid-cols-4 bg-[#141c30] p-2 border-b border-white/10 font-mono text-slate-400 font-semibold">
                      {scenario.rightPhone.columns.map((col, idx) => (
                        <div key={idx} className="truncate px-1">{col}</div>
                      ))}
                    </div>

                    {/* Table Rows */}
                    <div className="divide-y divide-white/5">
                      {scenario.rightPhone.rows.map((row, rIdx) => (
                        <div 
                          key={rIdx} 
                          className={`grid grid-cols-4 p-2 items-center ${
                            rIdx === 0 ? 'bg-[#245ae2]/15 text-white font-medium' : 'text-slate-300'
                          }`}
                        >
                          {row.map((cell, cIdx) => (
                            <div 
                              key={cIdx} 
                              className={`truncate px-1 ${
                                cIdx === 3 ? 'text-emerald-400 font-bold' : ''
                              }`}
                            >
                              {cell}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Destination Confirmation Card */}
                <div className="bg-[#12192c] border border-white/5 rounded-2xl p-3.5 my-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      Webhook Status
                    </span>
                    <span className="text-[10px] font-mono text-[#d6f549] font-bold">200 OK</span>
                  </div>
                  <div className="text-xs text-slate-200 leading-relaxed">
                    Data recorded automatically with full audio transcript and caller intent tags.
                  </div>
                </div>

                {/* Connected Telephony Footnote */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Carrier SIP: Exotel</span>
                  <span className="text-emerald-400">Zero Queue Time</span>
                </div>
              </div>

              {/* Bottom Home Indicator Bar */}
              <div className="w-24 h-1 bg-slate-600 rounded-full mx-auto mt-1" />
            </div>

            {/* Right Floating App Icon Badges */}
            <div className="mt-4 flex items-center gap-3">
              {scenario.rightBadges.map((badge, bIdx) => (
                <div 
                  key={bIdx}
                  className={`w-12 h-12 rounded-2xl ${badge.bg} flex items-center justify-center text-xl shadow-lg border`}
                  title={badge.name}
                >
                  {badge.icon}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Interactive Workflow Selector (Composio Style) */}
        <div className="mt-12 sm:mt-16 flex flex-col items-center justify-center gap-4">
          
          <div className="bg-[#0c1220]/90 backdrop-blur-2xl border border-white/10 rounded-full p-1.5 sm:p-2 flex items-center gap-2 shadow-2xl overflow-x-auto max-w-full">
            
            {/* Play/Pause Auto-cycle Toggle */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-center transition-colors shrink-0"
              title={isPlaying ? 'Pause Auto-cycle' : 'Resume Auto-cycle'}
            >
              {isPlaying ? (
                <span className="font-mono text-xs font-bold">||</span>
              ) : (
                <span className="font-mono text-xs font-bold">▶</span>
              )}
            </button>

            {/* Scenario Pills */}
            {SCENARIOS.map((scen, idx) => {
              const isSelected = activeScenarioIdx === idx;
              return (
                <button
                  key={scen.id}
                  onClick={() => {
                    setActiveScenarioIdx(idx);
                    setIsPlaying(false);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
                    isSelected
                      ? 'bg-[#245ae2] text-white shadow-[0_0_20px_rgba(36,90,226,0.6)]'
                      : 'bg-transparent text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{scen.icon}</span>
                  <span>{scen.tabLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Composio-style bottom helper text */}
          <div className="text-xs text-slate-400 text-center font-medium max-w-md">
            You choose which workflows your AI executes. Connect your telephony and CRM in minutes.
          </div>

        </div>

      </div>
    </section>
  );
}

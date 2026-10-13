import { Link } from 'react-router-dom';
import {
  BellRing,
  CalendarCheck,
  ClipboardList,
  CreditCard,
  Factory,
  HeartPulse,
  IndianRupee,
  Landmark,
  Package,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Stethoscope,
  Truck,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import Badge from '../components/ui/Badge';
import IndustryVisual from '../components/ui/IndustryVisual';
import TryItLiveCTA from '../components/TryItLiveCTA';

interface IndustryItem {
  id: string;
  title: string;
  badge: string;
  focus: string;
  icon: LucideIcon;
  tasks: [LucideIcon, LucideIcon, LucideIcon];
  accent: string;
  desc: string;
  sampleCall: {
    caller: string;
    agent: string;
  };
}

export default function Industries() {
  const industries: IndustryItem[] = [
    {
      id: 'healthcare',
      title: 'Healthcare, Hospitals & Diagnostics',
      badge: 'Appointments',
      focus: 'Patient Reminders',
      icon: HeartPulse,
      tasks: [CalendarCheck, Stethoscope, BellRing],
      accent: '#34d399',
      desc: 'Answer clinic and hospital calls, including after hours. Handle appointment bookings, send pre-procedure reminders in regional languages, and coordinate diagnostic report dispatch.',
      sampleCall: {
        caller: 'Mujhe Dr. Sharma ke paas checkup ke liye appointment chahiye kal.',
        agent: 'Dr. Sharma kal subah 10:30 AM aur shaam 5:00 PM par uplabdh hain. Aapko kaunsa samay theek rahega?'
      }
    },
    {
      id: 'retail',
      title: 'Retail & E-commerce',
      badge: 'Order Confirmation',
      focus: 'Returns & Exchanges',
      icon: ShoppingBag,
      tasks: [Package, Truck, RotateCcw],
      accent: '#d6f549',
      desc: 'Confirm cash-on-delivery orders after checkout, verify delivery addresses, answer order-status questions, and handle returns, exchanges and store enquiries.',
      sampleCall: {
        caller: 'Kya mera order dispatch ho gaya hai?',
        agent: 'Namaste Rahul! Aapka order #8492 kal shaam tak deliver ho jayega. Kya aapka delivery address HSR Layout wala hi hai?'
      }
    },
    {
      id: 'bfsi',
      title: 'Banking, Financial Services & Insurance',
      badge: 'KYC & Verification',
      focus: 'Payment Reminders',
      icon: Landmark,
      tasks: [CreditCard, ShieldCheck, IndianRupee],
      accent: '#60a5fa',
      desc: 'Automate loan and policy follow-ups, KYC re-verification nudges, renewal and EMI reminders, and promise-to-pay capture, with consent capture and clear, consistent scripts.',
      sampleCall: {
        caller: 'Main is hafte EMI nahi bhar paunga, salary late aayi hai.',
        agent: 'Samajh gaya. Kya hum 18 tareekh ko payment schedule kar dein? Main aapko payment link SMS kar deta hoon.'
      }
    },
    {
      id: 'manufacturing',
      title: 'Manufacturing & Distribution',
      badge: 'Dealer Orders',
      focus: 'Service Requests',
      icon: Factory,
      tasks: [ClipboardList, Truck, Wrench],
      accent: '#f59e0b',
      desc: 'Take dealer and distributor orders, share dispatch status, log service and warranty requests, and schedule technician visits without tying up your sales or service desk.',
      sampleCall: {
        caller: 'Our machine on line 3 is showing a pressure fault. Can someone come today?',
        agent: 'I have logged a service request for line 3. A technician can visit today between 2 and 4 PM. Shall I confirm that slot?'
      }
    }
  ];

  return (
    <div className="pt-28 pb-20 bg-[#080b11] text-slate-100 min-h-screen">
      
      {/* Hero Section */}
      <section className="py-20 px-4 text-center relative overflow-hidden">
        {/* Electric background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#245ae2]/15 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <Badge className="mb-6">INDUSTRIES</Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 text-white leading-tight">
            Engineered for businesses that <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60a5fa] via-[#245ae2] to-[#93c5fd]">live on the phone</span>.
          </h1>
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
            From patient appointments to dealer orders, Audeora adapts to the way your team already works.
          </p>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {industries.map((item) => (
            <div
              key={item.id}
              className="bg-[#0d121f] border border-white/10 rounded-3xl overflow-hidden hover:border-[#245ae2]/50 transition-all duration-300 flex flex-col group hover:-translate-y-1 shadow-xl hover:shadow-[0_0_40px_rgba(36,90,226,0.2)]"
            >
              {/* Animated industry graphic with badges */}
              <div className="relative w-full">
                <IndustryVisual icon={item.icon} tasks={item.tasks} accent={item.accent} />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-slate-200">
                    {item.badge}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#245ae2]/80 backdrop-blur-md border border-[#245ae2] text-[11px] font-bold text-white shadow-md">
                    {item.focus}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-7 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight mb-3 group-hover:text-[#60a5fa] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    {item.desc}
                  </p>

                  {/* Sample Call Preview Box */}
                  <div className="bg-[#080b11] border border-white/5 rounded-2xl p-4 mb-6">
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-mono mb-2 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d6f549]" />
                      Sample Voice Interaction
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="text-slate-400">
                        <span className="text-slate-500 font-semibold">Caller: </span>
                        "{item.sampleCall.caller}"
                      </div>
                      <div className="text-slate-200 bg-[#245ae2]/10 p-2 rounded-lg border border-[#245ae2]/20">
                        <span className="text-[#60a5fa] font-semibold">Audeora: </span>
                        "{item.sampleCall.agent}"
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <Link
                    to="/demo"
                    className="text-sm font-semibold text-[#60a5fa] hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    Test this workflow live
                    <span>&rarr;</span>
                  </Link>
                  <span className="text-[11px] text-slate-500 font-mono">Multilingual</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Enterprise Deployment Trust Stats */}
      <section className="py-20 px-4 max-w-6xl mx-auto border-t border-white/5 my-12">
        <div className="bg-gradient-to-r from-[#0e1526] via-[#121c33] to-[#0e1526] border border-[#245ae2]/30 rounded-3xl p-8 sm:p-12 text-center">
          <Badge className="mb-4">DEPLOYMENT</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Built for Telephony & CRM Workflows
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mb-8">
            Deploy Audeora on your existing phone numbers and carrier, and send call data into your CRM.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
              <div className="text-2xl font-bold text-white mb-1">Telephony</div>
              <div className="text-xs text-slate-400">Bring your own numbers</div>
            </div>
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
              <div className="text-2xl font-bold text-[#d6f549] mb-1">CRM</div>
              <div className="text-xs text-slate-400">Push call outcomes</div>
            </div>
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
              <div className="text-2xl font-bold text-[#60a5fa] mb-1">Voices</div>
              <div className="text-xs text-slate-400">Indian &amp; global</div>
            </div>
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
              <div className="text-2xl font-bold text-emerald-400 mb-1">Logs</div>
              <div className="text-xs text-slate-400">Transcripts &amp; recordings</div>
            </div>
          </div>
        </div>
      </section>

      <TryItLiveCTA />
    </div>
  );
}

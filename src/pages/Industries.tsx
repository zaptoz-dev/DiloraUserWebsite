import { useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import TryItLiveCTA from '../components/TryItLiveCTA';

interface IndustryItem {
  id: string;
  category: 'growth' | 'ops' | 'bfsi' | 'services';
  title: string;
  badge: string;
  roi: string;
  image: string;
  desc: string;
  sampleCall: {
    caller: string;
    agent: string;
  };
}

export default function Industries() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const industries: IndustryItem[] = [
    {
      id: 'real-estate',
      category: 'growth',
      title: 'Real Estate & Property Portals',
      badge: 'Speed-to-Lead',
      roi: '<30s Lead Callback',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
      desc: 'Qualify portal inquiries within seconds of form submission. Verify budget, property type, and preferred locality, then book site visits directly into your sales team’s Google or Outlook calendar.',
      sampleCall: {
        caller: 'Hi, I saw your 3BHK listing in Whitefield, is it still available?',
        agent: 'Yes, we have 2 high-floor units ready for possession. Would you like to schedule a private site visit this Saturday at 11 AM or 3 PM?'
      }
    },
    {
      id: 'healthcare',
      category: 'services',
      title: 'Healthcare, Hospitals & Diagnostics',
      badge: 'Zero Missed Appointments',
      roi: '99.4% Call Answer Rate',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
      desc: 'Answer every missed clinic and hospital call 24/7. Handle appointment bookings, send pre-procedure reminders in regional languages, and coordinate diagnostic report dispatch without human queue delays.',
      sampleCall: {
        caller: 'Mujhe Dr. Sharma ke paas checkup ke liye appointment chahiye kal.',
        agent: 'Dr. Sharma kal subah 10:30 AM aur shaam 5:00 PM par uplabdh hain. Aapko kaunsa samay theek rahega?'
      }
    },
    {
      id: 'ecommerce',
      category: 'ops',
      title: 'E-commerce & D2C Brands',
      badge: 'RTO & Abandoned Cart Recovery',
      roi: '38% RTO Reduction',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      desc: 'Confirm cash-on-delivery orders immediately post-checkout, verify pin-code deliverability, update shipping addresses, and recover high-value abandoned checkouts with personalized offers.',
      sampleCall: {
        caller: 'Kya mera order dispatch ho gaya hai?',
        agent: 'Namaste Rahul! Aapka Blue Dart tracking order #8492 kal shaam tak deliver ho jayega. Kya aapka delivery address HSR Layout wala hi hai?'
      }
    },
    {
      id: 'banking',
      category: 'bfsi',
      title: 'Banking, NBFCs & Fintech',
      badge: 'Compliance & Verification',
      roi: '4.5x Outreach Capacity',
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
      desc: 'Automate loan pre-qualification, credit card activation follow-ups, and KYC re-verification nudges with auditable consent tracking and airtight financial compliance scripting.',
      sampleCall: {
        caller: 'I received a message regarding my pre-approved business credit line.',
        agent: 'Welcome! You have a pre-qualified limit of ₹15 Lakhs at 10.5% interest. Would you like me to send the instant digital KYC link to your WhatsApp?'
      }
    },
    {
      id: 'collections',
      category: 'bfsi',
      title: 'Debt Recovery & Collections',
      badge: 'Promise-to-Pay (PTP)',
      roi: '2.8x Promise-to-Pay Capture',
      image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
      desc: 'Conduct polite, empathetic, and persistent payment reminders. Lock in promise-to-pay dates, calculate settlement figures in real time, and log audio recordings for complete dispute defense.',
      sampleCall: {
        caller: 'Main is hafte pay nahi kar paunga, salary late aayi hai.',
        agent: 'Samajh gaya sir. Kya hum 18 tareekh ko payment schedule kar dein taaki aapka CIBIL score affect na ho? Main payment link SMS kar raha hoon.'
      }
    },
    {
      id: 'automotive',
      category: 'growth',
      title: 'Automotive Dealerships & Service',
      badge: 'Test Drive Conversion',
      roi: '62% Test Drive Booking',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      desc: 'Respond to new vehicle quotes in under a minute, schedule doorstep test drives, and trigger routine service maintenance reminders before customers defect to third-party garages.',
      sampleCall: {
        caller: 'I want a quote for the new EV SUV top model.',
        agent: 'The top EV variant is currently available in Pearl White and Matte Grey. Would you prefer a home test drive tomorrow, or would you like to visit our Andheri showroom?'
      }
    },
    {
      id: 'logistics',
      category: 'ops',
      title: 'Logistics, Supply Chain & Courier',
      badge: 'First-Attempt Delivery Rate',
      roi: '91% First-Attempt Success',
      image: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80',
      desc: 'Eliminate delivery failures before trucks depart. Confirm recipient availability, collect landmark details, and handle real-time delivery reschedule requests without human dispatchers.',
      sampleCall: {
        caller: 'Main abhi ghar pe nahi hoon, kya courier delivery kal ho sakti hai?',
        agent: 'Bilkul! Maine aapka delivery slot kal subah 11 baje se 2 baje ke beech reschedule kar diya hai. Driver aapko aane se pehle call karega.'
      }
    },
    {
      id: 'education',
      category: 'services',
      title: 'EdTech & University Admissions',
      badge: 'Student Counseling Booking',
      roi: '5x Lead Qualification Speed',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
      desc: 'Call student inquiries immediately, explain course syllabi, verify education background, and schedule 1-on-1 counselor guidance sessions in their native language.',
      sampleCall: {
        caller: 'What is the eligibility for the Data Science executive program?',
        agent: 'The program requires a graduation degree with at least 50% marks. Are you currently working, and how many years of work experience do you have?'
      }
    },
    {
      id: 'bpo',
      category: 'ops',
      title: 'BPOs & Customer Support Shifts',
      badge: 'Night & Peak Shift Absorption',
      roi: '75% Lower Operational Cost',
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80',
      desc: 'Absorb high-volume repetitive Tier-1 inquiries, manage weekend/midnight overflows, and let human agents focus on complex exceptions with auto-transcribed context handoffs.',
      sampleCall: {
        caller: 'I need to check why my invoice shows an unexpected extra charge.',
        agent: 'I have pulled up your latest invoice #7102. The charge corresponds to the cloud add-on activated on Sept 1st. Would you like me to break down each line item?'
      }
    }
  ];

  const categories = [
    { id: 'all', label: 'All Industries' },
    { id: 'growth', label: 'Sales & Growth' },
    { id: 'ops', label: 'Operations & Logistics' },
    { id: 'bfsi', label: 'BFSI & Collections' },
    { id: 'services', label: 'Healthcare & Services' }
  ];

  const filtered = selectedCategory === 'all' 
    ? industries 
    : industries.filter(i => i.category === selectedCategory);

  return (
    <div className="pt-28 pb-20 bg-[#080b11] text-slate-100 min-h-screen">
      
      {/* Hero Section */}
      <section className="py-20 px-4 text-center relative overflow-hidden">
        {/* Electric background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#245ae2]/15 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <Badge className="mb-6">ENTERPRISE VERTICALS</Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 text-white leading-tight">
            Engineered for businesses that <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60a5fa] via-[#245ae2] to-[#93c5fd]">live on the phone</span>.
          </h1>
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10">
            From 30-second speed-to-lead calls to compliant debt recovery and order confirmations, Dialora adapts to your exact operational playbook.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all border ${
                  selectedCategory === cat.id
                    ? 'bg-[#245ae2] border-[#245ae2] text-white shadow-[0_0_20px_rgba(36,90,226,0.5)]'
                    : 'bg-[#0f1422] border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-[#0d121f] border border-white/10 rounded-3xl overflow-hidden hover:border-[#245ae2]/50 transition-all duration-300 flex flex-col group hover:-translate-y-1 shadow-xl hover:shadow-[0_0_40px_rgba(36,90,226,0.2)]"
            >
              {/* Card Image Banner with Badges */}
              <div className="relative h-52 w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-80"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d121f] via-[#0d121f]/40 to-transparent" />
                
                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-slate-200">
                    {item.badge}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#245ae2]/80 backdrop-blur-md border border-[#245ae2] text-[11px] font-bold text-white shadow-md">
                    {item.roi}
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
                        <span className="text-[#60a5fa] font-semibold">Dialora: </span>
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
                  <span className="text-[11px] text-slate-500 font-mono">10+ Voices</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Enterprise Deployment Trust Stats */}
      <section className="py-20 px-4 max-w-6xl mx-auto border-t border-white/5 my-12">
        <div className="bg-gradient-to-r from-[#0e1526] via-[#121c33] to-[#0e1526] border border-[#245ae2]/30 rounded-3xl p-8 sm:p-12 text-center">
          <Badge className="mb-4">TELECOM COMPLIANCE</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Certified for Enterprise Telephony & CRM Workflows
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mb-8">
            Deploy Dialora on your existing carrier trunk (Exotel, Twilio, Plivo, Tata Tele) with bi-directional CRM integration into Salesforce, Zoho, LeadSquared, and HubSpot.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
              <div className="text-2xl font-bold text-white mb-1">99.98%</div>
              <div className="text-xs text-slate-400">SLA Availability</div>
            </div>
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
              <div className="text-2xl font-bold text-[#d6f549] mb-1">&lt;450ms</div>
              <div className="text-xs text-slate-400">Audio Turnaround</div>
            </div>
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
              <div className="text-2xl font-bold text-[#60a5fa] mb-1">1000+</div>
              <div className="text-xs text-slate-400">Concurrent Calls</div>
            </div>
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
              <div className="text-2xl font-bold text-emerald-400 mb-1">100%</div>
              <div className="text-xs text-slate-400">Auditable Logs</div>
            </div>
          </div>
        </div>
      </section>

      <TryItLiveCTA />
    </div>
  );
}

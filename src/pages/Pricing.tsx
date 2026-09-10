import { useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import TryItLiveCTA from '../components/TryItLiveCTA';

export default function Pricing() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const tiers = [
    {
      name: "Pilot / Starter",
      tag: "Proof of Concept",
      desc: "For fast-moving teams testing their first automated inbound or outbound voice workflow.",
      badge: "Fast Launch",
      isPopular: false,
      features: [
        "1 Production Voice Agent",
        "Up to 50 concurrent calls",
        "10+ Indian & Global accents",
        "Sub-500ms conversation latency",
        "Full call transcripts & recordings",
        "CRM Webhook integrations (Zapier, Make)",
        "Standard Email & Chat Support"
      ],
      ctaText: "Start Pilot Trial",
      ctaLink: "/demo"
    },
    {
      name: "Growth & Scale",
      tag: "High Volume Calling",
      desc: "For scaling operations with continuous multi-channel calling and bi-directional CRM sync.",
      badge: "Most Popular",
      isPopular: true,
      features: [
        "Up to 5 Specialized Voice Agents",
        "Up to 500 concurrent call channels",
        "Native CRM sync (Salesforce, Zoho, HubSpot)",
        "Warm human agent transfer with context summary",
        "Custom vocabulary & regional slang fine-tuning",
        "Real-time analytics & sentiment scoring",
        "Dedicated Slack channel & priority SLA"
      ],
      ctaText: "Schedule Scale Demo",
      ctaLink: "/demo"
    },
    {
      name: "Enterprise & Agency",
      tag: "Multi-Client Deployment",
      desc: "For agencies, BPOs, and enterprises requiring dedicated infrastructure and white-labeling.",
      badge: "Bespoke SLA",
      isPopular: false,
      features: [
        "Unlimited Voice Agents & isolated workspaces",
        "1,000+ parallel calls with zero queue wait",
        "Custom cloned voice models & bespoke personas",
        "Direct carrier SIP trunking (Exotel, Twilio, Plivo)",
        "On-premise / private cloud deployment option",
        "Full SOC2 & HIPAA compliant data handling",
        "24/7 dedicated solutions engineer"
      ],
      ctaText: "Contact Enterprise Sales",
      ctaLink: "/demo"
    }
  ];

  const faqs = [
    {
      q: "Can I bring my existing phone numbers and telecom carrier?",
      a: "Yes. Dialora easily connects to your existing Exotel, Twilio, Plivo, or SIP trunk credentials. You don't have to change your publicized numbers or ported carriers."
    },
    {
      q: "How does Dialora handle callers speaking Hinglish or regional dialects?",
      a: "Our speech pipeline is purpose-built for Indian multilingual patterns. In the first 2 seconds, Dialora classifies whether the caller prefers Hindi, English, Hinglish, Tamil, Telugu, or Gujarati, and switches context seamlessly."
    },
    {
      q: "What happens when a caller asks a complex edge-case question?",
      a: "Dialora executes a graceful warm transfer. The caller is connected to your human agent while an instant live summary pop appears on the human agent's screen, so the customer never repeats themselves."
    },
    {
      q: "How fast can we launch our first live production campaign?",
      a: "Most businesses go live within 24 to 48 hours. You simply provide your qualification script, attach your CRM webhook, test a few trial calls, and launch."
    }
  ];

  return (
    <div className="pt-28 pb-20 bg-[#080b11] text-slate-100 min-h-screen">
      
      {/* Hero Section */}
      <section className="py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#245ae2]/15 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <Badge className="mb-6">TRANSPARENT VALUE</Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 text-white leading-tight">
            Start with one workflow.<br />
            Scale to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60a5fa] via-[#245ae2] to-[#93c5fd]">every customer call</span>.
          </h1>
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Predictable plans tailored to your call volume and operational depth. Talk to our solutions team for a dedicated pilot.
          </p>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 relative ${
                tier.isPopular
                  ? 'bg-gradient-to-b from-[#131b2e] to-[#0f1422] border-2 border-[#245ae2] shadow-[0_0_50px_rgba(36,90,226,0.3)] -translate-y-2'
                  : 'bg-[#0d121f] border border-white/10 hover:border-white/20'
              }`}
            >
              {tier.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#245ae2] text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                  {tier.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    {tier.tag}
                  </span>
                  {!tier.isPopular && (
                    <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-400 font-semibold">
                      {tier.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-3xl font-bold text-white tracking-tight mb-3">
                  {tier.name}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-8">
                  {tier.desc}
                </p>

                {/* Features list */}
                <div className="space-y-3.5 mb-10">
                  {tier.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                      <span className="w-4 h-4 rounded-full bg-[#245ae2]/20 text-[#60a5fa] flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0">
                        ✓
                      </span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Link
                  to={tier.ctaLink}
                  className={`w-full py-4 rounded-xl font-semibold text-sm text-center block transition-all shadow-md ${
                    tier.isPopular
                      ? 'bg-[#245ae2] hover:bg-[#1d4ed8] text-white shadow-[0_0_25px_rgba(36,90,226,0.5)]'
                      : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20'
                  }`}
                >
                  {tier.ctaText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Enterprise FAQ Section */}
      <section className="py-20 px-4 max-w-4xl mx-auto border-t border-white/5 mt-16">
        <div className="text-center mb-12">
          <Badge className="mb-4">COMMON QUESTIONS</Badge>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#0d121f] border border-white/10 rounded-2xl overflow-hidden transition-all"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 font-semibold text-white hover:text-[#60a5fa] transition-colors"
              >
                <span>{faq.q}</span>
                <span className="text-xl font-mono text-slate-400 shrink-0">
                  {activeFaq === idx ? '−' : '+'}
                </span>
              </button>
              {activeFaq === idx && (
                <div className="px-6 pb-6 text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <TryItLiveCTA />
    </div>
  );
}

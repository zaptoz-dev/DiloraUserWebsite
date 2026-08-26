import Badge from '../components/ui/Badge';
import GlassCard from '../components/ui/GlassCard';
import TryItLiveCTA from '../components/TryItLiveCTA';
import { Link } from 'react-router-dom';

export default function Pricing() {
  const tiers = [
    { 
      name: "Launch", 
      desc: "For teams proving their first inbound or outbound workflow. Includes one agent, core analytics and CRM webhooks." 
    },
    { 
      name: "Scale", 
      desc: "For growing call operations. Add multiple agents, advanced reporting, campaign controls and warm transfers." 
    },
    { 
      name: "Agency", 
      desc: "For multi-client teams. Isolated workspaces, reusable templates, central governance and volume pricing." 
    }
  ];

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6">PRICING</Badge>
          <h1 className="text-5xl md:text-6xl font-semibold leading-tight tracking-tight mb-6">
            Start with one workflow.<br/>Scale to <span className="text-gradient">every call</span>.
          </h1>
          <p className="text-xl text-[var(--muted-foreground)] leading-relaxed max-w-2xl mx-auto">
            Pricing follows usage and operational complexity. Talk to us for a plan matched to your call volume.
          </p>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="py-12 px-4 mb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, idx) => (
              <GlassCard key={idx} className="flex flex-col h-full relative overflow-hidden p-8 border-[var(--border)]">
                {idx === 1 && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-signature blur-[80px] opacity-20 pointer-events-none rounded-full"></div>
                )}
                <h3 className="text-3xl font-semibold mb-6">{tier.name}</h3>
                <p className="text-[var(--muted-foreground)] leading-relaxed grow mb-8 text-lg">
                  {tier.desc}
                </p>
                <div className="pt-6 border-t border-[var(--border)]/50 mt-auto">
                   <Link to="/demo" className="inline-flex w-full justify-center glass-button px-6 py-3 rounded-xl font-semibold hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] transition-all text-center">
                     Talk to us
                   </Link>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <TryItLiveCTA />
    </div>
  );
}

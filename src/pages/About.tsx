import Badge from '../components/ui/Badge';
import GlassCard from '../components/ui/GlassCard';
import TryItLiveCTA from '../components/TryItLiveCTA';

export default function About() {
  const values = [
    { title: "Built in India", desc: "Designed around regional languages, local telephony and the realities of high-volume Indian call operations." },
    { title: "Outcome obsessed", desc: "A good conversation is not enough. Every agent is designed to book, qualify, resolve or escalate." },
    { title: "Trust by design", desc: "Consent, recording controls, redaction and guardrails are part of the system—not an afterthought." },
  ];

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6">ABOUT DIALORA</Badge>
          <h1 className="text-5xl md:text-6xl font-semibold leading-tight tracking-tight mb-6">
            Making business calls <span className="text-gradient">feel human</span> again.
          </h1>
          <p className="text-xl text-[var(--muted-foreground)] leading-relaxed max-w-3xl mx-auto">
            We are building voice infrastructure for the way India actually speaks: multilingual, code-mixed, fast and deeply personal.
          </p>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-12 px-4 mb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((val, idx) => (
              <GlassCard key={idx} className="flex flex-col h-full hover:bg-[var(--card)]/40 transition-colors p-8 text-center md:text-left">
                <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mb-8 mx-auto md:mx-0 text-[var(--primary)] shrink-0 shadow-glow-soft">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-4">{val.title}</h3>
                <p className="text-[var(--muted-foreground)] leading-relaxed grow text-lg">{val.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <TryItLiveCTA />
    </div>
  );
}

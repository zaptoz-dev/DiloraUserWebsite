import Badge from '../components/ui/Badge';
import GlassCard from '../components/ui/GlassCard';
import TryItLiveCTA from '../components/TryItLiveCTA';

export default function Features() {
  const features = [
    { title: "Multi-agent, multi-agency", desc: "Every agency gets its own workspace: agents, numbers, scripts, voices and reports stay separated. Clone a winning agent into a new client account in seconds and roll changes out across a whole portfolio from one console." },
    { title: "Voice that passes for human", desc: "Dilora listens while it speaks. Callers can cut in mid-sentence, change their mind, mumble a pincode — the agent recovers the way a trained tele-caller would, not the way an IVR does." },
    { title: "9 Indian languages", desc: "Pick a voice and a language per campaign, or let Dilora detect the caller's language in the first two seconds and switch. Code-mixed Hinglish is handled natively, not as an afterthought." },
    { title: "Always on the line", desc: "Festival spikes, midnight enquiries, Monday-morning floods — Dilora answers all of them at once and never sounds tired on the four hundredth call." },
    { title: "Live analytics & summaries", desc: "Each call lands in your dashboard with a searchable transcript, a three-line summary, detected intent, sentiment curve and the action taken — so ops teams coach the agent instead of guessing." },
    { title: "Telephony & CRM ready", desc: "Bring your own numbers and your own CRM. Dilora writes back dispositions, creates leads and fires webhooks the moment a conversation ends." },
    { title: "Custom scripts per client", desc: "Version your prompts, A/B test openers, lock compliance lines so they can never be skipped, and keep a changelog of who changed what." },
    { title: "Compliance & recordings", desc: "Recording consent, DNC list enforcement, PII redaction in transcripts and configurable retention keep legal comfortable while your calls keep running." },
    { title: "Warm human handoff", desc: "When intent gets complex or sentiment drops, Dilora transfers the call and pushes the summary to the agent's screen before they say hello." },
  ];

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6">CAPABILITIES</Badge>
          <h1 className="text-5xl md:text-6xl font-semibold leading-tight tracking-tight mb-6">
            Every call, handled like your <span className="text-gradient">best agent</span>.
          </h1>
          <p className="text-xl text-[var(--muted-foreground)] leading-relaxed">
            Natural conversations, operational control and measurable outcomes—without adding another shift.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 px-4 mb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <GlassCard key={idx} className="flex flex-col h-full hover:bg-[var(--card)]/40 transition-colors">
                <div className="w-12 h-12 rounded-xl glass flex items-center justify-center mb-6 text-[var(--primary)] shrink-0">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-[var(--muted-foreground)] leading-relaxed grow">{feature.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <TryItLiveCTA />
    </div>
  );
}

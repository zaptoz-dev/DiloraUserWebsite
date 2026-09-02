import Badge from '../components/ui/Badge';
import GlassCard from '../components/ui/GlassCard';
import TryItLiveCTA from '../components/TryItLiveCTA';

export default function Industries() {
  const industries = [
    { emoji: "🏙️", title: "Real Estate", desc: "Qualify portal leads within 30 seconds of enquiry, capture budget and locality, and book site visits straight into the sales calendar." },
    { emoji: "🩺", title: "Healthcare & Clinics", desc: "Answer every missed clinic call, book and reschedule appointments, and run vaccination or follow-up reminder campaigns." },
    { emoji: "🎧", title: "BPOs & Call Centers", desc: "Absorb tier-1 volume, pre-qualify before a human picks up, and let Dialora run the overflow shift nobody wants to staff." },
    { emoji: "📦", title: "E-commerce & D2C", desc: "Confirm COD orders, cut RTO, chase abandoned carts and handle delivery status calls without a support queue." },
    { emoji: "🏦", title: "Banking, NBFC & Insurance", desc: "Run eligibility checks, renewal reminders and KYC nudges with consent capture and compliance lines locked in." },
    { emoji: "💸", title: "Collections & Recovery", desc: "Polite, consistent, fully logged reminder calls at scale — with promise-to-pay capture and zero script drift." },
    { emoji: "🎓", title: "Education & EdTech", desc: "Call every admission enquiry in minutes, explain courses and fees in the parent's language, book counselling slots." },
    { emoji: "🧳", title: "Hospitality & Travel", desc: "Take room enquiries, confirm bookings, upsell packages and handle cancellations round the clock." },
    { emoji: "🚗", title: "Automotive Dealerships", desc: "Book test drives, run service reminders and follow up on quotes before the customer walks into a rival showroom." },
    { emoji: "🚚", title: "Logistics & Delivery", desc: "Confirm addresses before dispatch, coordinate re-attempts, and update consignees automatically." },
    { emoji: "🏛️", title: "Government & Public Services", desc: "Broadcast scheme information, run citizen surveys and handle grievance intake in regional languages." },
    { emoji: "🍽️", title: "Restaurants", desc: "Never drop a reservation or takeaway order during the dinner rush — Dialora takes them all in parallel." },
    { emoji: "🧑💼", title: "HR & Recruitment", desc: "Screen applicants at volume: availability, notice period, CTC, location and language fit — scored automatically." },
    { emoji: "🎫", title: "Events & Ticketing", desc: "Handle ticket enquiries, confirm RSVPs and run reminder waves before doors open." },
    { emoji: "🛠️", title: "Local Services", desc: "Salons, repair shops and clinics get a receptionist that works nights, weekends and festival weeks." },
  ];

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6">INDUSTRIES</Badge>
          <h1 className="text-5xl md:text-6xl font-semibold leading-tight tracking-tight mb-6">
            Built for businesses that <span className="text-gradient">live on the phone</span>.
          </h1>
          <p className="text-xl text-[var(--muted-foreground)] leading-relaxed">
            From the first lead response to the final payment reminder, Dialora adapts to your operation.
          </p>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-12 px-4 mb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((item, idx) => (
              <GlassCard key={idx} className="flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
                <div className="text-4xl mb-6">
                  {item.emoji}
                </div>
                <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-[var(--muted-foreground)] leading-relaxed grow">{item.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <TryItLiveCTA />
    </div>
  );
}

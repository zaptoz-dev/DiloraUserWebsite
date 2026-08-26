import Badge from '../components/ui/Badge';
import GlassCard from '../components/ui/GlassCard';

export default function Demo() {
  return (
    <div className="pt-24 pb-24">
      {/* Hero Section */}
      <section className="py-12 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <Badge className="mb-6">LIVE CALLBACK</Badge>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tight mb-6">
            Hear Dilora on your <span className="text-gradient">own phone</span>.
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] leading-relaxed max-w-2xl mx-auto">
            Tell us where to call. This demo currently previews the complete callback experience without triggering a real telephony request.
          </p>
        </div>
      </section>

      {/* Demo Form */}
      <section className="px-4">
        <div className="max-w-xl mx-auto">
          <GlassCard className="p-8 md:p-10 relative overflow-hidden">
             {/* Glow background */}
             <div className="absolute -top-40 -right-40 w-80 h-80 bg-signature blur-[100px] opacity-20 pointer-events-none rounded-full"></div>
             
             <form className="flex flex-col gap-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
                
                <div className="flex flex-col gap-2">
                   <label htmlFor="name" className="text-sm font-medium">Full name</label>
                   <input 
                      type="text" 
                      id="name" 
                      placeholder="Aarav Sharma" 
                      className="bg-[var(--input)] border border-[var(--border)] rounded-xl px-4 py-3 text-white placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all"
                   />
                </div>

                <div className="flex flex-col gap-2">
                   <label htmlFor="company" className="text-sm font-medium">Company name</label>
                   <input 
                      type="text" 
                      id="company" 
                      placeholder="Northline Growth" 
                      className="bg-[var(--input)] border border-[var(--border)] rounded-xl px-4 py-3 text-white placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all"
                   />
                </div>

                <div className="flex flex-col gap-2">
                   <label htmlFor="mobile" className="text-sm font-medium">Mobile number</label>
                   <div className="flex gap-2">
                      <select className="bg-[var(--input)] border border-[var(--border)] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all max-w-[100px] appearance-none cursor-pointer">
                         <option value="+91">+91</option>
                         <option value="+971">+971</option>
                         <option value="+65">+65</option>
                         <option value="+44">+44</option>
                         <option value="+1">+1</option>
                      </select>
                      <input 
                         type="tel" 
                         id="mobile" 
                         placeholder="98765 43210" 
                         className="flex-1 bg-[var(--input)] border border-[var(--border)] rounded-xl px-4 py-3 text-white placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all"
                      />
                   </div>
                </div>

                <div className="flex flex-col gap-2">
                   <label htmlFor="email" className="text-sm font-medium">Company email</label>
                   <input 
                      type="email" 
                      id="email" 
                      placeholder="you@company.com" 
                      className="bg-[var(--input)] border border-[var(--border)] rounded-xl px-4 py-3 text-white placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all"
                   />
                </div>

                <div className="flex flex-col gap-2">
                   <label htmlFor="intent" className="text-sm font-medium">What do you want Dilora to do?</label>
                   <select 
                      id="intent"
                      className="bg-[var(--input)] border border-[var(--border)] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all appearance-none cursor-pointer"
                   >
                      <option value="sales">Sales & Lead Generation</option>
                      <option value="support">Customer Support</option>
                      <option value="booking">Appointment Booking</option>
                      <option value="collections">Collections & Recovery</option>
                      <option value="other">Other</option>
                   </select>
                </div>

                <div className="flex flex-col gap-2">
                   <label htmlFor="notes" className="text-sm font-medium">Anything else? <span className="text-[var(--muted-foreground)]">(Optional)</span></label>
                   <textarea 
                      id="notes" 
                      placeholder="We run 1,200 outbound calls a day across Hindi and Marathi…" 
                      rows={4}
                      className="bg-[var(--input)] border border-[var(--border)] rounded-xl px-4 py-3 text-white placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all resize-none"
                   ></textarea>
                </div>

                <button type="submit" className="bg-signature w-full py-4 rounded-xl text-lg font-semibold mt-4 hover:opacity-90 transition-opacity">
                   Get a Call From Dilora
                </button>
             </form>
          </GlassCard>
          
          <p className="text-center text-[var(--muted-foreground)] text-sm mt-8">
             No credit card, no sales script. One live call, in the language you choose.
          </p>
        </div>
      </section>
    </div>
  );
}

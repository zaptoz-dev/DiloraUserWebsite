import { useMemo, useState } from 'react';
import Badge from '../components/ui/Badge';
import GlassCard from '../components/ui/GlassCard';
import { toE164 } from '../../shared/phone.js';

const INPUT_CLASS =
  'bg-[var(--input)] border border-[var(--border)] rounded-xl px-4 py-3 text-white placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all disabled:opacity-50 disabled:cursor-not-allowed';

const COUNTRY_CODES = ['+91', '+971', '+65', '+44', '+1'];

/**
 * Empty when the site is served by our own Node server, which hosts the API on
 * the same origin. Set VITE_API_BASE_URL at build time for a static-only
 * deployment (GitHub Pages), where the API lives on a different host — that
 * host must then allow this origin via DEMO_CORS_ORIGINS.
 */
const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

type Status =
  | { kind: 'idle' }
  | { kind: 'placing' }
  | { kind: 'placed'; message: string }
  // Bolna accepted the request but didn't actually dial — most commonly
  // because it fell outside India's 9 AM-9 PM calling-hours rule and Bolna
  // pushed it to the next allowed slot instead of erroring.
  | { kind: 'rescheduled'; message: string }
  | { kind: 'error'; message: string };

export default function Demo() {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [intent, setIntent] = useState('sales');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const normalized = useMemo(
    () => toE164(phone, countryCode),
    [phone, countryCode]
  );

  const busy = status.kind === 'placing';
  const canSubmit = Boolean(normalized) && name.trim() !== '' && !busy;

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      setStatus({ kind: 'error', message: 'Please tell us your name.' });
      return;
    }
    if (!normalized) {
      setStatus({
        kind: 'error',
        message: 'Enter a valid mobile number, e.g. 98765 43210.',
      });
      return;
    }

    setStatus({ kind: 'placing' });

    try {
      const res = await fetch(`${API_BASE}/api/demo-call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          company: company.trim(),
          countryCode,
          phone: phone.trim(),
          email: email.trim(),
          intent,
          notes: notes.trim(),
        }),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error || `Something went wrong (${res.status}).`);

      if (body.status === 'rescheduled') {
        setStatus({ kind: 'rescheduled', message: body.message });
      } else {
        setStatus({
          kind: 'placed',
          message: `Dialora is dialling ${normalized} now. Pick up — it usually rings within a few seconds.`,
        });
      }
      // Clear the number so a stray second submit can't re-dial the same person.
      setPhone('');
      setNotes('');
    } catch (error) {
      setStatus({
        kind: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Could not place the call. Please try again.',
      });
    }
  }

  return (
    <div className="pt-24 pb-24">
      {/* Hero Section */}
      <section className="py-12 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <Badge className="mb-6">LIVE CALLBACK</Badge>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tight mb-6">
            Hear Dialora on your <span className="text-gradient">own phone</span>.
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] leading-relaxed max-w-2xl mx-auto">
            Tell us where to call and Dialora will ring you straight away — a real
            call from the live agent, not a recording.
          </p>
        </div>
      </section>

      {/* Demo Form */}
      <section className="px-4">
        <div className="max-w-xl mx-auto">
          <GlassCard className="p-8 md:p-10 relative overflow-hidden">
             {/* Glow background */}
             <div className="absolute -top-40 -right-40 w-80 h-80 bg-signature blur-[100px] opacity-20 pointer-events-none rounded-full"></div>

             <form className="flex flex-col gap-6 relative z-10" onSubmit={submit}>

                <div className="flex flex-col gap-2">
                   <label htmlFor="name" className="text-sm font-medium">Full name</label>
                   <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={busy}
                      placeholder="Aarav Sharma"
                      className={INPUT_CLASS}
                   />
                </div>

                <div className="flex flex-col gap-2">
                   <label htmlFor="company" className="text-sm font-medium">Company name</label>
                   <input
                      type="text"
                      id="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      disabled={busy}
                      placeholder="Northline Growth"
                      className={INPUT_CLASS}
                   />
                </div>

                <div className="flex flex-col gap-2">
                   <label htmlFor="mobile" className="text-sm font-medium">Mobile number</label>
                   <div className="flex gap-2">
                      <select
                         value={countryCode}
                         onChange={(e) => setCountryCode(e.target.value)}
                         disabled={busy}
                         aria-label="Country code"
                         className={`${INPUT_CLASS} max-w-[100px] appearance-none cursor-pointer`}
                      >
                         {COUNTRY_CODES.map((code) => (
                           <option key={code} value={code}>{code}</option>
                         ))}
                      </select>
                      <input
                         type="tel"
                         id="mobile"
                         inputMode="tel"
                         value={phone}
                         onChange={(e) => setPhone(e.target.value)}
                         disabled={busy}
                         placeholder="98765 43210"
                         className={`${INPUT_CLASS} flex-1`}
                      />
                   </div>
                   <p className="text-xs text-[var(--muted-foreground)] min-h-[1rem]">
                      {phone.trim() === ''
                        ? 'Dialora will call this number in the next few seconds.'
                        : normalized
                          ? `Will dial ${normalized}`
                          : 'That number doesn’t look complete yet.'}
                   </p>
                </div>

                <div className="flex flex-col gap-2">
                   <label htmlFor="email" className="text-sm font-medium">Company email</label>
                   <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={busy}
                      placeholder="you@company.com"
                      className={INPUT_CLASS}
                   />
                </div>

                <div className="flex flex-col gap-2">
                   <label htmlFor="intent" className="text-sm font-medium">What do you want Dialora to do?</label>
                   <select
                      id="intent"
                      value={intent}
                      onChange={(e) => setIntent(e.target.value)}
                      disabled={busy}
                      className={`${INPUT_CLASS} appearance-none cursor-pointer`}
                   >
                      <option value="sales">Sales &amp; Lead Generation</option>
                      <option value="support">Customer Support</option>
                      <option value="booking">Appointment Booking</option>
                      <option value="collections">Collections &amp; Recovery</option>
                      <option value="other">Other</option>
                   </select>
                </div>

                <div className="flex flex-col gap-2">
                   <label htmlFor="notes" className="text-sm font-medium">Anything else? <span className="text-[var(--muted-foreground)]">(Optional)</span></label>
                   <textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      disabled={busy}
                      placeholder="We run 1,200 outbound calls a day across Hindi and Marathi…"
                      rows={4}
                      className={`${INPUT_CLASS} resize-none`}
                   ></textarea>
                </div>

                <button
                   type="submit"
                   disabled={!canSubmit}
                   className="bg-signature w-full py-4 rounded-xl text-lg font-semibold mt-4 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                   {busy && (
                     <span
                       aria-hidden
                       className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                     />
                   )}
                   {busy ? 'Placing your call…' : 'Get a Call From Dialora'}
                </button>

                <div aria-live="polite">
                  {status.kind === 'placed' && (
                    <div className="rounded-xl border border-[var(--border)] bg-white/5 px-4 py-3 text-sm">
                      <p className="font-semibold mb-1">Calling you now.</p>
                      <p className="text-[var(--muted-foreground)]">{status.message}</p>
                    </div>
                  )}
                  {status.kind === 'rescheduled' && (
                    <div className="rounded-xl border border-[var(--ring)]/50 bg-white/5 px-4 py-3 text-sm">
                      <p className="font-semibold mb-1">Call scheduled, not placed yet.</p>
                      <p className="text-[var(--muted-foreground)]">{status.message}</p>
                    </div>
                  )}
                  {status.kind === 'error' && (
                    <div className="rounded-xl border border-[#ff3c00]/50 bg-[#ff3c00]/10 px-4 py-3 text-sm">
                      <p className="font-semibold mb-1">Couldn’t place the call.</p>
                      <p className="text-[var(--muted-foreground)]">{status.message}</p>
                    </div>
                  )}
                </div>
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

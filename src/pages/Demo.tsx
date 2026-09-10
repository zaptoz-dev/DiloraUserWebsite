import { useMemo, useState } from 'react';
import Badge from '../components/ui/Badge';
import { toE164 } from '../../shared/phone.js';

const INPUT_CLASS =
  'bg-[#090d17] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#245ae2] focus:ring-2 focus:ring-[#245ae2]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm';

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
    <div className="pt-28 pb-24 bg-[#080b11] text-slate-100 min-h-screen">
      {/* Hero Section */}
      <section className="py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#245ae2]/15 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10">
          <Badge className="mb-6">REAL-TIME PHONE TEST</Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 text-white leading-tight">
            Hear Dialora on your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60a5fa] via-[#245ae2] to-[#93c5fd]">own phone</span>.
          </h1>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Enter your mobile number and Dialora will dial you instantly—a live, autonomous AI call with sub-500ms conversational turn-taking.
          </p>
        </div>
      </section>

      {/* Demo Form & Info Split */}
      <section className="px-4 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Info Column */}
          <div className="lg:col-span-5 bg-[#0d121f] border border-white/10 rounded-3xl p-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#245ae2]/10 border border-[#245ae2]/30 text-xs font-semibold text-[#93c5fd]">
              <span className="w-2 h-2 rounded-full bg-[#d6f549] animate-pulse" />
              Live Carrier Callback
            </div>

            <h3 className="text-2xl font-bold text-white tracking-tight">
              What happens next:
            </h3>

            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#245ae2]/20 border border-[#245ae2]/40 text-[#60a5fa] flex items-center justify-center font-mono text-xs font-bold shrink-0">1</span>
                <span>You will receive an incoming phone call within 10 to 30 seconds.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#245ae2]/20 border border-[#245ae2]/40 text-[#60a5fa] flex items-center justify-center font-mono text-xs font-bold shrink-0">2</span>
                <span>Answer naturally. Try interrupting mid-sentence or switching between Hindi &amp; English.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#245ae2]/20 border border-[#245ae2]/40 text-[#60a5fa] flex items-center justify-center font-mono text-xs font-bold shrink-0">3</span>
                <span>Experience sub-500ms latency with zero IVR keypad menus or robotic pauses.</span>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 text-xs text-slate-500 space-y-2 font-mono">
              <div>• Powered by Carrier SIP Trunks</div>
              <div>• TRAI compliant (9 AM - 9 PM IST)</div>
              <div>• Zero sales reps or credit cards required</div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7 bg-[#0d121f] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
            <form className="flex flex-col gap-5 relative z-10" onSubmit={submit}>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-slate-400">Full Name *</label>
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
                  <label htmlFor="company" className="text-xs font-semibold uppercase tracking-wider text-slate-400">Company Name</label>
                  <input
                    type="text"
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    disabled={busy}
                    placeholder="Acme Growth Inc."
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="mobile" className="text-xs font-semibold uppercase tracking-wider text-slate-400">Mobile Number *</label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    disabled={busy}
                    aria-label="Country code"
                    className={`${INPUT_CLASS} max-w-[100px] cursor-pointer`}
                  >
                    {COUNTRY_CODES.map((code) => (
                      <option key={code} value={code} className="bg-[#0d121f] text-white">{code}</option>
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
                <p className="text-xs text-slate-500 min-h-[1rem]">
                  {phone.trim() === ''
                    ? 'Dialora will call this number in the next few seconds.'
                    : normalized
                      ? `Will dial ${normalized}`
                      : 'That number doesn’t look complete yet.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-400">Work Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={busy}
                    placeholder="aarav@company.com"
                    className={INPUT_CLASS}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="intent" className="text-xs font-semibold uppercase tracking-wider text-slate-400">Call Workflow</label>
                  <select
                    id="intent"
                    value={intent}
                    onChange={(e) => setIntent(e.target.value)}
                    disabled={busy}
                    className={`${INPUT_CLASS} cursor-pointer`}
                  >
                    <option value="sales" className="bg-[#0d121f] text-white">Sales &amp; Lead Qualification</option>
                    <option value="support" className="bg-[#0d121f] text-white">Customer Support FAQ</option>
                    <option value="booking" className="bg-[#0d121f] text-white">Appointment &amp; Visit Booking</option>
                    <option value="collections" className="bg-[#0d121f] text-white">Debt Recovery &amp; Reminders</option>
                    <option value="other" className="bg-[#0d121f] text-white">Custom Workflow</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="notes" className="text-xs font-semibold uppercase tracking-wider text-slate-400">Notes / Instructions <span className="text-slate-500 font-normal">(Optional)</span></label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={busy}
                  placeholder="Tell us what you want to test (e.g., test in Hindi, ask tricky questions)..."
                  rows={3}
                  className={`${INPUT_CLASS} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className="bg-[#245ae2] hover:bg-[#1d4ed8] text-white w-full py-4 rounded-xl text-base font-semibold mt-3 transition-all shadow-[0_0_25px_rgba(36,90,226,0.4)] hover:shadow-[0_0_35px_rgba(36,90,226,0.6)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {busy && (
                  <span
                    aria-hidden
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                  />
                )}
                {busy ? 'Connecting to Telecom Trunk…' : 'Trigger Live Demo Call'}
              </button>

              <div aria-live="polite">
                {status.kind === 'placed' && (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                    <p className="font-semibold mb-1">Calling you now!</p>
                    <p className="text-emerald-400/80 text-xs">{status.message}</p>
                  </div>
                )}
                {status.kind === 'rescheduled' && (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
                    <p className="font-semibold mb-1">Call queued for compliant hours.</p>
                    <p className="text-amber-400/80 text-xs">{status.message}</p>
                  </div>
                )}
                {status.kind === 'error' && (
                  <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                    <p className="font-semibold mb-1">Could not place call.</p>
                    <p className="text-rose-400/80 text-xs">{status.message}</p>
                  </div>
                )}
              </div>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}

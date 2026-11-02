import type { ReactNode } from 'react';
import Badge from '../ui/Badge';

interface LegalPageProps {
  title: string;
  /** Shown as "Last updated: ...". Change it whenever the page's content changes. */
  lastUpdated: string;
  children: ReactNode;
}

// Prose styles for the page body. The project has no typography plugin, so the
// plain h2 / p / ul / a elements inside are styled from the wrapper.
const PROSE = [
  'text-[15px] leading-relaxed text-slate-300',
  '[&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white',
  '[&_p]:mb-4',
  '[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 marker:text-slate-500',
  '[&_a]:font-medium [&_a]:text-[#60a5fa] [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-white',
  '[&_strong]:font-semibold [&_strong]:text-slate-100',
].join(' ');

/** Shared layout for the Privacy, Terms and DPA pages. */
export default function LegalPage({ title, lastUpdated, children }: LegalPageProps) {
  return (
    <div className="pt-28 pb-24 bg-[#080b11] text-slate-100 min-h-screen">
      <article className="max-w-3xl mx-auto px-4 py-12">
        <header className="mb-10 pb-8 border-b border-white/10">
          <Badge className="mb-6">LEGAL</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">{title}</h1>
          <p className="mt-4 text-sm text-slate-500">Last updated: {lastUpdated}</p>
        </header>
        <div className={PROSE}>{children}</div>
      </article>
    </div>
  );
}

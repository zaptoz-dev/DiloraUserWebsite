import { Link } from 'react-router-dom';
import Badge from './ui/Badge';

export default function TryItLiveCTA() {
  return (
    <section className="py-24 px-4 border-t border-[var(--border)]">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        <Badge className="mb-8">TRY IT LIVE</Badge>
        <h2 className="text-4xl md:text-5xl font-semibold mb-6">
          Let Dialora call you.
        </h2>
        <p className="text-xl text-[var(--muted-foreground)] mb-10 max-w-2xl">
          Hear the voice, pace and language switching on your own phone.
        </p>
        <Link to="/demo" className="bg-signature px-6 py-3 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity">
          Get a demo call
        </Link>
      </div>
    </section>
  );
}

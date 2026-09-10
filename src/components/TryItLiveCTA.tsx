import { Link } from 'react-router-dom';
import Badge from './ui/Badge';

export default function TryItLiveCTA() {
  return (
    <section className="py-24 px-4 border-t border-white/10 bg-[#0b0f19]">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        <Badge className="mb-8">TRY IT LIVE</Badge>
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
          Let Dialora call you.
        </h2>
        <p className="text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed">
          Hear the voice, natural pace and real-time language switching on your own phone.
        </p>
        <Link 
          to="/demo" 
          className="bg-[#245ae2] hover:bg-[#1d4ed8] px-8 py-4 rounded-full font-semibold text-lg text-white transition-all shadow-[0_0_30px_rgba(36,90,226,0.4)] hover:scale-105"
        >
          Get a demo call
        </Link>
      </div>
    </section>
  );
}

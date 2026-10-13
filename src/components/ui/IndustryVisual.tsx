import type { LucideIcon } from 'lucide-react';

/**
 * Animated header graphic for an industry card, in place of a stock photo.
 *
 * Built from the site's own motifs rather than imagery: a glowing call orb in
 * the middle, sound ripples spreading from it, voice waveforms on either side
 * (the caller speaking in, the agent speaking out), and three small task chips
 * orbiting the orb for the jobs the agent does in that industry.
 *
 * Pure CSS animation, so there is nothing to load, and every moving part is
 * marked `iv-anim` so it stops for visitors who prefer reduced motion (see
 * index.css). Decorative only, hidden from screen readers; the card's title and
 * text carry the meaning.
 */

interface Props {
  icon: LucideIcon;
  /** Three task icons that orbit the orb. */
  tasks: [LucideIcon, LucideIcon, LucideIcon];
  /** Accent colour for this industry, as a hex value. */
  accent: string;
}

// Fixed heights and delays rather than random ones, so the waveform looks
// organic but renders identically on every load (and on the server build).
const BARS = [0.35, 0.6, 0.9, 0.55, 1, 0.7, 0.45, 0.8, 0.5];
const ORBIT_RADIUS = 78;

export default function IndustryVisual({ icon: Icon, tasks, accent }: Props) {
  return (
    <div
      aria-hidden="true"
      className="relative h-56 w-full overflow-hidden"
      style={{
        background: `radial-gradient(ellipse 60% 70% at 50% 50%, ${accent}22 0%, rgba(36,90,226,0.14) 35%, #0d121f 75%)`,
      }}
    >
      {/* Faint grid, faded out towards the edges */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 30%, transparent 80%)',
        }}
      />

      {/* Sound ripples spreading from the orb */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {[0, 1.3, 2.6].map((delay) => (
          <span
            key={delay}
            // Centred with `transform` rather than Tailwind's translate classes:
            // the ripple keyframes animate `transform`, and Tailwind v4 uses the
            // separate `translate` property, so mixing them would offset twice.
            className="iv-anim iv-ripple absolute left-1/2 top-1/2 h-24 w-24 rounded-full border"
            style={{ borderColor: `${accent}55`, animationDelay: `${delay}s`, transform: 'translate(-50%, -50%)' }}
          />
        ))}
      </div>

      {/* Voice in (left) and voice out (right) */}
      {[
        { side: 'left-[8%] sm:left-[12%]', color: 'rgba(148,163,184,0.55)', offset: 0 },
        { side: 'right-[8%] sm:right-[12%]', color: accent, offset: 0.35 },
      ].map(({ side, color, offset }) => (
        <div key={side} className={`absolute top-1/2 -translate-y-1/2 ${side} hidden h-14 items-center gap-[3px] sm:flex`}>
          {BARS.map((height, i) => (
            <span
              key={i}
              className="iv-anim iv-bar w-[3px] rounded-full"
              style={{
                height: `${height * 100}%`,
                backgroundColor: color,
                animationDelay: `${offset + i * 0.11}s`,
              }}
            />
          ))}
        </div>
      ))}

      {/* Orbit ring with task chips */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10"
        style={{ width: ORBIT_RADIUS * 2, height: ORBIT_RADIUS * 2 }}
      >
        <div className="iv-anim iv-orbit absolute inset-0">
          {tasks.map((Task, i) => {
            const angle = -90 + i * 120;
            return (
              <div
                key={i}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translate(${ORBIT_RADIUS}px) rotate(${-angle}deg)`,
                }}
              >
                <div className="iv-anim iv-orbit-reverse flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#0f1422]/90 shadow-lg backdrop-blur">
                  <Task className="h-4 w-4" style={{ color: accent }} strokeWidth={2} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Central call orb */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className="iv-anim iv-glow absolute -inset-4 rounded-full blur-xl"
          style={{ backgroundColor: `${accent}40` }}
        />
        <div
          className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/20 shadow-[0_0_30px_rgba(36,90,226,0.45)]"
          style={{ background: `linear-gradient(135deg, #245ae2 0%, ${accent} 140%)` }}
        >
          <Icon className="h-7 w-7 text-white" strokeWidth={1.8} />
        </div>
      </div>

      {/* Fade into the card body below */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0d121f] to-transparent" />
    </div>
  );
}

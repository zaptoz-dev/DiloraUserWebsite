import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

const TOTAL_FRAMES = 251;

// Narrative phases that highlight as user scrolls through the 251 frames
const PHASES = [
  {
    range: [0, 65],
    title: 'Natural Call Intake',
    caption: 'Answers instantly on Ring #1 with human-like pace, inflection, and tone.',
    tag: 'Incoming Call'
  },
  {
    range: [66, 140],
    title: 'Autonomous Resolution',
    caption: 'Extracts caller intent, resolves queries, and books appointments into CRM.',
    tag: 'Action Execution'
  },
  {
    range: [141, 205],
    title: 'Infinite Concurrency',
    caption: 'Scale from 1 to 5,000 parallel calls with zero customer queue hold time.',
    tag: 'Massive Scale'
  },
  {
    range: [206, 251],
    title: 'Enterprise Audeora',
    caption: 'Turn-key AI voice infrastructure engineered for modern enterprise operations.',
    tag: 'Let AI Handle Calls'
  }
];

export default function HeroScrollAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [scrollProgress, setScrollProgress] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Cached images
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const targetFrameRef = useRef(1);
  const currentFrameRef = useRef(1);
  const animationFrameId = useRef<number | null>(null);

  const baseUrl = import.meta.env.BASE_URL || '/';

  const getFrameUrl = useCallback((index: number) => {
    const padNum = String(index).padStart(3, '0');
    return `${baseUrl}hero-frames/frame_${padNum}.jpg`;
  }, [baseUrl]);

  // Preload frames progressively
  useEffect(() => {
    let isCancelled = false;
    const images: HTMLImageElement[] = [];

    // Step 1: Load the first frame immediately for instant display
    const firstImg = new Image();
    firstImg.src = getFrameUrl(1);
    firstImg.onload = () => {
      if (!isCancelled) {
        images[1] = firstImg;
        setLoadedCount(prev => prev + 1);
        drawFrame(1);
      }
    };

    // Step 2: Load keyframes first (every 5th frame) for instant scrubbing feedback
    const keyframeIndices: number[] = [];
    for (let i = 2; i <= TOTAL_FRAMES; i += 5) {
      keyframeIndices.push(i);
    }

    const remainingIndices: number[] = [];
    for (let i = 2; i <= TOTAL_FRAMES; i++) {
      if (!keyframeIndices.includes(i)) {
        remainingIndices.push(i);
      }
    }

    const loadBatch = (indices: number[], onFinish?: () => void) => {
      let loadedInBatch = 0;
      indices.forEach((frameIdx) => {
        const img = new Image();
        img.src = getFrameUrl(frameIdx);
        img.onload = () => {
          if (!isCancelled) {
            images[frameIdx] = img;
            setLoadedCount(prev => prev + 1);
            loadedInBatch++;
            if (loadedInBatch === indices.length && onFinish) {
              onFinish();
            }
          }
        };
        img.onerror = () => {
          loadedInBatch++;
          if (loadedInBatch === indices.length && onFinish) {
            onFinish();
          }
        };
      });
    };

    // Load keyframes first, then load the rest
    loadBatch(keyframeIndices, () => {
      if (!isCancelled) {
        loadBatch(remainingIndices);
      }
    });

    imagesRef.current = images;

    return () => {
      isCancelled = true;
    };
  }, [getFrameUrl]);

  // Draw specific frame to canvas
  const drawFrame = useCallback((frameNumber: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Find requested frame, or closest available loaded frame
    let img = imagesRef.current[frameNumber];
    if (!img || !img.complete) {
      for (let offset = 1; offset <= 20; offset++) {
        const lower = imagesRef.current[frameNumber - offset];
        if (lower && lower.complete) {
          img = lower;
          break;
        }
        const higher = imagesRef.current[frameNumber + offset];
        if (higher && higher.complete) {
          img = higher;
          break;
        }
      }
    }

    if (!img || !img.complete) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#080b11';
    ctx.fillRect(0, 0, width, height);

    // Calculate aspect ratio fit (1920 / 1080 = 16:9)
    const imgRatio = (img.naturalWidth || 1920) / (img.naturalHeight || 1080);
    const canvasRatio = width / height;

    let renderW: number;
    let renderH: number;
    let offsetX: number;
    let offsetY: number;

    if (canvasRatio > imgRatio) {
      // Canvas is wider than image
      renderH = height;
      renderW = height * imgRatio;
      offsetX = (width - renderW) / 2;
      offsetY = 0;
    } else {
      // Canvas is taller than image
      renderW = width;
      renderH = width / imgRatio;
      offsetX = 0;
      offsetY = (height - renderH) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
  }, []);

  // Update canvas size on resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);

      drawFrame(Math.round(currentFrameRef.current));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawFrame]);

  // Smooth lerp loop for 60fps/120fps fluid transitions
  useEffect(() => {
    let isRunning = true;

    const tick = () => {
      if (!isRunning) return;

      const target = targetFrameRef.current;
      const current = currentFrameRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.05) {
        currentFrameRef.current += diff * 0.18;
        const rounded = Math.round(currentFrameRef.current);
        drawFrame(Math.max(1, Math.min(TOTAL_FRAMES, rounded)));
      }

      animationFrameId.current = requestAnimationFrame(tick);
    };

    animationFrameId.current = requestAnimationFrame(tick);

    return () => {
      isRunning = false;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [drawFrame]);

  // Scroll handler calculating progress through sticky container
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Section begins when top hits viewport top and ends when bottom leaves
      const totalScrollableDistance = rect.height - windowHeight;
      if (totalScrollableDistance <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollableDistance));

      setScrollProgress(progress);

      // Map progress [0, 1] to frames [1, 251]
      const frame = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(1 + progress * (TOTAL_FRAMES - 1))));
      targetFrameRef.current = frame;

      // Determine active narrative phase
      const phaseIdx = PHASES.findIndex(p => frame >= p.range[0] && frame <= p.range[1]);
      if (phaseIdx !== -1) {
        setActivePhaseIndex(phaseIdx);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Quick jump or manual scrub when clicking on the timeline track
  const handleScrubClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));

    const container = containerRef.current;
    if (container) {
      const totalScrollableDistance = container.offsetHeight - window.innerHeight;
      const targetScrollY = container.offsetTop + pct * totalScrollableDistance;
      window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth'
      });
    }
  };

  const currentPhase = PHASES[activePhaseIndex] || PHASES[0];

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[260vh]"
    >
      {/* Sticky Viewport Container */}
      <div className="sticky top-20 sm:top-24 h-[84vh] sm:h-[86vh] w-full flex flex-col items-center justify-center px-4 overflow-hidden">
        
        {/* Subtle Ambient Radial Glow Behind Device */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[380px] bg-[#245ae2]/15 blur-[140px] rounded-full pointer-events-none -z-10" />

        {/* Main Cinema Screen Frame */}
        <div 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`relative w-full max-w-6xl aspect-[16/10] sm:aspect-[16/9] max-h-[66vh] sm:max-h-[70vh] rounded-[2rem] sm:rounded-[2.5rem] bg-[#080b11] border transition-all duration-500 overflow-hidden flex items-center justify-center group ${
            isHovered
              ? 'border-[#245ae2]/60 shadow-[0_0_80px_rgba(36,90,226,0.3)]'
              : 'border-[#245ae2]/30 shadow-[0_0_60px_rgba(36,90,226,0.18)]'
          }`}
        >
          {/* HTML5 Smooth Canvas */}
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain select-none"
          />

          {/* Top Elegant Status Overlay */}
          <div className="absolute top-5 left-6 right-6 flex items-center justify-between pointer-events-none z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-white/15 backdrop-blur-md text-[11px] font-medium text-slate-300 shadow-md">
              <span className="w-2 h-2 rounded-full bg-[#d6f549] animate-pulse" />
              <span>Scroll to Explore 3D Architecture</span>
              {loadedCount < TOTAL_FRAMES && (
                <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
                  • {Math.round((loadedCount / TOTAL_FRAMES) * 100)}% loaded
                </span>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-white/15 backdrop-blur-md text-[11px] font-mono text-slate-300">
              <span className="text-[#60a5fa] font-bold">{currentPhase.tag}</span>
              <span className="text-slate-500">//</span>
              <span className="text-slate-400">FRAME {String(Math.round(currentFrameRef.current)).padStart(3, '0')} / 251</span>
            </div>
          </div>

          {/* Bottom Narrative Banner (Floating & Clean) */}
          <div className="absolute bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-8 z-10 pointer-events-none">
            <div className="bg-[#090d17]/85 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pointer-events-auto">
              
              {/* Active Narrative Text */}
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-[#60a5fa] uppercase tracking-wider">
                    0{activePhaseIndex + 1} — {currentPhase.title}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {currentPhase.caption}
                </p>
              </div>

              {/* Action Trigger */}
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  to="/demo"
                  className="bg-[#245ae2] hover:bg-[#1d4ed8] text-white px-5 py-2.5 rounded-full text-xs font-semibold transition-all shadow-md hover:scale-105 flex items-center gap-1.5"
                >
                  <span>Test On Phone</span>
                  <span>&rarr;</span>
                </Link>
                <Link
                  to="/voice-lab"
                  className="bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white px-4 py-2.5 rounded-full text-xs font-semibold border border-white/10 transition-colors hidden md:inline-flex"
                >
                  Listen Voices
                </Link>
              </div>
            </div>
          </div>

          {/* Interactive Scrub Progress Bar at the very bottom */}
          <div 
            onClick={handleScrubClick}
            title="Click to jump to scroll position"
            className="absolute bottom-0 inset-x-0 h-1.5 bg-white/5 hover:h-2 transition-all cursor-pointer z-20"
          >
            <div 
              className="h-full bg-gradient-to-r from-[#245ae2] via-[#60a5fa] to-[#d6f549] transition-all duration-75 shadow-[0_0_10px_rgba(96,165,250,0.8)]"
              style={{ width: `${Math.max(1, scrollProgress * 100)}%` }}
            />
          </div>
        </div>

        {/* 4 Clean Narrative Stage Indicators Beneath Canvas */}
        <div className="w-full max-w-6xl mt-4 px-2 hidden sm:grid grid-cols-4 gap-3 select-none">
          {PHASES.map((phase, idx) => {
            const isActive = activePhaseIndex === idx;
            return (
              <div
                key={idx}
                onClick={() => {
                  const container = containerRef.current;
                  if (container) {
                    const midFrame = (phase.range[0] + phase.range[1]) / 2;
                    const pct = (midFrame - 1) / (TOTAL_FRAMES - 1);
                    const totalScrollableDistance = container.offsetHeight - window.innerHeight;
                    const targetScrollY = container.offsetTop + pct * totalScrollableDistance;
                    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
                  }
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                  isActive
                    ? 'bg-[#141b2e] border-[#245ae2]/60 shadow-[0_0_20px_rgba(36,90,226,0.25)]'
                    : 'bg-[#0d121f]/60 border-white/5 hover:border-white/15 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-[#60a5fa]' : 'text-slate-500'}`}>
                    STEP 0{idx + 1}
                  </span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#d6f549] animate-pulse" />}
                </div>
                <div className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>
                  {phase.title}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

const TOTAL_FRAMES = 251;

export default function HeroScrollAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [scrollProgress, setScrollProgress] = useState(0);

  // Cached frames
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const targetFrameRef = useRef(1);
  const currentFrameRef = useRef(1);
  const animationFrameId = useRef<number | null>(null);

  const baseUrl = import.meta.env.BASE_URL || '/';

  const getFrameUrl = useCallback((index: number) => {
    const padNum = String(index).padStart(3, '0');
    return `${baseUrl}hero-frames/frame_${padNum}.jpg`;
  }, [baseUrl]);

  // Draw specific frame with TRUE full-screen COVER fit
  const drawFrame = useCallback((frameNumber: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Find requested frame, or closest available loaded frame
    let img = imagesRef.current[frameNumber];
    if (!img || !img.complete || img.naturalWidth === 0) {
      // Search backwards first to find the latest loaded frame
      for (let i = frameNumber; i >= 1; i--) {
        if (imagesRef.current[i] && imagesRef.current[i].complete && imagesRef.current[i].naturalWidth > 0) {
          img = imagesRef.current[i];
          break;
        }
      }
      // If not found backwards, search forwards
      if (!img || !img.complete || img.naturalWidth === 0) {
        for (let i = frameNumber + 1; i <= TOTAL_FRAMES; i++) {
          if (imagesRef.current[i] && imagesRef.current[i].complete && imagesRef.current[i].naturalWidth > 0) {
            img = imagesRef.current[i];
            break;
          }
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#080b11';
    ctx.fillRect(0, 0, width, height);

    // TRUE FULL-SCREEN COVER FIT:
    // Scale image so both width and height are completely filled, eliminating black bars/gaps
    const imgW = img.naturalWidth || 1920;
    const imgH = img.naturalHeight || 1080;
    const scale = Math.max(width / imgW, height / imgH);
    const renderW = imgW * scale;
    const renderH = imgH * scale;
    const offsetX = (width - renderW) / 2;
    const offsetY = (height - renderH) / 2;

    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
  }, []);

  // Preload frames aggressively with high concurrency
  useEffect(() => {
    let isCancelled = false;
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES + 1);

    const loadSingle = (index: number): Promise<HTMLImageElement | null> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = getFrameUrl(index);
        img.onload = () => {
          if (!isCancelled) {
            images[index] = img;
            resolve(img);
          } else {
            resolve(null);
          }
        };
        img.onerror = () => {
          resolve(null);
        };
      });
    };

    // Priority 1: Load frame 1 and frame 251 immediately
    Promise.all([loadSingle(1), loadSingle(TOTAL_FRAMES)]).then(([firstImg]) => {
      if (!isCancelled && firstImg) {
        drawFrame(1);
      }
    });

    // Priority 2: Keyframes first (every 2nd frame) for instant scrubbing feedback
    const keyframes: number[] = [];
    for (let i = 2; i < TOTAL_FRAMES; i += 2) {
      keyframes.push(i);
    }
    // Priority 3: Remaining in-between odd frames
    for (let i = 3; i < TOTAL_FRAMES; i += 2) {
      keyframes.push(i);
    }

    // Launch with 12 concurrent workers
    let queueIdx = 0;
    const worker = async () => {
      while (queueIdx < keyframes.length && !isCancelled) {
        const frameIdx = keyframes[queueIdx++];
        await loadSingle(frameIdx);
      }
    };

    const CONCURRENCY = 12;
    for (let c = 0; c < CONCURRENCY; c++) {
      worker();
    }

    imagesRef.current = images;

    return () => {
      isCancelled = true;
    };
  }, [getFrameUrl, drawFrame]);

  // Update canvas pixel buffer on resize
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

  // Smooth fluid lerp loop
  useEffect(() => {
    let isRunning = true;

    const tick = () => {
      if (!isRunning) return;

      const target = targetFrameRef.current;
      const current = currentFrameRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.05) {
        // Snappy responsive lerp tracking
        currentFrameRef.current += diff * 0.28;
        
        // Snap to bounds when very close
        if (target === TOTAL_FRAMES && Math.abs(diff) < 0.8) {
          currentFrameRef.current = TOTAL_FRAMES;
        } else if (target === 1 && Math.abs(diff) < 0.8) {
          currentFrameRef.current = 1;
        }

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

      const totalScrollableDistance = rect.height - windowHeight;
      if (totalScrollableDistance <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollableDistance));

      setScrollProgress(progress);

      // Complete all 251 frames comfortably by 82% scroll!
      // Leaves 82%-100% as a hold/transition buffer so the user fully sees the completed animation
      const animProgress = Math.min(1, Math.max(0, progress / 0.82));
      const frame = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(1 + animProgress * (TOTAL_FRAMES - 1))));
      targetFrameRef.current = frame;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute text fade and motion based on scroll progress
  // Fades out between 0% and 24% scroll progress so user enjoys 3D animation unobscured
  const textOpacity = Math.max(0, 1 - scrollProgress * 4.2);
  const textTranslateY = -scrollProgress * 80;
  const textScale = Math.max(0.92, 1 - scrollProgress * 0.15);
  const isInteractive = textOpacity > 0.15;

  // Cinematic smooth dissolve into the next section as user scrolls past 88%
  const exitOverlayOpacity = Math.min(1, Math.max(0, (scrollProgress - 0.88) / 0.12));

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[360vh]"
    >
      {/* Sticky Viewport Container - True 100vw x 100vh Full Screen */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center pt-20 sm:pt-24 pb-10 px-4 overflow-hidden">
        
        {/* Ambient Radial Glow Behind Canvas */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] sm:w-[1300px] h-[600px] bg-[#245ae2]/15 blur-[160px] rounded-full pointer-events-none -z-10" />

        {/* 100% FULL SCREEN Canvas Background Layer */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <canvas
            ref={canvasRef}
            className="w-full h-full block select-none"
          />

          {/* Minimal top gradient for navbar legibility only (no side or heavy bottom cutoffs) */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#080b11]/90 via-[#080b11]/40 to-transparent pointer-events-none" />

          {/* Soft central contrast backdrop that fades out smoothly as caller scrolls */}
          <div 
            className="absolute inset-0 transition-opacity duration-200 pointer-events-none"
            style={{ 
              background: 'radial-gradient(circle at 50% 50%, rgba(8, 11, 17, 0.55) 0%, rgba(8, 11, 17, 0.2) 65%, transparent 100%)',
              opacity: textOpacity 
            }}
          />

          {/* Smooth cinematic transition fade to the next section after hero ends */}
          <div 
            className="absolute inset-0 bg-[#080b11] transition-opacity duration-100 pointer-events-none"
            style={{ opacity: exitOverlayOpacity * 0.85 }}
          />
        </div>

        {/* Hero Foreground Content Layer */}
        <div 
          className={`relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center transition-all duration-150 ${
            isInteractive ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
          style={{
            opacity: textOpacity,
            transform: `translateY(${textTranslateY}px) scale(${textScale})`
          }}
        >
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#080b11]/85 border border-[#245ae2]/40 backdrop-blur-md mb-6 sm:mb-8 shadow-[0_0_30px_rgba(36,90,226,0.3)]">
            <span className="w-2 h-2 rounded-full bg-[#d6f549] animate-pulse" />
            <span className="text-xs font-semibold text-[#93c5fd] tracking-wide uppercase">
              Enterprise AI Voice Platform
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-[76px] font-bold leading-[1.08] mb-6 sm:mb-8 text-white tracking-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
            Calls that sound <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60a5fa] via-[#245ae2] to-[#93c5fd]">human</span>.<br />
            Outcomes that <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">scale</span>.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-300 mb-8 sm:mb-10 max-w-2xl leading-relaxed drop-shadow-[0_2px_16px_rgba(0,0,0,0.95)]">
            Audeora answers, qualifies, schedules, and resolves calls in 10+ Indian and global languages—with the natural pace and tone of your best tele-caller.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link 
              to="/demo" 
              className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#245ae2] hover:bg-[#1d4ed8] px-8 py-4 rounded-full text-[15px] font-semibold text-white transition-all duration-300 shadow-[0_0_35px_rgba(36,90,226,0.5)] hover:shadow-[0_0_55px_rgba(36,90,226,0.75)] hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Get a demo call
            </Link>
            
            <Link 
              to="/voice-lab" 
              className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#080b11]/85 backdrop-blur-md border border-white/20 hover:border-white/40 px-8 py-4 rounded-full text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
            >
              Explore Voice Lab
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          {/* Clean Minimal Scroll Cue */}
          <div className="mt-12 sm:mt-14 flex flex-col items-center gap-2 text-slate-400/80 text-xs font-medium animate-bounce">
            <span className="tracking-wider uppercase text-[11px] text-slate-400 font-mono">Scroll to explore</span>
            <svg className="w-4 h-4 text-[#60a5fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
}

import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

const TOTAL_FRAMES = 251;

export default function HeroScrollAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [scrollProgress, setScrollProgress] = useState(0);

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
        drawFrame(1);
      }
    };

    // Step 2: Load keyframes first (every 4th frame) for instant scrubbing feedback
    const keyframeIndices: number[] = [];
    for (let i = 2; i <= TOTAL_FRAMES; i += 4) {
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

    // Load keyframes first, then remaining
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
      for (let offset = 1; offset <= 30; offset++) {
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

    // Calculate aspect ratio fit
    const imgRatio = (img.naturalWidth || 1920) / (img.naturalHeight || 1080);
    const canvasRatio = width / height;

    let renderW: number;
    let renderH: number;
    let offsetX: number;
    let offsetY: number;

    if (canvasRatio > imgRatio) {
      // Screen is wider than 16:9
      renderH = height;
      renderW = height * imgRatio;
      offsetX = (width - renderW) / 2;
      offsetY = 0;
    } else {
      // Screen is narrower/taller (mobile/tablet portrait)
      // Scale slightly so device visual remains prominent
      const scale = Math.min(1.35, Math.max(1.0, (height / (width / imgRatio)) * 0.8));
      renderW = width * scale;
      renderH = (width / imgRatio) * scale;
      offsetX = (width - renderW) / 2;
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

  // Smooth lerp loop for fluid 60fps / 120fps transitions
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

      const totalScrollableDistance = rect.height - windowHeight;
      if (totalScrollableDistance <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollableDistance));

      setScrollProgress(progress);

      // Map progress [0, 1] to frames [1, 251]
      const frame = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(1 + progress * (TOTAL_FRAMES - 1))));
      targetFrameRef.current = frame;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute text fade and motion based on scroll progress
  // Fades out between 0% and 32% scroll progress so caller enjoys the 3D animation unobscured
  const textOpacity = Math.max(0, 1 - scrollProgress * 3.4);
  const textTranslateY = -scrollProgress * 70;
  const textScale = Math.max(0.92, 1 - scrollProgress * 0.15);
  const isInteractive = textOpacity > 0.15;

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[250vh]"
    >
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center pt-20 sm:pt-24 pb-10 px-4 overflow-hidden">
        
        {/* Ambient Radial Glow Behind Canvas */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] sm:w-[1200px] h-[550px] bg-[#245ae2]/15 blur-[160px] rounded-full pointer-events-none -z-10" />

        {/* 3D Canvas Background Layer */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-0">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover select-none"
          />

          {/* Seamless Edge Gradient Vignettes to blend canvas 100% invisibly into #080b11 */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#080b11] via-[#080b11]/80 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#080b11] via-[#080b11]/80 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[#080b11] via-[#080b11]/60 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-[#080b11] via-[#080b11]/60 to-transparent pointer-events-none" />

          {/* Soft readability backdrop tint that fades away as user scrolls */}
          <div 
            className="absolute inset-0 bg-[#080b11]/45 transition-opacity duration-200 pointer-events-none"
            style={{ opacity: textOpacity }}
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#080b11]/80 border border-[#245ae2]/40 backdrop-blur-md mb-6 sm:mb-8 shadow-[0_0_25px_rgba(36,90,226,0.3)]">
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
              className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#080b11]/80 backdrop-blur-md border border-white/20 hover:border-white/40 px-8 py-4 rounded-full text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
            >
              Explore Voice Lab
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          {/* Clean Scroll Cue */}
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

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Plus,
  X,
  Crosshair,
  SlidersHorizontal,
  Flame,
  Aperture,
  Cpu,
  BatteryCharging,
} from "lucide-react";

interface MasterImages {
  beat1: HTMLImageElement;
  beat2: HTMLImageElement;
  beat3: HTMLImageElement;
  beat4: HTMLImageElement;
}

export interface HotspotSpec {
  id: "optics" | "sensor" | "power";
  label: string;
  tag: string;
  name: string;
  relX: number;
  relY: number;
  specs: string[];
  description: string;
  tooltipSide: "left" | "top" | "right";
  icon: "aperture" | "cpu" | "battery";
}

const SPEC_HOTSPOTS: HotspotSpec[] = [
  {
    id: "optics",
    label: "OPTICS",
    tag: "01 // ANAMORPHIC GLASS",
    name: "Cooke S4/i 35mm T2.0 • PL Mount",
    relX: 0.32,
    relY: 0.58,
    specs: ["T2.0 - T22 Iris", "/i Metadata Protocol", "±0.005mm Collimation", "110mm Front"],
    description: "Factory-collimated anamorphic prime with organic cinema roll-off, matched focal geometry, and laser-centered optics.",
    tooltipSide: "left",
    icon: "aperture",
  },
  {
    id: "sensor",
    label: "SENSOR CORE",
    tag: "02 // 8K SENSOR DIE",
    name: "Full-Frame 8K VV • 16.5 Stops DR",
    relX: 0.54,
    relY: 0.53,
    specs: ["Exmor R BSI CMOS", "Dual ISO 800 / 12,800", "16-Bit Linear RAW", "Active Vapor Chamber"],
    description: "Back-illuminated full-frame sensor die with zero thermal throttling and sub-millimeter titanium flange lock.",
    tooltipSide: "top",
    icon: "cpu",
  },
  {
    id: "power",
    label: "POWER / I/O",
    tag: "03 // DUAL BUS POWER",
    name: "Dual V-Lock Hot-Swap • 12G-SDI RAW Out",
    relX: 0.70,
    relY: 0.52,
    specs: ["Continuous 14.8V", "12G-SDI 4K 120p", "SMPTE Timecode", "Lemo 2-Pin Aux"],
    description: "Uninterrupted soundstage power switching with dual high-bandwidth uncompressed RAW monitoring pipelines.",
    tooltipSide: "right",
    icon: "battery",
  },
];

export function AppleScrollyCanvas({
  onRentClick,
}: {
  onRentClick?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [imagesReady, setImagesReady] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // ARRI / RED Viewfinder OS State
  const [activeMode, setActiveMode] = useState<"assembled" | "exploded" | "optics">("assembled");
  const [activeHotspot, setActiveHotspot] = useState<"optics" | "sensor" | "power" | null>(null);
  const [timecode, setTimecode] = useState("01:24:18:14");
  const [fps, setFps] = useState(120);
  const [viewportSize, setViewportSize] = useState({ w: 1200, h: 800 });

  // Preloaded master cinema storytelling images
  const masterImagesRef = useRef<MasterImages | null>(null);

  // Track inertial lerp progress for silky smooth 60fps scrubbing
  const currentProgressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const mouseLerpRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const animFrameIdRef = useRef(0);
  const lastFpsTimeRef = useRef(performance.now());
  const framesCountRef = useRef(0);

  // Preload the 4 High-Resolution Cinema Storytelling Master Images
  useEffect(() => {
    let isCancelled = false;

    const img1 = new Image();
    img1.src = "/frames/beat_1_hero.jpg";

    const img2 = new Image();
    img2.src = "/frames/beat_2_sensor.jpg";

    const img3 = new Image();
    img3.src = "/frames/beat_3_optics.jpg";

    const img4 = new Image();
    img4.src = "/frames/beat_4_sealed.jpg";

    masterImagesRef.current = {
      beat1: img1,
      beat2: img2,
      beat3: img3,
      beat4: img4,
    };

    let loaded = 0;
    const checkAll = () => {
      loaded++;
      if (!isCancelled) {
        setImagesReady(true);
      }
    };

    img1.onload = checkAll;
    img2.onload = checkAll;
    img3.onload = checkAll;
    img4.onload = checkAll;

    if (img1.complete) checkAll();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Window scroll listener to calculate normalized [0, 1] scrollytelling progress
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const totalScrollable = container.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
      targetProgressRef.current = progress;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mouse tilt tracking for subtle 3D parallax
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseLerpRef.current.tx = x;
    mouseLerpRef.current.ty = y;
    setMousePos({ x, y });
  }, []);

  // 24fps live cinema timecode counter
  useEffect(() => {
    let frame = 14;
    let sec = 18;
    let min = 24;
    let hour = 1;

    const interval = setInterval(() => {
      frame++;
      if (frame >= 24) {
        frame = 0;
        sec++;
        if (sec >= 60) {
          sec = 0;
          min++;
          if (min >= 60) {
            min = 0;
            hour++;
          }
        }
      }
      const pad = (n: number) => n.toString().padStart(2, "0");
      setTimecode(`${pad(hour)}:${pad(min)}:${pad(sec)}:${pad(frame)}`);
    }, 1000 / 24);

    return () => clearInterval(interval);
  }, []);

  // Track viewport size for hotspot coordinate projection
  useEffect(() => {
    const handleResize = () => {
      setViewportSize({ w: window.innerWidth, h: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Synchronize activeMode with scroll position
  useEffect(() => {
    if (scrollProgress < 0.22) {
      setActiveMode("assembled");
    } else if (scrollProgress >= 0.22 && scrollProgress < 0.52) {
      setActiveMode("exploded");
    } else if (scrollProgress >= 0.52 && scrollProgress < 0.78) {
      setActiveMode("optics");
    }
  }, [scrollProgress]);

  // Mode button click handler
  const handleSelectMode = useCallback((mode: "assembled" | "exploded" | "optics") => {
    setActiveMode(mode);
    let targetP = 0;
    if (mode === "exploded") targetP = 0.35;
    if (mode === "optics") targetP = 0.65;

    targetProgressRef.current = targetP;
    setScrollProgress(targetP);

    const container = containerRef.current;
    if (container) {
      const totalScrollable = container.offsetHeight - window.innerHeight;
      const targetScroll = container.offsetTop + targetP * totalScrollable;
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    }
  }, []);

  // Mobile follow-focus slider handler
  const handleSliderChange = useCallback((val: number) => {
    targetProgressRef.current = val;
    setScrollProgress(val);
    const container = containerRef.current;
    if (container) {
      const totalScrollable = container.offsetHeight - window.innerHeight;
      const targetScroll = container.offsetTop + val * totalScrollable;
      window.scrollTo({ top: targetScroll, behavior: "auto" });
    }
  }, []);

  // Exact camera bounding box calculation matching canvas renderKinematicCameraFlow
  const cameraStage = useMemo(() => {
    const { w: width, h: height } = viewportSize;
    const isPortrait = height > width;
    const isMobile = width < 640;
    const isTabletPortrait = isPortrait && width < 1024;
    const imgAspect = 1376 / 768;

    const textBottomSafe = isMobile ? 210 : isTabletPortrait ? 250 : 285;
    const bottomPromptSafe = height - (isMobile ? 55 : 70);
    const availStageH = Math.max(180, bottomPromptSafe - textBottomSafe);

    const fitScale = Math.min(
      1,
      Math.min(
        (width * (isMobile ? 0.92 : 0.86)) / width,
        (availStageH * (isMobile ? 0.95 : isTabletPortrait ? 0.88 : 0.90)) / (width / imgAspect),
        (height * (isMobile ? 0.44 : isTabletPortrait ? 0.48 : 0.54)) / (width / imgAspect)
      )
    );
    const finalW = width * fitScale;
    const finalH = finalW / imgAspect;
    const origX = (width - finalW) / 2;
    const heroStageY = textBottomSafe + (availStageH - finalH) / 2 + (isMobile ? 12 : 18);
    return { x: origX, y: heroStageY, w: finalW, h: finalH };
  }, [viewportSize]);

  // Main Canvas Render Loop (Apple-style Alpha Cross-Fade + Parallax + Procedural Fallback)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;

    const render = () => {
      time += 0.015;

      // Live cinema telemetry FPS measurement
      framesCountRef.current++;
      const now = performance.now();
      if (now - lastFpsTimeRef.current >= 500) {
        const measured = Math.round((framesCountRef.current * 1000) / (now - lastFpsTimeRef.current));
        setFps(Math.min(120, Math.max(30, measured)));
        framesCountRef.current = 0;
        lastFpsTimeRef.current = now;
      }

      // Lerp progress for ultra-buttery Apple momentum
      currentProgressRef.current +=
        (targetProgressRef.current - currentProgressRef.current) * 0.12;
      mouseLerpRef.current.x +=
        (mouseLerpRef.current.tx - mouseLerpRef.current.x) * 0.08;
      mouseLerpRef.current.y +=
        (mouseLerpRef.current.ty - mouseLerpRef.current.y) * 0.08;

      const p = currentProgressRef.current;
      const mx = mouseLerpRef.current.x;
      const my = mouseLerpRef.current.y;

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Pitch black void (#050505) seamlessly matching background
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);

      // Soft radial cinema illumination glow centered behind the camera
      const glowGrad = ctx.createRadialGradient(
        width / 2,
        height / 2 + 50,
        40,
        width / 2,
        height / 2 + 50,
        Math.min(width, height) * 0.6
      );
      glowGrad.addColorStop(0, "rgba(239, 68, 68, 0.12)");
      glowGrad.addColorStop(0.4, "rgba(255, 255, 255, 0.025)");
      glowGrad.addColorStop(1, "rgba(5, 5, 5, 0)");
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      const masters = masterImagesRef.current;
      const heroReady =
        masters &&
        masters.beat1.complete &&
        masters.beat1.naturalWidth > 0;

      try {
        if (heroReady && masters) {
          // CONTINUOUS KINEMATIC CAMERA FLOW ENGINE
          renderKinematicCameraFlow(
            ctx,
            masters,
            width,
            height,
            p,
            mx,
            my,
            time
          );
        } else {
          // Sleek cinema stage loading state with subtle pulsing tally light
          ctx.save();
          const cx = width / 2;
          const cy = height * 0.38;
          // Soft radial glow
          const loadGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 140);
          loadGrad.addColorStop(0, "rgba(225, 29, 72, 0.2)");
          loadGrad.addColorStop(1, "rgba(5, 5, 5, 0)");
          ctx.fillStyle = loadGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, 140, 0, Math.PI * 2);
          ctx.fill();

          // Camera mount titanium ring outline
          ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(cx, cy, 54, 0, Math.PI * 2);
          ctx.stroke();

          // Pulsing red tally indicator
          const pulse = 0.4 + Math.sin(time * 5) * 0.4;
          ctx.fillStyle = `rgba(239, 68, 68, ${pulse})`;
          ctx.beginPath();
          ctx.arc(cx, cy - 24, 2.5, 0, Math.PI * 2);
          ctx.fill();

          // Minimalist telemetry label
          ctx.font = "600 9px monospace";
          ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
          ctx.textAlign = "center";
          ctx.fillText("CALIBRATING 8K SENSOR BENCH...", cx, cy + 16);
          ctx.restore();
        }
      } catch (err) {
        console.warn("[renderKinematicCameraFlow] Render recovered:", err);
      }

      ctx.restore();
      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrameIdRef.current);
  }, []);

  return (
    <div
      id="scrollytech"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-[350vh] bg-[#050505] select-none touch-pan-y"
    >
      {/* Sticky Fullscreen Canvas Viewport with 100dvh for iOS Safari stability */}
      <div className="sticky top-0 h-screen h-[100dvh] w-full overflow-hidden relative flex flex-col justify-between">
        {/* 1. ATMOSPHERIC AMBIENT CANVAS LAYERS */}
        {/* Subtle SVG procedural film-grain overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-[0.035] mix-blend-screen"
          aria-hidden="true"
        >
          <svg className="h-full w-full">
            <filter id="hero-film-grain">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.8"
                numOctaves="3"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#hero-film-grain)" />
          </svg>
        </div>

        {/* Dynamic Dual Radial Spotlights behind camera */}
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_55%,rgba(220,38,38,0.18),rgba(9,9,11,0)_70%)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_48%,rgba(255,255,255,0.03),transparent_60%)]"
          aria-hidden="true"
        />

        {/* Ultra-faint perspective technical grid with radial fade mask */}
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_50%,black_35%,transparent_90%)] opacity-80"
          aria-hidden="true"
        />

        {/* 2. MAIN HTML5 SCROLLYTELLING CANVAS (Unboxed with radial edge feathering) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_65%,transparent_100%)] z-0"
          style={{ width: "100%", height: "100%" }}
        />

        {/* 3. ARRI / RED VIEWFINDER OS FRAMING & RETICLES */}
        <div className="pointer-events-none absolute inset-3 sm:inset-5 md:inset-8 flex flex-col justify-between z-20">
          {/* Top Reticles Bar */}
          <div className="flex items-start justify-between font-mono text-[9px] sm:text-[10px] tracking-wider text-zinc-500">
            {/* Top-Left: Corner Bracket ┌ & Live REC Tally */}
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-white/40">
                <path d="M1 17V1H17" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-400">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                <span className="font-bold text-white tracking-widest">REC</span>
                <span className="text-zinc-600">·</span>
                <span className="text-red-400 font-semibold">{timecode}</span>
              </div>
            </div>

            {/* Top-Right: Sensor Format & Corner Bracket ┐ */}
            <div className="flex items-center gap-2">
              <div className="font-mono text-[10px] text-zinc-400 text-right hidden xs:block">
                <span className="text-white font-semibold">8K VISTAVISION</span>
                <span className="text-zinc-600"> · </span>
                <span className="text-emerald-400 font-semibold">120 FPS RAW</span>
              </div>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-white/40">
                <path d="M17 17V1H1" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          {/* Rule-of-Thirds Crosshairs (+) with mouse parallax */}
          <div
            className="pointer-events-none absolute inset-0 z-10 transition-transform duration-100 ease-out"
            style={{
              transform: `translate3d(${mousePos.x * 10}px, ${mousePos.y * 10}px, 0)`,
            }}
          >
            <div className="absolute left-[33.3%] top-[33.3%] -translate-x-1/2 -translate-y-1/2 font-mono text-xs text-white/20 select-none">
              +
            </div>
            <div className="absolute left-[66.7%] top-[33.3%] -translate-x-1/2 -translate-y-1/2 font-mono text-xs text-white/20 select-none">
              +
            </div>
            <div className="absolute left-[33.3%] top-[66.7%] -translate-x-1/2 -translate-y-1/2 font-mono text-xs text-white/20 select-none">
              +
            </div>
            <div className="absolute left-[66.7%] top-[66.7%] -translate-x-1/2 -translate-y-1/2 font-mono text-xs text-white/20 select-none">
              +
            </div>
          </div>

          {/* Bottom Reticles Bar */}
          <div className="flex items-end justify-between font-mono text-[9px] sm:text-[10px] tracking-wider text-zinc-500">
            {/* Bottom-Left: Corner Bracket └ & Soundstage Battery */}
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-white/40">
                <path d="M1 1V17H17" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <div className="font-mono text-[10px] text-zinc-400 hidden sm:flex items-center gap-1.5">
                <span className="text-zinc-500">STAGE:</span>
                <span className="text-zinc-200 font-medium">MUMBAI-STAGE-04</span>
                <span className="text-zinc-600">·</span>
                <span className="text-emerald-400 font-semibold">BAT 14.8V (98%)</span>
              </div>
            </div>

            {/* Bottom-Right: Color Space & Corner Bracket ┘ */}
            <div className="flex items-center gap-2">
              <div className="font-mono text-[10px] text-zinc-400 text-right hidden sm:block">
                <span className="text-zinc-500">COLOR SPACE: </span>
                <span className="text-red-400 font-medium">S-GAMUT3.CINE / S-LOG3</span>
              </div>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-white/40">
                <path d="M17 1V17H1" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>

        {/* 4. BEAT 1 HERO DISPLAY: TYPOGRAPHY, STAGGERED REVEAL & CALLOUT ACTION CLUSTER */}
        <div
          className={`absolute inset-x-3 sm:inset-x-6 top-14 sm:top-18 md:top-20 max-w-4xl mx-auto text-center z-30 transition-all duration-300 ease-out ${
            scrollProgress <= 0.20
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 -translate-y-6 scale-95 pointer-events-none"
          }`}
        >
          {/* Subtle atmospheric vignette backing for 100% crisp editorial contrast */}
          <div className="pointer-events-none absolute -inset-x-12 -top-10 -bottom-8 bg-gradient-to-b from-[#050505]/85 via-[#050505]/40 to-transparent blur-2xl -z-10 rounded-3xl" />

          {/* Top Telemetry Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 border border-white/10 bg-zinc-900/60 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-zinc-300 shadow-[0_0_20px_rgba(220,38,38,0.15)] mb-2.5 sm:mb-3"
          >
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse shrink-0" />
            <span className="hidden sm:inline">01 // CINEMA HARDWARE ARCHITECTURE • MUMBAI STAGE DESK</span>
            <span className="sm:hidden">01 // MUMBAI STAGE DESK</span>
          </motion.div>

          {/* Hero Display Title: Metallic + Tungsten Red Gradients */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-[4.75rem] font-extrabold tracking-[-0.03em] leading-[1.02] text-balance drop-shadow-2xl"
          >
            <span className="bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent block">
              Precision Optics.
            </span>
            <span className="bg-gradient-to-r from-red-500 via-rose-500 to-orange-500 bg-clip-text text-transparent block drop-shadow-[0_0_35px_rgba(239,68,68,0.25)]">
              Uncompromised Sensor Power.
            </span>
          </motion.h1>

          {/* Technical Sub-copy with inline monospace spec pills */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-2.5 sm:mt-3 text-xs sm:text-sm md:text-base text-zinc-300 max-w-2xl mx-auto font-normal leading-relaxed text-balance px-2"
          >
            The cinema hardware behind award-winning frames. Calibrated to{" "}
            <span className="font-mono text-xs bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-zinc-200">
              ±0.010mm FFD
            </span>
            , standard{" "}
            <span className="font-mono text-xs bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-zinc-200">
              PL-Mount
            </span>
            , with{" "}
            <span className="font-mono text-xs bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-zinc-200">
              16+ Stops DR
            </span>
            —flight-cased and dispatched directly to your set.
          </motion.p>

          {/* Action Cluster */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-3.5 sm:mt-4 flex flex-col xs:flex-row items-center justify-center gap-2.5 sm:gap-3.5 w-full max-w-md mx-auto pointer-events-auto"
          >
            <button
              onClick={onRentClick}
              className="w-full xs:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold px-6 sm:px-7 py-2.5 sm:py-3 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer min-h-[44px] text-xs sm:text-sm tracking-wide"
            >
              <span>Configure & Reserve Kit</span>
              <span className="font-mono text-xs">→</span>
            </button>

            <button
              onClick={() => handleSelectMode(activeMode === "assembled" ? "exploded" : "assembled")}
              className="w-full xs:w-auto inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer min-h-[44px] text-xs sm:text-sm"
            >
              <Sparkles className="h-4 w-4 text-rose-400" />
              <span>{activeMode === "assembled" ? "Inspect Exploded View ⚡" : "Reset Assembled Rig"}</span>
            </button>
          </motion.div>

          {/* Tactile Segmented Mode Switcher */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-3 inline-flex items-center gap-1 p-1 rounded-full border border-white/10 bg-zinc-900/80 backdrop-blur-xl shadow-2xl pointer-events-auto max-w-[95vw]"
          >
            {[
              { id: "assembled", label: "Assembled Rig", badge: "8K VV" },
              { id: "exploded", label: "Exploded X-Ray", badge: "SENSOR" },
              { id: "optics", label: "Optical Path", badge: "T2.0 GLASS" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleSelectMode(tab.id as any)}
                className={`relative px-3 sm:px-4 py-1 rounded-full font-mono text-[10px] sm:text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeMode === tab.id
                    ? "text-white font-semibold shadow-md"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                }`}
              >
                {activeMode === tab.id && (
                  <motion.div
                    layoutId="hero-mode-pill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-600 shadow-[0_0_20px_rgba(220,38,38,0.45)]"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
                <span
                  className={`relative z-10 text-[9px] px-1.5 py-0.2 rounded font-bold ${
                    activeMode === tab.id ? "bg-white/20 text-white" : "bg-white/5 text-zinc-500"
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            ))}
          </motion.div>
        </div>

        {/* 5. INTERACTIVE "X-RAY" HARDWARE HOTSPOTS & SVG LEADER LINES */}
        {scrollProgress <= 0.20 && activeMode === "assembled" && (
          <div
            className="pointer-events-none absolute inset-0 z-30 transition-transform duration-100 ease-out"
            style={{
              transform: `translate3d(${mousePos.x * 12}px, ${mousePos.y * 12}px, 0)`,
            }}
          >
            {/* SVG Connecting Leader Lines for Active Desktop Tooltip */}
            <svg className="hidden md:block absolute inset-0 h-full w-full pointer-events-none z-30">
              {SPEC_HOTSPOTS.map((h) => {
                if (activeHotspot !== h.id) return null;
                const ax = cameraStage.x + h.relX * cameraStage.w;
                const ay = cameraStage.y + h.relY * cameraStage.h;
                let path = "";

                if (h.tooltipSide === "left") {
                  path = `M ${ax} ${ay} L ${ax - 40} ${ay - 40} L ${ax - 70} ${ay - 40}`;
                } else if (h.tooltipSide === "top") {
                  path = `M ${ax} ${ay} L ${ax - 20} ${ay - 50} L ${ax - 20} ${ay - 80}`;
                } else {
                  path = `M ${ax} ${ay} L ${ax + 40} ${ay - 30} L ${ax + 80} ${ay - 30}`;
                }

                return (
                  <g key={`svg-leader-${h.id}`}>
                    <motion.path
                      d={path}
                      fill="none"
                      stroke="rgba(239, 68, 68, 0.9)"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <circle cx={ax} cy={ay} r="3" fill="#ef4444" className="animate-pulse" />
                  </g>
                );
              })}
            </svg>

            {/* Pulsing Hotspot Nodes anchored on Camera Components */}
            {SPEC_HOTSPOTS.map((h) => {
              const ax = cameraStage.x + h.relX * cameraStage.w;
              const ay = cameraStage.y + h.relY * cameraStage.h;
              const isActive = activeHotspot === h.id;

              return (
                <div
                  key={h.id}
                  className="absolute pointer-events-auto"
                  style={{
                    left: `${ax}px`,
                    top: `${ay}px`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <button
                    onClick={() => setActiveHotspot(isActive ? null : h.id)}
                    onMouseEnter={() => setActiveHotspot(h.id)}
                    className="group relative flex items-center justify-center cursor-pointer focus:outline-none"
                    aria-label={`Inspect ${h.label} specifications`}
                  >
                    {/* Pulsing outer aura ring */}
                    <span className="absolute h-8 w-8 rounded-full border border-red-500/50 bg-red-500/15 animate-ping pointer-events-none" />

                    {/* Button node chassis */}
                    <span
                      className={`relative flex h-6 w-6 items-center justify-center rounded-full border shadow-xl transition-all duration-300 ${
                        isActive
                          ? "border-red-400 bg-red-600 text-white scale-125 shadow-red-500/50"
                          : "border-white/30 bg-zinc-950/90 text-zinc-300 hover:scale-110 hover:border-white group-hover:text-white"
                      }`}
                    >
                      <Crosshair className="h-3 w-3" />
                    </span>

                    {/* Subtle label pill for instant context */}
                    <span className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center gap-1 rounded bg-black/80 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-zinc-300 border border-white/10 opacity-70 group-hover:opacity-100 transition whitespace-nowrap">
                      {h.label}
                    </span>
                  </button>

                  {/* Desktop Hover / Click HUD Tooltip Card */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className={`hidden md:block absolute z-40 w-72 rounded-xl border border-white/20 bg-zinc-950/90 p-3.5 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_25px_rgba(239,68,68,0.2)] text-left pointer-events-auto ${
                          h.tooltipSide === "left"
                            ? "right-10 bottom-6"
                            : h.tooltipSide === "top"
                            ? "left-1/2 -translate-x-1/2 bottom-12"
                            : "left-10 bottom-6"
                        }`}
                        onMouseLeave={() => setActiveHotspot(null)}
                      >
                        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                          <span className="font-mono text-[9px] text-red-400 font-bold tracking-widest uppercase">
                            {h.tag}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveHotspot(null);
                            }}
                            className="text-zinc-500 hover:text-white text-xs cursor-pointer"
                          >
                            ×
                          </button>
                        </div>

                        <h4 className="mt-2 text-xs font-bold text-white tracking-tight">{h.name}</h4>
                        <p className="mt-1 text-[11px] text-zinc-400 leading-relaxed">{h.description}</p>

                        <div className="mt-2.5 flex flex-wrap gap-1 font-mono text-[9px]">
                          {h.specs.map((spec) => (
                            <span
                              key={spec}
                              className="rounded bg-white/5 border border-white/10 px-1.5 py-0.5 text-zinc-300 font-medium"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}

        {/* Mobile Hotspot Drawer Card (Tapping a hotspot opens this dismissible mini-card) */}
        <AnimatePresence>
          {activeHotspot && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 25 }}
              className="md:hidden absolute inset-x-4 bottom-20 z-40 rounded-2xl border border-white/20 bg-zinc-950/95 p-4 backdrop-blur-2xl shadow-2xl text-left pointer-events-auto"
            >
              {(() => {
                const h = SPEC_HOTSPOTS.find((item) => item.id === activeHotspot);
                if (!h) return null;
                return (
                  <div>
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                      <span className="font-mono text-[10px] text-red-400 font-bold tracking-wider">
                        {h.tag}
                      </span>
                      <button
                        onClick={() => setActiveHotspot(null)}
                        className="h-6 w-6 rounded-full bg-white/10 text-zinc-300 flex items-center justify-center text-xs"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <h4 className="mt-2 text-sm font-bold text-white">{h.name}</h4>
                    <p className="mt-1 text-xs text-zinc-400 leading-relaxed">{h.description}</p>

                    <div className="mt-2.5 flex flex-wrap gap-1 font-mono text-[10px]">
                      {h.specs.map((spec) => (
                        <span
                          key={spec}
                          className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-zinc-300"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 6. BOTTOM CINEMA TELEMETRY HUD & MOBILE FOLLOW-FOCUS SCRUBBER */}
        <div className="relative z-30 w-full pointer-events-auto">
          {/* Mobile Follow-Focus Touch Scrubber Slider */}
          <div className="sm:hidden w-full max-w-xs mx-auto px-4 py-2">
            <div className="flex justify-between items-center text-[9px] font-mono text-zinc-400 mb-1">
              <span className="text-red-400 font-bold flex items-center gap-1">
                <SlidersHorizontal className="h-2.5 w-2.5" />
                <span>FOCUS / DISASSEMBLY</span>
              </span>
              <span className="font-semibold text-white">
                {Math.round(scrollProgress * 100).toString().padStart(2, "0")}%
              </span>
            </div>
            <div className="relative flex items-center">
              <div className="absolute inset-x-0 h-1.5 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-between px-2 text-[6px] text-zinc-600 select-none pointer-events-none">
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.002"
                value={scrollProgress}
                onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
                className="relative z-10 w-full accent-red-500 cursor-pointer h-5 bg-transparent appearance-none focus:outline-none"
                aria-label="Cinema Rig Follow Focus Disassembly Scrubber"
              />
            </div>

            {/* Mobile 2-Pill Glass Dock */}
            <div className="flex items-center justify-center gap-2 pt-2 pb-5 font-mono text-[10px]">
              <div className="rounded-full border border-white/15 bg-zinc-900/80 px-3 py-0.5 text-zinc-300 backdrop-blur-md shadow-md">
                <span className="text-zinc-500 mr-1.5">ISO</span>
                <span className="text-white font-bold">800 / 12,800</span>
              </div>
              <div className="rounded-full border border-white/15 bg-zinc-900/80 px-3 py-0.5 text-zinc-300 backdrop-blur-md shadow-md">
                <span className="text-zinc-500 mr-1.5">SHUTTER</span>
                <span className="text-emerald-400 font-bold">180° (1/48)</span>
              </div>
            </div>
          </div>

          {/* Desktop 3-Column Cinema Telemetry Dock */}
          <div className="hidden sm:flex items-center justify-between max-w-6xl mx-auto w-full px-6 py-3 font-mono text-xs text-zinc-400 border-t border-white/5 bg-zinc-950/40 backdrop-blur-md">
            {/* Left Telemetry Column */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-zinc-300 font-semibold">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span>DISASSEMBLY: {Math.round(scrollProgress * 100).toString().padStart(2, "0")}%</span>
              </div>
              <div className="h-1.5 w-16 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-rose-400 transition-all duration-75"
                  style={{ width: `${Math.max(2, scrollProgress * 100)}%` }}
                />
              </div>
              <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-zinc-300 font-bold">
                FPS: {fps}.0
              </span>
            </div>

            {/* Center Interactive Scroll / Drag Pill */}
            <div className="relative rounded-full border border-red-500/30 bg-zinc-900/80 px-4 py-1 text-[11px] text-zinc-300 shadow-[0_0_15px_rgba(220,38,38,0.2)] flex items-center gap-2">
              <ChevronDown className="h-3.5 w-3.5 text-red-500 animate-bounce" />
              <span>SCROLL OR SCRUB TO DISASSEMBLE CAMERA</span>
            </div>

            {/* Right Live Cinema Sensor Badges */}
            <div className="flex items-center gap-2 text-[11px]">
              <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-zinc-300 font-medium">
                SHUTTER 180°
              </span>
              <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-zinc-300 font-medium">
                EI 800
              </span>
              <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-zinc-300 font-medium">
                6000K
              </span>
              <span className="rounded-md border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-red-300 font-bold">
                T2.0
              </span>
            </div>
          </div>
        </div>

        {/* BEAT 2 (22% - 49%): Internal Breakdown & Full-Frame Sensor Block */}
        <div
          className={`absolute inset-x-3 bottom-4 xs:bottom-6 sm:bottom-auto sm:inset-x-auto sm:left-8 md:left-16 sm:top-1/2 sm:-translate-y-1/2 max-w-lg sm:max-w-md z-30 transition-all duration-300 ease-out pointer-events-none ${
            scrollProgress > 0.22 && scrollProgress < 0.49
              ? "opacity-100 translate-y-0 sm:translate-x-0"
              : "opacity-0 translate-y-6 sm:-translate-x-12 sm:translate-y-0"
          }`}
        >
          <div className="relative rounded-2xl sm:rounded-3xl border border-white/15 bg-zinc-950/85 p-3.5 xs:p-4 sm:p-7 backdrop-blur-2xl shadow-[0_25px_50px_rgba(0,0,0,0.9),inset_0_1.5px_1px_rgba(255,255,255,0.25)] ring-1 ring-white/10 text-white">
            <div className="pointer-events-none absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/70 to-transparent" />
            <div className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-0.5 sm:px-3.5 sm:py-1 font-mono text-[9px] sm:text-[10px] tracking-widest text-red-400 mb-1.5 sm:mb-3.5">
              <span>01 / INTERNAL BREAKDOWN</span>
            </div>
            <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Exmor R Full-Frame Sensor Block.
              <span className="block text-red-400 text-xs sm:text-lg md:text-xl font-bold mt-0.5 sm:mt-1">
                16-Bit RAW • 15+ Stops Latitude
              </span>
            </h2>
            <p className="mt-1 sm:mt-3 text-[11px] sm:text-sm text-slate-300 leading-relaxed line-clamp-3 sm:line-clamp-none">
              Back-illuminated 35mm full-frame CMOS sensor with active copper vapor chamber heatsink and silent turbine cooling for continuous high-framerate shooting with zero thermal throttling.
            </p>

            <div className="mt-2.5 sm:mt-5 grid grid-cols-2 gap-2 sm:gap-3 font-mono text-[10px] sm:text-xs">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2 sm:p-3">
                <span className="text-[8.5px] sm:text-[10px] text-zinc-400 block tracking-wider">SENSOR FORMAT</span>
                <span className="text-white font-bold">35.7 × 23.8 mm</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2 sm:p-3">
                <span className="text-[8.5px] sm:text-[10px] text-zinc-400 block tracking-wider">DUAL BASE ISO</span>
                <span className="text-red-400 font-bold">800 / 12,800</span>
              </div>
            </div>
          </div>
        </div>

        {/* BEAT 3 (52% - 77%): Optical Rig & Flange Tolerances */}
        <div
          className={`absolute inset-x-3 bottom-4 xs:bottom-6 sm:bottom-auto sm:inset-x-auto sm:right-8 md:right-16 sm:top-1/2 sm:-translate-y-1/2 max-w-lg sm:max-w-md text-left sm:text-right z-30 transition-all duration-300 ease-out pointer-events-none ${
            scrollProgress >= 0.52 && scrollProgress < 0.77
              ? "opacity-100 translate-y-0 sm:translate-x-0"
              : "opacity-0 translate-y-6 sm:translate-x-12 sm:translate-y-0"
          }`}
        >
          <div className="relative rounded-2xl sm:rounded-3xl border border-white/15 bg-zinc-950/85 p-3.5 xs:p-4 sm:p-7 backdrop-blur-2xl shadow-[0_25px_50px_rgba(0,0,0,0.9),inset_0_1.5px_1px_rgba(255,255,255,0.25)] ring-1 ring-white/10 text-white">
            <div className="pointer-events-none absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/70 to-transparent" />
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.05] px-2.5 py-0.5 sm:px-3.5 sm:py-1 font-mono text-[9px] sm:text-[10px] tracking-widest text-zinc-300 mb-1.5 sm:mb-3.5 sm:ml-auto">
              <span>02 / OPTICAL GLASS & FLANGE</span>
            </div>
            <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Bench-Calibrated Flange Tolerances.
              <span className="block text-emerald-400 text-xs sm:text-lg md:text-xl font-bold mt-0.5 sm:mt-1">
                FFD Precision ±0.010mm
              </span>
            </h2>
            <p className="mt-1 sm:mt-3 text-[11px] sm:text-sm text-slate-300 leading-relaxed text-left sm:text-right line-clamp-3 sm:line-clamp-none">
              Laser autocollimation holds Flange Focal Distance within ±0.010mm. Floating chromatic glass groupings eliminate back-focus drift and edge chromatic aberrations under extreme set temperatures.
            </p>

            <div className="mt-2.5 sm:mt-5 flex justify-start sm:justify-end gap-2 sm:gap-3 font-mono text-[10px] sm:text-xs">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2 sm:p-3 text-left">
                <span className="text-[8.5px] sm:text-[10px] text-zinc-400 block tracking-wider">FFD TOLERANCE</span>
                <span className="text-emerald-400 font-bold">±0.010 mm Pass</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2 sm:p-3 text-left">
                <span className="text-[8.5px] sm:text-[10px] text-zinc-400 block tracking-wider">IRIS MECHANISM</span>
                <span className="text-white font-bold">11-Blade Circular</span>
              </div>
            </div>
          </div>
        </div>

        {/* BEAT 4 (80% - 100%): Turnkey Stage Dispatch */}
        <div
          className={`absolute inset-x-3 sm:inset-x-6 top-28 sm:top-32 md:top-36 max-w-lg mx-auto z-30 transition-all duration-300 ease-out ${
            scrollProgress >= 0.80
              ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
              : "opacity-0 translate-y-6 scale-95 pointer-events-none"
          }`}
        >
          {/* Framer Frosted Glass Mirror Blurred Container Box */}
          <div className="relative rounded-2xl sm:rounded-3xl border border-white/20 bg-zinc-950/90 p-3.5 xs:p-4 sm:p-6 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),inset_0_1.5px_1px_rgba(255,255,255,0.25)] ring-1 ring-white/10 text-center text-white">
            {/* Top Specular Mirror Sheen Highlight */}
            <div className="pointer-events-none absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

            <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 sm:px-3.5 sm:py-1 font-mono text-[9px] sm:text-[10px] tracking-widest text-emerald-400 backdrop-blur-md mb-1.5 sm:mb-2 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>03 / TURNKEY DISPATCH • PELICAN SEALED</span>
            </div>
            
            <h2 className="text-base xs:text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Soundstage-Ready Fleet.
              <span className="block mt-0.5 bg-gradient-to-r from-red-500 via-rose-400 to-amber-200 bg-clip-text text-transparent">
                Dispatched in Under 3 Hours.
              </span>
            </h2>
            
            <p className="mt-1 sm:mt-1.5 text-[11px] sm:text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              Factory-collimated cinema bodies & matched primes, flight-cased for instant Mumbai set call.
            </p>

            {/* Precision Telemetry Capsule Pill */}
            <div className="mt-2.5 sm:mt-3 inline-flex items-center justify-center gap-2 sm:gap-3.5 rounded-full border border-white/10 bg-white/[0.04] px-3 sm:px-4 py-1 font-mono text-[9px] sm:text-[10px]">
              <span className="text-zinc-400">FFD <strong className="text-emerald-400">±0.010mm</strong></span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">CLEANROOM <strong className="text-white">ISO 5</strong></span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">STAGE <strong className="text-red-400">&lt;3h</strong></span>
            </div>

            {/* Quick Actions */}
            <div className="mt-3 sm:mt-4 flex flex-col xs:flex-row items-center justify-center gap-2 sm:gap-3">
              <a
                href="#catalog"
                className="w-full xs:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-600 px-5 sm:px-6 py-2 text-xs sm:text-sm font-semibold text-white tracking-wide shadow-lg shadow-red-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>Explore Fleet Catalog</span>
                <span className="font-mono text-xs">→</span>
              </a>
              <a
                href="#faq"
                className="w-full xs:w-auto inline-flex items-center justify-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] hover:bg-white/[0.1] px-4 py-2 text-xs sm:text-sm font-medium text-zinc-200 transition-all cursor-pointer"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>₹0 Deposit Waiver</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Pre-calculated cleanroom micro-dust particles for cinematic depth
const CLEANROOM_PARTICLES = Array.from({ length: 32 }, (_, i) => ({
  x: ((i * 137.5) % 100) / 100,
  y: ((i * 219.3) % 100) / 100,
  size: 0.8 + ((i * 3.7) % 2.4),
  speed: 0.15 + ((i * 0.7) % 0.4),
  drift: Math.sin(i * 1.5),
  alpha: 0.08 + ((i * 5) % 0.22),
}));

function smoothstep(min: number, max: number, value: number) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

/**
 * Continuous Kinematic Disassembly Engine
 * Blends perspective-locked frames of the EXACT SAME Sony FX3 cinema rig
 * as it mechanically expands along the 15mm carbon rods and optical laser axis,
 * revealing the titanium PL mount, illuminated Exmor R sensor, and floating
 * chromatic cinema glass optics, before sealing into the Pelican flight case.
 */
function renderKinematicCameraFlow(
  ctx: CanvasRenderingContext2D,
  masters: MasterImages,
  width: number,
  height: number,
  p: number,
  mx: number,
  my: number,
  time: number
) {
  const { beat1, beat2, beat3, beat4 } = masters;
  const imgW = 1376;
  const imgH = 768;
  const imgAspect = imgW / imgH;

  const isPortrait = height > width;
  const isMobile = width < 640;
  const isTabletPortrait = isPortrait && width < 1024;

  // Safe vertical stage boundaries to guarantee zero collision with typography & HUD
  // Top safe bound: clear margin below Beat 1 headline & subtext
  const textBottomSafe = isMobile ? 210 : isTabletPortrait ? 250 : 285;
  // Bottom safe bound: clear margin above bottom disassembly prompt & HUD
  const bottomPromptSafe = height - (isMobile ? 55 : 70);
  const availStageH = Math.max(180, bottomPromptSafe - textBottomSafe);

  // Scaled cleanly with strict vertical headroom so the Tilta handle never touches text
  const fitScale = Math.min(
    1,
    Math.min(
      (width * (isMobile ? 0.92 : 0.86)) / width,
      (availStageH * (isMobile ? 0.95 : isTabletPortrait ? 0.88 : 0.90)) / (width / imgAspect),
      (height * (isMobile ? 0.44 : isTabletPortrait ? 0.48 : 0.54)) / (width / imgAspect)
    )
  );
  const finalW = width * fitScale;
  const finalH = finalW / imgAspect;
  const scaleRatio = finalW / imgW;

  const origX = (width - finalW) / 2;
  const beat4Offset = p >= 0.78 ? Math.min(32, (p - 0.78) * 130) : 0;

  // Beat 1: Center the camera in the safe stage below the header text with generous breathing room
  const heroStageY = textBottomSafe + (availStageH - finalH) / 2 + (isMobile ? 12 : 18);
  // Beats 2 & 3: Once Beat 1 text fades away, smoothly glide to optical viewport center
  const centerStageY = (height - finalH) / 2 + (height > 700 ? 25 : 10);

  // Smooth interpolation: as user scrolls (p: 0.18 -> 0.35), camera transitions from heroStageY to centerStageY
  const stageTransition = smoothstep(0.18, 0.35, p);
  let targetY = heroStageY * (1 - stageTransition) + centerStageY * stageTransition;

  // On mobile/tablet portrait during Beats 2 and 3, lift camera so bottom telemetry card doesn't block it
  if (isMobile || isTabletPortrait) {
    const disassembleLift = smoothstep(0.18, 0.30, p) * (1 - smoothstep(0.78, 0.90, p));
    const portraitTopY = Math.max(65, height * 0.22 - finalH / 2);
    targetY = targetY * (1 - disassembleLift) + portraitTopY * disassembleLift;
  }
  const origY = targetY + beat4Offset;

  // Subtle 3D perspective parallax from cursor
  const tiltAngle = mx * 0.018;
  const tiltShiftX = mx * 20;
  const tiltShiftY = my * 12;

  ctx.save();
  const centerX = width / 2;
  const centerY = origY + finalH / 2;
  ctx.translate(centerX + tiltShiftX, centerY + tiltShiftY);
  ctx.rotate(tiltAngle);
  ctx.translate(-centerX, -centerY);

  // 1. STAGE PROGRESS & CONTINUOUS BLENDING WEIGHTS
  // Stage 1 (0.00 -> 0.20): Assembled Hero Rig (beat1)
  // Stage 2 (0.20 -> 0.52): Lens forward on rods, revealing sensor die & PL mount (beat1 -> beat2)
  // Stage 3 (0.52 -> 0.80): Lens further forward, optical glass elements & iris bloom (beat2 -> beat3)
  // Stage 4 (0.80 -> 1.00): Camera sealed in custom Pelican Air flight case (beat3 -> beat4)

  const t12 = smoothstep(0.18, 0.44, p); // 0 -> 1 as lens slides out
  const t23 = smoothstep(0.48, 0.74, p); // 0 -> 1 as optics bloom
  const t34 = smoothstep(0.78, 0.88, p); // 0 -> 1 as flight case seals

  const cameraAlpha = 1 - t34;
  const caseAlpha = t34;

  // 2. RENDER PERSPECTIVE-LOCKED CAMERA RIG
  if (cameraAlpha > 0.001) {
    ctx.save();
    ctx.globalAlpha = cameraAlpha;

    // Draw base layer:
    if (t23 <= 0.001) {
      // Transitioning between Beat 1 and Beat 2
      if (beat1.complete && beat1.naturalWidth > 0) {
        ctx.drawImage(beat1, origX, origY, finalW, finalH);
      }
      if (t12 > 0.001 && beat2.complete && beat2.naturalWidth > 0) {
        ctx.save();
        ctx.globalAlpha = cameraAlpha * t12;
        ctx.drawImage(beat2, origX, origY, finalW, finalH);
        ctx.restore();
      }
    } else {
      // Transitioning between Beat 2 and Beat 3
      if (beat2.complete && beat2.naturalWidth > 0) {
        ctx.drawImage(beat2, origX, origY, finalW, finalH);
      }
      if (t23 > 0.001 && beat3.complete && beat3.naturalWidth > 0) {
        ctx.save();
        ctx.globalAlpha = cameraAlpha * t23;
        ctx.drawImage(beat3, origX, origY, finalW, finalH);
        ctx.restore();
      }
    }

    // 3. UNBROKEN RED LASER COLLIMATION AXIS (Active when disassembled)
    const expansion = Math.max(t12, t23);
    if (expansion > 0.08 && cameraAlpha > 0.15) {
      const laserY = origY + 390 * scaleRatio;
      const laserStartX = origX + 140 * scaleRatio;
      const laserEndX = origX + 620 * scaleRatio;

      ctx.save();
      // Outer neon red glow beam
      ctx.strokeStyle = `rgba(239, 68, 68, ${0.4 + expansion * 0.45})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(laserStartX, laserY);
      ctx.lineTo(laserEndX, laserY);
      ctx.stroke();

      // Sharp white laser core
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.85 * expansion})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(laserStartX + 20 * scaleRatio, laserY);
      ctx.lineTo(laserEndX - 20 * scaleRatio, laserY);
      ctx.stroke();

      // Sensor plane focal ping
      const sensorX = origX + 565 * scaleRatio;
      const pingPulse = Math.sin(time * 6);
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(sensorX, laserY, 3.5 + pingPulse * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Focal point reticle on sensor die
      ctx.strokeStyle = "rgba(239, 68, 68, 0.75)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(sensorX, laserY, 8 + pingPulse * 2, 0, Math.PI * 2);
      ctx.stroke();

      // Specular glints on floating optical glass discs (Beat 3)
      if (t23 > 0.1) {
        const glintPoints = [190, 240, 285, 330];
        glintPoints.forEach((gx, idx) => {
          const px = origX + gx * scaleRatio;
          const glintAlpha = Math.max(0, Math.sin(time * 4 + idx * 1.2));
          ctx.fillStyle = `rgba(56, 189, 248, ${glintAlpha * 0.9 * t23})`;
          ctx.beginPath();
          ctx.arc(px, laserY, 3, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      ctx.restore();
    }

    // 4. SENSOR COPPER VAPOR CHAMBER THERMAL DISSIPATION GLOW (Beat 2)
    if (t12 > 0.1 && t23 < 0.7) {
      const sensorX = origX + 565 * scaleRatio;
      const sensorY = origY + 390 * scaleRatio;
      const sensorWarmth = t12 * (1 - t23 * 0.6);

      ctx.save();
      const heatGrad = ctx.createRadialGradient(
        sensorX,
        sensorY,
        10 * scaleRatio,
        sensorX,
        sensorY,
        120 * scaleRatio
      );
      heatGrad.addColorStop(0, `rgba(239, 68, 68, ${0.2 * sensorWarmth})`);
      heatGrad.addColorStop(0.5, `rgba(249, 115, 22, ${0.08 * sensorWarmth})`);
      heatGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = heatGrad;
      ctx.fillRect(sensorX - 130 * scaleRatio, sensorY - 130 * scaleRatio, 260 * scaleRatio, 260 * scaleRatio);
      ctx.restore();
    }

    // 5. FLOATING TELEMETRY HUD (Placed above lens, clear of left/right text cards)
    if (expansion > 0.15 && cameraAlpha > 0.25) {
      ctx.save();
      const hudW = Math.max(195, 230 * scaleRatio);
      const hudH = 48;
      const hudX = Math.max(12, origX + 310 * scaleRatio);
      const hudY = Math.max(20, origY + 155 * scaleRatio);

      // Glass HUD background pill
      ctx.fillStyle = "rgba(10, 10, 12, 0.88)";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(hudX, hudY, hudW, hudH, 8);
      ctx.fill();
      ctx.stroke();

      // Red status pip
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(hudX + 10, hudY + 15, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Telemetry Text
      ctx.font = `600 9px monospace`;
      ctx.fillStyle = "#ef4444";
      const ffdCurrent = (52.0 + t12 * 18.25 + t23 * 16.15).toFixed(3);
      ctx.fillText(
        `OPTICAL AXIS // FFD: ${ffdCurrent}mm`,
        hudX + 18,
        hudY + 16
      );

      ctx.font = `500 8.5px monospace`;
      ctx.fillStyle = "#10b981";
      ctx.fillText(
        `TOLERANCE: ±0.010mm [PASS]`,
        hudX + 18,
        hudY + 28
      );

      ctx.fillStyle = "#94a3b8";
      ctx.fillText(
        `EXMOR R FULL FRAME • 16-BIT RAW`,
        hudX + 18,
        hudY + 40
      );

      ctx.restore();
    }

    ctx.restore();
  }

  // 6. SEALED FLIGHT CASE OVERLAY (Beat 4 Wrap Time)
  if (caseAlpha > 0.001 && beat4.complete && beat4.naturalWidth > 0) {
    ctx.save();
    ctx.globalAlpha = caseAlpha;

    const caseAspect = beat4.naturalWidth / beat4.naturalHeight;
    const caseFitScale = Math.min(
      1,
      Math.min(
        (width * (isMobile ? 0.92 : 0.86)) / width,
        (height * (isMobile ? 0.46 : isTabletPortrait ? 0.52 : 0.58)) / (width / caseAspect)
      )
    );
    const caseW = width * caseFitScale;
    const caseH = caseW / caseAspect;
    const caseX = (width - caseW) / 2;
    const caseY = (height - caseH) / 2 + (isMobile ? 75 : height > 700 ? 115 : 60);

    ctx.drawImage(beat4, caseX, caseY, caseW, caseH);
    ctx.restore();
  }

  // 7. CINEMATIC CLEANROOM MICRO-DUST MOTES (Ambient depth)
  ctx.save();
  CLEANROOM_PARTICLES.forEach((p) => {
    const px = origX + ((p.x * finalW + time * 12 * p.speed + p.drift * 20) % finalW);
    const py = origY + ((p.y * finalH + Math.sin(time * 0.8 + p.drift) * 15) % finalH);
    ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
    ctx.beginPath();
    ctx.arc(px, py, p.size * scaleRatio, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  ctx.restore();
}

/**
 * Procedural Apple/Sony-Grade Exploded Cinema Rig Renderer
 * Draws high-precision camera components that smoothly explode and reassemble with parallax.
 */
function renderExplodedCinemaRig(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  mx: number,
  my: number,
  time: number
) {
  const isPortrait = height > width;
  const isMobile = width < 640;
  const cx = width / 2;
  const cy = (isMobile || isPortrait)
    ? (height * 0.32 + (progress < 0.2 || progress > 0.82 ? 50 : 0))
    : height / 2;
  const baseScale = Math.min(width / (isMobile ? 650 : 1100), height / 750);

  // Parallax translation
  const px = mx * 35;
  const py = my * 25;

  ctx.save();
  ctx.translate(cx + px, cy + py);
  ctx.scale(baseScale, baseScale);

  // Sub-progress explosion curve:
  // 0.0 -> 0.2: fully assembled
  // 0.2 -> 0.5: expanding out
  // 0.5 -> 0.8: peak explosion & optical breakdown
  // 0.8 -> 1.0: converging and snapping back together
  let explode = 0;
  if (progress <= 0.2) {
    explode = (progress / 0.2) * 0.15;
  } else if (progress <= 0.5) {
    explode = 0.15 + ((progress - 0.2) / 0.3) * 0.85;
  } else if (progress <= 0.8) {
    explode = 1.0;
  } else {
    explode = 1.0 - ((progress - 0.8) / 0.2);
  }

  // Smooth easing on explosion distance
  const easeExplode = Math.sin((explode * Math.PI) / 2);

  // Optical laser grid lines & depth indicators
  drawLaserTelemetry(ctx, easeExplode, time);

  // LAYER 1: REAR MAGNESIUM INTERFACE & COOLING TURBINE (-Z, moves left/back)
  const rearShift = -160 * easeExplode;
  ctx.save();
  ctx.translate(rearShift - 60 * easeExplode, 0);
  drawRearCoolingChassis(ctx, easeExplode, time);
  ctx.restore();

  // LAYER 2: COPPER VAPOR CHAMBER & HEATSINK FINS
  const heatShift = -80 * easeExplode;
  ctx.save();
  ctx.translate(heatShift, 0);
  drawCopperVaporChamber(ctx, easeExplode);
  ctx.restore();

  // LAYER 3: CORE SENSOR DIE & IRIDESCENT BAYER ARRAY (Center focal point)
  ctx.save();
  drawFullFrameSensor(ctx, easeExplode, time);
  ctx.restore();

  // LAYER 4: TITANIUM LOCKING MOUNT RING (+Z, moves right)
  const mountShift = 100 * easeExplode;
  ctx.save();
  ctx.translate(mountShift, 0);
  drawTitaniumMount(ctx, easeExplode);
  ctx.restore();

  // LAYER 5: EXPLODED CHROMATIC OPTICAL GLASS STACK (+Z, moves further right)
  const lensShift = 220 * easeExplode;
  ctx.save();
  ctx.translate(lensShift, 0);
  drawExplodedOptics(ctx, easeExplode, time);
  ctx.restore();

  // LAYER 6: FRONT MAGNESIUM BARREL HOUSING & TOP HANDLE
  const frontShift = 340 * easeExplode;
  ctx.save();
  ctx.translate(frontShift, -15 * easeExplode);
  drawFrontHousing(ctx, easeExplode);
  ctx.restore();

  // Draw technical leader lines & labels when exploded
  if (easeExplode > 0.35) {
    drawExplodedCallouts(ctx, easeExplode);
  }

  ctx.restore();
}

/**
 * Laser Telemetry Reticles & Cleanroom Grid
 */
function drawLaserTelemetry(
  ctx: CanvasRenderingContext2D,
  explode: number,
  time: number
) {
  ctx.save();
  ctx.strokeStyle = "rgba(239, 68, 68, 0.15)";
  ctx.lineWidth = 1;

  // Horizontal datum center axis
  ctx.setLineDash([4, 8]);
  ctx.beginPath();
  ctx.moveTo(-500, 0);
  ctx.lineTo(500, 0);
  ctx.stroke();

  // Center optical crosshair
  ctx.beginPath();
  ctx.arc(0, 0, 160 + explode * 60, 0, Math.PI * 2);
  ctx.stroke();

  ctx.setLineDash([]);
  ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
  ctx.beginPath();
  ctx.moveTo(-20, 0);
  ctx.lineTo(20, 0);
  ctx.moveTo(0, -20);
  ctx.lineTo(0, 20);
  ctx.stroke();

  ctx.restore();
}

/**
 * Rear Magnesium Chassis with Turbine Heat Sinks
 */
function drawRearCoolingChassis(
  ctx: CanvasRenderingContext2D,
  explode: number,
  time: number
) {
  ctx.save();

  // Main chassis block
  const w = 180;
  const h = 210;
  const x = -w / 2;
  const y = -h / 2;

  // Metallic gradient
  const grad = ctx.createLinearGradient(x, y, x + w, y + h);
  grad.addColorStop(0, "#1f2026");
  grad.addColorStop(0.5, "#14151a");
  grad.addColorStop(1, "#0a0a0d");

  ctx.fillStyle = grad;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = 2;
  roundRect(ctx, x, y, w, h, 18);
  ctx.fill();
  ctx.stroke();

  // Cooling vent grill slats
  ctx.fillStyle = "#070709";
  for (let i = 0; i < 7; i++) {
    const vy = y + 25 + i * 22;
    roundRect(ctx, x + 20, vy, w - 40, 12, 4);
    ctx.fill();
  }

  // Active micro-turbine fan
  ctx.save();
  ctx.translate(x + w / 2, y + 100);
  ctx.rotate(time * 3);
  ctx.strokeStyle = "rgba(239, 68, 68, 0.35)";
  ctx.lineWidth = 2;
  for (let b = 0; b < 6; b++) {
    ctx.rotate(Math.PI / 3);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(35, 5);
    ctx.stroke();
  }
  ctx.restore();

  ctx.restore();
}

/**
 * Copper Vapor Chamber Heat Pipe
 */
function drawCopperVaporChamber(
  ctx: CanvasRenderingContext2D,
  explode: number
) {
  ctx.save();
  const w = 150;
  const h = 180;
  const x = -w / 2;
  const y = -h / 2;

  // Pure copper metallic sheen
  const copGrad = ctx.createLinearGradient(x, y, x + w, y);
  copGrad.addColorStop(0, "#b85d34");
  copGrad.addColorStop(0.4, "#e08456");
  copGrad.addColorStop(1, "#8a3a18");

  ctx.fillStyle = copGrad;
  ctx.strokeStyle = "rgba(255, 180, 140, 0.3)";
  ctx.lineWidth = 1.5;
  roundRect(ctx, x, y, w, h, 12);
  ctx.fill();
  ctx.stroke();

  // Heat pipe channels
  ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + 30, y + 20);
  ctx.lineTo(x + 30, y + h - 20);
  ctx.moveTo(x + 75, y + 20);
  ctx.lineTo(x + 75, y + h - 20);
  ctx.moveTo(x + 120, y + 20);
  ctx.lineTo(x + 120, y + h - 20);
  ctx.stroke();

  ctx.restore();
}

/**
 * 35mm Full-Frame BSI Sensor with Iridescent Silicon Shimmer
 */
function drawFullFrameSensor(
  ctx: CanvasRenderingContext2D,
  explode: number,
  time: number
) {
  ctx.save();

  // Gold bond wire surround
  const carrierW = 160;
  const carrierH = 130;
  ctx.fillStyle = "#16171b";
  ctx.strokeStyle = "rgba(255, 215, 0, 0.4)";
  ctx.lineWidth = 2;
  roundRect(ctx, -carrierW / 2, -carrierH / 2, carrierW, carrierH, 8);
  ctx.fill();
  ctx.stroke();

  // 35.7 x 23.8 mm active Silicon Pixel Array
  const sensorW = 120;
  const sensorH = 80;
  const sx = -sensorW / 2;
  const sy = -sensorH / 2;

  // Iridescent AR coating gradient (Cyan / Green / Purple cinema silicon)
  const sGrad = ctx.createLinearGradient(
    sx + Math.sin(time) * 30,
    sy,
    sx + sensorW,
    sy + sensorH
  );
  sGrad.addColorStop(0, "#082f49"); // deep navy
  sGrad.addColorStop(0.3, "#047857"); // emerald flare
  sGrad.addColorStop(0.7, "#4338ca"); // royal indigo
  sGrad.addColorStop(1, "#701a75"); // magenta shimmer

  ctx.fillStyle = sGrad;
  roundRect(ctx, sx, sy, sensorW, sensorH, 4);
  ctx.fill();

  // Micro-pixel grid texture
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 0.5;
  for (let x = sx + 8; x < sx + sensorW; x += 10) {
    ctx.beginPath();
    ctx.moveTo(x, sy);
    ctx.lineTo(x, sy + sensorH);
    ctx.stroke();
  }
  for (let y = sy + 8; y < sy + sensorH; y += 10) {
    ctx.beginPath();
    ctx.moveTo(sx, y);
    ctx.lineTo(sx + sensorW, y);
    ctx.stroke();
  }

  // Active Tally Indicator on sensor corner
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.arc(sx + 10, sy + 10, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Titanium Locking Lens Mount Ring
 */
function drawTitaniumMount(ctx: CanvasRenderingContext2D, explode: number) {
  ctx.save();
  const radius = 95;

  // Titanium brushed rim
  const tGrad = ctx.createRadialGradient(0, 0, radius - 20, 0, 0, radius);
  tGrad.addColorStop(0, "#27272a");
  tGrad.addColorStop(0.6, "#52525b");
  tGrad.addColorStop(1, "#18181b");

  ctx.fillStyle = tGrad;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.arc(0, 0, radius - 28, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.stroke();

  // 4 Locking Bayonet Flanges
  ctx.fillStyle = "#e4e4e7";
  for (let i = 0; i < 4; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI) / 2);
    roundRect(ctx, radius - 26, -10, 16, 20, 3);
    ctx.fill();
    ctx.restore();
  }

  // Anodized red index pin
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.arc(0, -radius + 14, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Exploded Chromatic Optical Glass Elements
 */
function drawExplodedOptics(
  ctx: CanvasRenderingContext2D,
  explode: number,
  time: number
) {
  ctx.save();

  // 3 Floating Glass Elements separated along Z
  const elements = [
    { offset: -40, radius: 75, color: "rgba(56, 189, 248, 0.25)" },
    { offset: 0, radius: 82, color: "rgba(168, 85, 247, 0.22)" },
    { offset: 45, radius: 88, color: "rgba(239, 68, 68, 0.2)" },
  ];

  elements.forEach((elem) => {
    ctx.save();
    ctx.translate(elem.offset * explode, 0);

    // Glass rim ring
    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 2;
    ctx.fillStyle = elem.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, 20, elem.radius, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Specular lens flare reflection
    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(2, -elem.radius * 0.4, 6, 24, Math.PI / 8, 0, Math.PI);
    ctx.stroke();

    ctx.restore();
  });

  // 11-Blade Circular Iris in between elements
  ctx.save();
  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 2;
  for (let blade = 0; blade < 11; blade++) {
    ctx.rotate((Math.PI * 2) / 11);
    ctx.beginPath();
    ctx.moveTo(25, 0);
    ctx.lineTo(65, 12);
    ctx.stroke();
  }
  ctx.restore();

  ctx.restore();
}

/**
 * Front Magnesium Barrel Housing & Rigging Points
 */
function drawFrontHousing(ctx: CanvasRenderingContext2D, explode: number) {
  ctx.save();
  const w = 170;
  const h = 200;
  const x = -w / 2;
  const y = -h / 2;

  // Front camera body shell with lens aperture opening
  const fGrad = ctx.createLinearGradient(x, y, x + w, y);
  fGrad.addColorStop(0, "#1f2026");
  fGrad.addColorStop(0.5, "#101114");
  fGrad.addColorStop(1, "#27272a");

  ctx.fillStyle = fGrad;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
  ctx.lineWidth = 2;
  roundRect(ctx, x, y, w, h, 20);
  ctx.fill();
  ctx.stroke();

  // Front lens opening cutout
  ctx.fillStyle = "#070709";
  ctx.beginPath();
  ctx.arc(0, 0, 75, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Rigging cold shoe and 1/4"-20 threaded mounting points
  ctx.fillStyle = "#3f3f46";
  [-40, 0, 40].forEach((ox) => {
    ctx.beginPath();
    ctx.arc(ox, y + 16, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // Anodized red REC tally button on top corner
  ctx.fillStyle = "#ef4444";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x + w - 24, y + 24, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

/**
 * Exploded Leader Lines & Technical Callouts
 */
function drawExplodedCallouts(
  ctx: CanvasRenderingContext2D,
  explode: number
) {
  const alpha = Math.min(1, (explode - 0.35) / 0.4);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font = "bold 10px JetBrains Mono, monospace";

  // Callout 1: Sensor block (Bottom-center)
  drawLeaderLine(ctx, 0, 70, 0, 160, "[01] 35.7 x 23.8mm EXMOR R SENSOR", "#ef4444");

  // Callout 2: Copper vapor chamber (Top-left)
  drawLeaderLine(
    ctx,
    -80 * explode,
    -95,
    -120 * explode,
    -170,
    "[02] COPPER VAPOR CHAMBER HEATSINK",
    "#e08456"
  );

  // Callout 3: Titanium PL/E mount (Top-right)
  drawLeaderLine(
    ctx,
    100 * explode,
    -95,
    140 * explode,
    -170,
    "[03] TITANIUM LOCKING MOUNT (±0.010mm FFD)",
    "#38bdf8"
  );

  // Callout 4: Optical glass stack (Bottom-right)
  drawLeaderLine(
    ctx,
    220 * explode,
    90,
    260 * explode,
    160,
    "[04] CHROMATIC LENS ELEMENT GROUP",
    "#a855f7"
  );

  ctx.restore();
}

function drawLeaderLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  text: string,
  color: string
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1;

  // Origin pip
  ctx.beginPath();
  ctx.arc(x1, y1, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Leader line
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  // Label text with subtle black pill backdrop
  const textW = ctx.measureText(text).width;
  ctx.fillStyle = "rgba(5, 5, 5, 0.85)";
  ctx.fillRect(x2 - textW / 2 - 6, y2 - 7, textW + 12, 14);

  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x2, y2);

  ctx.restore();
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

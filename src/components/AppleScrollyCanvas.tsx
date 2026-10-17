import { useEffect, useRef, useState, useCallback } from "react";
import { ShieldCheck, ChevronDown, CheckCircle2, Sparkles } from "lucide-react";

interface MasterImages {
  beat1: HTMLImageElement;
  beat2: HTMLImageElement;
  beat3: HTMLImageElement;
  beat4: HTMLImageElement;
}

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

  // Preloaded master cinema storytelling images
  const masterImagesRef = useRef<MasterImages | null>(null);

  // Track inertial lerp progress for silky smooth 60fps scrubbing
  const currentProgressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const mouseLerpRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const animFrameIdRef = useRef(0);

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

  // Main Canvas Render Loop (Apple-style Alpha Cross-Fade + Parallax + Procedural Fallback)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;

    const render = () => {
      time += 0.015;

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
        // High-precision procedural exploded cinema camera engine fallback
        renderExplodedCinemaRig(ctx, width, height, p, mx, my, time);
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
      className="relative w-full h-[350vh] bg-[#050505] select-none"
    >
      {/* Sticky Fullscreen Canvas Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ width: "100%", height: "100%" }}
        />

        {/* 24px Background Grid Overlay that blends into canvas */}
        <div className="pointer-events-none absolute inset-0 framer-grid-lines framer-grid-mask opacity-60" />

        {/* Cinematic Viewfinder Framing Brackets */}
        <div className="pointer-events-none absolute inset-8 sm:inset-14 flex flex-col justify-between z-20 opacity-40">
          <div className="flex justify-between items-start">
            <span className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span>RAW REC • 4K 120P</span>
            </span>
            <span className="font-mono text-[10px] text-zinc-500 tracking-wider">
              2.39:1 VIEWPORT
            </span>
          </div>
          <div className="flex justify-between items-end font-mono text-[10px] text-zinc-600">
            <span>SCROLL DISASSEMBLY: {Math.round(scrollProgress * 100)}%</span>
            <span>SHUTTER 1/48 • DUAL ISO 800/12800</span>
          </div>
        </div>

        {/* SYNCHRONIZED SCROLL STORYTELLING BEATS */}

        {/* BEAT 1 (0% - 25%): Fully Assembled Hero Shot */}
        <div
          className={`absolute inset-x-6 top-10 sm:top-12 md:top-14 max-w-4xl mx-auto text-center z-30 transition-all duration-700 pointer-events-none ${
            scrollProgress <= 0.25
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 -translate-y-8 scale-95"
          }`}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 font-mono text-[10px] tracking-widest text-zinc-300 backdrop-blur-md mb-4 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span>GEARSHARE CINEMA ARCHITECTURE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-[-0.04em] text-white leading-[1.06]">
            Precision Optics.{" "}
            <span className="bg-gradient-to-r from-red-500 via-rose-400 to-white bg-clip-text text-transparent">
              Uncompromised Sensor Power.
            </span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-normal leading-relaxed drop-shadow-md">
            The cinema hardware behind award-winning frames. Calibrated to ±0.010mm FFD, flight-cased, and dispatched directly to your set.
          </p>
        </div>

        {/* Scroll Prompt at Viewport Bottom (Fades out when user starts scrolling) */}
        <div
          className={`absolute inset-x-0 bottom-8 sm:bottom-10 flex flex-col items-center justify-center gap-1.5 z-30 pointer-events-none transition-all duration-500 ${
            scrollProgress < 0.1
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/70 px-4 py-1.5 font-mono text-[11px] text-zinc-300 backdrop-blur-md shadow-lg">
            <ChevronDown className="h-3.5 w-3.5 text-red-500 animate-bounce" />
            <span>Scroll to disassemble camera architecture</span>
          </div>
        </div>

        {/* BEAT 2 (25% - 55%): Internal Breakdown & Full-Frame Sensor Block */}
        <div
          className={`absolute left-6 sm:left-12 md:left-16 top-1/2 -translate-y-1/2 max-w-md z-30 transition-all duration-700 pointer-events-none ${
            scrollProgress > 0.22 && scrollProgress <= 0.54
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-12"
          }`}
        >
          <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 sm:p-7 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3.5 py-1 font-mono text-[10px] tracking-widest text-red-400 mb-4">
              <span>01 / INTERNAL BREAKDOWN</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-[-0.03em] text-white leading-tight">
              Exmor R Full-Frame Sensor Block. 16-Bit RAW.
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Back-illuminated 35mm full-frame CMOS sensor with 15+ stops of dynamic latitude. Active copper vapor chamber heatsink and silent turbine fan deliver continuous recording with zero thermal throttling.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <span className="text-[10px] text-zinc-500 block">SENSOR SIZE</span>
                <span className="text-white font-bold">35.7 × 23.8 mm</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <span className="text-[10px] text-zinc-500 block">BASE DUAL ISO</span>
                <span className="text-red-400 font-bold">800 / 12,800</span>
              </div>
            </div>
          </div>
        </div>

        {/* BEAT 3 (55% - 82%): Optical Rig & Flange Tolerances */}
        <div
          className={`absolute right-6 sm:right-12 md:right-16 top-1/2 -translate-y-1/2 max-w-md text-right z-30 transition-all duration-700 pointer-events-none ${
            scrollProgress > 0.52 && scrollProgress <= 0.82
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-12"
          }`}
        >
          <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 sm:p-7 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1 font-mono text-[10px] tracking-widest text-zinc-300 mb-4 ml-auto">
              <span>02 / OPTICAL GLASS & FLANGE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-[-0.03em] text-white leading-tight">
              Bench-Calibrated Flange & Optic Tolerances.
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed text-right">
              Laser autocollimation holds Flange Focal Distance (FFD) within ±0.010mm. Floating chromatic glass element groupings eliminate back-focus drift and edge chromatic aberrations under extreme set temperatures.
            </p>

            <div className="mt-5 flex justify-end gap-3 font-mono text-xs">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left">
                <span className="text-[10px] text-zinc-500 block">FFD TOLERANCE</span>
                <span className="text-emerald-400 font-bold">±0.010 mm Pass</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left">
                <span className="text-[10px] text-zinc-500 block">IRIS MECHANISM</span>
                <span className="text-white font-bold">11-Blade Circular</span>
              </div>
            </div>
          </div>
        </div>

        {/* BEAT 4 (80% - 100%): Reassembly & Fleet CTA */}
        <div
          className={`absolute inset-x-4 sm:inset-x-6 top-6 sm:top-8 md:top-10 max-w-xl mx-auto z-30 transition-all duration-500 ${
            scrollProgress >= 0.80
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-6 scale-95 pointer-events-none"
          }`}
        >
          {/* Framer Frosted Glass Blurred Container Box */}
          <div className="rounded-3xl border border-white/12 bg-zinc-950/85 p-5 sm:p-7 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_40px_rgba(239,68,68,0.15)] text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 font-mono text-[10px] tracking-widest text-emerald-400 backdrop-blur-md mb-2.5 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>03 / DISPATCH CALIBRATION • FLIGHT-CASE SEALED</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-[-0.03em] text-white leading-tight">
              Ready for Wrap Time.
              <br />
              <span className="bg-gradient-to-r from-red-500 via-rose-400 to-white bg-clip-text text-transparent">
                Rent the Fleet Below.
              </span>
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Magnesium alloy body sealed, batteries charged to 100%, and dispatched directly to your Mumbai soundstage in under 3 hours.
            </p>

            {/* Quality Pass Badges */}
            <div className="mt-3.5 grid grid-cols-3 gap-2 font-mono text-[10px]">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2 text-center">
                <span className="text-[9px] text-zinc-500 block">COLLIMATION</span>
                <span className="text-emerald-400 font-bold">±0.010mm Pass</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2 text-center">
                <span className="text-[9px] text-zinc-500 block">CLEANROOM</span>
                <span className="text-white font-bold">ISO Class 5</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2 text-center">
                <span className="text-[9px] text-zinc-500 block">DISPATCH</span>
                <span className="text-red-400 font-bold">Pelican Air Case</span>
              </div>
            </div>

            <div className="mt-4.5 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#catalog"
                className="framer-pill-primary inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold cursor-pointer shadow-[0_0_25px_rgba(239,68,68,0.4)]"
              >
                <span>Explore Fleet Catalog</span>
                <span className="font-mono text-xs">→</span>
              </a>
              <a
                href="#damage-shield"
                className="framer-pill-secondary inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-medium cursor-pointer border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-red-400" />
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

  // Contain cleanly inside viewport with breathing room for top and bottom typography
  const fitScale = Math.min(
    1,
    Math.min((width * 0.88) / width, (height * 0.72) / (width / imgAspect))
  );
  const finalW = width * fitScale;
  const finalH = finalW / imgAspect;
  const scaleRatio = finalW / imgW;

  const origX = (width - finalW) / 2;
  const origY = (height - finalH) / 2 + (height > 700 ? 115 : 65);

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
      const hudX = origX + 330 * scaleRatio;
      const hudY = origY + 160 * scaleRatio;
      const hudW = 210 * scaleRatio;
      const hudH = 50 * scaleRatio;

      // Glass HUD background pill
      ctx.fillStyle = "rgba(10, 10, 12, 0.85)";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(hudX, hudY, hudW, hudH, 6 * scaleRatio);
      ctx.fill();
      ctx.stroke();

      // Red status pip
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(hudX + 12 * scaleRatio, hudY + 14 * scaleRatio, 3, 0, Math.PI * 2);
      ctx.fill();

      // Telemetry Text
      ctx.font = `${Math.max(9, Math.round(10 * scaleRatio))}px monospace`;
      ctx.fillStyle = "#ef4444";
      const ffdCurrent = (52.0 + t12 * 18.25 + t23 * 16.15).toFixed(3);
      ctx.fillText(
        `OPTICAL AXIS // FFD: ${ffdCurrent}mm`,
        hudX + 22 * scaleRatio,
        hudY + 18 * scaleRatio
      );

      ctx.font = `${Math.max(8, Math.round(9 * scaleRatio))}px monospace`;
      ctx.fillStyle = "#10b981";
      ctx.fillText(
        `TOLERANCE: ±0.010mm [PASS]`,
        hudX + 22 * scaleRatio,
        hudY + 32 * scaleRatio
      );

      ctx.fillStyle = "#94a3b8";
      ctx.fillText(
        `EXMOR R FULL FRAME • 16-BIT RAW`,
        hudX + 22 * scaleRatio,
        hudY + 44 * scaleRatio
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
      Math.min((width * 0.88) / width, (height * 0.72) / (width / caseAspect))
    );
    const caseW = width * caseFitScale;
    const caseH = caseW / caseAspect;
    const caseX = (width - caseW) / 2;
    const caseY = (height - caseH) / 2 + (height > 700 ? 140 : 80);

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
  const cx = width / 2;
  const cy = height / 2;
  const baseScale = Math.min(width / 1100, height / 750);

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

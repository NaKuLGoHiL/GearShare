import { useState, useRef, useEffect, type PointerEvent } from "react";
import cameraRed from "@/assets/camera.jpg";
import cameraArri from "@/assets/arri_camera.jpg";
import { Camera, Radio, Disc3, Layers, Sparkles, CheckCircle2, Plus, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

type CameraModel = {
  id: string;
  name: string;
  brand: string;
  subtitle: string;
  rate: number;
  img: string;
  specs: {
    sensor: string;
    resolution: string;
    dynamicRange: string;
    mount: string;
    framerate: string;
    baseIso: string;
  };
};

const FLAGSHIPS: CameraModel[] = [
  {
    id: "red-vraptor",
    name: "RED V-Raptor 8K VV",
    brand: "RED DIGITAL CINEMA",
    subtitle: "Large-Format 8K VistaVision Sensor",
    rate: 45000,
    img: cameraRed,
    specs: {
      sensor: "40.96 × 21.60mm (Diagonal 46.31mm)",
      resolution: "8192 × 4320 @ 120fps",
      dynamicRange: "17+ Stops Ultra-Wide",
      mount: "Locking RF / PL Adapter Included",
      framerate: "Up to 600fps in 2K",
      baseIso: "Dual ISO 800 / 3200",
    },
  },
  {
    id: "arri-alexa-mini-lf",
    name: "ARRI Alexa Mini LF",
    brand: "ARRI CINEMA SYSTEMS",
    subtitle: "Large Format ALEV III A2X Sensor",
    rate: 60000,
    img: cameraArri,
    specs: {
      sensor: "36.70 × 25.54mm Large Format",
      resolution: "4448 × 3096 Open Gate",
      dynamicRange: "14+ Stops Organic Roll-off",
      mount: "LPL / PL Mount with LDS-2",
      framerate: "Up to 90fps in ARRIRAW",
      baseIso: "Native EI 800",
    },
  },
];

export function Hero3DShowcase({
  onSelectGear,
  className = "",
}: {
  onSelectGear: (gear: {
    name: string;
    category: string;
    rate: number;
    img?: string | undefined;
    specs?: string[] | undefined;
  }) => void;
  className?: string;
}) {
  const { addToCart, isInCart, openCart } = useCart();
  const [activeIdx, setActiveIdx] = useState(0);
  const activeCamera = FLAGSHIPS[activeIdx] ?? FLAGSHIPS[0]!;

  const showcaseRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);

  // Inertial tilt coordinates
  const targetX = useRef(0.5);
  const targetY = useRef(0.5);
  const currentX = useRef(0.5);
  const currentY = useRef(0.5);
  const isHovered = useRef(false);

  // Timecode generator
  const [timecode, setTimecode] = useState("01:24:18:14");
  const [isTouch, setIsTouch] = useState(false);

  // Run 24fps cinematic timecode counter
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

  // Inertial 3D tilt animation loop
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsTouch("ontouchstart" in window || window.matchMedia("(hover: none)").matches);
    }

    let t = 0;
    const animate = () => {
      t += 0.015;
      const el = showcaseRef.current;
      if (el) {
        if (!isTouch) {
          if (!isHovered.current) {
            // Subtle cinematic floating breathing loop when idle
            targetX.current = 0.5 + Math.sin(t) * 0.06;
            targetY.current = 0.5 + Math.cos(t * 0.8) * 0.05;
          }

          // Smooth lerp (0.08 damping)
          currentX.current += (targetX.current - currentX.current) * 0.08;
          currentY.current += (targetY.current - currentY.current) * 0.08;

          const maxTilt = 12; // degrees
          const rx = (0.5 - currentY.current) * maxTilt;
          const ry = (currentX.current - 0.5) * maxTilt;

          el.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
          el.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
          el.style.setProperty("--mx", `${(currentX.current * 100).toFixed(1)}%`);
          el.style.setProperty("--my", `${(currentY.current * 100).toFixed(1)}%`);
          el.style.setProperty("--glare-opacity", isHovered.current ? "0.85" : "0.35");
        } else {
          // Reset for touch devices
          el.style.setProperty("--rx", "0deg");
          el.style.setProperty("--ry", "0deg");
        }
      }
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [isTouch]);

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = showcaseRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    targetX.current = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    targetY.current = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    isHovered.current = true;
  };

  const handlePointerLeave = () => {
    isHovered.current = false;
  };

  return (
    <div className={`relative mx-auto w-full max-w-6xl ${className || "px-6 pt-6 pb-12"}`}>
      {/* Flagship Selector Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Camera className="h-4 w-4 text-[#ff2a8d]" />
          <span className="tracking-widest uppercase">FLAGSHIP CINEMA BENCH</span>
        </div>
        <div className="inline-flex rounded-full border border-white/10 bg-[#0d0c18]/90 p-1 backdrop-blur-md">
          {FLAGSHIPS.map((cam, idx) => (
            <button
              key={cam.id}
              onClick={() => setActiveIdx(idx)}
              className={`rounded-full px-4 py-1.5 transition duration-200 ${
                activeIdx === idx
                  ? "bg-gradient-to-r from-[#ff2a8d] to-[#7c3aed] font-semibold text-white shadow-md shadow-[#ff2a8d]/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {cam.name}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Perspective Stage */}
      <div className="hero-3d-stage">
        <div
          ref={showcaseRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="hero-3d-chassis group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0e0d1a] shadow-2xl transition-all"
        >
          {/* Main Showcase Image Layer */}
          <div className="relative aspect-[4/3] xs:aspect-[16/10] md:aspect-[16/9] w-full overflow-hidden bg-black">
            <img
              src={activeCamera.img}
              alt={activeCamera.name}
              className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              width={1600}
              height={900}
            />

            {/* Anodized Cinema-Red Rim Lighting Gradients */}
            <div className="hero-red-rim pointer-events-none absolute inset-0" />

            {/* Dynamic Glossy Specular Sheen (Moves with cursor) */}
            <div className="hero-specular-glare pointer-events-none absolute inset-0" />

            {/* Optical Target HUD Reticle (translateZ 25px) */}
            <div className="hero-hud-reticle pointer-events-none absolute inset-0 flex items-center justify-center opacity-40">
              <div className="h-44 w-44 rounded-full border border-dashed border-[#ff2a8d]/30" />
              <div className="absolute h-px w-24 bg-[#ff2a8d]/40" />
              <div className="absolute h-24 w-px bg-[#ff2a8d]/40" />
            </div>

            {/* Top Telemetry Bar (translateZ 60px) */}
            <div className="hero-hud-layer pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-3 sm:p-6">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg border border-white/15 bg-black/75 px-2.5 sm:px-3 py-1 sm:py-1.5 font-mono text-[11px] sm:text-xs backdrop-blur-md">
                <span className="tally h-2 w-2 rounded-full bg-[#ff2a8d] shadow-[0_0_8px_#ff2a8d]" />
                <span className="font-semibold text-white">REC</span>
                <span className="text-zinc-400">·</span>
                <span className="text-[#ff2a8d] font-semibold">{timecode}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 font-mono text-[11px] sm:text-xs">
                <span className="rounded-lg border border-white/15 bg-black/75 px-2.5 sm:px-3 py-1 sm:py-1.5 text-white font-semibold backdrop-blur-md">
                  {activeCamera.specs.resolution.split(" ")[0]}
                </span>
                <span className="rounded-lg border border-[#00f0ff]/40 bg-[#00f0ff]/10 px-2.5 sm:px-3 py-1 sm:py-1.5 font-semibold text-[#00f0ff] backdrop-blur-md">
                  FLIGHT READY
                </span>
              </div>
            </div>

            {/* Floating Technical Telemetry Card (Desktop Only - translateZ 70px) */}
            <div className="hero-hud-floating hidden sm:block absolute bottom-6 left-6 max-w-md pointer-events-none z-20">
              <div className="rounded-xl border border-white/15 bg-[#0e0d1a]/95 p-4 shadow-2xl backdrop-blur-xl text-white">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-[#ff2a8d] font-semibold">
                    {activeCamera.brand}
                  </p>
                  <p className="font-mono text-xs text-zinc-300">
                    ₹{activeCamera.rate.toLocaleString("en-IN")}/day
                  </p>
                </div>
                <h3 className="mt-1 text-lg font-bold tracking-tight text-white">
                  {activeCamera.name}
                </h3>
                <p className="mt-0.5 text-xs text-slate-300 line-clamp-1">{activeCamera.subtitle}</p>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="rounded bg-white/10 border border-white/10 px-2 py-0.5 text-white font-medium">
                      {activeCamera.specs.dynamicRange.split(" ")[0]}
                    </span>
                    <span className="rounded bg-white/10 border border-white/10 px-2 py-0.5 text-slate-300 font-medium">
                      {activeCamera.specs.mount.split(" ")[0]}
                    </span>
                    <span className="text-[#00f0ff] font-medium hidden xs:inline">BENCH CERTIFIED ✓</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions (Desktop Only) */}
            <div className="hidden sm:flex items-center gap-2.5 absolute bottom-6 right-6 z-20">
              <button
                type="button"
                onClick={() => {
                  if (isInCart(activeCamera.name)) {
                    openCart();
                  } else {
                    addToCart({
                      name: activeCamera.name,
                      category: "Cinema Bodies",
                      rate: activeCamera.rate,
                      img: activeCamera.img,
                      specs: [
                        activeCamera.specs.resolution.split(" ")[0] ?? "",
                        activeCamera.specs.dynamicRange.split(" ")[0] ?? "",
                        activeCamera.specs.mount.split(" ")[0] ?? "",
                      ],
                    });
                  }
                }}
                className={`flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-xs font-mono transition cursor-pointer backdrop-blur-md ${
                  isInCart(activeCamera.name)
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-semibold shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                    : "border-white/20 bg-[#0e0d1a]/90 text-white hover:border-pink-500 hover:bg-[#141224]"
                }`}
              >
                {isInCart(activeCamera.name) ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>In Kit (View)</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5 text-[#ff2a8d]" />
                    <span>+ Add to Kit</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  onSelectGear({
                    name: activeCamera.name,
                    category: "Cinema Bodies",
                    rate: activeCamera.rate,
                    img: activeCamera.img,
                    specs: [
                      activeCamera.specs.resolution.split(" ")[0] ?? "",
                      activeCamera.specs.dynamicRange.split(" ")[0] ?? "",
                      activeCamera.specs.mount.split(" ")[0] ?? "",
                    ],
                  })
                }
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ff2a8d] to-[#7c3aed] px-5 py-2.5 text-sm font-semibold text-white shadow-xl shadow-[#ff2a8d]/30 transition hover:brightness-110 cursor-pointer"
              >
                <span>Reserve Kit</span>
                <span className="font-mono text-xs">→</span>
              </button>
            </div>
          </div>

          {/* Mobile Dedicated Camera Command Bar - Unobstructed camera image on mobile */}
          <div className="sm:hidden border-t border-white/10 bg-[#0e0d1a] px-3.5 py-3 flex items-center justify-between gap-3 text-left">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 font-mono text-[10px]">
                <span className="text-[#ff2a8d] font-bold tracking-wider uppercase truncate">{activeCamera.brand}</span>
                <span className="text-zinc-600">·</span>
                <span className="text-white font-semibold">₹{activeCamera.rate.toLocaleString("en-IN")}/d</span>
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight truncate mt-0.5">
                {activeCamera.name}
              </h3>
              <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                {activeCamera.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (isInCart(activeCamera.name)) {
                    openCart();
                  } else {
                    addToCart({
                      name: activeCamera.name,
                      category: "Cinema Bodies",
                      rate: activeCamera.rate,
                      img: activeCamera.img,
                      specs: [
                        activeCamera.specs.resolution.split(" ")[0] ?? "",
                        activeCamera.specs.dynamicRange.split(" ")[0] ?? "",
                        activeCamera.specs.mount.split(" ")[0] ?? "",
                      ],
                    });
                  }
                }}
                className={`flex items-center justify-center rounded-lg border p-2 transition cursor-pointer ${
                  isInCart(activeCamera.name)
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                    : "border-white/15 bg-white/5 text-zinc-300 hover:border-pink-500"
                }`}
                title={isInCart(activeCamera.name) ? "View Production Kit" : "Add to Production Kit"}
                aria-label="Add to Production Kit"
              >
                {isInCart(activeCamera.name) ? (
                  <Check className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Plus className="h-4 w-4 text-[#ff2a8d]" />
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  onSelectGear({
                    name: activeCamera.name,
                    category: "Cinema Bodies",
                    rate: activeCamera.rate,
                    img: activeCamera.img,
                    specs: [
                      activeCamera.specs.resolution.split(" ")[0] ?? "",
                      activeCamera.specs.dynamicRange.split(" ")[0] ?? "",
                      activeCamera.specs.mount.split(" ")[0] ?? "",
                    ],
                  })
                }
                className="shrink-0 flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#ff2a8d] to-[#7c3aed] px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-[#ff2a8d]/30 active:scale-95 transition cursor-pointer"
              >
                <span>Reserve</span>
                <span className="font-mono text-[10px]">→</span>
              </button>
            </div>
          </div>

          {/* Under-Chassis Technical Bench Readout Grid */}
          <div className="grid grid-cols-2 gap-px border-t border-white/10 bg-white/10 font-mono text-[10px] sm:text-xs sm:grid-cols-4">
            <div className="bg-[#0e0d1a] p-2.5 sm:p-4 text-left transition-colors hover:bg-[#141324]">
              <p className="text-slate-400 text-[9px] sm:text-[10px] tracking-wider">ACTIVE SENSOR</p>
              <p className="mt-0.5 sm:mt-1 font-semibold text-white text-[11px] sm:text-xs leading-snug">{activeCamera.specs.sensor}</p>
            </div>
            <div className="bg-[#0e0d1a] p-2.5 sm:p-4 text-left transition-colors hover:bg-[#141324]">
              <p className="text-slate-400 text-[9px] sm:text-[10px] tracking-wider">MAX RESOLUTION</p>
              <p className="mt-0.5 sm:mt-1 font-semibold text-white text-[11px] sm:text-xs leading-snug">{activeCamera.specs.resolution}</p>
            </div>
            <div className="bg-[#0e0d1a] p-2.5 sm:p-4 text-left transition-colors hover:bg-[#141324]">
              <p className="text-slate-400 text-[9px] sm:text-[10px] tracking-wider">LATITUDE RANGE</p>
              <p className="mt-0.5 sm:mt-1 font-semibold text-white text-[11px] sm:text-xs leading-snug">{activeCamera.specs.dynamicRange}</p>
            </div>
            <div className="bg-[#0e0d1a] p-2.5 sm:p-4 text-left transition-colors hover:bg-[#141324]">
              <p className="text-slate-400 text-[9px] sm:text-[10px] tracking-wider">LENS MOUNT</p>
              <p className="mt-0.5 sm:mt-1 font-semibold text-white text-[11px] sm:text-xs leading-snug">{activeCamera.specs.mount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

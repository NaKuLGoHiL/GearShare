import { useState, useRef, useEffect, type PointerEvent } from "react";
import cameraRed from "@/assets/camera.jpg";
import cameraArri from "@/assets/arri_camera.jpg";
import { Camera, Radio, Disc3, Layers, Sparkles, CheckCircle2 } from "lucide-react";

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
        <div className="flex items-center gap-2 text-muted-foreground">
          <Camera className="h-4 w-4 text-primary" />
          <span className="tracking-widest uppercase">FLAGSHIP CINEMA BENCH</span>
        </div>
        <div className="inline-flex rounded-full border border-border bg-carbon/90 p-1 backdrop-blur-md">
          {FLAGSHIPS.map((cam, idx) => (
            <button
              key={cam.id}
              onClick={() => setActiveIdx(idx)}
              className={`rounded-full px-4 py-1.5 transition duration-200 ${
                activeIdx === idx
                  ? "bg-foreground font-semibold text-background shadow-md"
                  : "text-muted-foreground hover:text-foreground"
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
          className="hero-3d-chassis group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-carbon to-background shadow-2xl transition-all"
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
              <div className="h-44 w-44 rounded-full border border-dashed border-primary/30" />
              <div className="absolute h-px w-24 bg-primary/40" />
              <div className="absolute h-24 w-px bg-primary/40" />
            </div>

            {/* Top Telemetry Bar (translateZ 60px) */}
            <div className="hero-hud-layer pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-3 sm:p-6">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg border border-white/15 bg-black/75 px-2.5 sm:px-3 py-1 sm:py-1.5 font-mono text-[11px] sm:text-xs backdrop-blur-md">
                <span className="tally h-2 w-2 rounded-full" />
                <span className="font-semibold text-white">REC</span>
                <span className="text-zinc-400">·</span>
                <span className="text-red-400 font-semibold">{timecode}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 font-mono text-[11px] sm:text-xs">
                <span className="rounded-lg border border-white/15 bg-black/75 px-2.5 sm:px-3 py-1 sm:py-1.5 text-white font-semibold backdrop-blur-md">
                  {activeCamera.specs.resolution.split(" ")[0]}
                </span>
                <span className="rounded-lg border border-primary/40 bg-primary/20 px-2.5 sm:px-3 py-1 sm:py-1.5 font-semibold text-red-300 backdrop-blur-md">
                  FLIGHT READY
                </span>
              </div>
            </div>

            {/* Floating Technical Telemetry Card (translateZ 70px) */}
            <div className="hero-hud-floating absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md pointer-events-auto sm:pointer-events-none">
              <div className="rounded-xl border border-white/15 bg-black/90 p-3.5 sm:p-4 shadow-2xl backdrop-blur-xl text-white">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-red-400 font-semibold">
                    {activeCamera.brand}
                  </p>
                  <p className="font-mono text-[11px] sm:text-xs text-zinc-300">
                    ₹{activeCamera.rate.toLocaleString("en-IN")}/day
                  </p>
                </div>
                <h3 className="mt-0.5 sm:mt-1 text-base sm:text-lg font-bold tracking-tight text-white">
                  {activeCamera.name}
                </h3>
                <p className="mt-0.5 text-[11px] sm:text-xs text-zinc-300 line-clamp-1">{activeCamera.subtitle}</p>

                <div className="mt-2.5 sm:mt-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-2 font-mono text-[10px] sm:text-[11px]">
                    <span className="rounded bg-white/15 border border-white/10 px-2 py-0.5 text-white font-medium">
                      {activeCamera.specs.dynamicRange.split(" ")[0]}
                    </span>
                    <span className="rounded bg-white/10 border border-white/10 px-2 py-0.5 text-zinc-300 font-medium">
                      {activeCamera.specs.mount.split(" ")[0]}
                    </span>
                    <span className="text-red-400 font-medium hidden xs:inline">BENCH CERTIFIED ✓</span>
                  </div>

                  {/* Embedded Mobile Reserve Button */}
                  <button
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
                    className="sm:hidden shrink-0 flex items-center gap-1.5 rounded-lg bg-primary hover:bg-primary/90 px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-lg shadow-red-500/25 transition active:scale-95 cursor-pointer"
                  >
                    <span>Reserve</span>
                    <span className="font-mono text-[10px]">→</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Action Hold Button (Desktop Only) */}
            <div className="hidden sm:block absolute bottom-6 right-6 z-20">
              <button
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
                className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-xl shadow-primary/30 transition hover:opacity-90 cursor-pointer"
              >
                <span>Reserve This Kit</span>
                <span className="font-mono text-xs">→</span>
              </button>
            </div>
          </div>

          {/* Under-Chassis Technical Bench Readout Grid */}
          <div className="grid grid-cols-2 gap-px border-t border-border bg-border font-mono text-xs sm:grid-cols-4">
            <div className="bg-carbon p-4 transition-colors hover:bg-secondary/50">
              <p className="text-muted-foreground">ACTIVE SENSOR</p>
              <p className="mt-1 font-semibold text-foreground">{activeCamera.specs.sensor}</p>
            </div>
            <div className="bg-carbon p-4 transition-colors hover:bg-secondary/50">
              <p className="text-muted-foreground">MAX RESOLUTION</p>
              <p className="mt-1 font-semibold text-foreground">{activeCamera.specs.resolution}</p>
            </div>
            <div className="bg-carbon p-4 transition-colors hover:bg-secondary/50">
              <p className="text-muted-foreground">LATITUDE RANGE</p>
              <p className="mt-1 font-semibold text-foreground">{activeCamera.specs.dynamicRange}</p>
            </div>
            <div className="bg-carbon p-4 transition-colors hover:bg-secondary/50">
              <p className="text-muted-foreground">LENS MOUNT</p>
              <p className="mt-1 font-semibold text-foreground">{activeCamera.specs.mount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

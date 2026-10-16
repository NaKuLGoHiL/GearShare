import { useEffect, useRef, useState } from "react";

export type CinemaLookMode = "kodak-500t" | "anamorphic-cyan" | "silver-noir";

interface CinemaOpticalShaderProps {
  className?: string;
  activeLook?: CinemaLookMode;
  onLookChange?: (look: CinemaLookMode) => void;
  showControls?: boolean;
}

const VERTEX_SHADER = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// Bespoke WebGL Shader: Anamorphic Optical Dispersion & Prismatic Lens Caustics
// Features chromatic aberration, horizontal flare beam, refractive caustics, and cinematic film stock color profiles.
const FRAGMENT_SHADER = `
  precision highp float;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMode; // 0.0: Kodak 500T (Amber/Ruby), 1.0: Anamorphic (Cyan/Prism), 2.0: Silver Noir

  // Hash for subtle film grain texture
  float filmGrain(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    // Aspect-corrected UV centered at origin (-1.0 to 1.0)
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);
    
    // Mouse focus tilt parallax
    vec2 m = (uMouse - 0.5) * 0.4;
    vec2 p = uv - m * 0.3;

    float t = uTime * 0.18;

    // --- 1. Multi-Element Optical Caustics (Refraction through curved cinema glass) ---
    vec2 q = p * 2.2;
    for (int i = 1; i <= 5; i++) {
      float fi = float(i);
      q += vec2(
        0.5 / fi * sin(fi * q.y + t * 0.8 + 0.35 * fi + m.x),
        0.4 / fi * cos(fi * q.x - t * 0.9 + 0.45 * fi + m.y)
      );
    }

    // High-order caustic power for crisp film-light ribbons
    float wave = 0.5 + 0.5 * sin(q.x * 1.5 + q.y * 1.2);
    float causticRibbon = pow(wave, 9.0) * 0.95 + pow(wave, 3.0) * 0.12;

    // --- 2. Anamorphic Horizontal Streak Flare (Iconic 2.39:1 Cinema Lens Artifact) ---
    float streakY = p.y + sin(p.x * 1.2 + t * 0.5) * 0.06;
    float streakCore = exp(-abs(streakY) * 45.0) * (1.0 - smoothstep(0.0, 1.7, abs(p.x)));
    float streakHalo = exp(-abs(streakY) * 7.0) * (1.0 - smoothstep(0.0, 2.0, abs(p.x))) * 0.25;
    float anamorphicStreak = streakCore + streakHalo;

    // --- 3. Floating Aperture Bokeh Highlights ---
    float bokeh = 0.0;
    for (int j = 0; j < 4; j++) {
      float fj = float(j);
      vec2 bPos = vec2(
        sin(t * 0.4 + fj * 1.8) * 0.75,
        cos(t * 0.35 + fj * 2.1) * 0.45
      );
      float dist = length(p - bPos);
      bokeh += smoothstep(0.18, 0.0, dist) * (0.08 + 0.04 * sin(t + fj));
    }

    // Optical Vignette: smooth falloff towards borders for text legibility
    float vignette = smoothstep(1.5, 0.3, length(uv));

    // --- 4. Color Grading Profiles (Cinematic Film Emulsion) ---
    vec3 col = vec3(0.0);

    // Profile 0: Kodak Vision3 500T (Golden 3200K Tungsten & Deep ARRI Ruby)
    vec3 kodakAmber = vec3(0.96, 0.62, 0.15); // Warm tungsten glow
    vec3 arriRuby   = vec3(0.88, 0.12, 0.28); // Saturated cinema red
    vec3 kodakHighlight = vec3(1.0, 0.92, 0.75); // Hot filament
    vec3 colKodak = arriRuby * causticRibbon * vignette 
                  + kodakAmber * pow(wave, 18.0) * 0.4 * vignette
                  + kodakHighlight * anamorphicStreak * 0.85
                  + vec3(0.9, 0.3, 0.1) * bokeh * vignette;

    // Profile 1: Cooke Anamorphic Blue/Cyan (Iconic sci-fi & high-contrast night exterior)
    vec3 cookeCyan   = vec3(0.05, 0.78, 0.92);
    vec3 deepViolet  = vec3(0.55, 0.15, 0.85);
    vec3 cyanFlare   = vec3(0.40, 0.95, 1.0);
    vec3 colAnamorphic = deepViolet * causticRibbon * vignette
                       + cookeCyan * pow(wave, 16.0) * 0.5 * vignette
                       + cyanFlare * anamorphicStreak * 1.1
                       + vec3(0.1, 0.6, 0.9) * bokeh * vignette;

    // Profile 2: Silver Halide Monochrome (Noir 35mm silver retention / ENR process)
    float monoLuma = causticRibbon * 0.65 + anamorphicStreak * 0.9 + bokeh * 0.4;
    vec3 colSilver = vec3(monoLuma * 0.9, monoLuma * 0.94, monoLuma * 1.0) * vignette;

    // Blend between modes based on uMode uniform (0.0, 1.0, 2.0)
    if (uMode < 0.5) {
      col = colKodak;
    } else if (uMode < 1.5) {
      col = colAnamorphic;
    } else {
      col = colSilver;
    }

    // Add ultra-fine 35mm film grain
    float grain = (filmGrain(gl_FragCoord.xy + fract(uTime * 10.0)) - 0.5) * 0.035;
    col += grain;

    // Cinematic deep carbon base (never wash out dark backgrounds)
    col = max(vec3(0.02, 0.02, 0.03), col);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function CinemaOpticalShader({
  className = "",
  activeLook = "kodak-500t",
  onLookChange,
  showControls = true,
}: CinemaOpticalShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentLook, setCurrentLook] = useState<CinemaLookMode>(activeLook);

  // Sync external prop if controlled
  useEffect(() => {
    setCurrentLook(activeLook);
  }, [activeLook]);

  const handleSelectLook = (mode: CinemaLookMode) => {
    setCurrentLook(mode);
    onLookChange?.(mode);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    // Compile Shaders
    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vert = createShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const frag = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vert || !frag) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    // Full-screen quad geometry
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uMouse = gl.getUniformLocation(program, "uMouse");
    const uMode = gl.getUniformLocation(program, "uMode");

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(hover: none)").matches;

    // Crisp high-DPI scaling
    const scale = Math.min(window.devicePixelRatio || 1, 2) * (isMobile ? 0.45 : 0.7);

    const resize = () => {
      if (!canvas) return;
      canvas.width = Math.max(1, Math.floor(canvas.clientWidth * scale));
      canvas.height = Math.max(1, Math.floor(canvas.clientHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Mouse tracking with smooth spring damping
    const targetMouse = { x: 0.5, y: 0.5 };
    const currentMouse = { x: 0.5, y: 0.5 };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        targetMouse.x = (e.clientX - rect.left) / rect.width;
        targetMouse.y = 1.0 - (e.clientY - rect.top) / rect.height;
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    let isVisible = true;
    const io = new IntersectionObserver(([entry]) => {
      isVisible = !!entry?.isIntersecting;
    });
    io.observe(canvas);

    let animationId = 0;
    const startTime = performance.now();

    // Mode numeric map
    const getModeValue = (mode: CinemaLookMode) => {
      switch (mode) {
        case "anamorphic-cyan":
          return 1.0;
        case "silver-noir":
          return 2.0;
        case "kodak-500t":
        default:
          return 0.0;
      }
    };

    let targetModeVal = getModeValue(currentLook);
    let animatedModeVal = targetModeVal;

    const render = (now: number) => {
      targetModeVal = getModeValue(currentLook);
      animatedModeVal += (targetModeVal - animatedModeVal) * 0.08;

      currentMouse.x += (targetMouse.x - currentMouse.x) * 0.05;
      currentMouse.y += (targetMouse.y - currentMouse.y) * 0.05;

      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, prefersReducedMotion ? 12.0 : (now - startTime) / 1000.0);
      gl.uniform2f(uMouse, currentMouse.x, currentMouse.y);
      gl.uniform1f(uMode, animatedModeVal);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      if (isVisible && !document.hidden) {
        render(now);
      }
      animationId = requestAnimationFrame(loop);
    };

    if (prefersReducedMotion) {
      render(startTime);
    } else {
      animationId = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(animationId);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      gl.deleteBuffer(buffer);
    };
  }, [currentLook]);

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      {/* Real-time WebGL Canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full pointer-events-none"
      />

      {/* Cinematic Optical Framing Guidelines (No square grid - strictly 2.39:1 scope markers) */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-6 sm:p-10 opacity-35">
        <div className="flex items-center justify-between font-mono text-[10px] tracking-widest text-white/50">
          <span>┌ 2.39:1 ANAMORPHIC SCOPE</span>
          <span className="hidden sm:inline">PL MOUNT // ±0.01mm FFD</span>
          <span>5600K D55 ┐</span>
        </div>
        <div className="flex items-center justify-between font-mono text-[10px] tracking-widest text-white/50">
          <span>└ LAT: 19.162°N LON: 72.871°E (FILM CITY)</span>
          <span className="hidden sm:inline">180.0° SHUTTER · 24.00 FPS</span>
          <span>T1.3 OPTICAL ┘</span>
        </div>
      </div>

      {/* Interactive Film Stock / LUT Profile Switcher */}
      {showControls && (
        <div className="absolute bottom-5 right-5 sm:bottom-8 sm:right-8 z-20 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 p-1.5 backdrop-blur-xl shadow-2xl">
          <span className="px-2.5 font-mono text-[10px] uppercase tracking-wider text-white/50">
            LUT Look:
          </span>
          <button
            type="button"
            onClick={() => handleSelectLook("kodak-500t")}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-semibold transition-all duration-200 ${
              currentLook === "kodak-500t"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm shadow-amber-500/30"
                : "text-muted-foreground hover:text-white hover:bg-white/5"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span>Kodak 500T</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectLook("anamorphic-cyan")}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-semibold transition-all duration-200 ${
              currentLook === "anamorphic-cyan"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-500/30"
                : "text-muted-foreground hover:text-white hover:bg-white/5"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span>Anamorphic Flare</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectLook("silver-noir")}
            className={`hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-semibold transition-all duration-200 ${
              currentLook === "silver-noir"
                ? "bg-white/20 text-white border border-white/40 shadow-sm"
                : "text-muted-foreground hover:text-white hover:bg-white/5"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-slate-200" />
            <span>Silver Noir</span>
          </button>
        </div>
      )}
    </div>
  );
}

import { useRef, useEffect, useState, type ReactNode, type PointerEvent } from "react";

/**
 * 3D Perspective Tilt with inertial lerp smoothing, anodized-red rim highlight,
 * dynamic glare reflection, and mobile touch fallback.
 */
export function Tilt({
  children,
  max = 8,
  className = "",
  glowColor = "rgba(239, 68, 68, 0.35)",
}: {
  children: ReactNode;
  max?: number;
  className?: string;
  glowColor?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);

  // Inertial tracking state
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const isHovered = useRef(false);

  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch-only devices for graceful 2D fallback
    if (typeof window !== "undefined") {
      const touch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(hover: none)").matches;
      setIsTouchDevice(touch);
    }

    const animate = () => {
      const el = cardRef.current;
      if (el && !isTouchDevice) {
        // Smooth lerp interpolation (0.12 speed)
        currentX.current += (targetX.current - currentX.current) * 0.12;
        currentY.current += (targetY.current - currentY.current) * 0.12;

        const rx = (0.5 - currentY.current) * max;
        const ry = (currentX.current - 0.5) * max;

        el.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
        el.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
        el.style.setProperty("--mx", `${(currentX.current * 100).toFixed(1)}%`);
        el.style.setProperty("--my", `${(currentY.current * 100).toFixed(1)}%`);
      }
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [max, isTouchDevice]);

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    targetX.current = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    targetY.current = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    isHovered.current = true;
    el.dataset["active"] = "true";
  };

  const handlePointerLeave = () => {
    targetX.current = 0.5;
    targetY.current = 0.5;
    isHovered.current = false;
    const el = cardRef.current;
    if (el) el.dataset["active"] = "false";
  };

  return (
    <div ref={containerRef} className="tilt-stage">
      <div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={`tilt ${className}`}
        style={{ "--glow-color": glowColor } as React.CSSProperties}
      >
        {children}
        <span aria-hidden className="tilt-glare" />
        <span aria-hidden className="tilt-rim" />
      </div>
    </div>
  );
}

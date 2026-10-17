import { useEffect } from "react";
import {
  X,
  Camera,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Box,
  Aperture,
  SlidersHorizontal,
  Clock,
  Layers,
} from "lucide-react";
import type { Gear } from "./ReserveModal";

export type DetailedGear = {
  name: string;
  category: string;
  rate: number;
  img?: string | undefined;
  specs: string[];
  mount?: string | undefined;
  highlight?: string | undefined;
  sensor?: string | undefined;
  fps?: string | undefined;
  dynamicRange?: string | undefined;
  packageIncludes?: string | undefined;
  hub?: string | undefined;
  inStockCount?: number | undefined;
};

export function QuickSpecsModal({
  gear,
  onClose,
  onReserve,
}: {
  gear: DetailedGear | null;
  onClose: () => void;
  onReserve: (gear: Gear) => void;
}) {
  useEffect(() => {
    if (!gear) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [gear, onClose]);

  if (!gear) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center p-3 sm:p-6 text-center">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Detailed specifications for ${gear.name}`}
          className="relative my-4 flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0e0d1a]/95 text-left shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Ambient Glow */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#ff2a8d] to-transparent opacity-80" />

          {/* Modal Header */}
          <div className="flex-none flex items-start justify-between gap-3 sm:gap-4 border-b border-white/10 bg-[#0e0d1a]/95 px-4 pt-4 pb-3 sm:px-8 sm:pt-6 sm:pb-4 z-10 backdrop-blur-md">
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#141324] text-[#ff2a8d]">
                <Camera className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="tally h-2 w-2 rounded-full" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#ff4b82] font-bold">
                    {gear.category}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-0.5 font-mono text-[9px] text-zinc-300 font-medium">
                    {gear.hub ?? "MUMBAI DISPATCH DEPOT"}
                  </span>
                </div>
                <h3 className="text-base sm:text-xl font-bold tracking-tight text-white truncate">
                  {gear.name}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-zinc-300 transition hover:border-[#ff2a8d] hover:bg-white/10 hover:text-white active:scale-95 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Modal Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-8 sm:py-5 space-y-5 sm:space-y-6 custom-scrollbar overscroll-contain pb-safe">
            {/* Gear Hero Banner */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#141324] shadow-md">
              {gear.img ? (
                <img
                  src={gear.img}
                  alt={gear.name}
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#141324] text-zinc-500 font-mono text-sm">
                  Cinema Hardware Preview
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex items-end justify-between font-mono">
                <div>
                  <span className="rounded-md bg-gradient-to-r from-[#ff2a8d] to-[#7c3aed] px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-white shadow-md">
                    {gear.highlight ?? "BENCH READY"}
                  </span>
                  <p className="mt-1 sm:mt-1.5 text-[11px] sm:text-xs text-zinc-300">
                    Mount: <strong className="text-white">{gear.mount ?? "Standard Cinema"}</strong>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">Daily Base</span>
                  <p className="text-lg sm:text-2xl font-bold text-white">₹{gear.rate.toLocaleString("en-IN")}<span className="text-xs font-normal text-zinc-400">/day</span></p>
                </div>
              </div>
            </div>

            {/* Technical Specifications Grid */}
            <div>
              <h4 className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-zinc-300 font-semibold mb-3">
                <SlidersHorizontal className="h-3.5 w-3.5 text-[#ff2a8d]" />
                <span>Bench Optical & Sensor Specifications</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
                {gear.sensor && (
                  <div className="rounded-xl border border-white/10 bg-[#141324] p-3">
                    <span className="text-[10px] text-zinc-500 uppercase">Sensor Architecture</span>
                    <p className="font-semibold text-white mt-0.5">{gear.sensor}</p>
                  </div>
                )}
                {gear.mount && (
                  <div className="rounded-xl border border-white/10 bg-[#141324] p-3">
                    <span className="text-[10px] text-zinc-500 uppercase">Flange Mount</span>
                    <p className="font-semibold text-white mt-0.5">{gear.mount} (±0.01mm Collimated)</p>
                  </div>
                )}
                {gear.fps && (
                  <div className="rounded-xl border border-white/10 bg-[#141324] p-3">
                    <span className="text-[10px] text-zinc-500 uppercase">Frame Rates & Codecs</span>
                    <p className="font-semibold text-white mt-0.5">{gear.fps}</p>
                  </div>
                )}
                {gear.specs && (
                  <div className="rounded-xl border border-white/10 bg-[#141324] p-3">
                    <span className="text-[10px] text-zinc-500 uppercase">Key Features</span>
                    <p className="font-semibold text-white mt-0.5">{gear.specs.join(" · ")}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Turnkey Package Manifest */}
            {gear.packageIncludes && (
              <div className="rounded-2xl border border-white/10 bg-[#141324] p-4">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-zinc-300 font-semibold mb-2">
                  <Box className="h-3.5 w-3.5 text-[#ff2a8d]" />
                  <span>Flight-Case Package Manifest</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed font-mono">
                  {gear.packageIncludes}
                </p>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-emerald-400 font-mono font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  <span>QC Inspected & 100% Battery Charge Prior to Stage Delivery</span>
                </div>
              </div>
            )}

            {/* Protection & Logistics Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-300">
              <div className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-[#141324] p-3">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[#ff2a8d] mt-0.5" />
                <div>
                  <p className="font-semibold text-white">₹0 Security Deposit</p>
                  <p className="text-[11px] text-zinc-500">WICA / GSTIN / DGA crew auto-waiver applied.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-[#141324] p-3">
                <Clock className="h-4 w-4 shrink-0 text-[#ff2a8d] mt-0.5" />
                <div>
                  <p className="font-semibold text-white">&lt; 3H Stage Dispatch</p>
                  <p className="text-[11px] text-zinc-500">Immediate express van delivery to Film City & sets.</p>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="framer-pill-secondary w-full sm:w-auto px-6 py-3 font-mono text-xs cursor-pointer"
              >
                Close Specs
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onReserve({
                    name: gear.name,
                    category: gear.category,
                    rate: gear.rate,
                    img: gear.img,
                    specs: gear.specs,
                  });
                }}
                className="framer-pill-primary w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold cursor-pointer"
              >
                <span>Reserve {gear.name}</span>
                <span className="font-mono text-xs">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

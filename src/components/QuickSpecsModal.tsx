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
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center p-3 sm:p-6 text-center">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Detailed specifications for ${gear.name}`}
          className="relative my-4 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d12] text-left shadow-[0_0_60px_-15px_rgba(239,68,68,0.35)] backdrop-blur-2xl ring-1 ring-white/5 animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Ambient Glow */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />

          {/* Modal Header */}
          <div className="flex-none flex items-start justify-between gap-4 border-b border-border/70 bg-[#0d0d12]/95 px-6 pt-5 pb-4 sm:px-8 sm:pt-6 z-10 backdrop-blur-md">
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-carbon text-primary">
                <Camera className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="tally h-2 w-2 rounded-full" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
                    {gear.category}
                  </span>
                  <span className="rounded-full border border-border/80 bg-background/60 px-2 py-0.5 font-mono text-[9px] text-muted-foreground">
                    {gear.hub ?? "MUMBAI DISPATCH DEPOT"}
                  </span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-foreground truncate">
                  {gear.name}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/80 bg-white/5 text-muted-foreground transition hover:border-primary/50 hover:bg-white/10 hover:text-foreground active:scale-95 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Modal Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8 space-y-6 custom-scrollbar">
            {/* Gear Hero Banner */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-lg">
              {gear.img ? (
                <img
                  src={gear.img}
                  alt={gear.name}
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-carbon text-muted-foreground font-mono text-sm">
                  Cinema Hardware Preview
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between font-mono">
                <div>
                  <span className="rounded-md bg-primary/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                    {gear.highlight ?? "BENCH READY"}
                  </span>
                  <p className="mt-1.5 text-xs text-white/80">
                    Mount: <strong className="text-white">{gear.mount ?? "Standard Cinema"}</strong>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Daily Base</span>
                  <p className="text-2xl font-bold text-white">₹{gear.rate.toLocaleString("en-IN")}<span className="text-xs font-normal text-white/70">/day</span></p>
                </div>
              </div>
            </div>

            {/* Technical Specifications Grid */}
            <div>
              <h4 className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
                <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
                <span>Bench Optical & Sensor Specifications</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
                {gear.sensor && (
                  <div className="rounded-xl border border-border/70 bg-carbon/50 p-3">
                    <span className="text-[10px] text-muted-foreground uppercase">Sensor Architecture</span>
                    <p className="font-semibold text-foreground mt-0.5">{gear.sensor}</p>
                  </div>
                )}
                {gear.mount && (
                  <div className="rounded-xl border border-border/70 bg-carbon/50 p-3">
                    <span className="text-[10px] text-muted-foreground uppercase">Flange Mount</span>
                    <p className="font-semibold text-foreground mt-0.5">{gear.mount} (±0.01mm Collimated)</p>
                  </div>
                )}
                {gear.fps && (
                  <div className="rounded-xl border border-border/70 bg-carbon/50 p-3">
                    <span className="text-[10px] text-muted-foreground uppercase">Frame Rates & Codecs</span>
                    <p className="font-semibold text-foreground mt-0.5">{gear.fps}</p>
                  </div>
                )}
                {gear.specs && (
                  <div className="rounded-xl border border-border/70 bg-carbon/50 p-3">
                    <span className="text-[10px] text-muted-foreground uppercase">Key Features</span>
                    <p className="font-semibold text-foreground mt-0.5">{gear.specs.join(" · ")}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Turnkey Package Manifest */}
            {gear.packageIncludes && (
              <div className="rounded-2xl border border-white/10 bg-carbon/40 p-4">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  <Box className="h-3.5 w-3.5 text-primary" />
                  <span>Flight-Case Package Manifest</span>
                </div>
                <p className="text-xs text-foreground/90 leading-relaxed font-mono">
                  {gear.packageIncludes}
                </p>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <span>QC Inspected & 100% Battery Charge Prior to Stage Delivery</span>
                </div>
              </div>
            )}

            {/* Protection & Logistics Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
              <div className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-carbon/30 p-3">
                <ShieldCheck className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">₹0 Security Deposit</p>
                  <p className="text-[11px] text-muted-foreground">WICA / GSTIN / DGA crew auto-waiver applied.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-carbon/30 p-3">
                <Clock className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">&lt; 3H Stage Dispatch</p>
                  <p className="text-[11px] text-muted-foreground">Immediate express van delivery to Film City & sets.</p>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 border-t border-border/60">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-border/80 bg-white/5 font-mono text-xs text-muted-foreground transition hover:bg-white/10 hover:text-foreground cursor-pointer"
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
                className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/30 transition-all hover:opacity-95 active:scale-95 cursor-pointer"
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

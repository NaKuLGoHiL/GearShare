import { useEffect, useState, type FormEvent } from "react";
import {
  inquirySchema,
  rentalTotal,
  calculateDaysBetween,
  DURATIONS,
} from "@/lib/inquiry";
import {
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Calendar,
  ShieldCheck,
  Clock,
  Sparkles,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Lock,
  Truck,
  FileCheck2,
} from "lucide-react";

export type Gear = {
  name: string;
  category: string;
  rate: number;
  img?: string | undefined;
  specs?: string[] | undefined;
};

type ConfirmationData = {
  reference: string;
  gear_name: string;
  category: string;
  daily_rate: number;
  start_date: string;
  end_date: string;
  customer_name: string;
  customer_email: string;
  total_estimate: number;
  days: number;
};

const inputBase =
  "w-full rounded-xl border border-border/70 bg-carbon/60 pl-10 pr-3.5 py-3 text-sm text-foreground outline-none transition duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:bg-carbon focus:ring-1 focus:ring-primary/40";
const inputError = "!border-destructive !focus:border-destructive !focus:ring-destructive";

// Date formatting and manipulation utilities
function formatYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseYMD(s: string): Date {
  const parts = s.split("-").map(Number);
  const y = parts[0] ?? 2026;
  const m = parts[1] ?? 10;
  const d = parts[2] ?? 1;
  return new Date(y, m - 1, d);
}

function formatPrettyDate(s: string): string {
  if (!s) return "Not selected";
  const parts = s.split("-").map(Number);
  const y = parts[0] ?? 2026;
  const m = parts[1] ?? 10;
  const d = parts[2] ?? 1;
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Deterministic hardware availability simulator for Mumbai production houses.
 * Realistically marks ~15% of future days as booked on active studio stages
 * (e.g. Film City, Yash Raj Studios, Mehboob Studios) while ensuring immediate upcoming days are open.
 */
function isDateBooked(gearName: string, dateStr: string): boolean {
  const dateObj = new Date(dateStr + "T00:00:00");
  const todayObj = new Date();
  todayObj.setHours(0, 0, 0, 0);
  const diffDays = Math.round((dateObj.getTime() - todayObj.getTime()) / (1000 * 60 * 60 * 24));
  // Keep first 4 days always available for immediate holds
  if (diffDays <= 4) return false;

  let hash = 0;
  for (let i = 0; i < gearName.length; i++) {
    hash = (hash * 31 + gearName.charCodeAt(i)) >>> 0;
  }
  const dayOfMonth = dateObj.getDate();
  return (dayOfMonth + hash) % 5 === 0;
}

export function ReserveModal({
  gear,
  onClose,
  initialDurationDays = 1,
}: {
  gear: Gear | null;
  onClose: () => void;
  initialDurationDays?: number;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<ConfirmationData | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Time reference in local timezone
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const returnDef = new Date(
    tomorrow.getTime() + Math.max(0, (initialDurationDays || 1) - 1) * 24 * 60 * 60 * 1000
  );

  const [startDate, setStartDate] = useState(formatYMD(tomorrow));
  const [returnDate, setReturnDate] = useState(formatYMD(returnDef));

  // Seat Matrix Calendar Navigation state
  const [viewYear, setViewYear] = useState(tomorrow.getFullYear());
  const [viewMonth, setViewMonth] = useState(tomorrow.getMonth());
  const [pickingTarget, setPickingTarget] = useState<"start" | "end">("start");
  const [stageNotice, setStageNotice] = useState<string | null>(null);
  const [liveBlockedDates, setLiveBlockedDates] = useState<Set<string>>(new Set());

  // Fetch real-time live slot blocks from /api/availability
  useEffect(() => {
    if (!gear) return;
    let isMounted = true;
    const fetchLiveAvailability = async () => {
      try {
        const res = await fetch(
          `/api/availability?gear_name=${encodeURIComponent(gear.name)}&year=${viewYear}&month=${viewMonth + 1}`
        );
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.ok && Array.isArray(json.blocked_dates)) {
            setLiveBlockedDates(new Set(json.blocked_dates));
          }
        }
      } catch {
        // Fall back gracefully to local deterministic schedule
      }
    };
    fetchLiveAvailability();
    return () => {
      isMounted = false;
    };
  }, [gear, viewYear, viewMonth]);

  useEffect(() => {
    setErrors({});
    setConfirmation(null);
    setServerError(null);
    setCopied(false);
    setStageNotice(null);

    if (!gear) return;

    // Lock background page scroll while modal is active
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

  const rentalDays = calculateDaysBetween(startDate, returnDate);
  const matchingDuration =
    DURATIONS.find((d) => d.days === rentalDays) ||
    (rentalDays >= 7
      ? DURATIONS[2]
      : rentalDays >= 3
      ? DURATIONS[1]
      : DURATIONS[0]);

  const discount = matchingDuration?.discount ?? 0;
  const estimatedTotal = rentalTotal(gear.rate, rentalDays, discount);
  const standardTotal = gear.rate * rentalDays;
  const savings = Math.max(0, standardTotal - estimatedTotal);

  const applyPresetDuration = (days: number) => {
    const start = parseYMD(startDate);
    if (isNaN(start.getTime())) return;
    const end = new Date(start.getTime() + Math.max(0, days - 1) * 24 * 60 * 60 * 1000);
    setReturnDate(formatYMD(end));
    setPickingTarget("start");
  };

  const handleResetDates = () => {
    const t = new Date(Date.now() + 86400000);
    const r = new Date(t.getTime() + Math.max(0, (initialDurationDays || 1) - 1) * 86400000);
    setStartDate(formatYMD(t));
    setReturnDate(formatYMD(r));
    setViewYear(t.getFullYear());
    setViewMonth(t.getMonth());
    setPickingTarget("start");
    setStageNotice(null);
  };

  // Calendar month navigation
  const canGoPrev =
    viewYear > now.getFullYear() || (viewYear === now.getFullYear() && viewMonth > now.getMonth());

  const handlePrevMonth = () => {
    if (!canGoPrev) return;
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Click on date box (seat-selection behavior)
  const handleTileClick = (clickedDate: string, isBooked: boolean, isPast: boolean) => {
    if (isPast) return;

    if (isBooked) {
      setStageNotice(
        `Stage Hold: This unit is reserved for a Mumbai production on ${formatPrettyDate(clickedDate)}. Please select an available green slot.`
      );
      setTimeout(() => setStageNotice(null), 4000);
      return;
    }

    setStageNotice(null);

    if (pickingTarget === "start") {
      setStartDate(clickedDate);
      // If previous return date was before this new start date, push return date forward
      if (returnDate < clickedDate) {
        setReturnDate(clickedDate);
      }
      // Auto-toggle to selecting the wrap/return date
      setPickingTarget("end");
    } else {
      // User is picking the wrap date
      if (clickedDate < startDate) {
        // If clicked prior to start date, make this the start date instead
        setStartDate(clickedDate);
        setPickingTarget("end");
      } else {
        setReturnDate(clickedDate);
        // Switch back to start so next click starts a fresh window
        setPickingTarget("start");
      }
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const dayHeaders = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const totalDaysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const todayStr = formatYMD(now);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!gear) return;

    const fd = new FormData(e.currentTarget);
    const payload = {
      gear_name: gear.name,
      gear: gear.name,
      category: gear.category,
      daily_rate: gear.rate,
      dailyRate: gear.rate,
      customer_name: String(fd.get("customer_name") ?? "").trim(),
      name: String(fd.get("customer_name") ?? "").trim(),
      customer_email: String(fd.get("customer_email") ?? "").trim(),
      email: String(fd.get("customer_email") ?? "").trim(),
      customer_phone: String(fd.get("customer_phone") ?? "").trim(),
      phone: String(fd.get("customer_phone") ?? "").trim(),
      start_date: startDate,
      startDate: startDate,
      end_date: returnDate,
      returnDate: returnDate,
      notes: String(fd.get("notes") ?? "").trim(),
      wica_card: String(fd.get("wica_card") ?? "").trim(),
      gstin: String(fd.get("gstin") ?? "").trim(),
    };

    // 1. Dual Client-side validation via Zod
    const parsed = inquirySchema.safeParse(payload);
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      const formatted: Record<string, string> = {};
      for (const [key, msgs] of Object.entries(fe)) {
        if (msgs?.[0]) formatted[key] = msgs[0];
      }
      setErrors(formatted);
      return;
    }

    setErrors({});
    setServerError(null);
    setLoading(true);

    try {
      // 2. Server API Request
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? "Failed to reserve equipment with dispatch desk");
      }

      setConfirmation({
        reference: json.reference,
        gear_name: gear.name,
        category: gear.category,
        daily_rate: gear.rate,
        start_date: startDate,
        end_date: returnDate,
        customer_name: payload.customer_name,
        customer_email: payload.customer_email,
        total_estimate: estimatedTotal,
        days: rentalDays,
      });
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : "An unexpected network error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const copyReference = () => {
    if (confirmation?.reference) {
      navigator.clipboard.writeText(confirmation.reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const FieldError = ({ field }: { field: string }) => {
    const msg = errors[field] || errors[field.replace(/_([a-z])/g, (_, c) => c.toUpperCase())];
    if (!msg) return null;
    return (
      <p className="mt-1.5 flex items-center gap-1 font-mono text-xs text-destructive">
        <AlertCircle className="h-3 w-3 shrink-0" />
        <span>{msg}</span>
      </p>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center p-3 sm:p-6 text-center">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Rental inquiry for ${gear.name}`}
          className="relative my-4 flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 bg-white text-left shadow-2xl backdrop-blur-2xl ring-1 ring-slate-900/5 animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Ambient Top Glow Line */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />

          {/* PINNED MODAL HEADER (Always Visible & Accessible) */}
          <div className="flex-none flex items-start justify-between gap-3 sm:gap-4 border-b border-slate-200 bg-white/95 px-4 pt-4 pb-3 sm:px-8 sm:pt-6 sm:pb-4 z-10 backdrop-blur-md">
            <div className="flex items-center gap-3.5 min-w-0">
              {gear.img ? (
                <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-md">
                  <img
                    src={gear.img}
                    alt={gear.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-primary">
                  <Camera className="h-6 w-6" />
                </div>
              )}

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="tally h-2 w-2 rounded-full" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary font-bold">
                    {gear.category}
                  </span>
                  <span className="hidden sm:inline-block rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-[9px] text-slate-600 font-medium">
                    MUMBAI DISPATCH
                  </span>
                </div>
                <h3 className="mt-0.5 text-base sm:text-xl font-bold tracking-tight text-slate-900 truncate">
                  {gear.name}
                </h3>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 font-mono text-xs">
                  <span className="text-slate-500">
                    Base: <strong className="text-slate-900">₹{gear.rate.toLocaleString("en-IN")}</strong>/day
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-emerald-700 font-semibold">Stage Ready</span>
                </div>
              </div>
            </div>

            {/* Highly Visible Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              title="Close (Esc)"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-600 transition hover:border-primary/50 hover:bg-slate-200 hover:text-slate-900 active:scale-95 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* SCROLLABLE MODAL BODY */}
          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-8 sm:py-5 space-y-5 custom-scrollbar overscroll-contain pb-safe">
            {/* STATE 1: ANIMATED CONFIRMATION CARD */}
            {confirmation ? (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="rounded-2xl border border-primary/40 bg-gradient-to-b from-primary/15 to-carbon/60 p-6 text-center shadow-lg">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 text-primary ring-4 ring-primary/10">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h4 className="mt-4 text-xl font-bold tracking-tight text-foreground">
                    Inquiry Logged & Confirmed
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Your rental hold has been persisted in Supabase and assigned to the Mumbai dispatch desk.
                  </p>

                  {/* Reference badge with copy button */}
                  <div className="mt-5 flex items-center justify-center">
                    <div className="inline-flex items-center gap-3 rounded-xl border border-primary/50 bg-background/90 px-5 py-2.5 font-mono text-sm shadow-inner">
                      <span className="text-xs tracking-widest text-muted-foreground">REFERENCE:</span>
                      <span className="font-bold tracking-wider text-primary text-base">
                        {confirmation.reference}
                      </span>
                      <button
                        type="button"
                        onClick={copyReference}
                        title="Copy reference code"
                        className="ml-1 inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1 text-xs font-normal text-muted-foreground transition hover:bg-white/10 hover:text-foreground active:scale-95"
                      >
                        {copied ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
                        <span>{copied ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Confirmation details summary */}
                <div className="space-y-3 rounded-2xl border border-border/70 bg-carbon/50 p-5 font-mono text-xs">
                  <div className="flex justify-between border-b border-border/60 pb-2.5">
                    <span className="text-muted-foreground">RESERVED HARDWARE</span>
                    <span className="font-semibold text-foreground">{confirmation.gear_name}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/60 pb-2.5">
                    <span className="text-muted-foreground">SHOOT WINDOW</span>
                    <span className="text-foreground">
                      {confirmation.start_date} → {confirmation.end_date} ({confirmation.days} {confirmation.days === 1 ? "Day" : "Days"})
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/60 pb-2.5">
                    <span className="text-muted-foreground">ESTIMATED TOTAL</span>
                    <span className="font-bold text-primary text-sm">
                      ₹{confirmation.total_estimate.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/60 pb-2.5">
                    <span className="text-muted-foreground">PRODUCER / CREW</span>
                    <span className="text-foreground">{confirmation.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CONTACT EMAIL</span>
                    <span className="text-foreground">{confirmation.customer_email}</span>
                  </div>
                </div>

                {/* SLA notice */}
                <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-carbon/40 p-4 text-xs text-muted-foreground">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p className="leading-relaxed">
                    Our Mumbai (Film City & Andheri West) dispatch desk operates 24/7. A senior gear supervisor will verify your GSTIN/production paperwork and email flight case prep confirmation within 60 minutes.
                  </p>
                </div>

                <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto rounded-full border border-border/80 bg-white/5 px-6 py-3 font-mono text-xs text-muted-foreground transition hover:bg-white/10 hover:text-foreground cursor-pointer"
                  >
                    Close & Return to Catalog
                  </button>
                  <a
                    href={`/track?ref=${encodeURIComponent(confirmation.reference)}`}
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:opacity-95 hover:shadow-primary/40 active:scale-95 cursor-pointer"
                  >
                    <Truck className="h-4 w-4" />
                    <span>Track Soundstage Dispatch →</span>
                  </a>
                </div>
              </div>
            ) : (
              /* STATE 2: ENHANCED RENTAL INQUIRY FORM */
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* DURATION QUICK-SELECTOR CHIPS */}
                <div className="rounded-2xl border border-border/60 bg-carbon/50 p-4">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      <span>Rental Shoot Duration</span>
                    </span>
                    <span className="font-mono text-[11px] text-primary font-medium">
                      {discount > 0 ? `${discount * 100}% Volume Discount Active` : "Standard Tier"}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {DURATIONS.map((d) => {
                      const isActive = rentalDays === d.days;
                      return (
                        <button
                          type="button"
                          key={d.days}
                          onClick={() => applyPresetDuration(d.days)}
                          className={`flex flex-col items-center justify-center rounded-xl border py-2.5 px-3 font-mono text-xs transition-all duration-200 cursor-pointer ${
                            isActive
                              ? "border-primary bg-primary/15 text-foreground shadow-sm shadow-primary/30 ring-1 ring-primary/40 font-semibold"
                              : "border-border/60 bg-background/40 text-muted-foreground hover:border-border hover:bg-white/5 hover:text-foreground"
                          }`}
                        >
                          <span className="font-medium">{d.label}</span>
                          {d.discount > 0 ? (
                            <span className="text-[10px] text-primary mt-0.5">(-{d.discount * 100}%)</span>
                          ) : (
                            <span className="text-[10px] text-muted-foreground/80 mt-0.5">Standard</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* LIVE PRICING TELEMETRY CARD */}
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono shadow-sm">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                        ESTIMATED TOTAL
                      </span>
                      {savings > 0 && (
                        <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                          Save ₹{savings.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                        ₹{estimatedTotal.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-slate-500">
                        ({rentalDays} {rentalDays === 1 ? "Day" : "Days"} @ ₹{gear.rate.toLocaleString("en-IN")}/day)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-emerald-800">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                    <div className="text-left font-sans">
                      <p className="font-semibold text-xs leading-tight">₹0 Deposit</p>
                      <p className="text-[10px] opacity-80 leading-tight">GSTIN / WICA Waiver</p>
                    </div>
                  </div>
                </div>

                {/* FORM FIELDS */}
                <div className="space-y-4">
                  {/* Customer Name */}
                  <div>
                    <label className="mb-1.5 block font-mono text-xs text-muted-foreground">
                      Director / DP / Producer Full Name *
                    </label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                      <input
                        name="customer_name"
                        placeholder="e.g. Santosh Sivan, ISC / Ravi K. Chandran"
                        className={`${inputBase} ${errors["customer_name"] || errors["name"] ? inputError : ""}`}
                      />
                    </div>
                    <FieldError field="customer_name" />
                  </div>

                  {/* Email & Phone */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block font-mono text-xs text-muted-foreground">
                        Work / Production Email *
                      </label>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                        <input
                          name="customer_email"
                          type="email"
                          placeholder="dp@mumbaicinema.in"
                          className={`${inputBase} ${errors["customer_email"] || errors["email"] ? inputError : ""}`}
                        />
                      </div>
                      <FieldError field="customer_email" />
                    </div>

                    <div>
                      <label className="mb-1.5 block font-mono text-xs text-muted-foreground">
                        Mobile / On-Set Contact *
                      </label>
                      <div className="relative">
                        <Phone className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                        <input
                          name="customer_phone"
                          type="tel"
                          placeholder="+91 98200 12345"
                          className={`${inputBase} ${errors["customer_phone"] || errors["phone"] ? inputError : ""}`}
                        />
                      </div>
                      <FieldError field="customer_phone" />
                    </div>
                  </div>

                  {/* WICA Union Card # & GSTIN for Instant Zero-Deposit Waiver */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block font-mono text-xs text-muted-foreground">
                          WICA / SICA Union Card # (Optional)
                        </label>
                        <span className="font-mono text-[10px] text-emerald-400 font-medium">₹0 Deposit Waiver</span>
                      </div>
                      <div className="relative">
                        <ShieldCheck className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-emerald-400" />
                        <input
                          name="wica_card"
                          placeholder="e.g. WICA-MUM-2024-884"
                          className={inputBase}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block font-mono text-xs text-muted-foreground">
                          Production GSTIN (Optional)
                        </label>
                        <span className="font-mono text-[10px] text-muted-foreground">Input Tax Credit</span>
                      </div>
                      <div className="relative">
                        <FileCheck2 className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                        <input
                          name="gstin"
                          placeholder="e.g. 27AABCG1234F1Z5"
                          className={inputBase}
                        />
                      </div>
                    </div>
                  </div>

                  {/* CINEMA SEAT-BOOKING STYLE DATE SELECTION MATRIX */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
                    {/* HIDDEN INPUTS TO PRESERVE 100% FORM & API COMPATIBILITY */}
                    <input type="hidden" name="start_date" value={startDate} />
                    <input type="hidden" name="end_date" value={returnDate} />

                    {/* Header with Month Switcher and Live Dispatch Pill */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <h4 className="font-mono text-xs uppercase tracking-widest font-semibold text-foreground">
                            Stage Shoot Schedule Matrix
                          </h4>
                        </div>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          Click available date boxes to set shoot call time & return date
                        </p>
                      </div>

                      {/* Month Navigation & Reset */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handlePrevMonth}
                          disabled={!canGoPrev}
                          title="Previous Month"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 bg-background/60 text-foreground transition hover:border-primary/60 hover:bg-white/5 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>

                        <span className="min-w-[125px] text-center font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                          {monthNames[viewMonth]} {viewYear}
                        </span>

                        <button
                          type="button"
                          onClick={handleNextMonth}
                          title="Next Month"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 bg-background/60 text-foreground transition hover:border-primary/60 hover:bg-white/5 active:scale-95 cursor-pointer"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={handleResetDates}
                          title="Reset to Next Day"
                          className="flex h-8 items-center gap-1.5 rounded-lg border border-border/70 bg-background/60 px-2 font-mono text-[11px] text-muted-foreground transition hover:border-primary/60 hover:bg-white/5 hover:text-foreground active:scale-95 cursor-pointer"
                        >
                          <RotateCcw className="h-3 w-3" />
                          <span className="hidden sm:inline">Reset</span>
                        </button>
                      </div>
                    </div>

                    {/* Cinema Stage "SCREEN / FRONT STAGE" Curved Graphic (Movie booking hallmark) */}
                    <div className="my-3 text-center">
                      <div className="mx-auto flex max-w-[280px] sm:max-w-xs items-center justify-center gap-2">
                        <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-primary/40 rounded-full" />
                        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-primary/80">
                          Mumbai Stage & Prep Bay
                        </span>
                        <div className="h-0.5 flex-1 bg-gradient-to-l from-transparent to-primary/40 rounded-full" />
                      </div>
                    </div>

                    {/* Movie Ticket Booking Seat Legend */}
                    <div className="mb-3.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 font-mono text-[10px]">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <span className="h-3 w-3 rounded-md border border-emerald-500/40 bg-emerald-100 flex items-center justify-center">
                          <span className="h-1 w-1 rounded-full bg-emerald-600" />
                        </span>
                        <span>Available</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
                        <span className="h-3 w-3 rounded-md bg-primary text-white flex items-center justify-center text-[7px] font-bold shadow-sm shadow-primary/50">
                          ★
                        </span>
                        <span>Selected Window</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <span className="h-3 w-3 rounded-md border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-400 text-[8px] line-through">
                          ✕
                        </span>
                        <span>Booked On Stage</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <span className="h-3 w-3 rounded-md bg-transparent border border-slate-200" />
                        <span>Past Date</span>
                      </div>
                    </div>

                    {/* Day Headers (SUN ... SAT) */}
                    <div className="grid grid-cols-7 gap-1 sm:gap-1.5 mb-1.5 text-center font-mono text-[10px] sm:text-xs font-semibold text-muted-foreground/70">
                      {dayHeaders.map((dh) => (
                        <div key={dh} className="py-1">
                          {dh}
                        </div>
                      ))}
                    </div>

                    {/* Interactive Date Boxes Grid (Seat Booking Matrix) */}
                    <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                      {/* Empty Leading Tiles for previous month offset */}
                      {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                        <div
                          key={`empty-${i}`}
                          className="aspect-square sm:aspect-auto sm:h-12 rounded-xl border border-transparent bg-transparent opacity-20 pointer-events-none"
                        />
                      ))}

                      {/* Day Tiles */}
                      {Array.from({ length: totalDaysInMonth }).map((_, idx) => {
                        const dayNum = idx + 1;
                        const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                        const isPast = dateStr < todayStr;
                        const isBooked = !isPast && (liveBlockedDates.has(dateStr) || isDateBooked(gear.name, dateStr));
                        const isStart = dateStr === startDate;
                        const isEnd = dateStr === returnDate;
                        const isInRange = Boolean(startDate && returnDate && dateStr > startDate && dateStr < returnDate);
                        const isSingleDay = isStart && isEnd;

                        let tileStyle =
                          "border-slate-200 bg-white text-slate-900 hover:border-primary hover:bg-red-50/50 hover:shadow-sm hover:scale-105 active:scale-95 cursor-pointer";
                        let badgeLabel = "";

                        if (isPast) {
                          tileStyle = "border-transparent bg-transparent text-slate-300 cursor-not-allowed select-none";
                        } else if (isBooked) {
                          tileStyle =
                            "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed select-none line-through relative";
                          badgeLabel = "BUSY";
                        } else if (isSingleDay) {
                          tileStyle =
                            "border-primary bg-primary text-white font-bold shadow-md ring-2 ring-primary ring-offset-2 ring-offset-white scale-[1.04] z-10 cursor-pointer";
                          badgeLabel = "1 DAY";
                        } else if (isStart) {
                          tileStyle =
                            "border-primary bg-primary text-white font-bold shadow-md ring-2 ring-primary ring-offset-2 ring-offset-white scale-[1.04] z-10 cursor-pointer rounded-l-xl";
                          badgeLabel = "CALL";
                        } else if (isEnd) {
                          tileStyle =
                            "border-primary bg-primary text-white font-bold shadow-md ring-2 ring-primary ring-offset-2 ring-offset-white scale-[1.04] z-10 cursor-pointer rounded-r-xl";
                          badgeLabel = "WRAP";
                        } else if (isInRange) {
                          tileStyle =
                            "border-y border-red-300 bg-red-50 text-red-950 font-semibold cursor-pointer hover:bg-red-100";
                        }

                        return (
                          <button
                            key={dateStr}
                            type="button"
                            onClick={() => handleTileClick(dateStr, isBooked, isPast)}
                            disabled={isPast}
                            title={
                              isPast
                                ? "Past date"
                                : isBooked
                                ? `${formatPrettyDate(dateStr)}: Reserved on Stage`
                                : `${formatPrettyDate(dateStr)}: Stage Ready - Click to select`
                            }
                            className={`relative aspect-square sm:aspect-auto sm:h-12 rounded-xl flex flex-col items-center justify-center p-1 font-mono transition-all duration-150 select-none ${tileStyle}`}
                          >
                            {/* Green availability indicator pip for open dates */}
                            {!isPast && !isBooked && !isStart && !isEnd && !isInRange && (
                              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-emerald-400/80 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                            )}

                            {/* Booked lock indicator */}
                            {isBooked && (
                              <Lock className="absolute top-1 right-1 h-2.5 w-2.5 text-muted-foreground/30" />
                            )}

                            {/* Day Number */}
                            <span className="text-xs sm:text-sm font-bold leading-none">
                              {dayNum}
                            </span>

                            {/* Micro status badge inside seat tile */}
                            {badgeLabel ? (
                              <span
                                className={`mt-0.5 text-[8px] sm:text-[9px] uppercase tracking-tighter font-mono font-semibold ${
                                  isStart || isEnd || isSingleDay ? "text-white" : "text-muted-foreground/40"
                                }`}
                              >
                                {badgeLabel}
                              </span>
                            ) : isInRange ? (
                              <span className="mt-0.5 text-[8px] uppercase tracking-tighter text-primary-foreground/80 font-mono">
                                SHOOT
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Stage Notice alert when user taps a booked unit */}
                    {stageNotice && (
                      <div className="mt-3.5 flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 p-2.5 font-mono text-xs text-amber-400 animate-in fade-in">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{stageNotice}</span>
                      </div>
                    )}

                    {/* Interactive Selection Target Cards (Click to toggle whether you're adjusting Call or Wrap date) */}
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setPickingTarget("start")}
                        className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all cursor-pointer ${
                          pickingTarget === "start"
                            ? "border-primary bg-primary/10 ring-1 ring-primary/40 shadow-sm"
                            : "border-border/70 bg-background/50 hover:border-border hover:bg-white/5"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                            <span className="h-2 w-2 rounded-full bg-primary" />
                            <span>Shoot Call Time (Start)</span>
                          </div>
                          <div className="mt-0.5 font-mono text-sm font-bold text-foreground">
                            {formatPrettyDate(startDate)}
                          </div>
                        </div>
                        <span className="rounded-md border border-border/80 bg-background/70 px-2 py-0.5 font-mono text-[9px] text-muted-foreground uppercase">
                          {pickingTarget === "start" ? "Selecting..." : "Click to Edit"}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPickingTarget("end")}
                        className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all cursor-pointer ${
                          pickingTarget === "end"
                            ? "border-primary bg-primary/10 ring-1 ring-primary/40 shadow-sm"
                            : "border-border/70 bg-background/50 hover:border-border hover:bg-white/5"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                            <span>Return & Wrap Time</span>
                          </div>
                          <div className="mt-0.5 font-mono text-sm font-bold text-foreground">
                            {formatPrettyDate(returnDate)}
                          </div>
                        </div>
                        <span className="rounded-md border border-border/80 bg-background/70 px-2 py-0.5 font-mono text-[9px] text-muted-foreground uppercase">
                          {pickingTarget === "end" ? "Selecting..." : "Click to Edit"}
                        </span>
                      </button>
                    </div>

                    <FieldError field="start_date" />
                    <FieldError field="end_date" />
                  </div>

                  {/* Production Notes */}
                  <div>
                    <label className="mb-1.5 block font-mono text-xs text-muted-foreground">
                      Production Notes & Rigging Requests (Optional)
                    </label>
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                      <textarea
                        name="notes"
                        rows={3}
                        placeholder="Specify stage address (e.g. Film City Studio 5, Goregaon), preferred mount (PL/E/RF), battery count, or GSTIN notes..."
                        className="w-full rounded-xl border border-border/70 bg-carbon/60 pl-10 pr-3.5 py-3 text-sm text-foreground outline-none transition duration-200 placeholder:text-muted-foreground/60 resize-none focus:border-primary focus:bg-carbon focus:ring-1 focus:ring-primary/40"
                      />
                    </div>
                    <FieldError field="notes" />
                  </div>
                </div>

                {/* Server Error Alert */}
                {serverError && (
                  <div className="flex items-center gap-2 rounded-xl border border-destructive/50 bg-destructive/10 p-3.5 font-mono text-xs text-destructive animate-in fade-in">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{serverError}</span>
                  </div>
                )}

                {/* Security Guarantee Notice */}
                <div className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-carbon/30 px-3.5 py-2.5 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                  <span>
                    Zero security deposit automatically applied upon GSTIN / WICA credentials verification.
                  </span>
                </div>

                {/* Action Buttons: Cancel and Submit */}
                <div className="pt-2 flex flex-col-reverse sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-border/80 bg-white/5 font-mono text-xs text-muted-foreground transition hover:bg-white/10 hover:text-foreground cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative flex-1 flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/30 transition-all duration-200 hover:opacity-95 hover:shadow-2xl hover:shadow-primary/50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        <span>Dispatching to Mumbai Desk...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Rental Hold Request</span>
                        <span className="font-mono text-xs transition-transform duration-200 group-hover:translate-x-1">
                          →
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useMemo, type FormEvent } from "react";
import { useCart } from "@/context/CartContext";
import { inquirySchema, rentalTotal, calculateDaysBetween, DURATIONS } from "@/lib/inquiry";
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
  Film,
  Layers,
} from "lucide-react";

type ConfirmationData = {
  reference: string;
  items_count: number;
  gear_summary: string;
  daily_rate: number;
  start_date: string;
  end_date: string;
  customer_name: string;
  customer_email: string;
  total_estimate: number;
  days: number;
};

const inputBase =
  "w-full rounded-xl border border-white/10 bg-[#0e0d1a] pl-10 pr-3.5 py-3 text-sm text-foreground outline-none transition duration-200 placeholder:text-muted-foreground/60 focus:border-pink-500 focus:bg-[#141324] focus:ring-1 focus:ring-pink-500/40";
const inputError = "!border-rose-500 !focus:border-rose-500 !focus:ring-rose-500";

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

export function KitReserveModal({
  onClose,
  initialDurationDays = 1,
}: {
  onClose: () => void;
  initialDurationDays?: number;
}) {
  const { items, clearCart, totalDailyRate, itemCount } = useCart();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<ConfirmationData | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showManifest, setShowManifest] = useState(false);

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

  // Multi-day & bundle pricing
  const days = calculateDaysBetween(startDate, returnDate);
  const isBundle = items.length >= 2;
  const bundleDiscountRate = isBundle ? 0.05 : 0;

  const durationDiscountRate = useMemo(() => {
    if (days >= 7) return 0.25;
    if (days >= 3) return 0.1;
    return 0;
  }, [days]);

  const totalDiscountRate = durationDiscountRate + bundleDiscountRate;

  const estimatedTotal = useMemo(() => {
    return rentalTotal(totalDailyRate, days, totalDiscountRate);
  }, [totalDailyRate, days, totalDiscountRate]);

  const rawTotal = totalDailyRate * days;
  const totalSavings = rawTotal - estimatedTotal;

  // Calendar tile click
  const handleTileClick = (clickedDate: string, isPast: boolean) => {
    if (isPast) return;

    if (pickingTarget === "start") {
      setStartDate(clickedDate);
      if (returnDate < clickedDate) {
        setReturnDate(clickedDate);
      }
      setPickingTarget("end");
    } else {
      if (clickedDate < startDate) {
        setStartDate(clickedDate);
        setPickingTarget("end");
      } else {
        setReturnDate(clickedDate);
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
    if (items.length === 0) return;

    const fd = new FormData(e.currentTarget);
    const formattedItems = items.map((it) => ({
      name: it.gear.name,
      category: it.gear.category,
      rate: it.gear.rate,
      quantity: it.quantity,
      img: it.gear.img,
    }));

    const kitSummary = items
      .map((it) => `${it.gear.name}${it.quantity > 1 ? ` (x${it.quantity})` : ""}`)
      .join(" + ");

    const payload = {
      gear_name: kitSummary,
      gear: kitSummary,
      category: "Production Package",
      daily_rate: totalDailyRate,
      dailyRate: totalDailyRate,
      items: formattedItems,
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
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? "Failed to reserve production kit with dispatch desk");
      }

      setConfirmation({
        reference: json.reference,
        items_count: itemCount,
        gear_summary: kitSummary,
        daily_rate: totalDailyRate,
        start_date: startDate,
        end_date: returnDate,
        customer_name: payload.customer_name,
        customer_email: payload.customer_email,
        total_estimate: estimatedTotal,
        days,
      });

      // Clear cart once reservation is confirmed
      clearCart();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error reserving kit";
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!confirmation) return;
    navigator.clipboard.writeText(confirmation.reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-[#0c0b16] shadow-2xl text-white my-auto max-h-[92dvh] flex flex-col z-10 animate-in zoom-in-95 duration-200">
        {/* Top Edge Gradient */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff2a8d] to-[#00f0ff]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 bg-[#0e0d1a]/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#ff2a8d]/30 bg-[#ff2a8d]/10 text-[#ff2a8d] shadow-[0_0_15px_rgba(255,42,141,0.25)]">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                  Multi-Unit Kit Reservation
                </h3>
                <span className="rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 px-2 py-0.2 font-mono text-[10px] text-[#00f0ff] font-bold">
                  {itemCount} Units
                </span>
              </div>
              <p className="font-mono text-[10px] text-zinc-400">
                Mumbai Dispatch Hub • Zero Deposit on Guild ID
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto custom-scrollbar p-5 space-y-5">
          {confirmation ? (
            /* CONFIRMATION SCREEN */
            <div className="space-y-6 text-center py-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-in zoom-in">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 font-mono text-[10px] text-emerald-400 tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  TURNKEY PRODUCTION KIT RESERVED
                </span>
                <h2 className="mt-3 text-2xl font-black text-white">
                  Stage Dispatch Hold Confirmed
                </h2>
                <p className="mt-1 text-xs text-zinc-400 max-w-md mx-auto">
                  Your multi-unit equipment kit has been staged at our Mumbai dispatch desk. A reservation summary has been sent to{" "}
                  <span className="text-white font-medium">{confirmation.customer_email}</span>.
                </p>
              </div>

              {/* Reference Voucher Card */}
              <div className="relative mx-auto max-w-md overflow-hidden rounded-2xl border border-white/15 bg-[#121124] p-5 text-left shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
                    KIT REFERENCE CODE
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 font-mono text-xs text-[#ff2a8d] hover:text-pink-300 transition cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" /> Copy
                      </>
                    )}
                  </button>
                </div>

                <div className="my-3 font-mono text-xl font-bold tracking-wider text-white">
                  {confirmation.reference}
                </div>

                <div className="space-y-1.5 pt-3 border-t border-white/10 font-mono text-[11px] text-zinc-300">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Package Units:</span>
                    <span className="text-white font-semibold">{confirmation.items_count} Units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Shoot Dates:</span>
                    <span className="text-white">
                      {formatPrettyDate(confirmation.start_date)} → {formatPrettyDate(confirmation.end_date)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Duration:</span>
                    <span className="text-white">{confirmation.days} {confirmation.days === 1 ? "Day" : "Days"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Estimated Total:</span>
                    <span className="text-emerald-400 font-bold">₹{confirmation.total_estimate.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Dispatch Desk:</span>
                    <span className="text-[#00f0ff]">Film City Stage 04, Goregaon East</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={`/track?ref=${encodeURIComponent(confirmation.reference)}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff2a8d] to-[#7c3aed] px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-[#ff2a8d]/30 transition hover:brightness-110"
                >
                  <Truck className="h-4 w-4" />
                  <span>Track Stage Dispatch Live</span>
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-xs font-semibold text-zinc-300 hover:bg-white/10 transition"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* RESERVATION FORM */
            <form onSubmit={handleSubmit} className="space-y-5">
              {serverError && (
                <div className="flex items-center gap-2.5 rounded-xl border border-rose-500/30 bg-rose-950/30 p-3.5 text-xs text-rose-300">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                  <span>{serverError}</span>
                </div>
              )}

              {/* Package Items Accordion Summary */}
              <div className="rounded-2xl border border-white/10 bg-[#121124] p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Film className="h-4 w-4 text-[#ff2a8d]" />
                    <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                      Package Units ({items.length} Distinct Items)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowManifest(!showManifest)}
                    className="font-mono text-[10px] text-[#00f0ff] hover:underline cursor-pointer"
                  >
                    {showManifest ? "Hide Manifest" : "View Manifest"}
                  </button>
                </div>

                {showManifest ? (
                  <div className="mt-2 space-y-2 pt-2 border-t border-white/10">
                    {items.map(({ gear, quantity }) => (
                      <div
                        key={gear.name}
                        className="flex items-center justify-between text-xs font-mono py-1"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-[#ff2a8d] font-bold">x{quantity}</span>
                          <span className="text-white truncate">{gear.name}</span>
                        </div>
                        <span className="text-zinc-400 shrink-0">
                          ₹{(gear.rate * quantity).toLocaleString("en-IN")}/d
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-zinc-400 truncate">
                    {items.map((i) => `${i.gear.name}${i.quantity > 1 ? ` (x${i.quantity})` : ""}`).join(" • ")}
                  </p>
                )}
              </div>

              {/* SEAT-MATRIX SHOOT CALENDAR */}
              <div className="rounded-2xl border border-white/10 bg-[#100f1e] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#ff2a8d]" />
                    <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                      Shoot & Return Schedule
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-zinc-300">
                      {days} {days === 1 ? "Day" : "Days"}
                    </span>
                    {totalDiscountRate > 0 && (
                      <span className="rounded bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-emerald-400 font-bold">
                        -{Math.round(totalDiscountRate * 100)}% Package Discount
                      </span>
                    )}
                  </div>
                </div>

                {/* Date Chips */}
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setPickingTarget("start")}
                    className={`rounded-xl border p-2.5 transition cursor-pointer ${
                      pickingTarget === "start"
                        ? "border-[#ff2a8d] bg-pink-500/10"
                        : "border-white/10 bg-white/[0.02]"
                    }`}
                  >
                    <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 block">
                      Shoot Call Date (Start)
                    </span>
                    <span className="font-mono text-xs font-bold text-white mt-0.5 block">
                      {formatPrettyDate(startDate)}
                    </span>
                  </div>

                  <div
                    onClick={() => setPickingTarget("end")}
                    className={`rounded-xl border p-2.5 transition cursor-pointer ${
                      pickingTarget === "end"
                        ? "border-[#00f0ff] bg-cyan-500/10"
                        : "border-white/10 bg-white/[0.02]"
                    }`}
                  >
                    <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 block">
                      Wrap Return Date (End)
                    </span>
                    <span className="font-mono text-xs font-bold text-white mt-0.5 block">
                      {formatPrettyDate(returnDate)}
                    </span>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="rounded-xl border border-white/5 bg-black/40 p-3">
                  <div className="flex items-center justify-between mb-2 font-mono text-xs text-white">
                    <span className="font-bold">
                      {monthNames[viewMonth]} {viewYear}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (viewMonth === 0) {
                            setViewMonth(11);
                            setViewYear(viewYear - 1);
                          } else {
                            setViewMonth(viewMonth - 1);
                          }
                        }}
                        className="h-6 w-6 flex items-center justify-center rounded text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (viewMonth === 11) {
                            setViewMonth(0);
                            setViewYear(viewYear + 1);
                          } else {
                            setViewMonth(viewMonth + 1);
                          }
                        }}
                        className="h-6 w-6 flex items-center justify-center rounded text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center font-mono text-[9px] text-zinc-500 mb-1">
                    {dayHeaders.map((dh) => (
                      <span key={dh}>{dh}</span>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
                      <div key={`empty-${idx}`} className="h-7" />
                    ))}
                    {Array.from({ length: totalDaysInMonth }).map((_, idx) => {
                      const dayNum = idx + 1;
                      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                      const isPast = dateStr < todayStr;
                      const isStart = dateStr === startDate;
                      const isEnd = dateStr === returnDate;
                      const inRange = dateStr >= startDate && dateStr <= returnDate;

                      return (
                        <button
                          key={dateStr}
                          type="button"
                          disabled={isPast}
                          onClick={() => handleTileClick(dateStr, isPast)}
                          className={`h-7 rounded text-[11px] font-mono transition flex items-center justify-center cursor-pointer ${
                            isPast
                              ? "text-zinc-700 cursor-not-allowed"
                              : isStart || isEnd
                              ? "bg-gradient-to-r from-[#ff2a8d] to-[#7c3aed] text-white font-bold shadow-md shadow-[#ff2a8d]/40"
                              : inRange
                              ? "bg-pink-500/20 text-pink-200"
                              : "text-zinc-300 hover:bg-white/10"
                          }`}
                        >
                          {dayNum}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* PRODUCTION & CONTACT DETAILS */}
              <div className="space-y-3">
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider block">
                  Production Information
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-mono text-[10px] text-zinc-400 block mb-1">
                      FULL NAME / CINEMATOGRAPHER *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
                      <input
                        type="text"
                        name="customer_name"
                        required
                        placeholder="e.g. Santosh Sivan"
                        className={`${inputBase} ${errors["customer_name"] ? inputError : ""}`}
                      />
                    </div>
                    {errors["customer_name"] && (
                      <p className="mt-1 text-[10px] text-rose-400">{errors["customer_name"]}</p>
                    )}
                  </div>

                  <div>
                    <label className="font-mono text-[10px] text-zinc-400 block mb-1">
                      PRODUCTION EMAIL *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
                      <input
                        type="email"
                        name="customer_email"
                        required
                        placeholder="producer@mumbaicinema.in"
                        className={`${inputBase} ${errors["customer_email"] ? inputError : ""}`}
                      />
                    </div>
                    {errors["customer_email"] && (
                      <p className="mt-1 text-[10px] text-rose-400">{errors["customer_email"]}</p>
                    )}
                  </div>

                  <div>
                    <label className="font-mono text-[10px] text-zinc-400 block mb-1">
                      CONTACT PHONE (+91) *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
                      <input
                        type="tel"
                        name="customer_phone"
                        required
                        placeholder="+91 98200 12345"
                        className={`${inputBase} ${errors["customer_phone"] ? inputError : ""}`}
                      />
                    </div>
                    {errors["customer_phone"] && (
                      <p className="mt-1 text-[10px] text-rose-400">{errors["customer_phone"]}</p>
                    )}
                  </div>

                  <div>
                    <label className="font-mono text-[10px] text-zinc-400 block mb-1">
                      WICA CARD / GUILD NO. (ZERO DEPOSIT)
                    </label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3.5 top-3.5 h-4 w-4 text-[#00f0ff]" />
                      <input
                        type="text"
                        name="wica_card"
                        placeholder="WICA-MUM-8924"
                        className={inputBase}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="font-mono text-[10px] text-zinc-400 block mb-1">
                    PRODUCTION HOUSE GSTIN (OPTIONAL)
                  </label>
                  <div className="relative">
                    <FileCheck2 className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
                    <input
                      type="text"
                      name="gstin"
                      placeholder="27ABCDE1234F1Z5"
                      className={inputBase}
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono text-[10px] text-zinc-400 block mb-1">
                    SHOOT LOCATION & STAGE NOTES
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
                    <input
                      type="text"
                      name="notes"
                      placeholder="e.g. Film City Studio 5, Goregaon East — Need early morning 6AM dispatch"
                      className={inputBase}
                    />
                  </div>
                </div>
              </div>

              {/* ESTIMATE CARD & SUBMIT */}
              <div className="rounded-2xl border border-white/10 bg-[#0e0d1a] p-4 space-y-3">
                <div className="flex justify-between items-baseline font-mono text-xs text-zinc-400">
                  <span>Combined Rate ({itemCount} units × {days} days)</span>
                  <span className="text-white">₹{rawTotal.toLocaleString("en-IN")}</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between items-baseline font-mono text-xs text-emerald-400 font-semibold">
                    <span>Package Discounts ({Math.round(totalDiscountRate * 100)}%)</span>
                    <span>-₹{totalSavings.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                  <div>
                    <span className="font-mono text-xs text-zinc-300 block">FINAL PACKAGE ESTIMATE</span>
                    <span className="text-[10px] text-zinc-500 font-mono">Zero Security Deposit with Guild ID</span>
                  </div>
                  <span className="text-2xl font-black text-white bg-gradient-to-r from-white via-pink-100 to-[#ff2a8d] bg-clip-text text-transparent">
                    ₹{estimatedTotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff2a8d] via-[#d946ef] to-[#7c3aed] py-3.5 text-sm font-semibold text-white shadow-xl shadow-[#ff2a8d]/30 transition hover:brightness-110 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span>Confirming Equipment Hold...</span>
                  ) : (
                    <span>Confirm Production Kit Hold ({itemCount} Units) →</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

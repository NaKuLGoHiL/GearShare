import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useTransition } from "react";
import {
  Camera,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  Search,
  ArrowLeft,
  Zap,
  Sliders,
  ChevronRight,
  Sparkles,
  MapPin,
  FileText,
  User,
  Calendar,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

interface BookingTelemetry {
  currentStep: number;
  currentStepLabel: string;
  etaMinutes: number;
  vanDriver: string;
  vanContact: string;
  collimationReport: {
    targetFlangeFocalMm: number;
    measuredFlangeFocalMm: number;
    deviationMm: string;
    toleranceToleranceMm: string;
    cleanroomClass: string;
    sensorCleanStatus: string;
    technician: string;
  };
  turnkeyKitManifest: string[];
}

interface BookingDetails {
  referenceCode: string;
  gearName?: string;
  category?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shootStartDate: string;
  shootReturnDate: string;
  totalDays: number;
  totalAmountInr: number;
  stageDestination: string;
  metroHub: string;
  status: string;
  depositWaiverApplied: boolean;
  wicaCleared: boolean;
  notes?: string;
}

export const Route = createFileRoute("/track")({
  component: TrackPage,
});

function TrackPage() {
  const [refInput, setRefInput] = useState("");
  const [activeRef, setActiveRef] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [telemetry, setTelemetry] = useState<BookingTelemetry | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Read ref from URL on initial load if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlRef = params.get("ref");
      if (urlRef) {
        setRefInput(urlRef);
        fetchTrackingData(urlRef);
      }
    }
  }, []);

  const fetchTrackingData = async (code: string) => {
    const clean = code.trim().toUpperCase();
    if (!clean) return;

    setLoading(true);
    setErrorMsg(null);
    setActiveRef(clean);

    try {
      const res = await fetch(`/api/bookings?ref=${encodeURIComponent(clean)}`);
      const data = await res.json();

      if (res.ok && data.ok) {
        startTransition(() => {
          setBooking(data.booking);
          setTelemetry(data.telemetry);
        });
      } else {
        setBooking(null);
        setTelemetry(null);
        setErrorMsg(data.error || "No order found matching this reference.");
      }
    } catch {
      setErrorMsg("Failed to communicate with stage dispatch. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrackingData(refInput);
  };

  const handlePrint = () => {
    window.print();
  };

  const STAGE_STEPS = [
    {
      step: 1,
      title: "Order Cleared & Verified",
      desc: "GSTIN / WICA Union verification confirmed with ₹0 security deposit clearance.",
      badge: "VERIFIED",
    },
    {
      step: 2,
      title: "Cleanroom Collimation",
      desc: "Flange Focal Distance collimated to ±0.01mm on optical bench; sensor dust scan passed.",
      badge: "OPTICAL BENCH",
    },
    {
      step: 3,
      title: "Pelican Turnkey Packing",
      desc: "Camera body, 4x 150Wh V-mounts, quad charger, and Codex drives sealed into flight hardcase.",
      badge: "BAY 1 PREPPED",
    },
    {
      step: 4,
      title: "Sprinter Van Dispatched",
      desc: "Equipment in transit with dedicated stage driver to Mumbai production soundstage.",
      badge: "TRANSIT",
    },
    {
      step: 5,
      title: "On Set Delivery & Wrap",
      desc: "Delivered to First AC on stage with signed collimation certificates and battery test slips.",
      badge: "STAGE CALL",
    },
  ];

  const currentStep = telemetry?.currentStep ?? 3;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-foreground antialiased selection:bg-red-500/20 selection:text-red-900">
      {/* Top Industrial Telemetry Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 font-mono text-xs text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Catalog</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="tally h-2.5 w-2.5 rounded-full" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-900">
                GEARSHARE <span className="text-red-600 font-normal">STAGE DISPATCH</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] text-emerald-800 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>MUMBAI DISPATCH DESK ACTIVE</span>
            </span>

            {booking && (
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 transition hover:bg-slate-50 shadow-sm"
              >
                <Printer className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Print Dispatch Slip</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-5xl px-6 py-10 sm:py-16">
        {/* Title and Search Bar */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3.5 py-1 font-mono text-xs text-red-600 shadow-sm font-semibold">
            <span className="tally h-2 w-2 rounded-full" />
            <span>REAL-TIME HARDWARE TELEMETRY</span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900">
            Track Soundstage Equipment Dispatch
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
            Monitor optical collimation, cleanroom sensor inspection, flight-case prep, and sprinter van stage transit across Mumbai and national production hubs.
          </p>

          {/* Reference Lookup Form */}
          <form onSubmit={handleSearchSubmit} className="mt-8 mx-auto max-w-xl">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={refInput}
                onChange={(e) => setRefInput(e.target.value)}
                placeholder="Enter Booking Reference (e.g. GS-MUM-B6DB89)"
                className="w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-28 py-4 font-mono text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400/40 shadow-sm backdrop-blur-xl"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-5 py-2.5 font-mono text-xs font-semibold text-white shadow-md transition hover:bg-red-700 disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Locating..." : "Track Rig →"}
              </button>
            </div>

            {/* Quick-Click Sample References */}
            <div className="mt-3 flex items-center justify-center gap-2 font-mono text-xs text-slate-500">
              <span>Sample Active Sets:</span>
              <button
                type="button"
                onClick={() => {
                  setRefInput("GS-MUM-B6DB89");
                  fetchTrackingData("GS-MUM-B6DB89");
                }}
                className="text-red-600 hover:underline underline-offset-4 font-semibold"
              >
                GS-MUM-B6DB89
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => {
                  setRefInput("GS-MUM-89421A");
                  fetchTrackingData("GS-MUM-89421A");
                }}
                className="text-red-600 hover:underline underline-offset-4 font-semibold"
              >
                GS-MUM-89421A
              </button>
            </div>
          </form>
        </div>

        {/* Error Notice */}
        {errorMsg && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-center">
            <p className="font-mono text-xs text-red-600 flex items-center justify-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>{errorMsg}</span>
            </p>
          </div>
        )}

        {/* Active Booking Telemetry Card */}
        {booking && telemetry && (
          <div className="mt-12 space-y-8 animate-in fade-in duration-300">
            {/* Live Dispatch Header Pill */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 backdrop-blur-xl shadow-lg relative overflow-hidden">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-500/5 blur-3xl" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-red-600">
                      {booking.referenceCode}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 font-mono text-[10px] uppercase text-slate-700 font-semibold">
                      {booking.metroHub} Stage Desk
                    </span>
                  </div>
                  <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {booking.gearName || "Cinema Hardware Rig"}
                  </h2>
                  <p className="mt-1 font-mono text-xs text-slate-500 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-red-600" />
                    <span>{booking.stageDestination}</span>
                  </p>
                </div>

                {/* Stage ETA Badge */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-right min-w-[180px]">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">Estimated Stage ETA</p>
                  <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-0.5">
                    {telemetry.etaMinutes} MINS
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Van Driver: {telemetry.vanDriver}
                  </p>
                </div>
              </div>

              {/* 5-Step Soundstage Dispatch Timeline */}
              <div className="pt-8">
                <p className="font-mono text-xs uppercase tracking-wider text-slate-500 font-semibold mb-6">
                  SOUNDSTAGE DISPATCH LIFECYCLE
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
                  {STAGE_STEPS.map((step) => {
                    const isDone = currentStep >= step.step;
                    const isCurrent = currentStep === step.step;

                    return (
                      <div
                        key={step.step}
                        className={`rounded-2xl border p-4 transition-all duration-200 relative ${
                          isCurrent
                            ? "border-red-500 bg-red-50 shadow-md ring-1 ring-red-400"
                            : isDone
                            ? "border-emerald-200 bg-emerald-50/70 text-slate-900"
                            : "border-slate-200 bg-slate-50/60 opacity-60 text-slate-500"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-[10px] font-bold text-slate-500">
                            0{step.step}
                          </span>
                          {isDone ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-slate-400" />
                          )}
                        </div>

                        <p className="text-xs font-bold leading-snug text-slate-900">{step.title}</p>
                        <p className="mt-1 font-mono text-[10px] text-slate-600 leading-relaxed line-clamp-2">
                          {step.desc}
                        </p>

                        <div className="mt-3">
                          <span
                            className={`inline-block rounded-md px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
                              isCurrent
                                ? "bg-red-600 text-white font-bold"
                                : isDone
                                ? "bg-emerald-100 text-emerald-800 font-semibold"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {isCurrent ? "IN PROGRESS" : isDone ? "PASSED" : "PENDING"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2-Column Telemetry & Inspection Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Column: Signed Optical Collimation Certificate */}
              <div className="md:col-span-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-red-600" />
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
                      Collimation & Optical Bench Slip
                    </h3>
                  </div>
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 font-mono text-[10px] text-emerald-700 font-bold">
                    CERTIFIED ±0.01mm
                  </span>
                </div>

                <div className="mt-5 space-y-4 font-mono text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-500">Standard Flange Focal Distance</span>
                    <span className="font-bold text-slate-900">
                      {telemetry.collimationReport.targetFlangeFocalMm.toFixed(3)} mm
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-500">Measured Optical FFD</span>
                    <span className="font-bold text-emerald-700">
                      {telemetry.collimationReport.measuredFlangeFocalMm.toFixed(3)} mm
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-500">Collimation Tolerance Deviation</span>
                    <span className="font-bold text-emerald-700">
                      {telemetry.collimationReport.deviationMm} (Max {telemetry.collimationReport.toleranceToleranceMm})
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-500">Cleanroom Environment</span>
                    <span className="text-slate-900">
                      {telemetry.collimationReport.cleanroomClass}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-500">Sensor Particle Scan</span>
                    <span className="text-emerald-700 font-semibold">
                      {telemetry.collimationReport.sensorCleanStatus}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-500">Testing Technician</span>
                    <span className="text-slate-700">
                      {telemetry.collimationReport.technician}
                    </span>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-[11px] text-slate-600">
                  <p className="flex items-center gap-1.5 text-emerald-700 font-semibold mb-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Optical Assurance Warranty</span>
                  </p>
                  <span>
                    Camera collimated using digital depth micrometers to ensure infinity focus and zero backfocus drift under anamorphic and ultra-wide optics.
                  </span>
                </div>
              </div>

              {/* Right Column: Turnkey Case Manifest & Order Breakdown */}
              <div className="md:col-span-6 space-y-6">
                {/* Flight-Case Manifest */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
                    <Camera className="h-4 w-4 text-red-600" />
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
                      Included Flight-Case Hardware Manifest
                    </h3>
                  </div>

                  <ul className="mt-4 space-y-2.5 font-mono text-xs text-slate-700">
                    {telemetry.turnkeyKitManifest.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Rental Details & KYC Clearance Card */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
                        Production Hold Summary
                      </h3>
                    </div>
                    <span className="text-red-600 font-bold">
                      ₹{booking.totalAmountInr.toLocaleString("en-IN")} Total
                    </span>
                  </div>

                  <div className="mt-4 space-y-2.5 text-slate-600">
                    <div className="flex justify-between">
                      <span>Filmmaker / DP:</span>
                      <span className="text-slate-900 font-semibold">{booking.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shoot Window:</span>
                      <span className="text-slate-900 font-semibold">
                        {booking.shootStartDate} to {booking.shootReturnDate} ({booking.totalDays} Days)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Security Deposit:</span>
                      <span className="text-emerald-700 font-bold">
                        ₹0 (GSTIN / WICA Clearance Applied)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Contact:</span>
                      <span className="text-slate-900">{booking.customerPhone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

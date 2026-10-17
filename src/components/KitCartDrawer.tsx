import { useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";
import { DURATIONS, rentalTotal } from "@/lib/inquiry";
import {
  ShoppingBag,
  X,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  ShieldCheck,
  PackageCheck,
  ChevronRight,
  ArrowRight,
  Film,
} from "lucide-react";

interface KitCartDrawerProps {
  onProceedToCheckout: () => void;
}

export function KitCartDrawer({ onProceedToCheckout }: KitCartDrawerProps) {
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount,
    totalDailyRate,
  } = useCart();

  const [durationIdx, setDurationIdx] = useState(0);
  const activeDuration = DURATIONS[durationIdx] ?? DURATIONS[0];

  // Multi-unit bundle discount (5% extra discount if 2 or more distinct units are reserved)
  const isBundle = items.length >= 2;
  const bundleDiscountRate = isBundle ? 0.05 : 0;

  const totalDiscountRate = activeDuration.discount + bundleDiscountRate;

  const estimatedTotal = useMemo(() => {
    return rentalTotal(totalDailyRate, activeDuration.days, totalDiscountRate);
  }, [totalDailyRate, activeDuration.days, totalDiscountRate]);

  const rawTotalWithoutDiscount = totalDailyRate * activeDuration.days;
  const totalSavings = rawTotalWithoutDiscount - estimatedTotal;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="relative z-10 flex h-full w-full max-w-lg flex-col border-l border-white/10 bg-[#0c0b16] text-white shadow-[0_0_60px_rgba(0,0,0,0.9)] animate-in slide-in-from-right duration-300">
        {/* Top Specular Edge Glow */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#ff2a8d] to-[#00f0ff]" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 bg-[#0e0d1a]/80 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-pink-500/30 bg-pink-500/10 text-[#ff2a8d] shadow-[0_0_15px_rgba(255,42,141,0.25)]">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                  Production Kit Cart
                </span>
                <span className="rounded-full bg-[#ff2a8d]/15 border border-[#ff2a8d]/30 px-2 py-0.2 font-mono text-[10px] text-[#ff2a8d] font-bold">
                  {itemCount} {itemCount === 1 ? "Unit" : "Units"}
                </span>
              </div>
              <p className="font-mono text-[10px] text-zinc-400">
                Mumbai Stage Dispatch • Zero Deposit Verified
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="rounded-lg px-2.5 py-1 text-[11px] font-mono text-zinc-400 hover:text-rose-400 transition cursor-pointer"
                title="Clear all units"
              >
                Clear All
              </button>
            )}
            <button
              type="button"
              onClick={closeCart}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
              aria-label="Close Cart"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
          {items.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12">
              <div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] shadow-inner">
                <Film className="h-10 w-10 text-zinc-600" />
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[#ff2a8d] animate-ping" />
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Your Production Kit is Empty
              </h3>
              <p className="mt-2 text-xs text-zinc-400 max-w-xs leading-relaxed">
                Add cinema camera bodies, anamorphic lenses, lighting packages, or wireless audio to build your custom multi-unit production kit.
              </p>
              <button
                type="button"
                onClick={() => {
                  closeCart();
                  const catalogEl = document.getElementById("catalog");
                  if (catalogEl) {
                    catalogEl.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ff2a8d] to-[#7c3aed] px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-[#ff2a8d]/25 transition hover:brightness-110 active:scale-95 cursor-pointer"
              >
                <span>Browse Equipment Catalog</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            /* Itemized Kit List */
            <>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 px-1">
                  <span>SELECTED CINEMA HARDWARE</span>
                  <span>DAILY RATE</span>
                </div>

                {items.map(({ gear, quantity }) => (
                  <div
                    key={gear.name}
                    className="group relative flex items-center gap-3.5 rounded-2xl border border-white/10 bg-[#131222]/90 p-3.5 backdrop-blur-md transition-all hover:border-pink-500/30 hover:bg-[#16152a]"
                  >
                    {/* Gear Thumbnail */}
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/60">
                      {gear.img ? (
                        <img
                          src={gear.img}
                          alt={gear.name}
                          className="h-full w-full object-cover object-center"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-zinc-500">
                          <Film className="h-6 w-6" />
                        </div>
                      )}
                    </div>

                    {/* Gear Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 font-mono text-[9.5px]">
                        <span className="rounded bg-white/5 border border-white/10 px-1.5 py-0.2 text-[#00f0ff] uppercase tracking-wider">
                          {gear.category}
                        </span>
                      </div>
                      <h4 className="mt-1 text-xs font-bold text-white tracking-tight truncate">
                        {gear.name}
                      </h4>
                      <div className="mt-1 flex items-center gap-2 font-mono text-[11px]">
                        <span className="text-[#ff2a8d] font-bold">
                          ₹{gear.rate.toLocaleString("en-IN")}
                        </span>
                        <span className="text-zinc-500">/day</span>
                      </div>
                    </div>

                    {/* Quantity Stepper & Remove */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => removeFromCart(gear.name)}
                        className="text-zinc-500 hover:text-rose-400 transition p-1 cursor-pointer"
                        title="Remove unit"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>

                      <div className="flex items-center rounded-lg border border-white/15 bg-black/40 p-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(gear.name, quantity - 1)}
                          className="flex h-5 w-5 items-center justify-center rounded text-zinc-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-2.5 w-2.5" />
                        </button>
                        <span className="w-6 text-center font-mono text-xs font-bold text-white">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(gear.name, quantity + 1)}
                          className="flex h-5 w-5 items-center justify-center rounded text-zinc-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-2.5 w-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Multi-Unit Package Perks */}
              {isBundle && (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 text-xs">
                  <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-emerald-400">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>MULTI-UNIT PACKAGE BENEFIT UNLOCKED</span>
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-300 leading-relaxed">
                    Extra 5% bundle discount applied + complimentary custom Pelican Air hard-case packing and priority stage courier dispatch.
                  </p>
                </div>
              )}

              {/* Shoot Duration Tier Selector */}
              <div className="rounded-2xl border border-white/10 bg-[#100f1e] p-3.5 space-y-2.5">
                <div className="flex items-center justify-between font-mono text-[11px] text-zinc-400">
                  <span>ESTIMATED SHOOT DURATION</span>
                  <span>MULTI-DAY TIER</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {DURATIONS.map((d, idx) => (
                    <button
                      key={d.days}
                      type="button"
                      onClick={() => setDurationIdx(idx)}
                      className={`relative flex flex-col items-center justify-center rounded-xl border p-2 text-center transition cursor-pointer ${
                        durationIdx === idx
                          ? "border-[#ff2a8d] bg-gradient-to-b from-[#ff2a8d]/20 to-[#7c3aed]/10 text-white shadow-[0_0_15px_rgba(255,42,141,0.25)]"
                          : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                      }`}
                    >
                      <span className="font-bold text-xs">{d.label}</span>
                      <span className="font-mono text-[9px] mt-0.5 text-zinc-400">
                        {d.tag}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer with Subtotal & Reserve Package CTA */}
        {items.length > 0 && (
          <div className="border-t border-white/10 bg-[#0e0d1a] p-5 space-y-3.5">
            {/* Rates calculation breakdown */}
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Combined Daily Rate ({itemCount} units)</span>
                <span className="text-white">₹{totalDailyRate.toLocaleString("en-IN")}/day</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Duration ({activeDuration.days} {activeDuration.days === 1 ? "day" : "days"})</span>
                <span className="text-white">₹{(totalDailyRate * activeDuration.days).toLocaleString("en-IN")}</span>
              </div>
              {totalSavings > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Package Discounts Applied ({Math.round(totalDiscountRate * 100)}%)</span>
                  <span>-₹{totalSavings.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                <div>
                  <span className="font-mono text-xs text-zinc-300 block">TOTAL PACKAGE ESTIMATE</span>
                  <span className="text-[10px] text-zinc-500 font-mono">Zero Deposit on WICA / GSTIN</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-white bg-gradient-to-r from-white via-pink-100 to-[#ff2a8d] bg-clip-text text-transparent">
                    ₹{estimatedTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Main Action Button */}
            <button
              type="button"
              onClick={() => {
                closeCart();
                onProceedToCheckout();
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff2a8d] via-[#d946ef] to-[#7c3aed] py-3.5 text-sm font-semibold text-white shadow-xl shadow-[#ff2a8d]/30 transition hover:brightness-110 active:scale-[0.98] cursor-pointer"
            >
              <span>Reserve Multi-Item Kit ({itemCount} {itemCount === 1 ? "Item" : "Items"})</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="flex items-center justify-center gap-3 font-mono text-[10px] text-zinc-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-[#00f0ff]" />
                Zero Deposit
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <PackageCheck className="h-3.5 w-3.5 text-emerald-400" />
                Turnkey Pelican Casing
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

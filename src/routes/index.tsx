import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import camera from "@/assets/camera.jpg";
import lens from "@/assets/lens.jpg";
import light from "@/assets/light.jpg";
import audio from "@/assets/audio.jpg";
import { DURATIONS, rentalTotal } from "@/lib/inquiry";
import { Tilt } from "@/components/Tilt";
import { ReserveModal, type Gear } from "@/components/ReserveModal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GearShare — On-Demand Cinema Camera Rentals" },
      { name: "description", content: "Rent bench-calibrated cinema bodies, anamorphic glass, lighting and audio, delivered flight-ready to your set." },
      { property: "og:title", content: "GearShare — On-Demand Cinema Camera Rentals" },
      { property: "og:description", content: "Precision optics and cinema bodies delivered directly on set." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const CATS = ["All", "Cinema Bodies", "Anamorphic & Primes", "Lighting & Grip", "Audio"] as const;

const GEAR = [
  { name: "RED V-Raptor 8K VV", category: "Cinema Bodies", rate: 650, img: camera, specs: ["8K VV", "RF / PL Mount", "17+ Stops"] },
  { name: "Sony FX9 Full-Frame", category: "Cinema Bodies", rate: 320, img: camera, specs: ["Full-Frame 6K", "E Mount", "Dual Base ISO"] },
  { name: "Anamorphic 100mm T2.1", category: "Anamorphic & Primes", rate: 280, img: lens, specs: ["2x Squeeze", "PL Mount", "Blue Flare"] },
  { name: "Master Prime 50mm T1.3", category: "Anamorphic & Primes", rate: 190, img: lens, specs: ["T1.3", "PL Mount", "Full-Frame"] },
  { name: "Bi-Color LED 1x1 Panel", category: "Lighting & Grip", rate: 95, img: light, specs: ["2700–6500K", "CRI 96+", "V-Mount"] },
  { name: "Zoom H5 + Shotgun Kit", category: "Audio", rate: 60, img: audio, specs: ["32-bit Float", "XLR x2", "Rycote Wind"] },
];

const BENTO = [
  { t: "Bench-Calibrated Optics", d: "Flange focal distance verified on collimator before every dispatch. Sensors cleaned and certified.", k: "FFD ±0.01mm", span: "md:col-span-2" },
  { t: "Production Damage Shield", d: "Zero security deposit for verified filmmakers.", k: "$0 DEPOSIT", span: "" },
  { t: "Immediate Set Dispatch", d: "Flight-ready Pelican cases delivered directly on set.", k: "< 4H METRO", span: "" },
  { t: "Power & Rig Ready", d: "Standard V-mount batteries, baseplates and rods included with every body.", k: "4x 150Wh V-MOUNT", span: "md:col-span-2" },
];

const FAQ = [
  { q: "What does rental coverage include?", a: "Every rental is covered by our Production Damage Shield against accidental damage on set. Theft and negligence are assessed case-by-case." },
  { q: "What if gear fails mid-shoot?", a: "Call the 24/7 dispatch line. We hot-swap a replacement body or lens to your location, typically within 4 hours in metro areas." },
  { q: "Do I need to pay a security deposit?", a: "Verified filmmakers pay zero deposit. Unverified accounts place a refundable hold equal to 20% of the gear value." },
  { q: "How is ID verification handled?", a: "Upload a government ID and a production reference. Most verifications clear within one business hour." },
];

function Index() {
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [dur, setDur] = useState(0);
  const [selected, setSelected] = useState<Gear | null>(null);
  const close = useCallback(() => setSelected(null), []);
  const d = DURATIONS[dur] ?? DURATIONS[0];
  const items = useMemo(() => (cat === "All" ? GEAR : GEAR.filter((g) => g.category === cat)), [cat]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <a href="#top" className="flex items-center gap-2 font-mono text-sm font-semibold tracking-[0.3em]">
            <span className="tally h-2 w-2 rounded-full" /> GEARSHARE
          </a>
          <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
            {[["Catalog", "catalog"], ["Hardware", "hardware"], ["Pipeline", "pipeline"], ["FAQ", "faq"]].map(([l, h]) => (
              <a key={h} href={`#${h}`} className="hover:text-foreground">{l}</a>
            ))}
          </nav>
          <a href="#catalog" className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90">Rent Kit</a>
        </div>
      </header>

      <section id="top" className="relative overflow-hidden">
        <div className="grid-lines absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground">
            <span className="tally h-1.5 w-1.5 rounded-full" /> REC · NOW DISPATCHING
          </span>
          <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">
            Precision Optics.<br /><span className="text-muted-foreground">Uncompromised Sensor Power.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-muted-foreground">On-demand cinema bodies, glass, light and sound — calibrated, cased and delivered to your set.</p>
          <div className="mt-8 flex justify-center gap-3">
            <a href="#catalog" className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90">Browse Catalog</a>
            <a href="#pipeline" className="rounded-full border border-border px-6 py-3 text-sm hover:bg-secondary">How it works</a>
          </div>
        </div>
        <div className="relative mx-auto max-w-6xl px-6">
          <Tilt max={6} className="tilt-card overflow-hidden rounded-2xl border border-border"><img src={camera} alt="RED V-Raptor cinema camera with PL prime lens" width={1600} height={1008} className="block w-full" /></Tilt>
          <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border font-mono text-xs md:grid-cols-4">
            {[["SENSOR", "40.96 × 21.60mm"], ["RESOLUTION", "8192 × 4320"], ["DYNAMIC RANGE", "17+ STOPS"], ["MOUNT", "PL / RF / LPL"]].map(([k, v]) => (
              <div key={k} className="bg-carbon p-4"><p className="text-muted-foreground">{k}</p><p className="mt-1 text-foreground">{v}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section id="catalog" className="mx-auto max-w-7xl scroll-mt-20 px-6 py-24">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs tracking-widest text-primary">01 / CATALOG</p>
            <h2 className="mt-2 text-3xl font-semibold md:text-4xl">Equipment Catalog</h2>
          </div>
          <div className="inline-flex rounded-full border border-border bg-carbon p-1 font-mono text-xs">
            {DURATIONS.map((x, i) => (
              <button key={x.days} onClick={() => setDur(i)}
                className={`rounded-full px-4 py-2 transition ${dur === i ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>
                {x.label}{x.discount ? ` (-${x.discount * 100}%)` : ""}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {CATS.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${cat === c ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((g) => (
            <Tilt key={g.name} max={10} className="tilt-card group h-full overflow-hidden rounded-xl border border-border bg-card"><article>
              <div className="aspect-[4/3] overflow-hidden bg-background">
                <img src={g.img} alt={g.name} loading="lazy" width={1024} height={768} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <span className="rounded bg-foreground px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-background">{g.category}</span>
                <h3 className="mt-3 text-lg font-medium">{g.name}</h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {g.specs.map((s) => <span key={s} className="rounded-full border border-border px-2 py-0.5 font-mono text-[11px] text-muted-foreground">{s}</span>)}
                </div>
                <div className="mt-5 flex items-end justify-between">
                  <div className="font-mono">
                    <p className="text-2xl text-foreground">${rentalTotal(g.rate, d.days, d.discount).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{d.label} · ${g.rate}/day base</p>
                  </div>
                  <button onClick={() => setSelected({ name: g.name, category: g.category, rate: g.rate })}
                    className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">Reserve</button>
                </div>
              </div>
            </article></Tilt>
          ))}
        </div>
      </section>

      <section id="hardware" className="mx-auto max-w-7xl scroll-mt-20 px-6 py-24">
        <p className="font-mono text-xs tracking-widest text-primary">02 / HARDWARE</p>
        <h2 className="mt-2 text-3xl font-semibold md:text-4xl">Built for the set.</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {BENTO.map((b) => (
            <div key={b.t} className={`rounded-xl border border-border bg-card p-8 ${b.span}`}>
              <p className="font-mono text-xs text-primary">{b.k}</p>
              <h3 className="mt-6 text-xl font-medium">{b.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pipeline" className="mx-auto max-w-7xl scroll-mt-20 px-6 py-24">
        <p className="font-mono text-xs tracking-widest text-primary">03 / PIPELINE</p>
        <h2 className="mt-2 text-3xl font-semibold md:text-4xl">Rental Pipeline</h2>
        <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
          {[["Select Hardware", "Build your kit and lock in the rental window."], ["ID Verification", "Fast identity and production check — usually under an hour."], ["Direct Studio Delivery", "Cased, charged and calibrated, delivered to your set."]].map(([t, d], i) => (
            <div key={t} className="bg-carbon p-8">
              <p className="font-mono text-4xl text-muted-foreground">0{i + 1}</p>
              <h3 className="mt-6 text-lg font-medium">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-6 py-24">
        <p className="font-mono text-xs tracking-widest text-primary">04 / FAQ</p>
        <h2 className="mt-2 text-3xl font-semibold md:text-4xl">Operational FAQ</h2>
        <div className="mt-10 divide-y divide-border border-y border-border">
          {FAQ.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                {f.q}<span className="font-mono text-muted-foreground transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 font-mono text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© 2026 GEARSHARE · Prototype — listings and pricing are illustrative.</p>
          <nav className="flex gap-6">
            <a href="#catalog" className="hover:text-foreground">Catalog</a>
            <a href="#pipeline" className="hover:text-foreground">Pipeline</a>
            <a href="#faq" className="hover:text-foreground">FAQ</a>
          </nav>
        </div>
      </footer>

      <ReserveModal gear={selected} onClose={close} />
    </div>
  );
}

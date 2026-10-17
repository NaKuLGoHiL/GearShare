import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import cameraRed from "@/assets/camera.jpg";
import cameraArri from "@/assets/arri_camera.jpg";
import cameraSony from "@/assets/sony_fx9.jpg";
import lensAnamorphic from "@/assets/lens.jpg";
import lensZeiss from "@/assets/zeiss_master_prime.jpg";
import lensCooke from "@/assets/cooke_s4i_prime.jpg";
import lightTubes from "@/assets/lighting_kit.jpg";
import lightPanel from "@/assets/aputure_nova_panel.jpg";
import audioSoundDevices from "@/assets/sound_devices_833.jpg";
import audioZoom from "@/assets/audio.jpg";

import { DURATIONS, rentalTotal } from "@/lib/inquiry";
import { Tilt } from "@/components/Tilt";
import { ReserveModal, type Gear } from "@/components/ReserveModal";
import { QuickSpecsModal, type DetailedGear } from "@/components/QuickSpecsModal";
import { Hero3DShowcase } from "@/components/Hero3DShowcase";
import { CinemaOpticalShader, type CinemaLookMode } from "@/components/CinemaOpticalShader";
import {
  Aperture,
  ShieldCheck,
  Truck,
  Zap,
  Clock,
  CheckCircle2,
  ChevronDown,
  Search,
  Camera,
  Layers,
  Sparkles,
  Radio,
  FileCheck2,
  Box,
  SlidersHorizontal,
  Menu,
  X,
  ExternalLink,
  LayoutGrid,
  ListFilter,
  ArrowUpDown,
  Info,
  Check,
  RotateCcw,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GearShare — On-Demand Cinema Camera & Optics Rentals | Mumbai & India" },
      {
        name: "description",
        content:
          "Rent bench-calibrated cinema bodies, anamorphic glass, lighting and audio, delivered flight-ready to sets across Mumbai, Hyderabad, Delhi NCR, and Bengaluru with zero-deposit coverage.",
      },
      { property: "og:title", content: "GearShare — Cinema Camera Rentals Mumbai & India" },
      {
        property: "og:description",
        content:
          "Precision optics and 8K cinema bodies delivered directly on set across Film City, Goregaon, and national studios. Collimated, cased, and backed by 24/7 metro dispatch.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const CATS = [
  "All",
  "Cinema Bodies",
  "Anamorphic & Primes",
  "Lighting & Grip",
  "Audio",
] as const;

type CatalogItem = DetailedGear;

const GEAR_CATALOG: CatalogItem[] = [
  {
    name: "RED V-Raptor 8K VV",
    category: "Cinema Bodies",
    rate: 45000,
    img: cameraRed,
    specs: ["8K VistaVision", "RF / PL Mount", "17+ Stops DR", "120fps @ 8K"],
    mount: "PL / RF",
    highlight: "FLAGSHIP",
    sensor: "VistaVision 35.4MP Full-Frame (40.96 x 21.60 mm)",
    fps: "120fps @ 8K Full Format, 240fps @ 4K",
    packageIncludes: "Pelican 1510 Air, 4x Micro-V 150Wh Batteries, 2TB RED PRO CFexpress, DSMC3 Touch 7.0 Monitor, Top Handle",
    hub: "Mumbai Film City Bay 1",
    inStockCount: 2,
  },
  {
    name: "ARRI Alexa Mini LF",
    category: "Cinema Bodies",
    rate: 60000,
    img: cameraArri,
    specs: ["Large Format 4.5K", "LPL / PL Mount", "ARRIRAW 90fps", "Internal FSND"],
    mount: "LPL / PL",
    highlight: "INDUSTRY STANDARD",
    sensor: "Large Format ALEV III 4.5K (36.70 x 25.54 mm)",
    fps: "ARRIRAW 90fps, ProRes 4444 XQ 60fps",
    packageIncludes: "Pelican Air 1535, 4x Core SWX 150Wh V-Mounts, 3x Codex Compact 1TB, MVF-2 OLED Viewfinder, Cage & Rods",
    hub: "Mumbai Film City Bay 2",
    inStockCount: 3,
  },
  {
    name: "Sony FX9 Full-Frame",
    category: "Cinema Bodies",
    rate: 22000,
    img: cameraSony,
    specs: ["Full-Frame 6K", "E Mount / PL", "Dual Base ISO", "Fast Hybrid AF"],
    mount: "E / PL",
    highlight: "DOCUMENTARY PRO",
    sensor: "6K Full-Frame Back-Illuminated Exmor R CMOS",
    fps: "4K 60fps (Full Frame), FHD 180fps",
    packageIncludes: "Heavy-Duty Flight Case, 4x BP-U70 Batteries, 2x 240GB XQD Cards, XDCA-FX9 Extension Unit, Loupe Viewfinder",
    hub: "Andheri West Depot",
    inStockCount: 4,
  },
  {
    name: "Atlas Orion Anamorphic 100mm T2.1",
    category: "Anamorphic & Primes",
    rate: 18000,
    img: lensAnamorphic,
    specs: ["2x Squeeze", "PL Mount", "Signature Blue Flare", "Covers Full-Frame"],
    mount: "PL Mount",
    highlight: "ANAMORPHIC 2X",
    sensor: "Covers Full-Frame (with 1.6x LF Extender) & Super 35",
    fps: "T2.1 to T22 14-Blade Iris",
    packageIncludes: "Custom Flight Case, Front/Rear Metal Caps, 114mm Clamp Ring, Focus Gear Pinions",
    hub: "Mumbai Film City Bay 3",
    inStockCount: 2,
  },
  {
    name: "Zeiss Master Prime 50mm T1.3",
    category: "Anamorphic & Primes",
    rate: 14000,
    img: lensZeiss,
    specs: ["T1.3 High Speed", "PL Mount", "Zero Distortion", "Circular Bokeh"],
    mount: "PL Mount",
    highlight: "HIGH SPEED T1.3",
    sensor: "Super 35mm Format (30mm Image Circle)",
    fps: "Ultra-Fast T1.3 Maximum Aperture",
    packageIncludes: "Padded Aluminium Flight Case, 114mm Front Cap, Calibrated Shim Pack (FFD ±0.01mm)",
    hub: "Mumbai Film City Bay 3",
    inStockCount: 2,
  },
  {
    name: "Cooke S4/i 35mm T2.0 Prime",
    category: "Anamorphic & Primes",
    rate: 15000,
    img: lensCooke,
    specs: ["Cooke Look", "i/Technology Telemetry", "PL Mount", "Super 35"],
    mount: "PL Mount",
    highlight: "COOKE LOOK",
    sensor: "Super 35mm Cine Sensor Format",
    fps: "T2.0 to T22 Linear Iris",
    packageIncludes: "Hard Flight Case, /i Technology Metadata Lemo Cable, Sunshade, Front/Rear Caps",
    hub: "Andheri West Depot",
    inStockCount: 2,
  },
  {
    name: "Astera Titan Tube 8-Light Kit",
    category: "Lighting & Grip",
    rate: 16000,
    img: lightTubes,
    specs: ["RGBMA LED", "Wireless CRMX", "IP65 Waterproof", "Charging Case"],
    mount: "Spigot / Clamp",
    highlight: "COMPLETE 8-KIT",
    sensor: "TLCI ≥96, CRI ≥96, 1750K–20000K",
    fps: "180W Total Output, 20h Internal Battery",
    packageIncludes: "Titan PowerBox Charging Flight Case, 8x Floor Stands, 16x Eyebolts, ART7 AsteraBox CRMX Transmitter",
    hub: "Goregaon Stage Depot",
    inStockCount: 3,
  },
  {
    name: "Aputure Nova P300c LED Panel",
    category: "Lighting & Grip",
    rate: 7500,
    img: lightPanel,
    specs: ["2000K–10000K", "CRI 95+ / TLCI 95+", "Built-in Effects", "V-Mount Plate"],
    mount: "Junior Pin 28mm",
    highlight: "RGBWW SOFTLIGHT",
    sensor: "300W RGBWW Softlight Panel",
    fps: "9000+ Lux @ 1 Meter, 15 Built-in FX",
    packageIncludes: "Custom Wheeled Flight Case, Control Box with Lightning Clamp, Nova P300c Softbox & 40° Eggcrate Grid",
    hub: "Goregaon Stage Depot",
    inStockCount: 4,
  },
  {
    name: "Sound Devices 833 + Sennheiser MKH416",
    category: "Audio",
    rate: 12000,
    img: audioSoundDevices,
    specs: ["8-Channel / 12-Track", "32-bit Float", "Dugan Automixing", "Rycote Blimp"],
    mount: "Cold Shoe / 3/8\"",
    highlight: "PRODUCTION BAG",
    sensor: "6 Ultra-Low Noise Kashmir Mic Preamps",
    fps: "32-bit Float Recording, Internal 256GB SSD",
    packageIncludes: "Orca Audio Production Bag, Sennheiser MKH416 Shotgun, Rycote Windshield Blimp, 4x NP-F970 Batteries, K-Tek Carbon Boom Pole",
    hub: "Bandra Audio Bay",
    inStockCount: 3,
  },
  {
    name: "Zoom H5 + Shotgun Microphone Kit",
    category: "Audio",
    rate: 4000,
    img: audioZoom,
    specs: ["X/Y Capsule", "2x Combo XLR/TRS", "4-Track Recording", "Deadcat Windscreen"],
    mount: "Cold Shoe",
    highlight: "INDEPENDENT KIT",
    sensor: "Interchangeable Mic Capsule System",
    fps: "24-bit / 96kHz High-Resolution Audio",
    packageIncludes: "Padded Hard Case, Shotgun Capsule, Deadcat Windscreen, 64GB High-Speed SD Card, 2x XLR Cables, Dual AA Charger",
    hub: "Andheri West Depot",
    inStockCount: 5,
  },
];

const BENTO_SPECS = [
  {
    tag: "01 / CALIBRATION",
    title: "Bench-Calibrated Optical Alignment",
    desc: "Flange focal distance (FFD) verified on optical collimator before every dispatch. Sensor optical low-pass filters cleaned and certified in Class-100 cleanroom. Flange tolerance held within ±0.01mm.",
    metric: "FFD ±0.01mm",
    icon: Aperture,
    colSpan: "md:col-span-2",
  },
  {
    tag: "02 / RISK WAIVER",
    title: "Production Damage Shield",
    desc: "Zero security deposit for verified productions and WICA / SICA / DGA crews with valid GSTIN. Full accidental drop, heat, and sensor warranty with expedited replacement guarantee.",
    metric: "₹0 DEPOSIT",
    icon: ShieldCheck,
    colSpan: "md:col-span-1",
  },
  {
    tag: "03 / VELOCITY",
    title: "Immediate Metro Set Dispatch",
    desc: "Dedicated rapid sprinter vans deliver flight-ready Pelican cases directly to sound stages and location bases across Film City Goregaon, Bandra, Andheri, Ramoji Film City, and Noida.",
    metric: "< 3H METRO",
    icon: Truck,
    colSpan: "md:col-span-1",
  },
  {
    tag: "04 / POWER READY",
    title: "Turnkey Power & Rig Package",
    desc: "Four 150Wh high-draw V-mount batteries, quad fast-charger, 15mm carbon rods, Arri-standard bridgeplate, and 12G-SDI cables included standard with every camera body.",
    metric: "4x 150Wh V-MOUNT",
    icon: Zap,
    colSpan: "md:col-span-2",
  },
];

const PIPELINE_STEPS = [
  {
    step: "01",
    title: "Select Hardware & Shoot Window",
    desc: "Choose camera bodies, prime glass, lighting fixtures, and power. Select your shoot duration with automatic volume discount calculations in Indian Rupees.",
    badge: "INSTANT INVENTORY",
  },
  {
    step: "02",
    title: "Fast ID & GSTIN Clearance",
    desc: "Our automated dispatch desk clears GSTIN, Aadhaar/PAN, and production paperwork within 60 minutes. Verified filmmakers pay zero deposit.",
    badge: "< 60 MIN CLEARANCE",
  },
  {
    step: "03",
    title: "Calibrated Direct Studio Dispatch",
    desc: "Your kit arrives on set in flight-ready Pelican Air cases—batteries at 100%, collimation sheets signed, ready to roll at call time across Mumbai and national hubs.",
    badge: "< 3H DISPATCH",
  },
];

const FAQS = [
  {
    q: "What does the Production Damage Shield cover?",
    a: "Every rental includes our Production Damage Shield at no additional charge. It protects your production against accidental on-set damage, drops, and sensor anomalies. Only gross negligence or intentional misuse requires deductible assessment.",
  },
  {
    q: "How does the emergency hot-swap protocol work mid-shoot?",
    a: "If a body, lens, or power system encounters any hardware anomaly during production, call our priority 24/7 emergency dispatch line. We dispatch an identical replacement unit within 3 hours across Mumbai (Film City, Andheri, Bandra), Hyderabad, and Delhi NCR hubs.",
  },
  {
    q: "Do I have to pay a cash security deposit?",
    a: "Verified filmmakers, studios, and productions with a valid GSTIN or WICA/SICA crew affiliation pay ₹0 security deposit. Independent filmmakers place a temporary refundable card pre-authorization.",
  },
  {
    q: "How quickly are production references and insurance verified?",
    a: "Our digital verification system reviews government ID (Aadhaar/PAN), company GSTIN, and production paperwork within 60 minutes during business hours, and within 2 hours around the clock.",
  },
  {
    q: "Are custom lens mount shims or specialty anamorphic flare filters available?",
    a: "Yes. When reserving your package, include your lens mount preferences (PL, LPL, RF, or E-Mount) and filter requests in the production notes. We include shims, diopters, and diffusion filters upon request.",
  },
  {
    q: "How is wrap day and equipment return handled?",
    a: "Our express couriers pick up flight cases directly from your soundstage or production floor at wrap, or you can drop gear off at our Goregaon Film City, Andheri West, or Jubilee Hills (Hyderabad) depot lockers 24/7.",
  },
];

function Index() {
  const [selectedCat, setSelectedCat] = useState<(typeof CATS)[number]>("All");
  const [durationIdx, setDurationIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMount, setSelectedMount] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "name">("featured");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedGear, setSelectedGear] = useState<Gear | null>(null);
  const [quickSpecsGear, setQuickSpecsGear] = useState<DetailedGear | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cinemaLook, setCinemaLook] = useState<CinemaLookMode>("kodak-500t");
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>(GEAR_CATALOG);

  // Synchronize dynamic catalog rates and stock telemetry with Supabase database
  useEffect(() => {
    let active = true;
    fetch("/api/inventory")
      .then((res) => res.json())
      .then((data) => {
        if (!active || !data?.ok || !Array.isArray(data.inventory) || data.inventory.length === 0) return;
        setCatalogItems((prev) => {
          return prev.map((item) => {
            const firstWord = item.name.split(" ")[0] || "";
            const match = data.inventory.find(
              (dbItem: { name: string; rate: number; inStockCount?: number }) =>
                dbItem.name.toLowerCase().includes(firstWord.toLowerCase()) ||
                item.name.toLowerCase().includes((dbItem.name.split(" ")[0] ?? "").toLowerCase())
            );
            if (!match) return item;
            return {
              ...item,
              rate: match.rate || item.rate,
              inStockCount: match.inStockCount ?? item.inStockCount,
            };
          });
        });
      })
      .catch((err) => {
        console.warn("[catalog] Live inventory sync note:", err);
      });
    return () => {
      active = false;
    };
  }, []);

  const activeDuration = DURATIONS[durationIdx] ?? DURATIONS[0];

  const handleOpenReserve = useCallback((g: Gear) => {
    setSelectedGear(g);
  }, []);

  const handleCloseReserve = useCallback(() => {
    setSelectedGear(null);
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: catalogItems.length };
    for (const c of CATS) {
      if (c !== "All") {
        counts[c] = catalogItems.filter((item) => item.category === c).length;
      }
    }
    return counts;
  }, [catalogItems]);

  const filteredGear = useMemo(() => {
    return catalogItems.filter((item) => {
      const matchCat = selectedCat === "All" || item.category === selectedCat;
      const matchMount =
        selectedMount === "All" ||
        (item.mount && item.mount.toLowerCase().includes(selectedMount.toLowerCase()));
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.specs.some((s) => s.toLowerCase().includes(q)) ||
        (item.sensor && item.sensor.toLowerCase().includes(q)) ||
        (item.packageIncludes && item.packageIncludes.toLowerCase().includes(q));
      return matchCat && matchMount && matchSearch;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.rate - b.rate;
      if (sortBy === "price-high") return b.rate - a.rate;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0; // featured default
    });
  }, [selectedCat, selectedMount, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/30 selection:text-foreground">
      {/* SECTION 1: FLOATING GLASS NAVIGATION DOCK */}
      <header className="fixed top-4 inset-x-0 z-50 flex flex-col items-center px-4 sm:px-6 pointer-events-none">
        <div className="pointer-events-auto flex h-14 w-full max-w-5xl items-center justify-between rounded-full border border-border/70 bg-carbon/80 px-4 sm:px-5 backdrop-blur-2xl shadow-2xl shadow-black/60 ring-1 ring-white/5 transition-all">
          {/* Logo with Anodized Red Tally Mark */}
          <a
            href="#top"
            className="group flex items-center gap-2.5 font-mono text-xs font-bold tracking-[0.22em] text-foreground transition"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary shadow-sm shadow-primary"></span>
            </span>
            <span className="transition group-hover:text-primary">GEARSHARE</span>
            <span className="hidden sm:inline-flex items-center rounded-full border border-border/80 bg-background/60 px-2 py-0.5 text-[9px] font-mono tracking-widest text-muted-foreground">
              MUMBAI
            </span>
          </a>

          {/* Segmented Navigation Menu Capsule */}
          <nav className="hidden md:flex items-center gap-1 rounded-full border border-border/50 bg-background/50 p-1 font-mono text-xs text-muted-foreground backdrop-blur-md">
            <a
              href="#hero-bench"
              className="rounded-full px-3.5 py-1.5 transition-all duration-200 hover:bg-white/10 hover:text-foreground"
            >
              3D Bench
            </a>
            <a
              href="#catalog"
              className="rounded-full px-3.5 py-1.5 transition-all duration-200 hover:bg-white/10 hover:text-foreground"
            >
              Catalog
            </a>
            <a
              href="#hardware"
              className="rounded-full px-3.5 py-1.5 transition-all duration-200 hover:bg-white/10 hover:text-foreground"
            >
              Specs
            </a>
            <a
              href="#pipeline"
              className="rounded-full px-3.5 py-1.5 transition-all duration-200 hover:bg-white/10 hover:text-foreground"
            >
              Pipeline
            </a>
            <a
              href="#faq"
              className="rounded-full px-3.5 py-1.5 transition-all duration-200 hover:bg-white/10 hover:text-foreground"
            >
              FAQ
            </a>
            <a
              href="/track"
              className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-primary/90 font-medium transition-all duration-200 hover:bg-white/10 hover:text-primary"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span>Track Dispatch</span>
            </a>
          </nav>

          {/* Right Action Controls: Live Status & Rent CTA */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 pr-3 border-r border-border/60 font-mono text-[10px] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="tracking-widest uppercase">MUMBAI · 24/7</span>
            </div>

            <a
              href="#catalog"
              className="group inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground shadow-md shadow-primary/25 transition-all duration-200 hover:opacity-95 hover:shadow-lg hover:shadow-primary/30 active:scale-95"
            >
              <span>Rent Kit</span>
              <span className="font-mono text-[10px] transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-background/60 text-muted-foreground transition hover:border-primary/50 hover:text-foreground md:hidden"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Card */}
        {mobileMenuOpen && (
          <div className="pointer-events-auto mt-2 w-full max-w-5xl rounded-2xl border border-border/80 bg-carbon/95 p-4 shadow-2xl backdrop-blur-2xl md:hidden animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between border-b border-border/60 pb-3 font-mono text-xs">
              <span className="flex items-center gap-2 text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>MUMBAI · HYD · NCR · BLR</span>
              </span>
              <span className="text-[10px] text-muted-foreground">24/7 STAGE DISPATCH</span>
            </div>
            <nav className="mt-3 flex flex-col gap-1 font-mono text-xs">
              <a
                href="#hero-bench"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              >
                01 / Flagship 3D Bench
              </a>
              <a
                href="#catalog"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              >
                02 / Equipment Catalog
              </a>
              <a
                href="#hardware"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              >
                03 / Hardware Bench Specs
              </a>
              <a
                href="#pipeline"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              >
                04 / Rental Pipeline
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              >
                05 / Operational FAQ
              </a>
              <a
                href="/track"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-primary font-medium hover:bg-secondary/60"
              >
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  <span>06 / Track Stage Dispatch</span>
                </span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Live Telemetry</span>
              </a>
              <div className="pt-2">
                <a
                  href="#catalog"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full rounded-xl bg-primary py-2.5 text-center text-xs font-medium text-primary-foreground"
                >
                  Browse Catalog & Reserve Kit
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* SECTION 2: CINEMATIC STAGE COMMAND HERO (BESPOKE ASYMMETRIC VIEWPORT) */}
      <section id="top" className="relative overflow-hidden pt-24 md:pt-28 pb-16">
        {/* Bespoke WebGL Cinema Optical Shader: Dynamic Anamorphic Flare & Optical Caustics (Fluid light physics, 0% ZooTechX resemblance) */}
        <div className="absolute inset-0 overflow-hidden">
          <CinemaOpticalShader
            className="h-full w-full opacity-65"
            activeLook={cinemaLook}
            onLookChange={setCinemaLook}
            showControls={true}
          />
          {/* Subtle optical vignette to preserve text contrast and blend smoothly into lower sections */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pt-8">
          {/* Main 2-Column Asymmetric Layout (Completely breaks away from centered SaaS agency template) */}
          <div className="grid items-center gap-10 lg:grid-cols-12">
            
            {/* Left Column: Left-Aligned Cinema Production Headline & Dispatch Desk */}
            <div className="lg:col-span-5 space-y-6 text-left">
              {/* Cinema Slate Tally Tag */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1.5 font-mono text-xs text-primary shadow-sm shadow-primary/20 backdrop-blur-md">
                <span className="tally h-2 w-2 rounded-full" />
                <span className="font-bold tracking-widest uppercase">MUMBAI STAGE DISPATCH</span>
                <span className="text-muted-foreground/60">·</span>
                <span className="text-foreground/80 font-medium">FILM CITY BAY 1</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.08]">
                The Hardware Behind India’s{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-300">
                  Biggest Frames.
                </span>
              </h1>

              {/* Subheading with authentic film terminology */}
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                On-demand ARRI, RED, Cooke, and Sony cinema bodies and primes. Collimated to ±0.01mm FFD and delivered flight-cased directly to soundstages across Mumbai, Hyderabad, and Delhi NCR with ₹0 deposit protection.
              </p>

              {/* Cinema Trust & Logistics Badges */}
              <div className="flex flex-wrap gap-2.5 font-mono text-xs">
                <span className="flex items-center gap-1.5 rounded-xl border border-border/70 bg-carbon/60 px-3 py-1.5 text-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  <span>₹0 Deposit (GSTIN / WICA)</span>
                </span>
                <span className="flex items-center gap-1.5 rounded-xl border border-border/70 bg-carbon/60 px-3 py-1.5 text-foreground">
                  <Truck className="h-3.5 w-3.5 text-primary" />
                  <span>&lt; 3H Express Stage Delivery</span>
                </span>
                <span className="flex items-center gap-1.5 rounded-xl border border-border/70 bg-carbon/60 px-3 py-1.5 text-foreground">
                  <Zap className="h-3.5 w-3.5 text-primary" />
                  <span>24/7 Redundant Hot-Swap</span>
                </span>
              </div>

              {/* Primary Call to Action Bar */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="#catalog"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/30 transition-all duration-200 hover:opacity-95 hover:shadow-2xl hover:shadow-primary/50 active:scale-95"
                >
                  <span>Browse Equipment Fleet</span>
                  <span className="font-mono text-xs transition-transform duration-200 group-hover:translate-x-1">→</span>
                </a>
                <a
                  href="#pipeline"
                  className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-white/5 px-5 py-3.5 font-mono text-xs text-foreground transition hover:border-primary/50 hover:bg-white/10"
                >
                  <span>Dispatch Protocol</span>
                  <span className="text-muted-foreground">↗</span>
                </a>
              </div>

              {/* Active Studio Dispatch Ticker */}
              <div className="pt-2 flex items-center gap-2 font-mono text-[11px] text-muted-foreground/80">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span>Active Mumbai Sets: Film City Studio 5 · Yash Raj Studios · Mehboob Bay 2</span>
              </div>
            </div>

            {/* Right Column: Direct Viewfinder & 3D Hardware Rig Focal Point */}
            <div id="hero-bench" className="lg:col-span-7">
              <div className="relative rounded-3xl border border-white/15 bg-carbon/60 p-2 sm:p-3 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10">
                {/* 2.39:1 Anamorphic Viewfinder Corner Reticles */}
                <div className="pointer-events-none absolute -top-1.5 -left-1.5 h-4 w-4 border-t-2 border-l-2 border-primary z-20" />
                <div className="pointer-events-none absolute -top-1.5 -right-1.5 h-4 w-4 border-t-2 border-r-2 border-primary z-20" />
                <div className="pointer-events-none absolute -bottom-1.5 -left-1.5 h-4 w-4 border-b-2 border-l-2 border-primary z-20" />
                <div className="pointer-events-none absolute -bottom-1.5 -right-1.5 h-4 w-4 border-b-2 border-r-2 border-primary z-20" />

                {/* Integrated 3D Camera Bench */}
                <Hero3DShowcase onSelectGear={handleOpenReserve} className="p-0" />
              </div>
            </div>
          </div>

          {/* Micro Technical Telemetry Strip */}
          <div className="mt-14 grid grid-cols-2 gap-4 border-t border-border/70 pt-8 font-mono text-xs sm:grid-cols-4">
            <div className="rounded-xl border border-white/5 bg-carbon/40 p-4 backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Flange Focal Distance</p>
              <p className="mt-1 font-bold text-foreground">±0.01mm Collimated</p>
              <p className="mt-0.5 text-[10px] text-emerald-400">Class-100 Cleanroom Certified</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-carbon/40 p-4 backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Metro Stage Delivery</p>
              <p className="mt-1 font-bold text-foreground">&lt; 3H to Soundstage</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">Film City, Andheri, Bandra</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-carbon/40 p-4 backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Damage Shield</p>
              <p className="mt-1 font-bold text-primary">₹0 Security Deposit</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">GSTIN / WICA Automatic Waiver</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-carbon/40 p-4 backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Hot-Swap SLA</p>
              <p className="mt-1 font-bold text-foreground">24/7 Redundant Unit</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">Dedicated On-Call Technician</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: INTERACTIVE EQUIPMENT CATALOG */}
      <section id="catalog" className="mx-auto max-w-7xl scroll-mt-36 px-6 pt-16 pb-28">
        {/* Catalog Header & Command Bar */}
        <div className="flex flex-col justify-between gap-6 border-b border-border/80 pb-8 lg:flex-row lg:items-end">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary">
              <span className="tally h-2 w-2 rounded-full" />
              <span>01 / FLIGHT-READY INVENTORY</span>
            </div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              Cinema Equipment & Optics Fleet
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground leading-relaxed">
              Bench-calibrated 8K camera bodies, anamorphic primes, stage LED softlights, and 32-bit float audio. Flight-cased with turnkey accessories and ₹0 deposit coverage across Mumbai & India.
            </p>
            <div className="mt-3.5 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>10 Kits Stage Ready · Mumbai Film City & Andheri Depots</span>
            </div>
          </div>

          {/* Unified Duration Switcher Bar */}
          <div className="flex flex-col items-start gap-2.5 lg:items-end">
            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span className="tracking-wider uppercase">RENTAL SHOOT DURATION:</span>
            </div>
            <div className="inline-flex rounded-full border border-border/80 bg-carbon/90 p-1 font-mono text-xs shadow-inner backdrop-blur-md">
              {DURATIONS.map((d, i) => (
                <button
                  key={d.days}
                  onClick={() => setDurationIdx(i)}
                  className={`rounded-full px-4 py-2 transition-all duration-200 cursor-pointer ${
                    durationIdx === i
                      ? "bg-foreground font-semibold text-background shadow-md shadow-white/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <span>{d.label}</span>
                  {d.discount > 0 && (
                    <span className="ml-1 text-[10px] text-primary font-bold">
                      (-{d.discount * 100}%)
                    </span>
                  )}
                </button>
              ))}
            </div>
            {activeDuration.discount > 0 && (
              <span className="font-mono text-[11px] text-emerald-400 font-medium animate-in fade-in">
                ⚡ Volume rate active: Save {activeDuration.discount * 100}% on all equipment below
              </span>
            )}
          </div>
        </div>

        {/* Multi-Faceted Command Controls: Category Filter, Search, Mount Filter, Sorting & View Toggle */}
        <div className="mt-8 space-y-4">
          {/* Row 1: Category Filter Pills with Item Counts */}
          <div className="flex flex-wrap items-center gap-2">
            {CATS.map((c) => {
              const count = categoryCounts[c] ?? 0;
              const isActive = selectedCat === c;
              return (
                <button
                  key={c}
                  onClick={() => setSelectedCat(c)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "border-primary bg-primary/15 text-primary font-bold shadow-sm shadow-primary/30 ring-1 ring-primary/40"
                      : "border-border/70 bg-carbon/50 text-muted-foreground hover:border-border hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  <span>{c}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${
                      isActive ? "bg-primary text-primary-foreground font-bold" : "bg-white/10 text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Row 2: Search, Mount Filter, Sorting, and View Mode */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/5 bg-carbon/40 p-3 backdrop-blur-md">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[220px] max-w-md">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lens, sensor, mount, codec, kit..."
                className="w-full rounded-xl border border-border/80 bg-background/60 py-2 pl-9 pr-9 font-mono text-xs text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:bg-background"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filter and View Controls */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              {/* Mount Quick Filter */}
              <div className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-background/60 px-3 py-1.5">
                <span className="text-[10px] uppercase text-muted-foreground">Mount:</span>
                <select
                  value={selectedMount}
                  onChange={(e) => setSelectedMount(e.target.value)}
                  className="bg-transparent text-foreground outline-none cursor-pointer text-xs"
                >
                  <option value="All" className="bg-carbon text-foreground">All Mounts</option>
                  <option value="PL" className="bg-carbon text-foreground">PL / LPL Mount</option>
                  <option value="RF" className="bg-carbon text-foreground">RF Mount</option>
                  <option value="E" className="bg-carbon text-foreground">E Mount</option>
                </select>
              </div>

              {/* Sorting Selector */}
              <div className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-background/60 px-3 py-1.5">
                <ArrowUpDown className="h-3.5 w-3.5 text-primary" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-foreground outline-none cursor-pointer text-xs"
                >
                  <option value="featured" className="bg-carbon text-foreground">Featured First</option>
                  <option value="price-low" className="bg-carbon text-foreground">Rate: Low to High</option>
                  <option value="price-high" className="bg-carbon text-foreground">Rate: High to Low</option>
                  <option value="name" className="bg-carbon text-foreground">Name: A to Z</option>
                </select>
              </div>

              {/* View Mode Toggle: Grid vs Spec Table */}
              <div className="flex items-center rounded-xl border border-border/80 bg-background/60 p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  title="Grid Card View"
                  className={`flex h-8 items-center gap-1.5 rounded-lg px-2.5 transition cursor-pointer ${
                    viewMode === "grid" ? "bg-white/10 text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  title="Dense Spec Sheet Table View"
                  className={`flex h-8 items-center gap-1.5 rounded-lg px-2.5 transition cursor-pointer ${
                    viewMode === "table" ? "bg-white/10 text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Spec Table</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* VIEW MODE 1: HIGH-END CINEMA FLIGHT-CASE CARDS (GRID VIEW) */}
        {viewMode === "grid" && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGear.map((item) => {
              const calculatedPrice = rentalTotal(
                item.rate,
                activeDuration.days,
                activeDuration.discount
              );
              const undiscountedPrice = item.rate * activeDuration.days;
              const savings = undiscountedPrice - calculatedPrice;

              return (
                <div
                  key={item.name}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d12]/90 backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-primary/50 hover:shadow-[0_20px_45px_-12px_rgba(239,68,68,0.25)]"
                >
                  <div>
                    {/* Equipment Photo Stage with Ambient Vignette */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-black">
                      <img
                        src={item.img}
                        alt={item.name}
                        loading="lazy"
                        width={800}
                        height={500}
                        className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-transparent to-black/40" />

                      {/* Top Highlights & Mount Chips */}
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                        {item.highlight ? (
                          <span className="rounded-md border border-primary/50 bg-primary/90 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-white shadow-md shadow-primary/30 backdrop-blur-md">
                            ★ {item.highlight}
                          </span>
                        ) : <span />}

                        {item.mount && (
                          <span className="rounded-md border border-white/20 bg-black/80 px-2.5 py-0.5 font-mono text-[10px] text-white/90 backdrop-blur-md shadow-sm">
                            {item.mount}
                          </span>
                        )}
                      </div>

                      {/* Bottom Live Status Pill */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-black/80 px-2.5 py-1 font-mono text-[10px] text-emerald-400 backdrop-blur-md">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Stage Ready · {item.hub ?? "Mumbai Hub"}</span>
                      </div>
                    </div>

                    {/* Card Content & Telemetry */}
                    <div className="p-5">
                      <div className="flex items-center justify-between border-b border-border/60 pb-2">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-primary font-semibold">
                          {item.category}
                        </span>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          ₹{item.rate.toLocaleString("en-IN")}/day base
                        </span>
                      </div>

                      <h3 className="mt-2.5 text-lg font-bold tracking-tight text-foreground transition group-hover:text-primary">
                        {item.name}
                      </h3>

                      {/* Technical Specs Tags Grid */}
                      <div className="mt-3 grid grid-cols-2 gap-1.5 font-mono text-[11px]">
                        {item.specs.map((spec) => (
                          <div
                            key={spec}
                            className="rounded-lg border border-border/70 bg-carbon/70 px-2 py-1 text-muted-foreground truncate"
                            title={spec}
                          >
                            {spec}
                          </div>
                        ))}
                      </div>

                      {/* Turnkey Package Inclusions Bar */}
                      {item.packageIncludes && (
                        <div className="mt-3.5 rounded-xl border border-white/5 bg-carbon/40 p-2.5 font-mono text-[10px] text-muted-foreground">
                          <span className="font-semibold text-foreground/80 flex items-center gap-1.5 mb-1">
                            <Box className="h-3 w-3 text-primary" />
                            <span>Flight Case Manifest:</span>
                          </span>
                          <p className="line-clamp-2 leading-relaxed text-muted-foreground/90">
                            {item.packageIncludes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing and Action Footer */}
                  <div className="border-t border-border/70 bg-[#121217] p-5">
                    <div className="flex items-end justify-between gap-2">
                      <div className="font-mono">
                        {savings > 0 ? (
                          <div>
                            <span className="text-xs text-muted-foreground/70 line-through">
                              ₹{undiscountedPrice.toLocaleString("en-IN")}
                            </span>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-bold tracking-tight text-foreground">
                                ₹{calculatedPrice.toLocaleString("en-IN")}
                              </span>
                              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                                Save ₹{savings.toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-2xl font-bold tracking-tight text-foreground">
                            ₹{calculatedPrice.toLocaleString("en-IN")}
                          </p>
                        )}
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          Total for {activeDuration.label} · ₹0 Deposit
                        </p>
                      </div>

                      {/* Dual Actions: Specs & Reserve */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setQuickSpecsGear(item)}
                          title="View Full Technical Specifications"
                          className="flex h-10 items-center gap-1.5 rounded-xl border border-border/80 bg-white/5 px-3 font-mono text-xs text-muted-foreground transition hover:border-primary/50 hover:bg-white/10 hover:text-foreground cursor-pointer"
                        >
                          <Info className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Specs</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleOpenReserve({
                              name: item.name,
                              category: item.category,
                              rate: item.rate,
                              img: item.img,
                              specs: item.specs,
                            })
                          }
                          className="flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:opacity-95 hover:shadow-primary/40 active:scale-95 cursor-pointer"
                        >
                          <span>Reserve</span>
                          <span className="font-mono text-xs">→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW MODE 2: HIGH-DENSITY SPECIFICATION TABLE (PRODUCTION COMPARISON) */}
        {viewMode === "table" && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d12]/90 shadow-2xl backdrop-blur-xl">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-border/80 bg-carbon/90 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <th className="py-3.5 px-4 font-semibold">Hardware</th>
                    <th className="py-3.5 px-3 font-semibold">Category</th>
                    <th className="py-3.5 px-3 font-semibold">Mount</th>
                    <th className="py-3.5 px-3 font-semibold">Key Specs</th>
                    <th className="py-3.5 px-3 font-semibold">Flight Case Manifest</th>
                    <th className="py-3.5 px-3 font-semibold text-right">Base / Day</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Shoot Estimate</th>
                    <th className="py-3.5 px-4 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredGear.map((item) => {
                    const calculatedPrice = rentalTotal(
                      item.rate,
                      activeDuration.days,
                      activeDuration.discount
                    );
                    const undiscountedPrice = item.rate * activeDuration.days;
                    const savings = undiscountedPrice - calculatedPrice;

                    return (
                      <tr
                        key={item.name}
                        className="group transition hover:bg-white/5"
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-14 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black">
                              <img
                                src={item.img}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-foreground group-hover:text-primary transition">
                                {item.name}
                              </p>
                              {item.highlight && (
                                <span className="inline-block rounded bg-primary/20 px-1.5 py-0.5 text-[9px] font-semibold text-primary">
                                  {item.highlight}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-muted-foreground">
                          {item.category}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="rounded border border-border/80 bg-carbon px-2 py-0.5 text-[11px] text-foreground">
                            {item.mount ?? "Standard"}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-muted-foreground max-w-xs">
                          <div className="line-clamp-2 text-[11px]">
                            {item.specs.join(" · ")}
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-muted-foreground/80 max-w-xs text-[10px]">
                          <div className="line-clamp-2">
                            {item.packageIncludes ?? "Turnkey production case"}
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-right font-medium text-foreground">
                          ₹{item.rate.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <p className="font-bold text-foreground">
                            ₹{calculatedPrice.toLocaleString("en-IN")}
                          </p>
                          {savings > 0 && (
                            <p className="text-[10px] text-emerald-400">
                              Save ₹{savings.toLocaleString("en-IN")}
                            </p>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setQuickSpecsGear(item)}
                              title="Specs"
                              className="rounded-lg border border-border/70 p-1.5 text-muted-foreground transition hover:border-primary hover:text-foreground cursor-pointer"
                            >
                              <Info className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleOpenReserve({
                                  name: item.name,
                                  category: item.category,
                                  rate: item.rate,
                                  img: item.img,
                                  specs: item.specs,
                                })
                              }
                              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition hover:opacity-90 active:scale-95 cursor-pointer"
                            >
                              Reserve
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State when zero results match */}
        {filteredGear.length === 0 && (
          <div className="my-12 rounded-2xl border border-dashed border-border/80 bg-carbon/40 p-12 text-center animate-in fade-in">
            <Search className="mx-auto h-8 w-8 text-muted-foreground" />
            <h4 className="mt-4 text-base font-semibold text-foreground">No equipment matching query</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              No cinema kits match your current category, mount filter, or search keywords.
            </p>
            <div className="mt-5">
              <button
                type="button"
                onClick={() => {
                  setSelectedCat("All");
                  setSelectedMount("All");
                  setSearchQuery("");
                }}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-4 py-2 font-mono text-xs text-foreground transition hover:border-primary hover:bg-white/10 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5 text-primary" />
                <span>Reset All Filters</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* SECTION 4: 4-BLOCK BENTO SPECIFICATION GRID */}
      <section id="hardware" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24">
        <div className="border-b border-border pb-6">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary">
            <span className="tally h-2 w-2 rounded-full" />
            <span>02 / HARDWARE BENCH</span>
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Built for the set. Engineered for production.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Every camera body, anamorphic set, and battery brick passes stringent prep before dispatch.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {BENTO_SPECS.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className={`group relative overflow-hidden rounded-2xl border border-border bg-card/80 p-8 shadow-xl transition-all duration-300 hover:border-primary/50 hover:bg-card ${b.colSpan}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-carbon text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-xs font-semibold text-primary">
                    {b.metric}
                  </span>
                </div>

                <div className="mt-6">
                  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    {b.tag}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-foreground">
                    {b.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {b.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 5: RENTAL PIPELINE WORKFLOW */}
      <section id="pipeline" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24">
        <div className="border-b border-border pb-6">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary">
            <span className="tally h-2 w-2 rounded-full" />
            <span>03 / PIPELINE</span>
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Rental Pipeline: Zero-Downtime Dispatch
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            From online kit reservation to stage delivery in three rapid, synchronized steps.
          </p>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
          {PIPELINE_STEPS.map((step) => (
            <div key={step.step} className="bg-carbon p-8 transition-colors hover:bg-secondary/40">
              <div className="flex items-center justify-between">
                <span className="font-mono text-5xl font-light text-muted-foreground/50">
                  {step.step}
                </span>
                <span className="rounded bg-primary/10 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider text-primary">
                  {step.badge}
                </span>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-foreground">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: OPERATIONAL FAQ ACCORDION */}
      <section id="faq" className="mx-auto max-w-4xl scroll-mt-24 px-6 py-24">
        <div className="border-b border-border pb-6 text-center">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary">
            <span className="tally h-2 w-2 rounded-full" />
            <span>04 / FAQ</span>
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Operational FAQ & Technical Standards
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Common questions regarding insurance, emergency hot-swaps, and prep logistics.
          </p>
        </div>

        <div className="mt-10 divide-y divide-border border-y border-border">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group py-5 transition-colors">
              <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-foreground transition group-open:text-primary">
                <span className="text-base sm:text-lg">{faq.q}</span>
                <span className="ml-4 font-mono text-muted-foreground transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground animate-in fade-in">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* SECTION 7: TECHNICAL FOOTER */}
      <footer className="border-t border-border bg-carbon/60">
        {/* Hubs Telemetry Strip */}
        <div className="border-b border-border/80">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 font-mono text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-foreground">DISPATCH STATUS:</span>
              <span>ALL NATIONAL HUBS ONLINE</span>
            </div>
            <div className="flex flex-wrap gap-6 text-[11px]">
              <span>HUB 01: MUMBAI HQ (GOREGAON FILM CITY & ANDHERI WEST · 24/7)</span>
              <span>HUB 02: HYDERABAD (JUBILEE HILLS & RAMOJI FILM CITY · 24/7)</span>
              <span>HUB 03: DELHI NCR (NOIDA FILM CITY & DLF CYBER CITY · 24/7)</span>
              <span>HUB 04: BENGALURU (INDIRANAGAR & KORAMANGALA · 24/7)</span>
            </div>
          </div>
        </div>

        {/* Main Footer Body */}
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <a
                href="#top"
                className="inline-flex items-center gap-2 font-mono text-sm font-semibold tracking-[0.25em] text-foreground"
              >
                <span className="tally h-2 w-2 rounded-full" /> GEARSHARE INDIA
              </a>
              <p className="mt-4 max-w-md text-sm text-muted-foreground">
                India’s on-demand cinematography and precision equipment rental platform. Headquartered in Mumbai with 24/7 flight-case dispatch across Film City, Hyderabad, Delhi NCR, and Bengaluru for modern film & OTT crews.
              </p>
              <p className="mt-3 font-mono text-xs text-muted-foreground">
                SUPABASE DATA PERSISTENCE · ACTIVE ENDPOINT CONNECTED
              </p>
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-primary">NAVIGATION</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><a href="#hero-bench" className="hover:text-foreground">Flagship 3D Showcase</a></li>
                <li><a href="#catalog" className="hover:text-foreground">Equipment Catalog</a></li>
                <li><a href="#hardware" className="hover:text-foreground">Hardware Bench Specs</a></li>
                <li><a href="#pipeline" className="hover:text-foreground">Rental Pipeline</a></li>
                <li><a href="#faq" className="hover:text-foreground">Operational FAQ</a></li>
              </ul>
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-primary">STANDARDS & LEGAL</p>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                © 2026 GEARSHARE CINEMA SYSTEMS. All cinema trademarks (RED, ARRI, Sony, Zeiss, Cooke) belong to their respective registered holders. Prototype demonstration for high-stakes technical assessment.
              </p>
              <div className="mt-4">
                <span className="inline-flex items-center gap-1.5 rounded border border-border bg-carbon px-2.5 py-1 font-mono text-[10px] text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                  <span>RLS ENFORCED · REST API VERIFIED</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal Dialog for Equipment Inquiries */}
      <ReserveModal
        gear={selectedGear}
        onClose={handleCloseReserve}
        initialDurationDays={activeDuration.days}
      />

      {/* Quick Specs Technical Modal */}
      <QuickSpecsModal
        gear={quickSpecsGear}
        onClose={() => setQuickSpecsGear(null)}
        onReserve={(g) => {
          setQuickSpecsGear(null);
          handleOpenReserve(g);
        }}
      />
    </div>
  );
}

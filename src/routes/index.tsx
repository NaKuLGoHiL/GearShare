import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import cameraSonyFX3 from "@/assets/sony_fx3.jpg";
import cameraCanonR5C from "@/assets/canon_r5c.jpg";
import cameraRed from "@/assets/camera.jpg";
import cameraArri from "@/assets/arri_camera.jpg";
import cameraSony from "@/assets/sony_fx9.jpg";
import lensSonyGM from "@/assets/sony_24_70_gm.jpg";
import lensAnamorphic from "@/assets/lens.jpg";
import lensZeiss from "@/assets/zeiss_master_prime.jpg";
import lensCooke from "@/assets/cooke_s4i_prime.jpg";
import lightAputure300d from "@/assets/aputure_300d.jpg";
import lightTubes from "@/assets/lighting_kit.jpg";
import lightPanel from "@/assets/aputure_nova_panel.jpg";
import audioSoundDevices from "@/assets/sound_devices_833.jpg";
import audioZoom from "@/assets/audio.jpg";

import { DURATIONS, rentalTotal } from "@/lib/inquiry";
import { Tilt } from "@/components/Tilt";
import { ReserveModal, type Gear } from "@/components/ReserveModal";
import { QuickSpecsModal, type DetailedGear } from "@/components/QuickSpecsModal";
import { Hero3DShowcase } from "@/components/Hero3DShowcase";
import { AppleScrollyCanvas } from "@/components/AppleScrollyCanvas";
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
  Sliders,
  Compass,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GearShare — Pro Cinema Camera & Optics Rentals | Framer Architecture" },
      {
        name: "description",
        content:
          "Reserve bench-calibrated cinema bodies, anamorphic primes, and lighting rigs with zero-friction checkout, 3-hour metro set dispatch, and ₹0 deposit production coverage.",
      },
      { property: "og:title", content: "GearShare — The Hardware Behind Cinema-Grade Frames" },
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
    name: "Sony FX3 Full-Frame Cinema",
    category: "Cinema Bodies",
    rate: 12000,
    img: cameraSonyFX3,
    specs: ["4K 120p 10-bit", "16-Bit RAW HDMI", "Dual Base ISO 800/12800", "Active Cooling"],
    mount: "Sony E Mount",
    highlight: "FLAGSHIP CINEMA",
    sensor: "12.1MP Full-Frame Back-Illuminated Exmor R CMOS",
    fps: "4K 120fps, FHD 240fps High-Speed",
    packageIncludes: "Top XLR Audio Handle, 4x NP-FZ100 Batteries, 2x 160GB CFexpress Type A, Dual Charger, Pelican Air 1485",
    hub: "Mumbai Film City Bay 1",
    inStockCount: 4,
  },
  {
    name: "Canon R5 C Cinema Line",
    category: "Cinema Bodies",
    rate: 15000,
    img: cameraCanonR5C,
    specs: ["8K 60p Cinema RAW", "RF Mount", "Dual Pixel CMOS AF II", "Active Fan Exhaust"],
    mount: "Canon RF Mount",
    highlight: "8K HYBRID CINE",
    sensor: "45MP Full-Frame CMOS Sensor (8K DCI 8192 x 4320)",
    fps: "8K 60fps RAW, 4K 120fps High Frame Rate",
    packageIncludes: "Pelican 1510 Hardcase, 4x LP-E6NH, 2x 512GB CFexpress Type B, Anker 65W PD Bank, SmallRig Cage",
    hub: "Andheri West Depot",
    inStockCount: 3,
  },
  {
    name: "ARRI Alexa Mini LF Mock",
    category: "Cinema Bodies",
    rate: 60000,
    img: cameraArri,
    specs: ["Large Format 4.5K", "LPL / PL Mount", "ARRIRAW 90fps", "Internal FSND"],
    mount: "LPL / PL",
    highlight: "INDUSTRY BENCHMARK",
    sensor: "Large Format ALEV III 4.5K (36.70 x 25.54 mm)",
    fps: "ARRIRAW 90fps, ProRes 4444 XQ 60fps",
    packageIncludes: "Pelican Air 1535, 4x Core SWX 150Wh V-Mounts, 3x Codex Compact 1TB, MVF-2 OLED Viewfinder, Cage & Rods",
    hub: "Mumbai Film City Bay 2",
    inStockCount: 3,
  },
  {
    name: "Sony FE 24-70mm f/2.8 GM II",
    category: "Anamorphic & Primes",
    rate: 4500,
    img: lensSonyGM,
    specs: ["Constant f/2.8", "4x XD Linear Motors", "De-Clickable Aperture", "Nano AR II"],
    mount: "Sony E Mount",
    highlight: "G MASTER ZOOM",
    sensor: "Full-Frame 35mm Format",
    fps: "f/2.8 to f/22 11-Blade Circular Iris",
    packageIncludes: "Weatherproof Hard Pouch, Front/Rear Caps, Petal Hood with Filter Door, 82mm Circular Polarizer",
    hub: "Andheri West Depot",
    inStockCount: 6,
  },
  {
    name: "Aputure Light Storm 300d II Kit",
    category: "Lighting & Grip",
    rate: 5500,
    img: lightAputure300d,
    specs: ["5500K Daylight", "55,000 Lux @ 0.5m", "Bowens Mount", "Wireless Sidus Link"],
    mount: "Baby 5/8\" Pin",
    highlight: "COB DAYLIGHT PRO",
    sensor: "CRI 96+, TLCI 97+, 350W Maximum Draw",
    fps: "0-100% Stepless Dimming, 8 Built-in Lighting FX",
    packageIncludes: "Heavy-Duty Wheeled Flight Case, 55° Hyper Reflector, All-in-One Control Box, 20-Foot Header Cable, C-Stand & Sandbag",
    hub: "Goregaon Stage Depot",
    inStockCount: 5,
  },
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

const PIPELINE_STEPS = [
  {
    step: "01",
    title: "Select Hardware",
    desc: "Choose cinema bodies, prime glass, lighting fixtures, and power. Select your shoot duration with automatic volume discount calculations in Indian Rupees.",
    badge: "INSTANT INVENTORY",
  },
  {
    step: "02",
    title: "15-min ID Check",
    desc: "Our automated dispatch desk clears GSTIN, Aadhaar/PAN, and production paperwork within 15 minutes. Verified filmmakers pay zero deposit.",
    badge: "< 15 MIN CLEARANCE",
  },
  {
    step: "03",
    title: "Studio Delivery",
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
    a: "Our digital verification system reviews government ID (Aadhaar/PAN), company GSTIN, and production paperwork within 15 to 30 minutes during business hours, and within 60 minutes around the clock.",
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

const FFD_PRESETS = [
  { mount: "ARRI PL", targetFfd: 52.000, measuredFfd: 52.002, dev: "+0.002mm", standard: "ARRI / Cooke Standard" },
  { mount: "ARRI LPL", targetFfd: 44.000, measuredFfd: 43.999, dev: "-0.001mm", standard: "Large Format ALEV Standard" },
  { mount: "Sony E", targetFfd: 18.000, measuredFfd: 18.003, dev: "+0.003mm", standard: "Mirrorless Cinema Standard" },
  { mount: "Canon RF", targetFfd: 20.000, measuredFfd: 20.000, dev: "0.000mm", standard: "Locking RF Cine Standard" },
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
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [selectedFfdIdx, setSelectedFfdIdx] = useState(0);

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
  }, [catalogItems, selectedCat, selectedMount, searchQuery, sortBy]);

  const currentFfd = FFD_PRESETS[selectedFfdIdx] ?? FFD_PRESETS[0]!;

  return (
    <div className="min-h-screen bg-[#050505] text-foreground relative selection:bg-red-500/30 selection:text-white antialiased overflow-x-clip">
      {/* BACKGROUND: Framer 24px x 24px Subtle Geometric Dot/Line Grid with Radial Edge Fade */}
      <div className="pointer-events-none fixed inset-0 framer-grid-lines framer-grid-mask z-0 opacity-80" />
      
      {/* SOFT RADIAL ILLUMINATION GRADIENTS */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[650px] bg-[radial-gradient(ellipse_at_top,rgba(239,68,68,0.14),transparent_65%)] blur-3xl z-0" />
      <div className="pointer-events-none absolute top-[900px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent_70%)] blur-3xl z-0" />
      <div className="pointer-events-none absolute top-[2200px] left-1/3 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.08),transparent_70%)] blur-3xl z-0" />

      {/* SECTION 1: FIXED APPLE-STYLE TRANSLUCENT NAVBAR */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-[#050505]/75 border-b border-zinc-800/50 transition-all">
        <div className="mx-auto max-w-7xl h-14 px-4 sm:px-6 flex items-center justify-between">
          {/* Brand mark with pulsing red tally light: ● GEARSHARE */}
          <a
            href="#overview"
            className="group flex items-center gap-2.5 font-mono text-xs font-bold tracking-[0.22em] text-white transition"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)]" />
            </span>
            <span className="transition group-hover:text-red-400">GEARSHARE</span>
          </a>

          {/* Links: Overview, Hardware, Scrollytech, Pricing, FAQ */}
          <nav className="hidden md:flex items-center gap-6 font-mono text-xs text-zinc-400">
            <a href="#overview" className="transition hover:text-white">
              Overview
            </a>
            <a href="#hardware" className="transition hover:text-white">
              Hardware
            </a>
            <a href="#scrollytech" className="transition hover:text-white">
              Scrollytech
            </a>
            <a href="#catalog" className="transition hover:text-white">
              Pricing
            </a>
            <a href="#faq" className="transition hover:text-white">
              FAQ
            </a>
            <a
              href="/track"
              className="flex items-center gap-1.5 text-red-400 transition hover:text-red-300"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              <span>Track Dispatch</span>
            </a>
          </nav>

          {/* Right Action: Anodized-red rounded pill "Rent Kit" */}
          <div className="flex items-center gap-3">
            <a
              href="#catalog"
              className="inline-flex items-center justify-center rounded-full bg-red-600 hover:bg-red-500 px-5 py-2 text-xs font-semibold text-white tracking-wide transition shadow-[0_0_20px_rgba(239,68,68,0.35)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] cursor-pointer"
            >
              <span>Rent Kit</span>
              <span className="ml-1 font-mono text-[10px]">→</span>
            </a>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition hover:border-white/20 hover:text-white md:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-zinc-800/80 bg-[#050505]/95 px-6 py-4 md:hidden animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono text-xs">
              <span className="flex items-center gap-2 text-zinc-400">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span>MUMBAI FLEET ACTIVE</span>
              </span>
              <span className="text-[10px] text-zinc-500">24/7 METRO DISPATCH</span>
            </div>
            <nav className="mt-3 flex flex-col gap-2 font-mono text-xs">
              <a
                href="#overview"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-zinc-300 hover:text-white"
              >
                01 / Overview
              </a>
              <a
                href="#scrollytech"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-zinc-300 hover:text-white"
              >
                02 / Scrollytech Breakdown
              </a>
              <a
                href="#catalog"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-zinc-300 hover:text-white"
              >
                03 / Pricing & Fleet Catalog
              </a>
              <a
                href="#hardware"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-zinc-300 hover:text-white"
              >
                04 / Hardware Bento Specs
              </a>
              <a
                href="#workflow"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-zinc-300 hover:text-white"
              >
                05 / Rental Workflow
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-zinc-300 hover:text-white"
              >
                06 / Operational FAQ
              </a>
              <a
                href="/track"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-red-400 font-semibold"
              >
                ● 07 / Track Soundstage Dispatch
              </a>
              <div className="pt-2">
                <a
                  href="#catalog"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center rounded-full bg-red-600 hover:bg-red-500 py-2.5 text-xs font-semibold text-white shadow-lg"
                >
                  Rent Kit →
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* SECTION 2: SCROLL-LINKED HERO CANVAS ENGINE (APPLE SCROLLYTELLING) */}
      <div id="overview" className="scroll-mt-14" />
      <AppleScrollyCanvas
        onRentClick={() => handleOpenReserve(catalogItems[0] ?? GEAR_CATALOG[0]!)}
      />

      {/* OPTICAL LUT SHADER TEST BENCH & 3D RIG SHOWCASE */}
      <section className="relative pt-16 pb-20 px-6 text-center z-10 border-t border-white/[0.06]">
        <div className="mx-auto max-w-5xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 font-mono text-[10px] tracking-widest text-zinc-300 shadow-sm backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span>CALIBRATED CINEMA FLEET • READY FOR SOUNDSTAGE DISPATCH</span>
          </div>

          <h2 className="mt-6 text-3xl sm:text-5xl md:text-6xl font-black tracking-[-0.04em] leading-[1.04] bg-gradient-to-b from-white via-white to-slate-400 bg-clip-text text-transparent">
            Real-Time Optical Physics & Sensor Rigging.
          </h2>

          <p className="mt-4 text-base text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Test custom chromatic anamorphic LUTs, inspect multi-axis rig tilt physics, and reserve zero-deposit cinema packages below.
          </p>

          {/* Optical LUT Shader Switcher & Interactive 3D Showcase */}
          <div className="relative mx-auto mt-12 max-w-5xl">
            <div className="pointer-events-none absolute -bottom-10 inset-x-12 h-24 bg-gradient-to-b from-white/[0.05] via-red-500/[0.04] to-transparent blur-xl rounded-full transform scale-y-50" />

            <div className="relative rounded-3xl border border-white/[0.08] bg-zinc-900/35 p-2 sm:p-3 shadow-2xl backdrop-blur-2xl ring-1 ring-white/5">
              <div className="pointer-events-none absolute -top-1.5 -left-1.5 h-4 w-4 border-t-2 border-l-2 border-red-500 z-20" />
              <div className="pointer-events-none absolute -top-1.5 -right-1.5 h-4 w-4 border-t-2 border-r-2 border-red-500 z-20" />
              <div className="pointer-events-none absolute -bottom-1.5 -left-1.5 h-4 w-4 border-b-2 border-l-2 border-red-500 z-20" />
              <div className="pointer-events-none absolute -bottom-1.5 -right-1.5 h-4 w-4 border-b-2 border-r-2 border-red-500 z-20" />

              <Hero3DShowcase onSelectGear={handleOpenReserve} className="p-0" />
            </div>

            {/* Optical LUT Switcher */}
            <div className="mt-6 flex items-center justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/80 px-4 py-2 font-mono text-xs backdrop-blur-xl shadow-lg">
                <Sparkles className="h-3.5 w-3.5 text-red-400" />
                <span className="text-zinc-400 uppercase text-[10px] tracking-wider">3-WAY OPTICAL LUT:</span>
                {(["kodak-500t", "anamorphic-cyan", "silver-noir"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setCinemaLook(mode)}
                    className={`rounded-full px-3 py-1 text-[11px] font-medium transition cursor-pointer ${
                      cinemaLook === mode
                        ? "bg-white/15 text-white shadow-sm ring-1 ring-white/20"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {mode === "kodak-500t" ? "Kodak 500T" : mode === "anamorphic-cyan" ? "Anamorphic Cyan" : "Silver Noir"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* SECTION 3: FRAMER-STYLE BENTO GRID CATALOG (INTERACTIVE CORE) */}
      <section id="catalog" className="relative mx-auto max-w-7xl px-6 pt-20 pb-32 z-10 scroll-mt-28">
        {/* Catalog Header & Command Deck */}
        <div className="flex flex-col justify-between gap-6 border-b border-white/[0.08] pb-8 lg:flex-row lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3.5 py-1 font-mono text-[10px] tracking-widest text-red-400 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              <span>INSTANT INVENTORY ACCESS</span>
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl text-white">
              Precision Cinema Fleet Ready for Set Call.
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-400 leading-relaxed">
              Bench-calibrated 8K camera bodies, anamorphic primes, stage LED softlights, and 32-bit float audio. Flight-cased with turnkey accessories and ₹0 deposit coverage across Mumbai & India.
            </p>
          </div>

          {/* Segmented Duration Switcher [1 Day | 3 Days (-10%) | 7 Days (-25%)] */}
          <div className="flex flex-col items-start gap-2 lg:items-end">
            <span className="font-mono text-[11px] tracking-wider uppercase text-zinc-400 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-red-400" />
              <span>RENTAL SHOOT DURATION</span>
            </span>
            <div className="inline-flex rounded-full border border-white/10 bg-zinc-950/80 p-1 font-mono text-xs backdrop-blur-xl shadow-inner">
              {DURATIONS.map((d, i) => (
                <button
                  key={d.days}
                  onClick={() => setDurationIdx(i)}
                  className={`rounded-full px-4 py-2 transition-all duration-200 cursor-pointer ${
                    durationIdx === i
                      ? "bg-white text-zinc-950 font-bold shadow-md"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{d.label}</span>
                  {d.discount > 0 && (
                    <span className="ml-1 text-[10px] text-red-500 font-bold">
                      (-{d.discount * 100}%)
                    </span>
                  )}
                </button>
              ))}
            </div>
            {activeDuration.discount > 0 && (
              <span className="font-mono text-[11px] text-emerald-400 font-medium">
                ⚡ Volume rate active: Save {activeDuration.discount * 100}% on all equipment below
              </span>
            )}
          </div>
        </div>

        {/* Category Filter Pills & Search Command Bar */}
        <div className="mt-8 space-y-4">
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
                      ? "border-red-500/50 bg-red-500/15 text-red-400 font-bold ring-1 ring-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                      : "border-white/10 bg-zinc-900/40 text-zinc-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <span>{c}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${
                      isActive ? "bg-red-500 text-white font-bold" : "bg-white/10 text-zinc-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Secondary Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-zinc-900/30 p-3 backdrop-blur-xl">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="pointer-events-none absolute left-3.5 top-2.5 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cinema bodies, primes, sensor, mounts..."
                className="w-full rounded-xl border border-white/10 bg-zinc-950/60 pl-10 pr-3.5 py-2 font-mono text-xs text-white placeholder:text-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500/40"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2 text-zinc-500 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-zinc-500">Mount:</span>
              <select
                value={selectedMount}
                onChange={(e) => setSelectedMount(e.target.value)}
                className="rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2 font-mono text-xs text-white outline-none cursor-pointer"
              >
                <option value="All">All Mounts</option>
                <option value="PL">PL Mount</option>
                <option value="LPL">LPL Mount</option>
                <option value="RF">RF Mount</option>
                <option value="E">E Mount</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2 font-mono text-xs text-white outline-none cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-low">Rate: Low to High</option>
                <option value="price-high">Rate: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Equipment Bento Cards Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredGear.map((item) => {
            const calculatedDailyRate = rentalTotal(item.rate, activeDuration.days, activeDuration.discount);
            const perDayRate = Math.round(calculatedDailyRate / activeDuration.days);

            return (
              <Tilt key={item.name} className="h-full">
                <div className="framer-bento-card group flex h-full flex-col justify-between p-6">
                  <div>
                    {/* Card Top: Highlight Badge & In-Stock Indicator */}
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 uppercase tracking-widest text-zinc-300">
                        {item.highlight || item.category}
                      </span>
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{item.inStockCount ?? 2} in Stock</span>
                      </span>
                    </div>

                    {/* Image Container with Smooth Zoom on Hover */}
                    <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-black">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      
                      {item.mount && (
                        <span className="absolute bottom-2.5 left-2.5 rounded-lg border border-white/10 bg-black/70 px-2 py-0.5 font-mono text-[10px] text-zinc-300 backdrop-blur-md">
                          {item.mount}
                        </span>
                      )}
                    </div>

                    {/* Gear Title & Category */}
                    <h3 className="mt-4 text-xl font-bold tracking-tight text-white group-hover:text-red-400 transition-colors">
                      {item.name}
                    </h3>
                    <p className="mt-0.5 font-mono text-xs text-zinc-500 uppercase tracking-wider">
                      {item.category}
                    </p>

                    {/* Technical Spec Tags */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {item.specs.map((s) => (
                        <span
                          key={s}
                          className="rounded-lg border border-white/[0.08] bg-zinc-900/60 px-2.5 py-1 font-mono text-[10px] text-zinc-300"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom: Rate Badge & Action Buttons */}
                  <div className="mt-6 border-t border-white/[0.08] pt-4">
                    <div className="flex items-baseline justify-between mb-3.5">
                      <div>
                        <span className="font-mono text-2xl font-bold text-white">
                          ₹{perDayRate.toLocaleString("en-IN")}
                        </span>
                        <span className="font-mono text-xs text-zinc-500"> /day</span>
                      </div>
                      {activeDuration.discount > 0 && (
                        <span className="rounded bg-red-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-red-400">
                          {activeDuration.label} (-{activeDuration.discount * 100}%)
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setQuickSpecsGear(item)}
                        className="framer-pill-secondary flex items-center justify-center gap-1.5 py-2.5 text-xs font-mono cursor-pointer"
                      >
                        <Info className="h-3.5 w-3.5 text-zinc-400" />
                        <span>Specs</span>
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
                        className="framer-pill-primary flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold cursor-pointer"
                      >
                        <span>Reserve</span>
                        <span className="font-mono text-[10px]">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </Tilt>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: 4-BLOCK BENTO HARDWARE SPECS */}
      <section id="hardware" className="relative mx-auto max-w-7xl px-6 py-24 z-10 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 font-mono text-[10px] tracking-widest text-zinc-300 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            <span>THE GEARSHARE STANDARD</span>
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-5xl text-white">
            Engineered for Zero Failure on Stage.
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
            Every cinema body, prime lens set, and battery brick is bench-inspected in cleanroom conditions before flight-case sealing.
          </p>
        </div>

        {/* 4 Bento Advantage Blocks */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Block 1 (Large 2-column span): Sub-Micron Sensor Bench Testing with Interactive Flange Focal Distance Diagram */}
          <div className="framer-bento-card lg:col-span-2 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 uppercase tracking-wider text-red-400 font-bold">
                  01 / BENCH TESTING
                </span>
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>±0.010mm Tolerance Pass</span>
                </span>
              </div>

              <h3 className="mt-4 text-2xl font-bold tracking-tight text-white">
                Sub-Micron Sensor Bench Testing
              </h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Back-focus drift destroys 8K anamorphic sharpness. Every lens and mount is calibrated on our digital autocollimator before rolling onto set.
              </p>

              {/* Interactive Mount Selector */}
              <div className="mt-6 flex flex-wrap gap-2 font-mono text-xs">
                {FFD_PRESETS.map((p, idx) => (
                  <button
                    key={p.mount}
                    onClick={() => setSelectedFfdIdx(idx)}
                    className={`rounded-xl border px-3.5 py-2 transition cursor-pointer ${
                      selectedFfdIdx === idx
                        ? "border-red-500 bg-red-500/20 text-white font-bold ring-1 ring-red-500"
                        : "border-white/10 bg-zinc-950/60 text-zinc-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <span>{p.mount} ({p.targetFfd.toFixed(2)}mm)</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Optical Collimation Diagram Graphic */}
            <div className="mt-6 rounded-2xl border border-white/[0.08] bg-zinc-950/80 p-5 font-mono">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-3 text-xs">
                <div className="flex items-center gap-2">
                  <Aperture className="h-4 w-4 text-red-400" />
                  <span className="text-zinc-300 font-semibold">{currentFfd.mount} Collimation Telemetry</span>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="text-zinc-500">SPEC: {currentFfd.standard}</span>
                  <span className="text-emerald-400">DEVIATION: {currentFfd.dev}</span>
                </div>
              </div>

              {/* Laser Reticle & Scale Line */}
              <div className="relative mt-4 h-16 w-full overflow-hidden rounded-xl border border-white/10 bg-black/60 flex items-center justify-center">
                <div className="absolute inset-x-0 h-px bg-red-500/40" />
                <div className="absolute inset-y-0 w-px bg-red-500/40" />
                <div className="h-10 w-10 rounded-full border border-dashed border-red-500/50 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)]" />
                </div>
                {/* Millimeter ticks */}
                <div className="absolute bottom-1 inset-x-4 flex justify-between text-[9px] text-zinc-600">
                  <span>-0.010mm</span>
                  <span>-0.005mm</span>
                  <span className="text-red-400 font-bold">0.000mm</span>
                  <span>+0.005mm</span>
                  <span>+0.010mm</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-400">
                <span>Measured FFD: <strong className="text-white">{currentFfd.measuredFfd.toFixed(3)} mm</strong></span>
                <span className="text-emerald-400">Class-100 Cleanroom Certified</span>
              </div>
            </div>
          </div>

          {/* Block 2: Production Damage Shield (Zero Deposit for verified DPs) */}
          <div id="damage-shield" className="framer-bento-card p-6 sm:p-8 flex flex-col justify-between scroll-mt-28">
            <div>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-xs uppercase tracking-wider text-red-400 font-bold">
                02 / DAMAGE SHIELD
              </span>
              <h3 className="mt-4 text-2xl font-bold tracking-tight text-white">
                Production Damage Shield (Zero Deposit for verified DPs)
              </h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Full on-set and transit accidental damage coverage. Instant deposit waivers for GSTIN holders and WICA / SICA members.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 font-mono text-xs text-emerald-400">
              <div className="flex items-center gap-2 font-bold">
                <ShieldCheck className="h-4 w-4" />
                <span>100% IN-TRANSIT & ON-SET COVERAGE</span>
              </div>
              <p className="mt-1 text-[11px] text-zinc-400 leading-relaxed">
                Drops, thermal stress, and optical element hazards covered without tied-up credit card holds.
              </p>
            </div>
          </div>

          {/* Block 3: 3-Hour Studio Set Dispatch Across Mumbai */}
          <div className="framer-bento-card p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-xs uppercase tracking-wider text-red-400 font-bold">
                03 / METRO SET DISPATCH
              </span>
              <h3 className="mt-4 text-2xl font-bold tracking-tight text-white">
                3-Hour Studio Set Dispatch Across Mumbai
              </h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Flight-ready Pelican Air hardcases dispatched in dedicated sprinter vans across Film City, Mehboob, Yash Raj, and national studios.
              </p>
            </div>

            <div className="mt-6">
              <a
                href="/track"
                className="framer-pill-secondary flex items-center justify-between p-3.5 font-mono text-xs"
              >
                <span className="flex items-center gap-2 text-white">
                  <Truck className="h-4 w-4 text-red-400" />
                  <span>Launch Soundstage Tracker</span>
                </span>
                <span className="text-red-400">→</span>
              </a>
            </div>
          </div>

          {/* Block 4: Pre-Charged V-Mount Batteries & Flight Pelican Cases */}
          <div className="framer-bento-card lg:col-span-2 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 uppercase tracking-wider text-red-400 font-bold">
                  04 / TURNKEY POWER & HARDCASES
                </span>
                <span className="text-zinc-400">4x 150Wh V-Mount Standard</span>
              </div>

              <h3 className="mt-4 text-2xl font-bold tracking-tight text-white">
                Pre-Charged V-Mount Batteries & Flight Pelican Cases
              </h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                No half-charged surprises. Every body ships with four 150Wh high-draw V-mount bricks, quad fast-charger, 15mm carbon rods, and Arri standard bridgeplates.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="rounded-xl border border-white/10 bg-zinc-950/60 p-3 text-center">
                <Zap className="h-4 w-4 text-red-400 mx-auto" />
                <p className="mt-1 font-bold text-white">4x 150Wh</p>
                <p className="text-[10px] text-zinc-500">V-Mount Cells</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-zinc-950/60 p-3 text-center">
                <Box className="h-4 w-4 text-red-400 mx-auto" />
                <p className="mt-1 font-bold text-white">Pelican Air</p>
                <p className="text-[10px] text-zinc-500">Flight Hardcase</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-zinc-950/60 p-3 text-center">
                <SlidersHorizontal className="h-4 w-4 text-red-400 mx-auto" />
                <p className="mt-1 font-bold text-white">15mm Rods</p>
                <p className="text-[10px] text-zinc-500">Carbon System</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-zinc-950/60 p-3 text-center">
                <Radio className="h-4 w-4 text-emerald-400 mx-auto" />
                <p className="mt-1 font-bold text-emerald-400">100% Full</p>
                <p className="text-[10px] text-zinc-500">Pre-Charged</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: INTERACTIVE WORKFLOW TIMELINE */}
      <section id="workflow" className="relative mx-auto max-w-7xl px-6 py-24 z-10 scroll-mt-28 border-t border-white/[0.08]">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 font-mono text-[10px] tracking-widest text-zinc-300 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            <span>RENTAL LIFECYCLE</span>
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-5xl text-white">
            From Reservation to Roll Time in Three Steps.
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
            Eliminating production friction with automated digital paperwork and flight-case set deliveries.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {PIPELINE_STEPS.map((step) => (
            <div key={step.step} className="framer-bento-card p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-4xl font-black tracking-tight text-white/20 font-mono">
                    {step.step}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[10px] text-red-400 font-bold">
                    {step.badge}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-bold tracking-tight text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: FRAMER COLLAPSIBLE FAQ ACCORDION */}
      <section id="faq" className="relative mx-auto max-w-4xl px-6 py-24 z-10 scroll-mt-28 border-t border-white/[0.08]">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 font-mono text-[10px] tracking-widest text-zinc-300 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            <span>OPERATIONAL CLARITY</span>
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-5xl text-white">
            Frequently Asked Questions.
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Everything you need to know about our soundstage delivery, insurance, and zero-deposit policies.
          </p>
        </div>

        {/* Collapsible Accordion Containers */}
        <div className="mt-12 space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={faq.q}
                className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-xl overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-5 text-left transition hover:bg-white/[0.02] cursor-pointer"
                >
                  <span className="text-base font-semibold text-white pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-red-400" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-white/[0.06] p-5 pt-3 text-sm text-slate-400 leading-relaxed animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 7: TECHNICAL FRAMER-STYLE FOOTER */}
      <footer className="relative border-t border-white/[0.08] bg-zinc-950/80 px-6 py-16 z-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2 font-mono text-sm font-bold tracking-[0.2em] text-white">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                <span>GEARSHARE</span>
              </div>
              <p className="text-sm text-zinc-400 max-w-md leading-relaxed">
                Precision on-demand cinema camera bodies, prime glass, and lighting fleets. Bench-collimated to ±0.01mm FFD and delivered directly to production stages across India.
              </p>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>All Rental Hubs Operational (Film City · Andheri · Bandra)</span>
              </div>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-3">
                Platform
              </h4>
              <ul className="space-y-2 font-mono text-xs text-zinc-500">
                <li><a href="#catalog" className="hover:text-white transition">Equipment Catalog</a></li>
                <li><a href="#bento-features" className="hover:text-white transition">Bento Specifications</a></li>
                <li><a href="#workflow" className="hover:text-white transition">Rental Lifecycle</a></li>
                <li><a href="#damage-shield" className="hover:text-white transition">Damage Shield</a></li>
                <li><a href="/track" className="hover:text-white transition text-red-400">Soundstage Dispatch</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-3">
                Cinema Depots
              </h4>
              <ul className="space-y-2 font-mono text-xs text-zinc-500">
                <li>Mumbai: Film City Bay 1</li>
                <li>Mumbai: Andheri West Depot</li>
                <li>Hyderabad: Jubilee Hills Bay</li>
                <li>Delhi NCR: Noida Film City</li>
                <li>Bengaluru: Whitefield Stage</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-white/[0.08] pt-8 font-mono text-xs text-zinc-500 gap-4">
            <p>© 2026 GearShare Technologies Inc. All rights reserved.</p>
            {/* ZootechX Prototype Attribution */}
            <p className="text-zinc-400">
              ZootechX Technical Assessment Prototype • Topic 02: GearShare
            </p>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {selectedGear && (
        <ReserveModal
          gear={selectedGear}
          initialDurationDays={activeDuration.days}
          onClose={handleCloseReserve}
        />
      )}

      {quickSpecsGear && (
        <QuickSpecsModal
          gear={quickSpecsGear}
          onClose={() => setQuickSpecsGear(null)}
          onReserve={(g) => {
            setQuickSpecsGear(null);
            handleOpenReserve(g);
          }}
        />
      )}
    </div>
  );
}

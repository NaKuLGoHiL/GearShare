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
import { KitCartDrawer } from "@/components/KitCartDrawer";
import { KitReserveModal } from "@/components/KitReserveModal";
import { useCart } from "@/context/CartContext";
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
  ShoppingBag,
  Plus,
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
    name: "ARRI Alexa Mini LF",
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
  const [isKitReserveOpen, setIsKitReserveOpen] = useState(false);

  const {
    openCart,
    isInCart,
    addToCart,
    itemCount,
    totalDailyRate,
    toastMessage,
    dismissToast,
  } = useCart();

  // Dynamic Floating Island scroll and section backdrop tracking
  const [scrollY, setScrollY] = useState(0);
  const [isOverDarkHero, setIsOverDarkHero] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const sy = window.scrollY;
      setScrollY(sy);
      const heroThreshold = (window.innerHeight || 800) * 2.5;
      setIsOverDarkHero(sy < heroThreshold);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  return (
    <div className="min-h-screen bg-[#07070d] text-foreground relative selection:bg-pink-500/30 selection:text-pink-100 antialiased overflow-x-clip w-full max-w-full">
      {/* BACKGROUND: 24px x 24px Subtle Geometric Dot/Line Grid with Radial Edge Fade */}
      <div className="pointer-events-none fixed inset-0 framer-grid-lines framer-grid-mask z-0 opacity-60" />
      
      {/* TARGETSYNC AMBIENT NEON RADIAL ILLUMINATION GRADIENTS */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[750px] bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.22),rgba(255,42,141,0.14),transparent_65%)] blur-3xl z-0 overflow-hidden" />
      <div className="pointer-events-none absolute top-[900px] left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.07),transparent_70%)] blur-3xl z-0 overflow-hidden" />
      <div className="pointer-events-none absolute top-[2200px] left-1/2 -translate-x-1/2 w-full max-w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(255,42,141,0.1),rgba(124,58,237,0.08),transparent_70%)] blur-3xl z-0 overflow-hidden" />

      {/* SECTION 1: DYNAMIC FLOATING ISLAND NAVBAR WITH TARGETSYNC OBSIDIAN GLASS */}
      <header className="fixed top-2.5 sm:top-5 inset-x-0 z-50 flex flex-col items-center px-2.5 sm:px-6 pointer-events-none transition-all duration-500">
        <div
          className={`relative pointer-events-auto w-full max-w-5xl rounded-full transition-all duration-500 ease-out flex items-center justify-between px-3 sm:px-6 shadow-2xl backdrop-blur-2xl bg-[#0b0a16]/85 border border-white/[0.09] text-white shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_1.5px_1px_rgba(255,255,255,0.12)] ring-1 ring-white/5 ${
            scrollY > 40 ? "h-12 sm:h-13 py-1 sm:py-1.5" : "h-13 sm:h-14 py-1.5 sm:py-2"
          }`}
        >
          {/* Specular Mirror Top Sheen */}
          <div className="pointer-events-none absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          {/* Left Brand Mark with Pulsing Tally */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <a
              href="#overview"
              className="group flex items-center gap-2 font-mono text-[11px] sm:text-xs font-bold tracking-[0.16em] sm:tracking-[0.22em] text-white transition"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ff2a8d] shadow-[0_0_10px_rgba(255,42,141,0.9)]" />
              </span>
              <span className="transition group-hover:text-[#ff2a8d]">GEARSHARE</span>
            </a>

            {/* Dynamic Island Telemetry Capsule */}
            <span className="hidden lg:inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-mono tracking-wider border border-emerald-500/30 bg-emerald-950/40 text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse" />
              <span>{isOverDarkHero ? "4K 120P RAW" : "MUMBAI DISPATCH ACTIVE"}</span>
            </span>
          </div>

          {/* Navigation Links: Overview, Scrollytech, Hardware, Pricing, FAQ, Track */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 font-mono text-xs text-zinc-300">
            <a
              href="#overview"
              className="px-3 py-1.5 rounded-full transition-all hover:text-white hover:bg-white/10"
            >
              Overview
            </a>
            <a
              href="#scrollytech"
              className="px-3 py-1.5 rounded-full transition-all hover:text-white hover:bg-white/10"
            >
              Scrollytech
            </a>
            <a
              href="#hardware"
              className="px-3 py-1.5 rounded-full transition-all hover:text-white hover:bg-white/10"
            >
              Hardware
            </a>
            <a
              href="#catalog"
              className="px-3 py-1.5 rounded-full transition-all hover:text-white hover:bg-white/10"
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="px-3 py-1.5 rounded-full transition-all hover:text-white hover:bg-white/10"
            >
              FAQ
            </a>
            <a
              href="/track"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[#ff2a8d] hover:text-[#ff65b2] font-semibold transition-all hover:bg-pink-500/10"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff2a8d] shadow-[0_0_6px_#ff2a8d] animate-pulse" />
              <span>Track Dispatch</span>
            </a>
          </nav>

          {/* Right Action: Cart Pill & TargetSync Neon Gradient Pill "Rent Kit" */}
          <div className="flex items-center gap-2">
            {/* Production Kit Cart Button */}
            <button
              type="button"
              onClick={openCart}
              className={`relative inline-flex items-center gap-1.5 rounded-full border px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-mono transition-all cursor-pointer ${
                itemCount > 0
                  ? "border-[#ff2a8d]/60 bg-[#141224] text-white shadow-[0_0_15px_rgba(255,42,141,0.35)] hover:border-[#ff2a8d]"
                  : "border-white/10 bg-white/5 text-zinc-300 hover:border-white/20 hover:text-white"
              }`}
              aria-label="View Production Kit Cart"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-[#ff2a8d]" />
              <span className="hidden xs:inline">Kit</span>
              {itemCount > 0 && (
                <span className="flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-gradient-to-r from-[#ff2a8d] to-[#7c3aed] px-1 text-[9px] font-bold text-white shadow-[0_0_8px_#ff2a8d]">
                  {itemCount}
                </span>
              )}
            </button>

            <a
              href="#catalog"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ff2a8d] via-[#d946ef] to-[#7c3aed] px-3.5 sm:px-5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold text-white tracking-wide shadow-[0_0_20px_rgba(255,42,141,0.45),0_0_35px_rgba(124,58,237,0.25)] hover:shadow-[0_0_30px_rgba(255,42,141,0.65)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>Rent Kit</span>
              <span className="ml-1 font-mono text-[10px]">→</span>
            </a>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 transition md:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Menu (Floating Glass Card) */}
        {mobileMenuOpen && (
          <div className="pointer-events-auto mt-2 w-full max-w-5xl rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-2xl border border-white/20 text-white bg-[#0b0a16]/95 shadow-[0_20px_50px_rgba(0,0,0,0.95)] transition-all md:hidden animate-in fade-in slide-in-from-top-2 max-h-[80dvh] overflow-y-auto custom-scrollbar overscroll-contain">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono text-xs text-zinc-300">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#ff2a8d] shadow-[0_0_8px_#ff2a8d] animate-pulse" />
                <span>MUMBAI FLEET ACTIVE</span>
              </span>
              <span className="text-[10px] text-zinc-500">
                24/7 METRO DISPATCH
              </span>
            </div>
            <nav className="mt-3 flex flex-col gap-2 font-mono text-xs">
              <a
                href="#overview"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 transition text-zinc-300 hover:text-white"
              >
                01 / Overview
              </a>
              <a
                href="#scrollytech"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 transition text-zinc-300 hover:text-white"
              >
                02 / Scrollytech Breakdown
              </a>
              <a
                href="#catalog"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 transition text-zinc-300 hover:text-white"
              >
                03 / Pricing & Fleet Catalog
              </a>
              <a
                href="#hardware"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 transition text-zinc-300 hover:text-white"
              >
                04 / Hardware Bento Specs
              </a>
              <a
                href="#workflow"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 transition text-zinc-300 hover:text-white"
              >
                05 / Rental Workflow
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 transition text-zinc-300 hover:text-white"
              >
                06 / Operational FAQ
              </a>
              <a
                href="/track"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-[#ff2a8d] font-semibold"
              >
                ● 07 / Track Soundstage Dispatch
              </a>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openCart();
                  }}
                  className="flex items-center justify-center gap-2 w-full rounded-full border border-pink-500/40 bg-[#16142a] py-2.5 text-xs font-semibold text-white shadow-md shadow-[#ff2a8d]/20 cursor-pointer"
                >
                  <ShoppingBag className="h-3.5 w-3.5 text-[#ff2a8d]" />
                  <span>Production Kit Cart ({itemCount} {itemCount === 1 ? "Unit" : "Units"})</span>
                </button>
                <a
                  href="#catalog"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center rounded-full bg-gradient-to-r from-[#ff2a8d] via-[#d946ef] to-[#7c3aed] py-2.5 text-xs font-semibold text-white shadow-[0_0_20px_rgba(255,42,141,0.4)]"
                >
                  Browse Catalog →
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
      <section id="rig-showcase" className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 px-3 sm:px-6 text-center z-10 border-t border-white/[0.08] bg-[#07070d] scroll-mt-24 sm:scroll-mt-36">
        <div className="mx-auto max-w-5xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ff2a6d]/40 bg-[#ff2a6d]/10 px-3 sm:px-3.5 py-1 font-mono text-[9px] sm:text-[10px] tracking-widest text-[#ff4b82] shadow-[0_0_15px_rgba(255,42,141,0.2)] backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff2a8d] shadow-[0_0_6px_#ff2a8d] animate-pulse" />
            <span>CALIBRATED CINEMA FLEET • SET DISPATCH READY</span>
          </div>

          <h2 className="mt-2.5 sm:mt-5 text-xl xs:text-2xl sm:text-5xl font-black tracking-[-0.03em] leading-tight text-white">
            Real-Time Optical Physics & Sensor Rigging.
          </h2>

          <p className="mt-1.5 sm:mt-3 text-[11px] sm:text-sm text-zinc-400 max-w-sm sm:max-w-xl mx-auto font-normal leading-relaxed">
            Test custom chromatic anamorphic LUTs, inspect multi-axis rig tilt physics, and reserve zero-deposit cinema packages below.
          </p>

          {/* Unified Cinema Console & Interactive 3D Showcase */}
          <div className="relative mx-auto mt-6 sm:mt-10 max-w-5xl">
            <div className="pointer-events-none absolute -bottom-10 inset-x-12 h-24 bg-gradient-to-b from-purple-500/20 via-pink-500/15 to-transparent blur-xl rounded-full transform scale-y-50" />

            <div className="relative rounded-2xl sm:rounded-3xl border border-white/[0.09] bg-[#0d0c18]/90 p-2 sm:p-3 shadow-2xl backdrop-blur-2xl ring-1 ring-white/5">
              <Hero3DShowcase onSelectGear={handleOpenReserve} className="p-0" />

              {/* Integrated Optical LUT Console Bar */}
              <div className="mt-2 pt-2.5 pb-1 px-2.5 sm:px-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Sparkles className="h-3.5 w-3.5 text-[#ff2a8d]" />
                  <span className="text-[10px] uppercase tracking-wider font-semibold">3-WAY OPTICAL LUT:</span>
                </div>
                <div className="inline-flex items-center gap-1 rounded-full bg-[#141324] p-1 border border-white/10">
                  {(["kodak-500t", "anamorphic-cyan", "silver-noir"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setCinemaLook(mode)}
                      className={`rounded-full px-2.5 sm:px-3 py-1 text-[10px] font-medium transition cursor-pointer ${
                        cinemaLook === mode
                          ? "bg-gradient-to-r from-[#ff2a8d] to-[#7c3aed] text-white font-semibold shadow-[0_0_12px_rgba(255,42,141,0.5)]"
                          : "text-zinc-400 hover:text-white hover:bg-white/[0.06]"
                      }`}
                    >
                      {mode === "kodak-500t" ? "Kodak 500T" : mode === "anamorphic-cyan" ? "Cyan" : "Noir"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: FRAMER-STYLE BENTO GRID CATALOG (INTERACTIVE CORE) */}
      <section id="catalog" className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-16 sm:pt-20 pb-28 sm:pb-32 z-10 scroll-mt-28">
        {/* Catalog Header & Command Deck */}
        <div className="flex flex-col justify-between gap-6 border-b border-white/[0.08] pb-8 lg:flex-row lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ff2a6d]/40 bg-[#ff2a6d]/10 px-3.5 py-1 font-mono text-[10px] tracking-widest text-[#ff4b82] uppercase font-semibold shadow-[0_0_15px_rgba(255,42,141,0.2)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff2a8d] shadow-[0_0_6px_#ff2a8d] animate-pulse" />
              <span>INSTANT INVENTORY ACCESS</span>
            </div>
            <h2 className="mt-3 text-2xl xs:text-3xl font-bold tracking-tight sm:text-4xl text-white">
              Precision Cinema Fleet Ready for Set Call.
            </h2>
            <p className="mt-2 max-w-2xl text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Bench-calibrated 8K camera bodies, anamorphic primes, stage LED softlights, and 32-bit float audio. Flight-cased with turnkey accessories and ₹0 deposit coverage across Mumbai & India.
            </p>
          </div>

          {/* Segmented Duration Switcher [1 Day | 3 Days (-10%) | 7 Days (-25%)] */}
          <div className="flex flex-col items-start gap-2 lg:items-end w-full lg:w-auto">
            <span className="font-mono text-[11px] tracking-wider uppercase text-zinc-400 flex items-center gap-1.5 font-semibold">
              <Clock className="h-3.5 w-3.5 text-[#ff2a8d]" />
              <span>RENTAL SHOOT DURATION</span>
            </span>
            <div className="inline-flex w-full sm:w-auto justify-between sm:justify-start rounded-full border border-white/10 bg-[#131222] p-1 font-mono text-[11px] sm:text-xs shadow-inner">
              {DURATIONS.map((d, i) => (
                <button
                  key={d.days}
                  onClick={() => setDurationIdx(i)}
                  className={`flex-1 sm:flex-initial text-center rounded-full px-2.5 sm:px-4 py-1.5 sm:py-2 transition-all duration-200 cursor-pointer ${
                    durationIdx === i
                      ? "bg-white/[0.12] text-white font-bold shadow-md border border-white/15"
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  <span>{d.label}</span>
                  {d.discount > 0 && (
                    <span className="ml-1 text-[10px] text-[#ff2a8d] font-bold">
                      (-{d.discount * 100}%)
                    </span>
                  )}
                </button>
              ))}
            </div>
            {activeDuration.discount > 0 && (
              <span className="font-mono text-[10px] sm:text-[11px] text-emerald-400 font-semibold">
                ⚡ Volume rate active: Save {activeDuration.discount * 100}% on all equipment below
              </span>
            )}
          </div>
        </div>

        {/* Category Filter Pills & Search Command Bar */}
        <div className="mt-6 sm:mt-8 space-y-4">
          <div className="relative">
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 sm:pb-0 sm:flex-wrap no-scrollbar">
              {CATS.map((c) => {
                const count = categoryCounts[c] ?? 0;
                const isActive = selectedCat === c;
                return (
                  <button
                    key={c}
                    onClick={() => setSelectedCat(c)}
                    className={`shrink-0 flex items-center gap-2 rounded-full border px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "border-[#ff2a8d] bg-pink-500/15 text-[#ff4b82] font-bold ring-1 ring-pink-500/40 shadow-[0_0_15px_rgba(255,42,141,0.25)]"
                        : "border-white/10 bg-[#121122] text-zinc-300 hover:border-white/20 hover:text-white shadow-sm"
                    }`}
                  >
                    <span>{c}</span>
                    <span
                      className={`rounded-full px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] ${
                        isActive ? "bg-[#ff2a8d] text-white font-bold" : "bg-white/[0.06] text-zinc-400"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
            {/* Subtle right-edge scroll fade indicator on mobile */}
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#07070d] to-transparent sm:hidden" />
          </div>

          {/* Search & Secondary Filter Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#0e0d1a]/90 p-3 shadow-xl backdrop-blur-xl">
            <div className="relative flex-1 min-w-0 sm:min-w-[240px]">
              <Search className="pointer-events-none absolute left-3.5 top-2.5 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cinema bodies, primes, sensor, mounts..."
                className="w-full rounded-xl border border-white/10 bg-[#141324] pl-10 pr-8 py-2 font-mono text-xs text-white placeholder:text-zinc-500 focus:border-[#ff2a8d] focus:bg-[#18172c] focus:outline-none focus:ring-1 focus:ring-pink-500/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2 text-zinc-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-zinc-400 hidden xs:inline">Mount:</span>
              <select
                value={selectedMount}
                onChange={(e) => setSelectedMount(e.target.value)}
                className="flex-1 sm:flex-initial rounded-xl border border-white/10 bg-[#141324] px-2.5 sm:px-3 py-2 font-mono text-xs text-white outline-none cursor-pointer focus:border-[#ff2a8d]"
              >
                <option value="All" className="bg-[#141324] text-white">All Mounts</option>
                <option value="PL" className="bg-[#141324] text-white">PL Mount</option>
                <option value="LPL" className="bg-[#141324] text-white">LPL Mount</option>
                <option value="RF" className="bg-[#141324] text-white">RF Mount</option>
                <option value="E" className="bg-[#141324] text-white">E Mount</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="flex-1 sm:flex-initial rounded-xl border border-white/10 bg-[#141324] px-2.5 sm:px-3 py-2 font-mono text-xs text-white outline-none cursor-pointer focus:border-[#ff2a8d]"
              >
                <option value="featured" className="bg-[#141324] text-white">Sort: Featured</option>
                <option value="price-low" className="bg-[#141324] text-white">Rate: Low to High</option>
                <option value="price-high" className="bg-[#141324] text-white">Rate: High to Low</option>
                <option value="name" className="bg-[#141324] text-white">Name: A to Z</option>
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
                      <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 uppercase tracking-widest text-zinc-300 font-semibold">
                        {item.highlight || item.category}
                      </span>
                      <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981] animate-pulse" />
                        <span>{item.inStockCount ?? 2} in Stock</span>
                      </span>
                    </div>

                    {/* Image Container with Smooth Zoom on Hover */}
                    <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-[#141324]">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07070d]/80 via-transparent to-transparent" />
                      
                      {item.mount && (
                        <span className="absolute bottom-2.5 left-2.5 rounded-lg border border-white/20 bg-black/75 px-2 py-0.5 font-mono text-[10px] text-white backdrop-blur-md">
                          {item.mount}
                        </span>
                      )}
                    </div>

                    {/* Gear Title & Category */}
                    <h3 className="mt-4 text-xl font-bold tracking-tight text-white group-hover:text-[#ff2a8d] transition-colors">
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
                          className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] text-zinc-300 font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom: Rate Badge & Action Buttons */}
                  <div className="mt-6 border-t border-white/10 pt-4">
                    <div className="flex items-baseline justify-between mb-3.5">
                      <div>
                        <span className="font-mono text-2xl font-bold text-white">
                          ₹{perDayRate.toLocaleString("en-IN")}
                        </span>
                        <span className="font-mono text-xs text-zinc-500"> /day</span>
                      </div>
                      {activeDuration.discount > 0 && (
                        <span className="rounded bg-pink-500/10 border border-pink-500/30 px-2 py-0.5 font-mono text-[10px] font-bold text-[#ff4b82]">
                          {activeDuration.label} (-{activeDuration.discount * 100}%)
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setQuickSpecsGear(item)}
                        className="framer-pill-secondary flex items-center justify-center gap-1 py-2.5 text-[11px] font-mono cursor-pointer"
                        title="View technical specifications"
                      >
                        <Info className="h-3 w-3 text-zinc-400" />
                        <span>Specs</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (isInCart(item.name)) {
                            openCart();
                          } else {
                            addToCart({
                              name: item.name,
                              category: item.category,
                              rate: item.rate,
                              img: item.img,
                              specs: item.specs,
                            });
                          }
                        }}
                        className={`flex items-center justify-center gap-1 py-2.5 text-[11px] font-mono rounded-full border transition cursor-pointer ${
                          isInCart(item.name)
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-semibold shadow-[0_0_10px_rgba(16,185,129,0.25)]"
                            : "border-white/10 bg-white/5 text-zinc-300 hover:border-pink-500/40 hover:text-white"
                        }`}
                        title={isInCart(item.name) ? "View in Production Kit" : "Add to Production Kit"}
                      >
                        {isInCart(item.name) ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span>In Kit</span>
                          </>
                        ) : (
                          <>
                            <Plus className="h-3 w-3 text-[#ff2a8d]" />
                            <span>+ Kit</span>
                          </>
                        )}
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
                        className="framer-pill-primary flex items-center justify-center gap-1 py-2.5 text-[11px] font-semibold cursor-pointer"
                        title="Reserve single unit immediately"
                      >
                        <span>Reserve</span>
                        <span className="font-mono text-[9px]">→</span>
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
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1 font-mono text-[10px] tracking-widest text-zinc-300 uppercase font-semibold shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff2a8d] shadow-[0_0_6px_#ff2a8d]" />
            <span>THE GEARSHARE STANDARD</span>
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-5xl text-white">
            Engineered for Zero Failure on Stage.
          </h2>
          <p className="mt-3 text-zinc-400 text-sm sm:text-base leading-relaxed">
            Every cinema body, prime lens set, and battery brick is bench-inspected in cleanroom conditions before flight-case sealing.
          </p>
        </div>

        {/* 3 Bento Advantage Blocks */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Block 1: Production Damage Shield (Zero Deposit for verified DPs) */}
          <div id="damage-shield" className="framer-bento-card p-6 sm:p-8 flex flex-col justify-between scroll-mt-28">
            <div>
              <span className="rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 font-mono text-xs uppercase tracking-wider text-[#ff4b82] font-bold">
                01 / DAMAGE SHIELD
              </span>
              <h3 className="mt-4 text-2xl font-bold tracking-tight text-white">
                Production Damage Shield (Zero Deposit)
              </h3>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                Full on-set and transit accidental damage coverage. Instant deposit waivers for GSTIN holders and WICA / SICA members.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-4 font-mono text-xs text-emerald-300">
              <div className="flex items-center gap-2 font-bold text-emerald-400">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>100% IN-TRANSIT & ON-SET COVERAGE</span>
              </div>
              <p className="mt-1.5 text-[11px] text-emerald-400/90 leading-relaxed">
                Drops, thermal stress, and optical element hazards covered without tied-up credit card holds.
              </p>
            </div>
          </div>

          {/* Block 2: 3-Hour Studio Set Dispatch Across Mumbai */}
          <div className="framer-bento-card p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 font-mono text-xs uppercase tracking-wider text-[#ff4b82] font-bold">
                02 / METRO SET DISPATCH
              </span>
              <h3 className="mt-4 text-2xl font-bold tracking-tight text-white">
                3-Hour Studio Set Dispatch
              </h3>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                Flight-ready Pelican Air hardcases dispatched in dedicated sprinter vans across Film City, Mehboob, Yash Raj, and national studios.
              </p>
            </div>

            <div className="mt-6">
              <a
                href="/track"
                className="framer-pill-secondary flex items-center justify-between p-3.5 font-mono text-xs shadow-sm hover:border-[#ff2a8d]/40 transition"
              >
                <span className="flex items-center gap-2 text-white font-medium">
                  <Truck className="h-4 w-4 text-[#ff2a8d]" />
                  <span>Launch Soundstage Tracker</span>
                </span>
                <span className="text-[#ff2a8d] font-bold">→</span>
              </a>
            </div>
          </div>

          {/* Block 3: Pre-Charged V-Mount Batteries & Flight Pelican Cases */}
          <div className="framer-bento-card p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 uppercase tracking-wider text-[#ff4b82] font-bold">
                  03 / TURNKEY POWER & HARDCASES
                </span>
              </div>

              <h3 className="mt-4 text-2xl font-bold tracking-tight text-white">
                Pre-Charged Power & Flight Cases
              </h3>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                No half-charged surprises. Every body ships with four 150Wh high-draw V-mount bricks, quad fast-charger, 15mm carbon rods, and Arri standard bridgeplates.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2.5 font-mono text-xs">
              <div className="rounded-xl border border-white/10 bg-[#141324] p-2.5 text-center">
                <Zap className="h-4 w-4 text-[#ff2a8d] mx-auto" />
                <p className="mt-1 font-bold text-white text-[11px]">4x 150Wh</p>
                <p className="text-[10px] text-zinc-400">V-Mount Cells</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#141324] p-2.5 text-center">
                <Box className="h-4 w-4 text-[#ff2a8d] mx-auto" />
                <p className="mt-1 font-bold text-white text-[11px]">Pelican Air</p>
                <p className="text-[10px] text-zinc-400">Flight Hardcase</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#141324] p-2.5 text-center">
                <SlidersHorizontal className="h-4 w-4 text-[#ff2a8d] mx-auto" />
                <p className="mt-1 font-bold text-white text-[11px]">15mm Rods</p>
                <p className="text-[10px] text-zinc-400">Carbon System</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#141324] p-2.5 text-center">
                <Radio className="h-4 w-4 text-emerald-400 mx-auto" />
                <p className="mt-1 font-bold text-emerald-400 text-[11px]">100% Full</p>
                <p className="text-[10px] text-zinc-400">Pre-Charged</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: INTERACTIVE WORKFLOW TIMELINE */}
      <section id="workflow" className="relative mx-auto max-w-7xl px-6 py-24 z-10 scroll-mt-28 border-t border-white/[0.08]">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1 font-mono text-[10px] tracking-widest text-zinc-300 uppercase font-semibold shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff2a8d] shadow-[0_0_6px_#ff2a8d]" />
            <span>RENTAL LIFECYCLE</span>
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-5xl text-white">
            From Reservation to Roll Time in Three Steps.
          </h2>
          <p className="mt-3 text-zinc-400 text-sm sm:text-base leading-relaxed">
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
                  <span className="rounded-full border border-pink-500/30 bg-pink-500/10 px-2.5 py-0.5 text-[10px] text-[#ff4b82] font-bold">
                    {step.badge}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-bold tracking-tight text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
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
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1 font-mono text-[10px] tracking-widest text-zinc-300 uppercase font-semibold shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff2a8d] shadow-[0_0_6px_#ff2a8d]" />
            <span>OPERATIONAL CLARITY</span>
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-5xl text-white">
            Frequently Asked Questions.
          </h2>
          <p className="mt-3 text-zinc-400 text-sm sm:text-base">
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
                className="rounded-2xl border border-white/10 bg-[#0e0d1a]/90 shadow-xl overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-5 text-left transition hover:bg-white/[0.04] cursor-pointer"
                >
                  <span className="text-base font-semibold text-white pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#ff2a8d]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-white/10 p-5 pt-3 text-sm text-zinc-400 leading-relaxed animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 7: TECHNICAL FRAMER-STYLE FOOTER */}
      <footer className="relative border-t border-white/[0.08] bg-[#050509] px-6 py-16 z-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2 font-mono text-sm font-bold tracking-[0.2em] text-white">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff2a8d] shadow-[0_0_8px_rgba(255,42,141,0.8)]" />
                <span>GEARSHARE</span>
              </div>
              <p className="text-sm text-zinc-400 max-w-md leading-relaxed">
                Precision on-demand cinema camera bodies, prime glass, and lighting fleets. Bench-collimated to ±0.01mm FFD and delivered directly to production stages across India.
              </p>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 font-mono text-xs text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981] animate-pulse" />
                <span>All Rental Hubs Operational (Film City · Andheri · Bandra)</span>
              </div>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-white font-semibold mb-3">
                Platform
              </h4>
              <ul className="space-y-2 font-mono text-xs text-zinc-400">
                <li><a href="#catalog" className="hover:text-white transition">Equipment Catalog</a></li>
                <li><a href="#hardware" className="hover:text-white transition">Bento Specifications</a></li>
                <li><a href="#workflow" className="hover:text-white transition">Rental Lifecycle</a></li>
                <li><a href="#damage-shield" className="hover:text-white transition">Damage Shield</a></li>
                <li><a href="/track" className="hover:text-white transition text-[#ff2a8d] font-semibold">Soundstage Dispatch</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-white font-semibold mb-3">
                Cinema Depots
              </h4>
              <ul className="space-y-2 font-mono text-xs text-zinc-400">
                <li>Mumbai: Film City Bay 1</li>
                <li>Mumbai: Andheri West Depot</li>
                <li>Hyderabad: Jubilee Hills Bay</li>
                <li>Delhi NCR: Noida Film City</li>
                <li>Bengaluru: Whitefield Stage</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-white/10 pt-8 font-mono text-xs text-zinc-500 gap-4">
            <p>© 2026 GearShare Technologies Inc. All rights reserved.</p>
            {/* ZootechX Prototype Attribution */}
            <p className="text-zinc-500">
              ZootechX Technical Assessment Prototype • Topic 02: GearShare
            </p>
          </div>
        </div>
      </footer>

      {/* FLOATING EPHEMERAL TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl border border-pink-500/40 bg-[#0e0d1a]/95 px-4 py-3 text-xs text-white shadow-[0_10px_35px_rgba(0,0,0,0.85),0_0_20px_rgba(255,42,141,0.25)] backdrop-blur-xl animate-in slide-in-from-bottom-5">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ff2a8d]/20 text-[#ff2a8d]">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <span className="font-mono">{toastMessage}</span>
          <button
            type="button"
            onClick={openCart}
            className="rounded-lg bg-gradient-to-r from-[#ff2a8d] to-[#7c3aed] px-3 py-1 font-mono text-[10px] font-bold text-white hover:brightness-110 transition cursor-pointer"
          >
            View Kit →
          </button>
          <button
            type="button"
            onClick={dismissToast}
            className="text-zinc-500 hover:text-white transition p-0.5 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* FLOATING PERSISTENT KIT BADGE (BOTTOM-RIGHT) */}
      {itemCount > 0 && !toastMessage && (
        <div className="fixed bottom-5 right-5 z-40 animate-in slide-in-from-bottom-4">
          <button
            type="button"
            onClick={openCart}
            className="group flex items-center gap-3 rounded-full border border-pink-500/40 bg-[#0e0d1a]/95 px-4 py-2.5 text-xs text-white shadow-[0_15px_40px_rgba(0,0,0,0.9),0_0_25px_rgba(255,42,141,0.35)] backdrop-blur-xl hover:scale-105 transition-all cursor-pointer"
          >
            <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-[#ff2a8d] to-[#7c3aed] text-white">
              <ShoppingBag className="h-3.5 w-3.5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-black text-black">
                {itemCount}
              </span>
            </div>
            <div className="text-left font-mono leading-tight hidden xs:block">
              <span className="text-white font-bold block">Production Kit</span>
              <span className="text-[#00f0ff] text-[10px]">₹{totalDailyRate.toLocaleString("en-IN")}/day</span>
            </div>
            <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px] text-zinc-300 group-hover:bg-[#ff2a8d] group-hover:text-white transition">
              Review Kit →
            </span>
          </button>
        </div>
      )}

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

      {/* MULTI-UNIT PRODUCTION KIT CART DRAWER & RESERVATION MODAL */}
      <KitCartDrawer onProceedToCheckout={() => setIsKitReserveOpen(true)} />

      {isKitReserveOpen && (
        <KitReserveModal
          initialDurationDays={activeDuration.days}
          onClose={() => setIsKitReserveOpen(false)}
        />
      )}
    </div>
  );
}

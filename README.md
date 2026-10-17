# GearShare — On-Demand Cinema Camera & Optics Rentals

> High-performance, on-demand cinematography and optics rental platform built for filmmakers, cinematographers, and production teams. Features interactive 3D perspective hardware previews, dual-validated booking pipeline, and real-time Supabase persistence.

[![Live Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://gearshare-cinema.vercel.app)
[![Framework](https://img.shields.io/badge/Stack-React_19_/_TanStack_Start-ef4444?style=for-the-badge)](https://tanstack.com/start)
[![Database](https://img.shields.io/badge/Database-Supabase-000000?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Styling](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-121214?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)

---

## Live Deployment

- **Production URL**: [https://gearshare-cinema.vercel.app](https://gearshare-cinema.vercel.app) *(or your deployed Vercel URL)*

---

## Architectural Overview

GearShare is designed with an **ultra-dark matte carbon aesthetic** (`#000000`, `#0a0a0c`, `#121214`) punctuated by **anodized cinema-red accents** (`#ef4444` / `#e11d48`) and high-contrast monospaced technical telemetry (`JetBrains Mono`).

```
                              ┌─────────────────────────────────────────────────────────┐
                              │                 Client Browser Layer                    │
                              │  - 3D Inertial Flagship Bench (RED / ARRI Switcher)      │
                              │  - Dynamic Duration Pricing Toggle (1D / 3D / 7D)        │
                              │  - Real-Time Search & Category Filters                  │
                              │  - ReserveModal with Dual-Validation & Telemetry        │
                              └────────────────────────────┬────────────────────────────┘
                                                           │
                                             HTTP JSON     ▼
                              ┌─────────────────────────────────────────────────────────┐
                              │             TanStack Start / Nitro SSR Layer            │
                              │  - Server Route: POST /api/inquiries                    │
                              │  - Dual Zod Schema Validation (Phone, Email, Dates)     │
                              │  - Reference Code Generator (GS-XXXXXXXX)               │
                              │  - Safe Environment Access (Service Role / Publishable) │
                              └────────────────────────────┬────────────────────────────┘
                                                           │
                                        PostgREST HTTPS    ▼
                              ┌─────────────────────────────────────────────────────────┐
                              │                 Supabase PostgreSQL 15                  │
                              │  - Table: public.rental_inquiries                       │
                              │  - Row-Level Security (RLS) Policy                      │
                              │  - Public Privacy: Non-selectable anonymized hold log   │
                              └─────────────────────────────────────────────────────────┘
```

### Tech Stack & Design System
- **Design System**: Framer-inspired architecture (Deep matte obsidian `#08080a`, 24px x 24px geometric grid with radial mask, rounded-3xl bento cards, anodized-red `#ef4444` highlights)
- **Framework**: React 19 + TanStack Start (Nitro SSR Engine) + TanStack Router
- **Styling**: Tailwind CSS v4 with custom OKLCH matte carbon palette, hardware rim lighting, and glassmorphism
- **Data Persistence**: Supabase (PostgreSQL 15 + PostgREST with strict Row Level Security)
- **Validation**: Zod schema with dual-casing support (`camelCase` & `snake_case`)
- **Icons & Motion**: Lucide React + GPU-accelerated CSS 3D Matrix & requestAnimationFrame inertial damping
- **Testing**: Vitest + Testing Library

---

## 7 Framer-Style Sections

1. **Floating Pill Header**:
   - Signature centered floating pill navbar with glassmorphism (`backdrop-blur-xl bg-zinc-950/70 border border-zinc-800/80 rounded-full`).
   - Brand mark with glowing red tally dot: `● GEARSHARE`.
   - Links: Catalog, Bento Features, Workflow, Damage Shield, FAQ, and Track Dispatch.
   - CTA button: Anodized-red rounded pill button "Rent Equipment".

2. **Framer-Style Hero Section**:
   - Floating micro-badge: `V2.6 CINEMA FLEET • DISPATCHING READY`.
   - Giant centered title: `The Hardware Behind Cinema-Grade Frames.` (gradient text white to slate-400, tight tracking `-0.04em`).
   - Subtitle: `Reserve bench-calibrated cinema bodies, anamorphic primes, and lighting rigs with zero-friction checkout and full production insurance.`
   - Dual CTAs: Red pill "Explore Inventory" + Secondary glass pill "View Damage Shield".
   - Centered Interactive 3D/Tilt Visual: Cinema camera rig resting on a subtle reflective plane that tilts smoothly with cursor movement (CSS 3D perspective / transform) with reflection fade beneath.
   - Interactive 3-way LUT switch: `Kodak 500T`, `Anamorphic Cyan`, `Silver Noir` embedded cleanly as an optical simulation preview pill bar.

3. **Framer-Style Bento Grid Catalog (Interactive Core)**:
   - Header with micro-badge: `INSTANT INVENTORY ACCESS`.
   - Title: `Precision Cinema Fleet Ready for Set Call.`
   - Filter bar: `[All, Cinema Bodies, Anamorphic & Primes, Lighting, Audio]` with count badges.
   - Duration switch: `[1 Day | 3 Days (-10%) | 7 Days (-25%)]` that recalibrates pricing numbers in real-time in Indian Rupees (`₹`).
   - Search bar + Lens mount filter (`All`, `PL Mount`, `LPL`, `RF`, `E Mount`).
   - Equipment Cards with Framer aesthetics: high-res hardware photos, technical spec tags, daily rate badge, instant "Reserve" trigger button, and "Quick Specs" modal.

4. **4-Block Framer Bento Advantage Grid**:
   - **Block 1 (Large 2-col)**: "Optics Bench-Calibrated" with interactive lens flange focal distance diagram (collimation scale, ±0.010mm tolerance indicator, micrometer laser bench graphic).
   - **Block 2 (1-col)**: "Zero-Deposit Damage Shield" (100% in-transit and on-set accidental coverage, WICA & GSTIN instant waiver).
   - **Block 3 (1-col)**: "3-Hour Metro Set Dispatch" (Flight-ready Pelican cases delivered directly to Mumbai studio sets with live tracking link).
   - **Block 4 (2-col)**: "Production-Ready Power Packs" (Pre-charged quad 150Wh V-mount batteries, dual fast-chargers, 15mm carbon rods, and Arri bridgeplates included standard).

5. **Interactive Workflow Timeline**:
   - 3-step minimalist Framer step card layout:
     - `01 / Select Hardware & Shoot Window`
     - `02 / 15-Min Fast ID & GSTIN Check` (< 15 min clearance, ₹0 deposit waiver)
     - `03 / Flight-Case Direct Studio Delivery` (charged to 100%, collimation sheet signed, delivered < 3 hours to sets)

6. **Framer Collapsible FAQ Accordion**:
   - Clean, rounded graphite containers with smooth expand/collapse transitions covering insurance, emergency gear hot-swaps, deposit policies, lens mount shims, wrap day returns.

7. **Technical Framer-Style Footer**:
   - Dark grid footer with sitemap links, status indicator `All Rental Hubs Operational` (glowing emerald dot), and attribution: `Prototype Engineered for ZooTechX Cinema R&D • GearShare Platform`.

---

## Supabase Data Persistence & API Specification

### Database Schema (`rental_inquiries`)
```sql
CREATE TABLE public.rental_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gear_name text NOT NULL CHECK (char_length(gear_name) BETWEEN 1 AND 120),
  category text NOT NULL CHECK (char_length(category) BETWEEN 1 AND 60),
  start_date date NOT NULL,
  end_date date NOT NULL,
  customer_name text NOT NULL CHECK (char_length(customer_name) BETWEEN 2 AND 100),
  customer_email text NOT NULL CHECK (char_length(customer_email) <= 255),
  customer_phone text NOT NULL CHECK (char_length(customer_phone) <= 20),
  notes text NOT NULL DEFAULT '' CHECK (char_length(notes) <= 1000),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_date >= start_date)
);

ALTER TABLE public.rental_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a pending inquiry" ON public.rental_inquiries
  FOR INSERT TO anon, authenticated WITH CHECK (status = 'pending');
```

### API Endpoint: `POST /api/inquiries`
- **Request Body (JSON)**:
  ```json
  {
    "gear_name": "RED V-Raptor 8K VV",
    "category": "Cinema Bodies",
    "daily_rate": 45000,
    "customer_name": "Santosh Sivan, ISC",
    "customer_email": "santosh@mumbaicinema.in",
    "customer_phone": "+91 98200 12345",
    "start_date": "2026-10-25",
    "end_date": "2026-10-28",
    "notes": "Film City Studio 5 delivery. Include 2x 150Wh spares."
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "ok": true,
    "reference": "GS-B4A9C12E",
    "confirmation": {
      "id": "b4a9c12e-...",
      "gear_name": "RED V-Raptor 8K VV",
      "category": "Cinema Bodies",
      "daily_rate": 45000,
      "start_date": "2026-10-25",
      "end_date": "2026-10-28",
      "customer_name": "Santosh Sivan, ISC",
      "customer_email": "santosh@mumbaicinema.in"
    }
  }
  ```
- **Response `422 Unprocessable Content`**:
  Returns field-specific errors if email format, phone format, or date order fails validation.

---

## Getting Started

### Prerequisites
- Node.js 20+ / 22+ (or Bun)
- npm 10+

### 1. Clone & Install
```bash
git clone <repository-url>
cd GearShare
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root (see `.env.example`):

```bash
# Supabase Project Credentials
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-or-publishable-key"

# Client Aliases
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-or-publishable-key"

# Server-Side Only Service Key (Optional: for privileged admin tasks)
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

> **Security Note**: `.env` and `.env.local` are strictly excluded from git tracking via `.gitignore`. Never commit service role secrets into source control.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

### 4. Run Test Suite
```bash
npm run test
```

### 5. Production Build
```bash
npm run build
npm run preview
```

---

## Technical Design & Security Highlights

1. **Client Bundle Secret Isolation**:
   - `SUPABASE_SERVICE_ROLE_KEY` is strictly accessed in server handlers (`src/routes/api/inquiries.ts` / `client.server.ts`) and is never packaged in client-facing browser bundles.
   - Client requests communicate with Supabase via publishable keys with Row-Level Security (RLS) enforcement.

2. **Opaque Publishable Key Handling**:
   - New Supabase API keys (`sb_publishable_...`) are opaque strings rather than traditional JWT bearer tokens.
   - Our fetch interceptor in `src/routes/api/inquiries.ts` and `client.ts` automatically strips invalid `Authorization: Bearer sb_...` headers while attaching `apikey`, guaranteeing 100% compliance with Supabase PostgREST endpoints.

3. **Inertial Physics & Responsive Fallbacks**:
   - The 3D flagship camera showcase utilizes linear interpolation (`lerp`) on mouse coordinates, producing organic physical mass and smooth acceleration/deceleration.
   - When running on touch devices or under `prefers-reduced-motion: reduce`, 3D perspectives gracefully transition into smooth 2D elevations, ensuring complete accessibility and flawless mobile ergonomics.

4. **Dual Validation Architecture**:
   - Validation occurs instantly on the client for immediate UI feedback.
   - Validation is re-executed authoritatively on the server route to guarantee zero database injection or malformed records.

5. **Cinema Seat-Booking Stage Schedule Matrix**:
   - Replaced browser-native masked date inputs with a high-tactility, movie ticket seat-selection style grid.
   - Real-time visual categorization between available slots (green pips), stage-occupied units (with busy locks and stage hold notices), and selected shoot windows (`CALL` / `WRAP` dates with continuous in-range highlighting).
   - Seamless month navigation with local timezone formatting, volume discount presets (1/3/7 days), and pinned modal scrolling ergonomics.

---

## License

Built for technical demonstration and assessment. All cinema camera brands (RED, ARRI, Sony, Cooke, Zeiss) are trademarks of their respective owners.

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

---

## Architectural Overview

GearShare is designed with an **ultra-dark pitch-black void aesthetic** (`#050505` to `#070709`) punctuated by **anodized cinema-red accents** (`#ef4444` / `#e11d48`) and high-contrast monospaced technical telemetry (`JetBrains Mono`).

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 Client Browser Layer                                        │
│  - Apple-Style Scroll-Linked Exploded Cinema Camera HTML5 Canvas (~350vh Pinned Engine)    │
│  - 4 Synchronized Storytelling Beats (Hero Body -> Sensor Block -> Optical Flange -> Wrap) │
│  - 3D Optical LUT Benchmark & Perspective Tilt Rig                                         │
│  - Dynamic Duration Pricing Toggle [1 Day | 3 Days (-10%) | 7 Days (-25%)]                 │
│  - ReserveModal with Seat-Matrix Stage Calendar, Zod Validation, and Supabase Persistence   │
└──────────────────────────────────────────────┬──────────────────────────────────────────────┘
                                               │ HTTP JSON
                                               ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                              TanStack Start / Nitro SSR Layer                               │
│  - Server Route: POST /api/inquiries                                                        │
│  - Dual Zod Schema Validation (Customer Name, Email, Phone, Start Date, End Date, Notes)   │
│  - Unique Reference Generator (GS-MUM-XXXXXX)                                               │
│  - Direct Insert into public.rental_inquiries & public.rental_bookings                      │
└──────────────────────────────────────────────┬──────────────────────────────────────────────┘
                                               │ PostgREST HTTPS
                                               ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   Supabase PostgreSQL 15                                    │
│  - Table: public.rental_inquiries (gear_name, category, start_date, end_date, etc.)          │
│  - Row-Level Security (RLS) Policy for public pending holds                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Tech Stack & Design System
- **Core Engine**: Apple-Style Scroll-Linked HTML5 Canvas Scrollytelling (~350vh sticky viewport, 60fps image-sequence scrubbing, and procedural exploded cinema rig fallback)
- **Framework**: React 19 + TanStack Start (Nitro SSR Engine) + TanStack Router (100% TypeScript)
- **Styling**: Tailwind CSS v4 with pitch-black void palette (`#050505`), translucent charcoal surfaces (`#0d0d11`), graphite borders, and anodized cinema-red accents (strictly no gold/yellow)
- **Database & Persistence**: Supabase PostgreSQL 15 + PostgREST with Row Level Security (RLS)
- **Validation**: Zod schema with client and server enforcement (`end_date >= start_date`, E.164 phone, RFC email)
- **Icons & Motion**: Lucide React + requestAnimationFrame inertial lerp + CSS 3D perspectives

---

## 7 Core Landing Page Sections

1. **Fixed Apple-Style Navbar**:
   - Slim translucent glassmorphic bar (`backdrop-blur-xl bg-[#050505]/75 border-b border-zinc-800/50`).
   - Brand mark: `● GEARSHARE` with pulsing red tally light.
   - Navigation links: `Overview`, `Hardware`, `Scrollytech`, `Pricing`, `FAQ`, and `Track Dispatch`.
   - Call-to-action button: Anodized-red rounded pill `Rent Kit`.

2. **Scroll-Linked Hero Canvas Engine (Apple Scrollytelling)**:
   - Sticky full-screen HTML5 `<canvas>` inside a `~350vh` container.
   - Preloaded image sequence scrubbing (`/frames/frame_[index].jpg` up to 120 frames) with procedural exploded cinema assembly fallback (chassis, heatsink, Exmor R sensor block, titanium mount, floating chromatic glass elements, front housing, laser telemetry).
   - **4 Synchronized Storytelling Beats**:
     - *0% - 20% (Hero Shot)*: Assembled cinema camera body. Headline: `"GearShare • Precision Optics. Uncompromised Sensor Power."` Subcopy: `"The cinema hardware behind award-winning frames. Calibrated, cased, and dispatched to your set."`
     - *20% - 50% (Internal Breakdown)*: Camera body smoothly disassembles into exploded components. Headline: `"Exmor R Full-Frame Sensor Block. 16-Bit RAW Output."`
     - *50% - 80% (Optical Rig & Flange)*: Exploded PL/E-mount glass and anamorphic paths. Headline: `"Bench-Calibrated Flange & Optic Tolerances."`
     - *80% - 100% (Reassembly & Transition)*: Components snap back into the sealed magnesium body. CTA: `"Ready for Wrap Time. Rent the Fleet Below."`

3. **Interactive Equipment Catalog**:
   - Filter pills: `All`, `Cinema Bodies`, `Anamorphic & Primes`, `Lighting & Grip`, `Audio`.
   - Segmented Duration Switcher: `[1 Day | 3 Days (-10%) | 7 Days (-25%)]` that dynamically recalibrates rates across all cards in real time in Indian Rupees (`₹`).
   - Flagship gear cards:
     - **Sony FX3 Full-Frame Cinema** (4K 120p, 16-bit RAW HDMI, active cooling)
     - **Canon R5 C Cinema Line** (8K 60p RAW, RF Mount, Dual Pixel CMOS AF II)
     - **ARRI Alexa Mini LF Mock** (Large Format 4.5K ALEV III, LPL/PL Mount)
     - **Sony FE 24-70mm f/2.8 GM II** (Constant f/2.8, XD Linear Motors, de-clicked iris)
     - **Aputure Light Storm 300d II Kit** (5500K Daylight, Bowens Mount, 55,000 lux)
     - Along with RED V-Raptor 8K VV, Zeiss Master Prime, Cooke S4/i, Astera Titan Tubes, and Sound Devices 833.
   - Interactive "Specs" modal and instant "Reserve" trigger button.

4. **4-Block Bento Hardware Specs**:
   - **Block 1**: `"Sub-Micron Sensor Bench Testing"` with interactive digital collimator (ARRI PL, ARRI LPL, Sony E, Canon RF presets, ±0.010mm tolerance pass gauge).
   - **Block 2**: `"Production Damage Shield (Zero Deposit for verified DPs)"` (100% in-transit and on-set accidental coverage, WICA & GSTIN instant waiver).
   - **Block 3**: `"3-Hour Studio Set Dispatch Across Mumbai"` (Pelican Air hardcases dispatched directly to Film City, Mehboob, Yash Raj, and national studios).
   - **Block 4**: `"Pre-Charged V-Mount Batteries & Flight Pelican Cases"` (Pre-charged quad 150Wh V-mount cells, dual fast-chargers, 15mm carbon rods).

5. **Rental Pipeline Workflow**:
   - 3-step timeline:
     - `01 / Select Hardware`
     - `02 / 15-min ID Check`
     - `03 / Studio Delivery`

6. **Operational FAQ Accordion**:
   - Clean expandable dark cards covering deposit policies, accidental damage waivers, extensions, emergency hot-swaps mid-shoot, and soundstage return protocols.

7. **Technical Footer**:
   - Complete platform sitemap, operational cinema depot hubs (Film City, Andheri, Bandra, Hyderabad, Delhi NCR, Bengaluru), legal disclaimers, and required prototype credit:
     `"ZootechX Technical Assessment Prototype • Topic 02: GearShare"`.

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

## Mandatory AI Reference Disclosures

In accordance with transparent engineering disclosure requirements for the ZootechX Technical Assessment:
1. **AI Pair Programming & Architecture Assistance**:
   - Claude 3.7 Sonnet / Google DeepMind Antigravity was utilized for scaffolding TypeScript type definitions, optimizing HTML5 2D canvas procedural exploded rendering loops, refactoring Tailwind CSS v4 design tokens, and generating Vitest test suites.
2. **Asset Generation**:
   - High-resolution studio product renders of cinema bodies and equipment (`Sony FX3`, `Canon R5 C`, `Sony 24-70mm GM II`, `Aputure 300d II`) were generated using AI generative imaging models under strict technical dark mode art direction (`#050505` pitch-black background, 2.39:1 cinema framing, studio rim lighting).
3. **Engineering Integrity**:
   - All client and server code, Zod validation schemas, Supabase PostgreSQL RLS policies, and TanStack Start Nitro endpoints were reviewed, tested, and validated with zero runtime or compilation errors.

---

## License

Built for technical demonstration and assessment (ZootechX Technical Assessment Prototype • Topic 02: GearShare). All cinema camera brands (Sony, Canon, ARRI, RED, Cooke, Zeiss, Aputure, Sound Devices) are trademarks of their respective owners.


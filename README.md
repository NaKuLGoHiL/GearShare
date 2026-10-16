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

### Tech Stack
- **Framework**: React 19 + TanStack Start (Nitro SSR Engine) + TanStack Router
- **Styling**: Tailwind CSS v4 with custom OKLCH matte carbon palette and hardware rim lighting
- **Data Persistence**: Supabase (PostgreSQL 15 + PostgREST with strict Row Level Security)
- **Validation**: Zod schema with dual-casing support (`camelCase` & `snake_case`)
- **Icons & Motion**: Lucide React + GPU-accelerated CSS 3D Matrix & requestAnimationFrame inertial damping
- **Testing**: Vitest + Testing Library

---

## 7 Landing Page Sections

1. **Sticky Navigation Header**:
   - Pulsing cinema-red tally mark (`REC` indicator).
   - High-contrast monospaced brand typography with `MUMBAI HQ · INDIA` badge.
   - Smooth navigation anchors (`#hero-bench`, `#catalog`, `#hardware`, `#pipeline`, `#faq`).
   - National dispatch hub status (`MUMBAI · HYD · NCR · BLR`).
   - Primary "Rent Kit" CTA with mobile-responsive slide-down drawer.

2. **3D Interactive Hero Section**:
   - Dynamic 3D perspective camera showcase with inertial lerp smoothing (`requestAnimationFrame`).
   - Anodized cinema-red rim lighting responding to cursor coordinates.
   - Real-time gloss specular reflection sheen that slides across lens elements.
   - 3D Z-axis telemetry layers: live 24fps running timecode counter (`01:24:18:14`), focal dimensions, and sensor latitude.
   - Interactive model hot-swap toggle between **RED V-Raptor 8K VV** and **ARRI Alexa Mini LF**.
   - Dual CTAs: "Browse Rental Catalog" and "How It Works".

3. **Interactive Equipment Catalog**:
   - Filterable categories: `All`, `Cinema Bodies`, `Anamorphic & Primes`, `Lighting & Grip`, `Audio`.
   - Real-time search query filtering by equipment name, mount, or sensor specs.
   - **Duration Calculator Switcher**: `[1 Day | 3 Days (-10%) | 7 Days (-25%)]` dynamically recalculating package totals with smooth numeric transitions in Indian Rupees (`₹`).
   - Interactive 3D perspective hover cards with shadow expansion and red edge highlights.
   - Modal trigger that passes equipment details and selected duration into the booking engine.

4. **4-Block Bento Specification Grid**:
   - **01 / Bench-Calibrated Optics**: Flange focal distance verified on collimator (`FFD ±0.01mm`) in Class-100 cleanroom.
   - **02 / Production Damage Shield**: Zero security deposit (`₹0 DEPOSIT`) for verified productions and WICA/SICA crew.
   - **03 / Immediate Metro Set Dispatch**: Flight-ready Pelican Air cases dispatched to sets in `< 3H METRO` across Film City Goregaon, Bandra, Andheri, and Ramoji Film City.
   - **04 / Power & Rig Ready**: Four 150Wh high-load V-mount lithium packs, quad-charger, and carbon 15mm rods standard.

5. **Rental Pipeline Workflow**:
   - 3-step zero-downtime timeline:
     - `01 / Select Hardware & Shoot Window`
     - `02 / Fast ID & GSTIN Clearance` (< 60 min clearance)
     - `03 / Calibrated Direct Studio Dispatch` (charged to 100%, collimation sheet signed)

6. **Operational FAQ Accordion**:
   - Expandable questions addressing damage coverage, emergency 3-hour hot-swap protocols, GSTIN and Aadhaar/PAN verification, custom lens shims, and wrap logistics across Film City, Andheri West, and Jubilee Hills.

7. **Technical Footer**:
   - 24/7 National Dispatch Hub telemetry:
     - Hub 01: Mumbai HQ (Goregaon Film City & Andheri West)
     - Hub 02: Hyderabad (Jubilee Hills & Ramoji Film City)
     - Hub 03: Delhi NCR (Noida Film City & DLF Cyber City)
     - Hub 04: Bengaluru (Indiranagar & Koramangala)
   - Prototype attribution, legal trademark disclaimer, and database status indicator.

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

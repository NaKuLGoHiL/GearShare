-- GearShare Production Schema Migration: Cinema Engine
-- PostgreSQL 15 / Supabase DDL with Row Level Security (RLS)

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CUSTOMER PROFILES (WICA & GSTIN KYC)
CREATE TABLE IF NOT EXISTS public.customer_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    production_house TEXT,
    gstin TEXT,
    wica_card_number TEXT,
    kyc_status TEXT NOT NULL DEFAULT 'unverified' 
        CHECK (kyc_status IN ('unverified', 'pending', 'verified', 'rejected')),
    deposit_waiver_approved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. GEAR INVENTORY FLEET
CREATE TABLE IF NOT EXISTS public.gear_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    mount_type TEXT,
    sensor_type TEXT,
    base_daily_rate NUMERIC(10, 2) NOT NULL,
    replacement_value NUMERIC(12, 2) NOT NULL,
    serial_number TEXT UNIQUE,
    flange_focal_distance_calibrated_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'available' 
        CHECK (status IN ('available', 'maintenance', 'on_set', 'retired')),
    specs JSONB NOT NULL DEFAULT '[]'::jsonb,
    included_accessories JSONB NOT NULL DEFAULT '[]'::jsonb,
    image_url TEXT,
    badge TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. INVENTORY BLOCKS (CALENDAR MATRIX SEAT LOCKS)
CREATE TABLE IF NOT EXISTS public.inventory_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gear_id UUID NOT NULL REFERENCES public.gear_inventory(id) ON DELETE CASCADE,
    booking_id UUID,
    block_date DATE NOT NULL,
    block_type TEXT NOT NULL DEFAULT 'confirmed' 
        CHECK (block_type IN ('hold', 'confirmed', 'maintenance', 'turnaround_buffer')),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT gear_block_date_unique UNIQUE(gear_id, block_date)
);
CREATE INDEX IF NOT EXISTS idx_blocks_gear_date ON public.inventory_blocks(gear_id, block_date);

-- 5. RENTAL BOOKINGS
CREATE TABLE IF NOT EXISTS public.rental_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_code TEXT NOT NULL UNIQUE,
    customer_id UUID REFERENCES public.customer_profiles(id),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shoot_start_date DATE NOT NULL,
    shoot_return_date DATE NOT NULL,
    total_days INTEGER NOT NULL CHECK (total_days >= 1),
    subtotal_inr NUMERIC(10, 2) NOT NULL,
    discount_inr NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    gst_inr NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_amount_inr NUMERIC(10, 2) NOT NULL,
    security_deposit_inr NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    deposit_waiver_applied BOOLEAN NOT NULL DEFAULT FALSE,
    stage_destination TEXT NOT NULL,
    metro_hub TEXT NOT NULL DEFAULT 'Mumbai' 
        CHECK (metro_hub IN ('Mumbai', 'Hyderabad', 'Delhi NCR', 'Bengaluru')),
    status TEXT NOT NULL DEFAULT 'hold_requested' 
        CHECK (status IN (
            'hold_requested', 
            'kyc_review', 
            'confirmed', 
            'prepped_and_calibrated', 
            'van_dispatched', 
            'on_set', 
            'wrap_returned', 
            'collimation_cleared', 
            'closed', 
            'cancelled'
        )),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
CREATE INDEX IF NOT EXISTS idx_bookings_ref ON public.rental_bookings(reference_code);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON public.rental_bookings(shoot_start_date, shoot_return_date);

-- 6. BOOKING ITEMS
CREATE TABLE IF NOT EXISTS public.booking_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.rental_bookings(id) ON DELETE CASCADE,
    gear_id UUID NOT NULL REFERENCES public.gear_inventory(id),
    daily_rate NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    subtotal_inr NUMERIC(10, 2) NOT NULL
);

-- 7. DISPATCH INSPECTIONS (COLLIMATION CERTIFICATE)
CREATE TABLE IF NOT EXISTS public.dispatch_inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.rental_bookings(id) ON DELETE CASCADE,
    gear_id UUID NOT NULL REFERENCES public.gear_inventory(id),
    inspector_name TEXT NOT NULL,
    flange_focal_distance_mm NUMERIC(5, 3) NOT NULL,
    deviation_mm NUMERIC(4, 3) NOT NULL,
    sensor_clean_pass BOOLEAN NOT NULL DEFAULT TRUE,
    lens_element_scratch_pass BOOLEAN NOT NULL DEFAULT TRUE,
    checked_out_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    checked_in_at TIMESTAMPTZ,
    return_notes TEXT
);

-- 8. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.gear_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dispatch_inspections ENABLE ROW LEVEL SECURITY;

-- Gear Inventory: Publicly viewable
DROP POLICY IF EXISTS "Public can view active gear" ON public.gear_inventory;
CREATE POLICY "Public can view active gear" ON public.gear_inventory
    FOR SELECT USING (status != 'retired');

-- Inventory Blocks: Publicly viewable for calendar availability
DROP POLICY IF EXISTS "Public can view calendar blocks" ON public.inventory_blocks;
CREATE POLICY "Public can view calendar blocks" ON public.inventory_blocks
    FOR SELECT USING (true);

-- Customers can view & edit their own profile
DROP POLICY IF EXISTS "Users view own profile" ON public.customer_profiles;
CREATE POLICY "Users view own profile" ON public.customer_profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users update own profile" ON public.customer_profiles;
CREATE POLICY "Users update own profile" ON public.customer_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Customers can view their own bookings
DROP POLICY IF EXISTS "Users view own bookings" ON public.rental_bookings;
CREATE POLICY "Users view own bookings" ON public.rental_bookings
    FOR SELECT USING (auth.uid() = customer_id);

-- 9. INITIAL SEED DATA FLEET (MUMBAI CINEMA VAULT)
INSERT INTO public.gear_inventory (slug, name, brand, category, mount_type, sensor_type, base_daily_rate, replacement_value, badge, specs, included_accessories)
VALUES
(
    'red-v-raptor-8k-vv',
    'RED V-Raptor 8K VV',
    'RED Digital Cinema',
    'Cinema Bodies',
    'RF / PL Mount',
    '8K VistaVision CMOS (40.96 x 21.60 mm)',
    45000.00,
    3800000.00,
    'FLAGSHIP',
    '["8K VistaVision", "RF / PL Mount", "17+ Stops Dynamic Range", "120fps @ 8K", "REDCODE RAW"]'::jsonb,
    '["Pelican 1510 Air Case", "4x Micro V-Mount 150Wh Batteries", "Dual Fast Charger", "2x 1TB CFexpress Type B", "DSMC3 RED Touch 7.0 Monitor", "15mm Baseplate & Carbon Rods"]'::jsonb
),
(
    'arri-alexa-mini-lf',
    'ARRI Alexa Mini LF',
    'ARRI',
    'Cinema Bodies',
    'LPL / PL Mount',
    'Large Format 4.5K ALEV III CMOS (36.70 x 25.54 mm)',
    60000.00,
    6500000.00,
    'INDUSTRY STANDARD',
    '["Large Format 4.5K", "LPL / PL Mount", "ARRIRAW 90fps", "Internal FSND (0.6/1.2/1.8)", "ARRI Look File 4"]'::jsonb,
    '["Custom Flight Hardcase", "MVF-2 High-Res OLED Viewfinder", "4x 290Wh High-Draw V-Mounts", "Codex Compact Drive Reader + 3x 1TB Drives", "ARRI Bridgeplate BP-8"]'::jsonb
),
(
    'sony-fx9-full-frame',
    'Sony FX9 Full-Frame',
    'Sony',
    'Cinema Bodies',
    'E / PL Mount',
    'Full-Frame 6K Exmor R CMOS (Oversampled 4K)',
    22000.00,
    1400000.00,
    'DOCUMENTARY PRO',
    '["Full-Frame 6K Oversampling", "E / PL Mount", "Dual Base ISO (800 / 4000)", "Fast Hybrid AF with Face Track", "Electronic Variable ND"]'::jsonb,
    '["Pelican 1560 Case", "XDCA-FX9 Extension Unit with RAW Out", "4x BP-U90 Batteries", "BC-U2A Charger", "3x 240GB XQD Cards", "Shape Top Plate & Grip"]'::jsonb
),
(
    'cooke-s4i-prime-set',
    'Cooke S4/i Prime 5-Lens Set',
    'Cooke Optics',
    'Anamorphic & Primes',
    'PL Mount',
    'Super 35mm & Large Format Friendly',
    38000.00,
    5200000.00,
    'THE COOKE LOOK',
    '["18mm, 25mm, 35mm, 50mm, 75mm", "T2.0 Aperture", "Cooke /i Technology Telemetry", "Iconic Warm Organic Bokeh", "Cam-Style Focus"]'::jsonb,
    '["Custom Flight Peli Case with Velvet Cutouts", "Front & Rear Caps", "110mm Clamp-on Step Rings", "Microfiber Cleansing Kit"]'::jsonb
),
(
    'zeiss-master-prime-35mm',
    'Zeiss Master Prime 35mm T1.3',
    'Carl Zeiss / ARRI',
    'Anamorphic & Primes',
    'PL Mount',
    'Super 35mm Format',
    18000.00,
    2100000.00,
    'ULTRA-FAST T1.3',
    '["35mm Focal Length", "Ultra-Fast T1.3 Stop", "Zero Breathing Dual-Floating Elements", "High Contrast & Resolution", "PL Mount"]'::jsonb,
    '["Flight-Ready Pelican Padded Case", "114mm Front Cap", "Rear PL Metal Cap", "Focus & Iris Gear Caps"]'::jsonb
),
(
    'aputure-nova-p600c',
    'Aputure Nova P600c RGBWW Panel',
    'Aputure',
    'Lighting & Grip',
    'Junior Pin (28mm)',
    'Full RGBWW High-Output Soft Light',
    12000.00,
    450000.00,
    'STUDIO LIGHTING',
    '["600W RGBWW Output", "2,000K to 10,000K CCT", "CRI 95+ / TLCI 95+", "Sidus Link App & CRMX Control", "Built-in Effects Engine"]'::jsonb,
    '["Heavy Duty Rolling Flight Case", "Control Box & Clamp", "Neutrik powerCON TRUE1 Cable (6m)", "Collapsible Softbox & 45° Honeycomb Grid"]'::jsonb
),
(
    'sound-devices-833-mixer',
    'Sound Devices 833 8-Channel Mixer',
    'Sound Devices',
    'Audio',
    'TA3 / XLR',
    'Ultra-Low Noise Kashmir Mic Preamps',
    15000.00,
    620000.00,
    'BROADCAST AUDIO',
    '["6 Mic/Line Preamps", "8 Channels / 12 Tracks", "Dual SD Card Recording", "Automixing Dugan / MixAssist", "Internal Timecode Generator"]'::jsonb,
    '["Orca Audio Production Bag & Harness", "4x NP-F970 Batteries & Dual Charger", "Hirose Power Cable", "2x SanDisk Extreme Pro 128GB SD Cards"]'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

import {
  pgTable,
  uuid,
  text,
  numeric,
  boolean,
  integer,
  timestamp,
  date,
  jsonb,
  index,
  unique,
} from "drizzle-orm/pg-core";

// 1. Customer & Filmmaker Profiles (WICA / GSTIN / KYC Verification)
export const customerProfiles = pgTable("customer_profiles", {
  id: uuid("id").primaryKey(), // references auth.users(id)
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  productionHouse: text("production_house"),
  gstin: text("gstin"),
  wicaCardNumber: text("wica_card_number"),
  kycStatus: text("kyc_status").notNull().default("unverified"), // 'unverified', 'pending', 'verified', 'rejected'
  depositWaiverApproved: boolean("deposit_waiver_approved").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// 2. Master Cinema Hardware Fleet Inventory
export const gearInventory = pgTable("gear_inventory", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  brand: text("brand").notNull(), // ARRI, RED, Sony, Cooke, etc.
  category: text("category").notNull(), // Cinema Bodies, Anamorphic & Primes, Lighting & Grip, Audio
  mountType: text("mount_type"), // PL, LPL, E-Mount, RF
  sensorType: text("sensor_type"),
  baseDailyRate: numeric("base_daily_rate", { precision: 10, scale: 2 }).notNull(), // INR (₹)
  replacementValue: numeric("replacement_value", { precision: 12, scale: 2 }).notNull(),
  serialNumber: text("serial_number").unique(),
  flangeFocalDistanceCalibratedAt: timestamp("flange_focal_distance_calibrated_at", { withTimezone: true }),
  status: text("status").notNull().default("available"), // available, maintenance, on_set, retired
  specs: jsonb("specs").$type<string[]>().notNull().default([]),
  includedAccessories: jsonb("included_accessories").$type<string[]>().notNull().default([]),
  imageUrl: text("image_url"),
  badge: text("badge"), // FLAGSHIP, INDUSTRY STANDARD, etc.
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// 3. Calendar Date Blocks & Slot Reservation (Powers Seat-Selection Matrix)
export const inventoryBlocks = pgTable(
  "inventory_blocks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gearId: uuid("gear_id")
      .notNull()
      .references(() => gearInventory.id, { onDelete: "cascade" }),
    bookingId: uuid("booking_id"), // Nullable during initial hold lock
    blockDate: date("block_date").notNull(),
    blockType: text("block_type").notNull().default("confirmed"), // 'hold', 'confirmed', 'maintenance', 'buffer'
    expiresAt: timestamp("expires_at", { withTimezone: true }), // 15-minute checkout hold expiration
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("gear_block_date_unique").on(table.gearId, table.blockDate),
    index("idx_blocks_gear_date").on(table.gearId, table.blockDate),
  ]
);

// 4. Primary Rental Bookings Orders
export const rentalBookings = pgTable(
  "rental_bookings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    referenceCode: text("reference_code").notNull().unique(), // e.g. 'GS-MUM-849201'
    customerId: uuid("customer_id").references(() => customerProfiles.id),
    customerName: text("customer_name").notNull(),
    customerEmail: text("customer_email").notNull(),
    customerPhone: text("customer_phone").notNull(),
    shootStartDate: date("shoot_start_date").notNull(),
    shootReturnDate: date("shoot_return_date").notNull(),
    totalDays: integer("total_days").notNull(),
    subtotalInr: numeric("subtotal_inr", { precision: 10, scale: 2 }).notNull(),
    discountInr: numeric("discount_inr", { precision: 10, scale: 2 }).notNull().default("0.00"),
    gstInr: numeric("gst_inr", { precision: 10, scale: 2 }).notNull().default("0.00"), // 18% GST for film production
    totalAmountInr: numeric("total_amount_inr", { precision: 10, scale: 2 }).notNull(),
    securityDepositInr: numeric("security_deposit_inr", { precision: 10, scale: 2 }).notNull().default("0.00"),
    depositWaiverApplied: boolean("deposit_waiver_applied").notNull().default(false),
    stageDestination: text("stage_destination").notNull(), // Film City Studio 5, Goregaon
    metroHub: text("metro_hub").notNull().default("Mumbai"), // Mumbai, Hyderabad, Delhi NCR, Bengaluru
    status: text("status").notNull().default("hold_requested"), // hold_requested, kyc_review, confirmed, van_dispatched, on_set, closed, cancelled
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_bookings_ref").on(table.referenceCode),
    index("idx_bookings_dates").on(table.shootStartDate, table.shootReturnDate),
  ]
);

// 5. Booking Line Items
export const bookingItems = pgTable("booking_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id")
    .notNull()
    .references(() => rentalBookings.id, { onDelete: "cascade" }),
  gearId: uuid("gear_id")
    .notNull()
    .references(() => gearInventory.id),
  dailyRate: numeric("daily_rate", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull().default(1),
  subtotalInr: numeric("subtotal_inr", { precision: 10, scale: 2 }).notNull(),
});

// 6. Stage Dispatch Optical Inspections (±0.01mm FFD Calibration Certificate)
export const dispatchInspections = pgTable("dispatch_inspections", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id")
    .notNull()
    .references(() => rentalBookings.id, { onDelete: "cascade" }),
  gearId: uuid("gear_id")
    .notNull()
    .references(() => gearInventory.id),
  inspectorName: text("inspector_name").notNull(),
  flangeFocalDistanceMm: numeric("flange_focal_distance_mm", { precision: 5, scale: 3 }).notNull(), // e.g. 52.000
  deviationMm: numeric("deviation_mm", { precision: 4, scale: 3 }).notNull(), // within ±0.010 mm
  sensorCleanPass: boolean("sensor_clean_pass").notNull().default(true),
  lensElementScratchPass: boolean("lens_element_scratch_pass").notNull().default(true),
  checkedOutAt: timestamp("checked_out_at", { withTimezone: true }).notNull().defaultNow(),
  checkedInAt: timestamp("checked_in_at", { withTimezone: true }),
  returnNotes: text("return_notes"),
});

// 7. Legacy Lead Inquiries (Retained for backward compatibility)
export const rentalInquiries = pgTable("rental_inquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  gearName: text("gear_name").notNull(),
  category: text("category").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  notes: text("notes"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

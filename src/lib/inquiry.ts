import { z } from "zod";

/**
 * Normalizing Zod schema for rental inquiries.
 * Supports both camelCase and snake_case inputs for maximum flexibility.
 */
export const rawInquirySchema = z
  .object({
    gear_name: z.string().trim().min(1, "Equipment name is required").max(120).optional(),
    gear: z.string().trim().min(1).max(120).optional(),
    category: z.string().trim().min(1, "Category is required").max(60),
    daily_rate: z.coerce.number().positive("Daily rate must be a positive number").optional(),
    dailyRate: z.coerce.number().positive("Daily rate must be a positive number").optional(),
    customer_name: z.string().trim().min(2, "Full name must be at least 2 characters").max(100).optional(),
    name: z.string().trim().min(2, "Full name must be at least 2 characters").max(100).optional(),
    customer_email: z.string().trim().email("Please provide a valid email address").max(255).optional(),
    email: z.string().trim().email("Please provide a valid email address").max(255).optional(),
    customer_phone: z
      .string()
      .trim()
      .regex(/^[+\d][\d\s\-().]{6,20}$/, "Please provide a valid phone number (e.g. +91 98200 12345)")
      .optional(),
    phone: z
      .string()
      .trim()
      .regex(/^[+\d][\d\s\-().]{6,20}$/, "Please provide a valid phone number (e.g. +91 98200 12345)")
      .optional(),
    start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please select a valid start date (YYYY-MM-DD)").optional(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please select a valid start date (YYYY-MM-DD)").optional(),
    end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please select a valid return date (YYYY-MM-DD)").optional(),
    returnDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please select a valid return date (YYYY-MM-DD)").optional(),
    notes: z.string().trim().max(1000, "Notes must not exceed 1000 characters").optional().default(""),
  })
  .transform((val) => {
    const gearName = val.gear_name || val.gear || "";
    const dailyRate = val.daily_rate ?? val.dailyRate ?? 0;
    const customerName = val.customer_name || val.name || "";
    const customerEmail = val.customer_email || val.email || "";
    const customerPhone = val.customer_phone || val.phone || "";
    const startDate = val.start_date || val.startDate || "";
    const endDate = val.end_date || val.returnDate || "";

    return {
      gear_name: gearName,
      gear: gearName,
      category: val.category,
      daily_rate: dailyRate,
      dailyRate: dailyRate,
      customer_name: customerName,
      name: customerName,
      customer_email: customerEmail,
      email: customerEmail,
      customer_phone: customerPhone,
      phone: customerPhone,
      start_date: startDate,
      startDate: startDate,
      end_date: endDate,
      returnDate: endDate,
      notes: val.notes ?? "",
    };
  })
  .refine((d) => Boolean(d.gear_name), {
    message: "Equipment selection is required",
    path: ["gear_name"],
  })
  .refine((d) => Boolean(d.customer_name && d.customer_name.length >= 2), {
    message: "Full name must be at least 2 characters",
    path: ["customer_name"],
  })
  .refine((d) => Boolean(d.customer_email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.customer_email)), {
    message: "A valid email address is required",
    path: ["customer_email"],
  })
  .refine((d) => Boolean(d.customer_phone && /^[+\d][\d\s\-().]{6,20}$/.test(d.customer_phone)), {
    message: "A valid contact phone number is required",
    path: ["customer_phone"],
  })
  .refine((d) => Boolean(d.start_date), {
    message: "Shoot start date is required",
    path: ["start_date"],
  })
  .refine((d) => Boolean(d.end_date), {
    message: "Return date is required",
    path: ["end_date"],
  })
  .refine((d) => d.end_date >= d.start_date, {
    message: "Return date must be equal to or after start date",
    path: ["end_date"],
  });

export const inquirySchema = rawInquirySchema;

export type Inquiry = z.infer<typeof inquirySchema>;

export const DURATIONS = [
  { days: 1, label: "1 Day", discount: 0, tag: "STANDARD" },
  { days: 3, label: "3 Days", discount: 0.1, tag: "-10% OFF" },
  { days: 7, label: "7 Days", discount: 0.25, tag: "-25% OFF" },
] as const;

export function rentalTotal(dailyRate: number, days: number, discount: number): number {
  return Math.round(dailyRate * days * (1 - discount));
}

export function calculateDaysBetween(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 1;
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  if (isNaN(start) || isNaN(end) || end < start) return 1;
  const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, diffDays);
}

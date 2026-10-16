import { z } from "zod";

export const inquirySchema = z
  .object({
    gear: z.string().trim().min(1).max(120),
    category: z.string().trim().min(1).max(60),
    dailyRate: z.number().positive(),
    name: z.string().trim().min(2, "Enter your full name").max(100),
    email: z.string().trim().email("Enter a valid work email").max(255),
    phone: z
      .string()
      .trim()
      .regex(/^[+\d][\d\s\-()]{6,19}$/, "Enter a valid phone number"),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a start date"),
    returnDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a return date"),
    notes: z.string().trim().max(1000).optional().default(""),
  })
  .refine((d) => d.returnDate >= d.startDate, {
    message: "Return date must be on or after start date",
    path: ["returnDate"],
  });

export type Inquiry = z.infer<typeof inquirySchema>;

export const DURATIONS = [
  { days: 1, label: "1 Day", discount: 0 },
  { days: 3, label: "3 Days", discount: 0.1 },
  { days: 7, label: "7 Days", discount: 0.25 },
] as const;

export function rentalTotal(dailyRate: number, days: number, discount: number) {
  return Math.round(dailyRate * days * (1 - discount));
}

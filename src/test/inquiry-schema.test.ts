import { describe, expect, it } from "vitest";
import { inquirySchema, rentalTotal, calculateDaysBetween, DURATIONS } from "@/lib/inquiry";

describe("Inquiry Schema & Pricing Engine", () => {
  it("successfully parses valid rental inquiry with camelCase fields", () => {
    const input = {
      gear: "RED V-Raptor 8K VV",
      category: "Cinema Bodies",
      dailyRate: 45000,
      name: "Santosh Sivan",
      email: "santosh@mumbaicinema.in",
      phone: "+91 98200 12345",
      startDate: "2026-10-25",
      returnDate: "2026-10-28",
      notes: "Testing with full anamorphic package for Film City shoot",
    };

    const res = inquirySchema.safeParse(input);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.gear_name).toBe("RED V-Raptor 8K VV");
      expect(res.data.customer_name).toBe("Santosh Sivan");
      expect(res.data.customer_email).toBe("santosh@mumbaicinema.in");
      expect(res.data.start_date).toBe("2026-10-25");
      expect(res.data.end_date).toBe("2026-10-28");
      expect(res.data.daily_rate).toBe(45000);
    }
  });

  it("successfully parses valid rental inquiry with snake_case fields", () => {
    const input = {
      gear_name: "Sony FX9 Full-Frame",
      category: "Cinema Bodies",
      daily_rate: 22000,
      customer_name: "Ravi K. Chandran",
      customer_email: "ravi@wica.in",
      customer_phone: "+91 98400 67890",
      start_date: "2026-11-01",
      end_date: "2026-11-01", // same day rental is valid
      notes: "Include 2x 150Wh batteries",
    };

    const res = inquirySchema.safeParse(input);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.customer_name).toBe("Ravi K. Chandran");
      expect(res.data.daily_rate).toBe(22000);
    }
  });

  it("rejects invalid email addresses", () => {
    const input = {
      gear: "RED V-Raptor 8K VV",
      category: "Cinema Bodies",
      dailyRate: 45000,
      name: "John Doe",
      email: "not-an-email",
      phone: "+91 98200 12345",
      startDate: "2026-10-25",
      returnDate: "2026-10-28",
    };

    const res = inquirySchema.safeParse(input);
    expect(res.success).toBe(false);
  });

  it("rejects invalid phone numbers", () => {
    const input = {
      gear: "RED V-Raptor 8K VV",
      category: "Cinema Bodies",
      dailyRate: 45000,
      name: "John Doe",
      email: "john@production.com",
      phone: "abc123", // invalid
      startDate: "2026-10-25",
      returnDate: "2026-10-28",
    };

    const res = inquirySchema.safeParse(input);
    expect(res.success).toBe(false);
  });

  it("rejects return dates that occur before start dates", () => {
    const input = {
      gear: "RED V-Raptor 8K VV",
      category: "Cinema Bodies",
      dailyRate: 45000,
      name: "John Doe",
      email: "john@production.com",
      phone: "+91 98200 12345",
      startDate: "2026-10-28",
      returnDate: "2026-10-25", // before start date!
    };

    const res = inquirySchema.safeParse(input);
    expect(res.success).toBe(false);
  });

  it("calculates discounts correctly for 1, 3, and 7 day tiers", () => {
    const baseRate = 40000;

    // 1 Day (0% discount) -> 40000
    expect(rentalTotal(baseRate, 1, 0)).toBe(40000);

    // 3 Days (10% discount) -> 40000 * 3 * 0.9 = 108000
    expect(rentalTotal(baseRate, 3, 0.1)).toBe(108000);

    // 7 Days (25% discount) -> 40000 * 7 * 0.75 = 210000
    expect(rentalTotal(baseRate, 7, 0.25)).toBe(210000);
  });

  it("calculates day difference accurately between dates", () => {
    expect(calculateDaysBetween("2026-10-20", "2026-10-20")).toBe(1);
    expect(calculateDaysBetween("2026-10-20", "2026-10-22")).toBe(3);
    expect(calculateDaysBetween("2026-10-20", "2026-10-26")).toBe(7);
  });
});

import { describe, expect, it } from "vitest";
import { rentalTotal } from "@/lib/inquiry";

describe("Production Kit Cart Calculations", () => {
  const sampleItems = [
    { name: "RED V-Raptor 8K VV", rate: 45000, quantity: 1 },
    { name: "Cooke S4/i 35mm Prime", rate: 12000, quantity: 2 },
    { name: "Aputure 300d II Light", rate: 6000, quantity: 1 },
  ];

  it("calculates total daily rate across multi-item kit", () => {
    const totalDailyRate = sampleItems.reduce(
      (sum, item) => sum + item.rate * item.quantity,
      0
    );
    // 45000 + 24000 + 6000 = 75000
    expect(totalDailyRate).toBe(75000);
  });

  it("applies multi-unit package discount (5%) and multi-day discounts correctly", () => {
    const totalDailyRate = 75000;
    const isBundle = sampleItems.length >= 2;
    const bundleDiscount = isBundle ? 0.05 : 0;

    // 1 Day with bundle: 5% discount
    const total1Day = rentalTotal(totalDailyRate, 1, bundleDiscount);
    expect(total1Day).toBe(Math.round(75000 * 1 * 0.95)); // 71250

    // 3 Days with bundle: 10% multi-day + 5% bundle = 15% discount
    const total3Days = rentalTotal(totalDailyRate, 3, 0.1 + bundleDiscount);
    expect(total3Days).toBe(Math.round(75000 * 3 * 0.85)); // 191250

    // 7 Days with bundle: 25% multi-day + 5% bundle = 30% discount
    const total7Days = rentalTotal(totalDailyRate, 7, 0.25 + bundleDiscount);
    expect(total7Days).toBe(Math.round(75000 * 7 * 0.7)); // 367500
  });
});

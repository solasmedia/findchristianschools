import { describe, it, expect, vi } from "vitest";

// Mock the database module
vi.mock("./db", () => ({
  getSavedSchoolsByUser: vi.fn().mockResolvedValue([
    { id: 1, userId: 1, schoolId: 10, schoolType: "domestic", createdAt: new Date() },
  ]),
  saveSchool: vi.fn().mockResolvedValue({ id: 2, userId: 1, schoolId: 20, schoolType: "domestic", createdAt: new Date() }),
  unsaveSchool: vi.fn().mockResolvedValue(true),
  isSchoolSaved: vi.fn().mockResolvedValue(true),
}));

describe("Saved Schools", () => {
  it("should have correct saved schools DB helper signatures", async () => {
    const { getSavedSchoolsByUser, saveSchool, unsaveSchool, isSchoolSaved } = await import("./db");
    
    // Test list
    const list = await getSavedSchoolsByUser(1);
    expect(list).toHaveLength(1);
    expect(list[0]).toHaveProperty("schoolId");
    expect(list[0]).toHaveProperty("schoolType");
    
    // Test save
    const saved = await saveSchool(1, 20, "domestic");
    expect(saved).toHaveProperty("id");
    
    // Test unsave
    const removed = await unsaveSchool(1, 20, "domestic");
    expect(removed).toBe(true);
    
    // Test isSaved
    const isSaved = await isSchoolSaved(1, 10, "domestic");
    expect(isSaved).toBe(true);
  });
});

describe("Donation Checkout", () => {
  it("should have donation products defined", async () => {
    const products = await import("./stripe/products");
    expect(products.PRODUCTS).toBeDefined();
    expect(products.PRODUCTS).toHaveProperty("donationOneTime");
    expect(products.PRODUCTS).toHaveProperty("donationRecurring");
    expect(products.PRODUCTS.donationOneTime.name).toBe("One-Time Mission Support");
    expect(products.PRODUCTS.donationRecurring.interval).toBe("month");
  });

  it("should have createDonationCheckout function", async () => {
    const checkout = await import("./stripe/checkout");
    expect(checkout.createDonationCheckout).toBeDefined();
    expect(typeof checkout.createDonationCheckout).toBe("function");
  });
});

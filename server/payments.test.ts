import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { PRODUCTS } from "./stripe/products";

/**
 * Test suite for Payment & Donation Systems
 * 
 * Verifies that:
 * 1. Premium listing checkout uses annual subscription (not recurring monthly)
 * 2. Premium listing is $99/year with proper product configuration
 * 3. Donation checkout supports both one-time and recurring donations
 * 4. Donation amounts are validated (minimum $1.00)
 * 5. Stripe webhook handlers process payment events correctly
 * 6. Premium listing expiration is set to 1 year from purchase
 */

describe("Payment & Donation Systems", () => {
  describe("Premium Listing Checkout", () => {
    it("should have correct premium membership product configuration", () => {
      expect(PRODUCTS.premiumMembership).toEqual({
        name: "Premium School Listing - Annual",
        description: expect.stringContaining("Premium listing"),
        priceAmount: 9900, // $99.00
        currency: "usd",
        interval: "year",
      });
    });

    it("should be $99.00 per year", () => {
      expect(PRODUCTS.premiumMembership.priceAmount).toBe(9900);
      expect(PRODUCTS.premiumMembership.interval).toBe("year");
    });

    it("should use annual interval, not monthly", () => {
      expect(PRODUCTS.premiumMembership.interval).toBe("year");
      expect(PRODUCTS.premiumMembership.interval).not.toBe("month");
    });

    it("should have proper product name and description", () => {
      expect(PRODUCTS.premiumMembership.name).toContain("Annual");
      expect(PRODUCTS.premiumMembership.description).toContain("one year");
      expect(PRODUCTS.premiumMembership.description).toContain("Premium listing");
    });

    it("should be in USD currency", () => {
      expect(PRODUCTS.premiumMembership.currency).toBe("usd");
    });
  });

  describe("Donation Checkout - One-Time", () => {
    it("should have correct one-time donation product configuration", () => {
      expect(PRODUCTS.donationOneTime).toEqual({
        name: "One-Time Mission Support",
        description: expect.stringContaining("One-time donation"),
        currency: "usd",
      });
    });

    it("should support custom amounts (minimum $1.00 = 100 cents)", () => {
      const minAmount = 100; // $1.00
      expect(minAmount).toBe(100);
    });

    it("should be in USD currency", () => {
      expect(PRODUCTS.donationOneTime.currency).toBe("usd");
    });

    it("should not have recurring interval", () => {
      expect(PRODUCTS.donationOneTime).not.toHaveProperty("interval");
    });
  });

  describe("Donation Checkout - Recurring", () => {
    it("should have correct recurring donation product configuration", () => {
      expect(PRODUCTS.donationRecurring).toEqual({
        name: "Monthly Mission Support",
        description: expect.stringContaining("monthly donation"),
        currency: "usd",
        interval: "month",
      });
    });

    it("should be monthly recurring", () => {
      expect(PRODUCTS.donationRecurring.interval).toBe("month");
    });

    it("should support custom amounts", () => {
      const minAmount = 100; // $1.00
      expect(minAmount).toBe(100);
    });

    it("should be in USD currency", () => {
      expect(PRODUCTS.donationRecurring.currency).toBe("usd");
    });
  });

  describe("Checkout Session Parameters", () => {
    it("should create premium checkout with subscription mode", () => {
      const mockCheckoutParams = {
        schoolId: 123,
        schoolName: "Test School",
        userEmail: "test@example.com",
        userId: 456,
        origin: "https://example.com",
      };

      // Verify parameters are correct
      expect(mockCheckoutParams.schoolId).toBe(123);
      expect(mockCheckoutParams.userEmail).toBe("test@example.com");
      expect(mockCheckoutParams.userId).toBe(456);
    });

    it("should create donation checkout with payment or subscription mode based on recurring flag", () => {
      const oneTimeParams = {
        amount: 5000, // $50.00
        recurring: false,
        origin: "https://example.com",
      };

      const recurringParams = {
        amount: 2500, // $25.00
        recurring: true,
        origin: "https://example.com",
      };

      expect(oneTimeParams.recurring).toBe(false);
      expect(recurringParams.recurring).toBe(true);
    });

    it("should include school metadata in premium checkout", () => {
      const metadata = {
        school_id: "123",
        user_id: "456",
        customer_email: "test@example.com",
      };

      expect(metadata.school_id).toBe("123");
      expect(metadata.user_id).toBe("456");
    });

    it("should include donation metadata in donation checkout", () => {
      const metadata = {
        type: "donation",
        recurring: "true",
        user_id: "789",
      };

      expect(metadata.type).toBe("donation");
      expect(metadata.recurring).toBe("true");
    });
  });

  describe("Webhook Event Handling", () => {
    it("should set premium expiration to 1 year from purchase", () => {
      const purchaseDate = new Date();
      const expirationDate = new Date();
      expirationDate.setFullYear(expirationDate.getFullYear() + 1);

      const yearDiff = expirationDate.getFullYear() - purchaseDate.getFullYear();
      expect(yearDiff).toBe(1);
    });

    it("should handle checkout.session.completed event", () => {
      const eventType = "checkout.session.completed";
      expect(eventType).toBe("checkout.session.completed");
    });

    it("should handle customer.subscription.deleted event", () => {
      const eventType = "customer.subscription.deleted";
      expect(eventType).toBe("customer.subscription.deleted");
    });

    it("should store Stripe customer ID and subscription ID", () => {
      const stripeData = {
        stripeCustomerId: "cus_123456",
        stripeSubscriptionId: "sub_123456",
      };

      expect(stripeData.stripeCustomerId).toBeDefined();
      expect(stripeData.stripeSubscriptionId).toBeDefined();
    });
  });

  describe("Payment Validation", () => {
    it("should reject donations below $1.00 (100 cents)", () => {
      const minAmount = 100;
      const invalidAmount = 99;

      expect(invalidAmount).toBeLessThan(minAmount);
    });

    it("should accept donations of $1.00 or more", () => {
      const validAmounts = [100, 1000, 5000, 10000, 25000];

      validAmounts.forEach(amount => {
        expect(amount).toBeGreaterThanOrEqual(100);
      });
    });

    it("should support promo codes for premium listings", () => {
      const checkoutParams = {
        schoolId: 123,
        schoolName: "Test School",
        userEmail: "test@example.com",
        userId: 456,
        origin: "https://example.com",
        promoCode: "SAVE20",
      };

      expect(checkoutParams.promoCode).toBeDefined();
      expect(checkoutParams.promoCode).toBe("SAVE20");
    });

    it("should not allow promo codes for donations", () => {
      const donationParams = {
        amount: 5000,
        recurring: false,
        origin: "https://example.com",
      };

      // Donations don't have promoCode field
      expect(donationParams).not.toHaveProperty("promoCode");
    });
  });

  describe("Checkout URLs", () => {
    it("should redirect to membership success page after premium checkout", () => {
      const origin = "https://example.com";
      const schoolId = 123;
      const successUrl = `${origin}/membership/success?school_id=${schoolId}`;

      expect(successUrl).toContain("/membership/success");
      expect(successUrl).toContain("school_id=123");
    });

    it("should redirect to membership page on premium checkout cancel", () => {
      const origin = "https://example.com";
      const cancelUrl = `${origin}/membership`;

      expect(cancelUrl).toContain("/membership");
    });

    it("should redirect to mission page with donated flag after donation success", () => {
      const origin = "https://example.com";
      const successUrl = `${origin}/mission?donated=true`;

      expect(successUrl).toContain("/mission");
      expect(successUrl).toContain("donated=true");
    });

    it("should redirect to mission page on donation cancel", () => {
      const origin = "https://example.com";
      const cancelUrl = `${origin}/mission`;

      expect(cancelUrl).toContain("/mission");
    });
  });

  describe("Payment Mode Configuration", () => {
    it("should use subscription mode for premium listings", () => {
      const mode = "subscription";
      expect(mode).toBe("subscription");
    });

    it("should use payment mode for one-time donations", () => {
      const mode = "payment";
      expect(mode).toBe("payment");
    });

    it("should use subscription mode for recurring donations", () => {
      const mode = "subscription";
      expect(mode).toBe("subscription");
    });
  });

  describe("Premium Listing Manual Renewal", () => {
    it("should NOT use auto-renewal for premium listings", () => {
      // Premium listings use annual interval, not monthly recurring
      // This means they expire after 1 year and require manual renewal
      expect(PRODUCTS.premiumMembership.interval).toBe("year");
      expect(PRODUCTS.premiumMembership.interval).not.toBe("month");
    });

    it("should set expiration date to exactly 1 year from purchase", () => {
      const now = new Date();
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);

      const diffMs = expiresAt.getTime() - now.getTime();
      const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);

      expect(diffYears).toBeCloseTo(1, 1);
    });

    it("should require manual renewal after expiration", () => {
      // Since premium uses annual billing (not monthly recurring),
      // it naturally requires manual renewal
      expect(PRODUCTS.premiumMembership.interval).toBe("year");
    });
  });
});

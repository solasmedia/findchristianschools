import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { schools } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const promoRouter = router({
  // Generate a promo code for a school (admin only)
  generatePromoCode: protectedProcedure
    .input(z.object({
      schoolId: z.number(),
      code: z.string().min(3).max(50),
      discountPercent: z.number().min(1).max(100),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      
      // Verify user is admin or school owner
      const schoolResult = await db.select().from(schools).where(eq(schools.id, input.schoolId)).limit(1);
      const school = schoolResult[0];
      
      if (!school) throw new Error("School not found");
      if (ctx.user.role !== 'admin' && school.ownerId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      // Update school with promo code
      await db.update(schools)
        .set({
          promoCode: input.code.toUpperCase(),
          promoDiscountPercent: input.discountPercent,
        })
        .where(eq(schools.id, input.schoolId));

      return { success: true, code: input.code, discount: input.discountPercent };
    }),

  // Validate promo code
  validatePromoCode: publicProcedure
    .input(z.object({
      code: z.string(),
      schoolId: z.number().optional(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      
      const schoolResult = await db.select().from(schools).where(eq(schools.promoCode, input.code.toUpperCase())).limit(1);
      const school = schoolResult[0];
      
      if (!school || !school.promoCode) {
        return { valid: false, message: "Promo code not found" };
      }

      if (input.schoolId && school.id !== input.schoolId) {
        return { valid: false, message: "Promo code not valid for this school" };
      }

      return {
        valid: true,
        code: school.promoCode,
        discount: school.promoDiscountPercent,
        schoolId: school.id,
        schoolName: school.name,
      };
    }),

  // Get promo code for a school
  getPromoCode: publicProcedure
    .input(z.object({ schoolId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      
      const schoolResult = await db.select().from(schools).where(eq(schools.id, input.schoolId)).limit(1);
      const school = schoolResult[0];

      if (!school || !school.promoCode) {
        return null;
      }

      return {
        code: school.promoCode,
        discount: school.promoDiscountPercent,
      };
    }),
});

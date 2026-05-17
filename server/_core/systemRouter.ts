import { z } from "zod";
import { notifyOwner } from "./notification";
import { notifyContactForm } from "./emailNotifications";
import { adminProcedure, publicProcedure, router } from "./trpc";
import { createContactMessage, getContactMessages, updateContactMessage, deleteContactMessage } from "../db";

export const systemRouter = router({
  health: publicProcedure
    .input(
      z.object({
        timestamp: z.number().min(0, "timestamp cannot be negative"),
      })
    )
    .query(() => ({
      ok: true,
    })),

  notifyOwner: adminProcedure
    .input(
      z.object({
        title: z.string().min(1, "title is required"),
        content: z.string().min(1, "content is required"),
      })
    )
    .mutation(async ({ input }) => {
      const delivered = await notifyOwner(input);
      return {
        success: delivered,
      } as const;
    }),

  // ============ CONTACT MESSAGES ============
  submitContactMessage: publicProcedure
    .input(
      z.object({
        reason: z.string().min(1, "reason is required"),
        senderName: z.string().min(1, "name is required"),
        senderEmail: z.string().email("valid email is required"),
        senderPhone: z.string().optional(),
        schoolName: z.string().optional(),
        message: z.string().min(1, "message is required"),
        category: z.enum(["privacy", "dmca", "billing", "support", "legal", "general"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await createContactMessage({
          reason: input.reason,
          senderName: input.senderName,
          senderEmail: input.senderEmail,
          senderPhone: input.senderPhone,
          schoolName: input.schoolName,
          message: input.message,
          category: input.category || "general",
          status: "new",
        });
        // Notify admin of new contact message
        await notifyOwner({
          title: `New Contact: ${input.reason} from ${input.senderName}`,
          content: `From: ${input.senderName} (${input.senderEmail})\nCategory: ${input.category || 'general'}\nSchool: ${input.schoolName || 'N/A'}\n\nMessage: ${input.message.substring(0, 500)}`,
        }).catch(() => {}); // Don't fail if notification fails
        // Send email notification
        await notifyContactForm({
          name: input.senderName,
          email: input.senderEmail,
          phone: input.senderPhone,
          message: input.message,
        }).catch(() => {}); // Don't fail if email fails
        return { success: true };
      } catch (error) {
        console.error('[Contact] Failed to submit message:', error);
        throw error;
      }
    }),

  getContactMessages: adminProcedure
    .input(
      z.object({
        status: z.string().optional(),
        category: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      return await getContactMessages(input.status, input.category);
    }),

  updateContactMessage: adminProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.string().optional(),
        adminNotes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await updateContactMessage(input.id, {
        status: input.status,
        adminNotes: input.adminNotes,
      });
      return { success: true };
    }),

  deleteContactMessage: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteContactMessage(input.id);
      return { success: true };
    }),
});

import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { getAdminIdFromRequest } from "./adminSession";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  // Check for admin session cookie (HMAC-signed — prevents forgery)
  if (!user) {
    const adminId = getAdminIdFromRequest(opts.req);
    if (adminId) {
      // Create a temporary admin user object for admin-only procedures
      user = {
        id: adminId,
        email: 'admin@findchristianschools.com',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}

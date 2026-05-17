import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { parse as parseCookieHeader } from "cookie";

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

  // Check for admin session cookie (parse from raw header since cookie-parser is not used)
  if (!user) {
    const cookieHeader = opts.req.headers.cookie;
    if (cookieHeader) {
      const cookies = parseCookieHeader(cookieHeader);
      const adminSessionId = cookies.admin_session;
      if (adminSessionId) {
        const adminId = parseInt(adminSessionId);
        if (!isNaN(adminId)) {
          // Create a temporary admin user object for admin-only procedures
          user = {
            id: adminId,
            email: 'admin@findchristianschools.org',
            role: 'admin',
            createdAt: new Date(),
            updatedAt: new Date(),
          } as User;
        }
      }
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}

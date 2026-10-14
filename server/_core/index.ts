import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { rateLimitMiddleware, accessLoggingMiddleware, detectScrapingMiddleware } from "./ipProtection";
import { securityHeadersMiddleware } from "./securityHeaders";
import { rateLimitExpress, RATE_LIMITS } from "../rateLimit";
import { runMigrations } from "../migrate";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}


async function startServer() {
  await runMigrations();
  const app = express();
  const server = createServer(app);
  // Stripe webhook needs raw body BEFORE json parsing
  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const { handleStripeWebhook } = await import("../stripe/webhook");
    return handleStripeWebhook(req, res);
  });
  // Configure body parser with reasonable size limits
  // (50MB was excessive — file uploads go through S3 presigned URLs, not request bodies)
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ limit: "2mb", extended: true }));
  // Security headers (CSP, HSTS, X-Frame-Options, etc.)
  app.use(securityHeadersMiddleware);
  // IP protection middleware (rate limiting, access logging, scraping detection)
  app.use(rateLimitMiddleware);
  app.use(accessLoggingMiddleware);
  app.use(detectScrapingMiddleware);
  // Strict rate limiting on auth endpoints (prevent brute force)
  app.use("/api/trpc/adminAuth", rateLimitExpress(RATE_LIMITS.auth, "auth") as any);
  registerStorageProxy(app);
  // Stripe checkout endpoint
  const stripeRouter = await import("../routes/stripe");
  app.use("/api/stripe", stripeRouter.default);
  // Admin data import API
  const { registerAdminImportRoute } = await import("../adminImport");
  registerAdminImportRoute(app);
  // Think Clearly course — teacher Kahoot spreadsheet downloads
  const { registerKahootRoutes } = await import("../kahoot");
  registerKahootRoutes(app);
  // Daily news ingest — protected cron endpoint (see server/newsRefresh.ts)
  const { registerNewsRefreshRoute } = await import("../newsRefresh");
  registerNewsRefreshRoute(app);
  // SEO: sitemap.xml and robots.txt
  const { registerSeoRoutes } = await import("../seo");
  registerSeoRoutes(app);
  // FCS Lesson Planner PWA - serve static files with SPA fallback
  const { default: expressMod } = await import("express");
  const { default: pathMod } = await import("path");
  const plannerDistPath = pathMod.resolve(import.meta.dirname, process.env.NODE_ENV === "development" ? "../../public/planner" : "public/planner");
  app.use("/planner", expressMod.static(plannerDistPath));
  app.get("/planner/*", (_req, res) => {
    res.sendFile(pathMod.resolve(plannerDistPath, "index.html"));
  });
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  // Canonical URL hygiene (site audit B-3/B-4): one canonical URL per page.
  // True duplicate twins (same page, two paths) 301 to the path the site's
  // own internal links use. /submit vs /submit-school and /lesson-planning
  // vs /lesson-planner are NOT twins (distinct flows/content) and stay live.
  // State/city hub codes canonicalize to uppercase, matching every internal
  // link, breadcrumb, and sitemap entry.
  const CANONICAL_REDIRECTS: Record<string, string> = {
    "/our-mission": "/mission",
    "/privacy-policy": "/privacy",
    "/terms": "/terms-of-service",
    "/compare-schools": "/compare",
    "/international-schools": "/international",
  };
  app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    const p = req.path;
    const qs = req.originalUrl.includes("?")
      ? req.originalUrl.slice(req.originalUrl.indexOf("?"))
      : "";
    const twin = CANONICAL_REDIRECTS[p];
    if (twin) {
      res.redirect(301, twin + qs);
      return;
    }
    const hub = p.match(/^\/(state|city)\/([a-zA-Z]{2})(\/.*)?$/);
    if (hub && hub[2] !== hub[2].toUpperCase()) {
      res.redirect(301, `/${hub[1]}/${hub[2].toUpperCase()}${hub[3] || ""}${qs}`);
      return;
    }
    next();
  });

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);

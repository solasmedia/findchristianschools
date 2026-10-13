import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  // index: false — "/" must fall through to the SEO injection handler below
  // (express.static would otherwise serve the raw index.html for "/",
  // bypassing JSON-LD + server-rendered content injection on the homepage).
  // Cache policy (site audit B-6): Vite emits content-hashed filenames under
  // /assets/, so those are immutable for a year. Everything else static
  // (favicon, logo, llms.txt) revalidates daily; HTML is never served from
  // here and the SEO handler below marks it no-cache.
  app.use(
    express.static(distPath, {
      index: false,
      setHeaders: (res, filePath) => {
        if (filePath.includes(`${path.sep}assets${path.sep}`)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        } else {
          res.setHeader("Cache-Control", "public, max-age=86400");
        }
      },
    })
  );

  // SEO: serve index.html with per-route head injection.
  // Unknown routes return 404; detail pages get unique titles/meta via DB lookup.
  let cachedTemplate: string | null = null;
  const getTemplate = (): string => {
    if (!cachedTemplate) {
      cachedTemplate = fs.readFileSync(path.resolve(distPath, "index.html"), "utf-8");
    }
    return cachedTemplate;
  };

  // NOTE: no mount path on purpose — app.use("*") strips req.path to "/"
  // inside the handler (Express 4 mount behavior), which broke route matching.
  app.use(async (req, res) => {
    // Lazy import to avoid circular deps at module load
    const { matchRoute, resolveMeta, injectHead, resolveSeoContent } = await import("./seoHead");

    // Normalize path (strip trailing slash for canonical)
    let reqPath = req.path;
    if (reqPath.length > 1 && reqPath.endsWith("/")) reqPath = reqPath.slice(0, -1);

    const match = matchRoute(reqPath);

    // Unknown route → proper 404 (client still renders NotFound page)
    if (match.kind === "unknown") {
      try {
        const html = injectHead(getTemplate(), {
          title: "Page Not Found | FindChristianSchools.com",
          description: "The page you are looking for doesn't exist.",
          canonical: `${process.env.SITE_URL || "https://www.findchristianschools.com"}/404`,
        });
        res.status(404).set({ "Content-Type": "text/html", "Cache-Control": "no-cache" }).end(html);
      } catch {
        res.status(404).sendFile(path.resolve(distPath, "index.html"));
      }
      return;
    }

    // Known route → inject SEO head (detail pages get DB-driven titles)
    try {
      const meta = await resolveMeta(match, reqPath);
      if (!meta) {
        // Valid route pattern but entity doesn't exist (bad slug) → 404
        const html = injectHead(getTemplate(), {
          title: "Page Not Found | FindChristianSchools.com",
          description: "The page you are looking for doesn't exist.",
          canonical: `${process.env.SITE_URL || "https://www.findchristianschools.com"}/404`,
        });
        res.status(404).set({ "Content-Type": "text/html", "Cache-Control": "no-cache" }).end(html);
        return;
      }
      // AI-search visibility: JSON-LD + server-rendered content blocks for
      // non-JS crawlers (GPTBot, ClaudeBot, PerplexityBot). Best-effort —
      // failures here must never break page serving.
      try {
        const extras = await resolveSeoContent(match);
        if (extras.jsonLd?.length) meta.jsonLd = extras.jsonLd;
        if (extras.bodyHtml) meta.bodyHtml = extras.bodyHtml;
      } catch (e) {
        console.error("[serveStatic] seo content injection failed:", e);
      }
      const html = injectHead(getTemplate(), meta);
      res.status(200).set({ "Content-Type": "text/html", "Cache-Control": "no-cache" }).end(html);
    } catch (e) {
      console.error("[serveStatic] head injection failed:", e);
      res.sendFile(path.resolve(distPath, "index.html"));
    }
  });
}

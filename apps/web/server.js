import { createRequestHandler } from "@remix-run/express";
import compression from "compression";
import express from "express";
import morgan from "morgan";

const viteDevServer =
  process.env.NODE_ENV === "production"
    ? undefined
    : await import("vite").then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        }),
      );

const remixHandler = createRequestHandler({
  build: viteDevServer
    ? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
    : await import("./build/server/index.js"),
});

const app = express();

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// handle asset requests
if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  // Vite fingerprints its assets so we can cache forever.
  app.use("/assets", express.static("build/client/assets", { immutable: true, maxAge: "1y" }));
}

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("build/client", { maxAge: "1h" }));

app.use(morgan("tiny"));

// OG image proxy — proxies internal S3/MinIO images for social media crawlers
const ALLOWED_IMAGE_HOSTS = new Set(["localhost", "127.0.0.1", "minio", "s3.amazonaws.com"]);

app.get("/og-proxy", async (req, res) => {
  const imageUrl = req.query.url;
  if (!imageUrl || typeof imageUrl !== "string") {
    return res.status(400).send("Missing url parameter");
  }

  let parsed;
  try {
    parsed = new URL(imageUrl);
  } catch {
    return res.status(400).send("Invalid url");
  }

  const hostname = parsed.hostname;
  const isAllowed =
    ALLOWED_IMAGE_HOSTS.has(hostname) ||
    hostname.endsWith(".amazonaws.com") ||
    hostname.endsWith(".digitaloceanspaces.com") ||
    hostname.endsWith(".r2.cloudflarestorage.com");

  if (!isAllowed) {
    return res.status(403).send("Host not allowed");
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const upstream = await fetch(imageUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (!upstream.ok) {
      return res.status(upstream.status).send("Upstream error");
    }

    const contentType = upstream.headers.get("content-type") || "image/jpeg";
    res.set("Content-Type", contentType);
    res.set("Cache-Control", "public, max-age=86400");

    const buffer = Buffer.from(await upstream.arrayBuffer());
    res.send(buffer);
  } catch {
    res.status(502).send("Failed to fetch image");
  }
});

// handle SSR requests
app.all("*", remixHandler);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Express server listening at http://localhost:${port}`));

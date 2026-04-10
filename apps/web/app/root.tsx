import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";

import logoUrl from "./assets/academia-logo-opt.png";
import heroBgUrl from "./assets/hero-bg-contour.jpg";
import { MarkdownAlternateTags } from "./components/MarkdownAlternateTags";
import { PlatformFavicon } from "./components/PlatformFavicon";
import { Toaster } from "./components/ui/toaster";
import { useNavigationTracker } from "./hooks/useNavigationTracker";
import css from "./index.css?url";
import CustomErrorBoundary from "./modules/common/ErrorBoundary/ErrorBoundary";
import { Providers } from "./modules/Global/Providers";
import { ThemeWrapper } from "./modules/Global/ThemeWrapper";

import type { LinksFunction } from "@remix-run/node";

export const links: LinksFunction = () => {
  return [
    { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
    { rel: "icon", href: "/favicon.ico", sizes: "32x32" },
    { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    { rel: "manifest", href: "/site.webmanifest" },
    { rel: "preload", as: "image", href: heroBgUrl },
    { rel: "preload", as: "image", href: logoUrl },
    { rel: "stylesheet", href: css },
  ];
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="scroll-smooth" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#C0392B" />
        <meta
          name="description"
          content="Cursos de IA en español para trabajadores no técnicos. El escalón cero antes de cualquier otro curso."
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="AcademIA" />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/og-image.png" />
        <Meta />
        <Links />
        <MarkdownAlternateTags siteUrl={import.meta.env.VITE_APP_URL || ""} />
      </head>
      <body>
        {/* ═══ SPLASH SCREEN — visible from first byte, dismissed after load ═══ */}
        <div
          id="academia-splash"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "16px",
            background: "#F5F0E4",
            transition: "opacity 0.4s ease-out",
          }}
        >
          <svg
            width="160"
            height="40"
            viewBox="0 0 160 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ animation: "splash-breathe 2s ease-in-out infinite" }}
          >
            <text
              x="0"
              y="32"
              fontFamily="Georgia, serif"
              fontSize="32"
              fontWeight="600"
              fill="#1F1A15"
              letterSpacing="-0.5"
            >
              Academ
            </text>
            <text
              x="107"
              y="32"
              fontFamily="Georgia, serif"
              fontSize="32"
              fontWeight="600"
              fill="#C0392B"
              letterSpacing="-0.5"
            >
              IA
            </text>
          </svg>
          <div
            style={{
              width: "40px",
              height: "2px",
              background: "#C0392B",
              borderRadius: "1px",
              animation: "splash-bar 1.5s ease-in-out infinite",
            }}
          />
        </div>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @keyframes splash-breathe {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.7; transform: scale(1.02); }
              }
              @keyframes splash-bar {
                0%, 100% { width: 40px; opacity: 0.3; }
                50% { width: 80px; opacity: 1; }
              }
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Dismiss splash when fonts + critical images are loaded
              (function() {
                var splash = document.getElementById('academia-splash');
                if (!splash) return;

                // Preload critical images
                var imgs = [${JSON.stringify(heroBgUrl)}, ${JSON.stringify(logoUrl)}];
                var imgPromises = imgs.map(function(src) {
                  return new Promise(function(resolve) {
                    var img = new Image();
                    img.onload = resolve;
                    img.onerror = resolve; // don't block on error
                    img.src = src;
                  });
                });

                // Wait for fonts + images
                Promise.all([
                  document.fonts ? document.fonts.ready : Promise.resolve(),
                ].concat(imgPromises)).then(function() {
                  splash.style.opacity = '0';
                  setTimeout(function() { splash.remove(); }, 400);
                });

                // Safety timeout — never show splash longer than 3 seconds
                setTimeout(function() {
                  if (splash.parentNode) {
                    splash.style.opacity = '0';
                    setTimeout(function() { splash.remove(); }, 400);
                  }
                }, 3000);
              })();
            `,
          }}
        />
        {children}
        <script
          type="text/javascript"
          src={
            import.meta.env.VITE_PLAYERJS_CDN_URL ||
            "//assets.mediadelivery.net/playerjs/playerjs-latest.min.js"
          }
          defer
        />
        <ScrollRestoration />
        <Scripts />
        <Toaster />
      </body>
    </html>
  );
}

export default function Root() {
  useNavigationTracker();

  return (
    <Providers>
      <ThemeWrapper>
        <PlatformFavicon />
        <Outlet />
      </ThemeWrapper>
    </Providers>
  );
}

export function HydrateFallback() {
  return <div />;
}
export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return <CustomErrorBoundary stack={error.data} message={error.statusText} />;
  } else if (error instanceof Error) {
    return <CustomErrorBoundary stack={error.stack} message={error.message} />;
  } else {
    return <CustomErrorBoundary />;
  }
}

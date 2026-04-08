# SSR / Hydration pitfalls

When implementing the LLM SEO framework on a SPA or SSR codebase, these 4 bugs **will** appear. They were discovered the hard way during the AcademIA Feb 4 2026 implementation session and cost ~3 hours combined to debug the first time around. This file exists so the next implementation skips that debugging.

## Pitfall 1 — `getComputedStyle is not defined` SSR crash

### Symptom

Page crashes during server render with:

```
ReferenceError: getComputedStyle is not defined
    at Object.useState (ThemeProvider.tsx:18)
```

### Root cause

A React component calls a browser-only API **inside a `useState` initializer**, which runs during server rendering:

```typescript
// ❌ BROKEN
function ThemeProvider() {
  const [primaryColor, setPrimaryColor] = useState(
    getComputedStyle(document.documentElement).getPropertyValue("--primary-700").trim(),
  );
  // ...
}
```

`useState` initializers run on **both** server and client. On the server, `document` is undefined → crash.

### Fix

Initialize state with empty string, populate inside `useEffect`:

```typescript
// ✅ FIXED
function ThemeProvider() {
  const [primaryColor, setPrimaryColor] = useState("");
  const [contrastColor, setContrastColor] = useState("");

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    setPrimaryColor(getComputedStyle(root).getPropertyValue("--primary-700").trim());
    setContrastColor(getComputedStyle(root).getPropertyValue("--color-white").trim());
  }, []);

  // ...
}
```

### Generalization

**Rule**: any browser API (`document`, `window`, `localStorage`, `getComputedStyle`, `matchMedia`, `IntersectionObserver`, `ResizeObserver`, `navigator`) must be wrapped in `useEffect` with a `typeof` guard. **Never** in `useState` initializers, **never** at module top-level.

Common offenders to grep for:

```bash
grep -rn "useState(.*document\." apps/web/app
grep -rn "useState(.*window\." apps/web/app
grep -rn "useState(.*localStorage" apps/web/app
grep -rn "useState(.*getComputedStyle" apps/web/app
```

## Pitfall 2 — Vite build error on bracket-syntax filenames

### Symptom

```
Failed to load url /app/routes/sitemap[.]xml.ts (resolved id: /app/routes/sitemap[.]xml.ts) in routes.ts
```

### Root cause

In Remix you can declare resource routes with literal periods in the URL using bracket syntax in the filename:

```typescript
// routes.ts
route("sitemap.xml", "routes/sitemap[.]xml.ts", { id: "sitemap-xml" });
```

The bracket-around-period syntax is **valid Remix routing syntax** but **Vite's module resolver doesn't handle it** when the file is referenced from `routes.ts` programmatically. The build fails.

### Fix

Use dash filenames and keep the URL declaration in `routes.ts`:

```typescript
// ✅ FIXED — file is routes/sitemap-xml.ts
route("sitemap.xml", "routes/sitemap-xml.ts", { id: "sitemap-xml" });
route("robots.txt", "routes/robots-txt.ts", { id: "robots-txt" });
route("llms.txt", "routes/llms-txt.ts", { id: "llms-txt" });
```

The URL the user sees (`/sitemap.xml`) is decoupled from the file name (`sitemap-xml.ts`). This works.

### Note for SPA mode

This whole pattern (Remix resource routes for `sitemap.xml`/`robots.txt`/`llms.txt`) **doesn't work in SPA mode at all** because resource routes require server execution. In SPA mode, move all of this to Express in `server.js`. See the AcademIA reference implementation in `apps/web/server.js`.

## Pitfall 3 — Hydration mismatch from divergent loader return types

### Symptom

In the browser console, after navigating to a detail page:

```
Uncaught DOMException: Failed to execute 'insertBefore' on 'Node':
The node before which the new node is to be inserted is not a child of this node.
```

The page renders, then crashes mid-hydration. Refresh fixes it.

### Root cause

The detail page (e.g. `CourseDetail.page.tsx`) has both a `loader` and a `clientLoader`, with **different return shapes**:

```typescript
// ❌ BROKEN
export const loader = async ({ params }) => {
  const course = await fetchCourse(params.slug);
  return { course };
};

export const clientLoader = ({ params }) => {
  if (!params.slug) return null; // ← shape: null
  return queryClient.ensureQueryData(courseQueryOptions(params.slug)); // ← shape: { course }
};
```

The `meta` function then reads `data?.course` and conditionally outputs JSON-LD or different `<title>` based on whether the course exists. On server, `data = { course: {...} }` → outputs full meta. On client navigation, `data = null` → outputs different (or fewer) meta tags. React tries to reconcile and fails.

### Fix

Make `clientLoader` return the same shape as `loader`:

```typescript
// ✅ FIXED
export const clientLoader = ({ params }) => {
  if (!params.slug) return { course: null }; // ← matches server shape
  return queryClient.ensureQueryData(courseQueryOptions(params.slug));
};
```

And in the `meta` function, treat `course === null` as "not loaded yet" and emit minimal/skeleton meta:

```typescript
export const meta: MetaFunction<typeof clientLoader> = ({ data }) => {
  if (!data?.course) {
    return [{ title: "Loading..." }];
  }
  // ... full meta with JSON-LD
};
```

### Generalization

**Rule**: in any Remix route that has both `loader` and `clientLoader`, **the return types must be identical**. Check with TypeScript:

```typescript
const _check: ReturnType<typeof loader> extends ReturnType<typeof clientLoader> ? true : false =
  true;
```

## Pitfall 4 — Hydration mismatch from `window` in `meta` function

### Symptom

Same as pitfall 3 (`Node.insertBefore` error), but it happens on the homepage. Specifically on the `JSON-LD Organization` block.

### Root cause

The `meta` function reads `window.location.origin` to compute the site URL for JSON-LD:

```typescript
// ❌ BROKEN
export const meta: MetaFunction = () => {
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  return [
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "AcademIA",
        ...(siteUrl && { url: siteUrl }), // ← server: omitted, client: included
      },
    },
  ];
};
```

Server output: JSON-LD without the `url` field. Client output: JSON-LD with the `url` field. Different DOM → hydration mismatch on the `<script>` tag.

The `typeof window !== "undefined"` check **doesn't help** in SSR meta functions — it just guarantees the server and client outputs will be different.

### Fix

Either drop the field entirely:

```typescript
// ✅ FIXED option A — drop the URL
export const meta: MetaFunction = () => [
  {
    "script:ld+json": {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "AcademIA",
    },
  },
];
```

Or hardcode it from env (this is the better fix because the URL is genuinely useful for LLMs):

```typescript
// ✅ FIXED option B — hardcode from env
const SITE_URL = import.meta.env.VITE_APP_URL || "https://academia.tu-dominio.com";

export const meta: MetaFunction = () => [
  {
    "script:ld+json": {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "AcademIA",
      url: SITE_URL,
    },
  },
];
```

### Generalization

**Rule**: `meta` functions in Remix run on **both** server and client and **must produce identical output**. Anything that differs between environments will cause hydration mismatches.

Banned in `meta` functions:

- `window.*`
- `document.*`
- `navigator.*`
- `typeof window !== "undefined"` checks
- `Date.now()` / `new Date()` (unless the value is intentionally stable)
- `Math.random()`
- Anything that reads `localStorage` / `sessionStorage` / cookies via JS

Allowed in `meta` functions:

- `data` from the loader (already serialized identically on both sides)
- `params` from the route
- `import.meta.env.VITE_*` variables (Vite inlines them at build time)
- Pure computations on the above

## Auditing checklist

After implementing the framework, run this audit:

```bash
# 1. Find browser APIs in useState initializers
grep -rn "useState(.*\(window\|document\|navigator\|getComputedStyle\|localStorage\)" apps/web/app

# 2. Find browser APIs in meta functions
grep -rn -B2 -A20 "export const meta" apps/web/app | grep -E "window\.|document\.|typeof window"

# 3. Find loaders that don't have clientLoaders (or vice versa) in the same file
# (manual review)

# 4. Find Remix resource routes still using bracket syntax
find apps/web/app/routes -name "*\[.*\]*"
```

If any of these return results, you have a latent hydration bug.

## Why this whole pitfall list exists

The framework implementation in AcademIA on Feb 4 2026 hit **all four** of these in sequence. Each one masked the next. The session ended in compaction with the team thinking "this is too brittle, let's move it all to Express" — which is what the current `apps/web/server.js` represents. **That's a valid architectural choice**, but you should make it consciously, not because the SSR debugging defeated you. If you want the pages themselves rendered SSR (not just the SEO routes), all 4 pitfalls have to be resolved.

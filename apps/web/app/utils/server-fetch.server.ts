const API_BASE_URL = process.env.API_INTERNAL_URL || "http://localhost:3000";
const TIMEOUT_MS = 3_000;

export async function serverFetch<T>(path: string, request?: Request): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const headers: Record<string, string> = {
      Accept: "application/json",
    };

    if (request) {
      const cookie = request.headers.get("Cookie");
      if (cookie) headers["Cookie"] = cookie;
    }

    const response = await fetch(url, {
      signal: controller.signal,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

export async function serverFetchSafe<T>(path: string, request?: Request): Promise<T | null> {
  try {
    return await serverFetch<T>(path, request);
  } catch {
    return null;
  }
}

export function resolveLanguage(request: Request): string {
  const url = new URL(request.url);
  const fromQuery = url.searchParams.get("language");
  if (fromQuery && (fromQuery === "es" || fromQuery === "en")) {
    return fromQuery;
  }

  const acceptLang = request.headers.get("Accept-Language") || "";
  if (acceptLang.startsWith("en")) return "en";

  return "es";
}

import { useEffect, useState } from "react";

function normalizeApiBase(base: string): string {
  return base.replace(/\/+$/, "") || "/api";
}

function getApiBases(): string[] {
  const envBase = import.meta.env.VITE_API_URL
    ? normalizeApiBase(String(import.meta.env.VITE_API_URL))
    : null;

  if (envBase) {
    return [envBase];
  }

  if (
    typeof window !== "undefined" &&
    ["localhost", "127.0.0.1"].includes(window.location.hostname)
  ) {
    return ["/api", "http://localhost:4000/api"];
  }

  return ["/api"];
}

async function fetchPublicVerticals(): Promise<any[]> {
  let lastError: Error | null = null;

  for (const base of getApiBases()) {
    try {
      const res = await fetch(`${base}/verticals/public`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} from ${base}`);
      }

      const data = (await res.json()) as unknown;
      if (!Array.isArray(data)) {
        throw new Error(`Invalid verticals response from ${base}`);
      }

      return data;
    } catch (err) {
      lastError =
        err instanceof Error
          ? err
          : new Error(`Unknown error while fetching from ${base}`);
    }
  }

  throw lastError || new Error("Unable to fetch verticals from any API base");
}

export type VerticalData = {
  id: string;
  title: string;
  description: string;
  image: string;
  path: string;
  services: string[];
};

interface VerticalsState {
  verticals: VerticalData[];
  loading: boolean;
  error: string | null;
}

let cachedVerticals: VerticalData[] | null = null;
let cacheError: string | null = null;

function mapApiVertical(v: any): VerticalData {
  return {
    id: String(v.slug || v.id),
    title: String(v.title || ""),
    description: String(v.description || ""),
    image: String(v.image || ""),
    path: String(v.path || `/vertical/${v.slug}`),
    services: Array.isArray(v.services)
      ? v.services.map((s: unknown) => String(s))
      : [],
  };
}

/**
 * IMPORTANT FIX #4: useVerticals with error state
 * Previously had silent error catch that hid failures from users.
 * Now returns error state so UI can display meaningful feedback.
 */
export function useVerticals(): VerticalsState {
  const [verticals, setVerticals] = useState<VerticalData[]>(
    cachedVerticals || [],
  );
  const [loading, setLoading] = useState(!cachedVerticals);
  const [error, setError] = useState<string | null>(cacheError);

  useEffect(() => {
    if (cachedVerticals) {
      setLoading(false);
      setError(cacheError);
      return;
    }

    fetchPublicVerticals()
      .then((data: any[]) => {
        if (!Array.isArray(data)) {
          throw new Error("Invalid response format: expected array");
        }

        cachedVerticals = data.map(mapApiVertical);
        cacheError = null;
        setVerticals(cachedVerticals);
        setError(null);
      })
      .catch((err) => {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load verticals";
        console.error("useVerticals error:", errorMessage);
        cacheError = errorMessage;
        setError(errorMessage);
        setVerticals([]); // Clear verticals on error instead of showing stale data
      })
      .finally(() => setLoading(false));
  }, []);

  return { verticals, loading, error };
}

export function invalidateVerticalsCache() {
  cachedVerticals = null;
  cacheError = null;
}


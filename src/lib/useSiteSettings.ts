import { useState, useEffect, useCallback } from "react";

function normalizeApiBase(base: string): string {
  return base.replace(/\/+$/, "") || "/api";
}

function getApiBases(): string[] {
  const envBase = import.meta.env.VITE_API_URL
    ? normalizeApiBase(String(import.meta.env.VITE_API_URL))
    : null;

  const bases = [
    envBase,
    "/api",
    typeof window !== "undefined" &&
    ["localhost", "127.0.0.1"].includes(window.location.hostname)
      ? "http://localhost:4000/api"
      : null,
  ].filter((value): value is string => Boolean(value));

  return [...new Set(bases)];
}

export type TeamMember = { name: string; role: string; image: string };

export type SiteProfile = {
  contactEmail: string;
  contactPhone: string;
  contactPhoneLabel: string | null;
  instagramUrl: string | null;
  linkedinUrl: string | null;
  officeName: string;
  officeFloor: string | null;
  officeAddress: string;
  mapsEmbedUrl: string | null;
  mapsDirectionsUrl: string | null;
};

type SiteSettings = {
  team: TeamMember[];
  verticalCovers: Record<string, string>;
  featuredSlugs: string[];
  profile: SiteProfile | null;
};

interface SiteSettingsState {
  settings: SiteSettings;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const CACHE_TTL = 60_000;
let cachedSettings: SiteSettings | null = null;
let cachedAt = 0;
let cacheError: string | null = null;

function isCacheFresh() {
  return cachedSettings && Date.now() - cachedAt < CACHE_TTL;
}

function getEmptySettings(): SiteSettings {
  return {
    team: [],
    verticalCovers: {},
    featuredSlugs: [],
    profile: null,
  };
}

/**
 * IMPORTANT FIX #4: fetchSettings with better error reporting
 * Previously threw generic "Failed" error message.
 * Now provides specific error details for debugging.
 */
async function fetchSettings(): Promise<SiteSettings> {
  let data: any = null;
  let lastError: Error | null = null;

  for (const base of getApiBases()) {
    try {
      const res = await fetch(`${base}/site-settings/public`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} from ${base}`);
      }

      data = await res.json();
      lastError = null;
      break;
    } catch (err) {
      lastError =
        err instanceof Error
          ? err
          : new Error(`Unknown error while fetching from ${base}`);
    }
  }

  if (lastError) {
    throw lastError;
  }

  const resolved: SiteSettings = {
    team: Array.isArray(data.team) ? data.team : [],
    verticalCovers:
      data.verticalCovers && typeof data.verticalCovers === "object"
        ? data.verticalCovers
        : {},
    featuredSlugs: Array.isArray(data.featuredSlugs) ? data.featuredSlugs : [],
    profile:
      data.profile && typeof data.profile === "object" ? data.profile : null,
  };

  cachedSettings = resolved;
  cachedAt = Date.now();
  cacheError = null;
  return resolved;
}

export function invalidateSiteSettings() {
  cachedSettings = null;
  cachedAt = 0;
  cacheError = null;
}

/**
 * IMPORTANT FIX #4: useSiteSettings with error state
 * Previously had silent error catch that hid failures from users.
 * Now returns error state so UI can display meaningful feedback.
 */
export function useSiteSettings(): SiteSettingsState {
  const [settings, setSettings] = useState<SiteSettings>(
    cachedSettings || getEmptySettings(),
  );
  const [loading, setLoading] = useState(!isCacheFresh());
  const [error, setError] = useState<string | null>(cacheError);

  const refresh = useCallback(() => {
    invalidateSiteSettings();
    setLoading(true);
    setError(null);
    fetchSettings()
      .then((result) => {
        setSettings(result);
        setError(null);
      })
      .catch((err) => {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load site settings";
        console.error("useSiteSettings error:", errorMessage);
        cacheError = errorMessage;
        setError(errorMessage);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (isCacheFresh()) {
      setError(cacheError);
      return;
    }
    setLoading(true);
    setError(null);
    fetchSettings()
      .then((result) => {
        setSettings(result);
        setError(null);
      })
      .catch((err) => {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load site settings";
        console.error("useSiteSettings error:", errorMessage);
        cacheError = errorMessage;
        setError(errorMessage);
      })
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading, error, refresh };
}

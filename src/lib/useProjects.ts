import { useCallback, useEffect, useState } from "react";

export type ProjectData = {
  id: string;
  title: string;
  location: string;
  category: string;
  image: string;
  description: string;
  year: string | null;
  status: string | null;
  verticalSlug: string | null;
};

export type ProjectDetail = ProjectData & {
  galleryImages: string[];
};

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

async function fetchPublicProjects(): Promise<any[]> {
  let lastError: Error | null = null;

  for (const base of getApiBases()) {
    try {
      const res = await fetch(`${base}/projects/public`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} from ${base}`);
      }

      const data = (await res.json()) as unknown;
      if (!Array.isArray(data)) {
        throw new Error(`Invalid projects response from ${base}`);
      }

      return data;
    } catch (err) {
      lastError =
        err instanceof Error
          ? err
          : new Error(`Unknown error while fetching from ${base}`);
    }
  }

  throw lastError || new Error("Unable to fetch projects from any API base");
}

let cachedProjects: ProjectDetail[] | null = null;

export function useProjects() {
  const [projects, setProjects] = useState<ProjectData[]>(
    cachedProjects
      ? cachedProjects.map((p) => ({
          id: p.id,
          title: p.title,
          location: p.location,
          category: p.category,
          image: p.image,
          description: p.description,
          year: p.year,
          status: p.status,
          verticalSlug: p.verticalSlug,
        }))
      : [],
  );
  const [loading, setLoading] = useState(!cachedProjects);
  const [error, setError] = useState<string | null>(null);

  const mapToProjectList = useCallback((data: any[]): ProjectDetail[] => {
    return data.map((p) => ({
      id: p.slug,
      title: p.title,
      location: p.location,
      category: p.category,
      image: p.heroImage,
      description: p.description,
      year: p.year ? String(p.year) : null,
      status: p.status ? String(p.status) : null,
      verticalSlug: p.verticalSlug ? String(p.verticalSlug) : null,
      galleryImages: p.galleryImages?.map((img: any) => img.imageUrl) || [
        p.heroImage,
      ],
    }));
  }, []);

  const loadProjects = useCallback(
    async (force = false) => {
      if (!force && cachedProjects) {
        setProjects(
          cachedProjects.map((p) => ({
            id: p.id,
            title: p.title,
            location: p.location,
            category: p.category,
            image: p.image,
            description: p.description,
            year: p.year,
            status: p.status,
            verticalSlug: p.verticalSlug,
          })),
        );
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await fetchPublicProjects();
        if (!Array.isArray(data) || data.length === 0) {
          setError("No projects available yet.");
          setProjects([]);
          return;
        }

        const mapped = mapToProjectList(data);
        cachedProjects = mapped;
        setProjects(
          mapped.map((p) => ({
            id: p.id,
            title: p.title,
            location: p.location,
            category: p.category,
            image: p.image,
            description: p.description,
            year: p.year,
            status: p.status,
            verticalSlug: p.verticalSlug,
          })),
        );
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to load projects. Check backend/API connection.";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [mapToProjectList],
  );

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  return {
    projects,
    loading,
    error,
    refetch: () => {
      cachedProjects = null;
      void loadProjects(true);
    },
  };
}

/**
 * IMPORTANT FIX #4: useProjectDetail with better error handling
 * Now provides specific error messages for easier debugging
 */
export function useProjectDetail(slug: string) {
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedProjects) {
      const found = cachedProjects.find((p) => p.id === slug);
      if (found) {
        setProject(found);
        setError(null);
        setLoading(false);
        return;
      }
    }

    fetchPublicProjects()
      .then((data: any[]) => {
        const mapped: ProjectDetail[] = data.map((p) => ({
          id: p.slug,
          title: p.title,
          location: p.location,
          category: p.category,
          image: p.heroImage,
          description: p.description,
          year: p.year ? String(p.year) : null,
          status: p.status ? String(p.status) : null,
          verticalSlug: p.verticalSlug ? String(p.verticalSlug) : null,
          galleryImages: p.galleryImages?.map((img: any) => img.imageUrl) || [
            p.heroImage,
          ],
        }));
        cachedProjects = mapped;
        const found = mapped.find((p) => p.id === slug);
        setProject(found || null);
        if (!found) {
          setError("Project not found.");
        } else {
          setError(null);
        }
      })
      .catch((err) => {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Unable to load project. Check backend/API connection.";
        console.error("useProjectDetail error:", errorMessage);
        setError(errorMessage);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  return { project, loading, error };
}

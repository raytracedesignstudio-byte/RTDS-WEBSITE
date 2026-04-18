import { useState, useEffect, useCallback } from "react";
import { apiGet, apiPost, apiPut, apiDelete, uploadImage } from "@/lib/api";
import { Link } from "wouter";
import { invalidateSiteSettings } from "@/lib/useSiteSettings";
import { invalidateVerticalsCache } from "@/lib/useVerticals";
import {
  clearAdminToken,
  getAdminToken,
  hasAdminToken,
  setAdminToken,
} from "@/lib/adminAuth";

type ProjectImage = {
  id: number;
  projectId: number;
  imageUrl: string;
  caption: string | null;
  sortOrder: number;
};

type Project = {
  id: number;
  slug: string;
  title: string;
  location: string;
  category: string;
  description: string;
  heroImage: string;
  year: string | null;
  status: string | null;
  verticalSlug: string | null;
  sortOrder: number;
  active: boolean;
  galleryImages: ProjectImage[];
};

type Vacancy = {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string | null;
  active: boolean;
};

type Vertical = {
  id: number;
  slug: string;
  title: string;
  description: string;
  image: string;
  path: string;
  active: boolean;
  services: string[];
};

type SiteProfile = {
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

function getApiUrl(path: string) {
  const base = import.meta.env.VITE_API_URL || "/api";
  return `${base}${path}`;
}

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<
    "projects" | "vacancies" | "media" | "featured" | "verticals"
  >("projects");

  useEffect(() => {
    if (hasAdminToken()) {
      setAuthenticated(true);
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch(getApiUrl("/admin/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        if (!data.token) {
          setLoginError("Login failed");
          return;
        }
        setAdminToken(String(data.token));
        setAuthenticated(true);
      } else {
        setLoginError("Invalid credentials");
      }
    } catch {
      setLoginError("Login failed");
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-foreground flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <Link href="/" className="block mb-12 text-center">
            <img
              src="/logo.png"
              alt="RayTrace"
              className="h-16 mx-auto invert"
            />
          </Link>
          <h1 className="text-2xl font-serif text-background mb-8 text-center">
            Admin Dashboard
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-foreground border border-background/20 text-background placeholder:text-background/40 text-sm"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-foreground border border-background/20 text-background placeholder:text-background/40 text-sm"
            />
            {loginError && <p className="text-red-400 text-sm">{loginError}</p>}
            <button className="w-full py-3 bg-primary text-background text-sm tracking-widest uppercase hover:bg-primary/80 transition-colors">
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/">
            <img src="/logo.png" alt="RayTrace" className="h-10 invert" />
          </Link>
          <span className="text-white/40 text-sm">Admin Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-white/50 hover:text-white transition-colors"
          >
            View Site &rarr;
          </Link>
          <button
            onClick={() => {
              clearAdminToken();
              setAuthenticated(false);
            }}
            className="text-sm text-white/50 hover:text-red-400 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="flex">
        <aside className="w-56 border-r border-white/10 min-h-[calc(100vh-57px)] p-4">
          <nav className="space-y-1">
            {(
              [
                ["projects", "Projects"],
                ["featured", "Featured"],
                ["verticals", "Verticals"],
                ["media", "Media & Team"],
                ["vacancies", "Vacancies"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`w-full text-left px-4 py-2.5 text-sm rounded transition-colors ${tab === key ? "bg-primary/20 text-primary" : "text-white/60 hover:text-white hover:bg-white/5"}`}
              >
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-57px)]">
          {tab === "projects" && <ProjectsManager />}
          {tab === "verticals" && <VerticalsManager />}
          {tab === "vacancies" && <VacanciesManager />}
          {tab === "media" && <MediaManager />}
          {tab === "featured" && <FeaturedManager />}
        </main>
      </div>
    </div>
  );
}

function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiGet<Project[]>("/admin/projects", getAdminToken());
      setProjects(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  if (loading) return <div className="text-white/40">Loading projects...</div>;

  if (creating) {
    return (
      <ProjectForm
        onSave={() => {
          setCreating(false);
          fetchProjects();
        }}
        onCancel={() => setCreating(false)}
      />
    );
  }

  if (editing) {
    return (
      <ProjectForm
        project={editing}
        onSave={() => {
          setEditing(null);
          fetchProjects();
        }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-serif">Projects ({projects.length})</h2>
        <button
          onClick={() => setCreating(true)}
          className="px-4 py-2 bg-primary text-white text-sm tracking-wide hover:bg-primary/80 transition-colors"
        >
          + Add Project
        </button>
      </div>

      <div className="space-y-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center gap-4 p-4 bg-white/5 rounded border border-white/10 hover:border-white/20 transition-colors"
          >
            <img
              src={project.heroImage}
              alt={project.title}
              className="w-20 h-14 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm">{project.title}</h3>
              <p className="text-white/40 text-xs">
                {project.category} · {project.location}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2 py-1 rounded ${project.active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
              >
                {project.active ? "Active" : "Hidden"}
              </span>
              <span className="text-xs text-white/30">
                {project.galleryImages.length} images
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setEditing(project)}
                className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded transition-colors"
              >
                Edit
              </button>
              <button
                onClick={async () => {
                  await apiPut(
                    `/admin/projects/${project.id}`,
                    { active: !project.active },
                    getAdminToken(),
                  );
                  fetchProjects();
                }}
                className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded transition-colors"
              >
                {project.active ? "Hide" : "Show"}
              </button>
              <button
                onClick={async () => {
                  if (confirm(`Delete "${project.title}"?`)) {
                    await apiDelete(
                      `/admin/projects/${project.id}`,
                      getAdminToken(),
                    );
                    fetchProjects();
                  }
                }}
                className="px-3 py-1.5 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectForm({
  project,
  onSave,
  onCancel,
}: {
  project?: Project;
  onSave: () => void;
  onCancel: () => void;
}) {
  const isEdit = !!project;
  const [verticals, setVerticals] = useState<Vertical[]>([]);
  const [slug, setSlug] = useState(project?.slug || "");
  const [title, setTitle] = useState(project?.title || "");
  const [location, setLocation] = useState(project?.location || "");
  const [category, setCategory] = useState(
    project?.category || "Interior Design",
  );
  const [year, setYear] = useState(project?.year || "");
  const [status, setStatus] = useState(project?.status || "");
  const [verticalSlug, setVerticalSlug] = useState(project?.verticalSlug || "");
  const [description, setDescription] = useState(project?.description || "");
  const [heroImage, setHeroImage] = useState(project?.heroImage || "");
  const [active, setActive] = useState(project?.active ?? true);
  const [galleryImages, setGalleryImages] = useState<ProjectImage[]>(
    project?.galleryImages || [],
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet<Vertical[]>("/admin/verticals", getAdminToken())
      .then(setVerticals)
      .catch(() => setVerticals([]));
  }, []);

  async function handleHeroUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, getAdminToken());
      setHeroImage(url);
    } catch {
      setError("Failed to upload hero image");
    }
    setUploading(false);
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const url = await uploadImage(file, getAdminToken());
        if (isEdit && project) {
          const img = await apiPost<ProjectImage>(
            `/admin/projects/${project.id}/images`,
            {
              imageUrl: url,
              sortOrder: galleryImages.length,
            },
            getAdminToken(),
          );
          setGalleryImages((prev) => [...prev, img]);
        } else {
          setGalleryImages((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              projectId: 0,
              imageUrl: url,
              caption: null,
              sortOrder: prev.length,
            } as ProjectImage,
          ]);
        }
      }
    } catch {
      setError("Failed to upload gallery images");
    }
    setUploading(false);
  }

  async function handleRemoveGalleryImage(img: ProjectImage) {
    if (isEdit && project) {
      await apiDelete(
        `/admin/projects/${project.id}/images/${img.id}`,
        getAdminToken(),
      );
    }
    setGalleryImages((prev) => prev.filter((i) => i.id !== img.id));
  }

  async function handleSave() {
    if (
      !slug ||
      !title ||
      !location ||
      !category ||
      !description ||
      !heroImage
    ) {
      setError("All fields are required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (isEdit && project) {
        await apiPut(
          `/admin/projects/${project.id}`,
          {
            slug,
            title,
            location,
            category,
            description,
            heroImage,
            year,
            status,
            verticalSlug,
            active,
          },
          getAdminToken(),
        );
      } else {
        const newProject = await apiPost<Project>(
          "/admin/projects",
          {
            slug,
            title,
            location,
            category,
            description,
            heroImage,
            year,
            status,
            verticalSlug,
            active,
          },
          getAdminToken(),
        );
        for (const img of galleryImages) {
          await apiPost(
            `/admin/projects/${newProject.id}/images`,
            { imageUrl: img.imageUrl, sortOrder: img.sortOrder },
            getAdminToken(),
          );
        }
      }
      onSave();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    }
    setSaving(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-serif">
          {isEdit ? `Edit: ${project?.title}` : "New Project"}
        </h2>
        <button
          onClick={onCancel}
          className="text-sm text-white/50 hover:text-white transition-colors"
        >
          &larr; Back
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-white/50 mb-1 uppercase tracking-wide">
              Slug (URL identifier)
            </label>
            <input
              value={slug}
              onChange={(e) =>
                setSlug(
                  e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                )
              }
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-sm text-white focus:border-primary outline-none"
              placeholder="my-project"
            />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1 uppercase tracking-wide">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-sm text-white focus:border-primary outline-none"
              placeholder="Project Title"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1 uppercase tracking-wide">
                Location
              </label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-sm text-white focus:border-primary outline-none"
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1 uppercase tracking-wide">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-sm text-white focus:border-primary outline-none"
              >
                <option value="Interior Design">Interior Design</option>
                <option value="Architecture">Architecture</option>
                <option value="Commercial">Commercial</option>
                <option value="Retail Design">Retail Design</option>
                <option value="Residential">Residential</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1 uppercase tracking-wide">
                Year
              </label>
              <input
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-sm text-white focus:border-primary outline-none"
                placeholder="2025"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1 uppercase tracking-wide">
                Status
              </label>
              <input
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-sm text-white focus:border-primary outline-none"
                placeholder="Completed"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1 uppercase tracking-wide">
                Vertical
              </label>
              <select
                value={verticalSlug}
                onChange={(e) => setVerticalSlug(e.target.value)}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-sm text-white focus:border-primary outline-none"
              >
                <option value="">No vertical assigned</option>
                {verticals.map((vertical) => (
                  <option key={vertical.slug} value={vertical.slug}>
                    {vertical.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1 uppercase tracking-wide">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-sm text-white focus:border-primary outline-none resize-none"
              placeholder="Project description..."
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="accent-primary"
              id="active"
            />
            <label htmlFor="active" className="text-sm text-white/70">
              Active (visible on site)
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-white/50 mb-1 uppercase tracking-wide">
              Hero Image
            </label>
            {heroImage && (
              <img
                src={heroImage}
                alt="Hero"
                className="w-full h-48 object-cover rounded mb-2"
              />
            )}
            <label className="inline-block px-4 py-2 bg-white/10 hover:bg-white/20 text-sm cursor-pointer transition-colors rounded">
              {uploading
                ? "Uploading..."
                : heroImage
                  ? "Change Image"
                  : "Upload Image"}
              <input
                type="file"
                accept="image/*"
                onChange={handleHeroUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
            {heroImage && !heroImage.startsWith("/api") && (
              <p className="text-white/30 text-xs mt-1 break-all">
                {heroImage}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs text-white/50 mb-1 uppercase tracking-wide">
              Gallery Images ({galleryImages.length})
            </label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {galleryImages.map((img, i) => (
                <div key={img.id} className="relative group">
                  <img
                    src={img.imageUrl}
                    alt={`Gallery ${i + 1}`}
                    className="w-full aspect-square object-cover rounded"
                  />
                  <button
                    onClick={() => handleRemoveGalleryImage(img)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    ×
                  </button>
                  <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1 rounded">
                    {i + 1}
                  </span>
                </div>
              ))}
            </div>
            <label className="inline-block px-4 py-2 bg-white/10 hover:bg-white/20 text-sm cursor-pointer transition-colors rounded">
              {uploading ? "Uploading..." : "+ Add Images"}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

      <div className="flex gap-3 mt-8 pt-6 border-t border-white/10">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-primary text-white text-sm tracking-wide hover:bg-primary/80 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : isEdit ? "Update Project" : "Create Project"}
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-2.5 bg-white/10 text-white/70 text-sm hover:bg-white/20 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function VacanciesManager() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Vacancy | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchVacancies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl("/vacancies"), {
        headers: { Authorization: `Bearer ${getAdminToken()}` },
      });
      if (res.ok) setVacancies(await res.json());
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchVacancies();
  }, [fetchVacancies]);

  function getApiUrl(path: string) {
    const base = import.meta.env.VITE_API_URL || "/api";
    return `${base}${path}`;
  }

  if (loading) return <div className="text-white/40">Loading vacancies...</div>;

  if (creating || editing) {
    return (
      <VacancyForm
        vacancy={editing || undefined}
        onSave={() => {
          setEditing(null);
          setCreating(false);
          fetchVacancies();
        }}
        onCancel={() => {
          setEditing(null);
          setCreating(false);
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-serif">Vacancies ({vacancies.length})</h2>
        <button
          onClick={() => setCreating(true)}
          className="px-4 py-2 bg-primary text-white text-sm tracking-wide hover:bg-primary/80 transition-colors"
        >
          + Add Vacancy
        </button>
      </div>

      <div className="space-y-3">
        {vacancies.map((v) => (
          <div
            key={v.id}
            className="flex items-center gap-4 p-4 bg-white/5 rounded border border-white/10 hover:border-white/20 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm">{v.title}</h3>
              <p className="text-white/40 text-xs">
                {v.department} · {v.location} · {v.type}
              </p>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded ${v.active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
            >
              {v.active ? "Active" : "Hidden"}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setEditing(v)}
                className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded transition-colors"
              >
                Edit
              </button>
              <button
                onClick={async () => {
                  await fetch(getApiUrl(`/vacancies/${v.id}`), {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${getAdminToken()}`,
                    },
                    body: JSON.stringify({ active: !v.active }),
                  });
                  fetchVacancies();
                }}
                className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded transition-colors"
              >
                {v.active ? "Hide" : "Show"}
              </button>
              <button
                onClick={async () => {
                  if (confirm(`Delete "${v.title}"?`)) {
                    await fetch(getApiUrl(`/vacancies/${v.id}`), {
                      method: "DELETE",
                      headers: {
                        Authorization: `Bearer ${getAdminToken()}`,
                      },
                    });
                    fetchVacancies();
                  }
                }}
                className="px-3 py-1.5 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {vacancies.length === 0 && (
          <p className="text-white/30 text-sm">No vacancies yet</p>
        )}
      </div>
    </div>
  );
}

function VacancyForm({
  vacancy,
  onSave,
  onCancel,
}: {
  vacancy?: Vacancy;
  onSave: () => void;
  onCancel: () => void;
}) {
  const isEdit = !!vacancy;
  const [title, setTitle] = useState(vacancy?.title || "");
  const [department, setDepartment] = useState(vacancy?.department || "");
  const [location, setLocation] = useState(vacancy?.location || "");
  const [type, setType] = useState(vacancy?.type || "Full-time");
  const [description, setDescription] = useState(vacancy?.description || "");
  const [active, setActive] = useState(vacancy?.active ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function getApiUrl(path: string) {
    const base = import.meta.env.VITE_API_URL || "/api";
    return `${base}${path}`;
  }

  async function handleSave() {
    if (!title || !department || !location) {
      setError("Title, department and location are required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const url = isEdit
        ? getApiUrl(`/vacancies/${vacancy!.id}`)
        : getApiUrl("/vacancies");
      await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAdminToken()}`,
        },
        body: JSON.stringify({
          title,
          department,
          location,
          type,
          description,
          active,
        }),
      });
      onSave();
    } catch (e) {
      setError("Save failed");
    }
    setSaving(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-serif">
          {isEdit ? `Edit: ${vacancy?.title}` : "New Vacancy"}
        </h2>
        <button
          onClick={onCancel}
          className="text-sm text-white/50 hover:text-white transition-colors"
        >
          &larr; Back
        </button>
      </div>

      <div className="max-w-lg space-y-4">
        <div>
          <label className="block text-xs text-white/50 mb-1 uppercase tracking-wide">
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-sm text-white focus:border-primary outline-none"
            placeholder="Senior Architect"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/50 mb-1 uppercase tracking-wide">
              Department
            </label>
            <input
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-sm text-white focus:border-primary outline-none"
              placeholder="Architecture"
            />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1 uppercase tracking-wide">
              Location
            </label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-sm text-white focus:border-primary outline-none"
              placeholder="Hyderabad"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-white/50 mb-1 uppercase tracking-wide">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-sm text-white focus:border-primary outline-none"
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-white/50 mb-1 uppercase tracking-wide">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-sm text-white focus:border-primary outline-none resize-none"
            placeholder="Role description..."
          />
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="accent-primary"
            id="v-active"
          />
          <label htmlFor="v-active" className="text-sm text-white/70">
            Active (visible on careers page)
          </label>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

      <div className="flex gap-3 mt-8 pt-6 border-t border-white/10">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-primary text-white text-sm tracking-wide hover:bg-primary/80 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : isEdit ? "Update Vacancy" : "Create Vacancy"}
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-2.5 bg-white/10 text-white/70 text-sm hover:bg-white/20 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function VerticalsManager() {
  const [verticals, setVerticals] = useState<Vertical[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Vertical | null>(null);

  const fetchVerticals = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiGet<Vertical[]>(
        "/admin/verticals",
        getAdminToken(),
      );
      setVerticals(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchVerticals();
  }, [fetchVerticals]);

  async function toggleActive(vertical: Vertical) {
    await apiPut(
      `/admin/verticals/${vertical.id}`,
      { active: !vertical.active },
      getAdminToken(),
    );
    invalidateVerticalsCache();
    fetchVerticals();
  }

  async function deleteVertical(vertical: Vertical) {
    if (!confirm(`Delete vertical "${vertical.title}"?`)) return;
    await apiDelete(`/admin/verticals/${vertical.id}`, getAdminToken());
    invalidateVerticalsCache();
    invalidateSiteSettings();
    fetchVerticals();
  }

  if (loading) return <div className="text-white/40">Loading verticals...</div>;

  if (creating || editing) {
    return (
      <VerticalForm
        vertical={editing || undefined}
        onSave={() => {
          setCreating(false);
          setEditing(null);
          invalidateVerticalsCache();
          invalidateSiteSettings();
          fetchVerticals();
        }}
        onCancel={() => {
          setCreating(false);
          setEditing(null);
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-serif">Verticals ({verticals.length})</h2>
        <button
          onClick={() => setCreating(true)}
          className="px-4 py-2 bg-primary text-white text-sm tracking-wide hover:bg-primary/80 transition-colors"
        >
          + Add Vertical
        </button>
      </div>

      <div className="space-y-3">
        {verticals.map((vertical) => (
          <div
            key={vertical.id}
            className="flex items-center gap-4 p-4 bg-white/5 rounded border border-white/10 hover:border-white/20 transition-colors"
          >
            <img
              src={vertical.image}
              alt={vertical.title}
              className="w-20 h-14 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm">{vertical.title}</h3>
              <p className="text-white/40 text-xs">{vertical.path}</p>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded ${
                vertical.active
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {vertical.active ? "Active" : "Hidden"}
            </span>
            <span className="text-xs text-white/30">
              {vertical.services.length} services
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setEditing(vertical)}
                className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => toggleActive(vertical)}
                className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded transition-colors"
              >
                {vertical.active ? "Hide" : "Show"}
              </button>
              <button
                onClick={() => deleteVertical(vertical)}
                className="px-3 py-1.5 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VerticalForm({
  vertical,
  onSave,
  onCancel,
}: {
  vertical?: Vertical;
  onSave: () => void;
  onCancel: () => void;
}) {
  const isEdit = !!vertical;
  const [title, setTitle] = useState(vertical?.title || "");
  const [slug, setSlug] = useState(vertical?.slug || "");
  const [description, setDescription] = useState(vertical?.description || "");
  const [path, setPath] = useState(vertical?.path || "");
  const [image, setImage] = useState(vertical?.image || "");
  const [servicesText, setServicesText] = useState(
    vertical?.services.join("\n") || "",
  );
  const [active, setActive] = useState(vertical?.active ?? true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, getAdminToken());
      setImage(url);
      setError("");
    } catch {
      setError("Failed to upload image");
    }
    setUploading(false);
  }

  async function handleSave() {
    if (!title.trim() || !description.trim() || !image.trim()) {
      setError("Title, description and image are required");
      return;
    }

    setSaving(true);
    setError("");
    const services = servicesText
      .split("\n")
      .map((service) => service.trim())
      .filter(Boolean);

    try {
      if (isEdit && vertical) {
        await apiPut(
          `/admin/verticals/${vertical.id}`,
          {
            title,
            description,
            image,
            path,
            services,
            active,
          },
          getAdminToken(),
        );
      } else {
        await apiPost(
          "/admin/verticals",
          {
            title,
            slug,
            description,
            image,
            path,
            services,
            active,
          },
          getAdminToken(),
        );
      }
      onSave();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : isEdit
            ? "Failed to update vertical"
            : "Failed to create vertical",
      );
    }
    setSaving(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-serif">
          {isEdit ? `Edit: ${vertical?.title}` : "New Vertical"}
        </h2>
        <button
          onClick={onCancel}
          className="text-sm text-white/50 hover:text-white transition-colors"
        >
          &larr; Back
        </button>
      </div>

      <div className="max-w-3xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/50 mb-1 uppercase tracking-wide">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slug) {
                  setSlug(
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, "-")
                      .replace(/-+/g, "-")
                      .replace(/^-|-$/g, ""),
                  );
                }
              }}
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-sm text-white focus:border-primary outline-none"
              placeholder="Architecture"
            />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1 uppercase tracking-wide">
              Slug
            </label>
            <input
              value={slug}
              onChange={(e) =>
                setSlug(
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, "-")
                    .replace(/-+/g, "-")
                    .replace(/^-|-$/g, ""),
                )
              }
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-sm text-white focus:border-primary outline-none"
              placeholder="architecture"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-white/50 mb-1 uppercase tracking-wide">
            Path
          </label>
          <input
            value={path}
            onChange={(e) => setPath(e.target.value)}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-sm text-white focus:border-primary outline-none"
            placeholder="/vertical/architecture (or leave empty for auto)"
          />
        </div>

        <div>
          <label className="block text-xs text-white/50 mb-1 uppercase tracking-wide">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-sm text-white focus:border-primary outline-none resize-none"
            placeholder="Brief vertical description"
          />
        </div>

        <div>
          <label className="block text-xs text-white/50 mb-1 uppercase tracking-wide">
            Services (one per line)
          </label>
          <textarea
            value={servicesText}
            onChange={(e) => setServicesText(e.target.value)}
            rows={5}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-sm text-white focus:border-primary outline-none resize-none"
            placeholder="Space Planning&#10;Material Selection"
          />
        </div>

        <div>
          <label className="block text-xs text-white/50 mb-1 uppercase tracking-wide">
            Cover Image
          </label>
          {image && (
            <img
              src={image}
              alt="Vertical"
              className="w-full max-w-md h-48 object-cover rounded mb-2"
            />
          )}
          <label className="inline-block px-4 py-2 bg-white/10 hover:bg-white/20 text-sm cursor-pointer transition-colors rounded">
            {uploading
              ? "Uploading..."
              : image
                ? "Change Image"
                : "Upload Image"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="accent-primary"
            id="vertical-active"
          />
          <label htmlFor="vertical-active" className="text-sm text-white/70">
            Active (visible on site)
          </label>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

      <div className="flex gap-3 mt-8 pt-6 border-t border-white/10">
        <button
          onClick={handleSave}
          disabled={saving || uploading}
          className="px-6 py-2.5 bg-primary text-white text-sm tracking-wide hover:bg-primary/80 transition-colors disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : isEdit
              ? "Update Vertical"
              : "Create Vertical"}
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-2.5 bg-white/10 text-white/70 text-sm hover:bg-white/20 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function MediaManager() {
  const [mediaTab, setMediaTab] = useState<"covers" | "team" | "profile">(
    "covers",
  );

  return (
    <div>
      <div className="flex gap-4 mb-6 border-b border-white/10 pb-3">
        <button
          onClick={() => setMediaTab("covers")}
          className={`text-sm pb-1 ${mediaTab === "covers" ? "text-primary border-b-2 border-primary" : "text-white/50 hover:text-white"}`}
        >
          Vertical Covers
        </button>
        <button
          onClick={() => setMediaTab("team")}
          className={`text-sm pb-1 ${mediaTab === "team" ? "text-primary border-b-2 border-primary" : "text-white/50 hover:text-white"}`}
        >
          Team Members
        </button>
        <button
          onClick={() => setMediaTab("profile")}
          className={`text-sm pb-1 ${mediaTab === "profile" ? "text-primary border-b-2 border-primary" : "text-white/50 hover:text-white"}`}
        >
          Site Profile
        </button>
      </div>
      {mediaTab === "covers" && <VerticalCoversEditor />}
      {mediaTab === "team" && <TeamEditor />}
      {mediaTab === "profile" && <SiteProfileEditor />}
    </div>
  );
}

function VerticalCoversEditor() {
  type Cover = { verticalId: string; image: string };
  const [covers, setCovers] = useState<Cover[]>([]);
  const [verticals, setVerticals] = useState<Vertical[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      apiGet<Vertical[]>("/admin/verticals", getAdminToken()),
      apiGet<any[]>("/admin/vertical-covers", getAdminToken()),
    ])
      .then(([verticalData, coverData]) => {
        setVerticals(verticalData);
        const mapped = verticalData.map((v) => {
          const existing = coverData.find((c: any) => c.verticalId === v.slug);
          return { verticalId: v.slug, image: existing?.image || v.image };
        });
        setCovers(mapped);
      })
      .catch(() => {
        setVerticals([]);
        setCovers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleUpload(
    verticalId: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(verticalId);
    try {
      const url = await uploadImage(file, getAdminToken());
      setCovers((prev) =>
        prev.map((c) =>
          c.verticalId === verticalId ? { ...c, image: url } : c,
        ),
      );
      setSaved(false);
    } catch {}
    setUploading(null);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await apiPut("/admin/vertical-covers", { covers }, getAdminToken());
      invalidateSiteSettings();
      setSaved(true);
    } catch {}
    setSaving(false);
  }

  if (loading) return <div className="text-white/40">Loading covers...</div>;

  return (
    <div>
      <p className="text-white/40 text-sm mb-6">
        Update the cover photos for each vertical/category page.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {covers.map((cover) => {
          const vertical = verticals.find((v) => v.slug === cover.verticalId);
          return (
            <div
              key={cover.verticalId}
              className="bg-white/5 rounded border border-white/10 overflow-hidden"
            >
              <div className="relative h-36">
                <img
                  src={cover.image}
                  alt={vertical?.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <label className="px-3 py-1.5 bg-white/20 text-white text-xs cursor-pointer rounded backdrop-blur-sm">
                    {uploading === cover.verticalId
                      ? "Uploading..."
                      : "Change Photo"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUpload(cover.verticalId, e)}
                      className="hidden"
                      disabled={uploading === cover.verticalId}
                    />
                  </label>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium">
                  {vertical?.title || cover.verticalId}
                </p>
                <input
                  value={cover.image}
                  onChange={(e) => {
                    setCovers((prev) =>
                      prev.map((c) =>
                        c.verticalId === cover.verticalId
                          ? { ...c, image: e.target.value }
                          : c,
                      ),
                    );
                    setSaved(false);
                  }}
                  className="w-full mt-2 px-2 py-1.5 bg-white/5 border border-white/10 text-[11px] text-white/60 focus:border-primary outline-none"
                  placeholder="Image URL"
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-primary text-white text-sm tracking-wide hover:bg-primary/80 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Covers"}
        </button>
        {saved && (
          <span className="text-green-400 text-sm self-center">Saved!</span>
        )}
      </div>
    </div>
  );
}

function TeamEditor() {
  type Member = { name: string; role: string; image: string };
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState<number | null>(null);

  useEffect(() => {
    apiGet<any[]>("/admin/team-members", getAdminToken())
      .then((data) =>
        setMembers(
          data.map((m) => ({ name: m.name, role: m.role, image: m.image })),
        ),
      )
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function updateMember(i: number, field: keyof Member, val: string) {
    setMembers((prev) =>
      prev.map((m, idx) => (idx === i ? { ...m, [field]: val } : m)),
    );
    setSaved(false);
  }

  async function handlePhotoUpload(
    i: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(i);
    try {
      const url = await uploadImage(file, getAdminToken());
      updateMember(i, "image", url);
    } catch {}
    setUploading(null);
  }

  function addMember() {
    setMembers((prev) => [...prev, { name: "", role: "", image: "" }]);
    setSaved(false);
  }

  function removeMember(i: number) {
    setMembers((prev) => prev.filter((_, idx) => idx !== i));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await apiPut("/admin/team-members", { members }, getAdminToken());
      invalidateSiteSettings();
      setSaved(true);
    } catch {}
    setSaving(false);
  }

  if (loading) return <div className="text-white/40">Loading team...</div>;

  return (
    <div>
      <p className="text-white/40 text-sm mb-6">
        Manage the team members displayed on the About page.
      </p>
      <div className="space-y-3 max-w-3xl">
        {members.map((member, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 bg-white/5 rounded border border-white/10"
          >
            <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 group">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover"
              />
              <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span className="text-[10px] text-white">
                  {uploading === i ? "..." : "Edit"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload(i, e)}
                  className="hidden"
                  disabled={uploading === i}
                />
              </label>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-3">
              <input
                value={member.name}
                onChange={(e) => updateMember(i, "name", e.target.value)}
                placeholder="Name"
                className="px-3 py-2 bg-white/5 border border-white/10 text-sm text-white focus:border-primary outline-none"
              />
              <input
                value={member.role}
                onChange={(e) => updateMember(i, "role", e.target.value)}
                placeholder="Role"
                className="px-3 py-2 bg-white/5 border border-white/10 text-sm text-white focus:border-primary outline-none"
              />
            </div>
            <button
              onClick={() => removeMember(i)}
              className="text-red-400/60 hover:text-red-400 text-lg"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-3 mt-6">
        <button
          onClick={addMember}
          className="px-4 py-2 bg-white/10 text-white/70 text-sm hover:bg-white/20 transition-colors rounded"
        >
          + Add Member
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-primary text-white text-sm tracking-wide hover:bg-primary/80 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Team"}
        </button>
        {saved && (
          <span className="text-green-400 text-sm self-center">Saved!</span>
        )}
      </div>
    </div>
  );
}

function SiteProfileEditor() {
  const [profile, setProfile] = useState<SiteProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiGet<SiteProfile>("/admin/site-profile", getAdminToken())
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, []);

  function updateProfile<K extends keyof SiteProfile>(
    key: K,
    value: SiteProfile[K],
  ) {
    setProfile((prev) => (prev ? { ...prev, [key]: value } : prev));
    setSaved(false);
  }

  async function handleSave() {
    if (!profile) {
      return;
    }

    setSaving(true);
    try {
      await apiPut("/admin/site-profile", profile, getAdminToken());
      invalidateSiteSettings();
      setSaved(true);
    } catch {}
    setSaving(false);
  }

  if (loading) {
    return <div className="text-white/40">Loading site profile...</div>;
  }

  if (!profile) {
    return <div className="text-white/40">Unable to load site profile.</div>;
  }

  return (
    <div>
      <p className="text-white/40 text-sm mb-6">
        Manage the public contact details, office address, and social links used
        across the site.
      </p>

      <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-white/50 mb-1 uppercase tracking-wide">
            Contact Email
          </label>
          <input
            value={profile.contactEmail}
            onChange={(e) => updateProfile("contactEmail", e.target.value)}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-sm text-white focus:border-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-white/50 mb-1 uppercase tracking-wide">
            Contact Phone
          </label>
          <input
            value={profile.contactPhone}
            onChange={(e) => updateProfile("contactPhone", e.target.value)}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-sm text-white focus:border-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-white/50 mb-1 uppercase tracking-wide">
            Phone Label
          </label>
          <input
            value={profile.contactPhoneLabel || ""}
            onChange={(e) =>
              updateProfile("contactPhoneLabel", e.target.value || null)
            }
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-sm text-white focus:border-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-white/50 mb-1 uppercase tracking-wide">
            Office Name
          </label>
          <input
            value={profile.officeName}
            onChange={(e) => updateProfile("officeName", e.target.value)}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-sm text-white focus:border-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-white/50 mb-1 uppercase tracking-wide">
            Office Floor
          </label>
          <input
            value={profile.officeFloor || ""}
            onChange={(e) =>
              updateProfile("officeFloor", e.target.value || null)
            }
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-sm text-white focus:border-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-white/50 mb-1 uppercase tracking-wide">
            Instagram URL
          </label>
          <input
            value={profile.instagramUrl || ""}
            onChange={(e) =>
              updateProfile("instagramUrl", e.target.value || null)
            }
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-sm text-white focus:border-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-white/50 mb-1 uppercase tracking-wide">
            LinkedIn URL
          </label>
          <input
            value={profile.linkedinUrl || ""}
            onChange={(e) =>
              updateProfile("linkedinUrl", e.target.value || null)
            }
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-sm text-white focus:border-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-white/50 mb-1 uppercase tracking-wide">
            Directions URL
          </label>
          <input
            value={profile.mapsDirectionsUrl || ""}
            onChange={(e) =>
              updateProfile("mapsDirectionsUrl", e.target.value || null)
            }
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-sm text-white focus:border-primary outline-none"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs text-white/50 mb-1 uppercase tracking-wide">
            Office Address
          </label>
          <textarea
            value={profile.officeAddress}
            onChange={(e) => updateProfile("officeAddress", e.target.value)}
            rows={4}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-sm text-white focus:border-primary outline-none resize-none"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs text-white/50 mb-1 uppercase tracking-wide">
            Maps Embed URL
          </label>
          <textarea
            value={profile.mapsEmbedUrl || ""}
            onChange={(e) =>
              updateProfile("mapsEmbedUrl", e.target.value || null)
            }
            rows={3}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-sm text-white focus:border-primary outline-none resize-none"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-primary text-white text-sm tracking-wide hover:bg-primary/80 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Site Profile"}
        </button>
        {saved && (
          <span className="text-green-400 text-sm self-center">Saved!</span>
        )}
      </div>
    </div>
  );
}

function FeaturedManager() {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [featuredSlugs, setFeaturedSlugs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    Promise.all([
      apiGet<Project[]>("/admin/projects", getAdminToken()),
      apiGet<any[]>("/admin/featured-projects", getAdminToken()),
    ])
      .then(([projects, featured]) => {
        setAllProjects(projects.filter((p) => p.active));
        setFeaturedSlugs(featured.map((f) => f.projectSlug));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function toggleFeatured(slug: string) {
    setFeaturedSlugs((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      return [...prev, slug];
    });
    setSaved(false);
  }

  function moveFeatured(slug: string, dir: -1 | 1) {
    setFeaturedSlugs((prev) => {
      const idx = prev.indexOf(slug);
      if (idx < 0) return prev;
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return arr;
    });
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await apiPut(
        "/admin/featured-projects",
        { slugs: featuredSlugs },
        getAdminToken(),
      );
      invalidateSiteSettings();
      setSaved(true);
    } catch {}
    setSaving(false);
  }

  if (loading) return <div className="text-white/40">Loading projects...</div>;

  const featuredProjects = featuredSlugs
    .map((s) => allProjects.find((p) => p.slug === s))
    .filter(Boolean) as Project[];
  const availableProjects = allProjects.filter(
    (p) => !featuredSlugs.includes(p.slug),
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-serif">Featured Projects</h2>
        <p className="text-white/40 text-sm mt-1">
          Select which projects appear in the "Featured" section on the
          homepage. Use the arrows to reorder them.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-sm text-white/50 uppercase tracking-wide mb-3">
            Featured ({featuredProjects.length})
          </h3>
          {featuredProjects.length === 0 && (
            <p className="text-white/30 text-sm p-4 bg-white/5 rounded">
              No featured projects selected. The homepage will show the first 4
              projects by default.
            </p>
          )}
          <div className="space-y-2">
            {featuredProjects.map((project, i) => (
              <div
                key={project.slug}
                className="flex items-center gap-3 p-3 bg-primary/10 rounded border border-primary/20"
              >
                <img
                  src={project.heroImage}
                  alt={project.title}
                  className="w-16 h-11 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {project.title}
                  </p>
                  <p className="text-white/40 text-xs">{project.category}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveFeatured(project.slug, -1)}
                    disabled={i === 0}
                    className="w-7 h-7 flex items-center justify-center text-white/40 hover:text-white disabled:opacity-20 text-sm"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveFeatured(project.slug, 1)}
                    disabled={i === featuredProjects.length - 1}
                    className="w-7 h-7 flex items-center justify-center text-white/40 hover:text-white disabled:opacity-20 text-sm"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => toggleFeatured(project.slug)}
                    className="px-2 py-1 text-xs text-red-400/70 hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm text-white/50 uppercase tracking-wide mb-3">
            Available Projects ({availableProjects.length})
          </h3>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {availableProjects.map((project) => (
              <div
                key={project.slug}
                className="flex items-center gap-3 p-3 bg-white/5 rounded border border-white/10 hover:border-white/20 transition-colors"
              >
                <img
                  src={project.heroImage}
                  alt={project.title}
                  className="w-16 h-11 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {project.title}
                  </p>
                  <p className="text-white/40 text-xs">{project.category}</p>
                </div>
                <button
                  onClick={() => toggleFeatured(project.slug)}
                  className="px-3 py-1.5 text-xs bg-primary/20 text-primary hover:bg-primary/30 rounded transition-colors"
                >
                  + Feature
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-8 pt-6 border-t border-white/10">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-primary text-white text-sm tracking-wide hover:bg-primary/80 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Featured"}
        </button>
        {saved && (
          <span className="text-green-400 text-sm self-center">Saved!</span>
        )}
      </div>
    </div>
  );
}

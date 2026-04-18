import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { useProjects } from "@/lib/useProjects";
import { useSiteSettings } from "@/lib/useSiteSettings";
import { useState, useCallback, useMemo } from "react";
import { X, MapPin } from "lucide-react";

type ProjectItem = {
  kind: "project";
  id: string;
  title: string;
  category: string;
  location: string;
  image: string;
  description: string;
};

export default function ProjectsPreview() {
  const { projects: allProjects, loading, error, refetch } = useProjects();
  const { settings } = useSiteSettings();

  const featured = useMemo(() => {
    if (settings.featuredSlugs && settings.featuredSlugs.length > 0) {
      const mapped = settings.featuredSlugs
        .map((slug) => allProjects.find((p) => p.id === slug))
        .filter(Boolean) as typeof allProjects;
      return mapped.length > 0 ? mapped : allProjects.slice(0, 6);
    }
    return allProjects.slice(0, 6);
  }, [allProjects, settings.featuredSlugs]);

  const [modalProject, setModalProject] = useState<ProjectItem | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const handleOpen = useCallback((p: (typeof allProjects)[0]) => {
    setModalProject({ kind: "project", ...p });
  }, []);

  const cardWidth = 316;
  const totalWidth = featured.length * cardWidth;

  return (
    <section className="py-24 md:py-32 bg-card overflow-hidden select-none">
      <div className="px-6 md:px-12 lg:px-24 mb-10 max-w-7xl mx-auto flex justify-between items-end">
        <div>
          <p className="text-xs tracking-widest uppercase text-foreground/40 mb-3">
            Selected Work
          </p>
          <h3 className="text-4xl md:text-5xl font-serif text-foreground">
            Featured Projects
          </h3>
        </div>
        <Link
          href="/projects"
          className="hidden md:inline-flex items-center gap-2 px-6 py-3 border border-foreground/20 text-foreground text-xs tracking-widest uppercase hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
        >
          View All →
        </Link>
      </div>

      {error && !loading && (
        <div className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
          <div className="border border-foreground/20 bg-background/40 rounded-md p-6 text-sm text-foreground/70 flex items-center justify-between gap-4">
            <span>{error}</span>
            <button
              onClick={refetch}
              className="px-4 py-2 border border-foreground/30 text-xs tracking-wide uppercase hover:bg-foreground hover:text-background transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {!error && !loading && featured.length === 0 && (
        <div className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
          <div className="border border-foreground/20 bg-background/40 rounded-md p-6 text-sm text-foreground/70">
            No featured projects to display.
          </div>
        </div>
      )}

      {!error && featured.length > 0 && (
        <div className="relative overflow-hidden">
          <style>{`
          @keyframes marquee-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-${totalWidth}px); }
          }
          .marquee-track {
            display: flex;
            gap: 16px;
            width: max-content;
            animation: marquee-scroll ${featured.length * 5}s linear infinite;
          }
          .marquee-track.paused {
            animation-play-state: paused;
          }
        `}</style>
          <div
            className={`marquee-track ${isPaused ? "paused" : ""}`}
            style={{ paddingLeft: 24 }}
          >
            {[...featured, ...featured].map((project, i) => (
              <div
                key={`${project.id}-${i}`}
                className="shrink-0 py-4"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onClick={() => handleOpen(project)}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center mt-8 md:hidden">
        <Link
          href="/projects"
          className="text-sm tracking-widest uppercase text-foreground hover:text-primary transition-colors"
        >
          View All Projects →
        </Link>
      </div>

      <AnimatePresence>
        {modalProject && (
          <ProjectModal
            project={modalProject}
            onClose={() => setModalProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function ProjectCard({
  project,
}: {
  project: {
    id: string;
    title: string;
    category: string;
    location: string;
    image: string;
    description: string;
  };
}) {
  return (
    <div
      className="relative rounded-2xl cursor-pointer hover:scale-105 hover:-translate-y-2 hover:shadow-[0_24px_48px_rgba(0,0,0,0.2)] shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
      style={{
        width: 300,
        height: 420,
        overflow: "hidden",
        transition:
          "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
    >
      <img
        src={project.image}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full p-6 z-10">
        <h4 className="text-white font-serif text-2xl leading-tight">
          {project.title}
        </h4>
      </div>
    </div>
  );
}

function ProjectModal({
  project,
  onClose,
}: {
  project: ProjectItem;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.97 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 bg-background w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-foreground/10 hover:bg-foreground/20 flex items-center justify-center transition-colors duration-200"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-foreground" />
        </button>

        <div className="relative w-full md:w-1/2 h-64 md:h-auto shrink-0">
          <img
            src={project.image}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6">
            <span className="text-xs tracking-widest uppercase text-primary font-medium bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
              {project.category}
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-between p-8 md:p-12 overflow-y-auto">
          <div>
            <p className="text-xs tracking-widest uppercase text-primary mb-3">
              {project.category}
            </p>
            <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-2 leading-tight">
              {project.title}
            </h2>
            <div className="flex items-center gap-2 text-foreground/50 text-sm mb-8">
              <MapPin className="w-3.5 h-3.5" />
              <span>{project.location}</span>
            </div>

            <div className="w-12 h-px bg-primary mb-8" />

            <p className="text-foreground/70 text-base leading-relaxed mb-5">
              {project.description}
            </p>
            <p className="text-foreground/50 text-sm leading-relaxed">
              This project reflects RayTrace's commitment to creating
              environments that transcend the ordinary — spaces where material
              honesty, light, and proportion converge to produce something
              genuinely extraordinary.
            </p>
          </div>

          <div className="mt-10 pt-8 border-t border-border/40 flex items-center justify-between">
            <a
              href={`/projects/${project.id}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="text-xs tracking-widest uppercase text-foreground/50 hover:text-primary transition-colors"
            >
              View More Details →
            </a>
            <Link
              href="/contact"
              onClick={onClose}
              className="px-6 py-3 bg-foreground text-background text-xs tracking-widest uppercase hover:bg-primary transition-colors duration-300"
            >
              Enquire
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

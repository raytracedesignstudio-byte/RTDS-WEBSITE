import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams } from "wouter";
import PageTransition from "@/components/layout/PageTransition";
import { useProjectDetail } from "@/lib/useProjects";

export default function ProjectDetail() {
  const { id } = useParams();
  const { project, loading } = useProjectDetail(id || "");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [factsOpen, setFactsOpen] = useState(false);

  useEffect(() => {
    setCurrentSlide(0);
    setFactsOpen(false);
  }, [id]);

  if (loading) {
    return <div className="pt-32 px-12 text-foreground/50">Loading...</div>;
  }

  if (!project) {
    return <div className="pt-32 px-12 text-foreground">Project not found</div>;
  }

  const gallery =
    project.galleryImages.length > 0 ? project.galleryImages : [project.image];
  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % gallery.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + gallery.length) % gallery.length);

  return (
    <PageTransition>
      <div className="min-h-screen pt-28 pb-24 px-6 md:px-12 lg:px-16">
        <div className="max-w-1400px mx-auto">
          <Link
            href="/projects"
            className="text-foreground/50 hover:text-foreground uppercase tracking-widest text-xs mb-10 inline-block transition-colors"
          >
            &larr; Back to Projects
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-10 lg:gap-14 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1 lg:sticky lg:top-28"
            >
              <p className="text-foreground/40 text-xs tracking-widest uppercase mb-3">
                {project.category}
              </p>
              <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-8">
                {project.title}
              </h1>

              <div className="space-y-4 text-foreground/70 text-base leading-relaxed mb-10">
                <p>{project.description}</p>
              </div>

              <div className="border-t border-foreground/10">
                <button
                  onClick={() => setFactsOpen(!factsOpen)}
                  className="w-full flex items-center justify-between py-5 text-left"
                >
                  <span className="text-sm font-semibold tracking-wide text-foreground">
                    Project Facts
                  </span>
                  <motion.span
                    animate={{ rotate: factsOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-foreground/60 text-lg"
                  >
                    &or;
                  </motion.span>
                </button>
                <AnimatePresence>
                  {factsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-foreground/40 uppercase tracking-wider text-[10px] mb-1">
                            Location
                          </p>
                          <p className="text-foreground">{project.location}</p>
                        </div>
                        <div>
                          <p className="text-foreground/40 uppercase tracking-wider text-[10px] mb-1">
                            Category
                          </p>
                          <p className="text-foreground">{project.category}</p>
                        </div>
                        <div>
                          <p className="text-foreground/40 uppercase tracking-wider text-[10px] mb-1">
                            Year
                          </p>
                          <p className="text-foreground">{project.year || "TBD"}</p>
                        </div>
                        <div>
                          <p className="text-foreground/40 uppercase tracking-wider text-[10px] mb-1">
                            Status
                          </p>
                          <p className="text-foreground">{project.status || "TBD"}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="order-1 lg:order-2 relative"
            >
              <div className="relative overflow-hidden rounded-2xl aspect-16/10">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentSlide}
                    src={gallery[currentSlide]}
                    alt={`${project.title} - ${currentSlide + 1}`}
                    className="w-full h-full object-cover absolute inset-0"
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -60 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </AnimatePresence>

                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-white transition-colors shadow-sm"
                >
                  &lsaquo;
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-white transition-colors shadow-sm"
                >
                  &rsaquo;
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 mt-5">
                {gallery.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === currentSlide ? "bg-primary w-6" : "bg-foreground/20"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

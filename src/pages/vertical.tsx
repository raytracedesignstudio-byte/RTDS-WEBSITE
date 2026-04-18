import { motion } from "framer-motion";
import PageTransition from "@/components/layout/PageTransition";
import { useProjects } from "@/lib/useProjects";
import { useSiteSettings } from "@/lib/useSiteSettings";
import { useVerticals } from "@/lib/useVerticals";

export default function Vertical({ type }: { type: string }) {
  const { verticals } = useVerticals();
  const vertical = verticals.find((v) => v.id === type);
  const { projects } = useProjects();
  const { settings } = useSiteSettings();
  const relatedProjects = projects.filter((project) => project.verticalSlug === type);

  if (!vertical) return null;

  return (
    <PageTransition>
      <div className="min-h-screen pb-24">
        {/* Hero */}
        <div className="relative h-[60vh] w-full overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img
            src={
              (settings.verticalCovers && settings.verticalCovers[type]) ||
              vertical.image
            }
            alt={vertical.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-20 text-center px-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-serif text-white mb-6"
            >
              {vertical.title}
            </motion.h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="md:col-span-1">
              <h3 className="text-xl font-serif border-b border-border pb-4 mb-6">
                Our Services
              </h3>
              <ul className="space-y-4">
                {vertical.services.map((service, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 text-foreground/80"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {service}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <p className="text-2xl font-serif leading-relaxed text-foreground mb-8">
                We approach {vertical.title.toLowerCase()} not just as a
                discipline, but as a medium to express profound spatial
                narratives. Our methodology is rooted in context, driven by
                innovation, and refined through meticulous craftsmanship.
              </p>
              <p className="text-foreground/70 leading-relaxed">
                By pushing the boundaries of conventional design, we create
                environments that resonate on an emotional level while
                delivering uncompromising functional excellence. Every project
                is an opportunity to redefine the standard.
              </p>
            </div>
          </div>
        </div>

        {/* Related Projects */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <h3 className="text-3xl font-serif mb-12">Featured Work</h3>
          {relatedProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                >
                  <a
                    href={`/projects/${project.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <div className="aspect-4/5 overflow-hidden mb-4 bg-card">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </div>
                    <h4 className="text-xl font-serif text-foreground mb-1">
                      {project.title}
                    </h4>
                    <p className="text-foreground/60 text-sm">
                      {project.location}
                    </p>
                  </a>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-foreground/50">
              Featured work for this vertical will appear here once projects are assigned in the admin dashboard.
            </p>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

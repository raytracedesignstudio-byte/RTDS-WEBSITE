import { motion } from "framer-motion";

import PageTransition from "@/components/layout/PageTransition";
import { useProjects } from "@/lib/useProjects";

export default function Projects() {
  const { projects } = useProjects();

  return (
    <PageTransition>
      <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <h1 className="text-5xl md:text-7xl font-serif text-foreground mb-6">
              Our Work
            </h1>
            <p className="text-xl text-foreground/70 max-w-2xl">
              A curated selection of our finest projects across architecture,
              interior design, and project management.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: (index % 4) * 0.1 }}
              >
                <a
                  href={`/projects/${project.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-500"
                  data-testid={`project-grid-item-${project.id}`}
                >
                  <div className="aspect-3/4 overflow-hidden relative">
                    <div className="absolute inset-0 bg-black/5 z-10 group-hover:bg-transparent transition-colors duration-500" />
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <h2 className="text-base font-serif text-foreground">
                      {project.title}
                    </h2>
                    <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary text-sm">
                      →
                    </span>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

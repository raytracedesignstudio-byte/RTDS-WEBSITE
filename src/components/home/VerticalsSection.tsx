import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { useState } from "react";
import { useSiteSettings } from "@/lib/useSiteSettings";
import { useVerticals } from "@/lib/useVerticals";

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easeOutExpo },
  },
};

export default function VerticalsSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { settings } = useSiteSettings();
  const { verticals } = useVerticals();

  return (
    <section className="py-32 px-6 md:px-12 lg:px-24 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 md:mb-24">
          <h2 className="text-sm tracking-widest uppercase text-foreground/40 mb-4">
            What We Do
          </h2>
          <h3 className="text-4xl md:text-5xl font-serif text-foreground">
            Our Verticals
          </h3>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {verticals.map((vertical) => (
            <motion.div key={vertical.id} variants={itemVariants}>
              <Link
                href={vertical.path}
                className="block group relative overflow-hidden rounded-sm"
                style={{ height: 500 }}
                data-testid={`vertical-card-${vertical.id}`}
                onMouseEnter={() => setHoveredId(vertical.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Dim overlay */}
                <div className="absolute inset-0 bg-black/25 z-10 group-hover:bg-black/15 transition-colors duration-500" />

                {/* Gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent z-10" />

                {/* Image — grayscale by default, color on hover */}
                <img
                  src={
                    (settings.verticalCovers &&
                      settings.verticalCovers[vertical.id]) ||
                    vertical.image
                  }
                  alt={vertical.title}
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-all duration-700 ease-out grayscale group-hover:grayscale-0"
                />

                {/* Bottom text block */}
                <div className="absolute bottom-0 left-0 p-7 z-20 w-full">
                  <h4 className="text-xl font-serif text-white leading-snug mb-3">
                    {vertical.title}
                  </h4>

                  {/* Gold line that expands on hover */}
                  <div className="w-10 h-px bg-primary group-hover:w-full transition-all duration-500 ease-out mb-0" />

                  {/* Description — slides up on hover */}
                  <AnimatePresence>
                    {hoveredId === vertical.id && (
                      <motion.p
                        initial={{ opacity: 0, y: 12, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: 8, height: 0 }}
                        transition={{ duration: 0.38, ease: easeOutExpo }}
                        className="text-white/70 text-sm leading-relaxed mt-3 overflow-hidden"
                      >
                        {vertical.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

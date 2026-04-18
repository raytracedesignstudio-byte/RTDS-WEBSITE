import { motion } from "framer-motion";
import { Link } from "wouter";

export default function AboutPreview() {
  return (
    <section className="py-32 px-6 md:px-12 lg:px-24 bg-card">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-foreground/40 text-xs tracking-widest uppercase mb-6">About Us</p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif mb-10 text-foreground leading-tight max-w-3xl">
            We craft spaces that transcend architecture.
          </h2>
          <p className="text-foreground/60 text-lg md:text-xl leading-relaxed mb-12 max-w-2xl">
            For over a decade, RayTrace has shaped environments where beauty meets purpose — transforming visions into living, breathing experiences.
          </p>
          <Link
            href="/about"
            className="group inline-flex items-center text-sm tracking-widest uppercase text-foreground hover:text-primary transition-colors"
            data-testid="about-preview-cta"
          >
            Discover Our Story
            <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

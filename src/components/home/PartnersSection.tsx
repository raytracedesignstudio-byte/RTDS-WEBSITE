import { motion } from "framer-motion";
import { useState } from "react";
import { useSiteSettings, type Partner } from "@/lib/useSiteSettings";

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

export default function PartnersSection() {
  const { settings } = useSiteSettings();
  const partners = settings.partners;

  if (partners.length === 0) return null;

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 md:mb-20">
          <p className="text-xs tracking-widest uppercase text-foreground/40 mb-3">
            Trusted By
          </p>
          <h3 className="text-4xl md:text-5xl font-serif text-foreground">
            Our Partners
          </h3>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 md:grid-cols-3 gap-px bg-border/40 border border-border/40 rounded-sm overflow-hidden"
        >
          {partners.map((partner, i) => (
            <motion.div key={`${partner.name}-${i}`} variants={itemVariants}>
              <PartnerLogo partner={partner} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PartnerLogo({ partner }: { partner: Partner }) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = partner.logo && !imgFailed;

  return (
    <div className="group flex items-center justify-center h-28 md:h-40 bg-background transition-colors duration-500 hover:bg-card">
      {showImage ? (
        <img
          src={partner.logo}
          alt={partner.name}
          onError={() => setImgFailed(true)}
          className="max-h-14 md:max-h-16 w-auto object-contain opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500"
          draggable={false}
        />
      ) : (
        <span className="px-4 text-center font-serif text-lg md:text-2xl tracking-wide text-foreground/40 group-hover:text-foreground transition-colors duration-500">
          {partner.name}
        </span>
      )}
    </div>
  );
}

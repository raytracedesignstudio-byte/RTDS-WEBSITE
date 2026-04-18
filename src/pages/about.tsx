import { motion } from "framer-motion";
import PageTransition from "@/components/layout/PageTransition";
import { useSiteSettings } from "@/lib/useSiteSettings";

export default function About() {
  const { settings } = useSiteSettings();
  const team = settings.team || [];

  return (
    <PageTransition>
      <div className="pt-32 pb-20 px-6 md:px-12 lg:px-24 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mb-24"
          >
            <h1 className="text-5xl md:text-7xl font-serif text-foreground mb-8">
              The architects of experience.
            </h1>
            <p className="text-xl text-foreground/70 leading-relaxed">
              We believe that true luxury lies in restraint. RayTrace was
              founded on the principle that the spaces we inhabit shape the
              lives we lead. For over a decade, our multidisciplinary team has
              pushed the boundaries of what is possible in residential and
              commercial design.
            </p>
          </motion.div>

          <div className="mb-16">
            <h2 className="text-3xl font-serif mb-10">Core Team</h2>
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-5 max-w-5xl">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group text-center"
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-3 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-primary/30 transition-all duration-500">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover filter grayscale-20% group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-out"
                    />
                  </div>
                  <h3 className="text-sm font-serif text-foreground leading-tight">
                    {member.name}
                  </h3>
                  <p className="text-foreground/40 text-[9px] tracking-widest uppercase mt-1">
                    {member.role}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

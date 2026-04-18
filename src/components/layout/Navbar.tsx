import { Link, useLocation } from "wouter";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, Menu } from "lucide-react";

export default function Navbar({ showNav = false }: { showNav?: boolean }) {
  const [location] = useLocation();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!showNav) return;
    const timer = setTimeout(() => setHidden(false), 300);
    return () => clearTimeout(timer);
  }, [showNav]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  const links = [
    { href: "/projects", label: "Projects" },
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact" },
  ];

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: hidden ? -100 : 0, opacity: hidden ? 0 : 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-between md:justify-center items-center pt-4 md:pt-6 px-5 md:px-4 pointer-events-none"
      >
        {/* Mobile: Left logo + Right hamburger */}
        <div
          className={`pointer-events-auto flex items-center justify-between w-full md:w-auto md:gap-10 px-5 md:px-10 py-3.5 rounded-full transition-all duration-500 ${
            scrolled || mobileOpen
              ? "bg-background shadow-sm border border-border/50"
              : "bg-background/95 border border-border/20"
          }`}
        >
          <Link href="/" data-testid="nav-logo" className="flex items-center gap-2 cursor-pointer">
            <img
              src="/logo-icon.png"
              alt="RayTrace"
              className="h-8 w-auto object-contain navbar-logo-img"
              draggable={false}
            />
            <img
              src="/logo-text.png"
              alt="Design Studio"
              className="h-6 w-auto object-contain navbar-logo-img hidden sm:block"
              draggable={false}
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-base tracking-wide transition-all hover:text-primary hover:-translate-y-0.5 duration-300 ${
                  location === link.href ? "text-primary font-medium" : "text-foreground/80"
                }`}
                data-testid={`nav-link-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden pointer-events-auto ml-4 p-1 text-foreground"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            data-testid="nav-hamburger"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  className="block"
                >
                  <X className="w-5 h-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.2 }}
                  className="block"
                >
                  <Menu className="w-5 h-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* Mobile full-screen overlay menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-background/97 backdrop-blur-xl md:hidden"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M 10 90 L 10 10 L 90 10 L 90 90 Z" fill="none" stroke="currentColor" strokeWidth="0.2" />
                <path d="M 10 50 L 90 50 M 50 10 L 50 90" fill="none" stroke="currentColor" strokeWidth="0.1" />
              </svg>
            </div>

            <nav className="flex flex-col items-center gap-2 w-full px-8">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.4, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full"
                >
                  <Link
                    href={link.href}
                    onClick={handleLinkClick}
                    className={`block w-full text-center py-5 font-serif text-4xl border-b border-border/30 transition-colors duration-300 ${
                      location === link.href
                        ? "text-primary"
                        : "text-foreground hover:text-primary"
                    }`}
                    data-testid={`mobile-nav-link-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="mt-16 text-center"
            >
              <p className="text-foreground/40 text-xs tracking-widest uppercase">
                Designing Spaces. Defining Experiences.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

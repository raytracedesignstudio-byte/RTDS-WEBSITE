import { Link } from "wouter";
import { SiInstagram } from "react-icons/si";
import { Linkedin } from "lucide-react";
import { useSiteSettings } from "@/lib/useSiteSettings";

export default function Footer() {
  const { settings } = useSiteSettings();
  const profile = settings.profile;

  return (
    <footer className="footer-themed py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
        <div className="md:col-span-2">
          <Link
            href="/"
            className="mb-6 flex items-center gap-2.5 w-fit"
            data-testid="footer-logo"
          >
            <img
              src="/logo-icon.png"
              alt="RayTrace"
              className="h-10 w-auto footer-logo-img"
            />
            <img
              src="/logo-text.png"
              alt="Design Studio"
              className="h-7 w-auto footer-logo-img"
            />
          </Link>
          <p className="opacity-60 max-w-sm text-sm leading-relaxed mb-8">
            Designing spaces that redefine how people live and work.
            Ultra-premium, unhurried, confident architecture and interior
            design.
          </p>
        </div>

        <div>
          <h4 className="font-serif text-xl mb-6">Navigation</h4>
          <ul className="space-y-4 text-sm opacity-80">
            <li>
              <Link
                href="/"
                className="hover:text-primary transition-colors"
                data-testid="footer-link-home"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/projects"
                className="hover:text-primary transition-colors"
                data-testid="footer-link-projects"
              >
                Projects
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="hover:text-primary transition-colors"
                data-testid="footer-link-about"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/careers"
                className="hover:text-primary transition-colors"
                data-testid="footer-link-careers"
              >
                Careers
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-primary transition-colors"
                data-testid="footer-link-contact"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-xl mb-6">Social</h4>
          <div className="flex gap-4">
            {profile?.instagramUrl && (
              <a
                href={profile.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full border border-current/20 hover:bg-primary hover:border-primary transition-all duration-300"
                data-testid="social-instagram"
              >
                <SiInstagram className="w-4 h-4" />
              </a>
            )}
            {profile?.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full border border-current/20 hover:bg-primary hover:border-primary transition-all duration-300"
                data-testid="social-linkedin"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-current/10 text-xs opacity-40 flex flex-col md:flex-row justify-between items-center">
        <p>&copy; 2026 RayTrace. All rights reserved.</p>
        <p className="mt-2 md:mt-0">Designed with restraint.</p>
      </div>
    </footer>
  );
}

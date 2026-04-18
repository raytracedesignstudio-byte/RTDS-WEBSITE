import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import PageTransition from "@/components/layout/PageTransition";
import { SiInstagram } from "react-icons/si";
import { Linkedin, Phone } from "lucide-react";
import { useSiteSettings } from "@/lib/useSiteSettings";

function getApiUrl(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}/api${path}`;
}

export default function Contact() {
  const { settings } = useSiteSettings();
  const profile = settings.profile;
  const addressLines = useMemo(
    () =>
      profile?.officeAddress
        ? profile.officeAddress.split("\n").filter((line) => line.trim().length > 0)
        : [],
    [profile?.officeAddress],
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch(getApiUrl("/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setErrorMsg(data.message || "Something went wrong");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Connection error. Please try again.");
      setStatus("error");
    }
  };

  return (
    <PageTransition>
      <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-serif text-foreground mb-8">
                Let&apos;s discuss your next project.
              </h1>
              <p className="text-xl text-foreground/70 mb-16 max-w-md">
                Whether you have a specific vision or are looking for
                inspiration, our team is ready to help you create spaces that
                endure.
              </p>

              <div className="space-y-12">
                <div>
                  <h3 className="text-sm tracking-widest uppercase text-foreground/40 mb-4">
                    Inquiries
                  </h3>
                  {profile?.contactEmail ? (
                    <a
                      href={`mailto:${profile.contactEmail}`}
                      className="text-xl font-serif text-foreground hover:text-primary transition-colors"
                      data-testid="contact-email"
                    >
                      {profile.contactEmail}
                    </a>
                  ) : (
                    <p className="text-xl font-serif text-foreground/50">
                      Contact email coming soon
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="text-sm tracking-widest uppercase text-foreground/40 mb-4">
                    Phone
                  </h3>
                  {profile?.contactPhone ? (
                    <>
                      <a
                        href={`tel:${profile.contactPhone.replace(/\s+/g, "")}`}
                        className="text-xl font-serif text-foreground hover:text-primary transition-colors flex items-center gap-3"
                        data-testid="contact-phone"
                      >
                        <Phone className="w-5 h-5" />
                        {profile.contactPhone}
                      </a>
                      {profile.contactPhoneLabel && (
                        <p className="text-foreground/50 text-sm mt-1">
                          {profile.contactPhoneLabel}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-xl font-serif text-foreground/50">
                      Contact phone coming soon
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="text-sm tracking-widest uppercase text-foreground/40 mb-4">
                    Connect
                  </h3>
                  <div className="flex gap-6">
                    {profile?.instagramUrl && (
                      <a
                        href={profile.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:text-primary transition-colors"
                        data-testid="contact-instagram"
                      >
                        <SiInstagram className="w-6 h-6" />
                      </a>
                    )}
                    {profile?.linkedinUrl && (
                      <a
                        href={profile.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:text-primary transition-colors"
                        data-testid="contact-linkedin"
                      >
                        <Linkedin className="w-6 h-6" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-card p-8 md:p-12"
            >
              {status === "success" ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-serif text-foreground mb-3">
                    Message Sent!
                  </h3>
                  <p className="text-foreground/60 mb-8">
                    We&apos;ll get back to you as soon as possible.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="px-6 py-3 border border-foreground/20 text-foreground text-sm tracking-widest uppercase hover:bg-foreground hover:text-background transition-all duration-300"
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form className="space-y-8" onSubmit={handleSubmit}>
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm tracking-widest uppercase text-foreground/70 mb-2"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-transparent border-b border-border focus:border-primary pb-3 outline-none transition-colors text-foreground"
                      placeholder="Jane Doe"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm tracking-widest uppercase text-foreground/70 mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent border-b border-border focus:border-primary pb-3 outline-none transition-colors text-foreground"
                      placeholder="jane@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm tracking-widest uppercase text-foreground/70 mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-transparent border-b border-border focus:border-primary pb-3 outline-none transition-colors text-foreground resize-none"
                      placeholder="Tell us about your project..."
                      required
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-red-500 text-sm">{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full group relative inline-flex items-center justify-center px-8 py-4 bg-foreground text-background text-sm tracking-widest uppercase hover:bg-primary transition-colors duration-300 disabled:opacity-50"
                  >
                    {status === "sending" ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 rounded-2xl overflow-hidden h-400px">
                {profile?.mapsEmbedUrl ? (
                  <iframe
                    src={profile.mapsEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`${profile.officeName} Office Location`}
                  />
                ) : (
                  <div className="w-full h-full bg-card flex items-center justify-center text-foreground/40">
                    Map coming soon
                  </div>
                )}
              </div>

              <div className="bg-card p-8 md:p-10 flex flex-col justify-center rounded-2xl">
                <h3 className="text-sm tracking-widest uppercase text-foreground/40 mb-6">
                  Our Office
                </h3>
                <p className="font-serif text-2xl text-foreground mb-4">
                  {profile?.officeName || "RayTrace Design Studio"}
                </p>
                {profile?.officeFloor && (
                  <p className="text-foreground/60 text-base leading-relaxed mb-2">
                    {profile.officeFloor}
                  </p>
                )}
                <p className="text-foreground/60 text-base leading-relaxed mb-8">
                  {addressLines.length > 0
                    ? addressLines.map((line, index) => (
                        <span key={`${line}-${index}`}>
                          {line}
                          {index < addressLines.length - 1 && <br />}
                        </span>
                      ))
                    : "Office address coming soon"}
                </p>
                <div className="w-10 h-px bg-primary/40 mb-8" />
                {profile?.mapsDirectionsUrl && (
                  <a
                    href={profile.mapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 border border-foreground/20 text-foreground text-xs tracking-widest uppercase hover:bg-foreground hover:text-background transition-all duration-300 rounded-sm"
                  >
                    Get Directions &rarr;
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}

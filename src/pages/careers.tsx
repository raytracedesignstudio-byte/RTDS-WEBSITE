import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import PageTransition from "@/components/layout/PageTransition";

interface Vacancy {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string | null;
}

function getApiUrl(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}/api${path}`;
}

export default function Careers() {
  const [roles, setRoles] = useState<Vacancy[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [applyRole, setApplyRole] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    email: "",
  });
  const [resume, setResume] = useState<File | null>(null);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(getApiUrl("/vacancies/active"))
      .then((r) => r.json())
      .then((data) => {
        setRoles(Array.isArray(data) ? data : []);
        setLoaded(true);
      })
      .catch(() => {
        setRoles([]);
        setLoaded(true);
      });
  }, []);

  const openApplyModal = (roleTitle: string) => {
    setApplyRole(roleTitle);
    setFormData({ name: "", age: "", phone: "", email: "" });
    setResume(null);
    setSubmitStatus("idle");
    setErrorMsg("");
  };

  const closeModal = () => {
    setApplyRole(null);
    setSubmitStatus("idle");
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) return;
    setSubmitStatus("sending");
    setErrorMsg("");

    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("age", formData.age);
    fd.append("phone", formData.phone);
    fd.append("email", formData.email);
    fd.append("role", applyRole || "General Application");
    if (resume) fd.append("resume", resume);

    try {
      const res = await fetch(getApiUrl("/apply"), {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (data.success) {
        setSubmitStatus("success");
      } else {
        setErrorMsg(data.message || "Something went wrong");
        setSubmitStatus("error");
      }
    } catch {
      setErrorMsg("Connection error. Please try again.");
      setSubmitStatus("error");
    }
  };

  return (
    <PageTransition>
      <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-20 max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-serif text-foreground mb-6">
              Shape the Future of Design
            </h1>
            <p className="text-xl text-foreground/70 leading-relaxed">
              At RayTrace, we are always looking for visionary thinkers,
              meticulous craftsmen, and passionate innovators to join our
              studio. We offer an environment where creativity is nurtured and
              excellence is the standard.
            </p>
          </motion.div>

          <div className="mb-24">
            <h2 className="text-3xl font-serif mb-12">Open Roles</h2>
            <div className="space-y-6">
              {!loaded && (
                <div className="text-center py-12 text-foreground/40">
                  Loading positions...
                </div>
              )}
              {loaded && roles.length === 0 && (
                <div className="text-center py-12 text-foreground/40 font-serif text-lg">
                  No open positions at the moment. Check back soon!
                </div>
              )}
              {roles.map((role, i) => (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group block p-8 md:p-10 border border-border hover:border-primary/50 bg-card transition-colors duration-300 rounded-2xl"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-foreground/40 text-xs tracking-widest uppercase">
                          {role.department}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span className="text-foreground/60 text-xs tracking-widest uppercase">
                          {role.type}
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-serif text-foreground mb-2 group-hover:text-primary transition-colors">
                        {role.title}
                      </h3>
                      <p className="text-foreground/70">{role.location}</p>
                      {role.description && (
                        <p className="text-foreground/50 text-sm mt-3">
                          {role.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => openApplyModal(role.title)}
                      className="w-fit px-8 py-3 bg-foreground text-background text-sm tracking-widest uppercase hover:bg-primary transition-colors rounded-lg"
                    >
                      Apply Now
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 md:p-24 bg-foreground text-background text-center rounded-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-serif mb-6">
              Join Our Studio
            </h2>
            <p className="text-lg md:text-xl text-background/70 max-w-2xl mx-auto mb-10">
              Don't see a role that fits? We are always interested in connecting
              with exceptional talent. Send us your portfolio and tell us how
              you can contribute to RayTrace.
            </p>
            <button
              onClick={() => openApplyModal("General / Portfolio Submission")}
              className="px-8 py-4 border border-background/20 hover:bg-background hover:text-foreground transition-all duration-300 text-sm tracking-widest uppercase rounded-lg"
            >
              Submit Portfolio
            </button>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {applyRole && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeModal();
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-card w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8 md:p-10">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <p className="text-foreground/40 text-xs tracking-widest uppercase mb-2">
                      Application
                    </p>
                    <h3 className="text-2xl font-serif text-foreground">
                      {applyRole}
                    </h3>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-foreground/40 hover:text-foreground transition-colors text-2xl leading-none mt-1"
                  >
                    ×
                  </button>
                </div>

                {submitStatus === "success" ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
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
                    <h4 className="text-xl font-serif text-foreground mb-3">
                      Application Submitted!
                    </h4>
                    <p className="text-foreground/60 mb-6">
                      Thank you for your interest. We'll review your application
                      and get back to you soon.
                    </p>
                    <button
                      onClick={closeModal}
                      className="px-6 py-3 bg-foreground text-background text-sm tracking-widest uppercase rounded-lg hover:bg-primary transition-colors"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplySubmit} className="space-y-5">
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-foreground/50 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs tracking-widest uppercase text-foreground/50 mb-2">
                          Age
                        </label>
                        <input
                          type="number"
                          value={formData.age}
                          onChange={(e) =>
                            setFormData({ ...formData, age: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                          placeholder="25"
                          min="16"
                          max="99"
                        />
                      </div>
                      <div>
                        <label className="block text-xs tracking-widest uppercase text-foreground/50 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                          placeholder="+91 98765 43210"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs tracking-widest uppercase text-foreground/50 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                        placeholder="john@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs tracking-widest uppercase text-foreground/50 mb-2">
                        Resume / CV
                      </label>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full px-4 py-6 bg-background border border-dashed border-border/50 rounded-lg text-center cursor-pointer hover:border-primary transition-colors"
                      >
                        {resume ? (
                          <div className="flex items-center justify-center gap-2">
                            <svg
                              className="w-5 h-5 text-green-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="text-sm text-foreground">
                              {resume.name}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setResume(null);
                                if (fileInputRef.current)
                                  fileInputRef.current.value = "";
                              }}
                              className="text-foreground/40 hover:text-red-500 ml-2"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <div>
                            <svg
                              className="w-8 h-8 mx-auto text-foreground/30 mb-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                            <p className="text-sm text-foreground/50">
                              Click to upload resume
                            </p>
                            <p className="text-xs text-foreground/30 mt-1">
                              PDF, DOC, DOCX (max 10MB)
                            </p>
                          </div>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setResume(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                    </div>

                    {submitStatus === "error" && (
                      <p className="text-red-500 text-sm">{errorMsg}</p>
                    )}

                    <button
                      type="submit"
                      disabled={submitStatus === "sending"}
                      className="w-full py-3 bg-foreground text-background text-sm tracking-widest uppercase rounded-lg hover:bg-primary transition-colors disabled:opacity-50"
                    >
                      {submitStatus === "sending"
                        ? "Submitting..."
                        : "Submit Application"}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/layout/PageTransition";
import {
  clearAdminToken,
  getAdminToken,
  hasAdminToken,
  setAdminToken,
} from "@/lib/adminAuth";

function getApiUrl(path: string) {
  const base = (import.meta.env.VITE_API_URL || "/api").replace(/\/+$/, "");
  return `${base}${path}`;
}

interface Vacancy {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string | null;
  active: boolean;
  createdAt: string;
}

export default function Vacancies() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: "",
    department: "",
    location: "",
    type: "Full-time",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hasAdminToken()) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) fetchVacancies();
  }, [isLoggedIn]);

  const fetchVacancies = async () => {
    const res = await fetch(getApiUrl("/vacancies"), {
      headers: {
        Authorization: `Bearer ${getAdminToken()}`,
      },
    });
    const data = await res.json();
    setVacancies(data);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);
    try {
      const res = await fetch(getApiUrl("/admin/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setAdminToken(String(data.token));
        setIsLoggedIn(true);
      } else {
        setLoginError("Invalid email or password");
      }
    } catch {
      setLoginError("Connection error. Please try again.");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    clearAdminToken();
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAdminToken()}`,
    };

    if (editingId) {
      await fetch(getApiUrl(`/vacancies/${editingId}`), {
        method: "PUT",
        headers,
        body: JSON.stringify({ ...form, active: true }),
      });
    } else {
      await fetch(getApiUrl("/vacancies"), {
        method: "POST",
        headers,
        body: JSON.stringify(form),
      });
    }

    setForm({
      title: "",
      department: "",
      location: "",
      type: "Full-time",
      description: "",
    });
    setShowForm(false);
    setEditingId(null);
    await fetchVacancies();
    setLoading(false);
  };

  const handleEdit = (v: Vacancy) => {
    setForm({
      title: v.title,
      department: v.department,
      location: v.location,
      type: v.type,
      description: v.description || "",
    });
    setEditingId(v.id);
    setShowForm(true);
  };

  const handleToggleActive = async (v: Vacancy) => {
    await fetch(getApiUrl(`/vacancies/${v.id}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAdminToken()}`,
      },
      body: JSON.stringify({ ...v, active: !v.active }),
    });
    await fetchVacancies();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this vacancy?")) return;
    await fetch(getApiUrl(`/vacancies/${id}`), {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getAdminToken()}` },
    });
    await fetchVacancies();
  };

  if (!isLoggedIn) {
    return (
      <PageTransition>
        <div className="pt-32 pb-24 px-6 md:px-12 bg-background min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <div className="bg-card border border-border/50 rounded-2xl p-8 md:p-10 shadow-sm">
              <div className="text-center mb-8">
                <img
                  src="/logo.png"
                  alt="RayTrace"
                  className="h-10 mx-auto mb-4"
                  style={{ mixBlendMode: "multiply" }}
                />
                <h1 className="text-2xl font-serif text-foreground mb-2">
                  Admin Access
                </h1>
                <p className="text-foreground/50 text-sm">
                  Sign in to manage job vacancies
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-foreground/50 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-foreground/50 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>

                {loginError && (
                  <p className="text-red-500 text-sm text-center">
                    {loginError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-foreground text-background text-sm tracking-widest uppercase rounded-lg hover:bg-primary transition-colors disabled:opacity-50"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24 bg-background min-h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-2">
                Manage Vacancies
              </h1>
              <p className="text-foreground/50 text-sm">
                Create and manage job openings for the careers page
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-5 py-2 border border-border/50 rounded-lg text-foreground/60 text-sm hover:border-red-300 hover:text-red-500 transition-colors"
            >
              Sign Out
            </button>
          </div>

          <div className="mb-8">
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingId(null);
                setForm({
                  title: "",
                  department: "",
                  location: "",
                  type: "Full-time",
                  description: "",
                });
              }}
              className="px-6 py-3 bg-foreground text-background text-sm tracking-widest uppercase rounded-lg hover:bg-primary transition-colors"
            >
              {showForm ? "Cancel" : "+ New Vacancy"}
            </button>
          </div>

          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-10"
              >
                <form
                  onSubmit={handleSubmit}
                  className="bg-card border border-border/50 rounded-2xl p-8 space-y-5"
                >
                  <h2 className="text-xl font-serif text-foreground mb-2">
                    {editingId ? "Edit Vacancy" : "Create New Vacancy"}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-foreground/50 mb-2">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) =>
                          setForm({ ...form, title: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-foreground/50 mb-2">
                        Department
                      </label>
                      <input
                        type="text"
                        value={form.department}
                        onChange={(e) =>
                          setForm({ ...form, department: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-foreground/50 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={form.location}
                        onChange={(e) =>
                          setForm({ ...form, location: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-foreground/50 mb-2">
                        Type
                      </label>
                      <select
                        value={form.type}
                        onChange={(e) =>
                          setForm({ ...form, type: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-foreground/50 mb-2">
                      Description (optional)
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-foreground text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-foreground text-background text-sm tracking-widest uppercase rounded-lg hover:bg-primary transition-colors disabled:opacity-50"
                  >
                    {loading
                      ? "Saving..."
                      : editingId
                        ? "Update Vacancy"
                        : "Create Vacancy"}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            {vacancies.length === 0 && (
              <div className="text-center py-16 text-foreground/40">
                <p className="text-lg font-serif">No vacancies yet</p>
                <p className="text-sm mt-2">
                  Create your first job opening above
                </p>
              </div>
            )}
            {vacancies.map((v) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 md:p-8 border rounded-2xl bg-card transition-all ${v.active ? "border-border/50" : "border-border/30 opacity-60"}`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-primary text-[10px] tracking-widest uppercase">
                        {v.department}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span className="text-foreground/50 text-[10px] tracking-widest uppercase">
                        {v.type}
                      </span>
                      {!v.active && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-border" />
                          <span className="text-red-400 text-[10px] tracking-widest uppercase">
                            Inactive
                          </span>
                        </>
                      )}
                    </div>
                    <h3 className="text-xl font-serif text-foreground mb-1">
                      {v.title}
                    </h3>
                    <p className="text-foreground/50 text-sm">{v.location}</p>
                    {v.description && (
                      <p className="text-foreground/40 text-sm mt-2">
                        {v.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(v)}
                      className={`px-4 py-2 text-xs tracking-wider uppercase border rounded-lg transition-colors ${
                        v.active
                          ? "border-green-300 text-green-600 hover:bg-green-50"
                          : "border-border/50 text-foreground/50 hover:border-primary hover:text-primary"
                      }`}
                    >
                      {v.active ? "Active" : "Inactive"}
                    </button>
                    <button
                      onClick={() => handleEdit(v)}
                      className="px-4 py-2 text-xs tracking-wider uppercase border border-border/50 rounded-lg text-foreground/60 hover:border-primary hover:text-primary transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(v.id)}
                      className="px-4 py-2 text-xs tracking-wider uppercase border border-border/50 rounded-lg text-foreground/60 hover:border-red-300 hover:text-red-500 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

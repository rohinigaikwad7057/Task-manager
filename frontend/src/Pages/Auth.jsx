import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Auth = ({ initialMode = "login" }) => {
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const switchMode = (nextMode) => {
    setError("");
    setMode(nextMode);
  };

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async () => {
    setError("");

    if (!formData.email || !formData.password || (mode === "signup" && !formData.name)) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const body = mode === "login"
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

      const response = await fetch("http://localhost:5000" + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setError(data.message || "Authentication failed.");
      }
    } catch (err) {
     console.error("Server error:", err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl overflow-hidden rounded-4xl shadow-2xl ring-1 ring-white/10 bg-slate-900/90 backdrop-blur-xl md:grid md:grid-cols-[1.2fr_1fr]">
        <div className="relative overflow-hidden bg-linear-to-br from-sky-500 via-indigo-600 to-violet-700 p-10 text-white md:p-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_35%)]" />
          <div className="relative space-y-8">
            <span className="inline-flex rounded-full bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.24em] text-white/90 shadow-sm">
              Premium Access
            </span>

            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight">
                {mode === "login" ? "Welcome back" : "Create your account"}
              </h1>
              <p className="max-w-md text-slate-100/85">
                Build and manage tasks faster with a modern, premium dashboard experience. Secure login and signup are now combined into one elegant flow.
              </p>
            </div>

            <div className="grid gap-4 text-sm text-slate-100/90">
              <div className="rounded-3xl bg-white/10 p-4 shadow-lg shadow-slate-950/20">
                <p className="font-semibold">Quick access</p>
                <p className="text-slate-200/80">
                  Login instantly and jump into your task workspace with one click.
                </p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4 shadow-lg shadow-slate-950/20">
                <p className="font-semibold">Secure by design</p>
                <p className="text-slate-200/80">
                  Your credentials are sent securely to the backend and stored only in local session state.
                </p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4 shadow-lg shadow-slate-950/20">
                <p className="font-semibold">Smooth onboarding</p>
                <p className="text-slate-200/80">
                  Switch between login and signup instantly without leaving the page.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 bg-slate-950 text-slate-100">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => switchMode("login")}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${mode === "login" ? "bg-white text-slate-950" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
            >
              Login
            </button>
            <button
              onClick={() => switchMode("signup")}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${mode === "signup" ? "bg-white text-slate-950" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
            >
              Sign Up
            </button>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-7 shadow-xl shadow-slate-950/20">
            <div className="mb-6 space-y-2">
              <h2 className="text-2xl font-semibold">
                {mode === "login" ? "Sign in to your account" : "Start your premium journey"}
              </h2>
              <p className="text-sm text-slate-400">
                {mode === "login"
                  ? "Use your email and password to access the dashboard."
                  : "Create a secure account and manage your tasks like a pro."}
              </p>
            </div>

            <div className="space-y-4">
              {mode === "signup" && (
                <label className="block">
                  <span className="text-sm text-slate-300">Name</span>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={handleChange("name")}
                    placeholder="Your full name"
                    className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  />
                </label>
              )}

              <label className="block">
                <span className="text-sm text-slate-300">Email</span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleChange("email")}
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </label>

              <label className="block">
                <span className="text-sm text-slate-300">Password</span>
                <input
                  type="password"
                  value={formData.password}
                  onChange={handleChange("password")}
                  placeholder="••••••••"
                  className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </label>
            </div>

            {error && (
              <div className="mt-4 rounded-2xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-6 w-full rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Processing..." : mode === "login" ? "Login" : "Create account"}
            </button>

            <div className="mt-6 text-xs text-slate-500">
              By continuing, you agree to our <span className="text-white">Terms</span> and <span className="text-white">Privacy Policy</span>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

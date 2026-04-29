import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL;

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

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    setError("");

    if (
      !formData.email ||
      !formData.password ||
      (mode === "signup" && !formData.name)
    ) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const endpoint =
        mode === "login" ? "/api/auth/login" : "/api/auth/signup";

      const response = await fetch(BASE_URL + endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          mode === "login"
            ? {
                email: formData.email,
                password: formData.password,
              }
            : {
                name: formData.name,
                email: formData.email,
                password: formData.password,
              }
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Auth failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success(
        mode === "login"
          ? "Login successful 🎉"
          : "Account created 🚀"
      );

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Server error");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
       <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl overflow-hidden rounded-4xl shadow-2xl ring-1 ring-white/10 bg-slate-900/90 backdrop-blur-xl md:grid md:grid-cols-[1.2fr_1fr]">
        
        {/* LEFT SIDE */}
        <div className="relative overflow-hidden bg-linear-to-br from-sky-500 via-indigo-600 to-violet-700 p-10 text-white md:p-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_35%)]" />
          
          <div className="relative space-y-8">
            <span className="inline-flex rounded-full bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.24em]">
              Premium Access
            </span>

            <div className="space-y-4">
              <h1 className="text-4xl font-semibold">
                {mode === "login" ? "Welcome back" : "Create your account"}
              </h1>
              <p className="max-w-md text-slate-100/85">
                Build and manage tasks faster with a modern dashboard experience.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-8 md:p-12 bg-slate-950">

          {/* SWITCH */}
          <div className="mb-6 flex gap-3">
          <button
              onClick={() => switchMode("login")}
              className={`px-5 py-2 rounded-full text-sm font-semibold ${
                mode === "login"
                  ? "bg-white text-slate-950"
                  : "bg-slate-800 text-slate-300"
              }`}
            >
              Login
            </button>

           <button
              onClick={() => switchMode("signup")}
              className={`px-5 py-2 rounded-full text-sm font-semibold ${
                mode === "signup"
                  ? "bg-white text-slate-950"
                  : "bg-slate-800 text-slate-300"
              }`}
            >
              Sign Up
            </button>
        </div>
         <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-7">
        {mode === "signup" && (
         <input
         type="text"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange("name")}
          className="w-full mb-3 p-3 rounded-xl bg-slate-950 border border-slate-800"
        />
        )}

        <input
         type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange("email")}
          className="w-full mb-3 p-3 rounded-xl bg-slate-950 border border-slate-800"
        />

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange("password")}
           className="w-full mb-3 p-3 rounded-xl bg-slate-950 border border-slate-800"
        />

       {error && (
              <p className="text-red-400 text-sm mb-3">{error}</p>
            )}

        <button
          onClick={handleSubmit}
          disabled={loading}
           className="w-full bg-sky-500 py-3 rounded-xl text-black font-semibold disabled:opacity-50"
        >
          {loading ? "Loading..." : mode === "login" ? "Login" : "Signup"}
        </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

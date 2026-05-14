import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [activeTab, setActiveTab] = useState("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await authAPI.login({ email, password });
      const userData = response.data;
      localStorage.setItem("user", JSON.stringify(userData));

      if (userData.role === "admin") {
        navigate("/admin");
      } else if (userData.role === "doctor") {
        navigate("/doctorDashboard");
      } else if (userData.role === "patient") {
        navigate("/patientDashboard");
      } else {
        setError("Unknown role");
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: "patient", label: "Patient" },
    { key: "doctor", label: "Doctor" },
    { key: "admin", label: "Admin" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-center text-white mb-6">
            Welcome Back
          </h2>

          {error && (
            <div className="mb-4 text-center text-red-400 bg-red-900/30 border border-red-500/40 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {/* Toggle */}
          <div className="flex bg-white/10 rounded-xl p-1 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                  activeTab === tab.key
                    ? tab.key === "admin"
                      ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white"
                      : "bg-gradient-to-r from-teal-400 to-blue-500 text-white"
                    : "text-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email address"
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <div className="relative">
              <input
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-4 py-3 pr-12 rounded-xl bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 px-4 text-gray-300 hover:text-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-300">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-teal-400" />
                Remember me
              </label>
              <a href="#" className="hover:text-teal-400">
                Forgot?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white shadow-lg hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50 ${
                activeTab === "admin"
                  ? "bg-gradient-to-r from-violet-500 to-purple-600"
                  : "bg-gradient-to-r from-teal-400 to-blue-500"
              }`}
            >
              {loading ? "Signing In..." : `Sign In as ${tabs.find(t => t.key === activeTab)?.label}`}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{' '}
            <a href="/register" className="text-teal-400 hover:underline">
              Register
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

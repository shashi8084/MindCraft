import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      await API.post("/auth/signup", { name, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-slate-100 font-sans relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a]">

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[5%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-[5%] right-[-10%] w-[50%] h-[50%] bg-violet-500/20 rounded-full blur-[140px]" />
      </div>

      <div className="bg-slate-900/70 backdrop-blur-2xl border border-slate-800 p-10 rounded-[40px] shadow-2xl shadow-indigo-950/40 w-full max-w-md relative z-10">

        <h2 className="text-3xl font-black text-center text-white mb-6">
          Create Account
        </h2>

        {/* <p className="text-slate-400 text-xs text-center mb-6 uppercase tracking-widest font-bold">
          Join MindCraft
        </p> */}

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded-xl mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">

          {/* Name */}
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:border-indigo-500 outline-none text-white"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:border-indigo-500 outline-none text-white"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
              Password
            </label>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:border-indigo-500 outline-none text-white pr-12"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-indigo-400 font-semibold"
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-600 text-black rounded-xl font-black hover:opacity-90 transition shadow-xl shadow-indigo-900/40 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <p className="text-sm text-center mt-6 text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 font-bold hover:underline">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default SignUp;
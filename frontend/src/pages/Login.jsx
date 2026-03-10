import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [showResend, setShowResend] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);

      if (msg.includes("verify your email")) {
        setShowResend(true);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const res = await API.post("/auth/google", {
        name: user.displayName,
        email: user.email
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch {
      setError("Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-slate-100 font-sans relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a]">

      {/* Gradient Glow Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[5%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-[5%] right-[-10%] w-[50%] h-[50%] bg-violet-500/20 rounded-full blur-[140px]" />
      </div>

      <div className="bg-slate-900/70 backdrop-blur-2xl border border-slate-800 p-10 rounded-[40px] shadow-2xl shadow-indigo-950/40 w-full max-w-md relative z-10">

        <h2 className="text-3xl font-black text-center text-white mb-6 tracking-tight">
          Welcome Back
        </h2>

        {error && (
          <p className="text-red-400 text-sm text-center mb-4 font-bold">
            {error}
          </p>
        )}

        {showResend && (
          <div className="text-center mb-4">
            <button
              onClick={async () => {
                try {
                  const res = await API.post("/auth/resend-verification", { email });
                  setResendMsg(res.data.message);
                } catch {
                  setResendMsg("Failed to resend verification email");
                }
              }}
              className="text-indigo-400 text-sm hover:underline"
            >
              Resend verification email
            </button>

            {resendMsg && (
              <p className="text-green-400 text-sm mt-2">{resendMsg}</p>
            )}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
              Email
            </label>

            <input
              type="email"
              className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:border-indigo-500 outline-none text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
              Password
            </label>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:border-indigo-500 outline-none text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <span
                className="absolute right-3 top-3 cursor-pointer text-sm text-indigo-400 font-bold"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </span>

            </div>
          </div>

          <p className="text-sm text-right">
            <Link
              to="/forgot-password"
              className="text-indigo-400 hover:underline"
            >
              Forgot password?
            </Link>
          </p>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-600 text-black rounded-xl font-black hover:opacity-90 transition shadow-xl shadow-indigo-900/40"
          >
            Login
          </button>

          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full border border-slate-700 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

        </form>

        <p className="text-sm text-center mt-6 text-slate-400">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-indigo-400 font-bold hover:underline">
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;
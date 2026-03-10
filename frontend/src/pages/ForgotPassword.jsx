import { useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await API.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-slate-100 font-sans relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a]">

      {/* Background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[5%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-[5%] right-[-10%] w-[50%] h-[50%] bg-violet-500/20 rounded-full blur-[140px]" />
      </div>

      <div className="bg-slate-900/70 backdrop-blur-2xl border border-slate-800 p-10 rounded-[40px] shadow-2xl shadow-indigo-950/40 w-full max-w-md relative z-10">

        <h2 className="text-3xl font-black text-center text-white mb-2">
          Reset Password
        </h2>

        <p className="text-slate-400 text-xs text-center mb-6 uppercase tracking-widest font-bold">
          Receive reset link via email
        </p>

        {message && (
          <p className="text-green-400 text-sm text-center mb-4 font-bold">
            {message}
          </p>
        )}

        {error && (
          <p className="text-red-400 text-sm text-center mb-4 font-bold">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:border-indigo-500 outline-none text-white placeholder:text-slate-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-600 text-black rounded-xl font-black hover:opacity-90 transition shadow-xl shadow-indigo-900/40"
          >
            Send Reset Link
          </button>

        </form>

        <p className="text-sm text-center mt-6 text-slate-400">
          Remember your password?{" "}
          <Link to="/login" className="text-indigo-400 font-bold hover:underline">
            Back to Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default ForgotPassword;
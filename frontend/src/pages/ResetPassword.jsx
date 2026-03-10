import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await API.post("/auth/reset-password", {
        token,
        newPassword
      });

      setMessage(res.data.message);

      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError("Reset link expired or invalid");
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
          Set New Password
        </h2>

        <p className="text-slate-400 text-xs text-center mb-6 uppercase tracking-widest font-bold">
          Secure your account
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

        <form onSubmit={handleReset} className="space-y-5">

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
              New Password
            </label>

            <input
              type="password"
              placeholder="Enter new password"
              className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:border-indigo-500 outline-none text-white placeholder:text-slate-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-600 text-black rounded-xl font-black hover:opacity-90 transition shadow-xl shadow-indigo-900/40"
          >
            Reset Password
          </button>

        </form>

      </div>
    </div>
  );
}

export default ResetPassword;
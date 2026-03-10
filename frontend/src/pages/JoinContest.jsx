import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function JoinContest() {
  const [user, setUser] = useState(null);
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // FIX: Force scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/profile");
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleJoin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/contest/join", { joinCode });

      const { contestId, questions, timeLimit } = res.data;

      // store contest data temporarily
      localStorage.setItem(
        "currentContest",
        JSON.stringify({ contestId, questions, timeLimit })
      );

      navigate(`/contest/${contestId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to join contest");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans pb-20">
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a]/80 backdrop-blur-2xl border-b border-slate-800/50 h-20 flex items-center justify-between px-8">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate("/dashboard")}
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl group-hover:rotate-6 transition-transform shadow-xl shadow-indigo-900/20 italic">M</div>
          <h1 className="text-2xl font-black tracking-tight text-white">MindCraft</h1>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-indigo-600 text-white px-10 py-3 rounded-xl font-black text-s hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-900/40 active:scale-95 flex items-center gap-2 group"
        >
          <span>←</span> Dashboard
        </button>
      </div>

      {/* 🌌 Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[-5%] w-[45%] h-[45%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[45%] h-[45%] bg-violet-500/10 rounded-full blur-[100px]" />
      </div>

      <main className="max-w-7xl mx-auto px-4 pt-24 relative z-10">
        {/* 🏆 Header Section - Compact */}
        <div className="mb-8">
          <h2 className="text-3xl font-black tracking-tight mb-1 text-white">Join Contest</h2>
          <p className="text-slate-400 text-[13px] font-medium">Enter the contest using your access code.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ⚡ Left Column: Join Section - Reduced Padding */}
          <div className="lg:col-span-8">
            <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-800 p-6 md:p-8 rounded-[40px] shadow-2xl shadow-indigo-950/20">
              {/* <div className="mx-auto w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-xl shadow-indigo-900/10 italic font-black">M</div> */}
              <div className="flex items-center gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white leading-tight">Enter Code</h3>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Authorize with access code</p>
                </div>
              </div>
              
              {error && (
                <div className="mb-8 p-4 bg-red-950/30 border border-red-900/50 text-red-400 rounded-xl text-xs font-bold flex items-center justify-center gap-3 animate-shake">
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleJoin} className="space-y-14">
                <div className="relative group">
                  <div className="flex-top-5 left-2 px-4 bg-[#0f172a] text-slate-500 text-[8px] font-black uppercase tracking-widest z-20 group-focus-within:text-indigo-400 transition-colors">Contest ID</div>
                  <input
                    type="text"
                    placeholder="e.g. 8OB0AR"
                    className="w-full p-6 bg-slate-700/50 border-2 border-slate-800 rounded-[24px] focus:border-indigo-500 focus:bg-slate-800 transition-all font-black text-3xl text-center tracking-[0.3em] outline-none text-white placeholder:text-slate-900 shadow-inner"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-5 bg-indigo-600 text-black rounded-[24px] font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-900/30 active:scale-95 flex items-center justify-center gap-2 group"
                >
                  <span className="relative z-10">Join</span>
                  <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">⚔️</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                </button>
              </form>

            </div>
          </div>

          {/* 🏹 Right Column: Sidebar Section - Tightened */}
          <div className="lg:col-span-4 space-y-6">
            {/* Entry Protocol Card */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-4 rounded-[32px] shadow-sm">

              <h4 className="text-xl font-black mb-5 flex items-center gap-2 text-white">
                <span className="text-indigo-400">🛡️</span> Security Brief
              </h4>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="w-8 h-8 shrink-0 bg-indigo-900/50 border border-indigo-800/30 rounded-lg flex items-center justify-center text-indigo-400 font-bold text-xs font-black">01</div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-200 uppercase tracking-tight">Valid Code</h5>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">Exactly 6 characters shared by the Host.</p>
                  </div>
                </li>
                <li className="flex gap-3">

                  <div className="w-8 h-8 shrink-0 bg-indigo-900/50 border border-indigo-800/30 rounded-lg flex items-center justify-center text-indigo-400 font-bold text-xs font-black">02</div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-200 uppercase tracking-tight">Fair Play</h5>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">Switching tabs may result in disqualification.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Join Sequence Timeline - Compact */}
            <div className="p-6 pt-0">
              <h4 className="text-[12px] font-black text-slate-600 uppercase tracking-[0.2em] mb-6">Join Sequence</h4>
              <div className="space-y-6 relative">
                <div className="absolute left-3 top-1 bottom-1 w-0.5 bg-slate-800" />

                <div className="relative pl-10">
                  <div className="absolute left-0 w-6 h-6 rounded-full bg-indigo-600 border-2 border-[#0f172a] flex items-center justify-center text-[10px] font-black text-white shadow-sm ring-2 ring-indigo-950/50">
                    1
                  </div>
                  <p className="font-bold text-s text-white">Fill Code</p>
                </div>

                <div className="relative pl-10">
                  <div className="absolute left-0 w-6 h-6 rounded-full bg-slate-800 border-2 border-[#0f172a] flex items-center justify-center text-[8px] font-black text-slate-600 shadow-sm">
                    2
                  </div>
                  <p className="font-bold text-s text-slate-600">Sync Contest</p>
                </div>

                <div className="relative pl-10">
                  <div className="absolute left-0 w-6 h-6 rounded-full bg-slate-800 border-2 border-[#0f172a] flex items-center justify-center text-[8px] font-black text-slate-600 shadow-sm">
                    3
                  </div>
                  <p className="font-bold text-s text-slate-700">Contest Begin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shimmer { animation: shimmer 1.5s infinite; }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}} />
    </div>
  );
}

export default JoinContest;

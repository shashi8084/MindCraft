import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import copyIcon from "../assets/copy.png";
// import { countDocuments } from "../../../backend/models/Quiz";

function CreateContest() {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [timeLimit, setTimeLimit] = useState(10);
  const [error, setError] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const navigate = useNavigate();
  const [count, setCount] = useState(10);

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

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/contest/create", {
        title,
        prompt,
        timeLimit,
        count
      });
      setJoinCode(res.data.joinCode);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create contest");
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(joinCode);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans pb-20">
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a]/80 backdrop-blur-2xl border-b border-slate-800/50 h-20 flex items-center justify-between px-8">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate("/dashboard")}
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl group-hover:rotate-6 transition-transform shadow-xl shadow-indigo-900/20">M</div>
          <h1 className="text-2xl font-black tracking-tight text-white">MindCraft</h1>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-indigo-600 text-white px-10 py-3 rounded-xl font-black text-s hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-900/40 active:scale-95 flex items-center gap-2 group"
        >
          <span>←</span> Dashboard
        </button>
      </div>

      {/* 🌌 Background Decorative Elements - Slightly punchier for dark mode */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[-5%] w-[45%] h-[45%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[45%] h-[45%] bg-violet-500/10 rounded-full blur-[100px]" />
      </div>

      <main className="max-w-7xl mx-auto px-5 pt-24 relative z-10">
        {/* 🏆 Header Section */}
        <div className="mb-6">
          <h2 className="text-3xl font-black tracking-tight mb-1 text-white">Create Contest</h2>
          <p className="text-slate-400 text-[13px] font-medium">Construct a contest practice arena...</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ⚡ Left Column: Form Section */}
          <div className="lg:col-span-8">
            <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-800 p-6 md:p-8 rounded-[40px] shadow-2xl shadow-indigo-950/20">
              <div className="flex items-center gap-4 mb-6">  
                <div>
                  <h3 className="text-xl font-bold text-white leading-tight">Quiz Configuration</h3>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Set Parameters</p>
                </div>
              </div>

              {error && (
                <div className="mb-8 p-5 bg-red-950/30 border border-red-900/50 text-red-400 rounded-2xl text-sm font-bold flex items-center gap-3 animate-shake">
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">
                      Quiz Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. The Ultimate Code Challenge"
                      className="w-full p-3 bg-slate-800/50 border-2 border-transparent rounded-2xl focus:border-indigo-500 focus:bg-slate-800 transition-all font-bold outline-none text-white placeholder:text-slate-600"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  {/* Time Limit */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">
                      Time Limit (Minutes)
                    </label>
                    <input
                      type="number"
                      placeholder="10"
                      className="w-full p-3 bg-slate-800/50 border-2 border-transparent rounded-2xl focus:border-indigo-500 focus:bg-slate-800 transition-all font-bold outline-none text-white"
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(Number(e.target.value))}
                      required
                    />
                  </div>

                  {/* Question Count */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">
                      Questions
                    </label>

                    <input
                      type="number"
                      min="5"
                      max="50"
                      placeholder="10"
                      className="w-full p-3 bg-slate-800/50 border-2 border-transparent rounded-2xl focus:border-indigo-500 focus:bg-slate-800 transition-all font-bold outline-none text-white"
                      value={count}
                      onChange={(e) => setCount(Number(e.target.value))}
                      required
                    />
                  </div>

                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Topic & Instruction
                  </label>
                  <div className="relative">
                    <textarea
                      placeholder="Instruct MindCraft AI (e.g. Generate 10 Physics questions about Thermodynamics...)"
                      className="w-full p-6 bg-slate-800/50 border-2 border-transparent rounded-[32px] focus:border-indigo-500 focus:bg-slate-800 transition-all font-bold h-28 resize-none outline-none leading-relaxed text-white placeholder:text-slate-600"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {!joinCode ? (
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-indigo-600 text-black rounded-[28px] font-black text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-900/40 active:scale-95 flex items-center justify-center gap-3 group"
                  >
                    Create
                    <span className="group-hover:translate-x-2 transition-transform duration-300">🔥</span>
                  </button>
                ) : (
                  <div className="p-8 bg-indigo-600 rounded-[32px] text-white animate-slide-up shadow-2xl shadow-indigo-900/50 border border-white/10">
                    <div className="flex justify-between items-start mb-4">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Access Code Granted</p>
                      <span className="text-sm">🔑</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <p className="text-5xl font-black tracking-widest flex-1">{joinCode}</p>
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all active:scale-90"
                      >
                        <img src={copyIcon} alt="Copy" className="w-6 h-6 invert" />
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* 🏹 Right Column: Insights Section */}
          <div className="lg:col-span-4 space-y-5">
            {/* Pro Tips Card */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-5 rounded-[40px] shadow-sm">
              <h4 className="text-xl font-black mb-4 flex items-center gap-2 text-white">
                <span className="text-indigo-400">💡</span> Pro Tips
              </h4>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <div className="w-8 h-8 shrink-0 bg-indigo-900/50 border border-indigo-800/30 rounded-lg flex items-center justify-center text-indigo-400 font-bold text-xs font-black">01</div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-200 uppercase tracking-tight">Clear Context</h5>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">Mention specific topics for precise questions.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 shrink-0 bg-violet-900/50 border border-violet-800/30 rounded-lg flex items-center justify-center text-violet-400 font-bold text-xs font-black">02</div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-200 uppercase tracking-tight">Time Strategy</h5>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">An average of 1 minute per question is ideal.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 shrink-0 bg-violet-900/50 border border-violet-800/30 rounded-lg flex items-center justify-center text-violet-400 font-bold text-xs font-black">03</div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-200 uppercase tracking-tight">Fast Sharing</h5>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">Copy the code and share it in your group.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Battle Prep Timeline */}
            <div className="p-3">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Contest Pipeline</h4>
              <div className="space-y-5 relative">
                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-800" />

                <div className="relative pl-12">
                  <div className={`absolute left-0 w-8 h-8 rounded-full border-4 border-[#0f172a] flex items-center justify-center text-[10px] font-black shadow-sm ${!joinCode ? 'bg-indigo-600 text-white ring-4 ring-indigo-950/50' : 'bg-emerald-500 text-white'}`}>
                    {!joinCode ? '1' : '✓'}
                  </div>
                  <p className={`font-bold text-[13px] ${!joinCode ? 'text-white' : 'text-emerald-400'}`}>Configure Quiz</p>
                  <p className="text-[10px] text-slate-600 font-bold uppercase mt-1 tracking-tight">{!joinCode ? 'Active In Progress' : 'Ready to Launch'}</p>
                </div>

                <div className="relative pl-12">
                  <div className={`absolute left-0 w-8 h-8 rounded-full border-4 border-[#0f172a] flex items-center justify-center text-[10px] font-black shadow-sm ${joinCode ? 'bg-indigo-600 text-white ring-4 ring-indigo-950/50' : 'bg-slate-800 text-slate-600'}`}>
                    2
                  </div>
                  <p className={`font-bold text-[13px] ${joinCode ? 'text-white' : 'text-slate-600'}`}>Generate Code</p>
                </div>

                <div className="relative pl-12">
                  <div className="absolute left-0 w-8 h-8 rounded-full bg-slate-800 border-4 border-[#0f172a] flex items-center justify-center text-[10px] font-black text-slate-600 shadow-sm">
                    3
                  </div>
                  <p className="font-bold text-[13px] text-slate-700">Share Code</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.5s ease-out forwards; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}} />
    </div>
  );
}

export default CreateContest;

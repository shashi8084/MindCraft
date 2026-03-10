import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [count, setCount] = useState(5);
  const [timeLimit, setTimeLimit] = useState(10); // minutes
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // 🔹 Fetch profile
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

  // 🔹 Prompt validation
  const isValidSubject = (text) => {
    if (!text || text.trim().length < 3) return false;

    const badPatterns = [/^generate$/i, /^quiz$/i, /^questions$/i];
    return !badPatterns.some((p) => p.test(text.trim()));
  };

  // 🔥 FINAL FIXED GENERATE FUNCTION
  const handleGenerateQuiz = async () => {
    setError("");

    // Validations
    if (!isValidSubject(prompt)) {
      setError("Please enter a valid subject (e.g. Basic Maths, Java OOP)");
      return;
    }

    if (count < 1 || count > 30) {
      setError("Number of questions must be between 1 and 30");
      return;
    }

    if (timeLimit < 1 || timeLimit > 120) {
      setError("Time limit must be between 1 and 120 minutes");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/quiz/generate", {
        prompt,
        difficulty,
        count,
        timeLimit,
      });

      const { quizId, questions, timeLimit: limit, startedAt } = res.data;

      // Store quiz for attempt page
      localStorage.setItem(
        "currentQuiz",
        JSON.stringify({
          quizId,
          questions,
          timeLimit: limit,
          startedAt,
        })
      );

      navigate(`/quiz/${quizId}`);
    } catch (err) {
      console.error("Generate quiz error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans pb-20">
      <Navbar user={user} />

      {/* 🌌 Background Decorative Elements - Slightly punchier for dark mode */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[-5%] w-[45%] h-[45%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[45%] h-[45%] bg-violet-500/10 rounded-full blur-[100px]" />
      </div>

      <main className="max-w-7xl mx-auto px-6 pt-24 relative z-10">
        {/* 👋 Header Section */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl font-black tracking-tight mb-2 text-white">
                Welcome back, <span className="text-indigo-400">{user?.name}</span>!
              </h2>
              <p className="text-slate-400 text-lg">
                Ready to craft your quiz. . . .
              </p>
            </div>

            {/* 📊 Quick Stats */}
            <div className="flex gap-4">
              <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-4 rounded-2xl shadow-sm min-w-[140px]">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Highest Score</p>
                <p className="text-2xl font-black text-indigo-400">{user?.highestScore || 0}</p>
              </div>
              {/* <div className="bg-white/60 backdrop-blur-md border border-white p-4 rounded-2xl shadow-sm min-w-[140px]">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Account Type</p>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${user?.role === 'admin' ? 'bg-amber-400' : 'bg-green-400'}`} />
                  <p className="text-lg font-bold capitalize">{user?.role || 'Guest'}</p>
                </div>
              </div> */}
            </div>
          </div>
        </header>

        {/* 🪄 Magic AI Section */}
        <section className="mb-12">
          <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-800 p-8 rounded-[32px] shadow-2xl shadow-indigo-950/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-900/20">✨</div>
              <h3 className="text-2xl font-bold text-white">Generate Quiz</h3>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-950/30 border border-red-900/50 text-red-400 rounded-xl text-sm font-medium flex items-center gap-2">
                ⚠️ {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-1">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Topic</label>
                <input
                  type="text"
                  placeholder="e.g. Modern History, Python Basics..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full p-4 bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-white placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full p-4 bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium appearance-none cursor-pointer text-white"
                >
                  <option value="easy" className="bg-[#0f172a]">Easy</option>
                  <option value="medium" className="bg-[#0f172a]">Medium</option>
                  <option value="hard" className="bg-[#0f172a]">Hard</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Questions</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className="w-full p-4 bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-white placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Time (m)</label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                    className="w-full p-4 bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-white placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleGenerateQuiz}
                  disabled={loading}
                  className="w-full p-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xl shadow-indigo-900/40 active:scale-95"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </span>
                  ) : "Create Quiz"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 🎮 Activity Hub */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* View History */}
          <div
            onClick={() => navigate("/history")}
            className="group bg-slate-900/60 backdrop-blur-2xl border border-slate-800 p-8 rounded-[32px] shadow-sm hover:shadow-2xl hover:shadow-indigo-950/40 transition-all cursor-pointer transform hover:-translate-y-2"
          >
            <div className="w-16 h-16 bg-blue-950/30 text-blue-400 rounded-2xl flex items-center justify-center text-3xl mb-12 group-hover:scale-110 transition-transform border border-blue-900/30 shadow-inner">📄</div>
            <div>
              <h3 className="text-2xl font-bold mb-2 text-white">My History</h3>
              <p className="text-slate-400 mb-6 font-medium">Review your past performance and answers.</p>
              <div className="flex items-center gap-2 text-amber-400 font-bold group-hover:translate-x-2 transition-transform">
                Browse Archive <span>→</span>
              </div>
            </div>
          </div>

          {/* Create Contest */}
          <div
            onClick={() => navigate("/create-contest")}
            className="group bg-slate-900/60 backdrop-blur-2xl border border-slate-800 p-8 rounded-[32px] shadow-sm hover:shadow-2xl hover:shadow-violet-950/40 transition-all cursor-pointer transform hover:-translate-y-2"
          >
            <div className="w-16 h-16 bg-violet-950/30 text-violet-400 rounded-2xl flex items-center justify-center text-3xl mb-12 group-hover:scale-110 transition-transform border border-violet-900/30 shadow-inner">✏️</div>
            <div>
              <h3 className="text-2xl font-bold mb-2 text-white">Host Contest</h3>
              <p className="text-slate-400 mb-6 font-medium">Create a private contest for your friends.</p>
              <div className="flex items-center gap-2 text-amber-400 font-bold group-hover:translate-x-2 transition-transform">
                Start Hosting <span>→</span>
              </div>
            </div>
          </div>

          {/* Join Contest */}
          <div
            onClick={() => navigate("/join-contest")}
            className="group bg-slate-900/60 backdrop-blur-2xl border border-slate-800 p-8 rounded-[32px] shadow-sm hover:shadow-2xl hover:shadow-amber-950/40 transition-all cursor-pointer transform hover:-translate-y-2"
          >
            <div className="w-16 h-16 bg-amber-950/30 text-amber-400 rounded-2xl flex items-center justify-center text-3xl mb-12 group-hover:scale-110 transition-transform border border-amber-900/30 shadow-inner">🏆</div>
            <div>
              <h3 className="text-2xl font-bold mb-2 text-white">Enter Contest</h3>
              <p className="text-slate-400 mb-6 font-medium">Join an existing contest via invite code.</p>
              <div className="flex items-center gap-2 text-amber-400 font-bold group-hover:translate-x-2 transition-transform">
                Join Contest <span>→</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;

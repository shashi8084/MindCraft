import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function GenerateQuiz() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // FIX: Force scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/quiz/generate", { prompt });

      const { quizId, questions, timeLimit, startedAt } = res.data;

      // Store quiz temporarily in localStorage
      localStorage.setItem("currentQuiz", JSON.stringify({
        quizId,
        questions,
        timeLimit,
        startedAt
      }));


      navigate(`/quiz/${quizId}`);
    } catch (err) {
      console.log(err);
      alert("Failed to generate quiz");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans pb-20 flex justify-center items-center relative overflow-hidden">
      {/* 🌌 Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[-5%] w-[45%] h-[45%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[45%] h-[45%] bg-violet-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-800 p-8 md:p-10 rounded-[40px] shadow-2xl shadow-indigo-950/20 w-full max-w-xl relative z-10 mx-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-indigo-900/20">✨</div>
          <div>
            <h2 className="text-3xl font-black tracking-tight text-white leading-tight">Neural Generator</h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">AI-Powered Question Synthesis</p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Instruction Prompt</label>
            <div className="relative">
              <textarea
                placeholder="e.g. Generate 10 Physics questions about Thermodynamics with expert difficulty..."
                className="w-full p-6 bg-slate-800/50 border-2 border-transparent rounded-[32px] focus:border-indigo-500 focus:bg-slate-800 transition-all font-bold h-40 resize-none outline-none leading-relaxed text-white placeholder:text-slate-600"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-5 bg-indigo-600 text-black rounded-[28px] font-black text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-900/40 active:scale-95 flex items-center justify-center gap-3 group"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <svg className="animate-spin h-6 w-6 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Synthesizing...
              </span>
            ) : (
              <>
                Ignite Catalyst
                <span className="group-hover:translate-x-2 transition-transform duration-300">⚡</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default GenerateQuiz;

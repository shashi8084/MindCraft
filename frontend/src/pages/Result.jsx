import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;

  // Force scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Redirect if page refreshed or no state available
  useEffect(() => {
    if (!data) {
      navigate("/dashboard");
    }
  }, [data, navigate]);

  if (!data) return null;

  const percentage = Math.round((data.score / data.total) * 100);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans flex justify-center items-center relative overflow-hidden">
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a]/80 backdrop-blur-2xl border-b border-slate-800/50 h-20 flex items-center justify-between px-8">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate("/dashboard")}
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl group-hover:rotate-6 transition-transform shadow-xl shadow-indigo-900/20 italic">M</div>
          <h1 className="text-2xl font-black tracking-tight text-white">MindCraft</h1>
        </div>
      </div>
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[-5%] w-[45%] h-[45%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[45%] h-[45%] bg-violet-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-800 p-8 md:p-10 rounded-[40px] shadow-2xl shadow-indigo-950/20 w-full max-w-md relative z-10 mx-6 text-center">

        <div className="w-20 h-20 bg-indigo-600/20 border border-indigo-500/30 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-indigo-500/10 shadow-inner">
          🎉
        </div>

        <h2 className="text-4xl font-black tracking-tight text-white mb-2">
          Quiz Complete
        </h2>

        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-8">
          Performance Summary
        </p>

        {/* Score */}
        <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-[32px] mb-6">
          <p className="text-slate-400 font-bold mb-1">Final Score</p>

          <div className="flex items-center justify-center gap-2">
            <span className="text-5xl font-black text-indigo-400 tracking-tighter">
              {data.score}
            </span>

            <span className="text-2xl font-bold text-slate-600">
              / {data.total}
            </span>
          </div>

          <p className="mt-2 text-indigo-400 font-bold">{percentage}% Accuracy</p>
        </div>

        {/* Answer Key */}
        <div className="text-left mb-8 px-2">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            Answer Key
          </h3>

          <ul className="space-y-3">
            {Array.isArray(data.correctAnswers) &&
              data.correctAnswers.map((ans, index) => (
                <li key={index} className="flex gap-3 text-sm">
                  <span className="text-indigo-400 font-bold">
                    {index + 1}.
                  </span>
                  <span className="text-slate-300 font-medium">{ans}</span>
                </li>
              ))}
          </ul>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full py-4 bg-indigo-600 text-black rounded-[24px] font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-900/40 active:scale-95 flex items-center justify-center gap-3 group"
        >
          Back to Dashboard
          <span className="group-hover:translate-x-2 transition-transform duration-300">
            🏠
          </span>
        </button>

      </div>
    </div>
  );
}

export default Result;
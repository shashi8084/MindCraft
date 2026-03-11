import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function QuizReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);

  // FIX: Force scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await API.get(`/quiz/${id}/review`);
        setQuiz(res.data);
      } catch {
        navigate("/history");
      }
    };

    fetchReview();
  }, [id, navigate]);

  if (!quiz) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-slate-500 font-black text-xs uppercase tracking-widest">Reconstructing Attempt...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172f] text-slate-100 font-sans pb-20 pt-28">
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a]/80 backdrop-blur-2xl border-b border-slate-800/50 h-20 flex items-center justify-between px-8">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate("/dashboard")}
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl group-hover:rotate-6 transition-transform shadow-xl shadow-indigo-900/20 italic">M</div>
          <h1 className="text-2xl font-black tracking-tight text-white">MindCraft</h1>
        </div>
      </div>
      {/* 🌌 Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[-5%] w-[45%] h-[45%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[45%] h-[45%] bg-violet-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 px-4">
        <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-800 p-8 md:p-10 rounded-[40px] shadow-2xl shadow-indigo-950/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-white leading-tight">Review</h2>
              <p className="text-slate-500 text-[15px] font-bold uppercase tracking-widest mt-1">Topic: {quiz.prompt}</p>
            </div>
          </div>

          <div className="space-y-10">
            {quiz.questions.map((q, index) => {
              const userAnswer = quiz.userAnswers?.[index];

              return (
                <div key={index} className="space-y-4">
                  <div className="flex gap-4">
                    <span className="w-8 h-8 shrink-0 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center text-slate-400 font-black text-xs">
                      {index + 1 < 10 ? `0${index + 1}` : index + 1}
                    </span>
                    <h3 className="text-lg font-bold text-slate-200 leading-relaxed">
                      {q.question}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-12">
                    {q.options.map((opt, i) => {
                      let style = "bg-slate-800/40 border-slate-700/50 text-slate-400";
                      let icon = null;

                      // ✅ Correct answer
                      if (opt === q.correctAnswer) {
                        style = "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 ring-1 ring-emerald-500/20";
                        icon = "✅";
                      }

                      // ❌ Wrong selected answer
                      if (
                        userAnswer !== undefined &&
                        userAnswer !== "" &&
                        opt === userAnswer &&
                        userAnswer !== q.correctAnswer
                      ) {
                        style = "bg-rose-500/20 border-rose-500/50 text-rose-400 ring-1 ring-rose-500/20";
                        icon = "❌";
                      }

                      return (
                        <div
                          key={i}
                          className={`p-4 rounded-2xl border flex items-center justify-between gap-4 font-bold text-sm ${style}`}
                        >
                          <span>{opt}</span>
                          {icon && <span className="text-xs">{icon}</span>}
                        </div>
                      );
                    })}
                  </div>

                  {(userAnswer === undefined || userAnswer === "") && (
                    <p className="pl-12 text-amber-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <span>⚠️</span> Not Attempted
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800 flex justify-center">
            <button
              onClick={() => navigate("/history")}
              className="px-10 py-4 bg-indigo-600 text-black rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-900/40 active:scale-95 flex items-center gap-2 group"
            >
              <span>←</span> Back to History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  协同
}

export default QuizReview;

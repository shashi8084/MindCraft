import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function History() {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get("/quiz/my-quizzes");
        setQuizzes(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    
    fetchHistory();
  }, []);

  const handleDelete = async (quizId) => {
    try {
      await API.delete(`/quiz/${quizId}`);
      setQuizzes(prev => prev.filter(q => q._id !== quizId));
      setDeleteId(null);
    } catch {
      alert("Failed to delete quiz");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans pb-20">
      {/* 🔹 Fixed Navbar for History - Compact Dark & Glass */}
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
        <div className="absolute top-[10%] left-[5%] w-[35%] h-[35%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[45%] h-[45%] bg-violet-500/10 rounded-full blur-[140px]" />
      </div>

      <main className="max-w-4xl mx-auto px-6 pt-28 relative z-10">
        <div className="mb-10">
          <h2 className="text-3xl font-black tracking-tight mb-2 text-white">History</h2>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest text-[10px]">Tracking your journey through the past records.</p>
        </div>

        {quizzes.length === 0 ? (
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-16 rounded-[40px] text-center shadow-2xl">
            <div className="text-5xl mb-4">🏜️</div>
            <p className="text-slate-400 font-black text-xl mb-6">The archive is empty.</p>
            <button 
              onClick={() => navigate("/dashboard")}
              className="px-8 py-4 bg-indigo-600 text-white rounded-[20px] font-black text-base hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-900/40"
            >
              Start First Quest
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {quizzes.map((quiz) => (
              <div 
                key={quiz._id} 
                className="group bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-6 rounded-[32px] shadow-2xl shadow-indigo-950/20 hover:shadow-indigo-500/10 hover:border-indigo-500/40 transition-all duration-500 transform hover:-translate-y-1.5"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => navigate(`/quiz-review/${quiz._id}`)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-indigo-950/50 text-indigo-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-indigo-900/30">
                        {quiz.difficulty || 'Normal'}
                      </span>
                      <span className="text-slate-700 font-black">/</span>
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                        {new Date(quiz.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors capitalize leading-relaxed">
                      {quiz.prompt}
                    </h3>
                  </div>

                  <div className="flex items-center gap-8 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-800">
                    <div className="text-right">
                       <p className="text-3xl font-black text-white leading-none tracking-tighter">
                        {quiz.score ?? 0}
                      </p>
                      <p className="text-[9px] font-black text-slate-600 uppercase mt-1.5 tracking-widest">Score</p>
                    </div>

                    <div className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                      quiz.completed 
                        ? "bg-emerald-950/30 text-emerald-400 border-emerald-900/50" 
                        : "bg-amber-950/30 text-amber-400 border-amber-900/50"
                    }`}>
                      {quiz.completed ? "Completed" : "Not Completed" }
                    </div>

                    {deleteId === quiz._id ? (
                      <div className="flex items-center gap-3 animate-slide-left">
                        <button
                          onClick={() => handleDelete(quiz._id)}
                          className="bg-red-600/90 text-white px-5 py-2.5 rounded-lg text-[10px] font-black hover:bg-red-700 transition-all"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setDeleteId(null)}
                          className="text-slate-500 text-[10px] font-black hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteId(quiz._id); }}
                        className="p-3 bg-slate-800/40 text-slate-600 hover:text-red-400 hover:bg-red-950/20 rounded-xl transition-all"
                        title="Delete record"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slide-left {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-left { animation: slide-left 0.3s ease-out; }
      `}} />
    </div>
  );
}

export default History;

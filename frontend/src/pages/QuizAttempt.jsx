import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function QuizAttempt() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);

  const isSubmitted = useRef(false);

  // FIX: Force scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 🔹 STEP 0: If quiz already submitted (reload case) → go to result
  useEffect(() => {
    const checkSubmitted = async () => {
      try {
        const res = await API.get(`/quiz/${id}/review`);

        if (res.data?.userAnswers && res.data.userAnswers.length > 0) {
          navigate("/result", {
            state: {
              score: res.data.userAnswers.filter(
                (a, i) => a === res.data.questions[i].correctAnswer
              ).length,
              total: res.data.questions.length,
              correctAnswers: res.data.questions.map(q => q.correctAnswer)
            }
          });
        }
      } catch {
        // not submitted yet → continue attempt
      }
    };

    checkSubmitted();
  }, [id, navigate]);

  // 🔹 Load quiz & timer (UNCHANGED)
  useEffect(() => {
    const storedQuiz = JSON.parse(localStorage.getItem("currentQuiz"));

    if (!storedQuiz || storedQuiz.quizId !== id) {
      return; // ⛔ DO NOT redirect here anymore
    }

    setQuestions(storedQuiz.questions);
    setAnswers(new Array(storedQuiz.questions.length).fill(""));

    const start = new Date(storedQuiz.startedAt).getTime();
    const limit = storedQuiz.timeLimit * 1000; // ❗ untouched

    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor((start + limit - Date.now()) / 1000)
      );

      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        autoSubmit();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [id]);

  // 🔥 AUTO-SUBMIT ON RELOAD / TAB CLOSE (UNCHANGED)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!isSubmitted.current) {
        navigator.sendBeacon(
          "http://localhost:5000/api/quiz/submit",
          JSON.stringify({
            quizId: id,
            answers
          })
        );
        isSubmitted.current = true;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () =>
      window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [answers, id]);

  const handleOptionSelect = (qIndex, option) => {
    setAnswers(prev => {
      const copy = [...prev];
      copy[qIndex] = option;
      return copy;
    });
  };

  const handleSubmit = async () => {
    if (isSubmitted.current) return;
    isSubmitted.current = true;

    try {
      const res = await API.post("/quiz/submit", {
        quizId: id,
        answers
      });

      localStorage.removeItem("currentQuiz");
      navigate("/result", { state: res.data });
    } catch {
      navigate("/dashboard");
    }
  };

  const autoSubmit = async () => {
    if (isSubmitted.current) return;
    isSubmitted.current = true;

    try {
      const res = await API.post("/quiz/submit", {
        quizId: id,
        answers
      });

      localStorage.removeItem("currentQuiz");
      navigate("/result", { state: res.data });
    } catch {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans pb-20 pt-28">
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
              <h2 className="text-3xl font-black tracking-tight text-white leading-tight">Attempt Quiz</h2>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Single Player Arena</p>
            </div>

            {/* ⏱ Timer */}
            <div className="px-6 py-3 bg-red-950/30 border border-red-900/50 rounded-2xl flex items-center gap-3 shadow-lg shadow-red-900/10">
              <span className="text-red-400 text-lg">⏱️</span>
              <span className="text-xl font-black text-red-400 tracking-tighter">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")} min
              </span>
            </div>
          </div>

          <div className="space-y-8">
            {questions.map((q, index) => (
              <div key={index} className="space-y-4">
                <div className="flex gap-4">
                  <span className="w-8 h-8 shrink-0 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xs">
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </span>
                  <h3 className="text-lg font-bold text-slate-200 leading-relaxed">
                    {q.question}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-12">
                  {q.options.map((option, i) => (
                    <label
                      key={i}
                      className={`relative group cursor-pointer transition-all ${answers[index] === option
                          ? 'ring-2 ring-indigo-500 bg-indigo-900/20'
                          : 'bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50'
                        } p-4 rounded-2xl flex items-center gap-4`}
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        checked={answers[index] === option}
                        onChange={() => handleOptionSelect(index, option)}
                        className="hidden"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${answers[index] === option
                          ? 'border-indigo-400 bg-indigo-400'
                          : 'border-slate-600 group-hover:border-slate-500'
                        }`}>
                        {answers[index] === option && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <span className={`font-bold text-sm transition-colors ${answers[index] === option ? 'text-white' : 'text-slate-400'
                        }`}>
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800">
            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-indigo-600 text-black rounded-[24px] font-black text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-900/40 active:scale-95 flex items-center justify-center gap-3 group"
            >
              Submit Quiz
              <span className="group-hover:translate-x-2 transition-transform duration-300">🔥</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizAttempt;
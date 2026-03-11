import { useNavigate } from "react-router-dom";
import { useState } from "react";

function LandingPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-indigo-500/30 relative overflow-hidden">

      {/* 🌌 Background Gradient Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[5%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-[5%] right-[-10%] w-[50%] h-[50%] bg-violet-500/20 rounded-full blur-[140px]" />
      </div>

      {/* 🔹 Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a]/70 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-xl shadow-indigo-900/40">
              M
            </div>

            <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              MindCraft
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">

            <button
              onClick={() => navigate("/login")}
              className="text-slate-400 font-medium hover:text-indigo-400 transition-colors"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="bg-gradient-to-r from-indigo-500 to-violet-600 text-black px-6 py-2.5 rounded-full font-semibold hover:opacity-90 transition-all shadow-xl shadow-indigo-900/40 active:scale-95"
            >
              Join Free
            </button>

          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-slate-300 text-2xl"
          >
            ☰
          </button>

        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#0f172a] border-t border-slate-800 px-6 py-6 flex flex-col gap-4">

            <button
              onClick={() => navigate("/login")}
              className="text-slate-300 font-semibold hover:text-indigo-400"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="bg-gradient-to-r from-indigo-500 to-violet-600 text-black py-2 rounded-xl font-semibold"
            >
              Join Free
            </button>

          </div>
        )}
      </nav>

      {/* 🚀 Hero Section */}
      <section className="pt-40 pb-20 px-6 relative z-10">

        <div className="max-w-5xl mx-auto text-center">

          {/* <div className="inline-block px-4 py-1.5 mb-6 bg-indigo-900/40 border border-indigo-700 rounded-full text-indigo-400 text-sm font-bold tracking-wide uppercase animate-fade-in">
            ✨ Powered by Google Gemini AI
          </div> */}

          <h2 className="text-6xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
            Master Any Topic with <br />
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              AI-Powered
            </span>{" "}
            Learning
          </h2>

          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Generate custom quizzes instantly, participate in real-time contests,
            and track your progress on this platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

            <button
              onClick={() => navigate("/signup")}
              className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-black rounded-2xl font-bold text-lg hover:opacity-90 transition-all transform hover:-translate-y-1 active:scale-95 shadow-xl shadow-indigo-900/40"
            >
              Get Started for Free
            </button>

            <button
              onClick={() => window.scrollTo({ top: 500, behavior: "smooth" })}
              className="w-full sm:w-auto px-10 py-4 bg-slate-900 border border-slate-700 text-slate-300 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all transform hover:-translate-y-1 active:scale-95"
            >
              Explore Features
            </button>

          </div>
        </div>
      </section>

      {/* 📦 Feature Cards */}
      <section className="py-20 px-6 relative z-10">

        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="bg-slate-900/60 backdrop-blur-xl p-10 rounded-3xl border border-slate-800 hover:border-indigo-500/40 shadow-lg transition-all duration-300 group">

              <div className="w-14 h-14 bg-indigo-900/40 text-indigo-400 rounded-2xl flex items-center justify-center text-2xl mb-8 group-hover:scale-110 transition-transform">
                🤖
              </div>

              <h3 className="text-2xl font-bold mb-4 text-white">
                Neural Generation
              </h3>

              <p className="text-slate-400 leading-relaxed">
                Our Gemini-powered engine creates contextual, high-quality MCQs
                on any subject you can imagine.
              </p>

            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl p-10 rounded-3xl border border-slate-800 hover:border-indigo-500/40 shadow-lg transition-all duration-300 group">

              <div className="w-14 h-14 bg-indigo-900/40 text-indigo-400 rounded-2xl flex items-center justify-center text-2xl mb-8 group-hover:scale-110 transition-transform">
                🏆
              </div>

              <h3 className="text-2xl font-bold mb-4 text-white">
                Host Contests
              </h3>

              <p className="text-slate-400 leading-relaxed">
                Host live contests with other players. So they can compete for the top
                spot on our leaderboard.
              </p>

            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl p-10 rounded-3xl border border-slate-800 hover:border-indigo-500/40 shadow-lg transition-all duration-300 group">

              <div className="w-14 h-14 bg-indigo-900/40 text-indigo-400 rounded-2xl flex items-center justify-center text-2xl mb-8 group-hover:scale-110 transition-transform">
                📊
              </div>

              <h3 className="text-2xl font-bold mb-4 text-white">
                Analytics Engine
              </h3>

              <p className="text-slate-400 leading-relaxed">
                Track your learning curve with detailed history and score
                analysis. Visualize your mastery level.
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* 🛡️ Trust Section */}
      <section className="py-24 px-6 text-center relative z-10">

        <div className="max-w-3xl mx-auto">

          <h2 className="text-4xl font-black mb-8 text-white">
            Ready to craft your mind?
          </h2>

          <p className="text-slate-400 mb-12 text-lg">
            Join thousands of learners who are already using MindCraft to
            accelerate their knowledge acquisition.
          </p>

          <button
            onClick={() => navigate("/signup")}
            className="px-12 py-5 bg-gradient-to-r from-indigo-500 to-violet-600 text-black rounded-2xl font-bold text-xl hover:opacity-90 transition-all shadow-xl shadow-indigo-900/40 active:scale-95"
          >
            Create Your Account
          </button>

        </div>

      </section>

      {/* 🏮 Footer */}
      <footer className="py-12 border-t border-slate-800 px-6 relative z-10">

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">

          <div className="flex items-center gap-2">
            <span className="font-bold text-indigo-400">MindCraft</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500 text-sm">
              © 2026 All rights reserved.
            </span>
          </div>

          <div className="flex gap-8 text-sm font-medium text-slate-500">
            {/* <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a> */}
          </div>

        </div>

      </footer>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `
      }} />

    </div>
  );
}

export default LandingPage;
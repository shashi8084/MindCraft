import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import socket from "../services/socket";


function ContestLeaderboard() {
  const { contestId } = useParams();
  const navigate = useNavigate();

  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  // FIX: Force scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await API.get(`/contest/leaderboard/${contestId}`);
        setLeaderboard(res.data);
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();

    socket.emit("joinContestRoom", contestId);

    socket.on("leaderboardUpdate", (data) => {
      setLeaderboard(data);
      setLoading(false);
    });

    return () => {
      socket.off("leaderboardUpdate");
    };
  }, [contestId]);


  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-slate-500 font-black text-xs uppercase tracking-widest">Gathering Rankings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans pb-20 pt-28">
      {/* 🌌 Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[-5%] w-[45%] h-[45%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[45%] h-[45%] bg-violet-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10 px-6">
        <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-800 p-8 md:p-10 rounded-[40px] shadow-2xl shadow-indigo-950/20">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black tracking-tight text-white flex items-center justify-center gap-3">
              Arena Ranks <span className="text-3xl">🏆</span>
            </h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">Real-time Contest Leaderboard</p>
          </div>

          {leaderboard.length === 0 ? (
            <div className="py-20 text-center bg-slate-800/20 rounded-3xl border border-slate-800/50">
              <span className="text-4xl block mb-4">🏜️</span>
              <p className="text-slate-400 font-bold">No submissions yet.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-slate-800">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    <th className="p-5">Rank</th>
                    <th className="p-5">Warrior</th>
                    <th className="p-5 text-right">Performance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {leaderboard.map((player, index) => (
                    <tr
                      key={index}
                      className={`group transition-colors ${player.rank === 1
                          ? "bg-amber-500/10 hover:bg-amber-500/15"
                          : "hover:bg-slate-800/30"
                        }`}
                    >
                      <td className="p-5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${player.rank === 1 ? 'bg-amber-500 text-black' :
                            player.rank === 2 ? 'bg-slate-300 text-black' :
                              player.rank === 3 ? 'bg-orange-400 text-black' :
                                'bg-slate-800 text-slate-400'
                          }`}>
                          {player.rank}
                        </div>
                      </td>
                      <td className="p-5">
                        <p className="font-bold text-white group-hover:text-indigo-400 transition-colors">{player.name}</p>
                      </td>
                      <td className="p-5 text-right">
                        <span className="text-xl font-black text-white tracking-tighter">{player.score}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-10 pt-8 border-t border-slate-800 flex justify-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-10 py-4 bg-indigo-600 text-black rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-900/40 active:scale-95 flex items-center gap-2 group"
            >
              <span>←</span> Return to Base
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContestLeaderboard;

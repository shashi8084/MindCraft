import { useNavigate } from "react-router-dom";

function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-20 bg-[#0f172a]/80 backdrop-blur-2xl border-b border-slate-800/50 flex items-center justify-between px-8 transition-all">
      <div 
        className="flex items-center gap-3 cursor-pointer group" 
        onClick={() => navigate(user ? "/dashboard" : "/")}
      >
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:rotate-6 transition-transform shadow-xl shadow-indigo-900/20">M</div>
        <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-500 to-violet-400 bg-clip-text text-transparent">MindCraft</h1>
      </div>

      <div className="flex items-center gap-6">
        {!user && (
          <button 
            onClick={() => navigate("/login")}
            className="text-slate-400 font-bold hover:text-indigo-400 transition-colors px-3 py-2"
          >
            Login
          </button>
        )}
        
        {user && (
          <div className="flex items-center gap-4 bg-slate-800/50 p-1.5 pr-4 rounded-full border border-slate-700 shadow-inner">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-lg">
              {user?.name?.charAt(0)}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-bold text-slate-100 leading-none">{user?.name}</p>
              {/* <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mt-1">{user?.role}</p> */}
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="bg-slate-100 text-slate-900 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-white transition-all shadow-md active:scale-95"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

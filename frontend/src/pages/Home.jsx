import { useState, useEffect } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Search } from "lucide-react";

const Home = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await api.get("/users");
        setUsers(res.data.filter(u => u._id !== currentUser._id));
      } catch (err) {
        console.error("Kullanıcılar getirilemedi:", err);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) fetchUsers();
  }, [currentUser]);

  const filteredUsers = users.filter((u) => u.username.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="w-full h-full p-4 md:p-12 overflow-y-auto custom-scrollbar bg-slate-50/30 overflow-x-hidden">
      <div className="max-w-4xl mx-auto w-full">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div>
             <h1 className="text-4xl md:text-5xl font-black text-slate-800 italic uppercase tracking-tighter mb-2">Keşfet</h1>
             <p className="text-[10px] md:text-sm font-bold text-slate-400 uppercase flex items-center gap-2">
                <Sparkles size={16} className="text-[#FFB347]" /> İnsanları bul
             </p>
           </div>
           <div className="relative w-full md:w-72">
             <input 
               type="text" 
               placeholder="Kullanıcı ara..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-6 pr-4 py-4 bg-white border-none rounded-full shadow-sm focus:ring-2 focus:ring-[#FFB347]/30 text-slate-700 font-bold placeholder:text-slate-300"
             />
           </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence>
            {loading ? (
              /* SKELETON LOADING: Veri gelene kadar gösterilen sahte kartlar */
              [...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/50 p-8 rounded-[3rem] h-64 animate-pulse flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 bg-slate-200 rounded-full"></div>
                  <div className="w-24 h-4 bg-slate-200 rounded-full"></div>
                </div>
              ))
            ) : (
              filteredUsers.map(u => (
                <motion.div key={u._id} initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}>
                  <Link to={`/profile/${u._id}`}>
                    <div className="bg-white p-8 rounded-[3rem] shadow-sm hover:shadow-xl transition-all group h-full flex flex-col border border-slate-50">
                      <div className="flex items-center gap-4 mb-6">
                        {u.profilePicture ? (
                          <img src={u.profilePicture} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-transparent group-hover:border-[#FF9B9B]/50 transition-all" />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 font-black text-xl group-hover:bg-[#FF9B9B] group-hover:text-white transition-all">
                            {u.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="overflow-hidden">
                          <h2 className="font-bold text-lg text-slate-800 truncate">{u.username}</h2>
                          <p className="text-[9px] bg-slate-50 text-slate-400 px-2 py-0.5 rounded-full uppercase font-black">{u.followers?.length || 0} Takipçi</p>
                        </div>
                      </div>
                      <div className="flex-1 mb-6">
                        {u.previewPost ? (
                          <div className="pl-3 border-l-2 border-[#FFB347]">
                             <p className="text-[9px] font-black text-[#FFB347] uppercase mb-1">Son Notu</p>
                             <p className="text-xs text-slate-500 font-bold truncate">"{u.previewPost}"</p>
                          </div>
                        ) : (
                          <div className="pl-3 border-l-2 border-slate-100">
                             <p className="text-[9px] font-black text-slate-300 uppercase mb-1">Henüz yok</p>
                          </div>
                        )}
                      </div>
                      <div className="bg-slate-50 rounded-2xl p-3 text-center">
                         <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest italic">Günlüğü Gör</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Home;
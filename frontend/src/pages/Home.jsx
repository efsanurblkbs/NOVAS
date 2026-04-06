import { useState, useEffect } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Users, Search } from "lucide-react";

const Home = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data.filter(u => u._id !== currentUser._id));
      } catch (err) {
        console.error("Kullanıcılar getirilemedi:", err);
      }
    };
    if (currentUser) fetchUsers();
  }, [currentUser]);

  const filteredUsers = users.filter((u) => u.username.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="w-full h-full p-12 overflow-y-auto custom-scrollbar bg-slate-50/30">
      <div className="max-w-4xl mx-auto">
        
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div>
             <h1 className="text-5xl font-black text-slate-800 italic uppercase tracking-tighter mb-2">Keşfet</h1>
             <p className="text-sm font-bold text-slate-400 capitalize flex items-center gap-2">
                <Sparkles size={16} className="text-[#FFB347]" />
                Diğer günlükleri ve insanları bul
             </p>
           </div>
           
           <div className="relative w-full md:w-72">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
               <Search size={18} className="text-slate-300" />
             </div>
             <input 
               type="text" 
               placeholder="Kullanıcı ara..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.03)] focus:ring-2 focus:ring-[#FFB347]/50 focus:outline-none text-slate-700 font-bold placeholder:text-slate-300 transition-all"
             />
           </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredUsers.map(u => (
              <motion.div key={u._id} initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.9}}>
                <Link to={`/profile/${u._id}`}>
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white p-8 rounded-[3rem] shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] border-2 border-transparent hover:border-[#FF9B9B]/20 transition-all cursor-pointer group h-full flex flex-col"
                  >
                  <div className="flex items-center gap-4 mb-4">
                      {u.profilePicture ? (
                        <img src={u.profilePicture} alt="" className="w-16 h-16 rounded-full object-cover shadow-sm bg-white border-2 border-transparent group-hover:border-[#FF9B9B]/50 transition-all" />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-slate-50 flex flex-shrink-0 items-center justify-center text-slate-400 font-black text-2xl group-hover:bg-gradient-to-tr from-[#A29BFE] to-[#FF9B9B] group-hover:text-white group-hover:shadow-md transition-all">
                          {u.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <h2 className="font-bold text-xl text-slate-800 truncate">{u.username}</h2>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-[10px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-widest font-black inline-block whitespace-nowrap">
                            {u.followers?.length || 0} Takipçi
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4 flex-1">
                      {u.previewPost ? (
                        <div className="px-4 border-l-2 border-[#FFB347]">
                           <p className="text-[11px] font-black text-[#FFB347] tracking-widest uppercase mb-1">Son Sayfası</p>
                           <p className="text-sm text-slate-600 font-bold truncate">"{u.previewPost}"</p>
                        </div>
                      ) : (
                        <div className="px-4 border-l-2 border-slate-200">
                           <p className="text-[11px] font-black text-slate-300 tracking-widest uppercase mb-1">Gizli Veya Yok</p>
                           <p className="text-xs text-slate-400 font-bold italic truncate">Son eklenen sayfa gizli...</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-slate-50 rounded-2xl p-4 mt-auto">
                       <p className="text-[11px] text-slate-400 text-center uppercase tracking-widest font-black italic flex items-center justify-center gap-2">
                         Günlüğünü İncele
                         {u.postCount > 0 && <span className="bg-white text-slate-300 px-2 py-0.5 rounded-full">{u.postCount}</span>}
                       </p>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredUsers.length === 0 && (
             <div className="col-span-full py-20 text-center flex flex-col items-center">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                  <Search size={40} />
                </div>
                <p className="text-sm font-black uppercase text-slate-400 tracking-widest">Aramana uygun kimse bulunamadı...</p>
             </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Home;

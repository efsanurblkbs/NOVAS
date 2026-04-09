import { useState, useEffect } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Search, Users, Map } from "lucide-react";
import DailyCards from "../components/DailyCards";

const Home = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("explore"); // "explore" veya "following"

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await api.get("/users");
        // Kendimizi listeden çıkarıyoruz
        setUsers(res.data.filter(u => u._id !== currentUser._id));
      } catch (err) {
        console.error("Kullanıcılar getirilemedi:", err);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) fetchUsers();
  }, [currentUser]);

  // Sekme ve Arama Filtreleme Mantığı
  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "following") {
      // Sadece currentUser'ın takip ettiği kişileri göster
      return matchesSearch && currentUser.following?.includes(u._id);
    }
    
    return matchesSearch; // Keşfet modunda herkesi göster
  });

  return (
    <div className="w-full h-full p-4 md:p-12 overflow-y-auto custom-scrollbar bg-slate-50/30 overflow-x-hidden">
      <div className="max-w-4xl mx-auto w-full">
        {/* HEADER */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 italic uppercase tracking-tighter mb-2">
              {activeTab === "explore" ? "Keşfet" : "Arkadaşlar"}
            </h1>
            <p className="text-[10px] md:text-sm font-bold text-slate-400 uppercase flex items-center gap-2">
              <Sparkles size={16} className="text-[#FFB347]" /> 
              {activeTab === "explore" ? "Yeni insanlar bul" : "Takip ettiklerini gör"}
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

        {/* SEKMELER (TABS) */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("explore")}
            className={`px-6 py-2.5 rounded-full font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2 ${
              activeTab === "explore" 
              ? "bg-[#FFB347] text-white shadow-lg shadow-[#FFB347]/30 scale-105" 
              : "bg-white text-slate-400 hover:bg-slate-50 border border-slate-100"
            }`}
          >
            <Map size={14} /> Keşfet
          </button>
          <button
            onClick={() => setActiveTab("following")}
            className={`px-6 py-2.5 rounded-full font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2 ${
              activeTab === "following" 
              ? "bg-[#FF9B9B] text-white shadow-lg shadow-[#FF9B9B]/30 scale-105" 
              : "bg-white text-slate-400 hover:bg-slate-50 border border-slate-100"
            }`}
          >
            <Users size={14} /> Takip Ettiklerin
          </button>
        </div>

        {/* GÜNLÜK MOTİVASYON KARTLARI */}
        <DailyCards />

        {/* KULLANICI KARTLARI GRİDİ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence mode="wait">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/50 p-8 rounded-[3rem] h-64 animate-pulse flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 bg-slate-200 rounded-full"></div>
                  <div className="w-24 h-4 bg-slate-200 rounded-full"></div>
                </div>
              ))
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map(u => (
                <motion.div 
                  key={u._id} 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
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
                        {u.lastDiaries && u.lastDiaries.length > 0 ? (
                          <div className="flex gap-2 h-20 items-center overflow-x-hidden">
                            {u.lastDiaries.map((diary, idx) => (
                              <div 
                                key={idx} 
                                className="w-14 h-18 shrink-0 rounded-xl p-2 flex flex-col justify-center items-center border border-white/40 shadow-sm transition-transform group-hover:scale-110"
                                style={{ backgroundColor: diary.coverColor || '#A29BFE' }}
                              >
                                <p className="text-[7px] font-black uppercase text-white drop-shadow-md text-center leading-tight break-words px-1">
                                  {diary.title || "Defter"}
                                </p>
                                <div className="mt-1 w-3 h-0.5 bg-white/30 rounded-full"></div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="pl-3 border-l-2 border-slate-100 py-2">
                            <p className="text-[9px] font-black text-slate-300 uppercase italic">Henüz defter yok</p>
                          </div>
                        )}
                      </div>

                      <div className="bg-slate-50 rounded-2xl p-3 text-center group-hover:bg-[#FFB347]/10 transition-all">
                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest italic group-hover:text-[#FFB347]">Günlüğü Gör</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              /* EĞER LİSTE BOŞSA GÖSTERİLECEK MESAJ */
              <div className="col-span-full py-20 text-center">
                <p className="text-slate-400 font-bold italic uppercase tracking-widest text-xs">
                  {activeTab === "following" ? "Henüz kimseyi takip etmiyorsun pofuduk dostum..." : "Aradığın kriterde kimse bulunamadı."}
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Home;
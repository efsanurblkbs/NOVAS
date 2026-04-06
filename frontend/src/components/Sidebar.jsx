import { Link, useLocation } from "react-router-dom";
import { Home, User, BookOpen, LogOut, Camera, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";
import { useState, useEffect } from "react";
import useStore from "../store/useStore";

const Sidebar = ({ handleLogout }) => {
  const { user, setUser } = useStore();
  const location = useLocation();
  const [isUploading, setIsUploading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user) {
       api.get("/notifications").then(res => setNotifications(res.data)).catch(err => console.log(err));
    }
  }, [user]);

  const handleRespond = async (id, action) => {
    try {
      await api.put(`/notifications/${id}/respond`, { action });
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch(err) { alert("Hata oluştu"); }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch(err) { alert("Silinemedi"); }
  };

  const pendingCount = notifications.filter(n => n.status === "PENDING").length;

  const menuItems = [
    { name: "Ana Sayfa", path: "/", icon: <Home size={24} /> },
    { name: "Günlüğüm", path: "/my-diaries", icon: <BookOpen size={24} /> },
    { name: "Profilim", path: `/profile/${user?._id}`, icon: <User size={24} /> },
  ];

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("profilePicture", file);
    
    setIsUploading(true);
    try {
      const res = await api.put(`/users/${user._id}/avatar`, data);
      setUser(res.data);
    } catch (err) {
      alert("Fotoğraf yüklenemedi. Lütfen tekrar dene.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-72 h-full bg-white/70 backdrop-blur-xl border-r border-slate-100 flex flex-col items-center py-12 px-6 shadow-[10px_0_50px_rgba(0,0,0,0.02)] relative z-20">
      <div className="mb-14 text-center">
        <motion.h1 
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          style={{ backgroundSize: "200% auto" }}
          className="text-4xl font-black italic uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-[#A29BFE] via-[#FF9B9B] to-[#FFB347] pr-4"
        >
          Novas
        </motion.h1>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Your Diary</p>
      </div>

      <nav className="flex-1 w-full space-y-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname + location.search === item.path;
          return (
            <Link key={item.name} to={item.path} className="block relative">
              <motion.div
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                variants={{
                  initial: { scale: 1 },
                  hover: { scale: 1.02 },
                  tap: { scale: 0.98 }
                }}
                className={`flex items-center gap-4 w-full p-4 rounded-[2rem] transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-[#A29BFE]/10 to-[#FF9B9B]/10 text-slate-800 shadow-sm border border-white"
                    : "text-slate-400 hover:text-slate-700 hover:bg-slate-50 border border-transparent"
                }`}
              >
                <motion.div variants={{ hover: { rotate: [0, -20, 20, -20, 0] } }} transition={{ duration: 0.5 }} className={`${isActive ? "text-[#FF9B9B]" : ""}`}>
                   {item.icon}
                </motion.div>
                <span className="font-bold tracking-wide">{item.name}</span>
                {isActive && (
                  <motion.div layoutId="sidebar-active" className="absolute left-0 w-1 h-8 bg-gradient-to-b from-[#A29BFE] to-[#FF9B9B] rounded-r-lg" />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="w-full mt-auto relative">
          
          <button onClick={() => setShowNotifications(!showNotifications)} className="flex items-center justify-between w-full p-4 mb-4 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center gap-3 text-slate-500 font-bold">
               <Bell size={20} className={`${pendingCount > 0 ? 'text-[#FF9B9B] animate-pulse' : ''}`} />
               <span className="text-xs uppercase tracking-widest">Bildirimler</span>
            </div>
            {pendingCount > 0 && <span className="bg-[#FF9B9B] text-white text-[10px] px-2 py-0.5 rounded-full">{pendingCount}</span>}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:20}} className="absolute bottom-[calc(100%+10px)] left-0 w-[400px] bg-white/90 backdrop-blur-xl border border-slate-100 rounded-3xl shadow-2xl p-6 z-50 overflow-hidden">
                 <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">Gelen İstekler</h3>
                 <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-4">
                    {notifications.length === 0 ? (
                      <p className="text-xs font-bold text-slate-300 italic text-center py-4">Bildirim kutun boş...</p>
                    ) : (
                      notifications.map(n => (
                       <div key={n._id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-3">
                         {n.type === "FOLLOW" ? (
                           <>
                             <p className="text-sm font-bold text-slate-700">
                               <span className="text-[#A29BFE]">{n.senderName}</span> seni takip etmeye başladı! 🌟
                             </p>
                             <button onClick={() => handleDeleteNotification(n._id)} className="w-full py-2 bg-slate-200 text-slate-600 text-[10px] uppercase font-black tracking-widest rounded-full hover:bg-slate-300 transition-all">Harika!</button>
                           </>
                         ) : (
                           <>
                             <p className="text-sm font-bold text-slate-700">
                               <span className="text-[#A29BFE]">{n.senderName}</span>, <span className="italic">"{n.diaryTitle}"</span> defterine erişmek istiyor.
                             </p>
                             {n.status === "PENDING" ? (
                               <div className="flex items-center gap-2">
                                  <button onClick={()=>handleRespond(n._id, "APPROVE")} className="flex-1 py-2 bg-[#6BCB77] text-white text-[10px] uppercase font-black tracking-widest rounded-full hover:bg-opacity-80 transition-all">İzin Ver</button>
                                  <button onClick={()=>handleRespond(n._id, "REJECT")} className="flex-1 py-2 bg-[#FF9B9B] text-white text-[10px] uppercase font-black tracking-widest rounded-full hover:bg-opacity-80 transition-all">Reddet</button>
                               </div>
                             ) : (
                               <div className="flex items-center justify-between border-t border-slate-200 mt-1 pt-2">
                                 <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">KARAR VERİLDİ: {n.status}</p>
                                 <button onClick={() => handleDeleteNotification(n._id)} className="text-[10px] text-slate-400 hover:text-slate-700 uppercase font-bold transition-all">Gizle</button>
                               </div>
                             )}
                           </>
                         )}
                       </div>
                      ))
                    )}
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        <div className="w-full mt-auto">
          <div className="flex items-center gap-4 mb-4 p-4 rounded-[2rem] bg-slate-50/50 border border-slate-100 hover:bg-slate-100 transition-colors">
             <label className={`relative flex-shrink-0 cursor-pointer rounded-full group ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
               <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
               {user.profilePicture ? (
                 <img src={user.profilePicture} alt="avatar" className="w-12 h-12 rounded-full object-cover shadow-sm bg-white" />
               ) : (
                 <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FFD93D] to-[#6BCB77] flex items-center justify-center text-white font-black text-xl shadow-md">
                    {user.username.charAt(0).toUpperCase()}
                 </div>
               )}
               <div className="absolute inset-0 bg-slate-800/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
                  <Camera size={16} className="text-white" />
               </div>
             </label>
             <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-slate-800 truncate">{user.username}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">{user.email}</p>
             </div>
          </div>

          <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full p-4 rounded-[2rem] text-slate-400 hover:text-[#FF9B9B] hover:bg-[#FF9B9B]/10 transition-all font-bold tracking-wide">
            <LogOut size={20} />
            <span>Çıkış Yap</span>
          </button>
        </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

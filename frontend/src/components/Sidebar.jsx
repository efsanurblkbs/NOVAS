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
    /* ANA TAŞIYICI: Mobilde üstte bar, bilgisayarda solda sütun */
    <div className="w-full md:w-72 h-auto md:h-full bg-white/70 backdrop-blur-xl border-b md:border-r border-slate-100 flex flex-row md:flex-col items-center py-4 md:py-12 px-4 md:px-6 shadow-[0_10px_30px_rgba(0,0,0,0.02)] md:shadow-[10px_0_50px_rgba(0,0,0,0.02)] relative z-[100]">
      
      {/* Logo: Mobilde gizli, bilgisayarda havalı */}
      <div className="hidden md:block mb-14 text-center">
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

      {/* Menü: Mobilde ikonlar yan yana */}
      <nav className="flex flex-row md:flex-col flex-1 w-full space-x-2 md:space-x-0 md:space-y-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname + location.search === item.path;
          return (
            <Link key={item.name} to={item.path} className="block relative flex-1 md:flex-none">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center justify-center md:justify-start gap-2 md:gap-4 w-full p-3 md:p-4 rounded-[1.5rem] md:rounded-[2rem] transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-[#A29BFE]/10 to-[#FF9B9B]/10 text-slate-800 shadow-sm border border-white"
                    : "text-slate-400 hover:text-slate-700 hover:bg-slate-50 border border-transparent"
                }`}
              >
                <div className={`${isActive ? "text-[#FF9B9B]" : ""}`}>
                   {item.icon}
                </div>
                <span className="hidden md:block font-bold tracking-wide">{item.name}</span>
                {isActive && (
                  <motion.div layoutId="sidebar-active" className="hidden md:block absolute left-0 w-1 h-8 bg-gradient-to-b from-[#A29BFE] to-[#FF9B9B] rounded-r-lg" />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="flex md:flex-col items-center gap-2 md:gap-0 md:w-full md:mt-auto relative ml-4 md:ml-0">
          
          {/* BİLDİRİM BUTONU */}
          <button onClick={() => setShowNotifications(!showNotifications)} className="p-3 md:p-4 md:mb-4 rounded-full md:rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group relative">
             <Bell size={20} className={`${pendingCount > 0 ? 'text-[#FF9B9B] animate-pulse' : 'text-slate-500'}`} />
             {pendingCount > 0 && <span className="absolute top-0 right-0 bg-[#FF9B9B] text-white text-[8px] px-1.5 py-0.5 rounded-full border-2 border-white">{pendingCount}</span>}
          </button>

          <AnimatePresence>
            {showNotifications && (
              /* GÜNCELLENEN BİLDİRİM PANELİ: Mobilde aşağı, PC'de yukarı açılır */
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }} 
                className="absolute top-[calc(100%+15px)] md:top-auto md:bottom-[calc(100%+15px)] right-0 md:left-0 w-[280px] md:w-[400px] bg-white/95 backdrop-blur-2xl border border-slate-100 rounded-3xl shadow-2xl p-4 md:p-6 z-[999]"
              >
                 <h3 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">Gelen İstekler</h3>
                 <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-4">
                    {notifications.length === 0 ? (
                      <p className="text-xs font-bold text-slate-300 italic text-center py-4">Bildirim kutun boş...</p>
                    ) : (
                      notifications.map(n => (
                       <div key={n._id} className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col gap-3">
                         {n.type === "FOLLOW" ? (
                           <>
                             <p className="text-xs md:text-sm font-bold text-slate-700">
                               <span className="text-[#A29BFE]">{n.senderName}</span> seni takip etmeye başladı! 🌟
                             </p>
                             <button onClick={() => handleDeleteNotification(n._id)} className="w-full py-2 bg-slate-200 text-slate-600 text-[9px] uppercase font-black tracking-widest rounded-full hover:bg-slate-300 transition-all">Harika!</button>
                           </>
                         ) : (
                           <>
                             <p className="text-xs md:text-sm font-bold text-slate-700">
                               <span className="text-[#A29BFE]">{n.senderName}</span>, <span className="italic">"{n.diaryTitle}"</span> defterine erişmek istiyor.
                             </p>
                             {n.status === "PENDING" ? (
                               <div className="flex items-center gap-2">
                                  <button onClick={()=>handleRespond(n._id, "APPROVE")} className="flex-1 py-2 bg-[#6BCB77] text-white text-[9px] uppercase font-black tracking-widest rounded-full hover:bg-opacity-80 transition-all">İzin Ver</button>
                                  <button onClick={()=>handleRespond(n._id, "REJECT")} className="flex-1 py-2 bg-[#FF9B9B] text-white text-[9px] uppercase font-black tracking-widest rounded-full hover:bg-opacity-80 transition-all">Reddet</button>
                               </div>
                             ) : (
                               <div className="flex items-center justify-between border-t border-slate-200 mt-1 pt-2">
                                 <p className="text-[9px] uppercase font-black tracking-widest text-slate-400">KARAR: {n.status}</p>
                                 <button onClick={() => handleDeleteNotification(n._id)} className="text-[9px] text-slate-400 hover:text-slate-700 uppercase font-bold transition-all">Gizle</button>
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

          {/* Profil & Çıkış */}
          <div className="flex items-center gap-2 md:w-full md:mb-4 md:p-4 rounded-full md:rounded-[2rem] md:bg-slate-50/50 md:border md:border-slate-100">
             <label className={`relative flex-shrink-0 cursor-pointer rounded-full group ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
               <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
               {user.profilePicture ? (
                 <img src={user.profilePicture} alt="avatar" className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shadow-sm bg-white" />
               ) : (
                 <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-[#FFD93D] to-[#6BCB77] flex items-center justify-center text-white font-black text-lg md:text-xl shadow-md">
                    {user.username.charAt(0).toUpperCase()}
                 </div>
               )}
             </label>
             <div className="hidden md:block flex-1 overflow-hidden">
                <p className="text-sm font-bold text-slate-800 truncate">{user.username}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">{user.email}</p>
             </div>
          </div>

          <button onClick={handleLogout} className="p-3 md:p-4 md:w-full rounded-full md:rounded-[2rem] text-slate-400 hover:text-[#FF9B9B] hover:bg-[#FF9B9B]/10 transition-all font-bold">
            <LogOut size={20} />
            <span className="hidden md:inline ml-2 text-sm">Çıkış</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

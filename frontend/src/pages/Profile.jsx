import { useState, useEffect } from "react";
import api from "../api";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Search, PlusCircle, Book, X, Settings, Trash2, ShieldAlert, User, Mail, Key } from "lucide-react";
import useStore from "../store/useStore";
import DiaryView from "../components/DiaryView";

const rainbow = "linear-gradient(90deg, #FFB5B5, #FFD6A5, #CAFFBF, #9BF6FF, #A0C4FF, #BDB2FF, #FFC6FF)";

const Profile = ({ currentUser }) => {
  const { id } = useParams();
  const { notifications, logout, setUser } = useStore();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [diaries, setDiaries] = useState([]);
  const [activeDiary, setActiveDiary] = useState(null);

  // Modals
  const [showSettings, setShowSettings] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [editFormData, setEditFormData] = useState({ username: "", email: "", password: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if(id && currentUser) {
      fetchProfile(id);
      fetchDiaries(id);
      setActiveDiary(null);
    }
  }, [id, currentUser]);

  // Bildirimler her güncellendiğinde (Sidebar polling sayesinde), 
  // defterlerin durumunu da tazele ki kilitler otomatik açılsın.
  useEffect(() => {
    if(id && currentUser) {
      fetchDiaries(id);
    }
  }, [notifications]);

  const fetchProfile = async (profileId) => {
    try {
      const res = await api.get(`/users/${profileId}`);
      setProfile(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchDiaries = async (profileId) => {
    try {
      const res = await api.get(`/diaries?profileId=${profileId}`);
      setDiaries(res.data);
    } catch (err) { console.error(err); }
  };

  const handleFollow = async () => {
    try {
      const path = profile.followers.includes(currentUser._id) ? "unfollow" : "follow";
      await api.put(`/users/${profile._id}/${path}`, { userId: currentUser._id });
      fetchProfile(id);
    } catch(err) {}
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      // Sadece dolu alanları gönder
      const dataToUpdate = {};
      if (editFormData.username) dataToUpdate.username = editFormData.username;
      if (editFormData.email) dataToUpdate.email = editFormData.email;
      if (editFormData.password) dataToUpdate.password = editFormData.password;

      if (Object.keys(dataToUpdate).length === 0) {
        setShowSettings(false);
        setIsUpdating(false);
        return;
      }

      const res = await api.put(`/users/${currentUser._id}`, dataToUpdate);
      setUser(res.data);
      setProfile(res.data);
      setShowSettings(false);
      alert("Hesap bilgilerin başarıyla güncellendi ✨");
    } catch (err) {
      alert(err.response?.data?.error || "Güncelleme başarısız!");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteInput !== "HESABIMI SİL") {
      alert("Lütfen doğrulamayı doğru şekilde girin.");
      return;
    }
    try {
      await api.delete(`/users/${currentUser._id}`);
      logout();
      navigate("/");
      alert("Hesabın başarıyla silindi. Seni özleyeceğiz 🌈");
    } catch (err) {
      alert("Silme işlemi başarısız!");
    }
  };

  const handleDiaryClick = async (diary) => {
     if (diary.isLocked) {
        if(window.confirm(`"${diary.title}" defteri şu an kilitli! Yazarından bu defteri okumak için izin isteği göndermek istediğine emin misin?`)) {
           try {
              await api.post("/notifications/request", { diaryId: diary._id });
              alert("Erişim isteği başarıyla yola çıktı! Yazar onayladığında defterin kilidi senin için açılacaktır.");
           } catch(err) {
              alert(err.response?.data?.error || err.response?.data || "İstek gönderilemedi");
           }
        }
     } else {
        setActiveDiary(diary);
     }
  };

  if(!profile) return <div className="p-12 flex items-center justify-center h-full">Yükleniyor...</div>;

  if(activeDiary) {
    const allowWrite = activeDiary.authorId !== currentUser._id;
    return <DiaryView diary={activeDiary} onBack={() => setActiveDiary(null)} managementMode={false} allowWrite={allowWrite} />;
  }

  return (
    <div className="w-full h-full flex flex-col relative bg-slate-50/30">
      
      {/* Header */}
      <div className="w-full p-12 pb-8 border-b border-slate-100 bg-white/50 backdrop-blur-md z-10 sticky top-0">
         <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              {profile.profilePicture ? (
                 <img src={profile.profilePicture} alt="" className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white bg-white" />
              ) : (
                 <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#FFB347] to-[#FF9B9B] text-white font-black text-4xl flex items-center justify-center shadow-lg border-4 border-white">
                   {profile.username.charAt(0).toUpperCase()}
                 </div>
              )}
              <div>
                 <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-800">{profile.username}</h1>
                 <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">{profile.followers?.length || 0} Takipçi • {profile.followings?.length || 0} Takip</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {currentUser._id !== profile._id ? (
                <button onClick={handleFollow} className="px-8 py-4 rounded-full text-xs font-black text-white uppercase tracking-widest shadow-md hover:scale-105 transition-transform" style={{background: rainbow}}>
                  {profile.followers?.includes(currentUser._id) ? "Takibi Bırak" : "Takip Et"}
                </button>
              ) : (
                <button onClick={() => {
                  setEditFormData({ username: profile.username, email: profile.email, password: "" });
                  setShowSettings(true);
                }} className="p-4 rounded-full bg-white shadow-sm border border-slate-100 text-slate-400 hover:text-[#A29BFE] hover:shadow-md transition-all">
                  <Settings size={20} />
                </button>
              )}
            </div>
         </div>
      </div>

      {/* Content Area - Diaries Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-800 mb-8 pb-4 border-b-2 border-slate-100 flex items-center gap-3">
             <Book size={24} className="text-[#FFB347]" /> {profile.username}'in Defterleri
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <AnimatePresence>
              {diaries.map((diary, index) => (
                 <motion.div key={diary._id} initial={{opacity:0, scale:0.8, y: 30}} animate={{opacity:1, scale:1, y: 0}} transition={{delay: index*0.08, type: "spring", stiffness: 100}}
                    onClick={() => handleDiaryClick(diary)}
                    className="relative cursor-pointer group"
                    style={{ perspective: "1000px" }}
                 >
                    <div className="w-full aspect-[2/3] rounded-r-3xl rounded-l-md shadow-[10px_15px_30px_rgba(0,0,0,0.2)] group-hover:shadow-[20px_25px_50px_rgba(0,0,0,0.3)] transition-all duration-500 flex flex-col justify-center items-center text-center relative overflow-hidden group-hover:-translate-y-2 group-hover:rotate-y-[5deg] transform-gpu border border-white/20" 
                         style={{ backgroundColor: diary.coverColor || '#A29BFE' }}>
                       
                       <div className="absolute inset-0 opacity-40 bg-gradient-to-tr from-black/20 via-transparent to-white/40"></div>

                       {/* Book Pages Edge (Right Side) */}
                       <div className="absolute right-0 top-2 bottom-2 w-3 bg-gradient-to-r from-[#eadaD2] to-[#FFF9F2] rounded-r-2xl border-l border-black/10 shadow-inner z-0"></div>

                       {/* Premium Leather Spine (Left Side) */}
                       <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/40 via-black/10 to-transparent border-r border-white/20 shadow-[inset_-2px_0_10px_rgba(0,0,0,0.5)] z-10 flex flex-col justify-evenly">
                          <div className="w-full h-1 bg-black/30 border-y border-white/10 opacity-50"></div>
                          <div className="w-full h-1 bg-black/30 border-y border-white/10 opacity-50"></div>
                          <div className="w-full h-1 bg-black/30 border-y border-white/10 opacity-50"></div>
                       </div>

                       {/* Golden Foil Embossed Frame */}
                       <div className="absolute inset-x-12 inset-y-10 border-2 border-[#E5CCA5]/40 rounded-sm z-10 group-hover:border-[#E5CCA5]/70 transition-colors"></div>
                       <div className="absolute inset-x-10 inset-y-8 border-[0.5px] border-[#E5CCA5]/20 rounded-sm z-10"></div>

                       {/* Magical Bookmark Ribbon */}
                       <div className="absolute top-0 right-10 w-4 h-24 bg-gradient-to-b from-[#FF9B9B] to-[#ff6b6b] shadow-md z-30 origin-top transform group-hover:rotate-3 transition-transform duration-500 border border-white/10" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)" }}></div>

                       {/* Locked overlay */}
                       {diary.isLocked ? (
                         <>
                           <div className="absolute top-6 right-6 bg-white/20 p-2.5 rounded-full backdrop-blur-md border border-white/30 z-40 shadow-xl group-hover:scale-0 transition-transform duration-300">
                              <Lock size={16} className="text-white drop-shadow-md" />
                           </div>
                           <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[4px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-6 z-50 rounded-r-3xl rounded-l-md">
                              <motion.div initial={{scale:0}} whileInView={{scale:1}} className="bg-white/10 p-4 rounded-full mb-6 border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                                 <Lock size={32} className="text-white" />
                              </motion.div>
                               {notifications.some(n => n.diaryId === diary._id && n.status === "PENDING") ? (
                                 <span className="text-[10px] font-black uppercase text-white/50 tracking-widest text-center border-2 border-white/10 rounded-full px-6 py-3 bg-white/5">İstek Bekleniyor...</span>
                               ) : (
                                 <span className="text-[10px] font-black uppercase text-[#E5CCA5] tracking-widest text-center border-2 border-[#E5CCA5] rounded-full px-6 py-3 hover:bg-[#E5CCA5] hover:text-slate-900 transition-all shadow-xl shadow-[#E5CCA5]/20">Erişim İste</span>
                               )}
                           </div>
                         </>
                       ) : diary.isPrivate && (
                         <div className="absolute top-6 right-6 bg-white/30 p-2.5 rounded-full backdrop-blur-md border border-white/30 z-40 shadow-xl">
                            <Lock size={16} className="text-white drop-shadow-md" />
                         </div>
                       )}

                       {/* Title - Lighter Emboss Style */}
                       <h3 className="relative z-20 text-3xl font-black italic uppercase tracking-widest leading-tight text-center px-4 w-full break-words text-slate-500 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                         {diary.title}
                       </h3>
                    </div>
                 </motion.div>
              ))}
            </AnimatePresence>
            
            {diaries.length === 0 && (
               <div className="col-span-full py-20 text-center">
                  <p className="text-sm font-bold text-slate-400 italic">Henüz hiç defter oluşturmamış...</p>
               </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setShowSettings(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{scale:0.9, opacity:0, y:20}} animate={{scale:1, opacity:1, y:0}} exit={{scale:0.9, opacity:0, y:20}} className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden z-10 relative">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-800 flex items-center gap-2">
                  <Settings size={20} className="text-[#A29BFE]" /> Hesap Ayarları
                </h3>
                <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400"><X size={20}/></button>
              </div>

              <form onSubmit={handleUpdate} className="p-8 space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Kullanıcı Adı</label>
                  <div className="relative">
                    <User size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#A29BFE]/20 transition-all font-bold text-slate-700" value={editFormData.username} onChange={e=>setEditFormData({...editFormData, username: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">E-posta</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#A29BFE]/20 transition-all font-bold text-slate-700" type="email" value={editFormData.email} onChange={e=>setEditFormData({...editFormData, email: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Yeni Şifre (Değiştirmek istemiyorsan boş bırak)</label>
                  <div className="relative">
                    <Key size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#A29BFE]/20 transition-all font-bold text-slate-700" type="password" placeholder="••••••••" value={editFormData.password} onChange={e=>setEditFormData({...editFormData, password: e.target.value})} />
                  </div>
                </div>

                <button type="submit" disabled={isUpdating} className="w-full py-5 rounded-2xl text-white font-black uppercase text-[10px] tracking-[0.3em] shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all relative overflow-hidden group" style={{background: rainbow}}>
                  <span className="relative z-10">{isUpdating ? "Güncelleniyor..." : "Bilgilerimi Kaydet"}</span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>

                <div className="pt-6 border-t border-slate-50">
                  <button type="button" onClick={() => { setShowSettings(false); setShowDeleteConfirm(true); }} className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 hover:text-rose-600 transition-colors flex items-center justify-center gap-2">
                    <Trash2 size={14} /> Hesabımı Silmek İstiyorum
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setShowDeleteConfirm(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.9, opacity:0}} className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md p-10 z-10 relative text-center">
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldAlert size={40} className="text-rose-500" />
              </div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-800 mb-4">Hesabını Sil?</h3>
              <p className="text-slate-500 text-sm font-bold mb-8 leading-relaxed">
                Bu işlem geri alınamaz. Tüm defterlerin, yazıların ve etkileşimlerin sonsuza dek silinecektir. Devam etmek istiyor musun?
              </p>
              
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-left ml-2">Doğrulamak için "HESABIMI SİL" yazın</p>
                  <input className="w-full px-4 py-3 bg-white rounded-xl outline-none border-2 border-transparent focus:border-rose-200 transition-all font-bold text-center text-slate-700" placeholder="HESABIMI SİL" value={deleteInput} onChange={e=>setDeleteInput(e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button onClick={() => setShowDeleteConfirm(false)} className="py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Vazgeç</button>
                  <button onClick={handleDeleteAccount} disabled={deleteInput !== "HESABIMI SİL"} className="py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest text-white bg-rose-500 shadow-lg shadow-rose-200 hover:bg-rose-600 disabled:opacity-50 disabled:shadow-none transition-all">Hesabı Sil</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;

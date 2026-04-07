import { useState, useEffect } from "react";
import api from "../api";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Search, PlusCircle, Book, X } from "lucide-react";
import useStore from "../store/useStore";
import DiaryView from "../components/DiaryView";

const rainbow = "linear-gradient(90deg, #FFB5B5, #FFD6A5, #CAFFBF, #9BF6FF, #A0C4FF, #BDB2FF, #FFC6FF)";

const Profile = ({ currentUser }) => {
  const { id } = useParams();
  const { user: currentUser, notifications } = useStore();
  const [profile, setProfile] = useState(null);
  const [diaries, setDiaries] = useState([]);
  const [activeDiary, setActiveDiary] = useState(null);

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
              {currentUser._id !== profile._id && (
                <button onClick={handleFollow} className="px-8 py-4 rounded-full text-xs font-black text-white uppercase tracking-widest shadow-md hover:scale-105 transition-transform" style={{background: rainbow}}>
                  {profile.followers?.includes(currentUser._id) ? "Takibi Bırak" : "Takip Et"}
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
    </div>
  );
};

export default Profile;

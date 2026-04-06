import { useState, useEffect } from "react";
import api from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, PlusCircle, Book, X, Trash2 } from "lucide-react";
import useStore from "../store/useStore";
import DiaryView from "../components/DiaryView";

const rainbow = "linear-gradient(90deg, #FFB5B5, #FFD6A5, #CAFFBF, #9BF6FF, #A0C4FF, #BDB2FF, #FFC6FF)";

const MyDiaries = () => {
  const { user: currentUser } = useStore();
  const [diaries, setDiaries] = useState([]);
  const [activeDiary, setActiveDiary] = useState(null);
  
  // New diary modal
  const [showNewDiary, setShowNewDiary] = useState(false);
  const [newDiaryData, setNewDiaryData] = useState({ title: "", coverColor: "#FFB5B5", isPrivate: false });
  
  const pastelColors = [
    "#FFB5B5", "#FFD6A5", "#FDFFB6", "#CAFFBF", "#9BF6FF", "#A0C4FF", "#BDB2FF", "#FFC6FF",
    "#FAD4D4", "#F4E0C0", "#E9F5C5", "#C8E6C9", "#B2EBF2", "#BBDEFB", "#E1BEE7", "#F8BBD0",
    "#FFDFD3", "#FEC8D8", "#D291BC", "#B39DDB"
  ];

  useEffect(() => {
    if(currentUser) {
      fetchDiaries();
      setActiveDiary(null);
    }
  }, [currentUser]);

  const fetchDiaries = async () => {
    try {
      const res = await api.get(`/diaries?profileId=${currentUser._id}`);
      setDiaries(res.data);
    } catch (err) { console.error(err); }
  };

  const handleCreateDiary = async (e) => {
    e.preventDefault();
    try {
      await api.post("/diaries", newDiaryData);
      setShowNewDiary(false);
      setNewDiaryData({ title: "", coverColor: "#A29BFE", isPrivate: false });
      fetchDiaries();
    } catch(err) { alert("Günlük oluşturulamadı"); }
  };

  // handleDelete function was here... wait, the user wants delete diary.
  // Actually, delete diary should be IN the DiaryView under managementMode, OR on the card.
  // Let's add it on the DiaryView for safety.

  const handleDiaryClick = (diary) => {
     setActiveDiary(diary);
  };

  if(!currentUser) return null;

  if(activeDiary) {
    return <DiaryView diary={activeDiary} onBack={() => {setActiveDiary(null); fetchDiaries();}} managementMode={true} allowWrite={true} />;
  }

  return (
    <div className="w-full h-full flex flex-col relative bg-slate-50/30">
      
      {/* Header */}
      <div className="w-full p-12 pb-8 border-b border-slate-100 bg-white/50 backdrop-blur-md z-10 sticky top-0">
         <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
               <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-800">Günlüğüm</h1>
               <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">Burada tüm defterlerini sen yönetiyorsun</p>
            </div>
            
            <button onClick={() => setShowNewDiary(true)} className="px-6 py-4 rounded-full text-white text-xs font-black uppercase tracking-widest hover:scale-105 shadow-xl transition-all flex items-center gap-2" style={{background: rainbow}}>
               <PlusCircle size={16} /> Yeni Defter
            </button>
         </div>
      </div>

      {/* Content Area - Diaries Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <AnimatePresence>
              {diaries.map((diary, index) => (
                 <motion.div key={diary._id} initial={{opacity:0, scale:0.8, y: 30}} animate={{opacity:1, scale:1, y: 0}} transition={{delay: index*0.08, type: "spring", stiffness: 100}}
                    onClick={() => handleDiaryClick(diary)}
                    className="relative cursor-pointer group"
                    style={{ perspective: "1000px" }}
                 >
                    <div className="w-full aspect-[2/3] rounded-r-3xl rounded-l-md shadow-[10px_15px_30px_rgba(0,0,0,0.2)] group-hover:shadow-[20px_25px_50px_rgba(0,0,0,0.3)] transition-all duration-500 flex flex-col justify-center items-center text-center relative overflow-hidden group-hover:-translate-y-2 group-hover:rotate-y-[5deg] transform-gpu border border-white/20" 
                         style={{ backgroundColor: diary.coverColor || '#FFB5B5' }}>
                       
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

                       {/* Private status badge */}
                       {(diary.isLocked || diary.isPrivate) && (
                         <div className="absolute top-6 right-6 bg-white/30 p-2.5 rounded-full backdrop-blur-md border border-white/30 z-40 shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
                            <Lock size={14} className="text-white drop-shadow-md" />
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
                  <p className="text-sm font-bold text-slate-400 italic">Henüz hiç defter oluşturmamışsın...</p>
               </div>
            )}
          </div>
        </div>
      </div>

      {/* NEW DIARY MODAL */}
      <AnimatePresence>
         {showNewDiary && (
            <div className="fixed inset-0 bg-slate-800/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
               <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.95}} className="bg-white rounded-[3rem] p-12 max-w-lg w-full shadow-2xl relative">
                  <button onClick={()=>setShowNewDiary(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-800 transition-colors"><X size={24}/></button>
                  <h2 className="text-2xl font-black text-slate-800 italic uppercase mb-8">Yeni Defter Tasarla</h2>
                  
                  <form onSubmit={handleCreateDiary} className="space-y-6">
                     <div>
                        <label className="text-[10px] font-black tracking-widest text-[#FF9B9B] uppercase mb-2 block">Defter Adı</label>
                        <input className="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold text-slate-700" placeholder="Örn: Rüyalarım" value={newDiaryData.title} onChange={e=>setNewDiaryData({...newDiaryData, title:e.target.value})} required/>
                     </div>
                     <div>
                        <label className="text-[10px] font-black tracking-widest text-[#FFB347] uppercase mb-2 block">Kapak Rengi</label>
                        <div className="flex flex-wrap gap-3">
                           {pastelColors.map(color => (
                              <button type="button" key={color} onClick={()=>setNewDiaryData({...newDiaryData, coverColor: color})} className={`w-8 h-8 rounded-full transition-all border border-black/5 ${newDiaryData.coverColor === color ? 'ring-2 ring-offset-2 ring-slate-800 scale-125 shadow-md z-10' : 'hover:scale-110'}`} style={{backgroundColor: color}}/>
                           ))}
                        </div>
                     </div>
                     <label onClick={() => setNewDiaryData({...newDiaryData, isPrivate: !newDiaryData.isPrivate})} className="flex items-center gap-3 cursor-pointer group mt-4">
                        <div className={`w-12 h-6 rounded-full p-1 transition-all flex items-center ${newDiaryData.isPrivate ? 'bg-[#FF9B9B]' : 'bg-slate-200'}`}>
                           <motion.div layout className="w-4 h-4 rounded-full bg-white shadow-sm" animate={{x: newDiaryData.isPrivate ? 24 : 0}} />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600">Gizli Defter (Sadece bana ve izin verdiklerime ulaşıma açık)</span>
                     </label>
                     <button type="submit" className="w-full py-5 rounded-2xl text-white font-black uppercase tracking-[0.2em] shadow-lg mt-4" style={{background:rainbow}}>Defteri Raflara Ekle</button>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default MyDiaries;

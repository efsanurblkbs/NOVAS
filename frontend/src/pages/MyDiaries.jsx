import { useState, useEffect } from "react";
import api from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, PlusCircle, X } from "lucide-react";
import useStore from "../store/useStore";
import DiaryView from "../components/DiaryView";

const rainbow = "linear-gradient(90deg, #FFB5B5, #FFD6A5, #CAFFBF, #9BF6FF, #A0C4FF, #BDB2FF, #FFC6FF)";

const MyDiaries = () => {
  const { user: currentUser } = useStore();
  const [diaries, setDiaries] = useState([]);
  const [activeDiary, setActiveDiary] = useState(null);
  const [showNewDiary, setShowNewDiary] = useState(false);
  const [newDiaryData, setNewDiaryData] = useState({ title: "", coverColor: "#FFB5B5", isPrivate: false });
  
  const pastelColors = [
    "#FFB5B5", "#FFD6A5", "#FDFFB6", "#CAFFBF", "#9BF6FF", "#A0C4FF", "#BDB2FF", "#FFC6FF",
    "#FAD4D4", "#F4E0C0", "#E9F5C5", "#C8E6C9", "#B2EBF2", "#BBDEFB", "#E1BEE7", "#F8BBD0"
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

  // SİHİRLİ DOKUNUŞ: Optimistic Update
  const handleCreateDiary = async (e) => {
    e.preventDefault();
    
    const optimisticId = Date.now().toString();
    const optimisticDiary = {
      ...newDiaryData,
      _id: optimisticId,
      authorId: currentUser._id,
      isOptimistic: true // Yükleniyor efekti için
    };

    const oldDiaries = [...diaries];
    setDiaries([optimisticDiary, ...diaries]);
    setShowNewDiary(false);
    setNewDiaryData({ title: "", coverColor: "#FFB5B5", isPrivate: false });

    try {
      const res = await api.post("/diaries", newDiaryData);
      // Backend'den gelen gerçek veriyle değiştir
      setDiaries(prev => prev.map(d => d._id === optimisticId ? res.data : d));
    } catch(err) {
      setDiaries(oldDiaries);
      alert("Defter eklenemedi, Render uyanıyor olabilir!");
    }
  };

  const handleDiaryClick = (diary) => {
     if (!diary.isOptimistic) setActiveDiary(diary);
  };

  if(!currentUser) return null;

  if(activeDiary) {
    return <DiaryView diary={activeDiary} onBack={() => {setActiveDiary(null); fetchDiaries();}} managementMode={true} allowWrite={true} />;
  }

  return (
    <div className="w-full h-full flex flex-col relative bg-slate-50/30">
      <div className="w-full p-8 md:p-12 pb-8 border-b border-slate-100 bg-white/50 backdrop-blur-md z-10 sticky top-0">
         <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
               <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-slate-800">Günlüğüm</h1>
               <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Defterlerini yönet</p>
            </div>
            <button onClick={() => setShowNewDiary(true)} className="w-full md:w-auto px-6 py-4 rounded-full text-white text-xs font-black uppercase tracking-widest hover:scale-105 shadow-xl transition-all flex items-center justify-center gap-2" style={{background: rainbow}}>
               <PlusCircle size={16} /> Yeni Defter
            </button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            <AnimatePresence>
              {diaries.map((diary, index) => (
                 <motion.div key={diary._id} initial={{opacity:0, scale:0.8}} animate={{opacity:1, scale:1}} transition={{delay: index*0.05}}
                    onClick={() => handleDiaryClick(diary)}
                    className={`relative cursor-pointer group ${diary.isOptimistic ? 'opacity-50 grayscale' : ''}`}
                    style={{ perspective: "1000px" }}
                 >
                    <div className="w-full aspect-[2/3] rounded-r-3xl rounded-l-md shadow-lg group-hover:shadow-2xl transition-all duration-500 flex flex-col justify-center items-center text-center relative overflow-hidden border border-white/20" 
                         style={{ backgroundColor: diary.coverColor || '#FFB5B5' }}>
                       
                       {diary.isOptimistic && (
                         <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/10">
                            <span className="text-[8px] font-black uppercase text-white animate-pulse">Ekleniyor...</span>
                         </div>
                       )}

                       <div className="absolute inset-0 opacity-20 bg-gradient-to-tr from-black/20 to-white/40"></div>
                       <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-black/20 to-transparent z-10"></div>
                       
                       <h3 className="relative z-20 text-xl md:text-2xl font-black italic uppercase tracking-widest text-white/90 drop-shadow-md px-4 break-words">
                         {diary.title}
                       </h3>

                       {(diary.isLocked || diary.isPrivate) && (
                         <div className="absolute top-4 right-4 bg-white/20 p-2 rounded-full backdrop-blur-md">
                            <Lock size={12} className="text-white" />
                         </div>
                       )}
                    </div>
                 </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
         {showNewDiary && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[200] flex items-center justify-center p-4">
               <motion.div initial={{opacity:0, y:50}} animate={{opacity:1, y:0}} exit={{opacity:0, y:50}} className="bg-white rounded-[3rem] p-8 md:p-12 max-w-lg w-full shadow-2xl relative">
                  <button onClick={()=>setShowNewDiary(false)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-800"><X size={24}/></button>
                  <h2 className="text-2xl font-black text-slate-800 italic uppercase mb-8">Yeni Defter</h2>
                  <form onSubmit={handleCreateDiary} className="space-y-6">
                     <input className="w-full bg-slate-50 p-5 rounded-2xl outline-none font-bold text-slate-700 border-2 border-transparent focus:border-[#FF9B9B]/20" placeholder="Defter Adı" value={newDiaryData.title} onChange={e=>setNewDiaryData({...newDiaryData, title:e.target.value})} required/>
                     <div className="flex flex-wrap gap-2">
                        {pastelColors.map(color => (
                           <button type="button" key={color} onClick={()=>setNewDiaryData({...newDiaryData, coverColor: color})} className={`w-8 h-8 rounded-full border-2 ${newDiaryData.coverColor === color ? 'border-slate-800 scale-110' : 'border-transparent'}`} style={{backgroundColor: color}}/>
                        ))}
                     </div>
                     <label onClick={() => setNewDiaryData({...newDiaryData, isPrivate: !newDiaryData.isPrivate})} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-10 h-5 rounded-full p-1 flex items-center ${newDiaryData.isPrivate ? 'bg-[#FF9B9B]' : 'bg-slate-200'}`}>
                           <motion.div layout className="w-3 h-3 rounded-full bg-white" animate={{x: newDiaryData.isPrivate ? 20 : 0}} />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase">Gizli Defter</span>
                     </label>
                     <button type="submit" className="w-full py-5 rounded-2xl text-white font-black uppercase tracking-widest shadow-lg" style={{background:rainbow}}>Defteri Oluştur</button>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default MyDiaries;

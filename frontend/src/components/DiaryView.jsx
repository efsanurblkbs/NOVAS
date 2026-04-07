import { useState, useEffect } from "react";
import api from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Edit2, X, ChevronLeft } from "lucide-react";
import useStore from "../store/useStore";

const rainbow = "linear-gradient(90deg, #FFB5B5, #FFD6A5, #CAFFBF, #9BF6FF, #A0C4FF, #BDB2FF, #FFC6FF)";

const DiaryView = ({ diary, onBack, managementMode = false, allowWrite = false }) => {
  const { user: currentUser } = useStore();
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [newPost, setNewPost] = useState({ title: "", desc: "", isPrivate: false });
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, [diary]);

  const fetchPosts = async () => {
    try {
      const res = await api.get(`/posts?diaryId=${diary._id}`);
      setPosts(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("userId", diary.authorId);
    data.append("authorName", currentUser.username);
    data.append("title", newPost.title);
    data.append("desc", newPost.desc);
    data.append("isPrivate", newPost.isPrivate);
    data.append("diaryId", diary._id);
    if(file) data.append("img", file);

    try {
      if(isEditing && selectedPost) {
        await api.put(`/posts/${selectedPost._id}`, data);
      } else {
        await api.post("/posts", data);
      }
      setNewPost({ title: "", desc: "", isPrivate: false });
      setFile(null);
      setIsEditing(false);
      setSelectedPost(null);
      fetchPosts();
    } catch(err) {
      alert("Hata oluştu!");
    }
  };

  const openEditor = (postToEdit) => {
    setSelectedPost(postToEdit);
    setNewPost({ title: postToEdit.title, desc: postToEdit.desc, isPrivate: postToEdit.isPrivate });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Bu sayfayı yırtmak istediğine emin misin?")) return;
    try {
      await api.delete(`/posts/${id}`);
      setSelectedPost(null);
      setIsEditing(false);
      fetchPosts();
    } catch(err) { alert("Silerken hata!"); }
  };

  const handleDiaryDelete = async () => {
    if(!window.confirm(`"${diary.title}" defterini içindeki tüm anılarla birlikte yakmak istediğine emin misin? Bu işlem geri alınamaz!`)) return;
    try {
      await api.delete(`/diaries/${diary._id}`);
      onBack();
    } catch(err) { alert("Defter silinirken hata oluştu!"); }
  };

  return (
    /* DEĞİŞİKLİK: h-full ve overflow-y-auto eklendi ki mobilde kaydırılabilsin */
    <div className="w-full h-full md:h-[calc(100vh-100px)] bg-[#EADED7] flex items-start md:items-center justify-center p-4 md:p-12 overflow-y-auto md:overflow-hidden shadow-inner relative custom-scrollbar">
      
      {/* Butonlar: Mobilde daha derli toplu */}
      <div className="absolute top-4 left-4 z-50 flex flex-wrap gap-2">
        <button onClick={onBack} className="bg-white/70 backdrop-blur px-3 py-2 rounded-full flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 hover:text-slate-800 transition-all shadow-sm">
           <ChevronLeft size={14} /> Geri
        </button>
        {managementMode && (
          <button onClick={handleDiaryDelete} className="bg-[#FF9B9B]/20 backdrop-blur px-3 py-2 rounded-full flex items-center gap-2 text-[10px] font-black uppercase text-[#FF9B9B] hover:bg-[#FF9B9B] hover:text-white transition-all shadow-sm">
             Defteri Yak
          </button>
        )}
      </div>

      {/* DEFTER ANA GÖVDE: flex-col (mobil) lg:flex-row (PC) */}
      <div className="w-full max-w-7xl mt-12 md:mt-0 h-auto lg:h-[85vh] bg-[#F7F3F0] rounded-3xl lg:rounded-r-3xl lg:rounded-l-md shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col lg:flex-row relative border-4 lg:border-r-8 lg:border-y-8 border-white overflow-hidden">
        
        {/* SOL SAYFA (İçindekiler) - w-full (mobil) lg:w-1/2 (PC) */}
        <div className="w-full lg:w-1/2 h-auto lg:h-full bg-[#FCFAFA] p-6 md:p-10 overflow-y-visible lg:overflow-y-auto custom-scrollbar relative z-10 border-b-2 lg:border-b-0 lg:border-r-2 border-[#EADED7] shadow-[inset_-10px_0_20px_rgba(0,0,0,0.01)] flex flex-col pt-12 md:pt-16">
          <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-slate-800 mb-6 pb-4 border-b-2 border-slate-100">
             {diary.title} - İçindekiler
          </h2>
          
          <div className="space-y-3">
            <AnimatePresence>
              {posts.map((post, idx) => (
                 <motion.div key={post._id} initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} transition={{delay: idx*0.05}}
                    onClick={() => {
                      if (!managementMode && post.isPrivate && post.authorId !== currentUser._id) {
                         alert("Bu sayfa gizli.");
                         return;
                      }
                      setSelectedPost(post); 
                      setIsEditing(false); 
                      // Mobilde içerik kısmına otomatik kaydır (Opsiyonel)
                      document.getElementById('content-area')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`p-4 rounded-xl cursor-pointer transition-all border-l-4 ${selectedPost?._id === post._id ? 'bg-white shadow-md border-[#FF9B9B]' : 'hover:bg-white/50 border-transparent'}`}
                 >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#FFB347]">{new Date(post.createdAt).toLocaleDateString()}</span>
                      {post.isPrivate && <Lock size={12} className="text-[#FF9B9B]" />}
                    </div>
                    <h3 className="font-bold text-sm md:text-base text-slate-700 truncate">{post.title}</h3>
                    <p className="text-[10px] text-slate-400 italic font-bold">Yazan: {post.authorName}</p>
                 </motion.div>
              ))}
            </AnimatePresence>
            {posts.length === 0 && <p className="text-xs font-bold text-slate-300 italic text-center py-6">Henüz yapraklar boş...</p>}
          </div>
        </div>

        {/* SAĞ SAYFA (Okuma/Yazma Alanı) - w-full (mobil) lg:w-1/2 (PC) */}
        <div id="content-area" className="w-full lg:w-1/2 h-auto lg:h-full bg-white p-6 md:p-10 relative z-10 flex flex-col shadow-[inset_10px_0_20px_rgba(0,0,0,0.01)] pt-12 md:pt-16">
          
          <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-4">
            {selectedPost && (managementMode || allowWrite) ? (
              <button onClick={() => { setSelectedPost(null); setIsEditing(false); }} className="text-[9px] font-black uppercase tracking-widest px-3 py-2 rounded-full text-slate-400 hover:bg-slate-50">
                YENİ SAYFA AÇ
              </button>
            ) : <div></div>}

            {selectedPost && !isEditing && (
              <div className="flex gap-2">
                {(selectedPost.authorId === currentUser._id || managementMode) && (
                  <button onClick={() => openEditor(selectedPost)} className="p-2 text-slate-300 hover:text-[#FFB347]"><Edit2 size={16} /></button>
                )}
                {(selectedPost.authorId === currentUser._id || managementMode) && (
                  <button onClick={() => handleDelete(selectedPost._id)} className="p-2 text-slate-300 hover:text-[#FF9B9B]"><X size={16} /></button>
                )}
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!selectedPost && !isEditing ? (
              (managementMode || allowWrite) ? (
                <motion.form key="write" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onSubmit={handleSubmit} className="flex-1 flex flex-col">
                 <input className="w-full text-3xl md:text-5xl font-black border-none focus:ring-0 placeholder:text-slate-100 text-slate-800 p-0 outline-none" placeholder="Başlık" value={newPost.title} onChange={e=>setNewPost({...newPost, title:e.target.value})} required/>
                 
                 <div className="flex flex-wrap items-center gap-4 py-4 mt-2">
                    <label className="px-4 py-2 bg-slate-50 rounded-full cursor-pointer text-[9px] font-black text-slate-400 uppercase tracking-widest">
                       <input type="file" className="hidden" onChange={e=>setFile(e.target.files[0])}/>
                       {file ? `📸 ${file.name.substring(0,10)}...` : 'Görsel Ekle'}
                    </label>
                    <label onClick={() => setNewPost({...newPost, isPrivate: !newPost.isPrivate})} className="flex items-center gap-2 cursor-pointer">
                       <div className={`w-10 h-5 rounded-full p-1 transition-all flex items-center ${newPost.isPrivate ? 'bg-[#FF9B9B]' : 'bg-slate-200'}`}>
                          <motion.div layout className="w-3 h-3 rounded-full bg-white shadow-sm" animate={{x: newPost.isPrivate ? 20 : 0}} />
                       </div>
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Özel</span>
                    </label>
                 </div>

                 <textarea className="flex-1 w-full mt-4 text-base md:text-xl leading-[40px] md:leading-[48px] border-none outline-none focus:ring-0 resize-none font-light text-slate-700 bg-transparent min-h-[300px] py-0" style={{backgroundImage: "linear-gradient(transparent, transparent 39px, #EADED7 39px)", backgroundSize: `100% ${window.innerWidth < 768 ? '40px' : '48px'}`}} placeholder="Bugün neler oldu?" value={newPost.desc} onChange={e=>setNewPost({...newPost, desc:e.target.value})} required/>
                 
                 <button type="submit" className="w-full py-5 mt-4 rounded-2xl text-white font-black uppercase text-[10px] tracking-[0.3em] shadow-lg" style={{background:rainbow}}>
                   Kaydet
                 </button>
              </motion.form>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center opacity-30 py-20">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Okumak için bir sayfa seç.</p>
                </div>
              )
            ) : selectedPost && !isEditing ? (
              <motion.div key="read" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex-1 flex flex-col h-full min-h-0">
                 <h2 className="text-2xl md:text-4xl font-black text-slate-800 italic uppercase mb-6 leading-tight">{selectedPost.title}</h2>
                 <div className="flex-1 pb-10">
                   {selectedPost.img && <img src={selectedPost.img} alt="" className="mb-6 w-full rounded-xl shadow-sm object-cover max-h-64" />}
                   <p className="text-base md:text-lg leading-[40px] md:leading-[48px] font-light text-slate-700 italic whitespace-pre-wrap px-2 py-0" style={{backgroundImage: "linear-gradient(transparent, transparent 39px, #EADED7 39px)", backgroundSize: `100% ${window.innerWidth < 768 ? '40px' : '48px'}`}}>
                     {selectedPost.desc}
                   </p>
                 </div>
              </motion.div>
            ) : isEditing ? (
              <motion.form key="edit" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onSubmit={handleSubmit} className="flex-1 flex flex-col h-full">
                 <input className="w-full text-3xl md:text-5xl font-black border-none focus:ring-0 text-slate-800 p-0 outline-none" value={newPost.title} onChange={e=>setNewPost({...newPost, title:e.target.value})} required/>
                 <textarea className="flex-1 w-full mt-6 text-base md:text-xl leading-[40px] md:leading-[48px] border-none outline-none focus:ring-0 resize-none font-light text-slate-700 bg-transparent min-h-[300px] py-0" style={{backgroundImage: "linear-gradient(transparent, transparent 39px, #EADED7 39px)", backgroundSize: `100% ${window.innerWidth < 768 ? '40px' : '48px'}`}} value={newPost.desc} onChange={e=>setNewPost({...newPost, desc:e.target.value})} required/>
                 <button type="submit" className="w-full py-5 mt-4 rounded-2xl text-white font-black uppercase text-[10px] tracking-[0.3em] shadow-lg" style={{background:rainbow}}>Güncelle</button>
              </motion.form>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DiaryView;

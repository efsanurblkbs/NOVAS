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
  
  // Forms
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
    <div className="w-full h-[calc(100vh-100px)] bg-[#EADED7] flex items-center justify-center p-12 overflow-hidden shadow-inner relative">
      <div className="absolute top-6 left-6 z-50 flex gap-4">
        <button onClick={onBack} className="bg-white/50 backdrop-blur pb-2 px-4 py-2 rounded-full flex items-center gap-2 text-xs font-black uppercase text-slate-500 hover:text-slate-800 transition-all">
           <ChevronLeft size={16} /> Geri Dön
        </button>
        {managementMode && (
          <button onClick={handleDiaryDelete} className="bg-[#FF9B9B]/10 backdrop-blur pb-2 px-4 py-2 rounded-full flex items-center gap-2 text-xs font-black uppercase text-[#FF9B9B] hover:bg-[#FF9B9B] hover:text-white transition-all shadow-sm">
             Tüm Defteri Yak
          </button>
        )}
      </div>

      <div className="w-full max-w-7xl h-[85vh] bg-[#F7F3F0] rounded-r-3xl rounded-l-md shadow-[30px_10px_60px_rgba(0,0,0,0.15)] flex relative border-r-8 border-y-8 border-white">
        
        {/* Sol Sayfa (İçindekiler) */}
        <div className="w-1/2 h-full bg-[#FCFAFA] p-10 overflow-y-auto custom-scrollbar relative z-10 border-r-2 border-[#EADED7] shadow-[inset_-10px_0_20px_rgba(0,0,0,0.02)] flex flex-col pt-16">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-slate-800 mb-8 pb-4 border-b-2 border-slate-100">
             {diary.title} - İçindekiler
          </h2>
          
          <div className="space-y-4">
            <AnimatePresence>
              {posts.map((post, idx) => (
                 <motion.div key={post._id} initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} transition={{delay: idx*0.05}}
                    onClick={() => {
                      if (!managementMode && post.isPrivate && post.authorId !== currentUser._id) {
                         alert("Bu sayfa gizli. Sadece defter sahibi veya sayfayı yazan kişi görebilir.");
                         return;
                      }
                      setSelectedPost(post); 
                      setIsEditing(false); 
                      setNewPost({title:'', desc:'', isPrivate:false}); 
                      setFile(null); 
                    }}
                    className={`p-4 rounded-xl cursor-pointer transition-all border-l-4 ${selectedPost?._id === post._id ? 'bg-white shadow border-[#FF9B9B]' : `hover:bg-white/50 border-transparent ${(!managementMode && post.isPrivate && post.authorId !== currentUser._id) ? "opacity-60 grayscale" : ""}`}`}
                 >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#FFB347]">{new Date(post.createdAt).toLocaleDateString()}</span>
                      {post.isPrivate && <Lock size={12} className="text-[#FF9B9B]" />}
                    </div>
                    <h3 className="font-bold text-slate-700 truncate">{post.title}</h3>
                    <p className="text-xs text-slate-400 italic font-bold">Yazan: {post.authorName}</p>
                 </motion.div>
              ))}
            </AnimatePresence>
            {posts.length === 0 && (
               <p className="text-sm font-bold text-slate-400 italic text-center py-10">Defterin yaprakları bomboş...</p>
            )}
          </div>
        </div>

        {/* Sağ Sayfa (Okuma/Yazma) */}
        <div className="w-1/2 h-full bg-white p-10 overflow-y-auto custom-scrollbar relative z-10 flex flex-col shadow-[inset_10px_0_20px_rgba(0,0,0,0.02)] pt-16">
          
          <div className="flex items-center justify-between mb-8 border-b-2 border-slate-50 pb-6">
            {selectedPost && (managementMode || allowWrite) ? (
              <button onClick={() => { setSelectedPost(null); setIsEditing(false); setNewPost({title:'', desc:'', isPrivate:false}); setFile(null); }} className="text-[10px] font-black uppercase tracking-widest transition-all px-4 py-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 active:scale-95">
                YENİ SAYFA AÇ
              </button>
            ) : <div></div>}

            {selectedPost && !isEditing && (
              <div className="flex gap-2">
                {(selectedPost.authorId === currentUser._id || managementMode) && (
                  <button onClick={() => openEditor(selectedPost)} className="p-2 text-slate-400 hover:text-[#FFB347] hover:bg-slate-50 rounded-full transition-all">
                    <Edit2 size={16} />
                  </button>
                )}
                {(selectedPost.authorId === currentUser._id || managementMode) && (
                  <button onClick={() => handleDelete(selectedPost._id)} className="p-2 text-slate-400 hover:text-[#FF9B9B] hover:bg-slate-50 rounded-full transition-all">
                    <X size={16} />
                  </button>
                )}
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!selectedPost && !isEditing ? (
              (managementMode || allowWrite) ? (
                <motion.form key="write" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onSubmit={handleSubmit} className="flex-1 flex flex-col h-full">
                 <input className="w-full text-5xl font-black border-none focus:ring-0 placeholder:text-slate-200 text-slate-800 p-0 outline-none transition-all" placeholder="Başlık" value={newPost.title} onChange={e=>setNewPost({...newPost, title:e.target.value})} required/>
                 
                 <div className="flex items-center gap-6 py-4 mt-4">
                    <label className="px-6 py-3 bg-slate-50 hover:bg-slate-100 rounded-full cursor-pointer text-[10px] font-black text-slate-500 uppercase tracking-widest transition-all">
                       <input type="file" className="hidden" onChange={e=>setFile(e.target.files[0])}/>
                       {file ? `📸 ${file.name}` : 'Görsel Ekle'}
                    </label>
                    <label onClick={() => setNewPost({...newPost, isPrivate: !newPost.isPrivate})} className="flex items-center gap-3 cursor-pointer group">
                       <div className={`w-12 h-6 rounded-full p-1 transition-all flex items-center ${newPost.isPrivate ? 'bg-[#FF9B9B]' : 'bg-slate-200'}`}>
                          <motion.div layout className="w-4 h-4 rounded-full bg-white shadow-sm" animate={{x: newPost.isPrivate ? 24 : 0}} />
                       </div>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600">Sadece Bize Özel</span>
                    </label>
                 </div>

                 <textarea className="flex-1 w-full mt-4 text-xl leading-[48px] border-none outline-none focus:ring-0 resize-none font-light text-slate-700 bg-transparent" style={{backgroundImage: "linear-gradient(transparent, transparent 47px, #EADED7 47px)", backgroundSize: "100% 48px"}} placeholder="Bugün neler oldu? Veya arkadaşına not bırak..." value={newPost.desc} onChange={e=>setNewPost({...newPost, desc:e.target.value})} required/>
                 
                 <button type="submit" className="w-full py-6 mt-6 rounded-[2rem] text-white font-black uppercase text-xs tracking-[0.4em] shadow-xl hover:shadow-2xl transition-all" style={{background:rainbow}}>
                   Sayfayı Kaydet
                 </button>
              </motion.form>
              ) : (
                <motion.div key="empty" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                   <p className="text-sm font-black uppercase tracking-widest text-slate-500">Okumak için soldan bir sayfa seçebilirsin.</p>
                </motion.div>
              )
            ) : selectedPost && !isEditing ? (
              <motion.div key="read" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex-1 flex flex-col h-full min-h-0">
                 <div className="flex items-center gap-4 mb-4">
                   <span className="px-3 py-1 bg-[#A29BFE]/10 text-[#A29BFE] rounded-full text-[10px] font-black uppercase tracking-widest">YAZAR: {selectedPost.authorName}</span>
                 </div>
                 <h2 className="text-4xl font-black text-slate-800 italic uppercase mb-8">{selectedPost.title}</h2>
                 
                 <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 pb-4">
                   {selectedPost.img && (
                     <div className="mb-8 w-full">
                       <img src={selectedPost.img} alt="" className="max-h-[300px] w-auto rounded-2xl shadow-sm" />
                     </div>
                   )}
                   <p className="text-lg leading-[48px] font-light text-slate-700 italic whitespace-pre-wrap px-2" style={{backgroundImage: "linear-gradient(transparent, transparent 47px, #EADED7 47px)", backgroundSize: "100% 48px"}}>
                     {selectedPost.desc}
                   </p>
                 </div>
              </motion.div>

            ) : isEditing ? (
              <motion.form key="edit" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onSubmit={handleSubmit} className="flex-1 flex flex-col h-full">
                 <input className="w-full text-5xl font-black border-none focus:ring-0 text-slate-800 p-0 outline-none transition-all" value={newPost.title} onChange={e=>setNewPost({...newPost, title:e.target.value})} required/>
                 <textarea className="flex-1 w-full mt-8 text-xl leading-[48px] border-none outline-none focus:ring-0 resize-none font-light text-slate-700 bg-transparent" style={{backgroundImage: "linear-gradient(transparent, transparent 47px, #EADED7 47px)", backgroundSize: "100% 48px"}} value={newPost.desc} onChange={e=>setNewPost({...newPost, desc:e.target.value})} required/>
                 <button type="submit" className="w-full py-6 mt-6 rounded-[2rem] text-white font-black uppercase text-xs tracking-[0.4em] shadow-xl hover:shadow-2xl transition-all" style={{background:rainbow}}>Değişiklikleri Kaydet</button>
              </motion.form>
            ) : null}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};

export default DiaryView;

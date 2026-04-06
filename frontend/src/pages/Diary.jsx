import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Edit2, X } from "lucide-react";

const rainbow = "linear-gradient(90deg, #FF9B9B, #FFB347, #FFD93D, #6BCB77, #4D96FF, #6C5CE7, #A29BFE, #FF85FF)";

const Diary = ({ currentUser }) => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  
  // Forms
  const [newPost, setNewPost] = useState({ title: "", desc: "", isPrivate: false });
  const [file, setFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if(currentUser) {
      fetchPosts();
    }
  }, [currentUser]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`http://localhost:8800/api/posts?profileId=${currentUser._id}&currentUserId=${currentUser._id}`);
      setPosts(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("userId", currentUser._id);
    data.append("authorId", currentUser._id);
    data.append("authorName", currentUser.username);
    data.append("title", newPost.title);
    data.append("desc", newPost.desc);
    data.append("isPrivate", newPost.isPrivate);
    if(file) data.append("img", file);

    try {
      if(isEditing && selectedPost) {
        await axios.put(`http://localhost:8800/api/posts/${selectedPost._id}`, data);
      } else {
        await axios.post("http://localhost:8800/api/posts", data);
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

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if(window.confirm("Bu sayfayı koparmak (silmek) istediğine emin misin?")) {
      try {
        await axios.delete(`http://localhost:8800/api/posts/${id}`, { data: { userId: currentUser._id } });
        if (selectedPost && selectedPost._id === id) {
          setSelectedPost(null);
          setIsEditing(false);
          setNewPost({ title: "", desc: "", isPrivate: false });
        }
        fetchPosts();
      } catch (err) { alert("Silinemedi"); }
    }
  };

  const openEditor = (postToEdit) => {
    setSelectedPost(postToEdit);
    setNewPost({ title: postToEdit.title, desc: postToEdit.desc, isPrivate: postToEdit.isPrivate });
    setIsEditing(true);
  };

  return (
    <div className="w-full h-full p-8 md:p-12 flex items-center justify-center bg-slate-50/50">
      
      {/* Kitap Konteyneri */}
      <motion.div 
        initial={{opacity:0, scale:0.95}} 
        animate={{opacity:1, scale:1}} 
        className="w-full max-w-[1200px] h-[85vh] bg-white shadow-[0_40px_100px_rgba(0,0,0,0.06)] flex rounded-[4rem] relative border-[16px] border-[#F3E9E2]/30 overflow-hidden"
      >
        
        {/* Sol Sayfa: Geçmiş Sayfalar */}
        <div className="w-1/2 h-full bg-[#fcfbf9] border-r-2 border-[#EADED7]/50 p-10 overflow-y-auto custom-scrollbar relative z-10">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-3xl font-black text-slate-800 italic uppercase tracking-tighter">Defterim</h2>
            <div className="text-[10px] font-black tracking-widest text-[#A29BFE] uppercase px-4 py-2 bg-[#A29BFE]/10 rounded-full">
              {posts.length} Sayfa
            </div>
          </div>

          <motion.div className="space-y-4" initial="hidden" animate="visible" variants={{hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}>
            {posts.length > 0 ? posts.map(post => {
              const isSelected = selectedPost?._id === post._id;
              return (
                <motion.div 
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  key={post._id} 
                  onClick={() => {setSelectedPost(post); setIsEditing(false);}} 
                  className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-colors ${isSelected ? 'bg-white border-[#FFB347] shadow-lg' : 'bg-white border-transparent hover:border-[#F3E9E2] shadow-sm'}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-slate-800 text-lg truncate pr-4">{post.title}</h3>
                    {post.isPrivate && <Lock size={14} className="text-[#FF9B9B]" />}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-black tracking-widest uppercase">{new Date(post.createdAt).toLocaleDateString()}</span>
                    <div className={`w-12 h-1 rounded-full ${post.sentiment > 0 ? 'bg-[#6BCB77]' : 'bg-[#FF9B9B]'} opacity-60`}></div>
                  </div>
                </motion.div>
              );
            }) : <p className="text-[10px] text-slate-300 font-black uppercase text-center py-20 tracking-widest">Henüz bir sayfa yazmadın...</p>}
          </motion.div>
        </div>

        {/* Sağ Sayfa: Okuma / Yazma Alanı */}
        <div className="w-1/2 h-full bg-white p-10 overflow-y-auto custom-scrollbar relative z-10 flex flex-col">
          
          <div className="flex items-center justify-between mb-8 border-b-2 border-slate-50 pb-6">
            {selectedPost ? (
              <button 
                onClick={() => {
                  setSelectedPost(null); 
                  setIsEditing(false); 
                  setNewPost({title:'', desc:'', isPrivate:false});
                  setFile(null);
                }} 
                className="text-[10px] font-black uppercase tracking-widest transition-all px-4 py-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 active:scale-95"
              >
                YENİ SAYFA AÇ
              </button>
            ) : (
              <div></div>
            )}

            {selectedPost && !isEditing && selectedPost.authorId === currentUser._id && (
              <div className="flex gap-2">
                 <button onClick={() => openEditor(selectedPost)} className="text-[10px] text-[#FFB347] font-black uppercase tracking-widest hover:underline active:scale-95 transition-transform">DÜZENLE</button>
                 <span className="text-slate-200">|</span>
                 <button onClick={(e) => handleDelete(e, selectedPost._id)} className="text-[10px] text-slate-400 hover:text-red-400 font-black uppercase tracking-widest hover:underline active:scale-95 transition-transform">SİL</button>
              </div>
            )}
          </div>

          <div className="flex-1">
            <AnimatePresence mode="wait">
              
              {/* READ MODE */}
              {selectedPost && !isEditing ? (
                 <motion.div key="read" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.95}} transition={{type: "spring", stiffness: 120}} className="space-y-8">
                   <h2 className="text-4xl font-black text-slate-800 italic uppercase tracking-tighter leading-tight">{selectedPost.title}</h2>
                   {selectedPost.img && (
                     <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="w-full flex justify-center">
                       <img src={selectedPost.img} alt="" className="max-h-[300px] object-contain rounded-3xl shadow-sm" />
                     </motion.div>
                   )}
                   <p className="text-xl leading-[48px] font-light text-slate-700 italic whitespace-pre-wrap px-2" style={{backgroundImage: "linear-gradient(transparent, transparent 47px, #EADED7 47px)", backgroundSize: "100% 48px"}}>
                     {selectedPost.desc}
                   </p>
                 </motion.div>
              ) : (
                 /* WRITE / EDIT MODE */
                 <motion.div key="write" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.95}} transition={{type: "spring", stiffness: 120}} className="h-full flex flex-col">
                    <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6">
                      <input className="w-full text-4xl font-black border-none focus:ring-0 placeholder:text-slate-200 text-slate-800 p-0 outline-none transition-all focus:pl-2" placeholder="Bugünkü Başlığın..." value={newPost.title} onChange={e=>setNewPost({...newPost, title:e.target.value})} required/>
                      
                      <div className="flex flex-wrap items-center gap-4 py-2 border-y border-slate-50">
                        <label className="px-5 py-2 bg-slate-50 hover:bg-slate-100 rounded-full cursor-pointer text-[10px] font-black text-slate-500 uppercase tracking-widest transition-all hover:scale-105 active:scale-95">
                           <input type="file" className="hidden" onChange={e=>setFile(e.target.files[0])}/>
                           {file ? `📸 Seçildi` : 'Görsel Ekle'}
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                           <div className={`w-10 h-5 rounded-full p-1 transition-all flex items-center ${newPost.isPrivate ? 'bg-[#FF9B9B]' : 'bg-slate-200'}`}>
                              <motion.div layout className="w-3 h-3 bg-white rounded-full bg-white shadow-sm" animate={{x: newPost.isPrivate ? 20 : 0}} transition={{type: "spring", stiffness: 500, damping: 30}} />
                           </div>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">Kilitle (Gizli)</span>
                        </label>
                      </div>

                      <textarea className="flex-1 w-full min-h-[300px] text-xl leading-[48px] border-none outline-none focus:ring-0 resize-none font-light text-slate-700 bg-transparent transition-all focus:pl-2" style={{backgroundImage: "linear-gradient(transparent, transparent 47px, #EADED7 47px)", backgroundSize: "100% 48px"}} placeholder="Anlatmaya başla..." value={newPost.desc} onChange={e=>setNewPost({...newPost, desc:e.target.value})} required/>
                      
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full py-5 text-white font-black rounded-full shadow-xl text-[10px] tracking-[0.5em] uppercase transition-all mt-auto flex-shrink-0" style={{background:rainbow}}>
                        {isEditing ? 'Sayfayı Güncelle' : 'Sayfayı Kaydet'}
                      </motion.button>
                    </form>
                 </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        {/* Kitap Ortası Katlama Çizgisi Gölgelendirmesi */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[40px] translate-x-[-50%] bg-gradient-to-r from-transparent via-[#EADED7]/20 to-transparent pointer-events-none z-20"></div>
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#EADED7] to-transparent pointer-events-none z-20"></div>

      </motion.div>
    </div>
  );
};

export default Diary;

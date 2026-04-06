import { motion } from "framer-motion";
import axios from "axios";
import { Lock, Trash2, Edit3 } from "lucide-react";

// Temsili gökkuşağı rengi
const rainbow = "linear-gradient(90deg, #FF9B9B, #FFB347, #FFD93D, #6BCB77, #4D96FF, #6C5CE7, #A29BFE, #FF85FF)";

const PostCard = ({ post, currentUser, isFeed, onPostClick, onRefresh }) => {
  // Eğer yazar kendisiyse veya defter sahibiyse değiştirebilir/silebilir
  const canEdit = post.authorId === currentUser?._id;
  const canDelete = post.authorId === currentUser?._id || post.userId === currentUser?._id;

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm("Bu sayfayı koparmak istediğine emin misin?")) {
      try {
        await axios.delete(`http://localhost:8800/api/posts/${post._id}`, {
          data: { userId: currentUser._id }
        });
        if(onRefresh) onRefresh();
      } catch (err) {
        alert("Silinemedi!");
      }
    }
  };

  return (
    <motion.div 
      onClick={() => onPostClick && onPostClick()}
      className={`p-6 bg-white rounded-[2.5rem] border-2 border-transparent hover:border-[#F3E9E2] cursor-pointer shadow-sm hover:shadow-md transition-all relative overflow-hidden group`}
    >
       <div className="absolute top-0 left-0 w-1 h-full opacity-60" style={{background: post.sentiment > 0 ? '#6BCB77' : post.sentiment < 0 ? '#FF9B9B' : '#FFD93D'}}></div>
       
       <div className="flex justify-between items-start mb-3 pl-2">
         <div>
           <h3 className="font-bold text-slate-800 text-lg sm:text-xl truncate max-w-[200px] sm:max-w-[300px]">{post.title}</h3>
           <div className="flex items-center gap-2 mt-1">
             <span className="text-[10px] text-slate-400 font-black tracking-widest uppercase">{new Date(post.createdAt).toLocaleDateString()}</span>
             {isFeed && (
               <>
                 <span className="text-slate-300">•</span>
                 <span className="text-[10px] text-[#A29BFE] font-black tracking-widest uppercase">YAZAR: {post.authorName}</span>
               </>
             )}
           </div>
         </div>
         <div className="flex gap-2">
           {post.isPrivate && <Lock size={16} className="text-[#FF9B9B]" />}
           {canDelete && !isFeed && (
             <motion.button whileHover={{scale: 1.1}} onClick={handleDelete} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-red-400">
               <Trash2 size={16} />
             </motion.button>
           )}
         </div>
       </div>

       {isFeed && post.desc && (
         <p className="pl-2 mt-4 text-sm text-slate-600 line-clamp-3 font-light leading-relaxed italic">
           "{post.desc}"
         </p>
       )}
    </motion.div>
  );
};

export default PostCard;

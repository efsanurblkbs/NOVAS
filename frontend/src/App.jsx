import { useState, useEffect } from "react";
import api from "./api"; // Updated instance
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import MyDiaries from "./pages/MyDiaries";
import FloatingCats from "./components/FloatingCats";
import useStore from "./store/useStore";

function App() {
  const { user, setUser, setToken, logout } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  if (!user) {
    const rainbow = "linear-gradient(90deg, #FFB5B5, #FFD6A5, #CAFFBF, #9BF6FF, #A0C4FF, #BDB2FF, #FFC6FF)";
    
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50 p-6 relative overflow-hidden font-sans">
        <div className="absolute top-[-5%] left-[-5%] w-[500px] h-[500px] bg-[#FF9B9B]/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[500px] h-[500px] bg-[#4D96FF]/10 rounded-full blur-[100px]"></div>
        
        <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} className="bg-white/80 backdrop-blur-3xl p-16 rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.06)] border border-white w-full max-w-lg z-10">
          <div className="text-center mb-10">
            <h1 className="text-6xl font-black italic uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-r from-[#A29BFE] via-[#FF9B9B] to-[#FFB347] mb-2 pr-4">Novas</h1>
            <h2 className="text-sm font-bold text-slate-400 tracking-widest uppercase">{isLogin ? 'Hoş Geldin' : 'Aramıza Katıl'}</h2>
          </div>

          <form onSubmit={async (e) => {
            e.preventDefault();
            try {
              const url = `/auth/${isLogin?'login':'register'}`;
              const res = await api.post(url, formData);
              if(isLogin || res.data.token) {
                setToken(res.data.token);
                const { token, ...userData } = res.data;
                setUser(userData);
              } else { setIsLogin(true); alert("Kayıt başarılı, giriş yapabilirsin."); }
            } catch(err) { 
              if (err.response && err.response.data && err.response.data.error) {
                alert(err.response.data.error);
              } else if (err.response && typeof err.response.data === 'string') {
                alert(err.response.data);
              } else {
                alert("İşlem başarısız!"); 
              }
            }
          }} className="space-y-6">
            {!isLogin && <input className="w-full px-6 py-5 bg-slate-50/50 rounded-[2rem] outline-none text-slate-700 border-2 border-transparent focus:border-[#FF9B9B]/30 transition-all font-bold" placeholder="Kullanıcı Adı" value={formData.username} onChange={e=>setFormData({...formData, username:e.target.value})} required />}
            <input className="w-full px-6 py-5 bg-slate-50/50 rounded-[2rem] outline-none text-slate-700 border-2 border-transparent focus:border-[#FF9B9B]/30 transition-all font-bold" type="email" placeholder="E-posta" value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})} required />
            <input className="w-full px-6 py-5 bg-slate-50/50 rounded-[2rem] outline-none text-slate-700 border-2 border-transparent focus:border-[#FF9B9B]/30 transition-all font-bold" type="password" placeholder="Şifre" value={formData.password} onChange={e=>setFormData({...formData, password:e.target.value})} required />
            <button type="submit" className="w-full py-6 rounded-[2.5rem] text-white font-black uppercase text-xs tracking-[0.4em] shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all" style={{background:rainbow}}>Defteri Aç</button>
          </form>
          <p className="mt-10 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-800 transition-all cursor-pointer" onClick={()=>setIsLogin(!isLogin)}>{isLogin ? 'Hesabın yok mu? Kaydol' : 'Zaten hesabım var, Giriş Yap'}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {/* DEĞİŞİKLİK: w-screen yerine w-full kullanarak mobil taşmaları önledik */}
      <div className="flex flex-col md:flex-row h-full min-h-screen w-full bg-slate-50 font-sans overflow-hidden">
        
        {/* Sol tarafta Sidebar Navbar */}
        <Sidebar user={user} setUser={setUser} handleLogout={handleLogout} />
        
        {/* Sağ ana içerik */}
        {/* DEĞİŞİKLİK: overflow-y-auto ekledik ki mobilde içerik aşağı kaysın */}
        <main className="flex-1 h-full relative overflow-y-auto custom-scrollbar">
          {/* Arkaplan dekorasyonları */}
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#A29BFE]/5 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#FFB347]/5 rounded-full blur-[120px] pointer-events-none"></div>
          
          <FloatingCats />

          <Routes>
            <Route path="/" element={<Home currentUser={user} />} />
            <Route path="/profile/:id" element={<Profile currentUser={user} />} />
            <Route path="/my-diaries" element={<MyDiaries currentUser={user} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 8px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; border: 2px solid transparent; background-clip: padding-box; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
          ::placeholder { color: #cbd5e1 !important; font-weight: 700; }
        `}</style>
      </div>
    </BrowserRouter>
  );
}

export default App;
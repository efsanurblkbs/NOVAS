# ✨ NOVAS - Kişisel Not ve Günlük Uygulaması

NOVAS, kullanıcıların kendi özel günlüklerini tutabildiği, birbirlerini takip ederek sosyalleşebildiği ve tatlı bir arayüzle anılarını dijital ortamda güvenle saklayabildiği tam kapsamlı (Full-Stack) bir web uygulamasıdır. MacBook Pro ortamında geliştirilmiş ve modern web teknolojileriyle sıfırdan donatılmıştır.

---

## 🌟 Özellikler
- 📖 **Kişisel Günlük Yönetimi:** Kullanıcılar kendi profillerinde "Günlüğüm" sekmesinden pastel tonda yeni kilitli veya açık defterler oluşturabilir ve yazdıklarını güvenle yönetebilirler.
- 🤝 **Sosyal Etkileşim:** Diğer kullanıcıların profillerini ziyaret etme, onları takip etme / takipten çıkma ve açık günlüklerini okuyabilme özellikleri.
- 🎨 **Dinamik & Tatlı Arayüz:** *Framer Motion* ile zenginleştirilmiş pürüzsüz animasyonlar ve ekranda rastgele dolaşan tatlı **"Floating Cats"** (Uçan Kediler) bileşeni!
- 🔒 **Güvenli Kimlik Doğrulama:** JWT (JSON Web Token) tabanlı güvenilir giriş ve kayıt sistemi (Şifreler Bcrypt ile korunmaktadır).
- 📱 **Responsive Tasarım:** Her türlü bilgisayar, tablet ve mobil cihazda harika ve uyumlu çalışan esnek ekran mimarisi.

---

## 🚀 Canlı Linkler
Projenin yayında olan versiyonlarına aşağıdaki bağlantılardan hemen ulaşabilirsiniz:

- 🎨 **Frontend (UI Yayını):** [novas-sigma.vercel.app](https://novas-sigma.vercel.app)
- ⚙️ **Backend (API Yayını):** [novas-backend-8vb4.onrender.com](https://novas-backend-8vb4.onrender.com)

---

## 🛠️ Kullanılan Teknolojiler

| Alan | Teknolojiler |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS, Framer Motion, Zustand |
| **Backend** | Node.js, Express.js |
| **Veritabanı** | MongoDB Atlas |
| **Deployment** | Vercel (Frontend UI), Render (Backend API) |

---

## 💻 Yerel (Local) Kurulum

Eğer bu projeyi kendi bilgisayarınızda indirip çalıştırmak isterseniz aşağıdaki adımları sırasıyla uygulayabilirsiniz:

**1. Depoyu Klonlayın:**
```bash
git clone https://github.com/efsanurblkbs/NOVAS.git
cd NOVAS
```

**2. Backend Kurulumu:**
Yeni bir terminalde backend klasörüne gidip bağımlılıkları yükleyin:
```bash
cd backend
npm install
npm start
```
> *(Dikkat: Kendi bilgisayarınızda test etmek için `backend` klasörü içine `MONGO_URI`, `JWT_SECRET` vb. değişkenleri barındıran bir `.env` dosyası oluşturmanız gerekmektedir).*

**3. Frontend Kurulumu:**
Yine yeni bir terminal açarak frontend tarafını ayaklandırın:
```bash
cd frontend
npm install
npm run dev
```

Güzel günlük tutmalar!

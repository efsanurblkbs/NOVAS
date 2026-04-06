# ✨ NOVAS - Kişisel Not ve Günlük Uygulaması

NOVAS, kullanıcıların kendi özel günlüklerini tutabildiği, birbirlerini takip ederek sosyalleşebildiği ve "pofuduk" tatlı bir arayüzle anılarını dijital ortamda güvenle saklayabildiği tam kapsamlı (Full-Stack) bir web uygulamasıdır. MacBook Pro ortamında geliştirilmiş ve modern web teknolojileriyle sıfırdan donatılmıştır.

---

## 🌟 Özellikler
- 📖 **Kişisel Günlük Yönetimi:** Kullanıcılar kendi profillerinde pastel tonlarda yeni kilitli veya açık defterler oluşturabilir ve yazdıklarını yönetebilirler.
- 🤝 **Sosyal Etkileşim:** Diğer kullanıcıların profillerini ziyaret etme, onları takip etme / takipten çıkma özellikleri.
- 🎨 **Dinamik & Tatlı Arayüz:** *Framer Motion* ile zenginleştirilmiş animasyonlar ve ekranda rastgele dolaşan tatlı **"Floating Cats"** eklentisi.
- 🔒 **Güvenli Kimlik Doğrulama:** JWT (JSON Web Token) tabanlı güvenilir giriş ve kayıt sistemi.
- 📱 **Responsive Tasarım:** Bilgisayar, tablet ve mobil cihazlarda harika ve tam uyumlu çalışan estetik mimari.

---

## 🚀 Canlı Linkler
Projenin yayında olan versiyonlarına aşağıdaki bağlantılardan hemen ulaşabilirsiniz:

- 🎨 **Frontend (UI Yayını):** [novas-git-main-efsa-bolukbass-projects.vercel.app](https://novas-git-main-efsa-bolukbass-projects.vercel.app)
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

Projeyi klonlayıp kendi cihazınızda çalıştırmak için adımları sırasıyla uygulayabilirsiniz:

**1. Depoyu Klonlayın:**
```bash
git clone https://github.com/efsanurblkbs/NOVAS.git
cd NOVAS
```

**2. Backend Kurulumu:**
Terminalde backend klasörüne geçip gereksinimleri yükleyin:
```bash
cd backend
npm install
npm start
```
> *(Not: Kendi cihazınızda çalıştırırken MongoDB ve Secret bağlantıları için backend içinde uygun bir `.env` dosyası tanımladığınızdan emin olun).*

**3. Frontend Kurulumu:**
Yeni bir terminalde frontend'i ayaklandırın:
```bash
cd frontend
npm install
npm run dev
```

Keyifli günlük tutmalar! 🌸📓

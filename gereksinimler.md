# 📋 NOVAS - Sistem Gereksinimleri

Bu doküman, NOVAS kişisel not ve dijital günlük platformunun hem fonksiyonel (kullanıcıların yapabildikleri) hem de fonksiyonel olmayan (sistemin teknik yapısı) gereksinimlerini listeler.

## 1. Kullanıcı Gereksinimleri (Functional Requirements)

### 1.1. Kimlik Doğrulama ve Yönetim (Auth)
* **Kayıt Olma (Register):** Kullanıcılar; benzersiz bir kullanıcı adı, geçerli bir e-posta ve güvenli bir şifre belirleyerek sisteme kaydolabilir. (Eğer e-posta veya isim kullanımdaysa hata mesajı alırlar).
* **Giriş Yapma (Login):** Kullanıcı adı ve şifre ile güvenli giriş.
* **Profil Düzenleme:** Sisteme giriş yapan kullanıcı, cihaz galerisinden kendine özel bir profil (avatar) fotoğrafı yükleyebilir ve güncelleyebilir.

### 1.2. Günlük (Defter) Yönetimi
* **Yeni Defter Oluşturma:** Kullanıcı; başlık, 20 farklı renk paletinden kapak rengi belirleyerek ve "Kilitli (Gizli)" olup olmayacağını seçerek yeni bir defter oluşturabilir.
* **Defter Görüntüleme:** Kullanıcı, "Günlüğüm" (Yönetim Paneli) sayfası üzerinden tüm defterlerini filtreleyip, açabilir.
* **Defter Silme (Yakma):** Bir defter ve içindeki tüm notlar, defterin sahibi tarafından tamamen silinebilir.

### 1.3. Sayfa ve Not Yönetimi
* **Yeni Sayfa (Post) Yazma:** Bir defterin içerisine girildiğinde tarih ve isim atılarak yeni günlüğe yaprak eklenebilir.
* **Fotoğraf Ekleme:** Günlük sayfalarına görsel / resim eklenebilir.
* **Sayfa Bazlı Gizlilik:** Zaten açık olan bir defterin içindeki spesifik bir yaprak dahi "Sadece Bize Özel" işaretlenerek diğer okurlardan tamamen gizlenebilir.

### 1.4. Sosyal Etkileşim ve Profiller ("Vitrin" Modeli)
* **Keşfet (Home):** Akış sayfasında "Kilitli OLMAYAN" (Public) tüm günlükler karıştırılarak listelenir.
* **Kullanıcı Takibi:** Başka bir kullanıcının profiline gidildiğinde kullanıcı takip (Follow) edilebilir ya da takipten çıkılabilir (Unfollow).
* **Salt Okunur Profil:** Başkalarının profillerine girildiğinde o profil yalnızca bir "Vitrin" görevi görür, ziyaretçiler yetkileri yoksa yazı yazamaz, defterlerin adını görebilir.
* **Erişim İzni İsteme:** Kilitli bir deftere okumak amaçlı girmek isteyen ziyaretçi "Erişim İzni İste" tuşuna basar ve defter sahibine bir onay/izin bildirimi düşer.

### 1.5. Bildirim (Notification) Sistemi
* **Gelen İstekler:** Bir kullanıcı takip edildiğinde veya kilitli defterine erişim istendiğinde, o kullanıcıya özel Bildirim (Zil) paneline bildirim düşer.
* **Karar Verme:** Erişin izinleri tek tuşla onaylanabilir (İzin Ver) veya reddedilebilir (Reddet). Takip bildirimleri ise onaylanarak ("Harika!") kapatılabilir.

---

## 2. Sistem Gereksinimleri (Non-Functional Requirements)

### 2.1 Teknolojik Altyapı
* **Frontend:** React.js tabanlı, Vite ile paketlenmiş, Tailwind CSS ile stillendirilmiş ve Zustand ile State yönetimi sağlanmıştır.
* **Backend:** Node.js ve Express.js ortamında kurulmuştur.
* **Veritabanı:** NoSQL yapısıyla MongoDB (Mongoose ORM).
* **Güvenlik:** Bcrypt (Şifrelerin gizlenmesi), JWT (API koruması ve güvenlik yetkilendirmesi).
* **Medya Saklama:** Cloudinary API kullanılarak fotograflar uzak sunucuda saklanmaktadır.

### 2.2 Mimari Tasarım Kararları
* Uygulama, ziyaretçilerin içeriği görüntüleyebildiği **Profil (Read-Only)** ve yazarın kontrolü elinde tuttuğu **Günlüğüm (Management Panel)** olmak üzere iki fiziki/mantıksal yönetim birimine bölünmüştür.
* **Performans:** Modern Framer Motion kitaplığı kullanılarak pürüzsüz "Floating Book" (Havada asılı defter), geçiş ve 3D efektleri FPS düşürmeden oluşturulur.
* Tamamen mobil uyumlu, esnek (Responsive) Flex ve Grid mimarisi hakimdir.

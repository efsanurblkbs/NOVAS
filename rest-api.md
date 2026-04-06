# 🌐 NOVAS - REST API Dokümantasyonu

Bu doküman, NOVAS platformunun Node.js & Express arka ucundaki (backend) RESTful API mimarisini, uç noktaları (endpoints), fonksiyonları ve bekledikleri parametreleri içerir. 

Bağlantı Noktası (Base URL): `/api` 

*(Not: "🔒" işareti olan uç noktalar HTTP Header içerisinde `Authorization: Bearer <TKN>` formatında JWT Token gerektirir).*

---

## 1. Kimlik Doğrulama (Auth)

### `POST /auth/register`
* **Amaç:** Yeni bir kullanıcı kaydı oluşturur.
* **Body:** `{ "username": "efsa", "email": "test@test.com", "password": "pass" }`
* **Yanıt (200):** Oluşturulan kullanıcı nesnesi ve JSON Web Token.

### `POST /auth/login`
* **Amaç:** Mevcut bir kullanıcının sisteme giriş yapmasını sağlar.
* **Body:** `{ "username": "efsa", "password": "pass" }`
* **Yanıt (200):** JWT (access_token) ve kullanıcı objesi döndürür (Şifre gizlenerek).

---

## 2. Kullanıcılar (Users)

### `GET /users` 🔒
* **Amaç:** Sistemdeki tüm kullanıcıları ana sayfada listelemek üzere sayfalama (Pagination) mantığı ile getirir.
* **Yanıt (200):** Kullanıcı objeleri ve sahip oldukları açık (Public) günlük sayılarını içeren temizlenmiş dizi.

### `GET /users/:id` 🔒
* **Amaç:** Belirtilen `id`'ye sahip kullanıcının profil bilgilerini (takipçileri, takip ettikleri vb.) getirir.

### `PUT /users/:id/avatar` 🔒
* **Amaç:** Kullanıcının profil fotoğrafını günceller.
* **Form-Data (Body):** `profilePicture` (File Object). *(Not: Cloudinary tarafına upload edilir).*

### `PUT /users/:id/follow` 🔒
* **Amaç:** Token sahibi kullanıcının `id`'si verilen kullanıcıyı takip etmesini sağlar. Bildirim modeline "FOLLOW" objesi gönderir.

### `PUT /users/:id/unfollow` 🔒
* **Amaç:** Takip edilen kullanıcının takipten çıkılması işlemini yapar.

---

## 3. Günlükler / Defterler (Diaries)

### `POST /diaries` 🔒
* **Amaç:** Sisteme yeni bir kitap/defter (Diary) ekler.
* **Body:** `{ "title": "Başlık", "coverColor": "#A0C4FF", "isPrivate": true/false }`
* **İlişki:** Yazar olarak otomatik olarak JWT token içerisindeki `req.user.id`'yi atar.

### `GET /diaries` 🔒
* **Amaç:** Keşfet ana ekranı için sistemdeki, tüm kullanıcılara açık olan (isLocked: false) defterleri listeler.

### `GET /diaries/user/:userId` 🔒
* **Amaç:** Spesifik bir profil ekranına veya yazarın "Günlüğüm" paneline ait olan defterleri özel / gizli algoritmalarına uygun listeletir.

### `DELETE /diaries/:id` 🔒
* **Amaç:** Bütün bir defteri (ve bağlı olduğu / içindeki sayfaları "Cascade" biçiminde) veritabanından kalıcı olarak siler ve yakar.

---

## 4. Sayfalar (Posts)

### `POST /posts/:diaryId` 🔒
* **Amaç:** İçeriğine girilmiş bir defterin içerisine tekil bir yaprak / sayfa yazar. Cloudinary bağlantısıyla fotoğraf eklenebilir.
* **Body/Form-Data:** `title` (opsiyonel), `desc`, `isPrivate`, `file` (image).

### `GET /posts/:diaryId` 🔒
* **Amaç:** Belirtilen defterin içindeki günce sayfalarını listeler. Güvenlik önlemleriyle (Ziyaretçilerden gizlenmesi gereken özel defterleri / özel postları maskeler).

---

## 5. Bildirimler (Notifications)

### `GET /notifications` 🔒
* **Amaç:** İstek yapan kullanıcıya gelen ve beklemede olan / sonuçlanan tüm erişim (ACCESS_REQUEST) veya Takip (FOLLOW) bildirimlerini dizi olarak getirir.

### `POST /notifications/request` 🔒
* **Amaç:** Kilitli olan bir defterin sahibine "Okumak İstiyorum" isteği yollanır.

### `PUT /notifications/:id/respond` 🔒
* **Amaç:** Bize gönderilen "Kilitli Defter İsteğini" cevaplar (APPROVE veya REJECT). APPROVE ise yetkili listesine dahil edilir.

### `DELETE /notifications/:id` 🔒
* **Amaç:** Kullanıcının panelinden okunmuş veya önemsiz bildirim bloğunun silinmesi.

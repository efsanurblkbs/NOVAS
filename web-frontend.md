# 🖥️ NOVAS - Web Frontend Dokümantasyonu

Bu doküman, NOVAS projesinin kullanıcı arayüzü (UI) geliştirme aşamalarını, State (durum) yönetimini ve genel mimari yapılarını listeler. Frontend, tamamen **Vite + React.js** ile derlenmiştir.

## 1. Proje Mimarisinin Yapı Taşları
- **Framework:** Vite çatısı altına kurulmuş React fonksiyonel bileşen mimarisi.
- **Styling (Arayüz Giydirme):** Vanilla CSS ve Tailwind CSS (%80 utility sınıfları ve UI componentleri).
- **Animasyon Ağı:** `framer-motion` ile pürüzsüz ve gerçekçi efektler (Kitap açılma/dönme efektleri, pop-up modal animasyonları, FloatingCats).
- **HTTP/API Katmanı:** `axios` tabanlı global interceptor'lar kullanılarak hazırlanan modüler API mimarisi (Token header enjeksiyonu otomatikleşmiştir `api.js`).
- **Durum Yönetimi (State):** Lokal React Context'ler yerine `Zustand` devtools kütüphanesi tercih edilmiş, Persistent Store mimarisi inşa edilmiştir (`useStore.js`).
- **Yönlendirmeler:** `react-router-dom` ile Client-Side Rendering geçişleri.

---

## 2. Ön-Uç (Frontend) Ana Bileşenleri

### 2.1. Bileşen Modülleri (Components)
* **`Sidebar.jsx` (Dinamik Kenar Çubuğu):** Kullanıcının Navigasyon merkezidir. İçerisinde Çıkış yapma, Defterlere Gitme, Profiline düşenleri görme ve gerçek zamanlı Bildirim Zili (Dropdown) sistemini hapseder.
* **`DiaryView.jsx`:** Tüm uygulamanın kalbi olan dev "Açık Defter" bileşenidir. 
  - *Mimari:* Sağ - Sol (veya esnek mobil) olarak ikiye bölünmüş kitap arayüzü.
  - *Yetki Kontrolü:* İçinde barındırdığı `managementMode` propları üzerinden "kendi defterini gören", "misafir gelen" veya "okuma izni almış" kişilere sayfaları / tuşları render edip etmeme algoritmalarına sahiptir.
* **`FloatingCats.jsx`:** Kullanıcının projedeki "pofuduk" deneyimi hissetmesi için DOM üzerinde `fixed` animasyonlarla zıplayan rastgele kedi ikonografisini render eder.

### 2.2. Ana Sayfalar (Pages)
* **`App.jsx` (Giriş/Kayıt Katmanı):** State tarafında `user` nesnesinin bulunmaması durumunda tüm Router'ı izole edip yalnızca "Login" veya "Register" UI panellerini oluşturur. Cıvıl cıvıl soft degradelerle donatılmış, güvenli giriş katmanıdır.
* **`Home.jsx` (Ana Akış):** Başkalarının yazdığı açık (Public) defterlerin listesi, sistemdeki kullanıcı vitrini ve en son giriş yapanların profil fotoğraf baloncukları ile şık tasarlanmış keşif haritasıdır.
* **`Profile.jsx` (Salt-Okunur Vitrin):** ID tabanlı çalışan profil URL'sidir. Sadece defter kapaklarının, kilitlerin, rozetlerin, takip edilme tuşlarının olduğu; defter oluşturulmasının **yasaklandığı** sadece bir sosyal sergileme vitrinidir.
* **`MyDiaries.jsx` (Yönetim Üssü):** Tamamen giriş yapan kullanıcıya dedike edilmiş özel bir "Panel". Profilinden tamamen izole olan bu panelde "Yeni Defter Yaratma (20 renkle), kilit koyma" ve "Defter Komple Silme" yetkilerine dair butonları/modelleri içeren çalışma masasıdır.

---

## 3. Görevler ve Eklenen Revizyonlar
Proje serüveninde Frontend mimarisinde çözülen majör estetik görevler:
1. **Defter Kapaklarının Şaheserleşmesi:** Dümdüz "div" bileşenlerinden ziyade CSS gölgelendirmesi, radyal filtreler, sol taraftaki karanlık antika kitap sırtı (Spine), ışık vurduğunda parlayan beyaz/altın varak (Emboss effect) ve fare üzerine gelince oynayan "Kırmızı Kurdele Ayracı" eklendi.
2. **Bildirim Algoritması:** Takip edilme ("FOLLOW") ve Erişim İsteği onaylarını asenkron backend üzerinden çekip açılan pencerelere dahil eden dinamik listeler yapıldı.
3. **Yumuşatılmış Renk Terapisi:** Kullanıcı uyarısıyla neon, agresif gökkuşağı paletinden derhal uzaklaşılarak; Pastel Lavantalar, Açık Somonlar, Nil Yeşili renklerinden oluşan yumuşak pastel gökkuşağı kombinasyonları formlara nakşedildi. Mükemmel bir "soft/pofuduk" atmosfer yakalandı.

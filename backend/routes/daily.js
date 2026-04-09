import express from "express";

const router = express.Router();


const famousQuotes = [
    { text: "Bilim ve sanat, takdir edilmediği yerden göç eder.", author: "İbn-i Sina" },
    { text: "Zorluklar, başarının değerini artıran süslerdir.", author: "Moliere" },
    { text: "Yarın bambaşka bir insan olacağım diyorsun. Niye bugünden başlamıyorsun?", author: "Epiktetos" },
    { text: "Kendini yönetirsen dünyayı yönetecek gücü bulursun.", author: "Platon" },
    { text: "Sadece güneşli günlerde yürürsen hedefe asla varamazsın.", author: "Paulo Coelho" }
];

const dailyGoals = [
    { text: "Bugün en az 20 sayfa kitap oku.", author: "NOVAS Hedef" },
    { text: "Bugün daha önce hiç denemediğin bir içecek dene.", author: "NOVAS Hedef" },
    { text: "Bitirmen gereken o kod bloğunu bugün tamamla!", author: "NOVAS Hedef" },
    { text: "Bugün bir arkadaşına beklenmedik bir selam ver.", author: "NOVAS Hedef" },
    { text: "Yarım kalan günlüğüne bugün yeni bir not ekle.", author: "NOVAS Hedef" }
];

const motivations = [
    { text: "Her şey senin elinde, pofuduk bir gün dilerim!", author: "NOVAS Motivasyon" },
    { text: "Başarı, hazırlık ve fırsatın karşılaştığı yerdir.", author: "NOVAS Motivasyon" },
    { text: "Hatalar, bir şeyleri denediğinin en büyük kanıtıdır.", author: "NOVAS Motivasyon" },
    { text: "Bugün dünden daha güçlüsün, bunu unutma.", author: "NOVAS Motivasyon" },
    { text: "Küçük adımlar, büyük yolların başlangıcıdır.", author: "NOVAS Motivasyon" }
];

// --- 24 SAATTE BİR DEĞİŞME MANTIĞI ---
router.get("/cards", (req, res) => {
    try {
        const today = new Date();
        // Yıl + Ay + Gün toplamıyla her güne özel bir sayı (seed) üretiyoruz
        const dateSeed = today.getFullYear() + today.getMonth() + today.getDate();
        
        // Modülo operatörü (%) ile listeden o güne özel elemanı seçiyoruz
        const getDaily = (arr) => arr[dateSeed % arr.length];

        res.status(200).json({
            famous: getDaily(famousQuotes),
            goal: getDaily(dailyGoals),
            motivation: getDaily(motivations)
        });
    } catch (err) {
        res.status(500).json({ message: "Sunucu hatası, kartlar yüklenemedi." });
    }
});

export default router;
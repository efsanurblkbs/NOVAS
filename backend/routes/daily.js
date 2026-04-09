import express from "express";

const router = express.Router();

// Günlük içerik havuzumuz
const famousQuotes = [
    { text: "Bilim ve sanat, takdir edilmediği yerden göç eder.", author: "İbn-i Sina" },
    { text: "Zorluklar, başarının değerini artıran süslerdir.", author: "Moliere" },
    { text: "Yarın bambaşka bir insan olacağım diyorsun. Niye bugünden başlamıyorsun?", author: "Epiktetos" }
];

const dailyGoals = [
    { text: "Bugün en az 20 sayfa kitap oku.", author: "Hedef" },
    { text: "Bugün daha önce hiç denemediğin bir yemeği veya içeceği dene.", author: "Hedef" },
    { text: "Bitirmen gereken o kod bloğunu bugün tamamla!", author: "Hedef" }
];

const motivations = [
    { text: "Her şey senin elinde, pofuduk bir gün dilerim!", author: "Motivasyon" },
    { text: "Başarı, hazırlık ve fırsatın karşılaştığı yerdir.", author: "Motivasyon" },
    { text: "Hatalar, bir şeyleri denediğinin en büyük kanıtıdır.", author: "Motivasyon" }
];

router.get("/cards", (req, res) => {
 
    const dayOfYear = new Date().getDate(); 
    const getDaily = (arr) => arr[dayOfYear % arr.length];

    res.json({
        famous: getDaily(famousQuotes),
        goal: getDaily(dailyGoals),
        motivation: getDaily(motivations)
    });
});

export default router;
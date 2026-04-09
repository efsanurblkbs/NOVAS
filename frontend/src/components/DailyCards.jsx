import React, { useEffect, useState } from 'react';
import api from '../api'; // Senin merkezi api yapılandırman

const DailyCards = () => {
    const [cards, setCards] = useState(null);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const res = await api.get('/daily/cards');
                setCards(res.data);
            } catch (err) {
                console.log("Kartlar yüklenemedi", err);
            }
        };
        fetchCards();
    }, []);

    if (!cards) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
                { title: "Günün Sözü", data: cards.famous, color: "#6c63ff" },
                { title: "Günlük Hedef", data: cards.goal, color: "#FFB347" },
                { title: "Motivasyon", data: cards.motivation, color: "#FF9B9B" }
            ].map((item, index) => (
                <div key={index} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50 flex flex-col justify-center min-h-[180px] transition-all hover:shadow-md">
                    <span className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: item.color }}>
                        {item.title}
                    </span>
                    <p className="text-sm md:text-base text-slate-600 font-bold leading-relaxed italic">
                        "{item.data.text}"
                    </p>
                    {item.data.author && (
                        <span className="text-[9px] text-slate-400 font-black uppercase mt-3 italic text-right">
                            — {item.data.author}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
};

export default DailyCards;
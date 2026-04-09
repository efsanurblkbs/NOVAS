import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./DailyCards.css"; 

const DailyCards = () => {
    const [cards, setCards] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                
                const res = await axios.get('http://localhost:8800/api/daily/cards');
                setCards(res.data);
                setLoading(false);
            } catch (err) {
                console.log("Kartlar yüklenirken bir hata oluştu dostum:", err);
                setLoading(false);
            }
        };
        fetchCards();
    }, []);

    if (loading || !cards) return null;

    return (
        <div className="daily-cards-container">
            <div className="daily-card famous">
                <div className="card-icon">🌟</div>
                <h5>Günün Sözü</h5>
                <p>"{cards.famous.text}"</p>
                <span>- {cards.famous.author}</span>
            </div>

            <div className="daily-card goal">
                <div className="card-icon">🎯</div>
                <h5>Günlük Hedef</h5>
                <p>{cards.goal.text}</p>
                <span>Sana inanıyorum!</span>
            </div>

            <div className="daily-card motivation">
                <div className="card-icon">🔥</div>
                <h5>Motivasyon</h5>
                <p>"{cards.motivation.text}"</p>
                <span>Hadi başlayalım!</span>
            </div>
        </div>
    );
};

export default DailyCards;
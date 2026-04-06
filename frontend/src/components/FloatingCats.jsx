import { motion } from "framer-motion";

const CatSVG = ({ color }) => (
  <svg width="60" height="60" viewBox="0 0 100 100" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M82.5 35V15L67.5 25C62.5 22.5 56.5 21 50 21C43.5 21 37.5 22.5 32.5 25L17.5 15V35C12.5 41 9.5 48.5 9.5 56.5C9.5 76 27.5 92 50 92C72.5 92 90.5 76 90.5 56.5C90.5 48.5 87.5 41 82.5 35Z" />
    <circle cx="35" cy="55" r="4" fill="white" />
    <circle cx="65" cy="55" r="4" fill="white" />
    <path d="M47 67H53L50 71L47 67Z" fill="white" />
    <path d="M50 71C50 71 45 76 40 73M50 71C50 71 55 76 60 73" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M25 60H15M85 60H75M25 68H18M82 68H75" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const FloatingCats = () => {
  // Rastgele pastel kediler oluşturalım
  const cats = [
    { id: 1, color: "#FF9B9B", initialX: "10%", initialY: "20%", duration: 15 },
    { id: 2, color: "#A29BFE", initialX: "80%", initialY: "15%", duration: 20 },
    { id: 3, color: "#FFB347", initialX: "85%", initialY: "75%", duration: 18 },
    { id: 4, color: "#6BCB77", initialX: "15%", initialY: "80%", duration: 22 },
    { id: 5, color: "#FFD93D", initialX: "50%", initialY: "10%", duration: 25 },
    { id: 6, color: "#FF85FF", initialX: "40%", initialY: "85%", duration: 17 }
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-40">
      {cats.map((cat) => (
        <motion.div
          key={cat.id}
          className="absolute"
          style={{ left: cat.initialX, top: cat.initialY }}
          animate={{
            y: ["0%", "20px", "-20px", "0%"],
            x: ["0%", "-15px", "15px", "0%"],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: cat.duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          <motion.div
             animate={{ rotate: [0, -10, 10, 0] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: cat.id }}
             className="drop-shadow-lg"
          >
             <CatSVG color={cat.color} />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingCats;

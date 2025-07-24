import { useEffect } from "react";
import { motion } from "framer-motion";

export function Confetti() {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Cleanup happens automatically when component unmounts
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  const colors = ['#FF6B6B', '#4ECDC4', '#FECA57', '#FF9FF3', '#96CEB4'];
  const confettiPieces = Array.from({ length: 50 }, (_, i) => i);

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {confettiPieces.map(i => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            backgroundColor: colors[i % colors.length],
            left: `${Math.random() * 100}vw`,
          }}
          initial={{
            y: -10,
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            y: '100vh',
            rotate: 360,
            opacity: 0,
          }}
          transition={{
            duration: Math.random() * 2 + 2,
            delay: Math.random() * 0.5,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

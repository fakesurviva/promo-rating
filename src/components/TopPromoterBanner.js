import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { getTopPromoter } from '../firebase/promoterService';
import PromoterCard from './PromoterCard';

const TopPromoterBanner = () => {
  const [topPromoter, setTopPromoter] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const fetchTopPromoter = async () => {
      try {
        const data = await getTopPromoter();
        setTopPromoter(data);
        
        if (data) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        }
      } catch (error) {
        console.error('Ошибка при загрузке лучшего промоутера:', error);
      }
    };
    
    fetchTopPromoter();
    
    // Обработчик изменения размера окна для конфетти
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  if (!topPromoter) return null;
  
  return (
    <div className="my-8">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.1}
        />
      )}
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          boxShadow: [
            "0 0 0 rgba(139, 92, 246, 0)",
            "0 0 20px rgba(139, 92, 246, 0.7)",
            "0 0 0 rgba(139, 92, 246, 0)",
          ]
        }}
        transition={{ 
          duration: 0.5,
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }
        }}
        className="bg-gradient-to-r from-secondary-dark to-secondary rounded-xl p-6 shadow-lg"
      >
        <div className="text-center mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            🏆 Самый быстрый промоутер месяца 🏆
          </h2>
        </div>
        
        <div className="max-w-md mx-auto">
          <PromoterCard 
            promoter={topPromoter} 
            isTopPromoter={true} 
          />
        </div>
      </motion.div>
    </div>
  );
};

export default TopPromoterBanner; 
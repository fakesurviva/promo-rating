import React from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaLeaf } from 'react-icons/fa';

const PromoterCard = ({ promoter, rank, isTopPromoter = false }) => {
  // Если нет аватарки, используем иконку пользователя
  const avatarUrl = promoter.avatarUrl || null;
  
  // Определяем класс для ранга
  const getRankClass = (rank) => {
    if (rank === 1) return 'rank-1';
    if (rank === 2) return 'rank-2';
    if (rank === 3) return 'rank-3';
    return 'text-gray-500 border-gray-500 bg-dark-darker';
  };
  
  return (
    <motion.div
      whileHover={{ 
        y: -10, 
        transition: { type: 'spring', stiffness: 300 }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: rank * 0.1 }}
      className={`promoter-card card ${isTopPromoter ? 'shadow-neon-purple' : 'card-hover'} relative`}
    >
      {/* Ранг */}
      {rank && (
        <div className={`rank-badge ${getRankClass(rank)}`}>
          {rank}
        </div>
      )}
      
      <div className="flex items-center">
        {/* Аватарка */}
        <div className="mr-4">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={`${promoter.name}`} 
              className="w-16 h-16 rounded-full object-cover border-2 border-primary shadow-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(promoter.name)}&background=random&color=fff&size=128`;
              }}
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-dark-lighter flex items-center justify-center border-2 border-primary shadow-lg">
              <FaUser className="text-2xl text-gray-400" />
            </div>
          )}
        </div>
        
        {/* Информация */}
        <div className="flex-1">
          <h3 className={`text-lg font-bold ${isTopPromoter ? 'text-neon-purple' : 'text-white'}`}>
            {promoter.name}
          </h3>
          
          <div className="flex items-center mt-1">
            <FaLeaf className="text-green-500 mr-2" />
            <span className="text-gray-300">
              {promoter.leafletsCount} листовок
            </span>
          </div>
        </div>
      </div>
      
      {/* Награда для лучшего промоутера */}
      {isTopPromoter && promoter.reward && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <p className="text-yellow-400 font-medium flex items-center">
            <span className="text-xl mr-2">🏆</span> 
            Награда: {promoter.reward}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default PromoterCard; 
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTopPromoters } from '../firebase/promoterService';
import PromoterCard from './PromoterCard';

const PromotersList = ({ limit = 10 }) => {
  const [promoters, setPromoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPromoters = async () => {
      try {
        setLoading(true);
        const data = await getTopPromoters(limit);
        setPromoters(data);
        setError(null);
      } catch (error) {
        console.error('Ошибка при загрузке промоутеров:', error);
        setError('Не удалось загрузить данные промоутеров');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPromoters();
  }, [limit]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-dark-lighter h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-dark-lighter rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-dark-lighter rounded"></div>
              <div className="h-4 bg-dark-lighter rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 btn btn-primary"
        >
          Попробовать снова
        </button>
      </div>
    );
  }
  
  if (promoters.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Пока нет данных о промоутерах</p>
      </div>
    );
  }
  
  return (
    <div className="my-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-bold text-white mb-6 text-center"
      >
        Текущий рейтинг промоутеров
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promoters.map((promoter, index) => (
          <PromoterCard 
            key={promoter.id} 
            promoter={promoter} 
            rank={index + 1}
          />
        ))}
      </div>
    </div>
  );
};

export default PromotersList; 
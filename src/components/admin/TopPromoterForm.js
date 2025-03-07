import React, { useState, useEffect } from 'react';
import { FaTrophy } from 'react-icons/fa';

const TopPromoterForm = ({ promoters, currentTopPromoter, onSubmit, onCancel, isLoading }) => {
  const [selectedPromoterId, setSelectedPromoterId] = useState('');
  const [reward, setReward] = useState('');
  const [errors, setErrors] = useState({});
  
  // Инициализация формы при редактировании
  useEffect(() => {
    if (currentTopPromoter) {
      setSelectedPromoterId(currentTopPromoter.promoterId || '');
      setReward(currentTopPromoter.reward || '');
    }
  }, [currentTopPromoter]);
  
  // Валидация формы
  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedPromoterId) {
      newErrors.promoterId = 'Выберите промоутера';
    }
    
    if (!reward.trim()) {
      newErrors.reward = 'Укажите награду';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Отправка формы
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const selectedPromoter = promoters.find(p => p.id === selectedPromoterId);
      
      if (selectedPromoter) {
        onSubmit({
          promoterId: selectedPromoterId,
          name: selectedPromoter.name,
          avatarUrl: selectedPromoter.avatarUrl,
          leafletsCount: selectedPromoter.leafletsCount,
          reward
        });
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Выбор промоутера */}
      <div>
        <label className="block text-gray-300 mb-2" htmlFor="promoterId">
          Выберите лучшего промоутера
        </label>
        <select
          id="promoterId"
          value={selectedPromoterId}
          onChange={(e) => setSelectedPromoterId(e.target.value)}
          className={`input w-full ${errors.promoterId ? 'border-red-500' : ''}`}
          disabled={isLoading}
        >
          <option value="">-- Выберите промоутера --</option>
          {promoters.map((promoter) => (
            <option key={promoter.id} value={promoter.id}>
              {promoter.name} ({promoter.leafletsCount} листовок)
            </option>
          ))}
        </select>
        {errors.promoterId && (
          <p className="mt-1 text-red-500 text-sm">{errors.promoterId}</p>
        )}
      </div>
      
      {/* Награда */}
      <div>
        <label className="block text-gray-300 mb-2" htmlFor="reward">
          Награда
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaTrophy className="text-yellow-500" />
          </div>
          <input
            id="reward"
            type="text"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
            className={`input pl-10 w-full ${errors.reward ? 'border-red-500' : ''}`}
            placeholder="Например: +5000 ₽ к зарплате"
            disabled={isLoading}
          />
        </div>
        {errors.reward && (
          <p className="mt-1 text-red-500 text-sm">{errors.reward}</p>
        )}
      </div>
      
      {/* Предпросмотр */}
      {selectedPromoterId && (
        <div className="mt-6 p-4 bg-dark-lighter rounded-lg">
          <h3 className="text-white font-medium mb-2">Предпросмотр:</h3>
          <div className="flex items-center">
            <FaTrophy className="text-yellow-500 mr-2" />
            <div>
              <p className="text-white">
                {promoters.find(p => p.id === selectedPromoterId)?.name || ''}
              </p>
              <p className="text-gray-400 text-sm">
                Награда: {reward}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Кнопки */}
      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn bg-dark-lighter hover:bg-dark text-white"
          disabled={isLoading}
        >
          Отмена
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Сохранение...' : 'Установить лучшего промоутера'}
        </button>
      </div>
    </form>
  );
};

export default TopPromoterForm; 
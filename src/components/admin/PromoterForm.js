import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaLeaf, FaLink, FaCalendarAlt, FaMapMarkerAlt, FaCamera, FaImage, FaClock } from 'react-icons/fa';

const PromoterForm = ({ promoter, onSubmit, onCancel, isLoading }) => {
  const [name, setName] = useState('');
  const [leafletsCount, setLeafletsCount] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [district, setDistrict] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [errors, setErrors] = useState({});
  
  // Районы Петрозаводска
  const districts = [
    'Центр',
    'Древлянка',
    'Кукковка',
    'Ключевая',
    'Голиковка',
    'Зарека',
    'Перевалка',
    'Октябрьский',
    'Первомайский',
    'Сулажгора'
  ];
  
  // Инициализация формы при редактировании
  useEffect(() => {
    if (promoter) {
      setName(promoter.name || '');
      setLeafletsCount(promoter.leafletsCount || 0);
      setStartDate(promoter.startDate || '');
      setDistrict(promoter.district || '');
      setAvatarUrl(promoter.avatarUrl || '');
      setAvatarPreview(promoter.avatarUrl || '');
    }
  }, [promoter]);
  
  // Обработка изменения URL аватара
  const handleAvatarUrlChange = (e) => {
    const url = e.target.value;
    setAvatarUrl(url);
    setAvatarPreview(url);
  };

  // Расчет количества дней работы
  const calculateWorkDays = () => {
    if (!startDate) return 0;
    
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Валидация формы
  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Имя обязательно';
    }
    
    if (leafletsCount < 0) {
      newErrors.leafletsCount = 'Количество листовок не может быть отрицательным';
    }

    if (!startDate) {
      newErrors.startDate = 'Выберите дату начала работы';
    }

    if (!district) {
      newErrors.district = 'Выберите район';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Отправка формы
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const workDays = calculateWorkDays();
      onSubmit({
        name,
        leafletsCount: Number(leafletsCount),
        startDate,
        workDays,
        district,
        avatarUrl,
        speed: workDays > 0 ? Math.round(leafletsCount / workDays) : 0
      }, null);
    }
  };

  // Получение максимальной даты (сегодня)
  const getMaxDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Форматирование даты для отображения
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Аватарка */}
      <div className="flex flex-col items-center">
        <motion.div 
          className="relative mb-6 group"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          {avatarPreview ? (
            <img 
              src={avatarPreview} 
              alt="Аватар" 
              className="w-32 h-32 rounded-2xl object-cover ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`;
              }}
            />
          ) : (
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <FaCamera className="text-4xl text-primary/60" />
              </motion.div>
            </div>
          )}
          
          <motion.div
            className="absolute -bottom-2 right-0 w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaImage className="text-sm" />
          </motion.div>
        </motion.div>
        
        <div className="w-full max-w-md">
          <p className="text-sm text-gray-400 mb-2 text-center">
            Введите URL изображения или оставьте пустым для автоматической генерации
          </p>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLink className="text-gray-500" />
            </div>
            <input
              type="text"
              value={avatarUrl}
              onChange={handleAvatarUrlChange}
              className="w-full bg-dark/50 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="https://example.com/avatar.jpg"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Имя */}
        <div>
          <label className="block text-gray-300 mb-2 font-medium" htmlFor="name">
            Имя промоутера
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-gray-500" />
            </div>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full bg-dark/50 border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-xl pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors`}
              placeholder="Введите имя"
              disabled={isLoading}
            />
          </div>
          {errors.name && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-red-500 text-sm"
            >
              {errors.name}
            </motion.p>
          )}
        </div>
        
        {/* Район */}
        <div>
          <label className="block text-gray-300 mb-2 font-medium" htmlFor="district">
            Район города
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaMapMarkerAlt className="text-gray-500" />
            </div>
            <select
              id="district"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className={`w-full bg-dark/50 border ${errors.district ? 'border-red-500' : 'border-white/10'} rounded-xl pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors appearance-none`}
              disabled={isLoading}
            >
              <option value="">Выберите район</option>
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          {errors.district && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-red-500 text-sm"
            >
              {errors.district}
            </motion.p>
          )}
        </div>
        
        {/* Количество листовок */}
        <div>
          <label className="block text-gray-300 mb-2 font-medium" htmlFor="leafletsCount">
            Количество листовок
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLeaf className="text-gray-500" />
            </div>
            <input
              id="leafletsCount"
              type="number"
              value={leafletsCount}
              onChange={(e) => setLeafletsCount(e.target.value)}
              className={`w-full bg-dark/50 border ${errors.leafletsCount ? 'border-red-500' : 'border-white/10'} rounded-xl pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors`}
              placeholder="0"
              min="0"
              disabled={isLoading}
            />
          </div>
          {errors.leafletsCount && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-red-500 text-sm"
            >
              {errors.leafletsCount}
            </motion.p>
          )}
        </div>

        {/* Дата начала работы */}
        <div>
          <label className="block text-gray-300 mb-2 font-medium" htmlFor="startDate">
            Дата начала работы
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaCalendarAlt className="text-gray-500" />
            </div>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={getMaxDate()}
              className={`w-full bg-dark/50 border ${errors.startDate ? 'border-red-500' : 'border-white/10'} rounded-xl pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors`}
              disabled={isLoading}
            />
          </div>
          {startDate && (
            <div className="mt-1 flex items-center text-sm text-gray-400">
              <FaClock className="mr-1" />
              <span>Дней работы: {calculateWorkDays()}</span>
            </div>
          )}
          {errors.startDate && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-red-500 text-sm"
            >
              {errors.startDate}
            </motion.p>
          )}
        </div>
      </div>
      
      {/* Кнопки */}
      <div className="flex justify-end space-x-4 pt-4">
        <motion.button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-dark/50 hover:bg-dark/70 text-white rounded-xl font-medium flex items-center justify-center group transition-all"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Отмена
        </motion.button>
        <motion.button
          type="submit"
          className="px-6 py-2 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/20 transition-all"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? 'Сохранение...' : (promoter ? 'Обновить' : 'Добавить')}
        </motion.button>
      </div>
    </motion.form>
  );
};

export default PromoterForm; 
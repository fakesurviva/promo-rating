import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUsers, FaTrophy, FaCog, FaTelegram } from 'react-icons/fa';
import { getPromoters, getTopPromoter } from '../../firebase/promoterService';
import { getTelegramConfig } from '../../firebase/telegramService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    promotersCount: 0,
    hasTopPromoter: false,
    telegramEnabled: false
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Получаем данные о промоутерах
        const promoters = await getPromoters();
        
        // Получаем данные о лучшем промоутере
        const topPromoter = await getTopPromoter();
        
        // Получаем настройки Telegram
        const telegramConfig = await getTelegramConfig();
        
        setStats({
          promotersCount: promoters.length,
          hasTopPromoter: !!topPromoter,
          telegramEnabled: telegramConfig.enabled
        });
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Карточки с информацией
  const cards = [
    {
      title: 'Промоутеры',
      icon: <FaUsers className="text-primary text-3xl" />,
      value: stats.promotersCount,
      description: 'Всего промоутеров в системе',
      link: '/admin/promoters',
      color: 'border-primary'
    },
    {
      title: 'Лучший промоутер',
      icon: <FaTrophy className="text-yellow-400 text-3xl" />,
      value: stats.hasTopPromoter ? 'Установлен' : 'Не установлен',
      description: stats.hasTopPromoter 
        ? 'Лучший промоутер месяца выбран' 
        : 'Лучший промоутер месяца не выбран',
      link: '/admin/top-promoter',
      color: 'border-yellow-400'
    },
    {
      title: 'Telegram',
      icon: <FaTelegram className="text-blue-400 text-3xl" />,
      value: stats.telegramEnabled ? 'Включен' : 'Отключен',
      description: stats.telegramEnabled 
        ? 'Интеграция с Telegram настроена' 
        : 'Интеграция с Telegram не настроена',
      link: '/admin/telegram',
      color: 'border-blue-400'
    },
    {
      title: 'Настройки',
      icon: <FaCog className="text-gray-400 text-3xl" />,
      value: 'Настройки сайта',
      description: 'Логотип, текст, контакты и другие настройки',
      link: '/admin/settings',
      color: 'border-gray-400'
    }
  ];
  
  if (loading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 bg-dark-lighter rounded w-64 mx-auto mb-4"></div>
          <div className="h-4 bg-dark-lighter rounded w-48 mx-auto"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-white mb-8"
        >
          Добро пожаловать в панель управления
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link 
                to={card.link}
                className={`block bg-dark rounded-xl p-6 border-l-4 ${card.color} hover:bg-dark-lighter transition-colors`}
              >
                <div className="flex items-center mb-4">
                  {card.icon}
                  <h3 className="text-lg font-bold text-white ml-3">
                    {card.title}
                  </h3>
                </div>
                
                <div className="text-2xl font-bold text-white mb-2">
                  {card.value}
                </div>
                
                <p className="text-gray-400 text-sm">
                  {card.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
        
        {/* Быстрые действия */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <motion.span
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mr-3 inline-block"
            >
              ⚡
            </motion.span>
            Быстрые действия
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link 
                to="/admin/promoters"
                className="block bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 backdrop-blur-xl border border-primary/20 rounded-xl p-6 transition-all group"
              >
                <div className="flex items-center mb-4">
                  <span className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    <FaUsers className="text-primary" />
                  </span>
                  <h4 className="text-lg font-semibold text-white ml-4">
                    Добавить промоутера
                  </h4>
                </div>
                <p className="text-gray-400 text-sm">
                  Создайте новую учетную запись промоутера и начните отслеживать его прогресс
                </p>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link 
                to="/admin/top-promoter"
                className="block bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 hover:from-yellow-500/20 hover:to-yellow-600/10 backdrop-blur-xl border border-yellow-500/20 rounded-xl p-6 transition-all group"
              >
                <div className="flex items-center mb-4">
                  <span className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    <FaTrophy className="text-yellow-500" />
                  </span>
                  <h4 className="text-lg font-semibold text-white ml-4">
                    Выбрать лучшего
                  </h4>
                </div>
                <p className="text-gray-400 text-sm">
                  Определите лучшего промоутера месяца и наградите его достижениями
                </p>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link 
                to="/admin/telegram"
                className="block bg-gradient-to-br from-blue-500/10 to-blue-600/5 hover:from-blue-500/20 hover:to-blue-600/10 backdrop-blur-xl border border-blue-500/20 rounded-xl p-6 transition-all group"
              >
                <div className="flex items-center mb-4">
                  <span className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    <FaTelegram className="text-blue-500" />
                  </span>
                  <h4 className="text-lg font-semibold text-white ml-4">
                    Настроить Telegram
                  </h4>
                </div>
                <p className="text-gray-400 text-sm">
                  Настройте интеграцию с Telegram для автоматических уведомлений
                </p>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard; 
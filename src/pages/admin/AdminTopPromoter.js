import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaTelegramPlane, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getPromoters, getTopPromoter, setTopPromoter } from '../../firebase/promoterService';
import { sendTopPromoterMessage } from '../../firebase/telegramService';
import TopPromoterForm from '../../components/admin/TopPromoterForm';
import PromoterCard from '../../components/PromoterCard';

const AdminTopPromoter = () => {
  const [promoters, setPromoters] = useState([]);
  const [topPromoter, setTopPromoterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [sendingTelegram, setSendingTelegram] = useState(false);
  
  // Загрузка данных
  useEffect(() => {
    fetchData();
  }, []);
  
  // Получение данных
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Получаем список промоутеров
      const promotersData = await getPromoters();
      setPromoters(promotersData);
      
      // Получаем данные о лучшем промоутере
      const topPromoterData = await getTopPromoter();
      setTopPromoterData(topPromoterData);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      toast.error('Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };
  
  // Установка лучшего промоутера
  const handleSetTopPromoter = async (data) => {
    try {
      setFormLoading(true);
      await setTopPromoter(data);
      await fetchData();
      setShowForm(false);
      toast.success('Лучший промоутер успешно установлен');
    } catch (error) {
      console.error('Ошибка при установке лучшего промоутера:', error);
      toast.error('Не удалось установить лучшего промоутера');
    } finally {
      setFormLoading(false);
    }
  };
  
  // Отправка сообщения в Telegram
  const handleSendTelegramMessage = async () => {
    if (!topPromoter) return;
    
    try {
      setSendingTelegram(true);
      const success = await sendTopPromoterMessage(topPromoter);
      
      if (success) {
        toast.success('Сообщение успешно отправлено в Telegram');
      } else {
        toast.warning('Не удалось отправить сообщение. Проверьте настройки Telegram');
      }
    } catch (error) {
      console.error('Ошибка при отправке сообщения в Telegram:', error);
      toast.error('Ошибка при отправке сообщения в Telegram');
    } finally {
      setSendingTelegram(false);
    }
  };
  
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
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1 }}
              className="mr-4 text-4xl"
            >
              🏆
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 text-transparent bg-clip-text">
                Лучший промоутер месяца
              </h2>
              <p className="text-gray-400 mt-1">
                Выберите лучшего промоутера и наградите его достижениями
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Форма установки лучшего промоутера */}
        {showForm ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-dark/50 backdrop-blur-xl rounded-xl p-6 mb-8 border border-white/5"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <FaTrophy className="text-yellow-400 mr-3" />
              Выбор лучшего промоутера
            </h3>
            
            <TopPromoterForm 
              promoters={promoters}
              currentTopPromoter={topPromoter}
              onSubmit={handleSetTopPromoter}
              onCancel={() => setShowForm(false)}
              isLoading={formLoading}
            />
          </motion.div>
        ) : (
          <div className="mb-8">
            {topPromoter ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                {/* Декоративный фон */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-yellow-600/5 rounded-xl blur-xl"></div>
                
                {/* Основной контент */}
                <div className="relative bg-dark/50 backdrop-blur-xl rounded-xl border border-yellow-400/20 overflow-hidden">
                  {/* Декоративные элементы */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                  
                  <div className="relative p-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                      <div className="flex items-center mb-6 md:mb-0">
                        <motion.div
                          animate={{ 
                            scale: [1, 1.2, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse"
                          }}
                          className="mr-4"
                        >
                          <FaTrophy className="text-4xl text-yellow-400" />
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            Текущий лучший промоутер
                          </h3>
                          <p className="text-gray-400 text-sm mt-1">
                            Выбран {new Date().toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowForm(true)}
                          className="px-6 py-2 bg-dark/50 hover:bg-dark/70 text-white rounded-lg font-medium flex items-center justify-center group transition-all"
                        >
                          <FaEdit className="mr-2 group-hover:text-yellow-400 transition-colors" />
                          Изменить
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSendTelegramMessage}
                          disabled={sendingTelegram}
                          className="px-6 py-2 bg-blue-500/80 hover:bg-blue-500 text-white rounded-lg font-medium flex items-center justify-center group transition-all disabled:opacity-50"
                        >
                          <FaTelegramPlane className="mr-2 group-hover:text-white transition-colors" />
                          {sendingTelegram ? 'Отправка...' : 'Отправить в Telegram'}
                        </motion.button>
                      </div>
                    </div>
                    
                    <div className="max-w-md mx-auto">
                      <PromoterCard 
                        promoter={topPromoter} 
                        isTopPromoter={true} 
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-dark/50 backdrop-blur-xl rounded-xl p-8 text-center border border-white/5"
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mb-6"
                >
                  <FaTrophy className="text-6xl text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    Лучший промоутер месяца не выбран
                  </h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    Выберите лучшего промоутера месяца, чтобы он отображался на главной странице и получил особые привилегии
                  </p>
                </motion.div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowForm(true)}
                  disabled={promoters.length === 0}
                  className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg font-medium inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-yellow-400/20 transition-all"
                >
                  <FaTrophy className="mr-2" />
                  {promoters.length === 0 
                    ? 'Сначала добавьте промоутеров' 
                    : 'Выбрать лучшего промоутера'}
                </motion.button>
              </motion.div>
            )}
          </div>
        )}
        
        {/* Информация */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-dark/50 backdrop-blur-xl rounded-xl p-6 border border-white/5"
        >
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <span className="text-xl mr-2">💡</span>
            Информация
          </h3>
          
          <ul className="space-y-3">
            <motion.li 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="flex items-start text-gray-400"
            >
              <span className="text-yellow-400 mr-2">•</span>
              Лучший промоутер будет отображаться на главной странице в специальном баннере
            </motion.li>
            <motion.li 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="flex items-start text-gray-400"
            >
              <span className="text-yellow-400 mr-2">•</span>
              При выборе нового лучшего промоутера, предыдущий будет заменен
            </motion.li>
            <motion.li 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="flex items-start text-gray-400"
            >
              <span className="text-yellow-400 mr-2">•</span>
              Вы можете отправить уведомление о лучшем промоутере в Telegram-канал
            </motion.li>
            <motion.li 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              className="flex items-start text-gray-400"
            >
              <span className="text-yellow-400 mr-2">•</span>
              Для работы с Telegram необходимо настроить интеграцию в разделе "Telegram"
            </motion.li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminTopPromoter; 
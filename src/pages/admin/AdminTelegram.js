import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTelegram, FaKey, FaHashtag, FaToggleOn, FaToggleOff, FaPaperPlane, FaRocket, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getTelegramConfig, updateTelegramConfig, sendTelegramMessage } from '../../firebase/telegramService';

const AdminTelegram = () => {
  const [config, setConfig] = useState({
    botToken: '',
    channelId: '',
    enabled: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  
  // Загрузка данных
  useEffect(() => {
    fetchConfig();
  }, []);
  
  // Получение конфигурации Telegram
  const fetchConfig = async () => {
    try {
      setLoading(true);
      const data = await getTelegramConfig();
      setConfig(data);
    } catch (error) {
      console.error('Ошибка при загрузке конфигурации Telegram:', error);
      toast.error('Не удалось загрузить настройки Telegram');
    } finally {
      setLoading(false);
    }
  };
  
  // Сохранение конфигурации
  const handleSaveConfig = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      await updateTelegramConfig(config);
      toast.success('Настройки Telegram успешно сохранены');
    } catch (error) {
      console.error('Ошибка при сохранении настроек Telegram:', error);
      toast.error('Не удалось сохранить настройки Telegram');
    } finally {
      setSaving(false);
    }
  };
  
  // Отправка тестового сообщения
  const handleSendTestMessage = async (e) => {
    e.preventDefault();
    
    if (!testMessage.trim()) {
      toast.warning('Введите текст сообщения');
      return;
    }
    
    try {
      setSendingTest(true);
      const success = await sendTelegramMessage(testMessage);
      
      if (success) {
        toast.success('Тестовое сообщение успешно отправлено');
        setTestMessage('');
      } else {
        toast.warning('Не удалось отправить сообщение. Проверьте настройки Telegram');
      }
    } catch (error) {
      console.error('Ошибка при отправке тестового сообщения:', error);
      toast.error('Ошибка при отправке тестового сообщения');
    } finally {
      setSendingTest(false);
    }
  };
  
  // Переключение статуса интеграции
  const toggleEnabled = () => {
    setConfig({
      ...config,
      enabled: !config.enabled
    });
  };
  
  if (loading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="animate-pulse text-center"
        >
          <div className="h-8 bg-dark-lighter rounded w-64 mx-auto mb-4"></div>
          <div className="h-4 bg-dark-lighter rounded w-48 mx-auto"></div>
        </motion.div>
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
              <FaTelegram className="text-blue-400" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">
                Интеграция с Telegram
              </h2>
              <p className="text-gray-400 mt-1">
                Настройте интеграцию с Telegram для автоматических уведомлений
              </p>
            </div>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Форма настроек */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* Декоративный фон */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-blue-600/5 rounded-xl blur-xl"></div>
            
            {/* Основной контент */}
            <div className="relative bg-dark/50 backdrop-blur-xl rounded-xl border border-blue-400/20 overflow-hidden">
              {/* Декоративные элементы */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
              
              <div className="relative p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <FaRocket className="text-blue-400 mr-3" />
                  Настройки Telegram
                </h3>
                
                <form onSubmit={handleSaveConfig} className="space-y-6">
                  {/* Токен бота */}
                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor="botToken">
                      Токен бота
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaKey className="text-gray-500" />
                      </div>
                      <input
                        id="botToken"
                        type="text"
                        value={config.botToken}
                        onChange={(e) => setConfig({ ...config, botToken: e.target.value })}
                        className="w-full bg-dark/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400/50 transition-colors"
                        placeholder="Введите токен бота"
                        disabled={saving}
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-400">
                      Получите токен бота через @BotFather в Telegram
                    </p>
                  </div>
                  
                  {/* ID канала */}
                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor="channelId">
                      ID канала
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaHashtag className="text-gray-500" />
                      </div>
                      <input
                        id="channelId"
                        type="text"
                        value={config.channelId}
                        onChange={(e) => setConfig({ ...config, channelId: e.target.value })}
                        className="w-full bg-dark/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400/50 transition-colors"
                        placeholder="Например: @your_channel или -1001234567890"
                        disabled={saving}
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-400">
                      Укажите @username канала или его числовой ID
                    </p>
                  </div>
                  
                  {/* Включение/выключение */}
                  <div>
                    <motion.label 
                      className="flex items-center cursor-pointer group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div 
                        className="mr-3"
                        animate={{ 
                          rotate: config.enabled ? 360 : 0,
                          scale: config.enabled ? [1, 1.2, 1] : 1
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {config.enabled ? (
                          <FaToggleOn className="text-blue-400 text-3xl" />
                        ) : (
                          <FaToggleOff className="text-gray-500 text-3xl" />
                        )}
                      </motion.div>
                      <span className="text-gray-300 group-hover:text-white transition-colors">
                        {config.enabled ? 'Интеграция включена' : 'Интеграция отключена'}
                      </span>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={config.enabled}
                        onChange={toggleEnabled}
                        disabled={saving}
                      />
                    </motion.label>
                  </div>
                  
                  {/* Кнопка сохранения */}
                  <motion.button
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-400/20 transition-all"
                    disabled={saving}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaTelegram className="mr-2" />
                    {saving ? 'Сохранение...' : 'Сохранить настройки'}
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
          
          {/* Тестовое сообщение и инструкции */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Тестовое сообщение */}
            <div className="bg-dark/50 backdrop-blur-xl rounded-xl border border-white/5 overflow-hidden">
              <div className="p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <FaPaperPlane className="text-blue-400 mr-3" />
                  Тестовое сообщение
                </h3>
                
                <form onSubmit={handleSendTestMessage} className="space-y-4">
                  <div>
                    <textarea
                      value={testMessage}
                      onChange={(e) => setTestMessage(e.target.value)}
                      className="w-full bg-dark/50 border border-white/10 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400/50 transition-colors h-32 resize-none"
                      placeholder="Введите текст сообщения для отправки в Telegram..."
                      disabled={sendingTest || !config.enabled}
                    ></textarea>
                  </div>
                  
                  <motion.button
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-400/20 transition-all"
                    disabled={sendingTest || !config.enabled}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaTelegram className="mr-2" />
                    {sendingTest ? 'Отправка...' : 'Отправить тестовое сообщение'}
                  </motion.button>
                  
                  {!config.enabled && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-center text-yellow-500 text-sm mt-2"
                    >
                      <FaInfoCircle className="mr-2" />
                      Для отправки сообщений необходимо включить интеграцию
                    </motion.div>
                  )}
                </form>
              </div>
            </div>
            
            {/* Инструкции */}
            <div className="bg-dark/50 backdrop-blur-xl rounded-xl border border-white/5 overflow-hidden">
              <div className="p-8">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                  <span className="text-xl mr-2">💡</span>
                  Инструкция по настройке
                </h3>
                
                <ol className="space-y-4">
                  {[
                    'Создайте нового бота через @BotFather в Telegram',
                    'Получите токен бота и вставьте его в поле "Токен бота"',
                    'Создайте канал в Telegram или используйте существующий',
                    'Добавьте вашего бота в канал как администратора',
                    'Укажите @username канала или его числовой ID в поле "ID канала"',
                    'Включите интеграцию, переключив соответствующий тумблер',
                    'Сохраните настройки и отправьте тестовое сообщение для проверки'
                  ].map((step, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-start text-gray-400"
                    >
                      <span className="text-blue-400 mr-2 font-bold">{index + 1}.</span>
                      {step}
                    </motion.li>
                  ))}
                </ol>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="mt-6 p-4 bg-blue-900/30 border border-blue-800 rounded-lg"
                >
                  <p className="text-blue-300 text-sm">
                    <strong>Примечание:</strong> Для работы с Telegram Bot API в продакшене рекомендуется 
                    использовать серверную часть (Cloud Functions), чтобы не хранить токен бота на клиенте.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminTelegram; 
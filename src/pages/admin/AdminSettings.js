import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCog, FaImage, FaFont, FaTelegram, FaPhone, FaPlus, FaTrash, FaLink } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getSettings, updateSettings } from '../../firebase/promoterService';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    companyLogo: '',
    headerText: '',
    telegramChannel: '',
    managerContacts: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Загрузка данных
  useEffect(() => {
    fetchSettings();
  }, []);
  
  // Получение настроек
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Ошибка при загрузке настроек:', error);
      toast.error('Не удалось загрузить настройки сайта');
    } finally {
      setLoading(false);
    }
  };
  
  // Добавление контакта менеджера
  const addManagerContact = () => {
    setSettings({
      ...settings,
      managerContacts: [
        ...settings.managerContacts,
        { type: 'phone', value: '' }
      ]
    });
  };
  
  // Удаление контакта менеджера
  const removeManagerContact = (index) => {
    const updatedContacts = [...settings.managerContacts];
    updatedContacts.splice(index, 1);
    
    setSettings({
      ...settings,
      managerContacts: updatedContacts
    });
  };
  
  // Обновление контакта менеджера
  const updateManagerContact = (index, field, value) => {
    const updatedContacts = [...settings.managerContacts];
    updatedContacts[index] = {
      ...updatedContacts[index],
      [field]: value
    };
    
    setSettings({
      ...settings,
      managerContacts: updatedContacts
    });
  };
  
  // Сохранение настроек
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      await updateSettings(settings, null);
      await fetchSettings();
      toast.success('Настройки сайта успешно сохранены');
    } catch (error) {
      console.error('Ошибка при сохранении настроек:', error);
      toast.error('Не удалось сохранить настройки сайта');
    } finally {
      setSaving(false);
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
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-white mb-6"
        >
          Настройки сайта
        </motion.h2>
        
        <form onSubmit={handleSaveSettings}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Логотип */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-dark rounded-xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <FaImage className="text-primary mr-2" />
                Логотип компании
              </h3>
              
              <div className="flex flex-col items-center mb-6">
                <div className="mb-4">
                  <img 
                    src={settings.companyLogo || 'https://via.placeholder.com/200x60?text=Logo'} 
                    alt="Логотип" 
                    className="h-32 w-auto object-contain bg-dark-lighter p-2 rounded-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/200x60?text=Logo';
                    }}
                  />
                </div>
                
                <div className="w-full">
                  <label className="block text-gray-300 mb-2" htmlFor="companyLogo">
                    URL логотипа
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLink className="text-gray-500" />
                    </div>
                    <input
                      id="companyLogo"
                      type="text"
                      value={settings.companyLogo}
                      onChange={(e) => setSettings({ ...settings, companyLogo: e.target.value })}
                      className="input pl-10 w-full"
                      placeholder="https://example.com/logo.png"
                      disabled={saving}
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-400">
                    Введите URL изображения логотипа
                  </p>
                </div>
              </div>
              
              {/* Текст в шапке */}
              <div>
                <label className="block text-gray-300 mb-2" htmlFor="headerText">
                  Текст в шапке сайта
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaFont className="text-gray-500" />
                  </div>
                  <input
                    id="headerText"
                    type="text"
                    value={settings.headerText}
                    onChange={(e) => setSettings({ ...settings, headerText: e.target.value })}
                    className="input pl-10 w-full"
                    placeholder="Например: Конкурс для лучших! Стань топ-промоутером Петрозаводска!"
                    disabled={saving}
                  />
                </div>
              </div>
            </motion.div>
            
            {/* Контакты */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-dark rounded-xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <FaCog className="text-primary mr-2" />
                Контактная информация
              </h3>
              
              {/* Telegram канал */}
              <div className="mb-6">
                <label className="block text-gray-300 mb-2" htmlFor="telegramChannel">
                  Telegram канал
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaTelegram className="text-gray-500" />
                  </div>
                  <input
                    id="telegramChannel"
                    type="text"
                    value={settings.telegramChannel}
                    onChange={(e) => setSettings({ ...settings, telegramChannel: e.target.value })}
                    className="input pl-10 w-full"
                    placeholder="Например: @your_channel"
                    disabled={saving}
                  />
                </div>
                <p className="mt-1 text-sm text-gray-400">
                  Укажите @username вашего Telegram канала
                </p>
              </div>
              
              {/* Контакты менеджеров */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-gray-300">
                    Контакты менеджеров
                  </label>
                  
                  <button
                    type="button"
                    onClick={addManagerContact}
                    className="text-primary hover:text-primary-light flex items-center text-sm"
                    disabled={saving}
                  >
                    <FaPlus className="mr-1" />
                    Добавить
                  </button>
                </div>
                
                {settings.managerContacts.length === 0 ? (
                  <p className="text-gray-500 text-sm mb-4">
                    Нет добавленных контактов
                  </p>
                ) : (
                  <div className="space-y-3 mb-4">
                    {settings.managerContacts.map((contact, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <select
                          value={contact.type}
                          onChange={(e) => updateManagerContact(index, 'type', e.target.value)}
                          className="input w-24"
                          disabled={saving}
                        >
                          <option value="phone">Телефон</option>
                          <option value="email">Email</option>
                        </select>
                        
                        <input
                          type="text"
                          value={contact.value}
                          onChange={(e) => updateManagerContact(index, 'value', e.target.value)}
                          className="input flex-1"
                          placeholder={contact.type === 'phone' ? '+7 (XXX) XXX-XX-XX' : 'email@example.com'}
                          disabled={saving}
                        />
                        
                        <button
                          type="button"
                          onClick={() => removeManagerContact(index)}
                          className="text-red-500 hover:text-red-400"
                          title="Удалить"
                          disabled={saving}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
          
          {/* Кнопка сохранения */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6"
          >
            <button
              type="submit"
              className="btn btn-primary w-full md:w-auto"
              disabled={saving}
            >
              {saving ? 'Сохранение...' : 'Сохранить настройки'}
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings; 
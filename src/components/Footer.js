import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTelegram, FaPhone, FaEnvelope } from 'react-icons/fa';
import { getSettings } from '../firebase/promoterService';

const Footer = () => {
  const [settings, setSettings] = useState({
    telegramChannel: '',
    managerContacts: []
  });
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (error) {
        console.error('Ошибка при загрузке настроек:', error);
      }
    };
    
    fetchSettings();
  }, []);
  
  return (
    <footer className="bg-dark-darker py-8 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-center"
        >
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-3 text-white">
              <span className="text-primary">Промо</span>
              <span className="text-secondary">Рейтинг</span>
            </h3>
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Рейтинг промоутеров Петрозаводска
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            {settings.telegramChannel && (
              <a 
                href={`https://t.me/${settings.telegramChannel.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-primary hover:text-primary-light mb-3 transition-colors"
              >
                <FaTelegram className="mr-2" />
                <span>Наш Telegram-канал</span>
              </a>
            )}
            
            {settings.managerContacts && settings.managerContacts.length > 0 && (
              <div className="text-center md:text-right">
                <h4 className="text-gray-300 mb-2">Контакты менеджеров:</h4>
                <ul>
                  {settings.managerContacts.map((contact, index) => (
                    <li key={index} className="text-gray-400 flex items-center mb-1">
                      {contact.type === 'phone' && <FaPhone className="mr-2 text-xs" />}
                      {contact.type === 'email' && <FaEnvelope className="mr-2 text-xs" />}
                      <span>{contact.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 
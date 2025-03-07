import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getSettings } from '../firebase/promoterService';
import { useAuth } from '../context/AuthContext';
import defaultLogo from '../assets/images/default-logo.png';

const Header = () => {
  const [settings, setSettings] = useState({
    companyLogo: '',
    headerText: 'Конкурс для лучших! Стань топ-промоутером Петрозаводска!'
  });
  const { currentUser, logout } = useAuth();
  
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
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };
  
  return (
    <header className="bg-dark shadow-lg">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <Link to="/">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <img 
                src={settings.companyLogo || defaultLogo} 
                alt="Логотип" 
                className="h-12 w-auto mr-3"
              />
              <h1 className="text-2xl font-bold text-white">
                <span className="text-primary">Промо</span>
                <span className="text-secondary">Рейтинг</span>
              </h1>
            </motion.div>
          </Link>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center md:text-right"
        >
          <p className="text-lg md:text-xl font-medium text-neon mb-2">
            {settings.headerText}
          </p>
          
          {currentUser ? (
            <div className="flex items-center justify-center md:justify-end space-x-4">
              <Link 
                to="/admin" 
                className="btn btn-primary text-sm"
              >
                Админ-панель
              </Link>
              <button 
                onClick={handleLogout}
                className="btn bg-dark-lighter hover:bg-dark text-sm"
              >
                Выйти
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="text-primary hover:text-primary-light text-sm transition-colors"
            >
              Вход для менеджеров
            </Link>
          )}
        </motion.div>
      </div>
    </header>
  );
};

export default Header; 
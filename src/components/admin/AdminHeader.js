import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSignOutAlt, FaHome, FaBell, FaUser } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const AdminHeader = ({ title }) => {
  const { currentUser, logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };
  
  return (
    <header className="bg-dark/50 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold"
          >
            <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
              {title || 'Админ-панель'}
            </span>
          </motion.h1>
          
          <div className="flex items-center space-x-6">
            {/* Кнопка уведомлений */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              <FaBell className="text-xl" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </motion.button>
            
            <div className="flex items-center space-x-6">
              <Link 
                to="/" 
                className="text-gray-400 hover:text-white flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
              >
                <FaHome className="text-xl" />
                <span className="hidden md:inline">На сайт</span>
              </Link>
              
              {currentUser && (
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                      <FaUser className="text-white" />
                    </div>
                    <span className="text-gray-300">
                      {currentUser.email}
                    </span>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg hover:shadow-red-500/20 transition-all"
                  >
                    <FaSignOutAlt />
                    <span className="hidden md:inline">Выйти</span>
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader; 
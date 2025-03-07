import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUsers, 
  FaTrophy, 
  FaCog, 
  FaTelegram, 
  FaHome, 
  FaBars, 
  FaTimes,
  FaChevronRight
} from 'react-icons/fa';

const AdminSidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  const menuItems = [
    { path: '/admin', icon: <FaHome />, label: 'Главная' },
    { path: '/admin/promoters', icon: <FaUsers />, label: 'Промоутеры' },
    { path: '/admin/top-promoter', icon: <FaTrophy />, label: 'Лучший промоутер' },
    { path: '/admin/telegram', icon: <FaTelegram />, label: 'Telegram' },
    { path: '/admin/settings', icon: <FaCog />, label: 'Настройки' },
  ];

  const sidebarVariants = {
    expanded: {
      width: '16rem',
      transition: {
        duration: 0.3
      }
    },
    collapsed: {
      width: '5rem',
      transition: {
        duration: 0.3
      }
    }
  };
  
  return (
    <>
      {/* Мобильная кнопка меню */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMobileMenu}
          className="bg-dark/80 backdrop-blur-sm p-2 rounded-lg text-white focus:outline-none border border-white/10 shadow-lg"
        >
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </motion.button>
      </div>
      
      {/* Боковая панель - десктоп */}
      <motion.div
        variants={sidebarVariants}
        initial="expanded"
        animate={isCollapsed ? "collapsed" : "expanded"}
        className="hidden md:flex flex-col h-screen bg-dark/50 backdrop-blur-xl border-r border-white/10 shadow-xl relative"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <motion.h2
              animate={{ opacity: isCollapsed ? 0 : 1 }}
              transition={{ duration: 0.2 }}
              className="text-xl font-bold text-white overflow-hidden whitespace-nowrap"
            >
              <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                Level
              </span>
              <span className="text-white">Up</span>
            </motion.h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleCollapse}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <FaChevronRight />
              </motion.div>
            </motion.button>
          </div>
          
          <nav>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <motion.li key={item.path} whileHover={{ x: 4 }}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/admin'}
                    className={({ isActive }) => 
                      `flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
                        isActive 
                          ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20' 
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`
                    }
                  >
                    <span className="text-xl">{item.icon}</span>
                    <motion.span
                      animate={{ opacity: isCollapsed ? 0 : 1 }}
                      transition={{ duration: 0.2 }}
                      className="ml-3 overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Декоративный элемент внизу */}
        <div className="mt-auto p-6">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent opacity-50"></div>
        </div>
      </motion.div>
      
      {/* Мобильное меню */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={closeMobileMenu}
            />
            
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed inset-y-0 left-0 w-64 bg-dark/90 backdrop-blur-xl shadow-xl z-50 md:hidden border-r border-white/10"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-6">
                  <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                    Level
                  </span>
                  <span className="text-white">Up</span>
                </h2>
                
                <nav>
                  <ul className="space-y-2">
                    {menuItems.map((item) => (
                      <motion.li key={item.path} whileHover={{ x: 4 }}>
                        <NavLink
                          to={item.path}
                          end={item.path === '/admin'}
                          className={({ isActive }) => 
                            `flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
                              isActive 
                                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20' 
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`
                          }
                          onClick={closeMobileMenu}
                        >
                          <span className="text-xl">{item.icon}</span>
                          <span className="ml-3">{item.label}</span>
                        </NavLink>
                      </motion.li>
                    ))}
                  </ul>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar; 
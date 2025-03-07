import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLeaf, FaTimes } from 'react-icons/fa';

const LeafletsUpdateModal = ({ isOpen, onClose, onSubmit, promoter, isLoading }) => {
  const [leafletsCount, setLeafletsCount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const count = Number(leafletsCount);
    if (!count || count <= 0) {
      setError('Введите положительное число листовок');
      return;
    }
    
    onSubmit(count);
    setLeafletsCount('');
    setError('');
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Затемнение */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Модальное окно */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-[calc(100%-2rem)] sm:w-[440px] md:w-[480px] bg-[#1a1f2e]/95 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-white/10 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg sm:text-xl font-bold text-white">Обновить листовки</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-400 hover:text-white transition-colors" />
              </motion.button>
            </div>
            
            <div className="mb-5">
              <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <FaLeaf className="text-2xl text-primary" />
                </div>
                <div>
                  <h4 className="text-base font-medium text-white">{promoter?.name}</h4>
                  <p className="text-sm text-gray-400">
                    Текущее количество: {promoter?.leafletsCount}
                  </p>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-base text-gray-300 mb-2" htmlFor="leafletsCount">
                  Количество листовок за сегодня
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLeaf className="text-gray-500" />
                  </div>
                  <input
                    id="leafletsCount"
                    type="number"
                    value={leafletsCount}
                    onChange={(e) => setLeafletsCount(e.target.value)}
                    className={`w-full bg-dark/50 border ${error ? 'border-red-500' : 'border-white/10'} rounded-xl pl-11 pr-4 py-3 text-base text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors`}
                    placeholder="Введите количество"
                    min="1"
                    disabled={isLoading}
                  />
                </div>
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-500"
                  >
                    {error}
                  </motion.p>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                <motion.button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium text-base flex items-center justify-center transition-all border border-white/10"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Отмена
                </motion.button>
                <motion.button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-medium text-base flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/20 transition-all"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? 'Сохранение...' : 'Обновить'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default LeafletsUpdateModal; 
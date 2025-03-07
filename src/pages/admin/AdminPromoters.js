import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaUser, FaLeaf, FaSort, FaSortUp, FaSortDown, FaTimes, FaUsers } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getPromoters, addPromoter, updatePromoter, deletePromoter } from '../../firebase/promoterService';
import PromoterForm from '../../components/admin/PromoterForm';
import LeafletsUpdateModal from '../../components/admin/LeafletsUpdateModal';

const AdminPromoters = () => {
  const [promoters, setPromoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPromoter, setEditingPromoter] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [sortField, setSortField] = useState('leafletsCount');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPromoter, setSelectedPromoter] = useState(null);
  const [showLeafletsModal, setShowLeafletsModal] = useState(false);
  const [updatingLeaflets, setUpdatingLeaflets] = useState(false);
  
  // Загрузка данных
  useEffect(() => {
    fetchPromoters();
  }, []);
  
  // Получение списка промоутеров
  const fetchPromoters = async () => {
    try {
      setLoading(true);
      const data = await getPromoters();
      setPromoters(data);
    } catch (error) {
      console.error('Ошибка при загрузке промоутеров:', error);
      toast.error('Не удалось загрузить список промоутеров');
    } finally {
      setLoading(false);
    }
  };
  
  // Добавление нового промоутера
  const handleAddPromoter = async (promoterData, avatarFile) => {
    try {
      setFormLoading(true);
      await addPromoter(promoterData, avatarFile);
      await fetchPromoters();
      setShowForm(false);
      toast.success('Промоутер успешно добавлен');
    } catch (error) {
      console.error('Ошибка при добавлении промоутера:', error);
      toast.error('Не удалось добавить промоутера');
    } finally {
      setFormLoading(false);
    }
  };
  
  // Обновление промоутера
  const handleUpdatePromoter = async (promoterData, avatarFile) => {
    if (!editingPromoter) return;
    
    try {
      setFormLoading(true);
      await updatePromoter(editingPromoter.id, promoterData, avatarFile);
      await fetchPromoters();
      setEditingPromoter(null);
      toast.success('Промоутер успешно обновлен');
    } catch (error) {
      console.error('Ошибка при обновлении промоутера:', error);
      toast.error('Не удалось обновить промоутера');
    } finally {
      setFormLoading(false);
    }
  };
  
  // Удаление промоутера
  const handleDeletePromoter = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого промоутера?')) {
      return;
    }
    
    try {
      setLoading(true);
      await deletePromoter(id);
      await fetchPromoters();
      toast.success('Промоутер успешно удален');
    } catch (error) {
      console.error('Ошибка при удалении промоутера:', error);
      toast.error('Не удалось удалить промоутера');
    } finally {
      setLoading(false);
    }
  };
  
  // Сортировка списка
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Получение отсортированного и отфильтрованного списка
  const getSortedPromoters = () => {
    let filtered = [...promoters];
    
    // Фильтрация по поиску
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(term)
      );
    }
    
    // Сортировка
    return filtered.sort((a, b) => {
      if (sortField === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortField === 'leafletsCount') {
        return sortDirection === 'asc' 
          ? a.leafletsCount - b.leafletsCount
          : b.leafletsCount - a.leafletsCount;
      }
      return 0;
    });
  };
  
  // Получение иконки сортировки
  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort />;
    return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };
  
  // Отмена формы
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingPromoter(null);
  };
  
  // Отправка формы
  const handleSubmitForm = (data, avatarFile) => {
    if (editingPromoter) {
      handleUpdatePromoter(data, avatarFile);
    } else {
      handleAddPromoter(data, avatarFile);
    }
  };
  
  // Обновление количества листовок
  const handleUpdateLeaflets = async (dailyCount) => {
    if (!selectedPromoter) return;
    
    try {
      setUpdatingLeaflets(true);
      
      const updatedPromoter = {
        ...selectedPromoter,
        leafletsCount: selectedPromoter.leafletsCount + dailyCount
      };
      
      await updatePromoter(selectedPromoter.id, updatedPromoter);
      await fetchPromoters();
      
      setShowLeafletsModal(false);
      toast.success('Количество листовок обновлено');
    } catch (error) {
      console.error('Ошибка при обновлении листовок:', error);
      toast.error('Не удалось обновить количество листовок');
    } finally {
      setUpdatingLeaflets(false);
    }
  };
  
  return (
    <div className="flex-1 p-3 sm:p-6 overflow-auto">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок и кнопка добавления */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0"
          >
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
              Управление промоутерами
            </h2>
            <div className="sm:ml-4 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm w-fit">
              {promoters.length} промоутеров
            </div>
          </motion.div>
          
          {!showForm && !editingPromoter && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl font-medium flex items-center justify-center hover:shadow-lg hover:shadow-primary/20 transition-all group"
              onClick={() => setShowForm(true)}
            >
              <motion.span
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                className="mr-2"
              >
                <FaPlus className="group-hover:text-white" />
              </motion.span>
              Добавить промоутера
            </motion.button>
          )}
        </div>
        
        {/* Форма добавления/редактирования */}
        {(showForm || editingPromoter) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-dark/50 backdrop-blur-xl rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-white/5"
          >
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center">
              {editingPromoter ? (
                <>
                  <FaEdit className="mr-2 text-primary" />
                  Редактирование промоутера
                </>
              ) : (
                <>
                  <FaPlus className="mr-2 text-primary" />
                  Добавление нового промоутера
                </>
              )}
            </h3>
            
            <PromoterForm 
              promoter={editingPromoter}
              onSubmit={handleSubmitForm}
              onCancel={handleCancelForm}
              isLoading={formLoading}
            />
          </motion.div>
        )}
        
        {/* Поиск и фильтры */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-dark/50 backdrop-blur-xl rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-white/5"
        >
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Поиск по имени..."
              className="w-full bg-dark/50 backdrop-blur-xl text-white placeholder-gray-500 px-10 sm:px-12 py-2 sm:py-3 rounded-lg border border-white/5 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm sm:text-base"
            />
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
              <FaUser className="text-gray-500" />
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-500 hover:text-white transition-colors"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </motion.div>
        
        {/* Таблица промоутеров */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-dark/50 backdrop-blur-xl rounded-xl border border-white/5 overflow-hidden"
        >
          {loading ? (
            <div className="p-4 sm:p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-dark-lighter rounded w-1/4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-dark-lighter rounded"></div>
                  <div className="h-4 bg-dark-lighter rounded"></div>
                  <div className="h-4 bg-dark-lighter rounded"></div>
                </div>
              </div>
            </div>
          ) : getSortedPromoters().length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <FaUsers className="text-3xl sm:text-4xl text-gray-600 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-400 mb-2">
                  {searchTerm 
                    ? 'Нет промоутеров, соответствующих поиску' 
                    : 'Нет добавленных промоутеров'}
                </h3>
                <p className="text-sm text-gray-500">
                  {searchTerm 
                    ? 'Попробуйте изменить параметры поиска' 
                    : 'Добавьте первого промоутера, нажав кнопку выше'}
                </p>
              </motion.div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-full inline-block align-middle">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-white/5">
                    <thead>
                      <tr className="bg-dark-lighter/50">
                        <th scope="col" className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Аватар
                        </th>
                        <th 
                          scope="col"
                          className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer group"
                          onClick={() => handleSort('name')}
                        >
                          <div className="flex items-center">
                            <span className="hidden sm:inline">Имя</span>
                            <span className="sm:hidden">Промоутер</span>
                            <span className="ml-2 text-gray-600 group-hover:text-gray-400 transition-colors">
                              {getSortIcon('name')}
                            </span>
                          </div>
                        </th>
                        <th 
                          scope="col"
                          className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer group hidden sm:table-cell"
                          onClick={() => handleSort('leafletsCount')}
                        >
                          <div className="flex items-center">
                            Листовки
                            <span className="ml-2 text-gray-600 group-hover:text-gray-400 transition-colors">
                              {getSortIcon('leafletsCount')}
                            </span>
                          </div>
                        </th>
                        <th scope="col" className="px-3 sm:px-6 py-3 sm:py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Действия
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {getSortedPromoters().map((promoter, index) => (
                        <motion.tr 
                          key={promoter.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="hover:bg-white/5 transition-colors group"
                        >
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="relative">
                              {promoter.avatarUrl ? (
                                <img 
                                  src={promoter.avatarUrl} 
                                  alt={promoter.name}
                                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl object-cover ring-2 ring-white/10 group-hover:ring-primary/30 transition-all"
                                />
                              ) : (
                                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-dark-lighter flex items-center justify-center ring-2 ring-white/10 group-hover:ring-primary/30 transition-all">
                                  <FaUser className="text-gray-400 text-sm sm:text-base" />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="flex flex-col sm:flex-row sm:items-center">
                              <div className="text-sm font-medium text-white group-hover:text-primary transition-colors">
                                {promoter.name}
                              </div>
                              <div className="mt-1 sm:mt-0 sm:ml-3 text-xs text-gray-400 sm:hidden">
                                {promoter.leafletsCount} листовок
                              </div>
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden sm:table-cell">
                            <div className="flex items-center text-sm">
                              <div className="w-16 sm:w-24 bg-dark-lighter rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-primary to-primary/60 h-2 rounded-full"
                                  style={{ 
                                    width: `${Math.min((promoter.leafletsCount / Math.max(...promoters.map(p => p.leafletsCount))) * 100, 100)}%`
                                  }}
                                />
                              </div>
                              <span className="ml-3 text-gray-300">
                                {promoter.leafletsCount}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-sm">
                            <div className="flex items-center justify-end space-x-2 sm:space-x-3">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {
                                  setSelectedPromoter(promoter);
                                  setShowLeafletsModal(true);
                                }}
                                className="p-1.5 sm:p-2 text-gray-400 hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                                title="Обновить листовки"
                              >
                                <FaLeaf className="text-sm sm:text-base" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setEditingPromoter(promoter)}
                                className="p-1.5 sm:p-2 text-gray-400 hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                                title="Редактировать"
                              >
                                <FaEdit className="text-sm sm:text-base" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeletePromoter(promoter.id)}
                                className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10"
                                title="Удалить"
                              >
                                <FaTrash className="text-sm sm:text-base" />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Модальное окно обновления листовок */}
        <LeafletsUpdateModal
          isOpen={showLeafletsModal}
          onClose={() => {
            setShowLeafletsModal(false);
            setSelectedPromoter(null);
          }}
          onSubmit={handleUpdateLeaflets}
          promoter={selectedPromoter}
          isLoading={updatingLeaflets}
        />
      </div>
    </div>
  );
};

export default AdminPromoters; 
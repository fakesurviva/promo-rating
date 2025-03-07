import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import AdminDashboard from './admin/AdminDashboard';
import AdminPromoters from './admin/AdminPromoters';
import AdminTopPromoter from './admin/AdminTopPromoter';
import AdminTelegram from './admin/AdminTelegram';
import AdminSettings from './admin/AdminSettings';

const AdminPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-darker via-dark to-dark-darker">
      {/* Декоративный фоновый паттерн */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Градиентный фон */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent"></div>
        
        {/* Светящиеся круги */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
        
        {/* Сетка */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.01)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="relative flex min-h-screen">
        {/* Боковая панель */}
        <AdminSidebar />
        
        {/* Основной контент */}
        <div className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col"
              >
                <AdminHeader title="Панель управления" />
                <div className="flex-1 p-6 overflow-auto">
                  <AdminDashboard />
                </div>
              </motion.div>
            } />
            <Route path="/promoters" element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col"
              >
                <AdminHeader title="Управление промоутерами" />
                <div className="flex-1 p-6 overflow-auto">
                  <AdminPromoters />
                </div>
              </motion.div>
            } />
            <Route path="/top-promoter" element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col"
              >
                <AdminHeader title="Лучший промоутер месяца" />
                <div className="flex-1 p-6 overflow-auto">
                  <AdminTopPromoter />
                </div>
              </motion.div>
            } />
            <Route path="/telegram" element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col"
              >
                <AdminHeader title="Интеграция с Telegram" />
                <div className="flex-1 p-6 overflow-auto">
                  <AdminTelegram />
                </div>
              </motion.div>
            } />
            <Route path="/settings" element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col"
              >
                <AdminHeader title="Настройки сайта" />
                <div className="flex-1 p-6 overflow-auto">
                  <AdminSettings />
                </div>
              </motion.div>
            } />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminPage; 
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-6xl md:text-8xl font-bold text-neon mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Страница не найдена
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Похоже, что страница, которую вы ищете, не существует или была перемещена.
          </p>
          <Link 
            to="/" 
            className="btn btn-primary inline-block"
          >
            Вернуться на главную
          </Link>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFoundPage; 
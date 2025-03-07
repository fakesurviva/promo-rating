import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock, FaEnvelope } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      const success = await login(email, password);
      
      if (success) {
        navigate('/admin');
      }
    } catch (error) {
      console.error('Ошибка входа:', error);
      setError('Не удалось войти. Проверьте ваши учетные данные.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Пожалуйста, введите email');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      await resetPassword(email);
      setShowResetPassword(false);
    } catch (error) {
      console.error('Ошибка сброса пароля:', error);
      setError('Не удалось отправить инструкции по сбросу пароля');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-darker to-dark bg-fixed">
      {/* Декоративный фоновый паттерн */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Градиентный фон */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent"></div>
        
        {/* Светящиеся круги */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Сетка */}
        <div className="grid grid-cols-8 gap-4 absolute inset-0 opacity-10">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className="w-full h-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full transform rotate-45"></div>
          ))}
        </div>
      </div>

      <div className="relative">
        {/* Навигационная панель */}
        <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-dark-darker/80' : 'bg-transparent'}`}>
          {/* Светящаяся линия */}
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
          
          <div className={`relative transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Логотип */}
                <Link to="/" className="text-4xl font-bold relative group z-10 flex items-center">
                  <div className="flex items-center">
                    <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                      Level
                    </span>
                    <span className="text-white">Up</span>
                  </div>
                  <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300"></div>
                </Link>
                
                {/* Центральный логотип */}
                <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  {/* Многослойное свечение вокруг логотипа */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary/40 to-secondary/40 rounded-full blur-xl opacity-70 animate-pulse"></div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-secondary/30 to-primary/30 rounded-full blur-lg opacity-80 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <div className="relative animate-logo-float">
                    <img 
                      src="/images/levelup-icon.png" 
                      alt="LevelUp Icon" 
                      className="w-16 h-16 object-contain animate-logo-spin" 
                    />
                  </div>
                </div>
                
                {/* Навигация */}
                <nav className="flex flex-col md:flex-row items-center gap-6">
                  <Link to="/" className="relative text-white font-medium group">
                    <span>Главная</span>
                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></div>
                  </Link>
                  <Link to="/login" className="relative overflow-hidden px-6 py-2 bg-gradient-to-r from-primary to-secondary rounded-lg font-medium text-white transition-all duration-300 hover:shadow-neon group">
                    <span className="relative z-10">Я менеджер</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </header>

        {/* Основной контент */}
        <main className="relative container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md relative"
          >
            {/* Декоративное свечение вокруг формы */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl opacity-75"></div>
            
            <div className="relative bg-dark/50 backdrop-blur-xl rounded-xl shadow-2xl p-8 border border-white/10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold">
                  <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                    {showResetPassword ? 'Сброс пароля' : 'Вход для менеджеров'}
                  </span>
                </h2>
                <p className="text-gray-400 mt-2">
                  {showResetPassword 
                    ? 'Введите ваш email для получения инструкций по сбросу пароля' 
                    : 'Войдите в систему для доступа к админ-панели'}
                </p>
              </div>
              
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 backdrop-blur-xl">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}
              
              {showResetPassword ? (
                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor="email">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-500" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-dark-lighter text-white border border-gray-700 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                        placeholder="your@email.com"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-lg font-medium text-white transition-all duration-300 hover:shadow-neon transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={loading}
                  >
                    {loading ? 'Отправка...' : 'Отправить инструкции'}
                  </button>
                  
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(false)}
                      className="text-primary hover:text-primary-light transition-colors duration-300"
                      disabled={loading}
                    >
                      Вернуться к форме входа
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor="email">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-500" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-dark-lighter text-white border border-gray-700 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                        placeholder="your@email.com"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor="password">
                      Пароль
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-gray-500" />
                      </div>
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-dark-lighter text-white border border-gray-700 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                        placeholder="••••••••"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-lg font-medium text-white transition-all duration-300 hover:shadow-neon transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={loading}
                  >
                    {loading ? 'Вход...' : 'Войти'}
                  </button>
                  
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(true)}
                      className="text-primary hover:text-primary-light transition-colors duration-300"
                      disabled={loading}
                    >
                      Забыли пароль?
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default LoginPage; 
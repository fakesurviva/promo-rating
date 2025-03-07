import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase/config';

function HomePage() {
  const [isHovered, setIsHovered] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [topPromoters, setTopPromoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Получаем данные промоутеров из Firebase
  useEffect(() => {
    const fetchPromoters = async () => {
      try {
        console.log('Начинаем загрузку промоутеров...');
        const promotersRef = collection(db, 'promoters');
        
        // Изменяем лимит на 10 промоутеров
        const q = query(
          promotersRef,
          orderBy('leafletsCount', 'desc'),
          limit(10)
        );
        
        console.log('Выполняем запрос к Firebase...');
        const querySnapshot = await getDocs(q);
        
        console.log('Получены данные. Количество документов:', querySnapshot.size);
        
        const promotersData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Данные промоутера:', data);
          return {
            id: doc.id,
            name: data.name || 'Без имени',
            avatar: data.avatarUrl || data.avatar,
            flyers: data.leafletsCount || 0,
            rating: data.rating || 5,
            workDays: data.workDays || 0,
            district: data.district || 'Не указан',
            speed: data.speed || 0,
            achievements: data.achievements || []
          };
        });
        
        console.log('Обработанные данные промоутеров:', promotersData);
        setTopPromoters(promotersData);
        setLoading(false);
      } catch (err) {
        console.error('Ошибка при загрузке промоутеров:', err);
        setError('Не удалось загрузить данные промоутеров: ' + err.message);
        setLoading(false);
      }
    };

    fetchPromoters();
  }, []);

  // Компонент загрузки
  const LoadingCard = () => (
    <div className="bg-dark/50 backdrop-blur-xl p-6 rounded-xl animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-primary/20"></div>
        <div className="flex-1">
          <div className="h-4 w-24 bg-primary/20 rounded mb-2"></div>
          <div className="h-3 w-32 bg-primary/10 rounded"></div>
        </div>
      </div>
    </div>
  );

  // Компонент ошибки
  const ErrorMessage = () => (
    <div className="text-center p-4 rounded-xl bg-red-500/10 text-red-500">
      <i className="fas fa-exclamation-circle mr-2"></i>
      {error}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-darker to-dark bg-fixed">
      {/* Декоративный фоновый паттерн на весь экран */}
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
        
        {/* Диагональные линии */}
        <div className="absolute inset-0 opacity-5">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i} 
              className="absolute bg-gradient-to-r from-primary/30 to-secondary/30" 
              style={{
                height: '1px',
                width: '100%',
                top: `${i * 10}%`,
                transform: 'rotate(-35deg)',
                transformOrigin: 'left',
                left: '0'
              }}
            />
          ))}
        </div>
        
        {/* Звезды/частицы */}
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.3,
                animation: `pulse ${Math.random() * 3 + 2}s infinite alternate`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative">
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

        {/* Добавляем приветственную секцию под хедером */}
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                    Стань лучшим
                  </span>
                  <br />
                  <span className="text-white">в своём деле</span>
                </h2>
                <p className="text-gray-300 text-lg mb-8">
                  Каждая листовка приближает тебя к победе! 
                  Соревнуйся с лучшими промоутерами города, 
                  следи за своим прогрессом и зарабатывай больше.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => setShowModal(true)} 
                    className="px-8 py-3 bg-gradient-to-r from-primary to-secondary rounded-lg font-medium text-white transition-all duration-300 hover:shadow-neon transform hover:-translate-y-1"
                  >
                    Участвовать в рейтинге
                  </button>
                </div>
                
                {/* Статистика */}
                <div className="grid grid-cols-3 gap-4 mt-12">
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                      4к₽
                    </div>
                    <div className="text-gray-400 text-sm">Средний доход в день</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                      15к
                    </div>
                    <div className="text-gray-400 text-sm">Листовок до бонуса</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                      ТОП-3
                    </div>
                    <div className="text-gray-400 text-sm">Получают призы</div>
                  </div>
                </div>
              </div>
              
              {/* Декоративная карточка */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-2xl opacity-20 animate-pulse"></div>
                <div className="relative bg-dark/50 backdrop-blur-xl p-8 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                      <i className="fas fa-chart-line text-2xl text-white"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Рейтинг растет</h3>
                      <p className="text-gray-400">Последнее обновление 5 мин назад</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" 
                            style={{ width: `${90 - i * 15}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-400">{90 - i * 15}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Остальной контент */}
      <main className="max-w-7xl mx-auto px-4 py-12 relative z-10">
      <section className="mb-16 relative">
          {/* Добавляем фоновые элементы для секции */}
          <div className="absolute inset-0 overflow-hidden -z-10">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute top-40 -left-20 w-72 h-72 bg-secondary/10 rounded-full blur-3xl"></div>
            <div className="absolute top-40 -right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          </div>
          
          <h1 className="relative text-5xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
              🏆 Лучшие промоутеры месяца 🏆
            </span>
          </h1>
          
          {loading ? (
            <div className="flex justify-center">
              <LoadingCard />
            </div>
          ) : error ? (
            <ErrorMessage />
          ) : topPromoters.length > 0 ? (
            <>
              {/* Топ-3 промоутеров в горизонтальном расположении */}
              <div className="flex flex-col lg:flex-row gap-6 mb-16 justify-center items-center">
                {/* Второе место (слева) */}
                {topPromoters.length > 1 && (
                  <div className="order-2 lg:order-1 w-full lg:w-1/3 transform lg:translate-y-8 animate-fadeIn relative" style={{ animationDelay: '0.2s' }}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-dark font-bold text-lg shadow-lg z-10">
                      2
                    </div>
                    <div className="relative bg-dark/50 backdrop-blur-xl p-6 rounded-2xl shadow-lg hover:shadow-neon transition-all duration-500 transform hover:-translate-y-2 border border-gray-300/20 group">
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-300/10 to-gray-400/10 rounded-2xl"></div>
                      
                      {/* Добавляем пульсирующее свечение */}
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-300/0 to-gray-400/0 rounded-2xl group-hover:from-gray-300/10 group-hover:to-gray-400/10 transition-all duration-500"></div>
                      
                      <div className="relative flex flex-col items-center text-center pt-2">
                        <div className="relative group">
                          <div className="absolute -inset-1 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                          <img 
                            src={topPromoters[1].avatar || "https://via.placeholder.com/60"} 
                            alt={topPromoters[1].name} 
                            className="relative w-24 h-24 rounded-full object-cover ring-2 ring-gray-300 transform group-hover:scale-105 transition duration-500"
                          />
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mt-4">{topPromoters[1].name}</h3>
                        
                        <div className="grid grid-cols-2 gap-4 mt-4 w-full">
                          <div className="flex items-center gap-2 justify-center">
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20">
                              <i className="fas fa-file-alt text-primary"></i>
                            </span>
                            <div>
                              <p className="text-xs text-gray-300">Листовки</p>
                              <p className="font-semibold text-white">{topPromoters[1].flyers}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 justify-center">
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/20">
                              <i className="fas fa-bolt text-secondary"></i>
                            </span>
                            <div>
                              <p className="text-xs text-gray-300">Скорость</p>
                              <p className="font-semibold text-white">{topPromoters[1].speed}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-4">
                          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-yellow-500/20">
                            <i className="fas fa-star text-yellow-500"></i>
                          </span>
                          <div>
                            <p className="text-xs text-gray-300">Рейтинг</p>
                            <p className="font-semibold text-white">{topPromoters[1].rating} из 5</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Первое место (по центру) */}
                <div className="order-1 lg:order-2 w-full lg:w-1/3 z-10 animate-fadeIn relative">
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-dark font-bold text-xl shadow-lg z-10">
                    {/* Декоративная корона с анимацией - с точной коррекцией позиции */}
                    <div className="absolute -top-9 translate-x-[0.05rem] text-4xl animate-float" style={{ animationDuration: '3s' }}>
                      <span className="inline-block">👑</span>
                    </div>
                    1
                  </div>
                  
                  <div 
                    className="relative bg-dark/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl hover:shadow-neon transition-all duration-500 transform hover:-translate-y-2 border border-yellow-500/30 group"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-2xl"></div>
                    
                    {/* Пульсирующее свечение для первого места */}
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 to-amber-500/0 rounded-2xl group-hover:from-yellow-500/20 group-hover:to-amber-500/20 transition-all duration-500"></div>
                    
                    <div className="relative flex flex-col items-center text-center pt-6">
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
                        <img 
                          src={topPromoters[0].avatar || "https://via.placeholder.com/60"} 
                          alt={topPromoters[0].name} 
                          className="relative w-32 h-32 rounded-full object-cover ring-4 ring-yellow-500/50 transform group-hover:scale-105 transition duration-500"
                        />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mt-4">
                        <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-transparent bg-clip-text">
                          {topPromoters[0].name}
                        </span>
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-6 mt-6 w-full">
                        <div className="flex items-center gap-3 justify-center">
                          <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20">
                            <i className="fas fa-file-alt text-primary"></i>
                          </span>
                          <div>
                            <p className="text-sm text-gray-300">Всего листовок</p>
                            <p className="font-semibold text-white">{topPromoters[0].flyers} штук</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 justify-center">
                          <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/20">
                            <i className="fas fa-bolt text-secondary"></i>
                          </span>
                          <div>
                            <p className="text-sm text-gray-300">Скорость</p>
                            <p className="font-semibold text-white">{topPromoters[0].speed ? `${topPromoters[0].speed} л/день` : 'Нет данных'}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-4">
                        <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-yellow-500/20">
                          <i className="fas fa-star text-yellow-500"></i>
                        </span>
                        <div>
                          <p className="text-sm text-gray-300">Рейтинг</p>
                          <p className="font-semibold text-white">{topPromoters[0].rating} из 5</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-4">
                        <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-500/20">
                          <i className="fas fa-map-marker-alt text-green-500"></i>
                        </span>
                        <div>
                          <p className="text-sm text-gray-300">Район</p>
                          <p className="font-semibold text-white">{topPromoters[0].district || 'Не указан'}</p>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex flex-wrap gap-2 justify-center">
                        {topPromoters[0].achievements?.map((achievement, index) => (
                          <span 
                            key={index}
                            className={`px-4 py-2 rounded-full text-sm font-medium ${
                              index === 0 ? 'bg-primary/20 text-primary' :
                              index === 1 ? 'bg-secondary/20 text-secondary' :
                              'bg-gradient-to-r from-yellow-400 to-amber-500 text-white'
                            }`}
                          >
                            {achievement}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Третье место (справа) */}
                {topPromoters.length > 2 && (
                  <div className="order-3 w-full lg:w-1/3 transform lg:translate-y-8 animate-fadeIn relative" style={{ animationDelay: '0.4s' }}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-10">
                      3
                    </div>
                    <div className="relative bg-dark/50 backdrop-blur-xl p-6 rounded-2xl shadow-lg hover:shadow-neon transition-all duration-500 transform hover:-translate-y-2 border border-amber-600/20 group">
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 to-amber-700/10 rounded-2xl"></div>
                      
                      {/* Добавляем пульсирующее свечение */}
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-600/0 to-amber-700/0 rounded-2xl group-hover:from-amber-600/10 group-hover:to-amber-700/10 transition-all duration-500"></div>
                      
                      <div className="relative flex flex-col items-center text-center pt-2">
                        <div className="relative mt-4 group">
                          <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                          <img 
                            src={topPromoters[2].avatar || "https://via.placeholder.com/60"} 
                            alt={topPromoters[2].name} 
                            className="relative w-24 h-24 rounded-full object-cover ring-2 ring-amber-600 transform group-hover:scale-105 transition duration-500"
                          />
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mt-4">{topPromoters[2].name}</h3>
                        
                        <div className="grid grid-cols-2 gap-4 mt-4 w-full">
                          <div className="flex items-center gap-2 justify-center">
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20">
                              <i className="fas fa-file-alt text-primary"></i>
                            </span>
                            <div>
                              <p className="text-xs text-gray-300">Листовки</p>
                              <p className="font-semibold text-white">{topPromoters[2].flyers}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 justify-center">
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/20">
                              <i className="fas fa-bolt text-secondary"></i>
                            </span>
                            <div>
                              <p className="text-xs text-gray-300">Скорость</p>
                              <p className="font-semibold text-white">{topPromoters[2].speed}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-4">
                          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-yellow-500/20">
                            <i className="fas fa-star text-yellow-500"></i>
                          </span>
                          <div>
                            <p className="text-xs text-gray-300">Рейтинг</p>
                            <p className="font-semibold text-white">{topPromoters[2].rating} из 5</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Добавляем декоративный разделитель между секциями */}
              <div className="relative py-8 my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center">
                  <div className="px-4 bg-transparent">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                      <i className="fas fa-trophy text-white text-xl"></i>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
                  <div className="w-32 h-32 bg-secondary/10 rounded-full blur-3xl ml-8"></div>
                </div>
              </div>

              {/* Заголовок для остальных промоутеров с декоративными элементами */}
              <div className="relative mb-8 text-center">
                <h2 className="text-3xl font-bold relative z-10">
                  <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                    Рейтинг лучших промоутеров
                  </span>
                </h2>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-2 bg-gradient-to-r from-transparent via-primary/20 to-transparent rounded-full"></div>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/5 rounded-full blur-xl"></div>
              </div>

              {/* Добавляем декоративные элементы фона для секции рейтинга */}
              <div className="relative">
                <div className="absolute inset-0 overflow-hidden -z-10">
                  <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
                  <div className="absolute top-40 -left-20 w-72 h-72 bg-secondary/10 rounded-full blur-3xl"></div>
                  <div className="absolute top-40 -right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
                </div>

                {/* Список остальных промоутеров (начиная с 4-го места) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {topPromoters.slice(3).map((promoter, index) => {
                    const rank = index + 4; // Начинаем с 4-го места
                    return (
                      <div 
                        key={promoter.id} 
                        className="relative bg-dark/50 backdrop-blur-xl p-6 rounded-xl shadow-lg hover:shadow-neon transition-all duration-300 transform hover:-translate-y-1 border border-gray-800/50 hover:border-primary/30"
                      >
                        {/* Градиентный фон карточки */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-dark/70 to-secondary/5 rounded-xl"></div>
                        
                        {/* Декоративный элемент */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-bl-full -z-10"></div>
                        
                        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-4">
                          <div className="relative shrink-0">
                            {/* Свечение вокруг аватара */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            
                            <img 
                              src={promoter.avatar || "https://via.placeholder.com/60"} 
                              alt={promoter.name} 
                              className="w-20 h-20 rounded-full object-cover ring-2 ring-primary/50 group-hover:ring-primary transition-all duration-300"
                            />
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                              {rank}
                            </div>
                          </div>
                          
                          <div className="flex-1 text-center sm:text-left">
                            <h3 className="text-lg font-semibold text-white mb-2 flex flex-col sm:flex-row items-center sm:items-start gap-2">
                              {promoter.name}
                              {rank === 4 && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full whitespace-nowrap">Почти в топе!</span>}
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-center gap-2 justify-center sm:justify-start">
                                <i className="fas fa-file-alt text-primary"></i>
                                <span className="text-gray-300 text-sm whitespace-nowrap">{promoter.flyers} шт.</span>
                              </div>
                              <div className="flex items-center gap-2 justify-center sm:justify-start">
                                <i className="fas fa-bolt text-secondary"></i>
                                <span className="text-gray-300 text-sm whitespace-nowrap">{promoter.speed}/день</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-row sm:flex-col items-center sm:items-end gap-4 sm:gap-1 mt-2 sm:mt-0">
                            <div className="flex items-center gap-1 text-yellow-500">
                              <i className="fas fa-star"></i>
                              <span className="font-medium">{promoter.rating}</span>
                            </div>
                            <div className="flex items-center gap-1 text-green-500 text-xs">
                              <i className="fas fa-map-marker-alt"></i>
                              <span className="text-gray-400">{promoter.district}</span>
                            </div>
                            
                            {/* Прогресс до следующего ранга */}
                            <div className="hidden sm:block mt-2 w-full">
                              <div className="w-24 h-1 bg-gray-800 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" 
                                  style={{ width: `${Math.min(100, 100 - (rank - 3) * 20)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-400">
              Нет данных о промоутерах
            </div>
          )}
        </section>

        <section>
          <div className="relative">
            {/* Декоративный фон */}
            <div className="absolute inset-0 overflow-hidden -z-10">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
            </div>

            <h2 className="relative text-3xl font-bold text-center mb-8">
              <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                Как стать лучшим промоутером?
              </span>
            </h2>

            {/* Заменяем дублирующийся список на информационные карточки */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="relative bg-dark/50 backdrop-blur-xl p-6 rounded-xl shadow-lg hover:shadow-neon transition-all transform hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl"></div>
                <div className="relative flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                    <i className="fas fa-tachometer-alt text-2xl text-primary"></i>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Скорость</h3>
                  <p className="text-gray-300">Раздавайте больше листовок каждый день, чтобы повысить свой рейтинг и заработать больше.</p>
                </div>
              </div>
              
              <div className="relative bg-dark/50 backdrop-blur-xl p-6 rounded-xl shadow-lg hover:shadow-neon transition-all transform hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl"></div>
                <div className="relative flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
                    <i className="fas fa-calendar-check text-2xl text-secondary"></i>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Стабильность</h3>
                  <p className="text-gray-300">Работайте регулярно, не пропускайте дни. Стабильность ценится выше разовых рекордов.</p>
                </div>
              </div>
              
              <div className="relative bg-dark/50 backdrop-blur-xl p-6 rounded-xl shadow-lg hover:shadow-neon transition-all transform hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl"></div>
                <div className="relative flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mb-4">
                    <i className="fas fa-star text-2xl text-yellow-500"></i>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Качество</h3>
                  <p className="text-gray-300">Следите за качеством раздачи. Высокий рейтинг поможет вам получить бонусы и призы.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Модальное окно с инструкцией */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative bg-dark/90 rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
            
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
              Как начать работу?
            </h3>
            
            <div className="space-y-4 text-gray-300">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary">1</span>
                </div>
                <p>Свяжитесь с нашим менеджером в Telegram: <a href="https://t.me/manager" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@manager</a></p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary">2</span>
                </div>
                <p>Получите материалы и инструкции для работы</p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary">3</span>
                </div>
                <p>Начните распространять листовки и отправляйте ежедневные отчеты</p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary">4</span>
                </div>
                <p>Следите за своим рейтингом и получайте бонусы за достижения!</p>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <a 
                href="https://t.me/manager" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 bg-gradient-to-r from-primary to-secondary rounded-lg font-medium text-white transition-all duration-300 hover:shadow-neon transform hover:-translate-y-1"
              >
                Написать менеджеру
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage; 
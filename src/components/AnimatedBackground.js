import React, { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
  const particlesRef = useRef(null);

  useEffect(() => {
    const createParticles = () => {
      const particles = particlesRef.current;
      if (!particles) return;

      // Очищаем существующие частицы
      particles.innerHTML = '';

      // Создаем новые частицы
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Случайная позиция
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Случайная задержка анимации
        particle.style.animationDelay = `${Math.random() * 15}s`;
        
        // Случайный размер
        const size = Math.random() * 3 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        particles.appendChild(particle);
      }
    };

    createParticles();
    const interval = setInterval(createParticles, 15000); // Обновляем частицы каждые 15 секунд

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animated-background">
      <div ref={particlesRef} className="particles" />
    </div>
  );
};

export default AnimatedBackground; 
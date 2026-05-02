"use client";

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Mostrar el botón si el scroll es mayor a 400px
      if (window.pageYOffset > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Ir Arriba"
      className={`fixed right-6 p-4 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/50 rounded-2xl text-[#a3e635] shadow-[0_20px_60px_rgba(0,0,0,0.8)] transition-all duration-500 z-[90] md:right-10 ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-90 pointer-events-none'
      }`}
      style={{ bottom: '5.5rem' }} // Ajustado para que no choque con el NavMobile en móvil
    >
      <ArrowUp size={24} strokeWidth={3} />
    </button>
  );
}

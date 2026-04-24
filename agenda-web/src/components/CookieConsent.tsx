"use client";

import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check localStorage in real app
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Delay to not bombard the user immediately
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 sm:bottom-4 left-0 right-0 sm:left-4 sm:right-auto z-[100] bg-slate-900 border border-slate-700/50 p-4 sm:rounded-2xl shadow-2xl max-w-sm w-full" style={{ paddingBottom: 'env(safe-area-inset-bottom, 1rem)' }}>
      <h3 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
        <span>🍪</span> Privacidad y Cookies
      </h3>
      <p className="text-slate-400 text-xs mb-4 leading-relaxed">
        Usamos cookies (y tecnologías similares) de AdSense y análisis para brindarte contenido personalizado y analizar nuestro tráfico.
      </p>
      <div className="flex gap-2">
        <button 
          onClick={accept}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-xl transition-colors"
        >
          Aceptar Todas
        </button>
        <button 
          onClick={accept}
          className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2 px-4 rounded-xl transition-colors"
        >
          Configurar
        </button>
      </div>
    </div>
  );
}

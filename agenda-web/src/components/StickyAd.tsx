"use client";

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function StickyAd() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show sticky ad after 3 seconds to let user focus on initial content
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed left-0 right-0 bottom-[calc(var(--nav-mobile-h)+env(safe-area-inset-bottom))] md:bottom-4 z-[70] flex justify-center w-full px-4 pointer-events-none animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="relative bg-[#0f172a]/95 backdrop-blur-md border border-slate-700/50 p-2 rounded-xl shadow-2xl pointer-events-auto max-w-full sm:max-w-[320px] w-full flex flex-col items-center">
        
        {/* Close Button */}
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute -top-4 -right-3 bg-slate-800 text-slate-400 hover:text-white grid place-items-center w-11 h-11 rounded-full border border-slate-700 shadow-md"
          aria-label="Cerrar Anuncio"
        >
          <X size={16} />
        </button>
        
        <div className="text-[8px] text-slate-500 uppercase tracking-widest font-black mb-1">
          Anuncio Patrocinado
        </div>

        {/* Dummy AdSense Container (320x50 or 320x100 equivalent) */}
        <div className="w-full h-[50px] bg-slate-900/80 border border-slate-800 rounded flex items-center justify-center text-slate-600 font-bold text-[10px] italic">
          Espacio AdSense (Sticky)
        </div>
      </div>
    </div>
  );
}

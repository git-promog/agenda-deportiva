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
    <div className="fixed bottom-0 left-0 right-0 z-[70] flex justify-center w-full px-4 pointer-events-none transition-transform duration-500 transform translate-y-0" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0.5rem)' }}>
      <div className="relative bg-[#0f172a]/95 backdrop-blur-md border border-slate-700/50 p-2 rounded-t-xl md:rounded-xl shadow-2xl pointer-events-auto max-w-full sm:max-w-[320px] w-full flex flex-col items-center">
        
        {/* Close Button */}
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute -top-3 -right-3 bg-slate-800 text-slate-400 hover:text-white p-1 rounded-full border border-slate-700 shadow-md"
          aria-label="Cerrar Anuncio"
        >
          <X size={14} />
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

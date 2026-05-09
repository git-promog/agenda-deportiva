import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// FlipNumber component for the stadium scoreboard effect
const FlipNumber = ({ value, label }: { value: string, label: string }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-20 md:w-20 md:h-24 bg-slate-900 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 shadow-[0_10px_20px_rgba(0,0,0,0.5)] border border-slate-700/50 perspective-1000">
        {/* Decorative middle line */}
        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-black/50 z-20 -translate-y-1/2 shadow-[0_1px_2px_rgba(255,255,255,0.1)]"></div>
        
        <AnimatePresence mode="popLayout">
          <motion.div
            key={value}
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 90, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl md:rounded-2xl"
            style={{ transformOrigin: "bottom" }}
          >
            <span className="text-3xl md:text-5xl font-black italic text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {value}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
      <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</span>
    </div>
  );
};

export default function WCCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    días: 0,
    horas: 0,
    minutos: 0,
    segundos: 0
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const targetDate = new Date('2026-06-11T13:00:00-06:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        días: Math.floor(distance / (1000 * 60 * 60 * 24)),
        horas: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutos: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        segundos: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isClient) return null; // Avoid hydration errors

  return (
    <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[40px] p-8 md:p-10 shadow-2xl relative overflow-hidden group">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-500/5 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
        <div className="text-center md:text-left flex-1">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <h3 className="text-[10px] font-black text-red-400 uppercase tracking-[0.4em]">Cuenta Regresiva</h3>
          </div>
          <p className="text-3xl md:text-4xl font-black italic uppercase text-white leading-none">El sueño comienza</p>
        </div>
        
        <div className="flex gap-3 md:gap-6 justify-center">
          {Object.entries(timeLeft).map(([label, value]) => (
            <FlipNumber key={label} label={label} value={value.toString().padStart(2, '0')} />
          ))}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';

export default function WCCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    días: 0,
    horas: 0,
    minutos: 0,
    segundos: 0
  });

  useEffect(() => {
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

  return (
    <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[40px] p-8 md:p-10 shadow-2xl relative overflow-hidden group">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-500/5 blur-[50px] rounded-full translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div className="text-center md:text-left">
          <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-2">Cuenta Regresiva</h3>
          <p className="text-2xl font-black italic uppercase text-white leading-none">El sueño comienza</p>
        </div>
        
        <div className="flex gap-4 md:gap-8 justify-center flex-1">
          {Object.entries(timeLeft).map(([label, value]) => (
            <div key={label} className="flex flex-col items-center">
              <div className="bg-gradient-to-b from-white/10 to-transparent border border-white/10 w-16 h-20 md:w-20 md:h-24 rounded-2xl flex items-center justify-center mb-3 shadow-inner group-hover:border-blue-500/30 transition-colors">
                <span className="text-2xl md:text-4xl font-black italic text-white drop-shadow-lg">
                  {value.toString().padStart(2, '0')}
                </span>
              </div>
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from 'react';
import { Home, Search, Radio, Menu, X, Newspaper, Tv, Users, Mail } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';

export default function NavMobile() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Cerrar el menú si cambia la ruta
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    if (id === 'listado-eventos-principal') {
      const eventosEnVivo = document.querySelectorAll('[data-envivo="true"]');
      if (eventosEnVivo.length > 0) {
        eventosEnVivo[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isSubpage = pathname.includes('/noticias') || 
                    pathname.includes('/plataformas') || 
                    pathname.includes('/quienes-somos') || 
                    pathname.includes('/contacto') || 
                    pathname.includes('/team') || 
                    pathname.includes('/futbol') || 
                    pathname.includes('/f1') || 
                    pathname.includes('/nba') || 
                    pathname.includes('/mlb') ||
                    pathname.includes('/mundial-2026');

  const isHome = pathname === '/';

  return (
    <div className="md:hidden fixed left-0 right-0 bottom-4 z-[80] flex justify-center pointer-events-none" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0.5rem)' }}>
      <div className="w-[90%] max-w-[400px] bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full py-3 px-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] pointer-events-auto relative">
        
        {/* Dynamic Mobile Bottom Sheet Navigation Overlay */}
        {menuOpen && (
          <div className="absolute bottom-[75px] left-0 right-0 bg-[#020617]/95 backdrop-blur-2xl border border-white/10 rounded-[32px] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-[75] animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Link 
                href="/" 
                onClick={() => { setMenuOpen(false); trackEvent('nav_click', { destination: 'home' }); }}
                className="flex items-center gap-2.5 bg-slate-900/60 border border-white/5 p-3.5 rounded-2xl text-[10px] font-black uppercase tracking-wider text-slate-300 hover:text-white transition-colors"
              >
                <Radio size={15} className="text-blue-500" /> Agenda
              </Link>
              <button 
                onClick={() => { 
                  setMenuOpen(false); 
                  window.dispatchEvent(new CustomEvent('scroll-to-live')); 
                  trackEvent('nav_click', { destination: 'envivo' });
                }} 
                className="flex items-center gap-2.5 bg-red-950/20 border border-red-500/20 p-3.5 rounded-2xl text-[10px] font-black uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors"
              >
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div> En Vivo
              </button>
              <Link 
                href="/noticias" 
                onClick={() => { setMenuOpen(false); trackEvent('nav_click', { destination: 'noticias' }); }}
                className="flex items-center gap-2.5 bg-slate-900/60 border border-white/5 p-3.5 rounded-2xl text-[10px] font-black uppercase tracking-wider text-slate-300 hover:text-white transition-colors"
              >
                <Newspaper size={15} className="text-emerald-500" /> Noticias
              </Link>
              <Link 
                href="/plataformas" 
                onClick={() => { setMenuOpen(false); trackEvent('nav_click', { destination: 'plataformas' }); }}
                className="flex items-center gap-2.5 bg-slate-900/60 border border-white/5 p-3.5 rounded-2xl text-[10px] font-black uppercase tracking-wider text-slate-300 hover:text-white transition-colors"
              >
                <Tv size={15} className="text-orange-500" /> Plataformas
              </Link>
              <Link 
                href="/quienes-somos" 
                onClick={() => { setMenuOpen(false); trackEvent('nav_click', { destination: 'quienes-somos' }); }}
                className="flex items-center gap-2.5 bg-slate-900/60 border border-white/5 p-3.5 rounded-2xl text-[10px] font-black uppercase tracking-wider text-slate-300 hover:text-white transition-colors"
              >
                <Users size={15} className="text-purple-500" /> Nosotros
              </Link>
              <Link 
                href="/contacto" 
                onClick={() => { setMenuOpen(false); trackEvent('nav_click', { destination: 'contacto' }); }}
                className="flex items-center gap-2.5 bg-slate-900/60 border border-white/5 p-3.5 rounded-2xl text-[10px] font-black uppercase tracking-wider text-slate-300 hover:text-white transition-colors"
              >
                <Mail size={15} className="text-pink-500" /> Contacto
              </Link>
            </div>
            <div className="flex items-center justify-between border-t border-white/5 pt-3 px-1 text-[9px] font-black text-slate-500 uppercase tracking-widest">
              <span>Región: México</span>
              <span>GuíaSports © 2026</span>
            </div>
          </div>
        )}

        {/* Tab Icons Row */}
        <div className="flex justify-between items-center w-full">
          <Link 
            href="/" 
            className={`group flex flex-col items-center gap-1 w-14 transition-all hover:-translate-y-1 ${isHome && !menuOpen ? 'text-[#a3e635]' : 'text-slate-400 hover:text-white'}`}
          >
            <div className={`p-2 rounded-2xl transition-all ${isHome && !menuOpen ? 'bg-[#a3e635]/20 shadow-[0_0_15px_rgba(163,230,53,0.3)]' : 'group-hover:bg-white/10'}`}>
              <Home size={22} className={isHome && !menuOpen ? 'fill-[#a3e635]/20' : ''} />
            </div>
          </Link>
          
          <button 
            onClick={() => scrollToSection('buscar')} 
            className="group flex flex-col items-center gap-1 w-14 text-slate-400 hover:text-white transition-all hover:-translate-y-1"
          >
            <div className="p-2 rounded-2xl transition-all group-hover:bg-white/10">
              <Search size={22} />
            </div>
          </button>

          <button 
            onClick={() => { setMenuOpen(false); window.dispatchEvent(new CustomEvent('scroll-to-live')); }} 
            className="group flex flex-col items-center gap-1 w-14 bg-red-600 text-white rounded-xl px-3 py-2 border border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.5)] animate-pulse hover:shadow-[0_0_35px_rgba(220,38,38,0.4)]"
          >
            <Radio size={22} />
          </button>

          {/* Bottom sheet toggle button replaces original news link */}
          <button 
            onClick={() => {
              setMenuOpen(!menuOpen);
              trackEvent('bottom_nav_click', { action: menuOpen ? 'close_menu' : 'open_menu' });
            }}
            className={`group flex flex-col items-center gap-1 w-14 transition-all hover:-translate-y-1 ${(isSubpage || menuOpen) ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
          >
            <div className={`p-2 rounded-2xl transition-all ${(isSubpage || menuOpen) ? 'bg-blue-600/20 shadow-[0_0_15px_rgba(59,130,246,0.3)] border border-blue-500/30' : 'group-hover:bg-white/10'}`}>
              {menuOpen ? (
                <X size={22} className="text-blue-400" />
              ) : (
                <Menu size={22} className={(isSubpage || menuOpen) ? 'text-blue-400' : 'text-slate-400'} />
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

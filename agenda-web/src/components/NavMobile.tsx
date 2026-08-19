"use client";

import { useEffect, useRef, useState } from 'react';
import { Home, Search, Radio, Menu, X, Newspaper, Tv, Users, Mail } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';

export default function NavMobile() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMenuOpen(false));
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const firstMenuItem = menuPanelRef.current?.querySelector<HTMLElement>('a, button');
    firstMenuItem?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

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
    <nav aria-label="Navegación móvil" className="md:hidden fixed inset-x-0 bottom-0 z-[80] bg-black/60 backdrop-blur-2xl border-t border-white/10 safe-area-bottom">
      {/* Dynamic Mobile Bottom Sheet Navigation Overlay */}
      {menuOpen && (
        <div ref={menuPanelRef} id="mobile-menu" className="absolute bottom-full left-0 right-0 mb-3 px-4">
          <div className="bg-[#020617]/95 backdrop-blur-2xl border border-white/10 rounded-[32px] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.9)] max-w-md mx-auto animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Link 
                href="/" 
                onClick={() => { closeMenu(); trackEvent('nav_click', { destination: 'home' }); }}
                className="flex items-center gap-2.5 bg-slate-900/60 border border-white/5 p-3 min-h-11 rounded-2xl text-[10px] font-black uppercase tracking-wider text-slate-300 hover:text-white transition-colors active:scale-95"
              >
                <Radio size={15} className="text-blue-500" aria-hidden="true" /> Agenda
              </Link>
              <button 
                type="button"
                onClick={() => { 
                  closeMenu();
                  window.dispatchEvent(new CustomEvent('scroll-to-live')); 
                  trackEvent('nav_click', { destination: 'envivo' });
                }} 
                className="flex items-center justify-center gap-1.5 bg-red-950/20 border border-red-500/20 p-3 min-h-11 rounded-2xl text-[10px] font-black uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors active:scale-95"
              >
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" aria-hidden="true"></span> En Vivo
              </button>
              <Link 
                href="/noticias" 
                onClick={() => { closeMenu(); trackEvent('nav_click', { destination: 'noticias' }); }}
                className="flex items-center gap-2.5 bg-slate-900/60 border border-white/5 p-3 min-h-11 rounded-2xl text-[10px] font-black uppercase tracking-wider text-slate-300 hover:text-white transition-colors active:scale-95"
              >
                <Newspaper size={15} className="text-emerald-500" aria-hidden="true" /> Noticias
              </Link>
              <Link 
                href="/plataformas" 
                onClick={() => { closeMenu(); trackEvent('nav_click', { destination: 'plataformas' }); }}
                className="flex items-center gap-2.5 bg-slate-900/60 border border-white/5 p-3 min-h-11 rounded-2xl text-[10px] font-black uppercase tracking-wider text-slate-300 hover:text-white transition-colors active:scale-95"
              >
                <Tv size={15} className="text-orange-500" aria-hidden="true" /> Plataformas
              </Link>
              <Link 
                href="/quienes-somos" 
                onClick={() => { closeMenu(); trackEvent('nav_click', { destination: 'quienes-somos' }); }}
                className="flex items-center gap-2.5 bg-slate-900/60 border border-white/5 p-3 min-h-11 rounded-2xl text-[10px] font-black uppercase tracking-wider text-slate-300 hover:text-white transition-colors active:scale-95"
              >
                <Users size={15} className="text-purple-500" aria-hidden="true" /> Nosotros
              </Link>
              <Link 
                href="/contacto" 
                onClick={() => { closeMenu(); trackEvent('nav_click', { destination: 'contacto' }); }}
                className="flex items-center gap-2.5 bg-slate-900/60 border border-white/5 p-3 min-h-11 rounded-2xl text-[10px] font-black uppercase tracking-wider text-slate-300 hover:text-white transition-colors active:scale-95"
              >
                <Mail size={15} className="text-pink-500" aria-hidden="true" /> Contacto
              </Link>
            </div>
            <div className="flex items-center justify-between border-t border-white/5 pt-3 px-1 text-[9px] font-black text-slate-500 uppercase tracking-widest">
              <span>Región: México</span>
              <span>GuíaSports © 2026</span>
            </div>
          </div>
        </div>
      )}

      {/* Docked Tab Bar */}
      <div className="h-16 max-w-md mx-auto flex items-stretch px-2">
        <Link
          href="/"
          onClick={() => trackEvent('nav_click', { destination: 'home' })}
          aria-label="Inicio"
          aria-current={isHome ? 'page' : undefined}
          className={`group flex flex-1 min-w-0 items-center justify-center min-h-11 active:scale-95 transition-transform ${isHome && !menuOpen ? 'text-[#a3e635]' : 'text-slate-400 hover:text-white'}`}
        >
          <span className={`grid place-items-center w-11 h-11 rounded-2xl transition-colors ${isHome && !menuOpen ? 'bg-[#a3e635]/20 shadow-[0_0_15px_rgba(163,230,53,0.3)]' : 'group-hover:bg-white/10'}`}>
            <Home size={22} className={isHome && !menuOpen ? 'fill-[#a3e635]/20' : ''} aria-hidden="true" />
          </span>
        </Link>

        <button
          type="button"
          onClick={() => scrollToSection('buscar')}
          aria-label="Buscar eventos"
          className="group flex flex-1 min-w-0 items-center justify-center min-h-11 text-slate-400 hover:text-white active:scale-95 transition-transform"
        >
          <span className="grid place-items-center w-11 h-11 rounded-2xl transition-colors group-hover:bg-white/10">
            <Search size={22} aria-hidden="true" />
          </span>
        </button>

        <button
          type="button"
          onClick={() => { setMenuOpen(false); window.dispatchEvent(new CustomEvent('scroll-to-live')); }}
          aria-label="Ver eventos en vivo"
          className="flex flex-1 min-w-0 items-center justify-center min-h-11 active:scale-95 transition-transform"
        >
          <span className="flex items-center justify-center gap-1.5 bg-red-600 text-white rounded-xl h-11 px-2 min-[360px]:px-3 border border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.5)] animate-pulse whitespace-nowrap">
            <Radio size={20} aria-hidden="true" />
            <span className="hidden min-[360px]:inline text-[10px] font-black uppercase tracking-widest">En Vivo</span>
          </span>
        </button>

        {/* Bottom sheet toggle button */}
        <button
          ref={menuButtonRef}
          id="mobile-menu-toggle"
          type="button"
          onClick={() => {
            setMenuOpen(!menuOpen);
            trackEvent('bottom_nav_click', { action: menuOpen ? 'close_menu' : 'open_menu' });
          }}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Cerrar menú principal' : 'Abrir menú principal'}
          className={`group flex flex-1 min-w-0 items-center justify-center min-h-11 active:scale-95 transition-transform ${(isSubpage || menuOpen) ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
        >
          <span className={`grid place-items-center w-11 h-11 rounded-2xl transition-colors ${(isSubpage || menuOpen) ? 'bg-blue-600/20 shadow-[0_0_15px_rgba(59,130,246,0.3)] border border-blue-500/30' : 'group-hover:bg-white/10'}`}>
            {menuOpen ? (
              <X size={22} className="text-blue-400" aria-hidden="true" />
            ) : (
              <Menu size={22} className={(isSubpage || menuOpen) ? 'text-blue-400' : 'text-slate-400'} aria-hidden="true" />
            )}
          </span>
        </button>
      </div>
    </nav>
  );
}

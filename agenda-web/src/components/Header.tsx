'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { Newspaper, Radio, Mail, Users, Tv } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface HeaderProps {
  ultimaAct?: string;
  showSearch?: boolean;
  busqueda?: string;
  onBusquedaChange?: (value: string) => void;
}

export default function Header({ ultimaAct, showSearch = false, busqueda = '', onBusquedaChange }: HeaderProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = window.scrollY;
      const windowHeight = document.body.scrollHeight - window.innerHeight;
      if (windowHeight > 0) {
        setScrollProgress((totalScroll / windowHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-900 z-[60]">
        <div className="h-full bg-gradient-to-r from-[#a3e635] to-blue-500 transition-all duration-75" style={{ width: `${scrollProgress}%` }}></div>
      </div>
      <header className="relative z-50 border-b border-white/5 bg-[#020617]/50 backdrop-blur-xl w-full overflow-x-hidden pt-1">
        <div className="max-w-4xl mx-auto px-4 py-3 md:pt-4 md:pb-0 w-full">
          <div className="flex justify-between items-center md:mb-4">
            <Link href="/" aria-label="GuíaSports, inicio" className="inline-flex min-h-11 items-center transition-transform active:scale-95 shrink-0">
              <NextImage src="/GuiaSports-logo.svg" alt="GuíaSports" width={200} height={50} className="h-10 w-auto" priority />
            </Link>
            <div className="hidden sm:flex flex-col items-end">
              <div className="text-[10px] font-black text-[#a3e635] bg-[#a3e635]/10 px-2 py-1 rounded border border-[#a3e635]/20 uppercase italic mb-1 tracking-widest">México</div>
              {ultimaAct && (
                <div className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-[#a3e635] rounded-full animate-pulse"></div> {ultimaAct}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-6 mb-4">
            <Link href="/" className="min-h-11 text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-[#a3e635] transition-colors flex items-center gap-1.5">
              <Radio size={14} aria-hidden="true" /> Agenda
            </Link>
            <button type="button" aria-label="Ver eventos en vivo" onClick={() => { window.dispatchEvent(new CustomEvent('scroll-to-live')); }} className="min-h-11 bg-red-600 text-white rounded-xl px-3 py-2 font-black uppercase text-[10px] tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.5)] animate-pulse flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" aria-hidden="true"></span> En Vivo
            </button>
            <Link 
              href="/noticias" 
              onClick={() => trackEvent('nav_click', { destination: 'noticias' })}
              className="min-h-11 text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-[#a3e635] transition-colors flex items-center gap-1.5"
            >
              <Newspaper size={14} aria-hidden="true" /> Noticias
            </Link>
            <Link 
              href="/plataformas" 
              onClick={() => trackEvent('nav_click', { destination: 'plataformas' })}
              className="min-h-11 text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-[#a3e635] transition-colors flex items-center gap-1.5"
            >
              <Tv size={14} aria-hidden="true" /> Plataformas
            </Link>
            <Link 
              href="/quienes-somos" 
              onClick={() => trackEvent('nav_click', { destination: 'quienes-somos' })}
              className="min-h-11 text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-[#a3e635] transition-colors flex items-center gap-1.5"
            >
              <Users size={14} aria-hidden="true" /> Nosotros
            </Link>
            <Link 
              href="/contacto" 
              onClick={() => trackEvent('nav_click', { destination: 'contacto' })}
              className="min-h-11 text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-[#a3e635] transition-colors flex items-center gap-1.5"
            >
              <Mail size={14} aria-hidden="true" /> Contacto
            </Link>
          </nav>

          {showSearch && (
            <div className="relative mb-4 w-full px-1">
              <label htmlFor="buscar" className="sr-only">Buscar equipos o ligas</label>
              <input 
                id="buscar" 
                type="text" 
                placeholder="Busca equipos o ligas..." 
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3 pl-4 pr-12 text-base focus:outline-none focus:border-[#a3e635] focus-visible:ring-2 focus-visible:ring-[#a3e635] text-slate-200"
                value={busqueda} 
                onChange={(e) => onBusquedaChange?.(e.target.value)} 
              />
              {busqueda && (
                <button 
                  type="button"
                  onClick={() => onBusquedaChange?.('')} 
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-800 grid place-items-center w-11 h-11 rounded-full text-slate-400 hover:text-white"
                  aria-label="Limpiar búsqueda"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>
      </header>
    </>
  );
}

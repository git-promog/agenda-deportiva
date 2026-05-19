'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { Newspaper, Radio, Mail, Users, Tv, Menu, X } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface HeaderProps {
  ultimaAct?: string;
  showSearch?: boolean;
  busqueda?: string;
  onBusquedaChange?: (value: string) => void;
}

export default function Header({ ultimaAct, showSearch = false, busqueda = '', onBusquedaChange }: HeaderProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

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
      <div className="relative z-50 border-b border-white/5 bg-[#020617]/50 backdrop-blur-xl w-full overflow-x-hidden pt-1">
        <div className="max-w-4xl mx-auto px-4 py-3 md:pt-4 md:pb-0 w-full">
          <div className="flex justify-between items-center md:mb-4">
            <Link href="/" className="transition-transform active:scale-95 shrink-0">
              <NextImage src="/GuiaSports-logo.svg" alt="GuíaSports" width={200} height={50} className="h-10 w-auto" priority />
            </Link>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <div className="text-[10px] font-black text-[#a3e635] bg-[#a3e635]/10 px-2 py-1 rounded border border-[#a3e635]/20 uppercase italic mb-1 tracking-widest">México</div>
                {ultimaAct && (
                  <div className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-[#a3e635] rounded-full animate-pulse"></div> {ultimaAct}
                  </div>
                )}
              </div>
              
              {/* Mobile Hamburger Button */}
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex md:hidden bg-slate-900/80 border border-white/10 p-2.5 rounded-2xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all active:scale-95 shadow-lg"
                aria-label="Toggle Menu"
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 mb-4">
            <Link href="/" className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-[#a3e635] transition-colors flex items-center gap-1.5">
              <Radio size={14} /> Agenda
            </Link>
            <button onClick={() => { window.dispatchEvent(new CustomEvent('scroll-to-live')); }} className="bg-red-600 text-white rounded-xl px-3 py-2 font-black uppercase text-[10px] tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.5)] animate-pulse flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div> En Vivo
            </button>
            <Link 
              href="/noticias" 
              onClick={() => trackEvent('nav_click', { destination: 'noticias' })}
              className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-[#a3e635] transition-colors flex items-center gap-1.5"
            >
              <Newspaper size={14} /> Noticias
            </Link>
            <Link 
              href="/plataformas" 
              onClick={() => trackEvent('nav_click', { destination: 'plataformas' })}
              className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-[#a3e635] transition-colors flex items-center gap-1.5"
            >
              <Tv size={14} /> Plataformas
            </Link>
            <Link 
              href="/quienes-somos" 
              onClick={() => trackEvent('nav_click', { destination: 'quienes-somos' })}
              className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-[#a3e635] transition-colors flex items-center gap-1.5"
            >
              <Users size={14} /> Nosotros
            </Link>
            <Link 
              href="/contacto" 
              onClick={() => trackEvent('nav_click', { destination: 'contacto' })}
              className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-[#a3e635] transition-colors flex items-center gap-1.5"
            >
              <Mail size={14} /> Contacto
            </Link>
          </nav>

          {/* Dynamic Mobile Navigation Overlay */}
          {menuOpen && (
            <div className="md:hidden border-t border-white/5 py-4 space-y-3 mb-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-2 gap-2">
                <Link 
                  href="/" 
                  onClick={() => { setMenuOpen(false); trackEvent('nav_click', { destination: 'home' }); }}
                  className="flex items-center gap-2.5 bg-slate-900/60 border border-white/5 p-3 rounded-2xl text-[10px] font-black uppercase tracking-wider text-slate-300 hover:text-white transition-colors"
                >
                  <Radio size={15} className="text-blue-500" /> Agenda
                </Link>
                <button 
                  onClick={() => { 
                    setMenuOpen(false); 
                    window.dispatchEvent(new CustomEvent('scroll-to-live')); 
                    trackEvent('nav_click', { destination: 'envivo' });
                  }} 
                  className="flex items-center gap-2.5 bg-red-950/20 border border-red-500/20 p-3 rounded-2xl text-[10px] font-black uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors"
                >
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div> En Vivo
                </button>
                <Link 
                  href="/noticias" 
                  onClick={() => { setMenuOpen(false); trackEvent('nav_click', { destination: 'noticias' }); }}
                  className="flex items-center gap-2.5 bg-slate-900/60 border border-white/5 p-3 rounded-2xl text-[10px] font-black uppercase tracking-wider text-slate-300 hover:text-white transition-colors"
                >
                  <Newspaper size={15} className="text-emerald-500" /> Noticias
                </Link>
                <Link 
                  href="/plataformas" 
                  onClick={() => { setMenuOpen(false); trackEvent('nav_click', { destination: 'plataformas' }); }}
                  className="flex items-center gap-2.5 bg-slate-900/60 border border-white/5 p-3 rounded-2xl text-[10px] font-black uppercase tracking-wider text-slate-300 hover:text-white transition-colors"
                >
                  <Tv size={15} className="text-orange-500" /> Plataformas
                </Link>
                <Link 
                  href="/quienes-somos" 
                  onClick={() => { setMenuOpen(false); trackEvent('nav_click', { destination: 'quienes-somos' }); }}
                  className="flex items-center gap-2.5 bg-slate-900/60 border border-white/5 p-3 rounded-2xl text-[10px] font-black uppercase tracking-wider text-slate-300 hover:text-white transition-colors"
                >
                  <Users size={15} className="text-purple-500" /> Nosotros
                </Link>
                <Link 
                  href="/contacto" 
                  onClick={() => { setMenuOpen(false); trackEvent('nav_click', { destination: 'contacto' }); }}
                  className="flex items-center gap-2.5 bg-slate-900/60 border border-white/5 p-3 rounded-2xl text-[10px] font-black uppercase tracking-wider text-slate-300 hover:text-white transition-colors"
                >
                  <Mail size={15} className="text-pink-500" /> Contacto
                </Link>
              </div>
              
              {/* Dynamic last-act inside mobile menu to keep main header clean */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5 px-2">
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Región: México</span>
                {ultimaAct && (
                  <div className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-[#a3e635] rounded-full animate-pulse"></div> {ultimaAct}
                  </div>
                )}
              </div>
            </div>
          )}

          {showSearch && (
            <div className="relative mb-4 w-full px-1">
              <input 
                id="buscar" 
                type="text" 
                placeholder="Busca equipos o ligas..." 
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3 pl-4 pr-10 text-base focus:outline-none focus:border-[#a3e635] text-slate-200" 
                value={busqueda} 
                onChange={(e) => onBusquedaChange?.(e.target.value)} 
              />
              {busqueda && (
                <button 
                  onClick={() => onBusquedaChange?.('')} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-800 p-1 rounded-full text-slate-400"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

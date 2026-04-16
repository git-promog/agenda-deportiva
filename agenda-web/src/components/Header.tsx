'use client';

import Link from 'next/link';
import NextImage from 'next/image';
import { Newspaper, Radio, Mail, Users } from 'lucide-react';

interface HeaderProps {
  ultimaAct?: string;
  showSearch?: boolean;
  busqueda?: string;
  onBusquedaChange?: (value: string) => void;
}

export default function Header({ ultimaAct, showSearch = false, busqueda = '', onBusquedaChange }: HeaderProps) {
  return (
    <>
      <div className="border-b border-slate-800 bg-[#020617]/95 backdrop-blur-md w-full overflow-x-hidden">
        <div className="max-w-4xl mx-auto px-4 pt-4 w-full">
          <div className="flex justify-between items-center mb-4">
            <Link href="/" className="transition-transform active:scale-95">
              <NextImage src="/GuiaSports-logo.svg" alt="GuíaSports" width={200} height={50} className="h-10 w-auto" priority />
            </Link>
            <div className="flex flex-col items-end">
              <div className="text-[10px] font-black text-[#a3e635] bg-[#a3e635]/10 px-2 py-1 rounded border border-[#a3e635]/20 uppercase italic mb-1 tracking-widest">México</div>
              {ultimaAct && (
                <div className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-[#a3e635] rounded-full animate-pulse"></div> {ultimaAct}
                </div>
              )}
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 mb-4">
            <Link href="/" className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-[#a3e635] transition-colors flex items-center gap-1.5">
              <Radio size={14} /> Agenda
            </Link>
            <button onClick={() => { window.dispatchEvent(new CustomEvent('scroll-to-live')); }} className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-300 transition-colors flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div> En Vivo
            </button>
            <Link href="/noticias" className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-[#a3e635] transition-colors flex items-center gap-1.5">
              <Newspaper size={14} /> Noticias
            </Link>
            <Link href="/quienes-somos" className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-[#a3e635] transition-colors flex items-center gap-1.5">
              <Users size={14} /> Nosotros
            </Link>
            <Link href="/contacto" className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-[#a3e635] transition-colors flex items-center gap-1.5">
              <Mail size={14} /> Contacto
            </Link>
          </nav>

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

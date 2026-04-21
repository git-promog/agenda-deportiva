"use client";

import { Home, Search, Radio, Newspaper } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavMobile() {
  const pathname = usePathname();

  const scrollToSection = (id: string) => {
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

  return (
    <div className="md:hidden fixed bottom-6 left-4 right-4 bg-slate-900/80 backdrop-blur-3xl border border-white/10 rounded-3xl py-3 px-6 z-[9999] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      <div className="flex justify-between items-center max-w-sm mx-auto">
        <Link href="/" className={`flex flex-col items-center gap-1 w-14 transition-colors ${pathname === '/' ? 'text-[#a3e635]' : 'text-slate-500 hover:text-slate-300'}`}>
          <Home size={20} className={pathname === '/' ? 'fill-[#a3e635]/20' : ''} />
          <span className="text-[8px] font-black uppercase tracking-widest">Inicio</span>
        </Link>
        
        <button onClick={() => scrollToSection('buscar')} className="flex flex-col items-center gap-1 w-14 text-slate-500 hover:text-slate-300 transition-colors">
          <Search size={20} />
          <span className="text-[8px] font-black uppercase tracking-widest">Buscar</span>
        </button>

        <button onClick={() => { window.dispatchEvent(new CustomEvent('scroll-to-live')); }} className="flex flex-col items-center gap-1 w-14 transition-colors relative">
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <div className="bg-red-600/20 p-2 rounded-xl border border-red-500/30">
            <Radio size={20} className="text-red-500" />
          </div>
          <span className="text-[8px] font-black uppercase tracking-widest text-red-500">En Vivo</span>
        </button>

        <Link href="/noticias" className={`flex flex-col items-center gap-1 w-14 transition-colors ${pathname.includes('/noticias') ? 'text-[#a3e635]' : 'text-slate-500 hover:text-slate-300'}`}>
          <Newspaper size={20} className={pathname.includes('/noticias') ? 'fill-[#a3e635]/20' : ''} />
          <span className="text-[8px] font-black uppercase tracking-widest">Noticias</span>
        </Link>
      </div>
    </div>
  );
}

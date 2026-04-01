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
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f172a]/90 backdrop-blur-xl border-t border-slate-800 pb-safe pt-2 px-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
      <div className="flex justify-between items-center h-16 max-w-md mx-auto">
        <Link href="/" className={`flex flex-col items-center gap-1 w-14 transition-colors ${pathname === '/' ? 'text-[#a3e635]' : 'text-slate-500 hover:text-slate-300'}`}>
          <Home size={20} className={pathname === '/' ? 'fill-[#a3e635]/20' : ''} />
          <span className="text-[8px] font-black uppercase tracking-widest">Inicio</span>
        </Link>
        
        <button onClick={() => scrollToSection('buscar')} className="flex flex-col items-center gap-1 w-14 text-slate-500 hover:text-slate-300 transition-colors">
          <Search size={20} />
          <span className="text-[8px] font-black uppercase tracking-widest">Buscar</span>
        </button>

        <button onClick={() => { window.dispatchEvent(new CustomEvent('scroll-to-live')); }} className="flex flex-col items-center gap-1 w-14 text-slate-500 hover:text-red-400 transition-colors">
          <Radio size={20} className="animate-pulse" />
          <span className="text-[8px] font-black uppercase tracking-widest text-red-400">En Vivo</span>
        </button>

        <Link href="/noticias" className={`flex flex-col items-center gap-1 w-14 transition-colors ${pathname.includes('/noticias') ? 'text-[#a3e635]' : 'text-slate-500 hover:text-slate-300'}`}>
          <Newspaper size={20} className={pathname.includes('/noticias') ? 'fill-[#a3e635]/20' : ''} />
          <span className="text-[8px] font-black uppercase tracking-widest">Noticias</span>
        </Link>
      </div>
    </div>
  );
}

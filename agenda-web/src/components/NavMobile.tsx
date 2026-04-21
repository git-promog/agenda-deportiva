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
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full py-3 px-6 z-[9999] shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
      <div className="flex justify-between items-center w-full">
        <Link href="/" className={`group flex flex-col items-center gap-1 w-14 transition-all hover:-translate-y-2 ${pathname === '/' ? 'text-[#a3e635]' : 'text-slate-400 hover:text-white'}`}>
          <div className={`p-2 rounded-2xl transition-all ${pathname === '/' ? 'bg-[#a3e635]/20 shadow-[0_0_15px_rgba(163,230,53,0.3)]' : 'group-hover:bg-white/10'}`}>
            <Home size={22} className={pathname === '/' ? 'fill-[#a3e635]/20' : ''} />
          </div>
        </Link>
        
        <button onClick={() => scrollToSection('buscar')} className="group flex flex-col items-center gap-1 w-14 text-slate-400 hover:text-white transition-all hover:-translate-y-2">
          <div className="p-2 rounded-2xl transition-all group-hover:bg-white/10">
            <Search size={22} />
          </div>
        </button>

        <button onClick={() => { window.dispatchEvent(new CustomEvent('scroll-to-live')); }} className="group flex flex-col items-center gap-1 w-14 transition-all hover:-translate-y-2 relative">
          <div className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse z-10"></div>
          <div className="p-2 rounded-2xl transition-all bg-red-600/20 border border-red-500/30 group-hover:bg-red-600/30 group-hover:shadow-[0_0_15px_rgba(220,38,38,0.4)]">
            <Radio size={22} className="text-red-500" />
          </div>
        </button>

        <Link href="/noticias" className={`group flex flex-col items-center gap-1 w-14 transition-all hover:-translate-y-2 ${pathname.includes('/noticias') ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}>
          <div className={`p-2 rounded-2xl transition-all ${pathname.includes('/noticias') ? 'bg-blue-600/20 shadow-[0_0_15px_rgba(59,130,246,0.3)] border border-blue-500/30' : 'group-hover:bg-white/10'}`}>
            <Newspaper size={22} className={pathname.includes('/noticias') ? 'fill-blue-400/20' : ''} />
          </div>
        </Link>
      </div>
    </div>
  );
}

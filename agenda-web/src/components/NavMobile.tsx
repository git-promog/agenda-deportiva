"use client";

import { Home, Search, Newspaper, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavMobile() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f172a]/90 backdrop-blur-xl border-t border-slate-800 pb-safe pt-2 px-6 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
      <div className="flex justify-between items-center h-16 max-w-md mx-auto">
        <Link href="/" className={`flex flex-col items-center gap-1 w-16 transition-colors ${pathname === '/' ? 'text-[#a3e635]' : 'text-slate-500 hover:text-slate-300'}`}>
          <Home size={22} className={pathname === '/' ? 'fill-[#a3e635]/20' : ''} />
          <span className="text-[9px] font-black uppercase tracking-widest">Inicio</span>
        </Link>
        
        <button className="flex flex-col items-center gap-1 w-16 text-slate-500 hover:text-slate-300 transition-colors">
          <Search size={22} />
          <span className="text-[9px] font-black uppercase tracking-widest">Buscar</span>
        </button>

        <Link href="/noticias" className={`flex flex-col items-center gap-1 w-16 transition-colors ${pathname.includes('/noticias') ? 'text-[#a3e635]' : 'text-slate-500 hover:text-slate-300'}`}>
          <Newspaper size={22} className={pathname.includes('/noticias') ? 'fill-[#a3e635]/20' : ''} />
          <span className="text-[9px] font-black uppercase tracking-widest">Previas</span>
        </Link>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
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
  const pathname = usePathname();
  const router = useRouter();

  const isActiveRoute = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);
  const isLiveRoute = pathname.startsWith('/envivo');
  const isAboutRoute = pathname.startsWith('/quienes-somos') || pathname.startsWith('/team');

  const handleLiveNavigation = () => {
    trackEvent('nav_click', { destination: 'envivo' });
    if (pathname === '/') {
      window.dispatchEvent(new CustomEvent('scroll-to-live'));
    } else {
      router.push('/envivo');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = window.scrollY;
      const windowHeight = document.body.scrollHeight - window.innerHeight;
      if (windowHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (totalScroll / windowHeight) * 100)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="gs-progress-track fixed top-0 left-0 z-[60] w-full" aria-hidden="true">
        <div className="gs-progress-bar h-full" style={{ width: `${scrollProgress}%` }}></div>
      </div>
      <header className="gs-shell-header relative z-50 w-full overflow-x-hidden pt-1">
        <div className="gs-shell-container mx-auto w-full">
          <div className="flex justify-between items-center md:mb-4">
            <Link href="/" aria-label="GuíaSports, inicio" className="gs-brand inline-flex min-h-11 shrink-0 items-center">
              <NextImage src="/GuiaSports-logo.svg" alt="GuíaSports" width={200} height={50} className="h-10 w-auto" priority />
            </Link>
            <div className="hidden sm:flex flex-col items-end">
              <div className="gs-region-badge mb-1">México</div>
              {ultimaAct && (
                <div className="gs-update-status flex items-center gap-1.5">
                  <div className="gs-status-dot" aria-hidden="true"></div> {ultimaAct}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav aria-label="Navegación principal" className="gs-desktop-nav hidden md:flex items-center">
            <Link href="/" aria-current={isActiveRoute('/') ? 'page' : undefined} className={`gs-nav-link ${isActiveRoute('/') ? 'gs-nav-link-active' : ''}`}>
              <Radio size={14} aria-hidden="true" /> Agenda
            </Link>
            <button type="button" aria-label="Ver eventos en vivo" aria-current={isLiveRoute ? 'page' : undefined} onClick={handleLiveNavigation} className={`gs-nav-link gs-nav-link-live ${isLiveRoute ? 'gs-nav-link-active' : ''}`}>
              <span className="gs-status-dot gs-status-dot-live" aria-hidden="true"></span> En Vivo
            </button>
            <Link 
              href="/noticias" 
              aria-current={isActiveRoute('/noticias') ? 'page' : undefined}
              onClick={() => trackEvent('nav_click', { destination: 'noticias' })}
              className={`gs-nav-link ${isActiveRoute('/noticias') ? 'gs-nav-link-active' : ''}`}
            >
              <Newspaper size={14} aria-hidden="true" /> Noticias
            </Link>
            <Link 
              href="/plataformas" 
              aria-current={isActiveRoute('/plataformas') ? 'page' : undefined}
              onClick={() => trackEvent('nav_click', { destination: 'plataformas' })}
              className={`gs-nav-link ${isActiveRoute('/plataformas') ? 'gs-nav-link-active' : ''}`}
            >
              <Tv size={14} aria-hidden="true" /> Plataformas
            </Link>
            <Link 
              href="/quienes-somos" 
              aria-current={isAboutRoute ? 'page' : undefined}
              onClick={() => trackEvent('nav_click', { destination: 'quienes-somos' })}
              className={`gs-nav-link ${isAboutRoute ? 'gs-nav-link-active' : ''}`}
            >
              <Users size={14} aria-hidden="true" /> Nosotros
            </Link>
            <Link 
              href="/contacto" 
              aria-current={isActiveRoute('/contacto') ? 'page' : undefined}
              onClick={() => trackEvent('nav_click', { destination: 'contacto' })}
              className={`gs-nav-link ${isActiveRoute('/contacto') ? 'gs-nav-link-active' : ''}`}
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
                className="gs-field py-3 pr-12"
                value={busqueda} 
                onChange={(e) => onBusquedaChange?.(e.target.value)} 
              />
              {busqueda && (
                <button 
                  type="button"
                  onClick={() => onBusquedaChange?.('')} 
                  className="gs-button-icon absolute right-2 top-1/2 -translate-y-1/2"
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

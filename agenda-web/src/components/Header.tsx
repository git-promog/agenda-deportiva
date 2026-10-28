'use client';

import { useState, useEffect, type MouseEvent } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { usePathname } from 'next/navigation';
import { Newspaper, Radio, Mail, Users, Tv, Search } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

const AGENDA_ROUTES = ['/', '/evento', '/futbol', '/nba', '/mlb', '/f1', '/mundial-2026'];

export default function Header() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathname = usePathname();

  const isActiveRoute = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
  const isAgendaRoute = AGENDA_ROUTES.some((href) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
  );
  const isLiveRoute = pathname.startsWith('/envivo');
  const isAboutRoute = pathname.startsWith('/quienes-somos') || pathname.startsWith('/team');
  const isAdminRoute = pathname.startsWith('/admin');

  const handleSearchNavigation = (event: MouseEvent<HTMLAnchorElement>) => {
    trackEvent('nav_click', { destination: 'search' });
    if (pathname !== '/') return;
    event.preventDefault();
    const input = document.getElementById('buscar') as HTMLInputElement | null;
    input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    input?.focus({ preventScroll: true });
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

  if (isAdminRoute) return null;

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
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/#buscar"
                onClick={handleSearchNavigation}
                className="gs-button-icon hidden min-h-11 min-w-11 md:inline-flex"
                aria-label="Buscar eventos"
                title="Buscar eventos"
              >
                <Search size={16} aria-hidden="true" />
              </Link>
              <div className="gs-region-badge">México</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav aria-label="Navegación principal" className="gs-desktop-nav hidden md:flex items-center">
            <Link href="/" aria-current={pathname === '/' ? 'page' : isAgendaRoute ? 'true' : undefined} className={`gs-nav-link ${isAgendaRoute ? 'gs-nav-link-active' : ''}`}>
              <Radio size={14} aria-hidden="true" /> Agenda
            </Link>
            <Link
              href="/envivo"
              aria-current={isLiveRoute ? 'page' : undefined}
              onClick={() => trackEvent('nav_click', { destination: 'envivo' })}
              className={`gs-nav-link gs-nav-link-live ${isLiveRoute ? 'gs-nav-link-active' : ''}`}
            >
              <span className="gs-status-dot gs-status-dot-live" aria-hidden="true"></span> En Vivo
            </Link>
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

        </div>
      </header>
    </>
  );
}

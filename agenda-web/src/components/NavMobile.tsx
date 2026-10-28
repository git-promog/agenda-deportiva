"use client";

import { useEffect, useRef, useState } from 'react';
import { Home, Search, Radio, Menu, X, Newspaper, Tv, Users, Mail } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { trackEvent } from '@/lib/analytics';

const MENU_EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

export default function NavMobile() {
  const pathname = usePathname();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
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
        return;
      }

      if (event.key === 'Tab' && menuPanelRef.current) {
        const focusableItems = Array.from(menuPanelRef.current.querySelectorAll<HTMLElement>('a, button'));
        if (focusableItems.length === 0) return;
        const firstItem = focusableItems[0];
        const lastItem = focusableItems[focusableItems.length - 1];
        if (event.shiftKey && document.activeElement === firstItem) {
          event.preventDefault();
          lastItem.focus();
        } else if (!event.shiftKey && document.activeElement === lastItem) {
          event.preventDefault();
          firstItem.focus();
        }
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
    if (pathname !== '/') {
      router.push('/#buscar');
      return;
    }
    if (id === 'listado-eventos-principal') {
      const eventosEnVivo = document.querySelectorAll('[data-envivo="true"]');
      if (eventosEnVivo.length > 0) {
        eventosEnVivo[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    }
    if (id === 'buscar') {
      const input = document.getElementById('buscar') as HTMLInputElement | null;
      input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      input?.focus({ preventScroll: true });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isHome = pathname === '/';
  const isLive = pathname.startsWith('/envivo');
  const isNews = pathname.startsWith('/noticias');
  const isPlatforms = pathname.startsWith('/plataformas');
  const isAbout = pathname.startsWith('/quienes-somos') || pathname.startsWith('/team');
  const isContact = pathname.startsWith('/contacto');
  const isAgenda = isHome || ['/evento', '/futbol', '/nba', '/mlb', '/f1', '/mundial-2026'].some(
    (href) => pathname === href || pathname.startsWith(`${href}/`)
  );
  const isSubpage = pathname !== '/';

  return (
    <nav aria-label="Navegación móvil" className={`gs-mobile-nav md:hidden fixed inset-x-0 bottom-0 safe-area-bottom ${menuOpen ? 'z-[110]' : 'z-[80]'}`}>
      {/* Dynamic Mobile Bottom Sheet Navigation Overlay */}
      <AnimatePresence initial={false}>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              key="gs-menu-backdrop"
              className="gs-menu-backdrop absolute bottom-full left-0 right-0 h-[calc(100vh-4rem)] bg-black/40"
              aria-label="Cerrar menú"
              onClick={closeMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.16, ease: MENU_EASE }}
            />
            <motion.div
              ref={menuPanelRef}
              key="gs-menu-panel"
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Menú principal"
              className="gs-menu-panel absolute bottom-full left-0 right-0 mb-3 mx-4 p-5 max-w-md md:mx-auto"
              style={{ transformOrigin: 'bottom' }}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.16, ease: MENU_EASE }}
            >
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/"
                aria-current={isHome ? 'page' : isAgenda ? 'true' : undefined}
                onClick={() => { closeMenu(); trackEvent('nav_click', { destination: 'home' }); }}
                className={`gs-menu-item ${isAgenda ? 'gs-menu-item-active' : ''}`}
              >
                <Radio size={15} className="text-blue-400" aria-hidden="true" /> Agenda
              </Link>
              <Link
                href="/envivo"
                aria-current={isLive ? 'page' : undefined}
                onClick={() => { closeMenu(); trackEvent('nav_click', { destination: 'envivo' }); }}
                className={`gs-menu-item gs-menu-item-live ${isLive ? 'gs-menu-item-active' : ''}`}
              >
                <span className="gs-status-dot gs-status-dot-live" aria-hidden="true"></span> En Vivo
              </Link>
              <Link
                href="/noticias"
                aria-current={isNews ? 'page' : undefined}
                onClick={() => { closeMenu(); trackEvent('nav_click', { destination: 'noticias' }); }}
                className={`gs-menu-item ${isNews ? 'gs-menu-item-active' : ''}`}
              >
                <Newspaper size={15} className="text-blue-400" aria-hidden="true" /> Noticias
              </Link>
            </div>
            <div className="my-3 border-t border-white/10" aria-hidden="true" />
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/plataformas"
                aria-current={isPlatforms ? 'page' : undefined}
                onClick={() => { closeMenu(); trackEvent('nav_click', { destination: 'plataformas' }); }}
                className={`gs-menu-item ${isPlatforms ? 'gs-menu-item-active' : ''}`}
              >
                <Tv size={15} className="text-blue-400" aria-hidden="true" /> Plataformas
              </Link>
              <Link
                href="/quienes-somos"
                aria-current={isAbout ? 'page' : undefined}
                onClick={() => { closeMenu(); trackEvent('nav_click', { destination: 'quienes-somos' }); }}
                className={`gs-menu-item ${isAbout ? 'gs-menu-item-active' : ''}`}
              >
                <Users size={15} className="text-blue-400" aria-hidden="true" /> Nosotros
              </Link>
              <Link
                href="/contacto"
                aria-current={isContact ? 'page' : undefined}
                onClick={() => { closeMenu(); trackEvent('nav_click', { destination: 'contacto' }); }}
                className={`gs-menu-item ${isContact ? 'gs-menu-item-active' : ''}`}
              >
                <Mail size={15} className="text-blue-400" aria-hidden="true" /> Contacto
              </Link>
            </div>
            <div className="gs-menu-meta flex items-center justify-between">
              <span>Región: México</span>
              <span>GuíaSports © 2026</span>
            </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Docked Tab Bar */}
      <div className="gs-mobile-nav-inner h-16 max-w-md mx-auto flex items-stretch px-2">
        <Link
          href="/"
          onClick={() => trackEvent('nav_click', { destination: 'home' })}
          aria-label="Inicio"
          aria-current={isHome ? 'page' : undefined}
          className={`gs-mobile-tab group flex flex-1 min-w-0 items-center justify-center ${isHome && !menuOpen ? 'gs-mobile-tab-active' : ''}`}
        >
          <span className="gs-mobile-tab-icon">
            <Home size={22} aria-hidden="true" />
          </span>
        </Link>

        <button
          type="button"
          onClick={() => scrollToSection('buscar')}
          aria-label="Buscar eventos"
          className="gs-mobile-tab group flex flex-1 min-w-0 items-center justify-center"
        >
          <span className="gs-mobile-tab-icon">
            <Search size={22} aria-hidden="true" />
          </span>
        </button>

        <Link
          href="/envivo"
          onClick={() => { setMenuOpen(false); trackEvent('nav_click', { destination: 'envivo' }); }}
          aria-label="Ver eventos en vivo"
          aria-current={isLive ? 'page' : undefined}
          className={`gs-mobile-tab flex flex-1 min-w-0 items-center justify-center ${isLive ? 'gs-mobile-tab-active' : ''}`}
        >
          <span className="gs-mobile-live flex items-center justify-center gap-1.5 whitespace-nowrap">
            <Radio size={20} aria-hidden="true" />
            <span className="hidden min-[360px]:inline text-[10px] font-black uppercase tracking-widest">En Vivo</span>
          </span>
        </Link>

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
          className={`gs-mobile-tab group flex flex-1 min-w-0 items-center justify-center ${(isSubpage || menuOpen) ? 'gs-mobile-tab-context' : ''}`}
        >
          <span className="gs-mobile-tab-icon">
            {menuOpen ? (
              <X size={22} aria-hidden="true" />
            ) : (
              <Menu size={22} aria-hidden="true" />
            )}
          </span>
        </button>
      </div>
    </nav>
  );
}

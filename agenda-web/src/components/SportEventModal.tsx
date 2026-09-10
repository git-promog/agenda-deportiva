import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Calendar, CalendarPlus, ChevronRight, Clock, Info, Radio, Tv, X } from 'lucide-react';
import ShareButton from '@/components/ShareButton';
import { trackEvent } from '@/lib/analytics';
import { buildEventPath, buildEventUrl } from '@/lib/eventUrls';
import { isEventLive } from '@/lib/mexicoTime';

interface Evento {
  id: string;
  fecha: string;
  hora: string;
  evento: string;
  competicion: string;
  deporte: string;
  canales: string;
}

interface Props {
  evento: Evento | null;
  isOpen: boolean;
  onClose: () => void;
}

type EventStatus = 'live' | 'upcoming' | 'finished';

const MODAL_EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

const UNCONFIRMED_CHANNEL_PATTERN = /por\s+confirmar|por\s+definir|pendiente|sin\s+(?:confirmar|determinar)|no\s+disponible|n\/d|tbd|por\s+anunciar/i;

function getEventStatus(evento: Evento): EventStatus {
  if (isEventLive(evento.fecha, evento.hora)) return 'live';

  const start = new Date(`${evento.fecha}T${evento.hora || '00:00'}:00-06:00`);
  return Number.isNaN(start.getTime()) || start.getTime() > Date.now() ? 'upcoming' : 'finished';
}

function getStatusLabel(status: EventStatus) {
  if (status === 'live') return 'En vivo';
  if (status === 'finished') return 'Finalizado';
  return 'Próximo';
}

export default function SportEventModal({ evento, isOpen, onClose }: Props) {
  const shouldReduceMotion = useReducedMotion();

  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const previousOverflowRef = useRef('');
  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);
  const [isClosing, setIsClosing] = useState(false);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      previousOverflowRef.current = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = previousOverflowRef.current; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || isClosing || !evento) return;

    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    const focusableSelector = 'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusFirstElement = () => {
      modalRef.current?.querySelector<HTMLElement>(focusableSelector)?.focus();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsClosing(true);
        return;
      }

      if (event.key !== 'Tab' || !modalRef.current) return;

      const focusableElements = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      );
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    const focusFrame = window.requestAnimationFrame(focusFirstElement);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [evento, isClosing, isOpen]);

  useEffect(() => () => {
    document.body.style.overflow = previousOverflowRef.current;
    previousFocusRef.current?.focus();
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    currentY.current = startY.current;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    currentY.current = e.touches[0].clientY;
    const deltaY = currentY.current - startY.current;
    if (deltaY > 0 && modalRef.current) {
      modalRef.current.style.transform = `translateY(${deltaY}px)`;
      modalRef.current.style.transition = 'none';
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const deltaY = currentY.current - startY.current;
    if (modalRef.current) {
      modalRef.current.style.transition = 'transform 0.3s ease-out';
      if (deltaY > 100) {
        setIsClosing(true);
      } else {
        modalRef.current.style.transform = 'translateY(0)';
      }
    }
  };

  if (!evento) return null;
  const activeEvento = evento;

  const sheetStartY = shouldReduceMotion ? 0 : '100%';
  const sheetTransition = shouldReduceMotion
    ? { type: 'tween' as const, duration: 0 }
    : { type: 'tween' as const, duration: 0.2, ease: MODAL_EASE };
  const fadeTransition = shouldReduceMotion
    ? { type: 'tween' as const, duration: 0 }
    : { type: 'tween' as const, duration: 0.16, ease: MODAL_EASE };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setIsClosing(true);
  };

  const isMatch = activeEvento.evento.toLowerCase().includes(' vs ');
  const teams = isMatch ? activeEvento.evento.split(/ vs /i) : [activeEvento.evento];
  const eventPath = buildEventPath(activeEvento);
  const eventUrl = buildEventUrl(activeEvento);
  const status = getEventStatus(activeEvento);
  const statusLabel = getStatusLabel(status);
  const transmissionUnconfirmed = !activeEvento.canales.trim() || UNCONFIRMED_CHANNEL_PATTERN.test(activeEvento.canales);
  const channelLabel = transmissionUnconfirmed ? 'Transmisión por confirmar' : activeEvento.canales;

  const buildCalendarLink = () => {
    const startDate = new Date(`${activeEvento.fecha}T${activeEvento.hora}:00-06:00`);
    const endDate = new Date(startDate.getTime() + (120 * 60 * 1000));
    const formatTime = (d: Date) => {
      if (isNaN(d.getTime())) return '';
      return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
    };
    const title = encodeURIComponent(`${activeEvento.evento}`);
    const details = encodeURIComponent(`Competición: ${activeEvento.competicion}\nTransmisión: ${channelLabel}`);
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatTime(startDate)}/${formatTime(endDate)}&details=${details}`;
  };

  return (
    <AnimatePresence onExitComplete={() => {
      setIsClosing(false);
      onClose();
      document.body.style.overflow = previousOverflowRef.current;
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
    }}>
      {isOpen && evento && !isClosing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={fadeTransition}
          className="fixed inset-0 z-[200] flex items-end md:items-center justify-center bg-[#020617]/80 backdrop-blur-sm p-0 md:p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sport-event-modal-title"
            initial={{ opacity: 0, y: sheetStartY }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: sheetStartY }}
            transition={sheetTransition}
            className="gs-modal w-full max-w-lg relative max-h-[90vh] md:max-h-auto flex flex-col"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Drag Handle (Mobile) */}
            <div className="md:hidden flex items-center justify-center py-3 border-b border-white/5 shrink-0">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            <div className="flex items-start justify-between gap-4 border-b border-white/5 p-5 md:p-6">
              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className={`gs-badge normal-case tracking-normal ${status === 'live' ? 'gs-badge-live' : status === 'finished' ? 'gs-badge-finished' : 'gs-badge-upcoming'}`}>
                    {status === 'live' && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" aria-hidden="true" />}
                    {statusLabel}
                  </span>
                  <span className="text-xs text-slate-500">{activeEvento.deporte}</span>
                </div>
                <h2 id="sport-event-modal-title" className="line-clamp-3 text-xl font-black leading-tight text-white md:text-2xl">
                  {activeEvento.evento}
                </h2>
              </div>
              <button type="button" onClick={() => setIsClosing(true)} className="gs-button-icon shrink-0" aria-label="Cerrar detalles">
                <X size={20} className="text-slate-300" />
              </button>
            </div>

            {/* Modal Body (scrollable) */}
            <div className="flex-1 overflow-y-auto p-5 md:p-8">
              {isMatch ? (
                <div className="mb-7 flex items-center justify-center gap-3 sm:gap-4">
                  <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-white/10 bg-slate-800 text-xl font-black text-slate-400 sm:h-16 sm:w-16 sm:text-2xl">
                      {teams[0].trim().substring(0, 2).toUpperCase()}
                    </div>
                    <span className="line-clamp-2 text-center text-sm font-bold text-white">{teams[0].trim()}</span>
                  </div>
                  <div className="text-xs font-black text-slate-500">VS</div>
                  <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-white/10 bg-slate-800 text-xl font-black text-slate-400 sm:h-16 sm:w-16 sm:text-2xl">
                      {teams[1].trim().substring(0, 2).toUpperCase()}
                    </div>
                    <span className="line-clamp-2 text-center text-sm font-bold text-white">{teams[1].trim()}</span>
                  </div>
                </div>
              ) : (
                <div className="mb-7" />
              )}

              <div className="mb-7 grid gap-3">
                <div className="flex items-center gap-4 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4">
                  <div className="rounded-xl bg-blue-500/20 p-2">
                    <Calendar size={20} className="text-blue-300" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200/70">Fecha</p>
                    <p className="text-sm font-bold capitalize text-white">
                      {new Date(activeEvento.fecha + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                  </div>
                </div>

                <div className={`flex items-center gap-4 rounded-2xl border p-4 ${status === 'live' ? 'border-red-400/30 bg-red-500/10' : 'border-lime-400/20 bg-lime-500/10'}`}>
                  <div className={`rounded-xl p-2 ${status === 'live' ? 'bg-red-500/20' : 'bg-lime-500/20'}`}>
                    <Clock size={20} className={status === 'live' ? 'text-red-300' : 'text-lime-300'} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{statusLabel}</p>
                    <p className={`text-lg font-black ${status === 'live' ? 'text-red-200' : 'text-white'}`}>{activeEvento.hora || 'Por definir'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-slate-700/60 bg-slate-800/50 p-4">
                  <div className="rounded-xl bg-slate-700/70 p-2">
                    <Radio size={20} className="text-slate-300" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Competición</p>
                    <p className="text-sm font-bold text-white">{activeEvento.competicion}</p>
                  </div>
                </div>

                <div className={`flex items-center gap-4 rounded-2xl border p-4 ${transmissionUnconfirmed ? 'border-slate-700/60 bg-slate-800/50' : 'border-blue-400/20 bg-blue-500/10'}`}>
                  <div className={`rounded-xl p-2 ${transmissionUnconfirmed ? 'bg-slate-700/70' : 'bg-blue-500/20'}`}>
                    <Tv size={20} className={transmissionUnconfirmed ? 'text-slate-300' : 'text-blue-300'} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Dónde verlo</p>
                    <p className="text-sm font-bold text-white">{channelLabel}</p>
                  </div>
                </div>
              </div>

              {transmissionUnconfirmed && (
                <p className="mb-2 flex items-center gap-2 text-xs leading-relaxed text-slate-400">
                  <Info size={14} className="text-blue-300" aria-hidden="true" />
                  La señal todavía no está confirmada. Revisa la agenda antes de comenzar el evento.
                </p>
              )}
            </div>

            {/* Actions (fixed at bottom) */}
            <div className="shrink-0 border-t border-white/5 p-5 pt-4 md:p-6 md:pt-4">
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-[1fr_auto_auto]">
                <a 
                  href={buildCalendarLink()} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('add_to_calendar', { 
                    event_name: activeEvento.evento,
                    competition: activeEvento.competicion
                  })}
                  className="gs-button gs-button-quiet w-full text-[10px]"
                >
                  <CalendarPlus size={16} /> Agendar
                </a>
                <Link
                  href={eventPath}
                  onClick={() => trackEvent('view_event_page', {
                    event_name: activeEvento.evento,
                    competition: activeEvento.competicion,
                    location: 'modal'
                  })}
                  className="gs-button gs-button-primary w-full text-[10px] sm:w-auto"
                >
                  Página del evento <ChevronRight size={16} aria-hidden="true" />
                </Link>
                <ShareButton 
                  titulo={activeEvento.evento}
                  url={eventUrl}
                  className="w-full !border-blue-400/30 !bg-blue-600 !text-white hover:!bg-blue-500 sm:w-auto"
                  variant="full"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

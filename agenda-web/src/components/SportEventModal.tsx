import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, ExternalLink, Tv, X, CalendarPlus, Trophy } from 'lucide-react';
import ShareButton from '@/components/ShareButton';
import { trackEvent } from '@/lib/analytics';
import { buildEventPath, buildEventUrl } from '@/lib/eventUrls';

const EMOJIS: { [key: string]: string } = {
  "Fútbol": "⚽️", "Básquetbol": "🏀", "Béisbol": "⚾️", "Fórmula 1": "🏎️", 
  "Motorismo": "🏍️", "Tenis": "🎾", "Fútbol Americano": "🏈", "Rugby": "🏉", 
  "Hockey": "🏒", "Combate": "🥊", "Ciclismo": "🚴", "Voleibol": "🏐", 
  "Golf": "⛳️", "Natación": "🏊", "Fútbol Sala": "👟", "Otros": "🏆"
};

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

export default function SportEventModal({ evento, isOpen, onClose }: Props) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!evento) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const isMatch = evento.evento.toLowerCase().includes(' vs ');
  const teams = isMatch ? evento.evento.split(/ vs /i) : [evento.evento];
  const eventPath = buildEventPath(evento);
  const eventUrl = buildEventUrl(evento);

  const buildCalendarLink = () => {
    const startDate = new Date(`${evento.fecha}T${evento.hora}:00-06:00`);
    const endDate = new Date(startDate.getTime() + (120 * 60 * 1000));
    const formatTime = (d: Date) => {
      if (isNaN(d.getTime())) return '';
      return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
    };
    const title = encodeURIComponent(`${evento.evento}`);
    const details = encodeURIComponent(`Competición: ${evento.competicion}\nTransmisión: ${evento.canales}`);
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatTime(startDate)}/${formatTime(endDate)}&details=${details}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-end md:items-center justify-center bg-[#020617]/80 backdrop-blur-sm p-0 md:p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-slate-900 border-t md:border border-slate-800 rounded-t-[32px] md:rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden relative"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{EMOJIS[evento.deporte] || "🏆"}</span>
                <span className="text-[10px] font-black uppercase tracking-widest bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                  {evento.deporte}
                </span>
              </div>
              <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            <div className="p-6 md:p-8">
              {isMatch ? (
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center border-4 border-white/10 shadow-lg text-2xl font-black text-slate-400 shrink-0">
                      {teams[0].trim().substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-sm font-black uppercase text-center text-white line-clamp-2">{teams[0].trim()}</span>
                  </div>
                  <div className="text-2xl font-black italic text-slate-700">VS</div>
                  <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center border-4 border-white/10 shadow-lg text-2xl font-black text-slate-400 shrink-0">
                      {teams[1].trim().substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-sm font-black uppercase text-center text-white line-clamp-2">{teams[1].trim()}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-black italic uppercase text-white leading-tight">{evento.evento}</h3>
                </div>
              )}

              <div className="grid gap-3 mb-8">
                <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                  <div className="bg-blue-500/20 p-2 rounded-xl">
                    <Calendar size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fecha</p>
                    <p className="text-sm font-bold text-white capitalize">
                      {new Date(evento.fecha + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                  <div className="bg-green-500/20 p-2 rounded-xl">
                    <Clock size={20} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hora</p>
                    <p className="text-sm font-bold text-white">{evento.hora}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                  <div className="bg-yellow-500/20 p-2 rounded-xl">
                    <Trophy size={20} className="text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Competición</p>
                    <p className="text-sm font-bold text-white">{evento.competicion}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                  <div className="bg-purple-500/20 p-2 rounded-xl">
                    <Tv size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Transmisión</p>
                    <p className="text-sm font-bold text-white">{evento.canales}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a 
                  href={buildCalendarLink()} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('add_to_calendar', { 
                    event_name: evento.evento,
                    competition: evento.competicion
                  })}
                  className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors border border-slate-700"
                >
                  <CalendarPlus size={16} /> Agendar
                </a>
                <Link
                  href={eventPath}
                  onClick={() => trackEvent('view_event_page', {
                    event_name: evento.evento,
                    competition: evento.competicion,
                    location: 'modal'
                  })}
                  className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors border border-slate-700"
                >
                  <ExternalLink size={16} /> Página
                </Link>
                <ShareButton 
                  titulo={evento.evento} 
                  url={eventUrl}
                  className="w-full flex items-center justify-center gap-2 !bg-blue-600 hover:!bg-blue-500 !text-white !p-4 !rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors border border-blue-500/50"
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

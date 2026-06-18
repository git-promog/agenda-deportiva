import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { WCMatch, getFlagUrl } from '@/data/mundialData';
import { Calendar, MapPin, Clock, Tv, X, Star, CalendarPlus, ExternalLink, StickyNote } from 'lucide-react';
import ShareButton from '@/components/ShareButton';
import { buildWorldCupMatchPath, buildWorldCupMatchUrl } from '@/lib/worldCupUrls';

interface Props {
  match: WCMatch | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  horaConvertida?: string;
  notaHora?: string;
  tzShort?: string;
}

export default function WCMatchModal({ 
  match, 
  isOpen, 
  onClose, 
  isFavorite, 
  onToggleFavorite,
  horaConvertida,
  notaHora,
  tzShort = 'CDMX'
}: Props) {

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!match) return null;

  const flag1 = getFlagUrl(match.equipo1);
  const flag2 = getFlagUrl(match.equipo2);
  const horaFinal = horaConvertida ?? match.hora;
  const matchPath = buildWorldCupMatchPath(match);
  const matchUrl = buildWorldCupMatchUrl(match);

  const getBroadcasters = () => {
    if (match.broadcasters) return match.broadcasters;

    // Solo transmisiones para México (Guía de programación deportiva México)
    const mexicoBroadcasters = 'TUDN · Canal 5 · Azteca 7 · ViX';
    
    // Partidos de México: todas las cadenas mexicanas
    if (match.equipo1 === 'México' || match.equipo2 === 'México') return mexicoBroadcasters;
    
    // Fase final: cobertura extendida en México
    if (['Final', 'Semifinal', 'Cuartos de final', 'Octavos de final', 'Dieciseisavos de final', 'Partido por el tercer puesto'].includes(match.fase)) {
      return mexicoBroadcasters;
    }
    
    // Resto de partidos fase de grupos: ViX (streaming) + posible señal abierta
    return 'ViX (Premium) · Consulte TUDN/Canal 5/Azteca 7';
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Build calendar link (Google Calendar)
  const buildCalendarLink = () => {
    const startDate = new Date(`${match.fecha}T${match.hora}:00-06:00`); // Base CDMX
    const endDate = new Date(startDate.getTime() + (120 * 60 * 1000));
    
    const formatTime = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const title = encodeURIComponent(`Mundial 2026: ${match.equipo1} vs ${match.equipo2}`);
    const details = encodeURIComponent(`Fase: ${match.fase}\nTransmisión: ${getBroadcasters()}`);
    const location = encodeURIComponent(`${match.estadio}, ${match.ciudad}`);
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatTime(startDate)}/${formatTime(endDate)}&details=${details}&location=${location}`;
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
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">
                  {match.fase}
                </span>
                {match.grupo && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Grupo {match.grupo}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onToggleFavorite}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                  aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                >
                  <Star size={18} className={isFavorite ? "fill-yellow-500 text-yellow-500" : "text-slate-400"} />
                </button>
                <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                  <X size={18} className="text-slate-400" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8">
              {/* Teams Matchup */}
              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="flex flex-col items-center gap-2 flex-1">
                  {flag1 ? (
                    <img src={flag1} alt={match.equipo1} className="w-16 h-16 rounded-full object-cover border-4 border-white/10 shadow-lg" />
                  ) : (
                    <span className="text-5xl">🏳️</span>
                  )}
                  <span className="text-sm font-black uppercase text-center text-white line-clamp-2">{match.equipo1}</span>
                </div>
                <div className="text-3xl font-black italic text-slate-700">VS</div>
                <div className="flex flex-col items-center gap-2 flex-1">
                  {flag2 ? (
                    <img src={flag2} alt={match.equipo2} className="w-16 h-16 rounded-full object-cover border-4 border-white/10 shadow-lg" />
                  ) : (
                    <span className="text-5xl">🏳️</span>
                  )}
                  <span className="text-sm font-black uppercase text-center text-white line-clamp-2">{match.equipo2}</span>
                </div>
              </div>

              {/* Match Details */}
              <div className="grid gap-3 mb-8">
                <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                  <div className="bg-blue-500/20 p-2 rounded-xl">
                    <Calendar size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fecha</p>
                    <p className="text-sm font-bold text-white capitalize">
                      {new Date(match.fecha + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                  <div className="bg-green-500/20 p-2 rounded-xl">
                    <Clock size={20} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hora de Inicio</p>
                    <p className="text-sm font-bold text-white flex items-center gap-2">
                      {horaFinal} <span className="text-slate-400 text-xs">{tzShort}</span>
                    </p>
                    {notaHora && <p className="text-[9px] text-slate-500 uppercase mt-0.5">{notaHora}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                  <div className="bg-yellow-500/20 p-2 rounded-xl">
                    <MapPin size={20} className="text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sede</p>
                    <p className="text-sm font-bold text-white truncate max-w-[200px] md:max-w-[250px]">{match.estadio}</p>
                    <p className="text-[10px] text-slate-400 uppercase">{match.ciudad}</p>
                  </div>
                </div>

                 <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                   <div className="bg-purple-500/20 p-2 rounded-xl">
                     <Tv size={20} className="text-purple-400" />
                   </div>
                   <div>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Transmisión</p>
                     <p className="text-sm font-bold text-white">{getBroadcasters()}</p>
                   </div>
                 </div>
                 
                 {match.streaming && (
                   <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                     <div className="bg-blue-500/20 p-2 rounded-xl">
                       <ExternalLink size={20} className="text-blue-400" />
                     </div>
                     <div>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Streaming</p>
                       <p className="text-sm font-bold text-white truncate">
                         <a href={match.streaming} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
                           Ver en vivo
                         </a>
                       </p>
                     </div>
                   </div>
                 )}
                 
                 {match.broadcastNotes && (
                   <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                     <div className="bg-blue-500/20 p-2 rounded-xl">
                       <StickyNote size={20} className="text-blue-400" />
                     </div>
                     <div>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Notas</p>
                       <p className="text-sm font-bold text-white">{match.broadcastNotes}</p>
                     </div>
                   </div>
                 )}
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a 
                  href={buildCalendarLink()} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors border border-slate-700"
                >
                  <CalendarPlus size={16} /> Agendar
                </a>
                <Link
                  href={matchPath}
                  className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors border border-slate-700"
                >
                  <ExternalLink size={16} /> Página
                </Link>
                <ShareButton 
                  titulo={`${match.equipo1} vs ${match.equipo2} — Mundial 2026`} 
                  url={matchUrl}
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

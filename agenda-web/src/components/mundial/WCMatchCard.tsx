import React from 'react';
import { WCMatch, getFlagUrl } from '@/data/mundialData';
import { Calendar, MapPin, Clock, Tv, Trophy } from 'lucide-react';

interface Props {
  match: WCMatch;
  horaConvertida?: string; // Hora ya convertida a la zona del usuario
  notaHora?: string;       // Ej. "Hora local sede" si no hay UTC disponible
  tzShort?: string;        // Ej. "CDMX", "EDT"
  matchStatus?: 'none' | 'today' | 'live';
}

export default function WCMatchCard({ match, horaConvertida, notaHora, tzShort = 'CDMX', matchStatus = 'none' }: Props) {
  const horaFinal = horaConvertida ?? match.hora;

  const getBroadcasters = () => {
    if (match.broadcasters) return match.broadcasters;
    if (match.equipo1 === 'México' || match.equipo2 === 'México') return 'TUDN · Canal 5 · Azteca 7 · ViX';
    if (['Argentina', 'Brasil', 'EE. UU.', 'Alemania', 'Francia', 'España'].includes(match.equipo1) ||
        ['Argentina', 'Brasil', 'EE. UU.', 'Alemania', 'Francia', 'España'].includes(match.equipo2))
      return 'TUDN · Canal 5 · ViX';
    return 'ViX (Premium)';
  };

  const flag1 = getFlagUrl(match.equipo1);
  const flag2 = getFlagUrl(match.equipo2);

  // Badge de fase
  const faseBadgeColor = () => {
    if (match.fase === 'Final') return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
    if (match.fase === 'Semifinal') return 'bg-purple-500/20 border-purple-500/30 text-purple-400';
    if (match.fase.includes('Cuartos')) return 'bg-orange-500/20 border-orange-500/30 text-orange-400';
    if (match.fase.includes('Octavos') || match.fase.includes('Dieciseis')) return 'bg-blue-500/20 border-blue-500/30 text-blue-400';
    return 'bg-slate-700/40 border-slate-700/50 text-slate-500';
  };

  return (
    <article
      className="group bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-4 md:p-5 hover:bg-slate-900/60 transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row md:items-center gap-6 shadow-lg"
      itemScope
      itemType="https://schema.org/SportsEvent"
    >
      <meta itemProp="name" content={`${match.equipo1} vs ${match.equipo2} — ${match.fase}`} />
      <meta itemProp="startDate" content={match.utc ?? `${match.fecha}T${match.hora}:00`} />
      <meta itemProp="location" content={match.estadio} />

      <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none">
        <Trophy size={40} className="text-blue-500" />
      </div>

      {matchStatus === 'live' && (
        <div className="absolute top-0 left-0 bg-red-600 text-white text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-br-xl rounded-tl-2xl flex items-center gap-1 shadow-lg shadow-red-900/50 z-10">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> EN VIVO
        </div>
      )}
      
      {matchStatus === 'today' && (
        <div className="absolute top-0 left-0 bg-green-600 text-white text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-br-xl rounded-tl-2xl z-10 shadow-lg shadow-green-900/30">
          HOY
        </div>
      )}

      {/* Fecha / Hora */}
      <div className="flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-8 gap-1 min-w-[130px]">
        <div className="flex items-center gap-2 text-[10px] font-black italic text-blue-400 uppercase tracking-tighter">
          <Calendar size={12} />
          {new Date(match.fecha + 'T12:00:00').toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }).replace('.', '').toUpperCase()}
        </div>
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2 text-white font-black text-lg" itemProp="startTime" content={horaFinal}>
            <Clock size={16} className="text-slate-600" />
            {horaFinal}
          </div>
          <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">
            {notaHora || tzShort}
          </span>
        </div>
      </div>

      {/* Equipos */}
      <div className="flex-1 flex items-center justify-between md:justify-start gap-4 md:gap-12">
        <div className="flex flex-col md:flex-row items-center gap-3 flex-1 md:flex-none md:w-[150px]">
          {flag1 ? (
            <img src={flag1} alt={match.equipo1} className="w-8 h-8 rounded-full object-cover border-2 border-white/10 shadow-lg" />
          ) : (
            <span className="text-2xl">🏳️</span>
          )}
          <span className="text-xs md:text-sm font-black uppercase italic text-white line-clamp-1" itemProp="homeTeam">{match.equipo1}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="text-[10px] font-black italic text-slate-700 select-none">VS</div>
          {match.grupo && (
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Grupo {match.grupo}</span>
          )}
        </div>

        <div className="flex flex-col md:flex-row-reverse items-center gap-3 flex-1 md:flex-none md:w-[150px]">
          {flag2 ? (
            <img src={flag2} alt={match.equipo2} className="w-8 h-8 rounded-full object-cover border-2 border-white/10 shadow-lg" />
          ) : (
            <span className="text-2xl">🏳️</span>
          )}
          <span className="text-xs md:text-sm font-black uppercase italic text-white line-clamp-1" itemProp="awayTeam">{match.equipo2}</span>
        </div>
      </div>

      {/* Info / Sede / Fase / Broadcaster */}
      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 border-t md:border-t-0 border-white/10 pt-4 md:pt-0">
        {/* Fase badge */}
        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${faseBadgeColor()}`}>
          {match.fase}
        </span>

        <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest truncate max-w-[160px]">
          <MapPin size={11} className="text-slate-700 shrink-0" />
          <span className="truncate">{match.estadio}</span>
        </div>

        <div className="flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 px-3 py-1.5 rounded-lg">
          <Tv size={11} className="text-blue-400 shrink-0" />
          <span className="text-[9px] font-black text-blue-400 uppercase whitespace-nowrap">{getBroadcasters()}</span>
        </div>
      </div>
    </article>
  );
}

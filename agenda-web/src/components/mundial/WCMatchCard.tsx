import React from 'react';
import { WCMatch, getFlagUrl } from '@/data/mundialData';
import { Calendar, MapPin, Clock, Tv, Trophy } from 'lucide-react';

interface Props {
  match: WCMatch;
}

export default function WCMatchCard({ match }: Props) {
  // Broadcasters logic based on FIFA data
  const getBroadcasters = () => {
    if (match.broadcasters) return match.broadcasters;
    if (match.equipo1 === 'México' || match.equipo2 === 'México') return 'TUDN | Canal 5 | Azteca 7 | ViX';
    if (['Argentina', 'Brasil', 'USA', 'Alemania', 'Francia'].includes(match.equipo1) || ['Argentina', 'Brasil', 'USA', 'Alemania', 'Francia'].includes(match.equipo2)) return 'TUDN | Canal 5 | ViX';
    return 'ViX (Premium)';
  };

  const flag1 = getFlagUrl(match.equipo1);
  const flag2 = getFlagUrl(match.equipo2);

  return (
    <div className="group bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-4 md:p-5 hover:bg-slate-900/60 transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row md:items-center gap-6 shadow-lg">
      <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none">
        <Trophy size={40} className="text-blue-500" />
      </div>

      {/* Date/Time Column */}
      <div className="flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-8 gap-1 min-w-[120px]">
        <div className="flex items-center gap-2 text-[10px] font-black italic text-blue-400 uppercase tracking-tighter">
          <Calendar size={12} />
          {new Date(match.fecha + 'T12:00:00').toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }).replace('.', '').toUpperCase()}
        </div>
        <div className="flex items-center gap-2 text-white font-black text-lg">
          <Clock size={16} className="text-slate-600" />
          {match.hora}
        </div>
      </div>

      {/* Teams Row */}
      <div className="flex-1 flex items-center justify-between md:justify-start gap-4 md:gap-12">
        <div className="flex flex-col md:flex-row items-center gap-3 flex-1 md:flex-none md:w-[150px]">
          {flag1 ? (
            <img src={flag1} alt={match.equipo1} className="w-8 h-8 rounded-full object-cover border-2 border-white/10 shadow-lg" />
          ) : (
            <span className="text-2xl">🏳️</span>
          )}
          <span className="text-xs md:text-sm font-black uppercase italic text-white line-clamp-1">{match.equipo1}</span>
        </div>
        
        <div className="text-[10px] font-black italic text-slate-700 select-none">VS</div>

        <div className="flex flex-col md:flex-row-reverse items-center gap-3 flex-1 md:flex-none md:w-[150px]">
          {flag2 ? (
            <img src={flag2} alt={match.equipo2} className="w-8 h-8 rounded-full object-cover border-2 border-white/10 shadow-lg" />
          ) : (
            <span className="text-2xl">🏳️</span>
          )}
          <span className="text-xs md:text-sm font-black uppercase italic text-white line-clamp-1">{match.equipo2}</span>
        </div>
      </div>

      {/* Info/Broadcaster Section */}
      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 border-t md:border-t-0 border-white/10 pt-4 md:pt-0">
        <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest truncate max-w-[150px]">
          <MapPin size={11} className="text-slate-700" />
          <span className="truncate">{match.estadio}</span>
        </div>
        <div className="flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 px-3 py-1.5 rounded-lg">
          <Tv size={11} className="text-blue-400" />
          <span className="text-[9px] font-black text-blue-400 uppercase whitespace-nowrap">{getBroadcasters()}</span>
        </div>
      </div>
    </div>
  );
}

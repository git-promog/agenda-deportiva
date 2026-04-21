import React from 'react';
import { Tv, Clock } from 'lucide-react';
import ShareButton from '@/components/ShareButton';

const EMOJIS: { [key: string]: string } = {
  "Fútbol": "⚽️", "Básquetbol": "🏀", "Béisbol": "⚾️", "Fórmula 1": "🏎️", 
  "Motorismo": "🏍️", "Tenis": "🎾", "Fútbol Americano": "🏈", "Rugby": "🏉", 
  "Hockey": "🏒", "Combate": "🥊", "Ciclismo": "🚴", "Voleibol": "🏐", 
  "Golf": "⛳️", "Natación": "🏊", "Fútbol Sala": "👟", "Otros": "🏆"
};

const THEMES: { [key: string]: { borderHover: string, neonGlow: string, textColor: string, bgTV: string } } = {
  "Fútbol": { borderHover: "hover:border-green-500/40", neonGlow: "group-hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]", textColor: "text-green-400", bgTV: "bg-green-950/20" },
  "Básquetbol": { borderHover: "hover:border-orange-500/40", neonGlow: "group-hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]", textColor: "text-orange-400", bgTV: "bg-orange-950/20" },
  "Béisbol": { borderHover: "hover:border-blue-500/40", neonGlow: "group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]", textColor: "text-blue-400", bgTV: "bg-blue-950/20" },
  "Fórmula 1": { borderHover: "hover:border-red-500/40", neonGlow: "group-hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]", textColor: "text-red-400", bgTV: "bg-red-950/20" },
};

const DEFAULT_THEME = { borderHover: "hover:border-blue-400/30", neonGlow: "group-hover:shadow-[0_0_20px_rgba(96,165,250,0.1)]", textColor: "text-[#a3e635]", bgTV: "bg-[#020617]" };

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
  evento: Evento;
  isLive: boolean;
}

export default function SportEventCard({ evento, isLive }: Props) {
  const theme = THEMES[evento.deporte] || DEFAULT_THEME;

  // Si está en vivo, forzamos un tema de alerta
  const liveBorder = isLive ? "border-red-500/40 shadow-[0_0_15px_rgba(220,38,38,0.2)]" : "border-slate-800/50";
  const liveHover = isLive ? "hover:border-red-400/60 hover:shadow-[0_0_25px_rgba(220,38,38,0.3)]" : `${theme.borderHover} ${theme.neonGlow}`;

  return (
    <article
      className={`group bg-slate-900/30 border ${liveBorder} ${liveHover} rounded-2xl p-4 md:p-5 hover:bg-slate-900/60 transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row md:items-center gap-4 shadow-lg`}
      itemScope
      itemType="https://schema.org/SportsEvent"
    >
      <meta itemProp="name" content={`${evento.evento} - ${evento.competicion}`} />
      <meta itemProp="startDate" content={`${evento.fecha}T${evento.hora}:00-06:00`} />
      <meta itemProp="sport" content={evento.deporte} />

      {isLive && (
        <div className="absolute top-0 right-0 md:left-0 md:right-auto bg-red-600 text-white text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-bl-xl md:rounded-bl-none md:rounded-br-xl rounded-tr-2xl md:rounded-tl-2xl flex items-center gap-1 shadow-lg shadow-red-900/50 z-10">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> EN VIVO
        </div>
      )}

      {/* Tipo de deporte visual y Hora */}
      <div className="flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-b md:border-b-0 md:border-r border-white/5 pb-3 md:pb-0 md:pr-6 gap-2 w-full md:w-auto md:min-w-[120px]">
        <div className="flex items-center gap-3 md:block">
          <div className="text-3xl md:text-4xl opacity-80 md:mb-1">{EMOJIS[evento.deporte] || "🏆"}</div>
          <div className="flex items-center gap-2 text-slate-300 font-black text-xl tracking-tighter" itemProp="startTime" content={evento.hora}>
            <Clock size={16} className={isLive ? "text-red-400" : "text-slate-600"} />
            <span className={isLive ? "text-red-400" : ""}>{evento.hora}</span>
          </div>
        </div>
      </div>

      {/* Main Info */}
      <div className="flex-1 flex flex-col justify-center min-w-0 pr-2">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 truncate">{evento.competicion}</span>
        <h3 className="text-base md:text-lg font-black italic text-slate-200 group-hover:text-white uppercase leading-tight mb-2 line-clamp-2 md:line-clamp-1">{evento.evento}</h3>
        
        {/* Canales */}
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <div className={`flex items-center gap-2 ${theme.bgTV} border border-white/5 px-3 py-1.5 rounded-lg`}>
            <Tv size={12} className={theme.textColor} />
            <span className={`text-[10px] font-black uppercase tracking-widest ${theme.textColor}`}>{evento.canales}</span>
          </div>
        </div>
      </div>

      {/* Share / Actions */}
      <div className="absolute bottom-4 right-4 md:static">
        <ShareButton 
          titulo={evento.evento} 
          url={`https://www.guiasports.com/?evento=${evento.id}`} 
          variant="icon"
          className="bg-slate-800/50 hover:bg-white/10"
        />
      </div>
    </article>
  );
}

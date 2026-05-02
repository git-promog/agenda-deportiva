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
  "Fútbol": { borderHover: "hover:border-green-500/40", neonGlow: "group-hover:shadow-[0_0_30px_rgba(34,197,94,0.25)]", textColor: "text-green-400", bgTV: "bg-green-950/20" },
  "Básquetbol": { borderHover: "hover:border-orange-500/40", neonGlow: "group-hover:shadow-[0_0_30px_rgba(249,115,22,0.25)]", textColor: "text-orange-400", bgTV: "bg-orange-950/20" },
  "Béisbol": { borderHover: "hover:border-blue-500/40", neonGlow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.25)]", textColor: "text-blue-400", bgTV: "bg-blue-950/20" },
  "Fórmula 1": { borderHover: "hover:border-red-500/40", neonGlow: "group-hover:shadow-[0_0_30px_rgba(239,68,68,0.25)]", textColor: "text-red-400", bgTV: "bg-red-950/20" },
};

const DEFAULT_THEME = { borderHover: "hover:border-blue-400/30", neonGlow: "group-hover:shadow-[0_0_30px_rgba(96,165,250,0.15)]", textColor: "text-[#a3e635]", bgTV: "bg-[#020617]" };

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
  onFiltrarLiga?: (liga: string) => void;
}

const formatChannels = (canalesStr: string, theme: any) => {
  const canales = canalesStr.split(/, | - | \/ /);
  return canales.map((c, i) => {
    let color = `${theme.bgTV} ${theme.textColor} border-white/5`;
    const cl = c.toLowerCase();
    if (cl.includes("vix")) color = "bg-orange-600/20 text-orange-400 border-orange-500/30 shadow-[0_0_10px_rgba(234,88,12,0.1)]";
    else if (cl.includes("espn")) color = "bg-red-900/30 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.1)]";
    else if (cl.includes("fox")) color = "bg-blue-900/30 text-blue-400 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.1)]";
    else if (cl.includes("tudn") || cl.includes("canal 5")) color = "bg-green-900/30 text-green-400 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.1)]";
    else if (cl.includes("azteca")) color = "bg-purple-900/30 text-purple-400 border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.1)]";
    else if (cl.includes("claro")) color = "bg-red-900/30 text-red-500 border-red-600/30 shadow-[0_0_10px_rgba(220,38,38,0.1)]";
    
    return (
      <div key={i} className={`flex items-center gap-1.5 border px-3 py-1.5 rounded-lg ${color}`}>
        <Tv size={12} />
        <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{c.trim()}</span>
      </div>
    );
  });
};

export default function SportEventCard({ evento, isLive, onFiltrarLiga }: Props) {
  const theme = THEMES[evento.deporte] || DEFAULT_THEME;

  const liveBorder = isLive ? "border-red-500/50 shadow-[0_0_20px_rgba(220,38,38,0.25)]" : "border-slate-800/80";
  const liveHover = isLive ? "hover:border-red-400/80 hover:shadow-[0_0_35px_rgba(220,38,38,0.4)]" : `${theme.borderHover} ${theme.neonGlow}`;

  const teams = evento.evento.split(/ vs /i);
  const isMatch = teams.length === 2;

  return (
    <article
      className={`group bg-slate-900/40 backdrop-blur-xl border ${liveBorder} ${liveHover} rounded-2xl p-4 md:p-5 hover:bg-slate-900/60 transition-all duration-300 relative flex flex-col md:flex-row md:items-center gap-4 shadow-xl`}
      itemScope
      itemType="https://schema.org/SportsEvent"
    >
      <meta itemProp="name" content={`${evento.evento} - ${evento.competicion}`} />
      <meta itemProp="startDate" content={`${evento.fecha}T${evento.hora}:00-06:00`} />
      <meta itemProp="sport" content={evento.deporte} />

      {isLive && (
        <div className="absolute top-0 left-0 bg-red-600 text-white text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-br-xl rounded-tl-2xl flex items-center gap-1 shadow-lg shadow-red-900/50 z-10">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> EN VIVO
        </div>
      )}

      {/* Tipo de deporte visual y Hora */}
      <div className="flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-b md:border-b-0 md:border-r border-white/10 pb-3 md:pb-0 md:pr-6 gap-2 w-full md:w-auto md:min-w-[120px]">
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
        <button 
          onClick={() => onFiltrarLiga?.(evento.competicion)}
          className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 truncate hover:text-blue-400 transition-colors text-left flex items-center gap-1"
        >
          {evento.competicion}
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        
        {isMatch ? (
          <div className="flex items-center gap-3 md:gap-6 my-2">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-end min-w-0">
              <span className="text-[11px] sm:text-sm md:text-base font-black uppercase italic text-white line-clamp-2 text-right leading-tight">{teams[0].trim()}</span>
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border-2 border-white/10 shadow-lg text-[10px] font-black shrink-0 text-slate-300">
                {teams[0].trim().substring(0,2).toUpperCase()}
              </div>
            </div>
            <div className="text-[10px] font-black italic text-slate-700 select-none">VS</div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border-2 border-white/10 shadow-lg text-[10px] font-black shrink-0 text-slate-300">
                {teams[1].trim().substring(0,2).toUpperCase()}
              </div>
              <span className="text-[11px] sm:text-sm md:text-base font-black uppercase italic text-white line-clamp-2 leading-tight">{teams[1].trim()}</span>
            </div>
          </div>
        ) : (
          <h3 className="text-base md:text-lg font-black italic text-slate-200 group-hover:text-white uppercase leading-tight mb-2 line-clamp-2">{evento.evento}</h3>
        )}

        {/* Canales */}
        <div className="flex flex-wrap items-center gap-2 mt-1">
          {formatChannels(evento.canales, theme)}
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

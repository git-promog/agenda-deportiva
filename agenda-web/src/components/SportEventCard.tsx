'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, Tv, Clock } from 'lucide-react';
import ShareButton from '@/components/ShareButton';
import { buildEventPath, buildEventUrl } from '@/lib/eventUrls';

const EMOJIS: { [key: string]: string } = {
  "Fútbol": "⚽️", "Básquetbol": "🏀", "Béisbol": "⚾️", "Fórmula 1": "🏎️", 
  "Motorismo": "🏍️", "Tenis": "🎾", "Fútbol Americano": "🏈", "Rugby": "🏉", 
  "Hockey": "🏒", "Combate": "🥊", "Ciclismo": "🚴", "Voleibol": "🏐", 
  "Golf": "⛳️", "Natación": "🏊", "Fútbol Sala": "👟", "Otros": "🏆"
};

interface Theme {
  borderHover: string;
  textColor: string;
  bgTV: string;
}

const THEMES: { [key: string]: Theme } = {
  "Fútbol": { borderHover: "hover:border-green-500/40", textColor: "text-green-400", bgTV: "bg-green-950/20" },
  "Básquetbol": { borderHover: "hover:border-orange-500/40", textColor: "text-orange-400", bgTV: "bg-orange-950/20" },
  "Béisbol": { borderHover: "hover:border-blue-500/40", textColor: "text-blue-400", bgTV: "bg-blue-950/20" },
  "Fórmula 1": { borderHover: "hover:border-red-500/40", textColor: "text-red-400", bgTV: "bg-red-950/20" },
};

const DEFAULT_THEME = { borderHover: "hover:border-blue-400/40", textColor: "text-[#a3e635]", bgTV: "bg-[#020617]" };

import { Evento } from '@/types';

interface Props {
  evento: Evento;
  isLive: boolean;
  onFiltrarLiga?: (liga: string) => void;
  onClick?: () => void;
}

const formatChannels = (canalesStr: string, theme: Theme) => {
  const canales = canalesStr.split(/, | - | \/ /);
  return canales.map((c, i) => {
    let color = `${theme.bgTV} ${theme.textColor} border-white/5`;
    const cl = c.toLowerCase();
    if (cl.includes("vix")) color = "bg-orange-600/20 text-orange-400 border-orange-500/30";
    else if (cl.includes("espn")) color = "bg-red-900/30 text-red-400 border-red-500/30";
    else if (cl.includes("fox")) color = "bg-blue-900/30 text-blue-400 border-blue-500/30";
    else if (cl.includes("tudn") || cl.includes("canal 5")) color = "bg-green-900/30 text-green-400 border-green-500/30";
    else if (cl.includes("azteca")) color = "bg-purple-900/30 text-purple-400 border-purple-500/30";
    else if (cl.includes("claro")) color = "bg-red-900/30 text-red-400 border-red-600/30";
    
    return (
      <div key={i} className={`flex items-center gap-1.5 border px-3 py-1.5 rounded-lg ${color}`}>
        <Tv size={12} />
        <span className="text-[10px] font-bold tracking-wide whitespace-nowrap">{c.trim()}</span>
      </div>
    );
  });
};

export default function SportEventCard({ evento, isLive, onFiltrarLiga, onClick }: Props) {
  const theme = THEMES[evento.deporte] || DEFAULT_THEME;
  const eventPath = buildEventPath(evento);
  const eventUrl = buildEventUrl(evento);

  const liveBorder = isLive ? "border-red-500/60" : "border-slate-800/80";
  const liveHover = isLive ? "hover:border-red-400/70" : theme.borderHover;

  const teams = evento.evento.split(/ vs /i);
  const isMatch = teams.length === 2;

  return (
    <article className={`group bg-slate-900/40 backdrop-blur-xl border ${liveBorder} ${liveHover} rounded-2xl p-4 md:p-5 hover:bg-slate-900/60 transition-colors duration-300 relative flex flex-col md:flex-row md:items-center gap-4 shadow-xl`}>
      {isLive && (
        <div className="absolute top-0 left-0 bg-red-600 text-white text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-br-xl rounded-tl-2xl flex items-center gap-1 z-10">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" aria-hidden="true" /> EN VIVO
        </div>
      )}

      {/* Tipo de deporte visual y Hora */}
      <div className="flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-b md:border-b-0 md:border-r border-white/10 pb-3 md:pb-0 md:pr-6 gap-2 w-full md:w-auto md:min-w-[120px]">
        <div className="flex items-center gap-3 md:block">
          <div className="text-3xl md:text-4xl opacity-80 md:mb-1">{EMOJIS[evento.deporte] || "🏆"}</div>
          <div className="flex items-center gap-2 text-slate-200 font-bold text-xl tracking-tighter">
            <Clock size={16} className={isLive ? "text-red-400" : "text-slate-400"} />
            <span className={isLive ? "text-red-400" : ""}>{evento.hora}</span>
          </div>
        </div>
      </div>

      {/* Main Info */}
      <div className="flex-1 flex flex-col justify-center min-w-0 pr-2">
        {onFiltrarLiga ? (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onFiltrarLiga?.(evento.competicion); }}
            className="min-h-11 text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 truncate hover:text-blue-400 transition-colors text-left flex items-center gap-1"
          >
            {evento.competicion}
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
        ) : (
          <span className="min-h-11 text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 truncate flex items-center">
            {evento.competicion}
          </span>
        )}

        <button
          type="button"
          onClick={onClick}
          disabled={!onClick}
          aria-label={`Ver detalles de ${evento.evento}`}
          className="w-full min-h-11 rounded-xl text-left focus-visible:ring-2 focus-visible:ring-[#a3e635] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
        >
          {isMatch ? (
            <span className="flex items-center gap-3 md:gap-6 my-2">
              <span className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-end min-w-0">
                <span className="text-[11px] sm:text-sm md:text-base font-bold text-white line-clamp-2 text-right leading-snug">{teams[0].trim()}</span>
                <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border-2 border-white/10 shadow-lg text-[10px] font-black shrink-0 text-slate-300" aria-hidden="true">
                  {teams[0].trim().substring(0,2).toUpperCase()}
                </span>
              </span>
              <span className="text-[10px] font-bold text-slate-500 select-none" aria-hidden="true">VS</span>
              <span className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border-2 border-white/10 shadow-lg text-[10px] font-black shrink-0 text-slate-300" aria-hidden="true">
                  {teams[1].trim().substring(0,2).toUpperCase()}
                </span>
                <span className="text-[11px] sm:text-sm md:text-base font-bold text-white line-clamp-2 leading-snug">{teams[1].trim()}</span>
              </span>
            </span>
          ) : (
            <span className="block text-base md:text-lg font-bold text-slate-200 group-hover:text-white leading-snug mb-2 line-clamp-2">{evento.evento}</span>
          )}
        </button>

        {/* Canales */}
        <div className="flex flex-wrap items-center gap-2 mt-1">
          {formatChannels(evento.canales, theme)}
        </div>
      </div>

      {/* Share / Actions */}
      <div className="flex items-center justify-end gap-2 w-full md:w-auto md:shrink-0 mt-1 md:mt-0">
        <Link
          href={eventPath}
          onClick={(e) => e.stopPropagation()}
          className="hidden sm:flex min-h-11 min-w-11 items-center justify-center gap-1.5 p-2.5 bg-slate-800/50 rounded-xl hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
          aria-label={`Ver página de ${evento.evento}`}
        >
          <ExternalLink size={14} aria-hidden="true" />
        </Link>
        <ShareButton 
          titulo={evento.evento} 
          url={eventUrl} 
          variant="icon"
          className="min-h-11 min-w-11 grid place-items-center bg-slate-800/50 hover:bg-white/10"
        />
      </div>
    </article>
  );
}

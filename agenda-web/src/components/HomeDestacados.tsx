import React from 'react';
import { ArrowUpRight, Clock, Star } from 'lucide-react';
import { Evento } from '@/types';

const EMOJIS: { [key: string]: string } = {
  "Fútbol": "⚽️", "Básquetbol": "🏀", "Béisbol": "⚾️", "Fórmula 1": "🏎️",
  "Motorismo": "🏍️", "Tenis": "🎾", "Fútbol Americano": "🏈", "Rugby": "🏉",
  "Hockey": "🏒", "Combate": "🥊", "Ciclismo": "🚴", "Voleibol": "🏐",
  "Golf": "⛳️", "Natación": "🏊", "Fútbol Sala": "👟", "Otros": "🏆"
};

interface Props {
  destacados: Evento[];
  onEventClick?: (evento: Evento) => void;
}

export default function HomeDestacados({ destacados, onEventClick }: Props) {
  if (!destacados || destacados.length === 0) return null;

  return (
    <section className="gs-home-section" aria-labelledby="home-destacados-title">
      <div className="gs-home-section-header">
        <h2 id="home-destacados-title" className="gs-home-section-heading">
          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" aria-hidden="true" />
          Imperdibles de hoy
        </h2>
        <span className="gs-home-section-meta">{destacados.length} seleccionados</span>
      </div>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
        {destacados.map((e) => (
          <button
            key={e.id}
            type="button"
            onClick={() => onEventClick?.(e)}
            className="gs-card gs-card-interactive group flex min-h-[12.5rem] w-[85vw] min-w-[17.5rem] max-w-[21rem] flex-shrink-0 flex-col justify-between p-5 text-left"
          >
            <div>
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-yellow-400">{e.competicion}</div>
                <div className="text-xl opacity-80" aria-hidden="true">{EMOJIS[e.deporte] || "🏆"}</div>
              </div>
              <div className="line-clamp-2 text-base font-extrabold leading-tight text-white">{e.evento}</div>
            </div>
            <div className="mt-5 grid gap-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Clock className="h-4 w-4 text-yellow-400" aria-hidden="true" />
                <span>{e.hora}</span>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-slate-700/70 pt-3 text-xs">
                <span className="truncate text-slate-300">{e.canales}</span>
                <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-yellow-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

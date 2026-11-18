'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Clock } from 'lucide-react';
import ShareButton from '@/components/ShareButton';
import ChannelCapsule from '@/components/ChannelCapsule';
import { buildEventPath, buildEventUrl } from '@/lib/eventUrls';
import { Evento } from '@/types';

const EMOJIS: { [key: string]: string } = {
  "Fútbol": "⚽️", "Básquetbol": "🏀", "Béisbol": "⚾️", "Fórmula 1": "🏎️",
  "Motorismo": "🏍️", "Tenis": "🎾", "Fútbol Americano": "🏈", "Rugby": "🏉",
  "Hockey": "🏒", "Combate": "🥊", "Ciclismo": "🚴", "Voleibol": "🏐",
  "Golf": "⛳️", "Natación": "🏊", "Fútbol Sala": "👟", "Otros": "🏆"
};

const TEAM_STOPWORDS = new Set(['de', 'del', 'la', 'las', 'los', 'el', 'y']);
const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

interface Props {
  evento: Evento;
  isLive: boolean;
  now: number;
  onFiltrarLiga?: (liga: string) => void;
  onClick?: () => void;
}

type EventStatus = 'live' | 'upcoming' | 'finished';

function getEventStatus(fecha: string, hora: string, isLive: boolean, nowMs: number): EventStatus {
  if (isLive) return 'live';

  const start = new Date(`${fecha}T${hora || '00:00'}:00-06:00`);
  return Number.isNaN(start.getTime()) || start.getTime() > nowMs ? 'upcoming' : 'finished';
}

function formatEventDate(fecha: string) {
  const date = new Date(`${fecha}T12:00:00`);
  if (Number.isNaN(date.getTime())) return fecha;
  return `${WEEKDAYS[date.getDay()]} ${String(date.getDate()).padStart(2, '0')} ${MONTHS[date.getMonth()]}`;
}

function getStatusLabel(status: EventStatus) {
  if (status === 'live') return 'En vivo';
  if (status === 'finished') return 'Finalizado';
  return 'Próximo';
}

function getTeamInitials(name: string) {
  const words = name
    .trim()
    .split(/\s+/)
    .filter((word) => word && !TEAM_STOPWORDS.has(word.toLowerCase()));

  if (words.length === 0) return name.trim().slice(0, 2).toUpperCase();
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words.slice(0, 2).map((word) => word[0]).join('').toUpperCase();
}

export default function SportEventCard({ evento, isLive, now, onFiltrarLiga, onClick }: Props) {
  const eventPath = buildEventPath(evento);
  const eventUrl = buildEventUrl(evento);
  const status = getEventStatus(evento.fecha, evento.hora, isLive, now);
  const statusLabel = getStatusLabel(status);
  const teams = evento.evento.split(/ vs /i);
  const isMatch = teams.length === 2;
  const accent = status === 'live' ? 'bg-red-400' : 'bg-blue-400';
  const competition = evento.competicion || evento.deporte || 'Deportes';

  const primaryClassName =
    'gs-button gs-button-primary !min-h-11 !min-w-11 !w-11 !rounded-lg !p-0';

  return (
    <article
      className={`group gs-card gs-card-interactive relative overflow-hidden p-3.5 ${
        status === 'live' ? 'border-red-500/60 hover:border-red-400/70' : 'border-slate-800/80'
      }`}
    >
      <div className="border-b border-white/10 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900/70 text-2xl" aria-hidden="true">
              {EMOJIS[evento.deporte] || '🏆'}
            </span>
            <div className="min-w-0">
              <div className={`flex items-center gap-1.5 text-2xl font-black tracking-tight ${status === 'live' ? 'text-red-300' : 'text-white'}`}>
                <Clock size={18} className={status === 'live' ? 'text-red-300' : 'text-slate-400'} aria-hidden="true" />
                <span className="gs-time tabular-nums">{evento.hora || 'Por definir'}</span>
              </div>
              <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
                {formatEventDate(evento.fecha)}
              </p>
            </div>
          </div>

          <div className="flex min-w-0 flex-col items-end gap-0.5 text-right">
            <span
              className={`gs-badge whitespace-nowrap normal-case tracking-normal ${
                status === 'live' ? 'gs-badge-live' : status === 'finished' ? 'gs-badge-finished' : 'gs-badge-upcoming'
              }`}
            >
              {status === 'live' && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" aria-hidden="true" />}
              {statusLabel}
            </span>

            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
              <span className={`h-1.5 w-1.5 rounded-full ${accent}`} aria-hidden="true" />
              {evento.deporte || 'Deportes'}
            </span>
          </div>
        </div>

        <div className="relative mt-0.5 flex h-5 items-center justify-center">
          {onFiltrarLiga ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onFiltrarLiga(competition);
              }}
              className="absolute inset-x-0 top-1/2 z-10 flex min-h-11 -translate-y-1/2 items-center justify-center rounded-md px-2 text-center text-[10px] font-bold uppercase leading-none tracking-[0.08em] text-slate-300 transition-colors hover:text-blue-300 md:text-[11px]"
              title={`Filtrar por ${competition}`}
            >
              <span className="max-w-full truncate">{competition}</span>
            </button>
          ) : (
            <span className="max-w-full truncate text-center text-[10px] font-bold uppercase leading-none tracking-[0.08em] text-slate-300 md:text-[11px]">
              {competition}
            </span>
          )}
        </div>
      </div>

      <div className="mt-2.5 min-w-0">
        <button
          type="button"
          onClick={onClick}
          disabled={!onClick}
          aria-label={`Abrir ficha de ${evento.evento}`}
          className="min-h-11 w-full rounded-xl text-left focus-visible:ring-2 focus-visible:ring-[#a3e635] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-default"
        >
          {isMatch ? (
            <span className="flex items-center gap-2 sm:gap-3">
              <span className="flex min-w-0 flex-1 items-center justify-end gap-2">
                <span className="line-clamp-2 text-right text-sm font-bold leading-snug text-white sm:text-base">
                  {teams[0].trim()}
                </span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-white/10 bg-slate-800 text-[10px] font-black text-slate-300" aria-hidden="true">
                  {getTeamInitials(teams[0])}
                </span>
              </span>

              <span className="select-none text-[11px] font-black uppercase tracking-[0.08em] text-[#a3e635]" aria-hidden="true">
                vs
              </span>

              <span className="flex min-w-0 flex-1 items-center gap-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-white/10 bg-slate-800 text-[10px] font-black text-slate-300" aria-hidden="true">
                  {getTeamInitials(teams[1])}
                </span>
                <span className="line-clamp-2 text-sm font-bold leading-snug text-white sm:text-base">
                  {teams[1].trim()}
                </span>
              </span>
            </span>
          ) : (
            <span className="block line-clamp-2 text-base font-bold leading-snug text-white transition-colors group-hover:text-slate-100 md:text-lg">
              {evento.evento}
            </span>
          )}
        </button>
      </div>

      <div className="mt-2.5 flex min-w-0 items-center gap-2 border-t border-white/10 pt-2.5">
        <ChannelCapsule canales={evento.canales} className="min-w-0 flex-1" />

        <ShareButton
          titulo={evento.evento}
          url={eventUrl}
          variant="icon"
          className="!min-h-11 !min-w-11 !rounded-lg"
        />

        {onClick ? (
          <button
            type="button"
            onClick={onClick}
            className={primaryClassName}
            aria-label={`Ver detalles de ${evento.evento}`}
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        ) : (
          <Link
            href={eventPath}
            className={primaryClassName}
            aria-label={`Ver página de ${evento.evento}`}
          >
            <ChevronRight size={20} aria-hidden="true" />
          </Link>
        )}
      </div>
    </article>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Clock, ExternalLink, Tv } from 'lucide-react';
import ShareButton from '@/components/ShareButton';
import { buildEventPath, buildEventUrl } from '@/lib/eventUrls';
import { Evento } from '@/types';

const EMOJIS: { [key: string]: string } = {
  "Fútbol": "⚽️", "Básquetbol": "🏀", "Béisbol": "⚾️", "Fórmula 1": "🏎️", 
  "Motorismo": "🏍️", "Tenis": "🎾", "Fútbol Americano": "🏈", "Rugby": "🏉", 
  "Hockey": "🏒", "Combate": "🥊", "Ciclismo": "🚴", "Voleibol": "🏐", 
  "Golf": "⛳️", "Natación": "🏊", "Fútbol Sala": "👟", "Otros": "🏆"
};

interface Props {
  evento: Evento;
  isLive: boolean;
  onFiltrarLiga?: (liga: string) => void;
  onClick?: () => void;
}

type EventStatus = 'live' | 'upcoming' | 'finished';

const UNCONFIRMED_CHANNEL_PATTERN = /por\s+confirmar|por\s+definir|pendiente|sin\s+(?:confirmar|determinar)|no\s+disponible|n\/d|tbd|por\s+anunciar/i;

function isTransmissionUnconfirmed(canales: string) {
  return !canales.trim() || UNCONFIRMED_CHANNEL_PATTERN.test(canales);
}

function getEventStatus(fecha: string, hora: string, isLive: boolean): EventStatus {
  if (isLive) return 'live';

  const start = new Date(`${fecha}T${hora || '00:00'}:00-06:00`);
  return Number.isNaN(start.getTime()) || start.getTime() > Date.now() ? 'upcoming' : 'finished';
}

function formatEventDate(fecha: string) {
  const date = new Date(`${fecha}T12:00:00`);
  if (Number.isNaN(date.getTime())) return fecha;
  return date.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' });
}

function getStatusLabel(status: EventStatus) {
  if (status === 'live') return 'En vivo';
  if (status === 'finished') return 'Finalizado';
  return 'Próximo';
}

function formatChannels(canalesStr: string, unconfirmed: boolean) {
  const canales = canalesStr.split(/, | - | \/ | · /).map((channel) => channel.trim()).filter(Boolean);

  if (unconfirmed) {
    return (
      <span className="gs-chip gs-chip-muted min-h-9 px-2.5 py-1.5 text-[11px] font-bold">
        <Tv size={13} aria-hidden="true" />
        Por confirmar
      </span>
    );
  }

  return canales.map((c, i) => {
    return (
      <span key={i} className="gs-chip gs-chip-selected min-h-9 px-2.5 py-1.5 text-[11px] font-bold">
        <Tv size={13} aria-hidden="true" />
        <span className="whitespace-nowrap">{c}</span>
      </span>
    );
  });
}

export default function SportEventCard({ evento, isLive, onFiltrarLiga, onClick }: Props) {
  const eventPath = buildEventPath(evento);
  const eventUrl = buildEventUrl(evento);
  const status = getEventStatus(evento.fecha, evento.hora, isLive);
  const statusLabel = getStatusLabel(status);
  const transmissionUnconfirmed = isTransmissionUnconfirmed(evento.canales);
  const teams = evento.evento.split(/ vs /i);
  const isMatch = teams.length === 2;

  return (
    <article className={`group gs-card gs-card-interactive relative overflow-hidden p-4 md:p-5 ${status === 'live' ? 'border-red-500/60 hover:border-red-400/70' : 'border-slate-800/80'}`}>
      <header className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
        <span className={`gs-badge normal-case tracking-normal ${status === 'live' ? 'gs-badge-live' : status === 'finished' ? 'gs-badge-finished' : 'gs-badge-upcoming'}`}>
          {status === 'live' && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" aria-hidden="true" />}
          {statusLabel}
        </span>
        <div className="min-w-0 max-w-[55%] text-right">
          {onFiltrarLiga ? (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onFiltrarLiga(evento.competicion); }}
              className="min-h-11 max-w-full truncate rounded-lg px-2 text-[10px] font-bold text-slate-400 transition-colors hover:text-blue-300"
              title={`Filtrar por ${evento.competicion}`}
            >
              {evento.competicion}
            </button>
          ) : (
            <span className="block truncate px-2 text-[10px] font-bold text-slate-400">{evento.competicion}</span>
          )}
        </div>
      </header>

      <div className="flex flex-col gap-4 pt-4 md:flex-row md:items-center">
        <div className="flex shrink-0 items-center gap-3 border-b border-white/10 pb-4 md:min-w-[118px] md:flex-col md:items-start md:border-b-0 md:border-r md:pb-0 md:pr-5">
          <div className="text-2xl opacity-80 md:text-3xl" aria-hidden="true">{EMOJIS[evento.deporte] || "🏆"}</div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{status === 'live' ? 'Ahora' : 'Inicio'}</p>
            <div className={`flex items-center gap-2 text-2xl font-black tracking-tight ${status === 'live' ? 'text-red-300' : 'text-white'}`}>
              <Clock size={17} aria-hidden="true" />
              <span className="gs-time">{evento.hora || 'Por definir'}</span>
            </div>
            <p className="mt-1 text-xs font-semibold capitalize text-slate-400">{formatEventDate(evento.fecha)}</p>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={onClick}
            disabled={!onClick}
            aria-label={`Ver detalles de ${evento.evento}`}
            className="w-full rounded-xl text-left focus-visible:ring-2 focus-visible:ring-[#a3e635] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            {isMatch ? (
              <span className="flex items-center gap-2 sm:gap-4">
                <span className="flex min-w-0 flex-1 items-center justify-end gap-2">
                  <span className="line-clamp-2 text-right text-sm font-bold leading-snug text-white sm:text-base">{teams[0].trim()}</span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-white/10 bg-slate-800 text-[10px] font-black text-slate-300" aria-hidden="true">
                    {teams[0].trim().substring(0, 2).toUpperCase()}
                  </span>
                </span>
                <span className="select-none text-[10px] font-bold text-slate-500" aria-hidden="true">VS</span>
                <span className="flex min-w-0 flex-1 items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-white/10 bg-slate-800 text-[10px] font-black text-slate-300" aria-hidden="true">
                    {teams[1].trim().substring(0, 2).toUpperCase()}
                  </span>
                  <span className="line-clamp-2 text-sm font-bold leading-snug text-white sm:text-base">{teams[1].trim()}</span>
                </span>
              </span>
            ) : (
              <span className="block line-clamp-2 text-base font-bold leading-snug text-white transition-colors group-hover:text-slate-100 md:text-lg">{evento.evento}</span>
            )}
          </button>

          <div className="mt-3 flex min-w-0 flex-wrap items-center gap-2" aria-label={transmissionUnconfirmed ? 'Transmisión no confirmada' : 'Canales de transmisión'}>
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-blue-300">
              <Tv size={14} aria-hidden="true" /> Dónde verlo
            </span>
            {formatChannels(evento.canales, transmissionUnconfirmed)}
          </div>
        </div>

        <div className="flex w-full shrink-0 items-center justify-end gap-2 md:w-auto md:flex-col">
          {onClick ? (
            <button
              type="button"
              onClick={onClick}
              className="gs-button gs-button-primary min-h-11 flex-1 px-3 text-[10px] sm:flex-none"
            >
              Ver detalle <ChevronRight size={15} aria-hidden="true" />
            </button>
          ) : (
            <Link
              href={eventPath}
              className="gs-button gs-button-primary min-h-11 flex-1 px-3 text-[10px] sm:flex-none"
              aria-label={`Ver página de ${evento.evento}`}
            >
              Ver detalle <ExternalLink size={14} aria-hidden="true" />
            </Link>
          )}
          <div className="flex shrink-0 items-center gap-2">
            {onClick && (
              <Link
                href={eventPath}
                onClick={(e) => e.stopPropagation()}
                className="gs-button-icon"
                aria-label={`Ver página de ${evento.evento}`}
              >
                <ExternalLink size={14} aria-hidden="true" />
              </Link>
            )}
            <ShareButton
              titulo={evento.evento}
              url={eventUrl}
              variant="icon"
              className="min-h-11 min-w-11"
            />
          </div>
        </div>
      </div>
    </article>
  );
}

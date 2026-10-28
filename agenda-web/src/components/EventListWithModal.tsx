'use client';

import React, { useState } from 'react';
import { CalendarDays, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import SportEventCard from '@/components/SportEventCard';
import SportEventModal from '@/components/SportEventModal';
import { trackEvent } from '@/lib/analytics';
import { formatMexicoDate, getMexicoDate, getTodayMexicoString, isEventLive, isEventPast } from '@/lib/mexicoTime';

interface Evento {
  id: string;
  fecha: string;
  hora: string;
  evento: string;
  competicion: string;
  deporte: string;
  canales: string;
  categoria?: string;
}

interface EventListWithModalProps {
  eventos: Evento[];
  now: number;
  emptyMessage?: string;
}

export default function EventListWithModal({
  eventos,
  now,
  emptyMessage = 'No hay partidos próximos registrados.',
}: EventListWithModalProps) {
  const [selectedEvent, setSelectedEvent] = useState<Evento | null>(null);
  const [mostrarFinalizados, setMostrarFinalizados] = useState(false);
  const nowDate = getMexicoDate(new Date(now));

  const isLiveEvent = (evento: Evento) => isEventLive(evento.fecha, evento.hora, nowDate);
  const isFinishedEvent = (evento: Evento) =>
    !isLiveEvent(evento) && isEventPast(evento.fecha, evento.hora, nowDate);

  const eventosActivos = eventos
    .filter((evento) => !isFinishedEvent(evento))
    .sort((a, b) => {
      const aLive = isLiveEvent(a) ? 0 : 1;
      const bLive = isLiveEvent(b) ? 0 : 1;
      if (aLive !== bLive) return aLive - bLive;
      return (a.fecha || '').localeCompare(b.fecha || '') || (a.hora || '').localeCompare(b.hora || '');
    });

  const eventosFinalizados = eventos
    .filter(isFinishedEvent)
    .sort((a, b) => (a.fecha || '').localeCompare(b.fecha || '') || (a.hora || '').localeCompare(b.hora || ''));

  // Agrupar eventos activos por fecha YYYY-MM-DD
  const eventosAgrupados = eventosActivos.reduce<{ [fecha: string]: Evento[] }>((acc, evento) => {
    const key = evento.fecha || 'Sin Fecha';
    if (!acc[key]) acc[key] = [];
    acc[key].push(evento);
    return acc;
  }, {});

  const fechasOrdenadas = Object.keys(eventosAgrupados).sort();
  const finalizadosDeHoy =
    eventosFinalizados.length > 0 &&
    eventosFinalizados.every((evento) => evento.fecha === getTodayMexicoString());

  const renderEvento = (evento: Evento) => {
    const live = isLiveEvent(evento);
    return (
      <div key={evento.id} className="w-full">
        <SportEventCard
          evento={evento}
          isLive={live}
          now={now}
          onClick={() => {
            trackEvent('view_event_detail', {
              event_name: evento.evento,
              sport: evento.deporte,
              competition: evento.competicion,
            });
            setSelectedEvent(evento);
          }}
        />
      </div>
    );
  };

  if (eventos.length === 0) {
    return (
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-slate-400 text-sm text-center">
        {emptyMessage}
      </div>
    );
  }

  return (
    <>
      <div className="w-full space-y-8 sm:space-y-10">
        {fechasOrdenadas.map((fecha, index) => {
          const esCambioDeDia = index > 0;
          const eventosDelDia = eventosAgrupados[fecha];
          const dateObj = new Date(fecha + 'T12:00:00');
          const dateFormatted = !isNaN(dateObj.getTime())
            ? formatMexicoDate(fecha, 'long')
            : fecha;

          return (
            <section key={fecha} className={`w-full ${esCambioDeDia ? 'mt-10 border-t border-blue-500/20 pt-6' : ''}`}>
              <div className="mb-5 flex items-center gap-3">
                <div
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-black uppercase tracking-wider ${
                    esCambioDeDia
                      ? 'border border-blue-500/40 bg-blue-950/40 text-blue-300 shadow-sm shadow-blue-950/50'
                      : 'border border-slate-800 bg-slate-900/60 text-slate-300'
                  }`}
                >
                  <CalendarDays className="h-3.5 w-3.5 shrink-0 text-blue-400" aria-hidden="true" />
                  <span>{dateFormatted}</span>
                </div>
                <div
                  className={`h-px min-w-0 flex-1 ${
                    esCambioDeDia
                      ? 'bg-gradient-to-r from-blue-500/50 via-slate-800 to-transparent'
                      : 'bg-slate-800/80'
                  }`}
                  aria-hidden="true"
                />
              </div>

              <div className="flex flex-col gap-3 w-full">
                {eventosDelDia.map(renderEvento)}
              </div>
            </section>
          );
        })}
      </div>

      {eventosFinalizados.length > 0 && (
        <section className={`w-full ${fechasOrdenadas.length > 0 ? 'mt-10 border-t border-slate-800/80 pt-6' : ''}`}>
          <button
            type="button"
            onClick={() => setMostrarFinalizados((prev) => !prev)}
            className="gs-button gs-button-quiet w-full justify-between !min-h-11 !px-4 text-xs"
            aria-expanded={mostrarFinalizados}
            aria-controls="eventos-finalizados"
          >
            <span className="flex items-center gap-2 font-semibold">
              <Clock size={14} className="text-slate-400" aria-hidden="true" />
              <span>{finalizadosDeHoy ? 'Finalizados de hoy' : 'Finalizados'}</span>
              <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-[11px] font-bold text-slate-300">
                {eventosFinalizados.length}
              </span>
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
              {mostrarFinalizados ? 'Ocultar' : 'Ver eventos'}
              {mostrarFinalizados ? <ChevronUp size={14} aria-hidden="true" /> : <ChevronDown size={14} aria-hidden="true" />}
            </span>
          </button>

          {mostrarFinalizados && (
            <div id="eventos-finalizados" className="mt-3 flex flex-col gap-3">
              {eventosFinalizados.map(renderEvento)}
            </div>
          )}
        </section>
      )}

      <SportEventModal
        evento={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </>
  );
}

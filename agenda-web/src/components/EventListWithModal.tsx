'use client';

import React, { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import SportEventCard from '@/components/SportEventCard';
import SportEventModal from '@/components/SportEventModal';
import { trackEvent } from '@/lib/analytics';
import { isEventLive } from '@/lib/mexicoTime';

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
  emptyMessage?: string;
}

export default function EventListWithModal({
  eventos,
  emptyMessage = 'No hay partidos próximos registrados.',
}: EventListWithModalProps) {
  const [selectedEvent, setSelectedEvent] = useState<Evento | null>(null);

  // Agrupar eventos por fecha YYYY-MM-DD
  const eventosAgrupados = eventos.reduce<{ [fecha: string]: Evento[] }>((acc, evento) => {
    const key = evento.fecha || 'Sin Fecha';
    if (!acc[key]) acc[key] = [];
    acc[key].push(evento);
    return acc;
  }, {});

  const fechasOrdenadas = Object.keys(eventosAgrupados).sort();

  if (eventos.length === 0) {
    return (
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-slate-500 text-sm text-center">
        {emptyMessage}
      </div>
    );
  }

  return (
    <>
      <div className="w-full space-y-8 sm:space-y-10">
        {fechasOrdenadas.map((fecha) => {
          const eventosDelDia = eventosAgrupados[fecha];
          const dateObj = new Date(fecha + 'T12:00:00');
          const dateFormatted = !isNaN(dateObj.getTime())
            ? dateObj.toLocaleDateString('es-MX', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })
            : fecha;

          return (
            <section key={fecha} className="w-full">
              <div className="flex items-center gap-4 mb-5">
                <h2 className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-[0.18em] sm:tracking-[0.3em] flex items-center gap-2 whitespace-nowrap">
                  <CalendarDays className="w-4 h-4 text-blue-500 shrink-0" aria-hidden="true" />
                  {dateFormatted}
                </h2>
                <div className="h-px min-w-0 flex-1 bg-slate-800/30" aria-hidden="true"></div>
              </div>

              <div className="flex flex-col gap-3 w-full">
                {eventosDelDia.map((evento) => (
                  <div key={evento.id} className="w-full">
                    <SportEventCard
                      evento={evento}
                      isLive={isEventLive(evento.fecha, evento.hora)}
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
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <SportEventModal
        evento={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </>
  );
}

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
            ? dateObj.toLocaleDateString('es-MX', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })
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

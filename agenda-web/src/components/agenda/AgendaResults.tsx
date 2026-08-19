"use client";

import React from "react";
import { CalendarDays } from "lucide-react";
import EventCard from "./EventCard";
import EmptyState from "./EmptyState";
import AdPlacement from "@/components/AdPlacement";
import { Evento } from "@/types";
import { isEventLive, formatMexicoDate } from "@/lib/mexicoTime";

interface AgendaResultsProps {
  eventosAgrupados: Record<string, Evento[]>;
  onEventClick: (evento: Evento) => void;
  onFiltrarLiga: (liga: string) => void;
  onReset: () => void;
}

export default function AgendaResults({
  eventosAgrupados,
  onEventClick,
  onFiltrarLiga,
  onReset,
}: AgendaResultsProps) {
  const fechas = Object.keys(eventosAgrupados).sort();

  if (fechas.length === 0) {
    return <EmptyState onReset={onReset} />;
  }

  return (
    <div className="w-full space-y-10">
      {fechas.map((fecha) => (
        <section key={fecha} className="w-full">
          <div className="flex items-center gap-4 mb-5">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 whitespace-nowrap">
              <CalendarDays className="w-4 h-4 text-blue-500" />
              {formatMexicoDate(fecha, "long")}
            </h2>
            <div className="h-px w-full bg-slate-800/50" />
          </div>
          <div className="flex flex-col gap-3 w-full">
            {eventosAgrupados[fecha].map((evento, index, arr) => (
              <div key={evento.id} id={`evento-${evento.id}`} data-envivo={isEventLive(evento.fecha, evento.hora) ? "true" : "false"} className="w-full">
                <EventCard
                  evento={evento}
                  isLive={isEventLive(evento.fecha, evento.hora)}
                  onFiltrarLiga={onFiltrarLiga}
                  onClick={() => onEventClick(evento)}
                />
                {(index + 1) % 8 === 0 && index !== arr.length - 1 && <AdPlacement />}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

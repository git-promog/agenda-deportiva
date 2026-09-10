"use client";

import React from "react";
import { AlertCircle, CalendarDays, Filter, Radio, RotateCcw } from "lucide-react";
import AdPlacement from "@/components/AdPlacement";
import EventCard from "./EventCard";
import { Evento } from "@/types";
import { formatMexicoDate, isEventLive } from "@/lib/mexicoTime";

interface AgendaResultsProps {
  eventosAgrupados: Record<string, Evento[]>;
  onEventClick: (evento: Evento) => void;
  onFiltrarLiga: (liga: string) => void;
  onReset: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  loading?: boolean;
  error?: string | null;
}

function ResultCards({
  eventos,
  onEventClick,
  onFiltrarLiga,
}: {
  eventos: Evento[];
  onEventClick: (evento: Evento) => void;
  onFiltrarLiga: (liga: string) => void;
}) {
  return (
    <div className="flex w-full flex-col gap-3">
      {eventos.map((evento, index, arr) => {
        const live = isEventLive(evento.fecha, evento.hora);
        return (
          <div key={evento.id} id={`evento-${evento.id}`} data-envivo={live ? "true" : "false"} className="w-full">
            <EventCard
              evento={evento}
              isLive={live}
              onFiltrarLiga={onFiltrarLiga}
              onClick={() => onEventClick(evento)}
            />
            {(index + 1) % 8 === 0 && index !== arr.length - 1 && <AdPlacement />}
          </div>
        );
      })}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid gap-3" role="status" aria-live="polite" aria-busy="true">
      <p className="sr-only">Cargando la agenda</p>
      {["a", "b", "c"].map((key) => (
        <div key={key} className="gs-card p-4 md:p-5" aria-hidden="true">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="h-5 w-16 animate-pulse rounded bg-slate-800/70"></div>
            <div className="h-3 w-24 animate-pulse rounded bg-slate-800/70"></div>
          </div>
          <div className="flex flex-col gap-4 pt-4 md:flex-row md:items-center">
            <div className="flex shrink-0 items-center gap-3 md:min-w-[118px] md:flex-col md:items-start md:border-r md:border-white/10 md:pr-5">
              <div className="h-8 w-8 animate-pulse rounded-xl bg-slate-800/70"></div>
              <div className="flex flex-col gap-2">
                <div className="h-3 w-10 animate-pulse rounded bg-slate-800/70"></div>
                <div className="h-4 w-14 animate-pulse rounded bg-slate-800/70"></div>
              </div>
            </div>
            <div className="min-w-0 flex-1 space-y-2 py-1">
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-800/70"></div>
              <div className="h-3 w-1/2 animate-pulse rounded bg-slate-800/70"></div>
            </div>
            <div className="flex shrink-0 items-center justify-end gap-2">
              <div className="h-11 w-24 animate-pulse rounded-xl bg-slate-800/70"></div>
              <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-800/70"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AgendaResults({
  eventosAgrupados,
  onEventClick,
  onFiltrarLiga,
  onReset,
  emptyTitle = "Sin resultados",
  emptyDescription = "Prueba con otro criterio o limpia los filtros para ver la agenda completa.",
  loading = false,
  error = null,
}: AgendaResultsProps) {
  if (loading) return <LoadingState />;

  if (error) {
    return (
      <div className="gs-state gs-state-error" role="alert">
        <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-300" aria-hidden="true" />
        <h2 className="mb-2 text-sm font-extrabold text-white">No pudimos cargar la agenda</h2>
        <p className="mx-auto mb-4 max-w-sm text-sm leading-relaxed text-red-100/75">{error}</p>
        <button type="button" onClick={onReset} className="gs-button gs-button-quiet mx-auto">
          <RotateCcw size={14} aria-hidden="true" /> Volver a la agenda
        </button>
      </div>
    );
  }

  const fechas = Object.keys(eventosAgrupados).sort();
  const liveEvents = fechas.flatMap((fecha) => eventosAgrupados[fecha]).filter((evento) => isEventLive(evento.fecha, evento.hora));
  const upcomingGroups = fechas
    .map((fecha) => ({ fecha, eventos: eventosAgrupados[fecha].filter((evento) => !isEventLive(evento.fecha, evento.hora)) }))
    .filter(({ eventos }) => eventos.length > 0);

  if (fechas.length === 0) {
    return (
      <div className="gs-state" role="status">
        <Filter className="mx-auto mb-3 h-8 w-8 text-slate-500" aria-hidden="true" />
        <h2 className="mb-2 text-sm font-extrabold text-white">{emptyTitle}</h2>
        <p className="mx-auto mb-4 max-w-sm text-sm leading-relaxed text-slate-400">{emptyDescription}</p>
        <button type="button" onClick={onReset} className="gs-button gs-button-quiet mx-auto">
          <RotateCcw size={14} aria-hidden="true" /> Limpiar filtros
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {liveEvents.length > 0 && (
        <section className="gs-results-section gs-results-section-live" aria-labelledby="agenda-live-title">
          <h2 id="agenda-live-title" className="gs-results-heading gs-results-heading-live">
            <Radio size={16} aria-hidden="true" /> En vivo ahora
            <span className="gs-results-heading-count">{liveEvents.length} {liveEvents.length === 1 ? "evento" : "eventos"}</span>
          </h2>
          <ResultCards eventos={liveEvents} onEventClick={onEventClick} onFiltrarLiga={onFiltrarLiga} />
        </section>
      )}

      {upcomingGroups.length > 0 && (
        <section className="gs-results-section" aria-labelledby="agenda-upcoming-title">
          <h2 id="agenda-upcoming-title" className="gs-results-heading">
            <CalendarDays size={16} className="text-blue-400" aria-hidden="true" /> Próximos eventos
            <span className="gs-results-heading-count">
              {upcomingGroups.reduce((total, group) => total + group.eventos.length, 0)} en agenda
            </span>
          </h2>
          {upcomingGroups.map(({ fecha, eventos }) => (
            <div key={fecha}>
              <h3 className="gs-results-date-heading">
                <CalendarDays className="h-3.5 w-3.5 text-blue-400" aria-hidden="true" />
                {formatMexicoDate(fecha, "long")}
              </h3>
              <ResultCards eventos={eventos} onEventClick={onEventClick} onFiltrarLiga={onFiltrarLiga} />
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { AlertCircle, CalendarDays, ChevronDown, ChevronUp, Clock, Filter, Radio, RotateCcw } from "lucide-react";
import AdPlacement from "@/components/AdPlacement";
import EventCard from "./EventCard";
import { Evento } from "@/types";
import { formatMexicoDate, getTodayMexicoString, isEventLive, isEventPast } from "@/lib/mexicoTime";

interface AgendaResultsProps {
  eventosAgrupados: Record<string, Evento[]>;
  onEventClick: (evento: Evento) => void;
  onFiltrarLiga: (liga: string) => void;
  onReset: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  loading?: boolean;
  error?: string | null;
  isSearching?: boolean;
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
  isSearching = false,
}: AgendaResultsProps) {
  const [prevSearching, setPrevSearching] = useState(isSearching);
  const [mostrarAnteriores, setMostrarAnteriores] = useState(false);

  if (isSearching !== prevSearching) {
    setPrevSearching(isSearching);
    if (isSearching) {
      setMostrarAnteriores(true);
    }
  }

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

  const todayStr = getTodayMexicoString();
  const fechas = Object.keys(eventosAgrupados).sort();

  // 1. Eventos en vivo (todas las fechas de la ventana activa)
  const liveEvents = fechas
    .flatMap((fecha) => eventosAgrupados[fecha])
    .filter((evento) => isEventLive(evento.fecha, evento.hora));

  // 2. Eventos de hoy que ya concluyeron
  const pastEventsToday = (eventosAgrupados[todayStr] || []).filter(
    (evento) => !isEventLive(evento.fecha, evento.hora) && isEventPast(evento.fecha, evento.hora)
  );

  // 3. Próximos eventos (a partir del momento actual para hoy, más fechas futuras)
  const upcomingGroups = fechas
    .filter((fecha) => fecha >= todayStr)
    .map((fecha) => {
      const eventosDeFecha = eventosAgrupados[fecha] || [];
      const eventos =
        fecha === todayStr
          ? eventosDeFecha.filter(
              (evento) => !isEventLive(evento.fecha, evento.hora) && !isEventPast(evento.fecha, evento.hora)
            )
          : eventosDeFecha.filter((evento) => !isEventLive(evento.fecha, evento.hora));

      return { fecha, eventos };
    })
    .filter(({ eventos }) => eventos.length > 0);

  const totalEventosVisibles =
    liveEvents.length +
    upcomingGroups.reduce((total, group) => total + group.eventos.length, 0) +
    pastEventsToday.length;

  if (fechas.length === 0 || totalEventosVisibles === 0) {
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

  const totalProximos = upcomingGroups.reduce((total, group) => total + group.eventos.length, 0);

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

      {(upcomingGroups.length > 0 || pastEventsToday.length > 0) && (
        <section className="gs-results-section" aria-labelledby="agenda-upcoming-title">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="agenda-upcoming-title" className="gs-results-heading">
              <CalendarDays size={16} className="text-blue-400" aria-hidden="true" /> Próximos eventos
              {totalProximos > 0 && (
                <span className="gs-results-heading-count">
                  {totalProximos} en agenda
                </span>
              )}
            </h2>
          </div>

          {pastEventsToday.length > 0 && (
            <div className="mb-6 mt-1">
              <button
                type="button"
                onClick={() => setMostrarAnteriores((prev) => !prev)}
                className={`gs-button w-full justify-between !min-h-11 !py-2.5 !px-4 text-xs transition-all ${
                  mostrarAnteriores
                    ? "border-blue-500/60 bg-blue-950/30 text-white shadow-sm shadow-blue-950/50"
                    : "border-blue-500/30 bg-slate-900/80 text-slate-200 hover:border-blue-400/60 hover:bg-blue-950/20"
                }`}
                aria-expanded={mostrarAnteriores}
                aria-controls="eventos-anteriores-hoy"
              >
                <span className="flex items-center gap-2 font-semibold">
                  <Clock size={14} className="text-blue-400" aria-hidden="true" />
                  <span>Eventos anteriores de hoy</span>
                  <span className="rounded-full border border-blue-500/30 bg-blue-950/60 px-2 py-0.5 text-[11px] font-bold text-blue-300">
                    {pastEventsToday.length}
                  </span>
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-blue-400">
                  {mostrarAnteriores ? "Ocultar" : "Ver partidos"}
                  {mostrarAnteriores ? <ChevronUp size={14} aria-hidden="true" /> : <ChevronDown size={14} aria-hidden="true" />}
                </span>
              </button>

              {mostrarAnteriores && (
                <div id="eventos-anteriores-hoy" className="mt-3 space-y-3 rounded-2xl border border-blue-500/30 bg-slate-950/60 p-3 sm:p-4">
                  <div className="flex items-center justify-between border-b border-blue-500/20 pb-2 text-[11px] font-bold uppercase tracking-wider text-blue-300/80">
                    <span>Partidos concluidos de hoy</span>
                    <span>Hora de México</span>
                  </div>
                  <ResultCards eventos={pastEventsToday} onEventClick={onEventClick} onFiltrarLiga={onFiltrarLiga} />
                </div>
              )}
            </div>
          )}

          {upcomingGroups.length > 0 ? (
            <div className="space-y-6">
              {upcomingGroups.map(({ fecha, eventos }, index) => {
                const esCambioDeDia = index > 0;
                return (
                  <div key={fecha} className={esCambioDeDia ? "mt-10 border-t border-blue-500/20 pt-6" : ""}>
                    <div className="mb-4 flex items-center gap-3">
                      <div
                        className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-black uppercase tracking-wider ${
                          esCambioDeDia
                            ? "border border-blue-500/40 bg-blue-950/40 text-blue-300 shadow-sm shadow-blue-950/50"
                            : "border border-slate-800 bg-slate-900/60 text-slate-300"
                        }`}
                      >
                        <CalendarDays className="h-3.5 w-3.5 text-blue-400" aria-hidden="true" />
                        <span>{formatMexicoDate(fecha, "long")}</span>
                      </div>
                      <div
                        className={`h-px flex-1 ${
                          esCambioDeDia
                            ? "bg-gradient-to-r from-blue-500/50 via-slate-800 to-transparent"
                            : "bg-slate-800/80"
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                    <ResultCards eventos={eventos} onEventClick={onEventClick} onFiltrarLiga={onFiltrarLiga} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 text-center text-sm text-slate-400">
              No hay más eventos programados por comenzar hoy.
            </div>
          )}
        </section>
      )}
    </div>
  );
}

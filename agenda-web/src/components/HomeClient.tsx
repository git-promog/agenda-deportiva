"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Zap, ChevronRight, Newspaper, X } from 'lucide-react';
import Link from 'next/link';
import NextImage from 'next/image';
import HomeHero from '@/components/HomeHero';
import HomeDestacados from '@/components/HomeDestacados';
import SportEventModal from '@/components/SportEventModal';
import AgendaSearch from '@/components/agenda/AgendaSearch';
import AgendaQuickActions from '@/components/agenda/AgendaQuickActions';
import AgendaFilters from '@/components/agenda/AgendaFilters';
import AgendaResults from '@/components/agenda/AgendaResults';
import { trackContentClick, trackEvent, trackFilter, trackSearch } from '@/lib/analytics';
import { getMexicoDate, getTodayMexicoString, isEventLive, isEventPast } from '@/lib/mexicoTime';
import { isTvAbierta } from '@/lib/channelCatalog';
import { searchEvents } from '@/lib/eventSearch';
import { Evento, Noticia } from '@/types';

const emojis: { [key: string]: string } = {
  "Fútbol": "⚽️", "Básquetbol": "🏀", "Béisbol": "⚾️", "Fórmula 1": "🏎️",
  "Motorismo": "🏍️", "Tenis": "🎾", "Fútbol Americano": "🏈", "Rugby": "🏉",
  "Hockey": "🏒", "Combate": "🥊", "Ciclismo": "🚴", "Voleibol": "🏐",
  "Golf": "⛳️", "Natación": "🏊", "Fútbol Sala": "👟", "Otros": "🏆"
};

const TOP_TEAMS = ["América", "Chivas", "Real Madrid", "Barcelona", "México", "F1", "NBA", "Champions", "Cruz Azul", "Pumas", "Selección"];
const AGENDA_STATE_KEY = 'gs-agenda-state';

interface HomeClientProps {
  initialEventos: Evento[];
  initialNoticias: Noticia[];
  initialUltimaAct: string;
  now: number;
}

export default function HomeClient({ initialEventos, initialNoticias, initialUltimaAct, now }: HomeClientProps) {
  const searchParams = useSearchParams();
  const [eventos] = useState<Evento[]>(initialEventos);
  const [noticias] = useState<Noticia[]>(initialNoticias);
  const [filtroDeporte, setFiltroDeporte] = useState("Todos");
  const [filtroFecha, setFiltroFecha] = useState("Todos");
  const [filtroCompeticion, setFiltroCompeticion] = useState(searchParams.get('competicion') || "Todos");
  const [soloTvAbierta, setSoloTvAbierta] = useState(false);
  const [busqueda, setBusqueda] = useState(searchParams.get('q') || "");
  const [soloEnVivo, setSoloEnVivo] = useState(searchParams.get('envivo') === '1');
  const [selectedEvent, setSelectedEvent] = useState<Evento | null>(null);
  const restoredStateRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hasUrlIntent = Boolean(
      searchParams.get('q') || searchParams.get('competicion') || searchParams.get('envivo')
    );

    if (!restoredStateRef.current) {
      restoredStateRef.current = true;
      if (!hasUrlIntent) {
        try {
          const raw = window.sessionStorage.getItem(AGENDA_STATE_KEY);
          if (raw) {
            const saved = JSON.parse(raw) as Record<string, unknown>;
            const timer = window.setTimeout(() => {
              if (typeof saved.busqueda === 'string') setBusqueda(saved.busqueda);
              if (typeof saved.filtroDeporte === 'string') setFiltroDeporte(saved.filtroDeporte);
              if (typeof saved.filtroFecha === 'string') setFiltroFecha(saved.filtroFecha);
              if (typeof saved.filtroCompeticion === 'string') setFiltroCompeticion(saved.filtroCompeticion);
              if (typeof saved.soloTvAbierta === 'boolean') setSoloTvAbierta(saved.soloTvAbierta);
              if (typeof saved.soloEnVivo === 'boolean') setSoloEnVivo(saved.soloEnVivo);
            }, 0);
            return () => window.clearTimeout(timer);
          }
        } catch {}
      }
    }

    try {
      window.sessionStorage.setItem(AGENDA_STATE_KEY, JSON.stringify({
        busqueda,
        filtroDeporte,
        filtroFecha,
        filtroCompeticion,
        soloTvAbierta,
        soloEnVivo,
      }));
    } catch {}
  }, [busqueda, filtroDeporte, filtroFecha, filtroCompeticion, soloTvAbierta, soloEnVivo, searchParams]);

  // Tracking de búsqueda con debounce manual
  useEffect(() => {
    if (busqueda.length > 2) {
      const timer = setTimeout(() => {
        trackSearch(busqueda, { location: 'home_search' });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [busqueda]);

  const hoyStr = getTodayMexicoString();
  const nowDate = getMexicoDate(new Date(now));
  const safeText = (value: string | null | undefined, fallback = "") => value || fallback;

  const deportesUnicos = ["Todos", ...new Set(eventos.map(e => safeText(e.deporte, "Otros")))];
  const fechasUnicas = ["Todos", ...new Set(eventos.map(e => safeText(e.fecha)))].filter(f => f !== "" && f >= hoyStr);
  const competicionesUnicas = ["Todos", ...new Set(eventos.map(e => safeText(e.competicion)).filter(Boolean))];

  const destacados = eventos
    .filter(e => {
      if (e.fecha !== hoyStr || isEventPast(e.fecha, e.hora, nowDate)) return false;
      if (e.destacado === true) return true;
      if (e.destacado === false) return false;
      const eventName = safeText(e.evento);
      return TOP_TEAMS.some(t => eventName.toLowerCase().includes(t.toLowerCase()));
    })
    .sort((a, b) => {
      const aLive = isEventLive(a.fecha, a.hora, nowDate);
      const bLive = isEventLive(b.fecha, b.hora, nowDate);
      if (aLive !== bLive) return aLive ? -1 : 1;
      return safeText(a.hora).localeCompare(safeText(b.hora));
    })
    .slice(0, 6);

  const eventosEnVivo = eventos.filter((e) => isEventLive(e.fecha, e.hora, nowDate));
  let eventoHero: Evento | null = null;
  let tipoHero = "EN VIVO AHORA";

  if (eventosEnVivo.length > 0) {
    eventoHero = eventosEnVivo.find(e => e.destacado === true) ||
                 eventosEnVivo.find(e => TOP_TEAMS.some(t => safeText(e.evento).toLowerCase().includes(t.toLowerCase()))) ||
                 eventosEnVivo[0];
  } else if (destacados.length > 0) {
    eventoHero = destacados[0];
    tipoHero = "PARTIDO DEL DÍA";
  }

  // Búsqueda universal con scoring
  const hasSearch = busqueda.trim().length > 0;
  const eventosBuscados = hasSearch ? searchEvents(eventos, busqueda) : eventos;

  const eventosFiltrados = eventosBuscados.filter(e => {
    const competition = safeText(e.competicion);
    const fecha = safeText(e.fecha);
    const deporte = safeText(e.deporte, "Otros");
    const hora = safeText(e.hora, "00:00");
    const coincideDeporte = filtroDeporte === "Todos" || deporte === filtroDeporte;
    const esFechaPasada = fecha < hoyStr;
    const coincideFecha = (filtroFecha === "Todos" ? !esFechaPasada : fecha === filtroFecha);
    const coincideCompeticion = filtroCompeticion === "Todos" || competition === filtroCompeticion;
    const esTvAbiertaEvento = isTvAbierta(e.canales);
    const esEnVivo = isEventLive(fecha, hora, nowDate);
    return coincideDeporte && coincideFecha && coincideCompeticion && (soloTvAbierta ? esTvAbiertaEvento : true) && (soloEnVivo ? esEnVivo : true);
  });

  const eventosAgrupados = eventosFiltrados.reduce<Record<string, Evento[]>>((groups, evento) => {
    const f = evento.fecha;
    if (!groups[f]) groups[f] = [];
    groups[f].push(evento);
    return groups;
  }, {});

  const formatearBotonFecha = (fStr: string) => {
    if (fStr === "Todos") return "📅 Todo";
    if (fStr === hoyStr) return "📍 Hoy";
    return new Date(fStr + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric' }).toUpperCase();
  };

  const formatearLabelFecha = (fStr: string) => {
    if (fStr === "Todos") return "Todo";
    if (fStr === hoyStr) return "Hoy";
    return new Date(fStr + 'T12:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
  };

  const guessSportEmoji = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('fútbol') || t.includes('soccer') || t.includes('liga mx') || t.includes('champions')) return "⚽️";
    if (t.includes('f1') || t.includes('fórmula 1') || t.includes('checo')) return "🏎️";
    if (t.includes('nba') || t.includes('básquetbol')) return "🏀";
    if (t.includes('mlb') || t.includes('béisbol') || t.includes('diablos')) return "⚾️";
    if (t.includes('nfl') || t.includes('fútbol americano') || t.includes('super bowl')) return "🏈";
    if (t.includes('box') || t.includes('ufc') || t.includes('canelo')) return "🥊";
    return null;
  };

  const resetFilters = () => {
    setFiltroDeporte("Todos");
    setFiltroFecha("Todos");
    setFiltroCompeticion("Todos");
    setSoloTvAbierta(false);
    setSoloEnVivo(false);
    setBusqueda("");
    window.history.replaceState({}, '', window.location.pathname);
  };

  const scrollToResults = () => {
    const target = document.getElementById('listado-eventos-principal');
    if (!target) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  };

  const irAEnVivo = () => {
    trackEvent('click_en_vivo', { location: 'quick_actions' });
    const next = !soloEnVivo;
    setSoloEnVivo(next);
    if (next) setFiltroFecha("Todos");
    scrollToResults();
  };

  const irAHoy = () => {
    const next = filtroFecha === hoyStr ? "Todos" : hoyStr;
    trackFilter('date', next);
    setFiltroFecha(next);
    if (next !== "Todos") setSoloEnVivo(false);
    scrollToResults();
  };

  const activeFilters: { key: string; label: string; onRemove: () => void }[] = [];
  if (filtroDeporte !== "Todos") {
    activeFilters.push({
      key: "deporte",
      label: `Deporte: ${filtroDeporte}`,
      onRemove: () => { trackFilter('sport', 'Todos'); setFiltroDeporte("Todos"); },
    });
  }
  if (filtroFecha !== "Todos") {
    activeFilters.push({
      key: "fecha",
      label: `Fecha: ${formatearLabelFecha(filtroFecha)}`,
      onRemove: () => { trackFilter('date', 'Todos'); setFiltroFecha("Todos"); },
    });
  }
  if (filtroCompeticion !== "Todos") {
    activeFilters.push({
      key: "competicion",
      label: `Competición: ${filtroCompeticion}`,
      onRemove: () => { trackFilter('league', 'Todos'); setFiltroCompeticion("Todos"); },
    });
  }
  if (soloTvAbierta) {
    activeFilters.push({
      key: "tv",
      label: "TV abierta",
      onRemove: () => { trackFilter('tv_abierta', false); setSoloTvAbierta(false); },
    });
  }
  if (soloEnVivo) {
    activeFilters.push({
      key: "envivo",
      label: "En vivo",
      onRemove: () => setSoloEnVivo(false),
    });
  }

  const activeFiltersCount = activeFilters.length;
  const isDefaultView = !hasSearch && filtroDeporte === "Todos" && filtroFecha === "Todos" && filtroCompeticion === "Todos" && !soloTvAbierta && !soloEnVivo;

  const emptyTitle =
    eventos.length === 0 ? "Agenda en actualización"
      : hasSearch ? "Sin coincidencias"
        : soloEnVivo ? "No hay eventos en vivo ahora"
          : filtroFecha === hoyStr && activeFiltersCount === 1 ? "No hay eventos para hoy"
            : activeFiltersCount > 0 ? "No hay eventos con estos filtros"
              : "No hay eventos próximos";

  const emptyDescription =
    eventos.length === 0 ? "Estamos actualizando los horarios. Vuelve a consultar en unos minutos."
      : hasSearch ? `No encontramos eventos para “${busqueda.trim()}”. Prueba con otro equipo, liga o canal.`
        : soloEnVivo ? "En este momento no hay transmisiones en vivo con estos criterios. Prueba con Hoy o quita el filtro."
          : filtroFecha === hoyStr && activeFiltersCount === 1 ? "La agenda de hoy ya no tiene eventos próximos. Prueba con otra fecha o limpia los filtros."
            : activeFiltersCount > 0 ? "Prueba con otro criterio o limpia los filtros para ver más opciones."
              : "No hay eventos publicados en la ventana actual.";

  const emptyIcon = hasSearch ? "search" : soloEnVivo ? "live" : activeFiltersCount > 0 ? "filter" : "calendar";

  const emptyAction = eventos.length === 0
    ? undefined
    : hasSearch
      ? { label: "Limpiar búsqueda", onClick: () => setBusqueda("") }
      : soloEnVivo
        ? { label: "Quitar filtro En vivo", onClick: () => setSoloEnVivo(false) }
        : filtroFecha === hoyStr && activeFiltersCount === 1
          ? { label: "Quitar filtro de fecha", onClick: () => setFiltroFecha("Todos") }
          : activeFiltersCount > 0
            ? { label: "Limpiar filtros", onClick: resetFilters }
            : undefined;

  return (
    <>
      <div className="relative min-h-screen w-full bg-[#020617] pb-24 font-sans text-slate-100">
        <main id="envivo" className="gs-home-main">
          <section className="gs-home-intro">
            <div className="gs-home-kicker">Agenda deportiva en vivo</div>
            <h1 className="gs-home-title">
              ¿Dónde ver deportes <strong>hoy en México</strong>?
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-slate-300">
              Horarios y canales de TV abierta, de paga y streaming para elegir qué ver sin perder tiempo.
            </p>
            <div className="gs-home-summary" aria-label="Resumen de la agenda">
              <span><strong>{eventos.length}</strong> eventos en los próximos días</span>
              {eventosEnVivo.length > 0 && <span><strong className="text-red-300">{eventosEnVivo.length}</strong> en vivo ahora</span>}
              <span>Hora local de México</span>
              {initialUltimaAct && <span>{initialUltimaAct}</span>}
            </div>
          </section>

          <section className="gs-home-toolbar" aria-label="Buscar y explorar la agenda">
            <AgendaSearch value={busqueda} onChange={setBusqueda} />
            <AgendaQuickActions
              deportes={deportesUnicos}
              deporteActivo={filtroDeporte}
              onDeporteChange={(dep) => { trackFilter('sport', dep); setFiltroDeporte(dep); }}
              onEnVivo={irAEnVivo}
              onHoy={irAHoy}
              enVivoActivo={soloEnVivo}
              hoyActivo={filtroFecha === hoyStr}
              emojis={emojis}
              filterSlot={
                <AgendaFilters
                  filtroFecha={filtroFecha}
                  fechas={fechasUnicas}
                  onFechaChange={(f) => {
                    trackFilter('date', f);
                    setFiltroFecha(f);
                    if (f !== "Todos") setSoloEnVivo(false);
                  }}
                  filtroCompeticion={filtroCompeticion}
                  competiciones={competicionesUnicas}
                  onCompeticionChange={(c) => { trackFilter('league', c); setFiltroCompeticion(c); }}
                  soloTvAbierta={soloTvAbierta}
                  onTvAbiertaChange={(v) => { trackFilter('tv_abierta', v); setSoloTvAbierta(v); }}
                  activeCount={activeFiltersCount}
                  onReset={resetFilters}
                  formatButtonFecha={formatearBotonFecha}
                />
              }
            />

            {(hasSearch || activeFiltersCount > 0) && (
              <div className="flex flex-wrap items-center gap-2 pt-1" aria-label="Criterios activos de la agenda">
                <div className="gs-filter-summary">
                  {hasSearch && (
                    <button
                      type="button"
                      onClick={() => setBusqueda("")}
                      className="gs-filter-summary-chip min-h-11 gap-1.5 transition-colors hover:border-blue-300/50 hover:text-blue-200"
                      aria-label={`Quitar búsqueda ${busqueda.trim()}`}
                    >
                      Búsqueda: {busqueda.trim()}
                      <X size={12} aria-hidden="true" />
                    </button>
                  )}
                  {activeFilters.map((filter) => (
                    <button
                      key={filter.key}
                      type="button"
                      onClick={filter.onRemove}
                      className="gs-filter-summary-chip min-h-11 gap-1.5 transition-colors hover:border-blue-300/50 hover:text-blue-200"
                      aria-label={`Quitar filtro ${filter.label}`}
                    >
                      {filter.label}
                      <X size={12} aria-hidden="true" />
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="gs-button gs-button-quiet !min-h-11 !px-3 !py-1.5 !text-[0.6875rem] !normal-case !tracking-normal"
                >
                  <span aria-hidden="true">×</span> Limpiar
                </button>
              </div>
            )}
          </section>

          {isDefaultView && eventoHero && (
            <HomeHero evento={eventoHero} tipo={tipoHero} onClick={() => setSelectedEvent(eventoHero)} />
          )}

          <div id="listado-eventos-principal" className="w-full">
            <AgendaResults
              eventosAgrupados={eventosAgrupados}
              now={now}
              isSearching={hasSearch}
              emptyTitle={emptyTitle}
              emptyDescription={emptyDescription}
              emptyIcon={emptyIcon}
              emptyActionLabel={emptyAction?.label}
              onEmptyAction={emptyAction?.onClick}
              onEventClick={(evento) => {
                trackEvent('view_event_detail', {
                  event_name: evento.evento,
                  sport: evento.deporte,
                  competition: evento.competicion
                });
                setSelectedEvent(evento);
              }}
              onFiltrarLiga={(liga) => {
                trackFilter('league', liga);
                setFiltroCompeticion(liga);
              }}
              onReset={resetFilters}
            />
          </div>

          {isDefaultView && (
            <HomeDestacados destacados={destacados} onEventClick={setSelectedEvent} />
          )}

          {isDefaultView && noticias.length > 0 && (
            <section className="gs-home-section w-full" aria-labelledby="home-noticias-title">
              <div className="gs-home-section-header">
                <h2 id="home-noticias-title" className="gs-home-section-heading">
                  <Newspaper className="h-4 w-4" aria-hidden="true" /> Últimas noticias
                </h2>
                <Link href="/noticias" className="flex min-h-11 items-center gap-1 text-xs font-bold text-blue-400 transition-colors hover:text-blue-300">
                  Ver todas <ChevronRight size={14} aria-hidden="true" />
                </Link>
              </div>
              <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
                {noticias.slice(0, 5).map((n) => {
                  const emoji = guessSportEmoji(n.titulo);
                  return (
                    <Link key={n.id} href={`/noticias/${n.slug}`} className="gs-home-news-card group flex w-[85vw] max-w-[21rem] flex-shrink-0 items-center gap-4 p-4 transition-colors">
                      <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-800">
                        {n.imagen_url ? (
                          <NextImage
                            src={n.imagen_url}
                            alt={n.titulo}
                            fill
                            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            sizes="80px"
                          />
                        ) : (
                          <div className="flex flex-col items-center">
                            {emoji ? (
                              <span className="text-2xl mb-1">{emoji}</span>
                            ) : (
                            <Newspaper className="text-blue-400/60" size={24} aria-hidden="true" />
                            )}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="mb-2 line-clamp-2 text-sm font-bold leading-snug text-slate-100 group-hover:text-white">{n.titulo}</h3>
                        <div className="flex items-end justify-between gap-2">
                          <div className="flex min-w-0 flex-col gap-1">
                            {n.fecha_publicacion && (
                              <p className="text-[10px] text-slate-400 font-medium">{n.fecha_publicacion}</p>
                            )}
                            {n.autor ? (
                              <p className="text-[10px] font-bold text-blue-400 tracking-wide">Por {n.autor}</p>
                            ) : (
                              <p className="text-[10px] font-bold text-slate-400 tracking-wide">GuíaSports</p>
                            )}
                          </div>
                          <span className="text-xs font-bold text-blue-400">Leer →</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}

                <Link href="/noticias" className="gs-home-news-card flex min-h-[8.5rem] min-w-[9.5rem] flex-shrink-0 flex-col items-center justify-center gap-2 border-dashed p-5 text-center transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800">
                  <Zap className="text-blue-400" size={18} aria-hidden="true" />
                  </div>
                  <span className="text-xs font-bold text-slate-300">+ Ver más</span>
                </Link>
              </div>
            </section>
          )}

          {/* Hubs de competiciones */}
          <section className="mb-12 w-full">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] mb-3 px-2">Competiciones Destacadas</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
              <Link
                href="/mundial-2026"
                onClick={() => trackContentClick('hub', 'mundial_2026')}
                className="flex-shrink-0 relative overflow-hidden group bg-slate-900 border border-yellow-500/30 px-6 py-4 rounded-2xl text-center transition-[border-color,transform] duration-300 hover:border-yellow-400 hover:-translate-y-0.5 active:scale-95 shadow-xl shadow-black/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-yellow-600/5 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="h-10 w-auto mb-1.5 transform group-hover:scale-110 transition-transform duration-500">
                    <NextImage src="/images/mundial/Copa_Mundial_FIFA_2026-logo.webp" alt="FIFA 2026" width={40} height={40} className="h-full w-auto object-contain" />
                  </div>
                  <div className="text-[10px] font-black uppercase text-yellow-500 tracking-widest group-hover:text-yellow-400 transition-colors whitespace-nowrap">Mundial 2026</div>
                </div>
              </Link>
              <Link
                href="/futbol/liga-mx"
                onClick={() => trackContentClick('hub', 'liga_mx')}
                className="flex-shrink-0 relative overflow-hidden group bg-slate-900 border border-slate-800/80 px-6 py-4 rounded-2xl text-center transition-[border-color,transform] duration-300 hover:border-blue-500/50 hover:-translate-y-0.5 active:scale-95 shadow-xl shadow-black/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-indigo-500/5 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="h-10 w-auto mb-1.5 transform group-hover:scale-110 transition-transform duration-500 flex items-center justify-center">
                    <NextImage src="/images/logo_ligas/liga_mx.webp" alt="Liga MX" width={40} height={40} className="h-full w-auto object-contain" />
                  </div>
                  <div className="text-[10px] font-black uppercase text-slate-400 group-hover:text-blue-400 transition-colors whitespace-nowrap">Liga MX</div>
                </div>
              </Link>
              <Link
                href="/futbol/champions-league"
                onClick={() => trackContentClick('hub', 'champions_league')}
                className="flex-shrink-0 relative overflow-hidden group bg-slate-900 border border-slate-800/80 px-6 py-4 rounded-2xl text-center transition-[border-color,transform] duration-300 hover:border-sky-500/50 hover:-translate-y-0.5 active:scale-95 shadow-xl shadow-black/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-blue-600/5 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="h-10 w-auto mb-1.5 transform group-hover:scale-110 transition-transform duration-500 flex items-center justify-center">
                    <NextImage src="/images/logo_ligas/uefa_champions_league.webp" alt="Champions League" width={40} height={40} className="h-full w-auto object-contain" />
                  </div>
                  <div className="text-[10px] font-black uppercase text-slate-400 group-hover:text-sky-400 transition-colors whitespace-nowrap">Champions</div>
                </div>
              </Link>
              <Link
                href="/futbol/premier-league"
                onClick={() => trackContentClick('hub', 'premier_league')}
                className="flex-shrink-0 relative overflow-hidden group bg-slate-900 border border-slate-800/80 px-6 py-4 rounded-2xl text-center transition-[border-color,transform] duration-300 hover:border-purple-500/50 hover:-translate-y-0.5 active:scale-95 shadow-xl shadow-black/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/5 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="h-10 w-auto mb-1.5 transform group-hover:scale-110 transition-transform duration-500 flex items-center justify-center">
                    <NextImage src="/images/logo_ligas/premier_league.webp" alt="Premier League" width={40} height={40} className="h-full w-auto object-contain" />
                  </div>
                  <div className="text-[10px] font-black uppercase text-slate-400 group-hover:text-purple-400 transition-colors whitespace-nowrap">Premier League</div>
                </div>
              </Link>
            </div>
          </section>
        </main>
      </div>

      <SportEventModal
        evento={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </>
  );
}

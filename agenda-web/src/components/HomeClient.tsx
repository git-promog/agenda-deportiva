"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Zap, ChevronRight, Newspaper } from 'lucide-react';
import Link from 'next/link';
import NextImage from 'next/image';
import Header from '@/components/Header';
import HomeHero from '@/components/HomeHero';
import HomeDestacados from '@/components/HomeDestacados';
import SportEventModal from '@/components/SportEventModal';
import AgendaSearch from '@/components/agenda/AgendaSearch';
import AgendaQuickActions from '@/components/agenda/AgendaQuickActions';
import AgendaFilters from '@/components/agenda/AgendaFilters';
import AgendaResults from '@/components/agenda/AgendaResults';
import { trackContentClick, trackEvent, trackFilter, trackSearch } from '@/lib/analytics';
import { getTodayMexicoString, isEventLive } from '@/lib/mexicoTime';
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

interface HomeClientProps {
  initialEventos: Evento[];
  initialNoticias: Noticia[];
  initialUltimaAct: string;
}

export default function HomeClient({ initialEventos, initialNoticias, initialUltimaAct }: HomeClientProps) {
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

  // Listener para scroll a eventos en vivo (Header / NavMobile)
  useEffect(() => {
    const handleScrollToLive = () => {
      const eventosEnVivo = document.querySelectorAll('[data-envivo="true"]');
      if (eventosEnVivo.length > 0) {
        eventosEnVivo[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };
    window.addEventListener('scroll-to-live', handleScrollToLive);
    return () => window.removeEventListener('scroll-to-live', handleScrollToLive);
  }, []);

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
  const safeText = (value: string | null | undefined, fallback = "") => value || fallback;

  const deportesUnicos = ["Todos", ...new Set(eventos.map(e => safeText(e.deporte, "Otros")))];
  const fechasUnicas = ["Todos", ...new Set(eventos.map(e => safeText(e.fecha)))].filter(f => f !== "" && f >= hoyStr);
  const competicionesUnicas = ["Todos", ...new Set(eventos.map(e => safeText(e.competicion)).filter(Boolean))];

  const destacados = eventos.filter(e => {
    const esDeHoy = e.fecha === hoyStr;
    if (e.destacado === true) return esDeHoy;
    if (e.destacado === false) return false;
    if (e.destacado === null || e.destacado === undefined) {
      const eventName = safeText(e.evento);
      return esDeHoy && TOP_TEAMS.some(t => eventName.toLowerCase().includes(t.toLowerCase()));
    }
    return false;
  }).slice(0, 6);

  const eventosEnVivo = eventos.filter((e) => isEventLive(e.fecha, e.hora));
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
  const eventosBuscados = busqueda.trim() ? searchEvents(eventos, busqueda) : eventos;

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
    const esEnVivo = isEventLive(fecha, hora);
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

  const irAEnVivo = () => {
    trackEvent('click_en_vivo', { location: 'quick_actions' });
    const enVivoEls = document.querySelectorAll('[data-envivo="true"]');
    if (enVivoEls.length > 0) {
      enVivoEls[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setSoloEnVivo(true);
    }
  };

  const irAHoy = () => {
    trackFilter('date', hoyStr);
    setFiltroFecha(hoyStr);
  };

  const activeFilters: string[] = [];
  if (filtroDeporte !== "Todos") activeFilters.push(`${emojis[filtroDeporte] || "🏆"} ${filtroDeporte}`);
  if (filtroFecha !== "Todos") activeFilters.push("📅 " + formatearLabelFecha(filtroFecha));
  if (filtroCompeticion !== "Todos") activeFilters.push("🛡️ " + filtroCompeticion);
  if (soloTvAbierta) activeFilters.push("📺 TV Abierta");
  if (soloEnVivo) activeFilters.push("🔴 En Vivo");

  const activeFiltersCount = activeFilters.length;
  const isDefaultView = !busqueda && filtroDeporte === "Todos" && filtroFecha === "Todos" && filtroCompeticion === "Todos" && !soloTvAbierta && !soloEnVivo;

  return (
    <>
      <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-24 w-full relative">
        <Header ultimaAct={initialUltimaAct} />

        <main id="envivo" className="w-full max-w-4xl mx-auto px-4 pt-8 pb-8">
          {/* 1. H1 visible + propuesta de valor */}
          <section className="mb-6 pt-2">
            <div className="flex items-center gap-2 text-[10px] font-black text-[#a3e635] uppercase tracking-[0.25em] mb-3">
              <span className="inline-block w-1.5 h-1.5 bg-[#a3e635] rounded-full" />
              Agenda deportiva en vivo
            </div>
            <h1 className="text-3xl md:text-5xl font-black italic lowercase leading-[0.95] tracking-tighter text-white">
              ¿Dónde ver deportes <span className="text-[#a3e635]">hoy en México</span>?
            </h1>
            <p className="text-slate-300 text-xs md:text-sm mt-3 font-medium max-w-xl">
              Agenda actualizada de TV abierta, de paga y streaming: partidos en vivo, horarios y canales.
            </p>
          </section>

          {/* 2. Búsqueda grande */}
          <section className="mb-5">
            <AgendaSearch value={busqueda} onChange={setBusqueda} />
          </section>

          {/* 3. Accesos rápidos + 4. Deportes principales */}
          <section className="mb-5">
            <AgendaQuickActions
              deportes={deportesUnicos}
              deporteActivo={filtroDeporte}
              onDeporteChange={(dep) => { trackFilter('sport', dep); setFiltroDeporte(dep); }}
              onEnVivo={irAEnVivo}
              onHoy={irAHoy}
              emojis={emojis}
            />
          </section>

          {/* 5. Botón Filtrar + filtros activos */}
          <section className="mb-6 flex flex-wrap items-center gap-2">
            <AgendaFilters
              filtroFecha={filtroFecha}
              fechas={fechasUnicas}
              onFechaChange={(f) => { trackFilter('date', f); setFiltroFecha(f); }}
              filtroCompeticion={filtroCompeticion}
              competiciones={competicionesUnicas}
              onCompeticionChange={(c) => { trackFilter('league', c); setFiltroCompeticion(c); }}
              soloTvAbierta={soloTvAbierta}
              onTvAbiertaChange={(v) => { trackFilter('tv_abierta', v); setSoloTvAbierta(v); }}
              activeCount={activeFiltersCount}
              onReset={resetFilters}
              formatButtonFecha={formatearBotonFecha}
            />

            {activeFilters.map((f, i) => (
              <span key={i} className="text-[10px] font-bold text-white bg-blue-600/30 px-2.5 py-1.5 rounded-lg border border-blue-500/30">
                {f}
              </span>
            ))}

            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-[10px] font-black text-white bg-red-600 hover:bg-red-500 transition-colors uppercase px-3 py-1.5 rounded-lg border border-red-500 flex items-center gap-1"
              >
                <span>✕</span> Limpiar
              </button>
            )}
          </section>

          {/* Hero del evento destacado/en vivo (solo vista por defecto) */}
          {isDefaultView && eventoHero && (
            <HomeHero evento={eventoHero} tipo={tipoHero} onClick={() => setSelectedEvent(eventoHero)} />
          )}

          {/* 6. Resultados */}
          <div id="listado-eventos-principal" className="w-full">
            <AgendaResults
              eventosAgrupados={eventosAgrupados}
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

          {/* 7. Imperdibles */}
          {isDefaultView && (
            <HomeDestacados destacados={destacados} onEventClick={setSelectedEvent} />
          )}

          {/* 8. Noticias y hubs */}
          {isDefaultView && noticias.length > 0 && (
            <section className="my-12 w-full">
              <div className="flex items-center justify-between mb-6 px-2">
                <h2 className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.25em] flex items-center gap-2">
                  <Newspaper className="w-3 h-3" /> Últimas Noticias
                </h2>
                <Link href="/noticias" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-blue-400 transition-colors flex items-center gap-1">
                  Ver todas <ChevronRight size={10} />
                </Link>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
                {noticias.slice(0, 5).map((n) => {
                  const emoji = guessSportEmoji(n.titulo);
                  return (
                    <Link key={n.id} href={`/noticias/${n.slug}`} className="min-w-[280px] w-[85vw] max-w-[340px] bg-slate-900/50 border border-slate-800 p-4 rounded-[32px] flex gap-4 items-center hover:bg-slate-800/80 hover:border-slate-700 transition-all cursor-pointer group flex-shrink-0">
                      <div className="w-20 h-20 bg-slate-800 rounded-2xl flex-shrink-0 flex items-center justify-center border border-white/5 group-hover:scale-105 transition-all overflow-hidden relative">
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
                              <Newspaper className="text-blue-500/50" size={24} />
                            )}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold leading-snug mb-2 text-slate-100 group-hover:text-white line-clamp-2">{n.titulo}</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-1">
                            {n.fecha_publicacion && (
                              <p className="text-[10px] text-slate-400 font-medium">{n.fecha_publicacion}</p>
                            )}
                            {n.autor ? (
                              <p className="text-[10px] font-bold text-blue-400 tracking-wide">Por {n.autor}</p>
                            ) : (
                              <p className="text-[10px] font-bold text-slate-500 tracking-wide">GuíaSports</p>
                            )}
                          </div>
                          <span className="text-[10px] text-blue-400 font-bold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">Leer →</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}

                <Link href="/noticias" className="min-w-[150px] bg-slate-900/20 border border-dashed border-slate-800 p-5 rounded-[32px] flex flex-col items-center justify-center hover:bg-slate-800/40 hover:border-slate-700 transition-all cursor-pointer group flex-shrink-0">
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Zap className="text-blue-500" size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 tracking-wide group-hover:text-white transition-colors">+ Ver más</span>
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

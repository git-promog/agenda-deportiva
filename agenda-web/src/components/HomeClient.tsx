"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tv, Calendar, Trophy, Clock, Zap, Filter, Star, Search, X, CalendarDays, ChevronLeft, ChevronRight, Newspaper, ArrowUp, Shield, Radio } from 'lucide-react';
import Link from 'next/link';
import NextImage from 'next/image';
import AdPlacement from '@/components/AdPlacement';
import NavMobile from '@/components/NavMobile';
import Header from '@/components/Header';
import ShareButton from '@/components/ShareButton';
import SportEventCard from '@/components/SportEventCard';
import HomeHero from '@/components/HomeHero';
import HomeDestacados from '@/components/HomeDestacados';

const emojis: { [key: string]: string } = {
  "Fútbol": "⚽️", "Básquetbol": "🏀", "Béisbol": "⚾️", "Fórmula 1": "🏎️", 
  "Motorismo": "🏍️", "Tenis": "🎾", "Fútbol Americano": "🏈", "Rugby": "🏉", 
  "Hockey": "🏒", "Combate": "🥊", "Ciclismo": "🚴", "Voleibol": "🏐", 
  "Golf": "⛳️", "Natación": "🏊", "Fútbol Sala": "👟", "Otros": "🏆"
};

const TOP_TEAMS = ["América", "Chivas", "Real Madrid", "Barcelona", "México", "F1", "NBA", "Champions", "Cruz Azul", "Pumas", "Selección"];

interface HomeClientProps {
  initialEventos: any[];
  initialNoticias: any[];
  initialUltimaAct: string;
}

export default function HomeClient({ initialEventos, initialNoticias, initialUltimaAct }: HomeClientProps) {
  const searchParams = useSearchParams();
  const [eventos] = useState<any[]>(initialEventos);
  const [noticias] = useState<any[]>(initialNoticias);
  const [filtroDeporte, setFiltroDeporte] = useState("Todos");
  const [filtroFecha, setFiltroFecha] = useState("Todos");
  const [filtroCompeticion, setFiltroCompeticion] = useState("Todos");
  const [soloTvAbierta, setSoloTvAbierta] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [soloEnVivo, setSoloEnVivo] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const filtrosRef = useRef<HTMLDivElement>(null);
  const [filtrosFixed, setFiltrosFixed] = useState(false);
  const filtrosOffsetTop = useRef(0);
  const [showGoTop, setShowGoTop] = useState(false);
  const [showFechaDropdown, setShowFechaDropdown] = useState(false);
  const [showCompDropdown, setShowCompDropdown] = useState(false);
  const [busquedaLigas, setBusquedaLigas] = useState("");

  useEffect(() => {
    if (searchParams.get('envivo') === '1') {
      setSoloEnVivo(true);
    }
    const comp = searchParams.get('competicion');
    if (comp) {
      setFiltroCompeticion(comp);
    }
  }, [searchParams]);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (showFechaDropdown && !target.closest('[data-fecha-toggle]') && !target.closest('[data-fecha-dropdown]')) {
        setShowFechaDropdown(false);
      }
      if (showCompDropdown && !target.closest('[data-comp-toggle]') && !target.closest('[data-comp-dropdown]')) {
        setShowCompDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showFechaDropdown, showCompDropdown]);

  useEffect(() => {
    const originalOffsetTop = filtrosRef.current?.offsetTop || 0;
    
    const handleScroll = () => {
      setFiltrosFixed(window.scrollY >= originalOffsetTop);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollDeportes = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollTo = direction === 'left' ? scrollRef.current.scrollLeft - 150 : scrollRef.current.scrollLeft + 150;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
};
  
  const getTodayStr = () => {
    try {
      const mxDate = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Mexico_City"}));
      return mxDate.getFullYear() + "-" + String(mxDate.getMonth() + 1).padStart(2, '0') + "-" + String(mxDate.getDate()).padStart(2, '0');
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  };
  const hoyStr = getTodayStr();
  const deportesUnicos = ["Todos", ...new Set(eventos.map(e => e.deporte))];
  const fechasUnicas = ["Todos", ...new Set(eventos.map(e => e.fecha))].filter(f => f !== "" && f >= hoyStr);
  const competicionesUnicas = ["Todos", ...new Set(eventos.map(e => e.competicion).filter(Boolean))];

  useEffect(() => {
    const handleScroll = () => {
      setShowGoTop(window.scrollY > 350);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const estaEnVivo = (fecha: string, hora: string) => {
    if (fecha !== hoyStr) return false;
    const ahora = new Date();
    const [h, m] = hora.split(':').map(Number);
    const horaEvento = new Date();
    horaEvento.setHours(h, m, 0);
    const dif = ahora.getTime() - horaEvento.getTime();
    return dif >= 0 && dif < (2 * 60 * 60 * 1000);
  };

  const destacados = eventos.filter(e => {
    const esDeHoy = e.fecha === hoyStr;
    if (e.destacado === true) return esDeHoy;
    if (e.destacado === false) return false;
    if (e.destacado === null || e.destacado === undefined) {
      return esDeHoy && TOP_TEAMS.some(t => e.evento.toLowerCase().includes(t.toLowerCase()));
    }
    return false;
  }).slice(0, 6);

  const eventosEnVivo = eventos.filter((e) => estaEnVivo(e.fecha, e.hora));
  let eventoHero = null;
  let tipoHero = "EN VIVO AHORA";
  
  if (eventosEnVivo.length > 0) {
    eventoHero = eventosEnVivo.find(e => e.destacado === true) || 
                 eventosEnVivo.find(e => TOP_TEAMS.some(t => e.evento.toLowerCase().includes(t.toLowerCase()))) || 
                 eventosEnVivo[0];
  } else if (destacados.length > 0) {
    eventoHero = destacados[0];
    tipoHero = "PARTIDO DEL DÍA";
  }

  const eventosFiltrados = eventos.filter(e => {
    const coincideDeporte = filtroDeporte === "Todos" || e.deporte === filtroDeporte;
    // Solo mostrar eventos de hoy y futuros (nunca pasados)
    const esFechaPasada = e.fecha < hoyStr;
    const coincideFecha = (filtroFecha === "Todos" ? !esFechaPasada : e.fecha === filtroFecha);
    const coincideCompeticion = filtroCompeticion === "Todos" || e.competicion === filtroCompeticion;
    const coincideBusqueda = e.evento.toLowerCase().includes(busqueda.toLowerCase()) || 
                             e.competicion.toLowerCase().includes(busqueda.toLowerCase());
    const canalesLower = e.canales.toLowerCase();
    const esTvAbierta = ["canal 5", "azteca 7", "las estrellas", "nu9ve", "imagen tv", "azteca uno", "canal 9"].some(c => canalesLower.includes(c));
    const esEnVivo = estaEnVivo(e.fecha, e.hora);
    return coincideDeporte && coincideFecha && coincideCompeticion && coincideBusqueda && (soloTvAbierta ? esTvAbierta : true) && (soloEnVivo ? esEnVivo : true);
  });

  const eventosAgrupados = eventosFiltrados.reduce((groups: any, evento) => {
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

  const toggleEnVivo = () => {
    const eventosEnVivo = document.querySelectorAll('[data-envivo="true"]');
    if (eventosEnVivo.length > 0) {
      eventosEnVivo[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const activeFilters = [];
  if (filtroDeporte !== "Todos") activeFilters.push(`${emojis[filtroDeporte] || "🏆"} ${filtroDeporte}`);
  if (filtroFecha !== "Todos") activeFilters.push("📅 " + formatearLabelFecha(filtroFecha));
  if (filtroCompeticion !== "Todos") activeFilters.push("🛡️ " + filtroCompeticion);
  if (soloTvAbierta) activeFilters.push("📺 TV Abierta");
  if (soloEnVivo) activeFilters.push("🔴 En Vivo");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": eventosFiltrados.slice(0, 40).map((evento: any, index: number) => {
      const startDate = new Date(`${evento.fecha}T${evento.hora}:00-06:00`);
      const endDate = new Date(startDate.getTime() + (120 * 60 * 1000));
      const teams = evento.evento.split(/ vs | v | contra /i);

      return {
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "SportsEvent",
          "name": `${evento.evento} - ${evento.competicion}`,
          "description": `Transmisión de ${evento.evento} (${evento.competicion}) por ${evento.canales}`,
          "startDate": startDate.toISOString(),
          "endDate": endDate.toISOString(),
          "eventStatus": "https://schema.org/EventScheduled",
          "image": "https://www.guiasports.com/GuiaSports-logo.svg",
          "sport": evento.deporte,
          "location": {
            "@type": "Place",
            "name": "Transmisión en México",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "México",
              "addressCountry": "MX"
            }
          },
          "performer": teams.length > 1 ? teams.map((t: string) => ({
            "@type": "SportsTeam",
            "name": t.trim()
          })) : { "@type": "SportsTeam", "name": evento.evento },
          "organizer": {
            "@type": "Organization",
            "name": "GuíaSports",
            "url": "https://www.guiasports.com"
          }
        }
      };
    })
  };

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-24 w-full overflow-x-hidden">
      
      <Header ultimaAct={initialUltimaAct} showSearch={true} busqueda={busqueda} onBusquedaChange={setBusqueda} />

      <div ref={filtrosRef} className={`bg-[#020617]/95 backdrop-blur-xl border-b border-slate-800 shadow-2xl z-[60] transition-all duration-300 ${filtrosFixed ? 'fixed top-0 left-0 right-0 py-2' : 'relative py-4'}`}>
        <div className="max-w-4xl mx-auto px-4">
          
          {/* Logo que aparece solo en Scroll para Navegación Universal */}
          {filtrosFixed && (
            <div className="flex justify-center mb-3 animate-in fade-in slide-in-from-top-2 duration-500">
              <Link href="/" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                <NextImage src="/GuiaSports-logo.svg" alt="GuíaSports" width={100} height={30} className="h-6 w-auto opacity-80 hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          )}

          {/* ROW 1: Barra de acción rápida */}
          <div className="flex items-center gap-2 mb-3 overflow-x-auto scrollbar-hide">
            <button
              onClick={toggleEnVivo}
              className="bg-red-600 text-white rounded-xl px-3 py-2 font-black uppercase text-[10px] tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.5)] animate-pulse flex items-center gap-1.5"
            >
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
              <span className="hidden sm:inline">En Vivo</span>
              <Radio size={14} className="sm:hidden" />
            </button>

            <div className="hidden md:flex items-center gap-1">
              {fechasUnicas.slice(0, 4).map((f: any) => (
                <button key={f} onClick={() => setFiltroFecha(f)} className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filtroFecha === f ? "text-[#a3e635] bg-[#a3e635]/10 border border-[#a3e635]/30" : "bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800"}`}>
                  {formatearBotonFecha(f)}
                </button>
              ))}
            </div>

            <div className="md:hidden">
              <button data-fecha-toggle onClick={() => setShowFechaDropdown(!showFechaDropdown)} className={`flex items-center gap-1 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filtroFecha !== "Todos" ? "text-[#a3e635] bg-[#a3e635]/10 border border-[#a3e635]/30" : "bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800"}`}>
                📅 {filtroFecha === "Todos" ? "Hoy" : formatearLabelFecha(filtroFecha)}
                <ChevronRight size={12} className={`transition-transform ${showFechaDropdown ? 'rotate-[-90deg]' : 'rotate-90'}`} />
              </button>
            </div>

            {competicionesUnicas.length > 1 && (
              <div className="relative">
                <button data-comp-toggle onClick={() => { setShowCompDropdown(!showCompDropdown); setBusquedaLigas(""); }} className={`flex items-center gap-1 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filtroCompeticion !== "Todos" ? "text-blue-400 bg-blue-600/10 border border-blue-500/30" : "bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800"}`}>
                  🛡️ <span className="hidden sm:inline">{filtroCompeticion === "Todos" ? "Ligas" : filtroCompeticion}</span><span className="sm:hidden">Ligas</span>
                  <ChevronRight size={12} className={`transition-transform ${showCompDropdown ? 'rotate-[-90deg]' : 'rotate-90'}`} />
                </button>
              </div>
            )}

            <button
              onClick={() => setSoloTvAbierta(!soloTvAbierta)}
              className={`flex items-center gap-1 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${soloTvAbierta ? "bg-white text-black border border-white" : "text-slate-500 border border-slate-800 hover:text-slate-300 bg-slate-900/50"}`}
            >
              <Tv size={12} /> <span className="hidden sm:inline">{soloTvAbierta ? "TV Abierta" : "TV Abierta"}</span><span className="sm:hidden">📺</span>
            </button>
          </div>

          {/* CONTENEDOR DE MENÚS DESPLEGABLES (Fuera del scroll) */}
          <div className="relative">
            {showFechaDropdown && (
              <div data-fecha-dropdown className="absolute top-0 left-0 mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-[100] py-1 min-w-[180px]">
                {fechasUnicas.map((f: any) => (
                  <button key={f} onClick={() => { setFiltroFecha(f); setShowFechaDropdown(false); }} className={`w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest border-b border-white/5 last:border-0 transition-all ${filtroFecha === f ? "text-[#a3e635] bg-[#a3e635]/10" : "text-slate-400 hover:bg-slate-800"}`}>
                    {formatearBotonFecha(f)}
                  </button>
                ))}
              </div>
            )}

            {showCompDropdown && (
              <div data-comp-dropdown className="absolute top-0 left-0 mt-1 bg-slate-900 border border-slate-700 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-[100] py-1 min-w-[240px] max-h-[380px] flex flex-col overflow-hidden">
                <div className="px-3 py-3 border-b border-slate-700 bg-slate-950/50">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Buscar liga..."
                      value={busquedaLigas}
                      onChange={(e) => setBusquedaLigas(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-base text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 shadow-inner"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="overflow-y-auto max-h-[280px] scrollbar-hide">
                  {competicionesUnicas.filter((c: any) => c.toLowerCase().includes(busquedaLigas.toLowerCase())).map((c: any) => (
                    <button key={c} onClick={() => { setFiltroCompeticion(c); setShowCompDropdown(false); setBusquedaLigas(""); }} className={`w-full text-left px-5 py-4 text-[10px] font-black uppercase tracking-widest border-b border-white/5 last:border-0 transition-all ${filtroCompeticion === c ? "text-blue-400 bg-blue-600/10" : "text-slate-400 hover:bg-slate-800"}`}>
                      {c === "Todos" ? "🛡️ Todas las ligas" : c}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ROW 2: Filtro de deportes con scroll */}
          <div className="relative flex items-center">
            <button onClick={() => scrollDeportes('left')} className="absolute left-0 z-10 bg-slate-900/80 p-2 rounded-full shadow-lg"><ChevronLeft size={16} /></button>
            <div ref={scrollRef} className="flex gap-2 overflow-x-auto py-1 px-4 scrollbar-hide scroll-smooth w-full">
              {deportesUnicos.map((dep: any) => (
                <button key={dep} onClick={() => setFiltroDeporte(dep)} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all whitespace-nowrap border uppercase tracking-wider ${filtroDeporte === dep ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/40" : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800"}`}>
                  {emojis[dep] || "🏆"} {dep}
                </button>
              ))}
            </div>
            <button onClick={() => scrollDeportes('right')} className="absolute right-0 z-10 bg-slate-900/80 p-2 rounded-full shadow-lg"><ChevronRight size={16} /></button>
          </div>

          {/* ROW 3: Breadcrumb de filtros activos */}
          {activeFilters.length > 0 && (
            <div className="flex items-center gap-3 mt-2 pt-2 border-t border-slate-700/50 bg-slate-900/30 px-3 py-2 rounded-xl">
              <span className="text-[10px] font-black text-[#a3e635] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#a3e635] rounded-full"></span>Mostrando:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeFilters.map((f, i) => (
                  <span key={i} className="text-[10px] font-black text-white bg-blue-600/30 px-2.5 py-1 rounded-lg border border-blue-500/30">{f}</span>
                ))}
              </div>
              <button onClick={() => { setFiltroDeporte("Todos"); setFiltroFecha("Todos"); setFiltroCompeticion("Todos"); setSoloTvAbierta(false); setSoloEnVivo(false); }} className="text-[10px] font-black text-white bg-red-600 hover:bg-red-500 transition-colors ml-auto uppercase px-3 py-1.5 rounded-lg border border-red-500 shadow-[0_0_10px_rgba(220,38,38,0.3)] flex items-center gap-1">
                <span>✕</span>Limpiar
              </button>
            </div>
          )}
        </div>
      </div>
      {filtrosFixed && <div style={{ height: filtrosRef.current?.offsetHeight }}></div>}

      <main id="envivo" className="w-full max-w-4xl mx-auto px-4 pt-24 pb-8">
        {!busqueda && (filtroFecha === "Todos" || filtroFecha === hoyStr) && (
          <>
            <HomeHero evento={eventoHero} tipo={tipoHero} />

            {filtroFecha === "Todos" && filtroDeporte === "Todos" && (
              <HomeDestacados destacados={destacados} />
            )}

            {noticias.length > 0 && (
              <div className="mb-12 w-full">
                <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2 px-2"><Newspaper className="w-3 h-3" /> Previas y Análisis</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
                  {noticias.map((n: any) => (
                    <Link key={n.id} href={`/noticias/${n.slug}`} className="min-w-[280px] w-[85vw] max-w-[340px] bg-slate-900/50 border border-slate-800 p-5 rounded-[32px] flex gap-4 items-center hover:bg-slate-800/80 hover:border-slate-700 transition-all cursor-pointer group flex-shrink-0">
                      <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex-shrink-0 flex items-center justify-center border border-blue-500/20 group-hover:scale-105 group-hover:bg-blue-600/30 transition-all">
                        <Newspaper className="text-blue-500" size={28} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs font-black uppercase italic leading-tight mb-1 text-slate-200 group-hover:text-white line-clamp-2">{n.titulo}</h3>
                        <p className="text-[9px] text-slate-500 uppercase font-bold">{n.fecha} • Leer más →</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* HUBS DE COMPETICIONES */}
        <section className="mb-12 w-full">
          <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 px-2">Competiciones Destacadas</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
            <Link 
              href="/mundial-2026" 
              className="flex-shrink-0 relative overflow-hidden group bg-slate-900 border border-yellow-500/30 px-6 py-4 rounded-2xl text-center transition-all duration-500 hover:border-yellow-400 hover:shadow-[0_0_25px_rgba(234,179,8,0.3)] hover:-translate-y-0.5 active:scale-95 shadow-xl shadow-black/20"
            >
              {/* Animated background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-yellow-600/5 opacity-50 group-hover:opacity-100 transition-opacity"></div>
              
              {/* Shimmer effect */}
              <div className="absolute -inset-[100%] group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[25deg] pointer-events-none"></div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="h-10 w-auto mb-1.5 transform group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                  <img src="/images/mundial/Copa_Mundial_FIFA_2026-logo.webp" alt="FIFA 2026" className="h-full w-auto object-contain" />
                </div>
                <div className="text-[10px] font-black uppercase text-yellow-500 tracking-widest group-hover:text-yellow-400 transition-colors whitespace-nowrap">Mundial 2026</div>
              </div>
            </Link>
            <Link href="/?competicion=Liga MX" className="flex-shrink-0 bg-slate-900/50 border border-slate-800 px-6 py-4 rounded-2xl text-center hover:border-blue-500/30 transition-all group shadow-lg">
              <div className="text-2xl mb-1.5">🛡️</div>
              <div className="text-[10px] font-black uppercase text-slate-400 group-hover:text-white transition-colors whitespace-nowrap">Liga MX</div>
            </Link>
          </div>
        </section>

        <div id="listado-eventos-principal" className="w-full">
        {Object.keys(eventosAgrupados).length > 0 ? (
          Object.keys(eventosAgrupados).sort().map((fecha) => (
            <section key={fecha} className="mb-12 w-full">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 whitespace-nowrap"><CalendarDays className="w-4 h-4 text-blue-500" /> {new Date(fecha + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}</h2>
                <div className="h-px w-full bg-slate-800/30"></div>
              </div>
              <div className="flex flex-col gap-3 w-full">
                {eventosAgrupados[fecha].map((evento: any, index: number) => (
                  <div key={evento.id} id={`evento-${evento.id}`} data-envivo={estaEnVivo(evento.fecha, evento.hora) ? 'true' : 'false'} className="w-full">
                    <SportEventCard evento={evento} isLive={estaEnVivo(evento.fecha, evento.hora)} onFiltrarLiga={(liga) => { setFiltroCompeticion(liga); setShowCompDropdown(false); }} />
                    {(index + 1) % 8 === 0 && index !== eventosAgrupados[fecha].length - 1 && <AdPlacement />}
                  </div>
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="text-center py-20 flex flex-col items-center">
             <div className="bg-slate-900 p-4 rounded-full mb-4"><Filter className="w-8 h-8 text-slate-700" /></div>
             <p className="text-slate-500 uppercase font-black text-[10px]">Sin resultados</p>
          </div>
        )}
        </div>
      </main>

{/* BOTÓN IR ARRIBA - POSICIONAMIENTO UNIVERSAL EXTREMO */}
      <button 
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        aria-label="Ir Arriba"
        className={`fixed right-6 p-4 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/50 rounded-2xl text-[#a3e635] shadow-[0_20px_60px_rgba(0,0,0,8)] transition-all duration-500 z-[90] md:bottom-10 md:right-10 ${showGoTop ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ bottom: showGoTop ? '5rem' : '-3rem' }}
      >
        <ArrowUp size={24} strokeWidth={3} />
      </button>
    </div>
    </>
  );
}

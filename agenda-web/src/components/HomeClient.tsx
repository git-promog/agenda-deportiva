"use client";

import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tv, Calendar, Trophy, Clock, Zap, Filter, Star, Search, X, CalendarDays, ChevronLeft, ChevronRight, Newspaper, ArrowUp, Shield, Radio } from 'lucide-react';
import Link from 'next/link';
import NextImage from 'next/image';
import AdPlacement from '@/components/AdPlacement';
import NavMobile from '@/components/NavMobile';
import Header from '@/components/Header';
import ShareButton from '@/components/ShareButton';

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

  useEffect(() => {
    if (searchParams.get('envivo') === '1') {
      setSoloEnVivo(true);
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
  const fechasUnicas = ["Todos", ...new Set(eventos.map(e => (e.fecha || "")))].filter(f => f !== "");
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
    if (e.destacado === true) return true;
    if (e.destacado === false) return false;
    if (e.destacado === null || e.destacado === undefined) {
      const esDeHoy = e.fecha === hoyStr;
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
    const coincideFecha = filtroFecha === "Todos" || e.fecha === filtroFecha;
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

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-24 w-full">
      
      <Header ultimaAct={initialUltimaAct} showSearch={true} busqueda={busqueda} onBusquedaChange={setBusqueda} />

      <div ref={filtrosRef} className="bg-[#020617] border-b border-slate-800 shadow-lg z-50" style={{ position: filtrosFixed ? 'fixed' : 'static', top: 0, left: 0, right: 0, width: filtrosFixed ? '100%' : undefined }}>
        <div className="max-w-4xl mx-auto px-4 py-2">

          {/* ROW 1: Barra de acción rápida */}
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={toggleEnVivo}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${soloEnVivo ? "bg-red-600 text-white shadow-lg shadow-red-900/40 border border-red-500" : "bg-slate-900 border border-slate-800 text-red-400 hover:bg-slate-800"}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${soloEnVivo ? "bg-white animate-ping" : "bg-red-500"}`}></div>
              <span className="hidden sm:inline">{soloEnVivo ? "En Vivo" : "En Vivo"}</span>
              <Radio size={14} className="sm:hidden animate-pulse" />
            </button>

            <div className="hidden md:flex items-center gap-1">
              {fechasUnicas.slice(0, 4).map((f: any) => (
                <button key={f} onClick={() => setFiltroFecha(f)} className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filtroFecha === f ? "text-[#a3e635] bg-[#a3e635]/10 border border-[#a3e635]/30" : "bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800"}`}>
                  {formatearBotonFecha(f)}
                </button>
              ))}
            </div>

            <div className="md:hidden relative">
              <button data-fecha-toggle onClick={() => setShowFechaDropdown(!showFechaDropdown)} className={`flex items-center gap-1 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filtroFecha !== "Todos" ? "text-[#a3e635] bg-[#a3e635]/10 border border-[#a3e635]/30" : "bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800"}`}>
                📅 {filtroFecha === "Todos" ? "Hoy" : formatearLabelFecha(filtroFecha)}
                <ChevronRight size={12} className={`transition-transform ${showFechaDropdown ? 'rotate-[-90deg]' : 'rotate-90'}`} />
              </button>
              {showFechaDropdown && (
                <div data-fecha-dropdown className="absolute top-full left-0 mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 py-1 min-w-[160px]">
                  {fechasUnicas.map((f: any) => (
                    <button key={f} onClick={() => { setFiltroFecha(f); setShowFechaDropdown(false); }} className={`w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${filtroFecha === f ? "text-[#a3e635] bg-[#a3e635]/10" : "text-slate-400 hover:bg-slate-800"}`}>
                      {formatearBotonFecha(f)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {competicionesUnicas.length > 1 && (
              <div className="relative">
                <button data-comp-toggle onClick={() => setShowCompDropdown(!showCompDropdown)} className={`flex items-center gap-1 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filtroCompeticion !== "Todos" ? "text-blue-400 bg-blue-600/10 border border-blue-500/30" : "bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800"}`}>
                  🛡️ <span className="hidden sm:inline">{filtroCompeticion === "Todos" ? "Torneos" : filtroCompeticion}</span><span className="sm:hidden">Torneos</span>
                  <ChevronRight size={12} className={`transition-transform ${showCompDropdown ? 'rotate-[-90deg]' : 'rotate-90'}`} />
                </button>
                {showCompDropdown && (
                  <div data-comp-dropdown className="absolute top-full left-0 mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 py-1 min-w-[200px] max-h-[240px] overflow-y-auto">
                    {competicionesUnicas.map((c: any) => (
                      <button key={c} onClick={() => { setFiltroCompeticion(c); setShowCompDropdown(false); }} className={`w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${filtroCompeticion === c ? "text-blue-400 bg-blue-600/10" : "text-slate-400 hover:bg-slate-800"}`}>
                        {c === "Todos" ? "🛡️ Todos los torneos" : c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setSoloTvAbierta(!soloTvAbierta)}
              className={`flex items-center gap-1 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${soloTvAbierta ? "bg-white text-black border border-white" : "text-slate-500 border border-slate-800 hover:text-slate-300 bg-slate-900/50"}`}
            >
              <Tv size={12} /> <span className="hidden sm:inline">{soloTvAbierta ? "TV Abierta" : "TV Abierta"}</span><span className="sm:hidden">📺</span>
            </button>
          </div>

          {/* ROW 2: Filtro de deportes con scroll */}
          <div className="relative flex items-center">
            <button onClick={() => scrollDeportes('left')} className="absolute left-0 z-10 bg-slate-900/80 p-2 rounded-full shadow-lg"><ChevronLeft size={16} /></button>
            <div ref={scrollRef} className="flex gap-2 overflow-x-auto py-1 px-8 scrollbar-hide scroll-smooth w-full text-center">
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
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-700/50">
              <span className="text-[10px] font-black text-[#a3e635] uppercase tracking-wider">Mostrando:</span>
              <div className="flex flex-wrap gap-1.5">
                {activeFilters.map((f, i) => (
                  <span key={i} className="text-[10px] font-black text-white bg-blue-600/30 px-2.5 py-1 rounded-lg border border-blue-500/30">{f}</span>
                ))}
              </div>
              <button onClick={() => { setFiltroDeporte("Todos"); setFiltroFecha("Todos"); setFiltroCompeticion("Todos"); setSoloTvAbierta(false); setSoloEnVivo(false); }} className="text-[10px] font-black text-red-400 hover:text-red-300 transition-colors ml-auto uppercase">
                Limpiar ✕
              </button>
            </div>
          )}
        </div>
      </div>
      {filtrosFixed && <div style={{ height: filtrosRef.current?.offsetHeight }}></div>}

      <main id="envivo" className="max-w-4xl mx-auto px-4 pt-24 pb-8">
        {!busqueda && (filtroFecha === "Todos" || filtroFecha === hoyStr) && (
          <>
            {eventoHero && (
              <div className="mb-12 relative w-full h-[320px] md:h-[400px] rounded-[40px] overflow-hidden group shadow-2xl border border-slate-800">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-[#020617] animate-pulse opacity-50"></div>
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:24px_24px]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/80 to-transparent z-10"></div>
                <div className="absolute inset-0 z-20 flex flex-col justify-between p-8 md:p-12">
                  <div className="flex justify-between items-start">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase border ${tipoHero === "EN VIVO AHORA" ? "bg-red-600 border-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)] animate-pulse" : "bg-blue-600/20 text-blue-400 border-blue-500/50"} backdrop-blur-md`}>
                      {tipoHero === "EN VIVO AHORA" && <div className="w-2 h-2 bg-white rounded-full animate-ping mr-1"></div>}
                      {tipoHero}
                    </div>
                    <ShareButton 
                      titulo={eventoHero.evento} 
                      url={`https://www.guiasports.com/?evento=${eventoHero.id}`} 
                      variant="icon"
                      className="!bg-white/10 !text-white !p-3 !rounded-full !hover:!bg-white/20"
                    />
                  </div>
                  <div>
                    <div className="text-[12px] font-black text-[#a3e635] uppercase tracking-widest mb-3 drop-shadow-lg flex items-center gap-2">
                        <span className="text-2xl" suppressHydrationWarning>{emojis[eventoHero.deporte] || "🏆"}</span> {eventoHero.competicion}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black italic uppercase text-white leading-none mb-6 drop-shadow-2xl">{eventoHero.evento}</h1>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="bg-[#a3e635] text-black px-6 py-3 rounded-2xl font-black text-sm uppercase italic flex items-center gap-2 shadow-[0_0_30px_rgba(163,230,53,0.3)]">
                        <Tv size={18} /> {eventoHero.canales}
                      </div>
                      <div className="bg-slate-900/80 border border-slate-700 backdrop-blur-md text-white px-6 py-3 rounded-2xl font-mono font-bold text-sm flex items-center gap-2">
                        <Clock className="text-blue-400" size={18} /> {eventoHero.hora}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-10 -bottom-10 text-[250px] md:text-[350px] opacity-[0.03] z-0 transform -rotate-12 pointer-events-none">{emojis[eventoHero.deporte] || "🏆"}</div>
              </div>
            )}

            {destacados.length > 0 && filtroFecha === "Todos" && filtroDeporte === "Todos" && (
              <div className="mb-12">
                <h2 className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2"><Star className="w-3 h-3 fill-yellow-500" /> Imperdibles de Hoy</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
                  {destacados.map((e) => (
                    <div key={e.id} className="min-w-[85vw] sm:min-w-[300px] bg-gradient-to-br from-blue-600 to-blue-900 justify-between p-[1px] rounded-3xl relative overflow-hidden group">
                      <div className="bg-[#020617]/80 backdrop-blur-sm p-5 rounded-[23px] h-full flex flex-col justify-between italic text-white hover:bg-transparent transition-colors duration-500 relative z-10">
                        <div>
                          <div className="text-[9px] font-black text-blue-400 uppercase mb-2">{e.competicion}</div>
                          <div className="text-lg font-black leading-tight mb-4 uppercase">{e.evento}</div>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                           <div className="flex items-center gap-2 font-mono font-bold"><Clock className="w-4 h-4 text-blue-400" /> {e.hora}</div>
                           <div className="text-[10px] font-black text-[#a3e635] bg-[#a3e635]/20 px-3 py-1 rounded-lg border border-[#a3e635]/30 backdrop-blur-md">{e.canales}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {noticias.length > 0 && (
              <div className="mb-12">
                <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2"><Newspaper className="w-3 h-3" /> Previas y Análisis</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
                  {noticias.map((n: any) => (
                    <Link key={n.id} href={`/noticias/${n.slug}`} className="min-w-[85vw] sm:min-w-[300px] bg-slate-900/50 border border-slate-800 p-5 rounded-[32px] flex gap-4 items-center hover:bg-slate-800/80 hover:border-slate-700 transition-all cursor-pointer group flex-shrink-0">
                      <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex-shrink-0 flex items-center justify-center border border-blue-500/20 group-hover:scale-105 group-hover:bg-blue-600/30 transition-all">
                        <Newspaper className="text-blue-500" size={28} />
                      </div>
                      <div>
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

        {/* HUBS DE DEPORTES */}
        <section className="mb-12">
          <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3">Explora por Deporte</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <Link href="/futbol" className="flex-shrink-0 bg-slate-900/50 border border-slate-800 px-5 py-3 rounded-xl text-center hover:border-[#a3e635]/30 transition-all group">
              <div className="text-xl mb-1">⚽️</div>
              <div className="text-[9px] font-black uppercase text-slate-400 group-hover:text-white transition-colors whitespace-nowrap">Fútbol</div>
            </Link>
            <Link href="/nba" className="flex-shrink-0 bg-slate-900/50 border border-slate-800 px-5 py-3 rounded-xl text-center hover:border-blue-500/30 transition-all group">
              <div className="text-xl mb-1">🏀</div>
              <div className="text-[9px] font-black uppercase text-slate-400 group-hover:text-white transition-colors whitespace-nowrap">NBA</div>
            </Link>
            <Link href="/mlb" className="flex-shrink-0 bg-slate-900/50 border border-slate-800 px-5 py-3 rounded-xl text-center hover:border-blue-500/30 transition-all group">
              <div className="text-xl mb-1">⚾️</div>
              <div className="text-[9px] font-black uppercase text-slate-400 group-hover:text-white transition-colors whitespace-nowrap">MLB</div>
            </Link>
            <Link href="/f1" className="flex-shrink-0 bg-slate-900/50 border border-slate-800 px-5 py-3 rounded-xl text-center hover:border-red-500/30 transition-all group">
              <div className="text-xl mb-1">🏎️</div>
              <div className="text-[9px] font-black uppercase text-slate-400 group-hover:text-white transition-colors whitespace-nowrap">Fórmula 1</div>
            </Link>
            <Link href="/mundial-2026" className="flex-shrink-0 bg-gradient-to-br from-yellow-500/10 to-yellow-700/5 border border-yellow-500/20 px-5 py-3 rounded-xl text-center hover:border-yellow-500/40 transition-all group">
              <div className="text-xl mb-1">🏆</div>
              <div className="text-[9px] font-black uppercase text-yellow-500 group-hover:text-yellow-400 transition-colors whitespace-nowrap">Mundial 2026</div>
            </Link>
          </div>
        </section>

        <div id="listado-eventos-principal" className="max-w-4xl mx-auto px-4 w-full">
        {Object.keys(eventosAgrupados).length > 0 ? (
          Object.keys(eventosAgrupados).sort().map((fecha) => (
            <section key={fecha} className="mb-12 w-full">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2"><CalendarDays className="w-4 h-4 text-blue-500" /> {new Date(fecha + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}</h2>
                <div className="h-px w-full bg-slate-800/30"></div>
              </div>
              <div className="grid gap-3">
                {eventosAgrupados[fecha].map((evento: any, index: number) => (
                  <div key={evento.id} id={`evento-${evento.id}`} data-envivo={estaEnVivo(evento.fecha, evento.hora) ? 'true' : 'false'}>
                    <div className="group bg-slate-900/30 border border-slate-800/50 rounded-2xl p-4 hover:border-blue-500/30 hover:bg-slate-900/60 transition-all duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex flex-row items-start sm:items-center gap-2 sm:gap-3 w-full">
                          <div className="flex flex-col justify-center min-w-[50px] sm:min-w-[65px] text-blue-400 font-mono font-black text-sm md:text-xl shrink-0 border-r border-slate-800/60 pr-2 sm:pr-3">
                            {evento.hora}
                            {estaEnVivo(evento.fecha, evento.hora) && (
                              <div className="flex items-center gap-1 mt-1 justify-center"><div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></div><span className="text-[7px] font-black text-red-500 uppercase">LIVE</span></div>
                            )}
                          </div>
                          <div className="flex-1 flex items-start sm:items-center justify-start min-w-0 pr-1">
                            <span className="text-xl sm:text-2xl md:text-4xl opacity-80 mr-2 sm:mr-3 shrink-0 pt-0.5 sm:pt-0">{emojis[evento.deporte] || "🏆"}</span>
                            <div className="min-w-0 flex-1 overflow-hidden">
                              <div className="text-[8px] sm:text-[9px] font-black text-slate-500 uppercase mb-0.5 truncate">{evento.competicion}</div>
                              <h3 className="text-[12px] sm:text-[14px] md:text-[15px] font-bold text-slate-200 leading-snug break-words line-clamp-2 md:line-clamp-2">{evento.evento}</h3>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row items-center gap-2 shrink-0 w-full sm:w-auto sm:overflow-visible border-t sm:border-t-0 border-slate-800/50 pt-2 sm:pt-0 mt-1 sm:mt-0">
                          <div className="flex-1 sm:flex-none flex items-center justify-start sm:justify-start gap-2 bg-[#020617] px-3 md:px-4 py-2 rounded-xl border border-slate-800 min-w-0 overflow-hidden">
                            <Tv className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600 shrink-0" />
                            <span className="text-[10px] md:text-[11px] font-black text-[#a3e635] italic uppercase whitespace-normal break-words py-0.5">{evento.canales}</span>
                          </div>
                          <ShareButton 
                            titulo={evento.evento} 
                            url={`https://www.guiasports.com/?evento=${evento.id}`} 
                            variant="icon"
                          />
                        </div>
                      </div>
                    </div>
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
        className={`fixed bottom-28 right-6 p-4 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/50 rounded-2xl text-[#a3e635] shadow-[0_20px_60px_rgba(0,0,0,0.8)] transition-all duration-500 z-[9999] md:bottom-10 md:right-10 ${showGoTop ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-24 opacity-0 scale-50 pointer-events-none'}`}
        aria-label="Ir Arriba"
      >
        <ArrowUp size={24} strokeWidth={3} />
      </button>
    </div>
  );
}

"use client";

import { useState, useRef } from 'react';
import { Tv, Calendar, Trophy, Clock, Zap, Filter, Star, Search, X, CalendarDays, Share2, ChevronLeft, ChevronRight, Newspaper } from 'lucide-react';
import Link from 'next/link';
import NextImage from 'next/image';
import AdPlacement from '@/components/AdPlacement';

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
  const [eventos] = useState<any[]>(initialEventos);
  const [noticias] = useState<any[]>(initialNoticias);
  const [filtroDeporte, setFiltroDeporte] = useState("Todos");
  const [filtroFecha, setFiltroFecha] = useState("Todos");
  const [soloTvAbierta, setSoloTvAbierta] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollDeportes = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollTo = direction === 'left' ? scrollRef.current.scrollLeft - 150 : scrollRef.current.scrollLeft + 150;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  // Safe fallback to today if window exists (client edge case), otherwise format it correctly
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
  const fechasUnicas = ["Todos", ...new Set(eventos.map(e => e.fecha))];

  const estaEnVivo = (fecha: string, hora: string) => {
    if (fecha !== hoyStr) return false;
    const ahora = new Date();
    const [h, m] = hora.split(':').map(Number);
    const horaEvento = new Date();
    horaEvento.setHours(h, m, 0);
    const dif = ahora.getTime() - horaEvento.getTime();
    return dif > 0 && dif < (2.5 * 60 * 60 * 1000);
  };

  const compartirWhatsApp = (e: any) => {
    const texto = `📺 *${e.evento}*\n🏆 ${e.competicion}\n⏰ ${e.hora}\n🔗 Canales: ${e.canales}\n\nLo vi en: https://guiasports.com`;
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
  };

  const destacados = eventos.filter(e => {
    const esDeHoy = e.fecha === hoyStr;
    if (e.destacado === true && esDeHoy) return true;
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
    const coincideFecha = filtroFecha === "Todos" || e.fecha === filtroFecha;
    const coincideBusqueda = e.evento.toLowerCase().includes(busqueda.toLowerCase()) || 
                             e.competicion.toLowerCase().includes(busqueda.toLowerCase());
    
    // Lista básica de TV Abierta en México
    const canalesLower = e.canales.toLowerCase();
    const esTvAbierta = ["canal 5", "azteca 7", "las estrellas", "nu9ve", "imagen tv", "azteca uno", "canal 9"].some(c => canalesLower.includes(c));
    const coincideTvAbierta = soloTvAbierta ? esTvAbierta : true;

    return coincideDeporte && coincideFecha && coincideBusqueda && coincideTvAbierta;
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

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-24 overflow-x-hidden w-full">
      
      <header className="border-b border-slate-800 bg-[#020617]/95 backdrop-blur-md sticky top-0 z-30 w-full overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 pt-4 w-full">
          <div className="flex justify-between items-center mb-6">
            <Link href="/" className="transition-transform active:scale-95">
              <NextImage src="/GuiaSports-logo.svg" alt="GuíaSports" width={200} height={50} className="h-10 w-auto" priority />
            </Link>
            <div className="flex flex-col items-end">
              <div className="text-[10px] font-black text-[#a3e635] bg-[#a3e635]/10 px-2 py-1 rounded border border-[#a3e635]/20 uppercase italic mb-1 tracking-widest">México</div>
              <div className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-[#a3e635] rounded-full animate-pulse"></div> {initialUltimaAct}
              </div>
            </div>
          </div>

          <div className="relative mb-6 w-full px-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input type="text" placeholder="Busca equipos o ligas..." className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3 pl-11 pr-10 text-base focus:outline-none focus:border-[#a3e635] text-slate-200" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            {busqueda && <button onClick={() => setBusqueda("")} className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-800 p-1 rounded-full text-slate-400"><X className="w-4 h-4" /></button>}
          </div>

          <div className="relative flex items-center mb-4 overflow-hidden">
            <div ref={scrollRef} className="flex gap-2 overflow-x-auto py-1 px-1 scrollbar-hide scroll-smooth w-full">
              {deportesUnicos.map((dep: any) => (
                <button key={dep} onClick={() => setFiltroDeporte(dep)} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all whitespace-nowrap border uppercase tracking-wider ${filtroDeporte === dep ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/40" : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800"}`}>
                  {emojis[dep] || "🏆"} {dep}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide border-t border-slate-900 pt-4 px-1">
            <button
              onClick={() => setSoloTvAbierta(!soloTvAbierta)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all whitespace-nowrap uppercase tracking-widest flex items-center gap-1 ${soloTvAbierta ? "bg-white text-black border border-white" : "text-slate-500 border border-slate-800 hover:text-slate-300 bg-slate-900/50"}`}
            >
              <Tv size={12} /> {soloTvAbierta ? "TV Abierta" : "Sólo TV Abierta"}
            </button>
            <div className="w-px h-6 bg-slate-800 mx-1"></div>
            {fechasUnicas.map((f: any) => (
              <button key={f} onClick={() => setFiltroFecha(f)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all whitespace-nowrap uppercase tracking-widest ${filtroFecha === f ? "text-[#a3e635] bg-[#a3e635]/10 border-[#a3e635]/30 border" : "text-slate-500 border border-transparent hover:text-slate-300"}`}>
                {formatearBotonFecha(f)}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {!busqueda && (
          <>
            {/* HERO BANNER EN VIVO / DESTACADO PRINCIPAL */}
            {eventoHero && filtroFecha === "Todos" && filtroDeporte === "Todos" && (
              <div className="mb-12 relative w-full h-[320px] md:h-[400px] rounded-[40px] overflow-hidden group shadow-2xl border border-slate-800">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-[#020617] animate-pulse opacity-50"></div>
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:24px_24px]"></div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/80 to-transparent z-10"></div>
                
                <div className="absolute inset-0 z-20 flex flex-col justify-between p-8 md:p-12">
                  <div className="flex justify-between items-start">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase border ${tipoHero === "EN VIVO AHORA" ? "bg-red-600 border-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)] animate-pulse" : "bg-blue-600/20 text-blue-400 border-blue-500/50"} backdrop-blur-md`}>
                      {tipoHero === "EN VIVO AHORA" && <div className="w-2 h-2 bg-white rounded-full animate-ping mr-1"></div>}
                      {tipoHero}
                    </div>
                    <button aria-label="Compartir" onClick={() => compartirWhatsApp(eventoHero)} className="bg-white/10 p-3 rounded-full text-white backdrop-blur-md hover:bg-white/20 transition-all">
                      <Share2 size={16} />
                    </button>
                  </div>
                  
                  <div>
                    <div className="text-[12px] font-black text-[#a3e635] uppercase tracking-widest mb-3 drop-shadow-lg flex items-center gap-2">
                       <span className="text-2xl">{emojis[eventoHero.deporte] || "🏆"}</span> {eventoHero.competicion}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black italic uppercase text-white leading-none mb-6 drop-shadow-2xl">
                      {eventoHero.evento}
                    </h1>
                    
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
                
                {/* Opcional: Icono Gigante de fondo si no hay imagen real */}
                <div className="absolute -right-10 -bottom-10 text-[250px] md:text-[350px] opacity-[0.03] z-0 transform -rotate-12 pointer-events-none">
                  {emojis[eventoHero.deporte] || "🏆"}
                </div>
              </div>
            )}

            {/* DESTACADOS */}
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
                      <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECCIÓN DE NOTICIAS DINÁMICAS */}
            {noticias.length > 0 && (
              <div className="mb-12">
                <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                  <Newspaper className="w-3 h-3" /> Previas y Análisis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {noticias.map((n: any) => (
                    <Link key={n.id} href={`/noticias/${n.slug}`} className="bg-slate-900/50 border border-slate-800 p-5 rounded-[32px] flex gap-4 items-center hover:bg-slate-800/80 hover:border-slate-700 transition-all cursor-pointer group">
                      <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex-shrink-0 flex items-center justify-center border border-blue-500/20 group-hover:scale-105 group-hover:bg-blue-600/30 transition-all">
                        <Newspaper className="text-blue-500" size={28} />
                      </div>
                      <div>
                        <h3 className="text-xs font-black uppercase italic leading-tight mb-1 text-slate-200 group-hover:text-white line-clamp-2">
                          {n.titulo}
                        </h3>
                        <p className="text-[9px] text-slate-500 uppercase font-bold">{n.fecha} • Leer más →</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* LISTADO DE EVENTOS */}
        {Object.keys(eventosAgrupados).length > 0 ? (
          Object.keys(eventosAgrupados).sort().map((fecha) => (
            <section key={fecha} className="mb-12 w-full">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2"><CalendarDays className="w-4 h-4 text-blue-500" /> {new Date(fecha + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}</h2>
                <div className="h-px w-full bg-slate-800/30"></div>
              </div>
              <div className="grid gap-3">
                {eventosAgrupados[fecha].map((evento: any, index: number) => (
                  <div key={evento.id}>
                    <div className="group bg-slate-900/30 border border-slate-800/50 rounded-2xl p-4 hover:border-blue-500/30 hover:bg-slate-900/60 transition-all duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 overflow-hidden">
                        
                        {/* SECCIÓN IZQUIERDA: Hora y Nombres (Siempre en fila) */}
                        <div className="flex flex-row items-start sm:items-center gap-2 sm:gap-3 w-full">
                          
                          {/* Columna de Hora */}
                          <div className="flex flex-col justify-center min-w-[50px] sm:min-w-[65px] text-blue-400 font-mono font-black text-sm md:text-xl shrink-0 border-r border-slate-800/60 pr-2 sm:pr-3">
                            {evento.hora}
                            {estaEnVivo(evento.fecha, evento.hora) && (
                              <div className="flex items-center gap-1 mt-1 justify-center"><div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></div><span className="text-[7px] font-black text-red-500 uppercase">LIVE</span></div>
                            )}
                          </div>
                          
                          {/* Columna de Evento */}
                          <div className="flex-1 flex items-start sm:items-center justify-start min-w-0 pr-1">
                            <span className="text-xl sm:text-2xl md:text-4xl opacity-80 mr-2 sm:mr-3 shrink-0 pt-0.5 sm:pt-0">{emojis[evento.deporte] || "🏆"}</span>
                            <div className="min-w-0 flex-1 overflow-hidden">
                              <div className="text-[8px] sm:text-[9px] font-black text-slate-500 uppercase mb-0.5 truncate">{evento.competicion}</div>
                              <h3 className="text-[12px] sm:text-[14px] md:text-[15px] font-bold text-slate-200 leading-snug break-words line-clamp-2 md:line-clamp-2">{evento.evento}</h3>
                            </div>
                          </div>

                        </div>

                        {/* SECCIÓN DERECHA: Canales y Botón (Abajo en móvil) */}
                        <div className="flex flex-row items-center gap-2 shrink-0 w-full sm:w-auto overflow-hidden sm:overflow-visible border-t sm:border-t-0 border-slate-800/50 pt-2 sm:pt-0 mt-1 sm:mt-0">
                          <div className="flex-1 sm:flex-none flex items-center justify-start sm:justify-start gap-2 bg-[#020617] px-3 md:px-4 py-2 rounded-xl border border-slate-800 min-w-0 overflow-hidden">
                            <Tv className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600 shrink-0" />
                            <span className="text-[10px] md:text-[11px] font-black text-[#a3e635] italic uppercase whitespace-normal break-words py-0.5">{evento.canales}</span>
                          </div>
                          <button aria-label="Compartir" onClick={() => compartirWhatsApp(evento)} className="p-3 bg-slate-800 rounded-xl hover:bg-emerald-600 transition-colors text-slate-400 hover:text-white shrink-0"><Share2 className="w-4 h-4" /></button>
                        </div>

                      </div>
                    </div>
                    {/* Insertar Anuncio cada 8 eventos, evitando ponerlo al final absoluto de la lista si es el último */}
                    {(index + 1) % 8 === 0 && index !== eventosAgrupados[fecha].length - 1 && (
                      <AdPlacement />
                    )}
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
      </main>
    </div>
  );
}

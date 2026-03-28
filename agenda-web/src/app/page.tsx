"use client";

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Tv, Calendar, Trophy, Clock, Zap, Filter, Star, Search, X, CalendarDays, Share2, ChevronLeft, ChevronRight, Newspaper } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const emojis: { [key: string]: string } = {
  "Fútbol": "⚽️", "Básquetbol": "🏀", "Béisbol": "⚾️", "Fórmula 1": "🏎️", 
  "Motorismo": "🏍️", "Tenis": "🎾", "Fútbol Americano": "🏈", "Rugby": "🏉", 
  "Hockey": "🏒", "Combate": "🥊", "Ciclismo": "🚴", "Voleibol": "🏐", 
  "Golf": "⛳️", "Natación": "🏊", "Fútbol Sala": "👟", "Otros": "🏆"
};

const TOP_TEAMS = ["América", "Chivas", "Real Madrid", "Barcelona", "México", "F1", "NBA", "Champions", "Cruz Azul", "Pumas", "Selección"];

export default function Home() {
  const [eventos, setEventos] = useState<any[]>([]);
  const [filtroDeporte, setFiltroDeporte] = useState("Todos");
  const [filtroFecha, setFiltroFecha] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [ultimaAct, setUltimaAct] = useState("");
  
  // Referencia para el scroll de deportes
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const { data: evData } = await supabase.from('eventos').select('*').order('fecha', { ascending: true }).order('hora', { ascending: true });
        const { data: stData } = await supabase.from('status').select('valor').eq('nombre', 'ultima_actualizacion').maybeSingle();
        if (evData) setEventos(evData);
        if (stData) setUltimaAct(stData.valor);
      } catch (err) { console.error(err); } finally { setCargando(false); }
    }
    cargarDatos();
  }, []);

  const scrollDeportes = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 200 : scrollLeft + 200;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const hoyStr = new Date().toLocaleDateString('sv-SE'); 
  const deportesUnicos = ["Todos", ...new Set(eventos.map(e => e.deporte))];
  const fechasUnicas = ["Todos", ...new Set(eventos.map(e => e.fecha))];

  const estaEnVivo = (fecha: string, hora: string) => {
    if (fecha !== hoyStr) return false;
    const ahora = new Date();
    const [h, m] = hora.split(':').map(Number);
    const horaEvento = new Date();
    horaEvento.setHours(h, m, 0);
    const diferenciaMs = ahora.getTime() - horaEvento.getTime();
    return diferenciaMs > 0 && diferenciaMs < (2.5 * 60 * 60 * 1000);
  };

  const compartirWhatsApp = (e: any) => {
    const texto = `⚽ *${e.evento}*\n🏆 ${e.competicion}\n⏰ ${e.hora}\n📺 Canales: ${e.canales}\n\nLo encontré en: https://guiasports.com`;
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

  const eventosFiltrados = eventos.filter(e => {
    const coincideDeporte = filtroDeporte === "Todos" || e.deporte === filtroDeporte;
    const coincideFecha = filtroFecha === "Todos" || e.fecha === filtroFecha;
    const coincideBusqueda = e.evento.toLowerCase().includes(busqueda.toLowerCase()) || 
                             e.competicion.toLowerCase().includes(busqueda.toLowerCase());
    return coincideDeporte && coincideFecha && coincideBusqueda;
  });

  const eventosAgrupados = eventosFiltrados.reduce((groups: any, evento) => {
    const f = evento.fecha;
    if (!groups[f]) groups[f] = [];
    groups[f].push(evento);
    return groups;
  }, {});

  const formatearBotonFecha = (fStr: string) => {
    if (fStr === "Todos") return "📅 Todo";
    const fecha = new Date(fStr + 'T12:00:00');
    if (fStr === hoyStr) return "📍 Hoy";
    return fecha.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric' }).toUpperCase();
  };

  if (cargando) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center space-y-4">
      <Zap className="w-8 h-8 text-[#a3e635] animate-pulse" />
      <span className="text-[#a3e635] font-black tracking-widest uppercase text-[10px]">Actualizando GuíaSports...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-20">
      
      <header className="border-b border-slate-800 bg-[#020617]/95 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 pt-4">
          <div className="flex justify-between items-center mb-6">
            <Link href="/" className="transition-transform hover:scale-105 active:scale-95">
              <Image src="/logo.png" alt="GuíaSports" width={200} height={50} className="h-10 w-auto" priority />
            </Link>
            <div className="flex flex-col items-end">
              <div className="text-[10px] font-black text-[#a3e635] bg-[#a3e635]/10 px-2 py-1 rounded border border-[#a3e635]/20 uppercase tracking-widest italic mb-1">México</div>
              <div className="flex items-center gap-1.5 mr-1 text-[9px] font-bold text-slate-500 uppercase">
                <div className="w-1.5 h-1.5 bg-[#a3e635] rounded-full animate-pulse"></div>
                {ultimaAct}
              </div>
            </div>
          </div>

          {/* BUSCADOR */}
          <div className="relative mb-6 w-full px-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input type="text" placeholder="Busca equipos o ligas..." className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3 pl-11 pr-10 text-base focus:outline-none focus:border-[#a3e635] transition-all text-slate-200 placeholder:text-slate-600 shadow-inner" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            {busqueda && <button onClick={() => setBusqueda("")} className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-800 p-1 rounded-full text-slate-400"><X className="w-4 h-4" /></button>}
          </div>

          {/* FILTRO DE DEPORTES CON FLECHAS REALES */}
          <div className="relative flex items-center mb-4 group">
            <button onClick={() => scrollDeportes('left')} className="absolute left-0 z-10 p-1 bg-slate-900/80 border border-slate-700 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
              <ChevronLeft size={16} />
            </button>
            
            <div ref={scrollRef} className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide relative px-1 scroll-smooth">
              {deportesUnicos.map((dep: any) => (
                <button key={dep} onClick={() => setFiltroDeporte(dep)} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all whitespace-nowrap border uppercase tracking-wider ${filtroDeporte === dep ? "bg-blue-600 border-blue-500 text-white" : "bg-slate-900 border-slate-800 text-slate-400"}`}>
                  {emojis[dep] || "🏆"} {dep}
                </button>
              ))}
            </div>

            <button onClick={() => scrollDeportes('right')} className="absolute right-0 z-10 p-1 bg-slate-900/80 border border-slate-700 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
              <ChevronRight size={16} />
            </button>
            {/* Indicador de Swipe para móvil */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#020617] to-transparent pointer-events-none md:hidden" />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide border-t border-slate-900 pt-4">
            {fechasUnicas.map((f: any) => (
              <button key={f} onClick={() => setFiltroFecha(f)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all whitespace-nowrap uppercase tracking-widest ${filtroFecha === f ? "text-[#a3e635] bg-[#a3e635]/10 border-[#a3e635]/30 border" : "text-slate-500 border border-transparent"}`}>
                {formatearBotonFecha(f)}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* CONTENIDO EDITORIAL (Solo se oculta si el usuario busca algo específico para no estorbar) */}
        {!busqueda && (
          <>
            {/* DESTACADOS */}
            {destacados.length > 0 && filtroFecha === "Todos" && filtroDeporte === "Todos" && (
              <div className="mb-12">
                <h2 className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2"><Star className="w-3 h-3 fill-yellow-500" /> Imperdibles de Hoy</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
                  {destacados.map((e) => (
                    <div key={e.id} className="min-w-[280px] bg-gradient-to-br from-blue-600 to-blue-900 p-[1px] rounded-3xl">
                      <div className="bg-[#020617] p-5 rounded-[23px] h-full flex flex-col justify-between italic text-white">
                        <div>
                          <div className="text-[9px] font-black text-blue-400 uppercase mb-2">{e.competicion}</div>
                          <div className="text-lg font-black leading-tight mb-4 uppercase">{e.evento}</div>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                           <div className="flex items-center gap-2 font-mono font-bold"><Clock className="w-4 h-4 text-blue-400" /> {e.hora}</div>
                           <div className="text-[10px] font-black text-[#a3e635] bg-[#a3e635]/10 px-3 py-1 rounded-lg border border-[#a3e635]/20">{e.canales}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECCIÓN DE NOTICIAS / PREVIAS */}
            <div className="mb-12">
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] flex items-center gap-2">
                  <Newspaper className="w-3 h-3" /> Previas y Análisis
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-[32px] flex gap-4 items-center hover:bg-slate-800/50 transition-all cursor-pointer group">
                  <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex-shrink-0 flex items-center justify-center border border-blue-500/20">
                    <Trophy className="text-blue-500" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase italic leading-tight mb-1 text-slate-200 group-hover:text-white">Jamaica vs N. Caledonia: El partido que paraliza a México</h3>
                    <p className="text-[9px] text-slate-500 uppercase font-bold">Fútbol • 3 min lectura</p>
                  </div>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-[32px] flex gap-4 items-center hover:bg-slate-800/50 transition-all cursor-pointer group">
                  <div className="w-16 h-16 bg-[#a3e635]/10 rounded-2xl flex-shrink-0 flex items-center justify-center border border-[#a3e635]/20">
                    <Zap className="text-[#a3e635]" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase italic leading-tight mb-1 text-slate-200 group-hover:text-white">F1 2026: Guía completa para el Gran Premio de hoy</h3>
                    <p className="text-[9px] text-slate-500 uppercase font-bold">Automovilismo • 5 min lectura</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* LISTADO DE EVENTOS */}
        {Object.keys(eventosAgrupados).length > 0 ? (
          Object.keys(eventosAgrupados).sort().map((fecha) => (
            <section key={fecha} className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2"><CalendarDays className="w-4 h-4 text-blue-500" /> {new Date(fecha + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}</h2>
                <div className="h-px w-full bg-slate-800/30"></div>
              </div>
              <div className="grid gap-3">
                {eventosAgrupados[fecha].map((evento: any) => (
                  <div key={evento.id} className="group bg-slate-900/30 border border-slate-800/50 rounded-2xl p-4 hover:border-blue-500/30 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex flex-col items-center min-w-[90px]">
                        <div className="text-blue-400 font-mono font-black text-xl flex items-center gap-2"><Clock className="w-4 h-4 opacity-30" /> {evento.hora}</div>
                        {estaEnVivo(evento.fecha, evento.hora) && (
                          <div className="flex items-center gap-1 mt-1"><div className="w-2 h-2 bg-red-600 rounded-full animate-ping"></div><span className="text-[9px] font-black text-red-500 uppercase">En Vivo</span></div>
                        )}
                      </div>
                      <div className="flex-1 flex items-center gap-4">
                        <span className="text-4xl opacity-80">{emojis[evento.deporte] || "🏆"}</span>
                        <div>
                          <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{evento.competicion}</div>
                          <h3 className="text-[15px] font-bold text-slate-200 leading-tight">{evento.evento}</h3>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-3 bg-[#020617] px-4 py-2.5 rounded-xl border border-slate-800"><Tv className="w-4 h-4 text-slate-600" /><span className="text-[11px] font-black text-[#a3e635] italic uppercase">{evento.canales}</span></div>
                        <button onClick={() => compartirWhatsApp(evento)} className="p-3 bg-slate-800 rounded-xl hover:bg-emerald-600 transition-colors text-slate-400 hover:text-white"><Share2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="text-center py-20 flex flex-col items-center">
             <div className="bg-slate-900 p-4 rounded-full mb-4"><Filter className="w-8 h-8 text-slate-700" /></div>
             <p className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">Sin resultados</p>
          </div>
        )}
      </main>
    </div>
  );
}
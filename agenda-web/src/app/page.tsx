"use client";

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Tv, Calendar, Trophy, Clock, Zap, Filter, Star, Search, X, CalendarDays, Share2, ChevronLeft, ChevronRight, Newspaper } from 'lucide-react';
import Link from 'next/link';
import NextImage from 'next/image'; // Usamos NextImage para evitar conflictos

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

  // --- FUNCIÓN DE COMPARTIR (LA QUE FALTABA) ---
  const compartirWhatsApp = (e: any) => {
    const texto = `📺 *${e.evento}*\n🏆 ${e.competicion}\n⏰ ${e.hora}\n🔗 Canales: ${e.canales}\n\nLo vi en: https://guiasports.com`;
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
  };

  const scrollDeportes = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollTo = direction === 'left' ? scrollRef.current.scrollLeft - 150 : scrollRef.current.scrollLeft + 150;
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
    const dif = ahora.getTime() - horaEvento.getTime();
    return dif > 0 && dif < (2.5 * 60 * 60 * 1000);
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
    if (fStr === hoyStr) return "📍 Hoy";
    return new Date(fStr + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric' }).toUpperCase();
  };

  if (cargando) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
      <div className="relative w-24 h-24 mb-4">
        <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
        <NextImage src="/GuiaSports-logo.svg" alt="GuíaSports" width={100} height={100} className="relative z-10 animate-pulse object-contain" />
      </div>
      <span className="text-[#a3e635] font-black tracking-[0.3em] uppercase text-[10px]">GuíaSports</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-20">
      <header className="border-b border-slate-800 bg-[#020617]/95 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 pt-4">
          <div className="flex justify-between items-center mb-6">
            <Link href="/" className="transition-transform active:scale-95">
              <NextImage src="/GuiaSports-logo.svg" alt="GuíaSports" width={200} height={50} className="h-10 w-auto" priority />
            </Link>
            <div className="flex flex-col items-end">
              <div className="text-[10px] font-black text-[#a3e635] bg-[#a3e635]/10 px-2 py-1 rounded border border-[#a3e635]/20 uppercase italic mb-1 tracking-widest">México</div>
              <div className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-[#a3e635] rounded-full animate-pulse"></div> {ultimaAct}
              </div>
            </div>
          </div>

          <div className="relative mb-6 w-full px-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input type="text" placeholder="Busca equipos o ligas..." className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3 pl-11 pr-10 text-base focus:outline-none focus:border-[#a3e635] text-slate-200" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            {busqueda && <button onClick={() => setBusqueda("")} className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-800 p-1 rounded-full text-slate-400"><X className="w-4 h-4" /></button>}
          </div>

          <div className="relative flex items-center mb-4">
            <button onClick={() => scrollDeportes('left')} className="absolute left-0 z-20 p-1.5 bg-slate-900/90 border border-slate-700 rounded-full shadow-xl text-[#a3e635] backdrop-blur-sm active:scale-90 transition-all">
              <ChevronLeft size={18} strokeWidth={3} />
            </button>
            <div ref={scrollRef} className="flex gap-2 overflow-x-auto py-1 px-10 scrollbar-hide scroll-smooth w-full">
              {deportesUnicos.map((dep: any) => (
                <button key={dep} onClick={() => setFiltroDeporte(dep)} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all whitespace-nowrap border uppercase tracking-wider ${filtroDeporte === dep ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20" : "bg-slate-900 border-slate-800 text-slate-400"}`}>
                  {emojis[dep] || "🏆"} {dep}
                </button>
              ))}
            </div>
            <button onClick={() => scrollDeportes('right')} className="absolute right-0 z-20 p-1.5 bg-slate-900/90 border border-slate-700 rounded-full shadow-xl text-[#a3e635] backdrop-blur-sm active:scale-90 transition-all">
              <ChevronRight size={18} strokeWidth={3} />
            </button>
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
        {!busqueda && (
          <>
            {destacados.length > 0 && filtroFecha === "Todos" && filtroDeporte === "Todos" && (
              <div className="mb-12">
                <h2 className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2"><Star className="w-3 h-3 fill-yellow-500" /> Imperdibles de Hoy</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
                  {destacados.map((e) => (
                    <div key={e.id} className="min-w-[85vw] sm:min-w-[300px] bg-gradient-to-br from-blue-600 to-blue-900 p-[1px] rounded-3xl">
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

            <div className="mb-12">
              <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2"><Newspaper className="w-3 h-3" /> Previas y Análisis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-[32px] flex gap-4 items-center hover:bg-slate-800/50 transition-all cursor-pointer group">
                  <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex-shrink-0 flex items-center justify-center border border-blue-500/20"><Trophy className="text-blue-500" size={28} /></div>
                  <div><h3 className="text-xs font-black uppercase italic text-slate-200">Jamaica vs N. Caledonia: El morbo total</h3><p className="text-[9px] text-slate-500 uppercase font-bold mt-1">Fútbol • 3 min</p></div>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-[32px] flex gap-4 items-center hover:bg-slate-800/50 transition-all cursor-pointer group">
                  <div className="w-16 h-16 bg-[#a3e635]/10 rounded-2xl flex-shrink-0 flex items-center justify-center border border-[#a3e635]/20"><Zap className="text-[#a3e635]" size={28} /></div>
                  <div><h3 className="text-xs font-black uppercase italic text-slate-200">F1: Guía para el Gran Premio</h3><p className="text-[9px] text-slate-500 uppercase font-bold mt-1">Motores • 5 min</p></div>
                </div>
              </div>
            </div>
          </>
        )}

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
                      <div className="flex flex-col items-center min-w-[90px] text-blue-400 font-mono font-black text-xl">
                        <Clock className="w-4 h-4 opacity-30" /> {evento.hora}
                        {estaEnVivo(evento.fecha, evento.hora) && (
                          <div className="flex items-center gap-1 mt-1"><div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></div><span className="text-[8px] font-black text-red-500 uppercase">LIVE</span></div>
                        )}
                      </div>
                      <div className="flex-1 flex items-center gap-4">
                        <span className="text-4xl opacity-80">{emojis[evento.deporte] || "🏆"}</span>
                        <div><div className="text-[9px] font-black text-slate-500 uppercase mb-1">{evento.competicion}</div><h3 className="text-[15px] font-bold text-slate-200">{evento.evento}</h3></div>
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
             <p className="text-slate-500 uppercase font-black text-[10px]">Sin resultados</p>
          </div>
        )}
      </main>
    </div>
  );
}
"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Tv, Calendar, Trophy, Clock, Zap, Filter, Star, Search, X, CalendarDays } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const emojis: { [key: string]: string } = {
  "Fútbol": "⚽️", "Básquetbol": "🏀", "Béisbol": "⚾️", "Básquet": "🏀",
  "Fórmula 1": "🏎️", "F1": "🏎️", "Tenis": "🎾", "Fútbol Americano": "🏈",
  "NFL": "🏈", "Ciclismo": "🚴", "Boxeo": "🥊", "Golf": "⛳️"
};

const TOP_TEAMS = ["América", "Chivas", "Real Madrid", "Barcelona", "México", "F1", "NBA", "Champions", "Cruz Azul", "Pumas", "Selección"];

export default function Home() {
  const [eventos, setEventos] = useState<any[]>([]);
  const [filtroDeporte, setFiltroDeporte] = useState("Todos");
  const [filtroFecha, setFiltroFecha] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [ultimaAct, setUltimaAct] = useState("");

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

  // --- LÓGICA DE FILTRADO COMBINADO ---
  const hoyStr = new Date().toISOString().split('T')[0];
  
  const deportesUnicos = ["Todos", ...new Set(eventos.map(e => e.deporte))];
  const fechasUnicas = ["Todos", ...new Set(eventos.map(e => e.fecha))];

  const eventosFiltrados = eventos.filter(e => {
    const coincideDeporte = filtroDeporte === "Todos" || e.deporte === filtroDeporte;
    const coincideFecha = filtroFecha === "Todos" || e.fecha === filtroFecha;
    const coincideBusqueda = e.evento.toLowerCase().includes(busqueda.toLowerCase()) || 
                             e.competicion.toLowerCase().includes(busqueda.toLowerCase());
    return coincideDeporte && coincideFecha && coincideBusqueda;
  });

  const destacados = eventos.filter(e => e.fecha === hoyStr && TOP_TEAMS.some(t => e.evento.includes(t))).slice(0, 3);

  const eventosAgrupados = eventosFiltrados.reduce((groups: any, evento) => {
    const f = evento.fecha;
    if (!groups[f]) groups[f] = [];
    groups[f].push(evento);
    return groups;
  }, {});

  // Formateador de fecha para los botones (Ej: "HOY", "MAÑ 25", "VIE 27")
  const formatearBotonFecha = (fStr: string) => {
    if (fStr === "Todos") return "📅 Todo";
    const fecha = new Date(fStr + 'T12:00:00');
    if (fStr === hoyStr) return "📍 Hoy";
    return fecha.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric' }).toUpperCase();
  };

  if (cargando) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center space-y-4">
      <Zap className="w-8 h-8 text-blue-500 animate-pulse" />
      <span className="text-blue-500 font-black tracking-widest uppercase text-[10px]">Sincronizando...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-20">
      <header className="border-b border-slate-800 bg-[#020617]/95 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 pt-6">
          
          {/* LOGO Y STATUS */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg">
                  <Trophy className="text-white w-5 h-5" />
                </div>
                <h1 className="text-xl font-black tracking-tighter uppercase italic leading-none">
                  Agenda <span className="text-blue-500">Deportiva</span>
                </h1>
              </div>
              <div className="flex items-center gap-1.5 mt-1 ml-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Sincronizado: {ultimaAct}</span>
              </div>
            </div>
          </div>

          {/* BUSCADOR */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input 
              type="text"
              placeholder="Busca equipos (Ej: América, Real Madrid, Lakers...)"
              className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-all text-slate-200 placeholder:text-slate-600"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            {busqueda && (
              <button onClick={() => setBusqueda("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* FILTRO DE DEPORTES */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {deportesUnicos.map((dep: any) => (
              <button key={dep} onClick={() => setFiltroDeporte(dep)} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all whitespace-nowrap border uppercase tracking-wider ${filtroDeporte === dep ? "bg-blue-600 border-blue-500 text-white" : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"}`}>
                {emojis[dep] || "🏆"} {dep}
              </button>
            ))}
          </div>

          {/* SELECTOR DE FECHAS (TABS) */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide border-t border-slate-900 pt-4">
            {fechasUnicas.map((f: any) => (
              <button key={f} onClick={() => setFiltroFecha(f)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all whitespace-nowrap uppercase tracking-widest ${filtroFecha === f ? "text-blue-400 bg-blue-500/10 border-blue-500/30 border" : "text-slate-500 border border-transparent hover:text-slate-300"}`}>
                {formatearBotonFecha(f)}
              </button>
            ))}
          </div>

        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* DESTACADOS (Ocultar si se está buscando o filtrando fecha lejana) */}
        {!busqueda && filtroFecha === "Todos" && filtroDeporte === "Todos" && destacados.length > 0 && (
          <div className="mb-12">
            <h2 className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
              <Star className="w-3 h-3 fill-yellow-500" /> Imperdibles de Hoy
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {destacados.map((e) => (
                <div key={e.id} className="min-w-[280px] bg-gradient-to-br from-blue-600 to-blue-900 p-[1px] rounded-3xl">
                  <div className="bg-[#020617] p-5 rounded-[23px] h-full flex flex-col justify-between">
                    <div>
                      <div className="text-[9px] font-black text-blue-400 uppercase mb-2">{e.competicion}</div>
                      <div className="text-lg font-black leading-tight mb-4 italic uppercase">{e.evento}</div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                       <div className="flex items-center gap-2 text-white font-mono font-bold"><Clock className="w-4 h-4 text-blue-400" /> {e.hora}</div>
                       <div className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">{e.canales}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RESULTADOS AGRUPADOS */}
        {Object.keys(eventosAgrupados).length > 0 ? (
          Object.keys(eventosAgrupados).sort().map((fecha) => (
            <section key={fecha} className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-blue-500" />
                  {new Date(fecha + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h2>
                <div className="h-px w-full bg-slate-800/30"></div>
              </div>

              <div className="grid gap-3">
                {eventosAgrupados[fecha].map((evento: any) => (
                  <div key={evento.id} className="group bg-slate-900/30 border border-slate-800/50 rounded-2xl p-4 hover:border-blue-500/30 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-[90px]">
                        <div className="text-blue-400 font-mono font-black text-xl flex items-center gap-2">
                          <Clock className="w-4 h-4 opacity-30" /> {evento.hora}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{emojis[evento.deporte] || "🏆"} {evento.competicion}</div>
                        <h3 className="text-[15px] font-bold text-slate-200 leading-tight">{evento.evento}</h3>
                      </div>
                      <div className="flex items-center gap-3 bg-[#020617] px-4 py-2.5 rounded-xl border border-slate-800 group-hover:border-blue-900/50 transition-all">
                        <Tv className="w-4 h-4 text-slate-600" />
                        <span className="text-[11px] font-black text-emerald-500 italic uppercase">{evento.canales}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="text-center py-20 flex flex-col items-center">
             <div className="bg-slate-900 p-4 rounded-full mb-4">
               <Filter className="w-8 h-8 text-slate-700" />
             </div>
             <p className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">Sin resultados para tu búsqueda</p>
          </div>
        )}
      </main>
    </div>
  );
}
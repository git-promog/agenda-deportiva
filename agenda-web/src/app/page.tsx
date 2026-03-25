"use client"; // Esto permite que los botones funcionen

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Tv, Calendar, Trophy, Clock, Filter } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [eventos, setEventos] = useState<any[]>([]);
  const [filtro, setFiltro] = useState("Todos");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      const { data } = await supabase
        .from('eventos')
        .select('*')
        .order('fecha', { ascending: true })
        .order('hora', { ascending: true });
      
      if (data) setEventos(data);
      setCargando(false);
    }
    cargarDatos();
  }, []);

  // Obtener lista de deportes únicos para los botones de filtro
  const deportesDisponibles = ["Todos", ...new Set(eventos.map(e => e.competicion.split(' ')[0]))];

  // Filtrar eventos según el botón seleccionado
  const eventosFiltrados = filtro === "Todos" 
    ? eventos 
    : eventos.filter(e => e.competicion.includes(filtro));

  // Agrupar por fecha
  const eventosAgrupados = eventosFiltrados.reduce((groups: any, evento) => {
    const fecha = evento.fecha;
    if (!groups[fecha]) groups[fecha] = [];
    groups[fecha].push(evento);
    return groups;
  }, {});

  if (cargando) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-blue-500 font-bold">Cargando agenda...</div>;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans">
      <header className="border-b border-slate-800 bg-[#020617]/90 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-5">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Trophy className="text-white w-6 h-6" />
              </div>
              <h1 className="text-xl font-black tracking-tighter uppercase italic">
                Agenda <span className="text-blue-500">Deportiva</span>
              </h1>
            </div>
          </div>

          {/* FILTROS INTERACTIVOS */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {deportesDisponibles.slice(0, 8).map((dep) => (
              <button
                key={dep}
                onClick={() => setFiltro(dep)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
                  filtro === dep 
                  ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20" 
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600"
                }`}
              >
                {dep}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {Object.keys(eventosAgrupados).length > 0 ? (
          Object.keys(eventosAgrupados).sort().map((fecha) => (
            <section key={fecha} className="mb-10">
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                <Calendar className="w-4 h-4 text-blue-500" />
                {new Date(fecha + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
              </h2>

              <div className="grid gap-3">
                {eventosAgrupados[fecha].map((evento: any) => (
                  <div key={evento.id} className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-4 hover:bg-slate-800/40 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-[90px]">
                        <div className="text-blue-400 font-mono font-bold text-lg flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 opacity-50" />
                          {evento.hora}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1">{evento.competicion}</div>
                        <h3 className="text-md font-bold text-slate-200">{evento.evento}</h3>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
                        <Tv className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-xs font-bold text-emerald-400 italic">{evento.canales}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="text-center py-20 text-slate-500 uppercase tracking-widest text-xs">
            No hay eventos para este filtro.
          </div>
        )}
      </main>
    </div>
  );
}
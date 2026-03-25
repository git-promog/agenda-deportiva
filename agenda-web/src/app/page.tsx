"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Tv, Calendar, Trophy, Clock, Zap, Filter } from 'lucide-react'; // <-- IMPORTANTE: Filter agregado aquí

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- FUNCIÓN PARA CATEGORIZAR DEPORTES ---
function obtenerCategoria(competicion: string) {
  const c = competicion.toLowerCase();
  if (c.includes('nba') || c.includes('basquet') || c.includes('euroliga') || c.includes('cibacopa')) return "🏀 Básquet";
  if (c.includes('mlb') || c.includes('beisbol') || c.includes('lmb') || c.includes('lmp')) return "⚾️ Béisbol";
  if (c.includes('f1') || c.includes('fórmula 1') || c.includes('nascar') || c.includes('motogp')) return "🏎️ F1";
  if (c.includes('tenis') || c.includes('atp') || c.includes('wta') || c.includes('open')) return "🎾 Tenis";
  if (c.includes('nfl') || c.includes('ncaa football') || c.includes('lfa')) return "🏈 NFL";
  if (c.includes('vuelta') || c.includes('ciclis') || c.includes('giro') || c.includes('tour')) return "🚴 Ciclismo";
  if (c.includes('box') || c.includes('ufc') || c.includes('mma')) return "🥊 Combate";
  if (c.includes('golf')) return "⛳️ Golf";
  return "⚽️ Fútbol"; // Por defecto si no coincide nada
}

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
      
      if (data) {
        // Asignamos la categoría real a cada evento al cargar
        const eventosConCategoria = data.map(e => ({
          ...e,
          categoriaReal: obtenerCategoria(e.competicion)
        }));
        setEventos(eventosConCategoria);
      }
      setCargando(false);
    }
    cargarDatos();
  }, []);

  // Generar lista de categorías únicas basadas en nuestra lógica
  const categoriasUnicas = ["Todos", ...new Set(eventos.map(e => e.categoriaReal))];

  // Filtrar eventos
  const eventosFiltrados = filtro === "Todos" 
    ? eventos 
    : eventos.filter(e => e.categoriaReal === filtro);

  // Agrupar por fecha
  const eventosAgrupados = eventosFiltrados.reduce((groups: any, evento) => {
    const fecha = evento.fecha;
    if (!groups[fecha]) groups[fecha] = [];
    groups[fecha].push(evento);
    return groups;
  }, {});

  if (cargando) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center space-y-4">
      <Zap className="w-8 h-8 text-blue-500 animate-pulse" />
      <span className="text-blue-500 font-black tracking-widest uppercase text-xs">Cargando Agenda...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans">
      <header className="border-b border-slate-800 bg-[#020617]/95 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 pt-6 pb-4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-900/40">
                <Trophy className="text-white w-6 h-6" />
              </div>
              <h1 className="text-xl font-black tracking-tighter uppercase italic">
                Agenda <span className="text-blue-500">Deportiva</span>
              </h1>
            </div>
          </div>

          {/* CHIPS DE FILTROS MEJORADOS */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categoriasUnicas.map((cat: any) => (
              <button
                key={cat}
                onClick={() => setFiltro(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap border uppercase tracking-wider ${
                  filtro === cat 
                  ? "bg-blue-600 border-blue-500 text-white" 
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {Object.keys(eventosAgrupados).length > 0 ? (
          Object.keys(eventosAgrupados).sort().map((fecha) => (
            <section key={fecha} className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-[11px] font-black text-blue-500 uppercase tracking-[0.3em] whitespace-nowrap">
                  {new Date(fecha + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h2>
                <div className="h-px w-full bg-slate-800/50"></div>
              </div>

              <div className="grid gap-3">
                {eventosAgrupados[fecha].map((evento: any) => (
                  <div key={evento.id} className="group bg-slate-900/30 border border-slate-800/50 rounded-2xl p-4 hover:border-blue-500/30 transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-[90px]">
                        <div className="text-blue-400 font-mono font-black text-xl flex items-center gap-2">
                          <Clock className="w-4 h-4 opacity-30" />
                          {evento.hora}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{evento.competicion}</div>
                        <h3 className="text-[15px] font-bold text-slate-200 leading-tight">{evento.evento}</h3>
                      </div>
                      <div className="flex items-center gap-3 bg-[#020617] px-4 py-2.5 rounded-xl border border-slate-800 group-hover:border-blue-900/50">
                        <Tv className="w-4 h-4 text-slate-600" />
                        <span className="text-[11px] font-black text-emerald-500 italic uppercase">
                          {evento.canales}
                        </span>
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
             <p className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">No hay eventos para esta categoría hoy</p>
          </div>
        )}
      </main>
    </div>
  );
}
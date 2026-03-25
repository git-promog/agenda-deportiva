"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Tv, Calendar, Trophy, Clock, Zap, Filter } from 'lucide-react';
import Link from 'next/link'; // Aseguramos la importación de Link

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const emojis: { [key: string]: string } = {
  "Fútbol": "⚽️",
  "Básquetbol": "🏀",
  "Béisbol": "⚾️",
  "Básquet": "🏀",
  "Fórmula 1": "🏎️",
  "F1": "🏎️",
  "Tenis": "🎾",
  "Fútbol Americano": "🏈",
  "NFL": "🏈",
  "Ciclismo": "🚴",
  "Boxeo": "🥊",
  "Golf": "⛳️"
};

export default function Home() {
  const [eventos, setEventos] = useState<any[]>([]);
  const [filtro, setFiltro] = useState("Todos");
  const [cargando, setCargando] = useState(true);
  const [ultimaAct, setUltimaAct] = useState("");

  useEffect(() => {
    async function cargarDatos() {
      try {
        // 1. Cargar Eventos
        const { data: eventosData } = await supabase
          .from('eventos')
          .select('*')
          .order('fecha', { ascending: true })
          .order('hora', { ascending: true });
        
        // 2. Cargar Timestamp
        const { data: statusData } = await supabase
          .from('status')
          .select('valor')
          .eq('nombre', 'ultima_actualizacion')
          .maybeSingle(); // Usamos maybeSingle para evitar errores si no hay datos

        if (eventosData) setEventos(eventosData);
        if (statusData) setUltimaAct(statusData.valor);
      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
        setCargando(false);
      }
    }
    cargarDatos();
  }, []);

  const deportesUnicos = ["Todos", ...new Set(eventos.map(e => e.deporte))];

  const eventosFiltrados = filtro === "Todos" 
    ? eventos 
    : eventos.filter(e => e.deporte === filtro);

  const eventosAgrupados = eventosFiltrados.reduce((groups: any, evento) => {
    const fecha = evento.fecha;
    if (!groups[fecha]) groups[fecha] = [];
    groups[fecha].push(evento);
    return groups;
  }, {});

  if (cargando) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center space-y-4">
      <Zap className="w-8 h-8 text-blue-500 animate-pulse" />
      <span className="text-blue-500 font-black tracking-widest uppercase text-[10px]">Sincronizando Agenda...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans">
      <header className="border-b border-slate-800 bg-[#020617]/95 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 pt-6 pb-4">
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-900/40">
                  <Trophy className="text-white w-5 h-5" />
                </div>
                <h1 className="text-xl font-black tracking-tighter uppercase italic leading-none">
                  Agenda <span className="text-blue-500">Deportiva</span>
                </h1>
              </div>
              
              <div className="flex items-center gap-1.5 mt-1 ml-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                  Sincronizado: {ultimaAct || "Calculando..."}
                </span>
              </div>
            </div>
            
            <div className="text-[10px] font-black bg-blue-500/10 text-blue-500 px-2 py-1 rounded border border-blue-500/20 uppercase tracking-widest italic">
              México
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {deportesUnicos.map((dep: any) => (
              <button
                key={dep}
                onClick={() => setFiltro(dep)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all whitespace-nowrap border uppercase tracking-wider ${
                  filtro === dep 
                  ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/40" 
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                }`}
              >
                {emojis[dep] || "🏆"} {dep}
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
                  <div key={evento.id} className="group bg-slate-900/30 border border-slate-800/50 rounded-2xl p-4 hover:border-blue-500/30 hover:bg-slate-900/50 transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-[90px]">
                        <div className="text-blue-400 font-mono font-black text-xl flex items-center gap-2">
                          <Clock className="w-4 h-4 opacity-30" />
                          {evento.hora}
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                          {emojis[evento.deporte] || "🏆"} {evento.competicion}
                        </div>
                        <h3 className="text-[15px] font-bold text-slate-200 leading-tight group-hover:text-white">
                          {evento.evento}
                        </h3>
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
             <p className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">No hay eventos para esta categoría próximamente</p>
          </div>
        )}
      </main>
    </div>
  );
}
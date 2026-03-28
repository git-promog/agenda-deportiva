"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Trash2, Star, Plus, Edit3, Check, X, LogIn, Zap, LogOut, Search, AlertCircle } from 'lucide-react';
import NextImage from 'next/image'; // <-- USAMOS NEXTIMAGE SIEMPRE

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

export default function AdminPanel() {
  const [autenticado, setAutenticado] = useState(false);
  const [password, setPassword] = useState("");
  const [eventos, setEventos] = useState<any[]>([]);
  const [editando, setEditando] = useState<any>(null);
  const [filtroDeporte, setFiltroDeporte] = useState("Todos");
  const [filtroFecha, setFiltroFecha] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");

  const login = () => {
    if (password === "GUIA2024") setAutenticado(true);
    else alert("Contraseña incorrecta");
  };

  useEffect(() => {
    if (autenticado) cargarEventos();
  }, [autenticado]);

  async function cargarEventos() {
    const { data } = await supabase.from('eventos').select('*').order('fecha', { ascending: true }).order('hora', { ascending: true });
    if (data) setEventos(data);
  }

  const deportesUnicos = ["Todos", ...new Set(eventos.map(e => e.deporte))];
  const fechasUnicas = ["Todos", ...new Set(eventos.map(e => e.fecha))];

  const eventosFiltrados = eventos.filter(e => {
    const coincideDeporte = filtroDeporte === "Todos" || e.deporte === filtroDeporte;
    const coincideFecha = filtroFecha === "Todos" || e.fecha === filtroFecha;
    const coincideBusqueda = e.evento.toLowerCase().includes(busqueda.toLowerCase());
    return coincideDeporte && coincideFecha && coincideBusqueda;
  });

  // --- ACCIÓN MASIVA (Bulk Update) ---
  async function actualizarMasivo(valor: boolean | null) {
    const ids = eventosFiltrados.map(e => e.id);
    if (ids.length === 0) return;
    
    const confirmacion = confirm(`¿Quieres actualizar los ${ids.length} eventos filtrados a este estado?`);
    if (confirmacion) {
      await supabase.from('eventos').update({ destacado: valor }).in('id', ids);
      cargarEventos();
    }
  }

  async function eliminarEvento(id: string) {
    if (confirm("¿Borrar evento?")) {
      await supabase.from('eventos').delete().eq('id', id);
      cargarEventos();
    }
  }

  async function actualizarDestacado(id: string, valor: boolean | null) {
    await supabase.from('eventos').update({ destacado: valor }).eq('id', id);
    cargarEventos();
  }

  async function guardarCambios(e: React.FormEvent) {
    e.preventDefault();
    if (editando.id) await supabase.from('eventos').update(editando).eq('id', editando.id);
    else await supabase.from('eventos').insert([editando]);
    setEditando(null);
    cargarEventos();
  }

  if (!autenticado) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-white">
        <NextImage 
  src="/GuiaSports-logo.svg" 
  alt="GuíaSports" 
  width={120} 
  height={40} 
  className="mx-auto mb-6" 
/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black italic uppercase leading-none">Panel de <span className="text-blue-500">Control</span></h1>
          <div className="flex gap-3">
            <button onClick={() => setEditando({ evento: "", hora: "", canales: "", competicion: "", deporte: "Fútbol", fecha: new Date().toLocaleDateString('sv-SE'), destacado: null })} className="bg-blue-600 p-4 rounded-2xl font-black uppercase italic flex items-center gap-2 shadow-lg shadow-blue-900/30 transition-all active:scale-95"><Plus size={20} /> Nuevo</button>
            <button onClick={() => setAutenticado(false)} className="bg-slate-800 p-4 rounded-2xl text-slate-400 hover:text-white transition-all"><LogOut size={20} /></button>
          </div>
        </div>

        {/* HERRAMIENTAS DE FILTRO Y ACCIONES MASIVAS */}
        <div className="bg-slate-900/50 p-6 rounded-[32px] border border-slate-800 mb-8 space-y-6">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input type="text" placeholder="Filtrar por nombre para aplicar cambios masivos..." className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
           </div>
           
           <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-2 border-t border-slate-800/50">
              <div className="flex flex-col gap-2 w-full md:w-auto">
                <span className="text-[9px] font-black uppercase text-slate-500 ml-1">Filtros de Vista</span>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                   {deportesUnicos.map(d => (
                     <button key={d} onClick={() => setFiltroDeporte(d)} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all whitespace-nowrap ${filtroDeporte === d ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>{d}</button>
                   ))}
                </div>
              </div>

              {/* BARRA DE ACCIONES MASIVAS */}
              <div className="flex flex-col gap-2 w-full md:w-auto items-end">
                <span className="text-[9px] font-black uppercase text-yellow-500 mr-1 flex items-center gap-1"><AlertCircle size={10}/> Acciones para {eventosFiltrados.length} items</span>
                <div className="flex bg-slate-950/80 p-1 rounded-xl border border-yellow-500/20">
                   <button onClick={() => actualizarMasivo(null)} className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase text-slate-400 hover:bg-slate-800 flex items-center gap-1.5 transition-all"><Zap size={12}/> Auto</button>
                   <button onClick={() => actualizarMasivo(true)} className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase text-yellow-500 hover:bg-yellow-500/10 flex items-center gap-1.5 transition-all"><Star size={12} fill="currentColor"/> Forzar</button>
                   <button onClick={() => actualizarMasivo(false)} className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase text-red-500 hover:bg-red-500/10 flex items-center gap-1.5 transition-all"><X size={12}/> Ocultar</button>
                </div>
              </div>
           </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] overflow-x-auto shadow-2xl">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-950/50 text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-800">
                <th className="p-5 font-black">Fecha / Hora</th>
                <th className="p-5 font-black">Deporte / Evento</th>
                <th className="p-5 font-black">Canales</th>
                <th className="p-5 font-black text-center">Destacado</th>
                <th className="p-5 font-black text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {eventosFiltrados.map((e) => (
                <tr key={e.id} className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors">
                  <td className="p-5 text-xs font-mono">
                    <div className="text-blue-400 font-bold mb-1">{e.fecha}</div>
                    <div className="text-slate-500">{e.hora}</div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl" title={e.deporte}>{emojis[e.deporte] || "🏆"}</span>
                      <div><div className="font-bold text-sm leading-tight mb-1">{e.evento}</div><div className="text-[10px] text-slate-500 uppercase font-black">{e.competicion}</div></div>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="text-xs text-emerald-500 italic font-black bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/10">{e.canales}</span>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center justify-center bg-slate-950/50 rounded-xl p-1 w-fit mx-auto border border-slate-800 shadow-inner">
                      <button onClick={() => actualizarDestacado(e.id, null)} className={`p-2 rounded-lg transition-all ${e.destacado === null ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`} title="Automático"><Zap size={14} /></button>
                      <button onClick={() => actualizarDestacado(e.id, true)} className={`p-2 rounded-lg transition-all ${e.destacado === true ? 'bg-yellow-500 text-black shadow-lg' : 'text-slate-600 hover:text-yellow-500'}`} title="Forzar ON"><Star size={14} fill={e.destacado === true ? "currentColor" : "none"} /></button>
                      <button onClick={() => actualizarDestacado(e.id, false)} className={`p-2 rounded-lg transition-all ${e.destacado === false ? 'bg-red-500 text-white shadow-lg' : 'text-slate-600 hover:text-red-500'}`} title="Ocultar"><X size={14} /></button>
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditando(e)} className="p-2.5 bg-blue-600/10 text-blue-500 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-md"><Edit3 size={18} /></button>
                      <button onClick={() => eliminarEvento(e.id)} className="p-2.5 bg-red-600/10 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-md"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {editando && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <form onSubmit={guardarCambios} className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-center mb-8"><h2 className="text-2xl font-black italic uppercase">Editar Evento</h2><button type="button" onClick={() => setEditando(null)}><X size={24} /></button></div>
            <div className="grid gap-5">
              <input type="text" className="bg-slate-950 border border-slate-800 p-4 rounded-2xl w-full outline-none focus:border-blue-500" value={editando.evento} onChange={(e) => setEditando({...editando, evento: e.target.value})} required />
              <select className="bg-slate-950 border border-slate-800 p-4 rounded-2xl w-full outline-none focus:border-blue-500 text-white" value={editando.deporte} onChange={(e) => setEditando({...editando, deporte: e.target.value})}>
                  {Object.keys(emojis).sort().map(d => (<option key={d} value={d}>{emojis[d]} {d}</option>))}
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input type="date" className="bg-slate-950 border border-slate-800 p-4 rounded-2xl w-full outline-none" value={editando.fecha} onChange={(e) => setEditando({...editando, fecha: e.target.value})} required />
                <input type="text" className="bg-slate-950 border border-slate-800 p-4 rounded-2xl w-full outline-none" value={editando.hora} onChange={(e) => setEditando({...editando, hora: e.target.value})} required />
              </div>
              <input type="text" className="bg-slate-950 border border-slate-800 p-4 rounded-2xl w-full outline-none" value={editando.canales} onChange={(e) => setEditando({...editando, canales: e.target.value})} required />
              <input type="text" className="bg-slate-950 border border-slate-800 p-4 rounded-2xl w-full outline-none" value={editando.competicion} onChange={(e) => setEditando({...editando, competicion: e.target.value})} required />
              <button type="submit" className="bg-[#a3e635] text-black font-black p-5 rounded-2xl uppercase italic mt-4 hover:bg-[#b4f346] transition-all">Guardar Cambios</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
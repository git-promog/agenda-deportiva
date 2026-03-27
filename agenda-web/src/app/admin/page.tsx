"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Trash2, Star, Plus, Edit3, Check, X, LogIn, Zap, LogOut, Search } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPanel() {
  const [autenticado, setAutenticado] = useState(false);
  const [password, setPassword] = useState("");
  const [eventos, setEventos] = useState<any[]>([]);
  const [editando, setEditando] = useState<any>(null);
  
  // Estados para Filtros en Admin
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
    const { data } = await supabase.from('eventos').select('*').order('fecha', { ascending: false }).order('hora', { ascending: false });
    if (data) setEventos(data);
  }

  // Lógica de Filtrado para la Tabla
  const deportesUnicos = ["Todos", ...new Set(eventos.map(e => e.deporte))];
  const fechasUnicas = ["Todos", ...new Set(eventos.map(e => e.fecha))];

  const eventosFiltrados = eventos.filter(e => {
    const coincideDeporte = filtroDeporte === "Todos" || e.deporte === filtroDeporte;
    const coincideFecha = filtroFecha === "Todos" || e.fecha === filtroFecha;
    const coincideBusqueda = e.evento.toLowerCase().includes(busqueda.toLowerCase());
    return coincideDeporte && coincideFecha && coincideBusqueda;
  });

  async function eliminarEvento(id: string) {
    if (confirm("¿Seguro que quieres borrar este evento?")) {
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
    if (editando.id) {
      await supabase.from('eventos').update(editando).eq('id', editando.id);
    } else {
      await supabase.from('eventos').insert([editando]);
    }
    setEditando(null);
    cargarEventos();
  }

  if (!autenticado) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-white font-sans">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-10 rounded-[40px] text-center shadow-2xl">
          <LogIn className="mx-auto mb-6 text-[#a3e635]" size={48} />
          <h1 className="text-2xl font-black italic uppercase mb-2">GuíaSports <span className="text-xs opacity-50 block">Admin</span></h1>
          <input type="password" placeholder="Contraseña" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 mb-4 text-center outline-none" onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && login()} />
          <button onClick={login} className="w-full bg-[#a3e635] text-black font-black p-4 rounded-2xl uppercase italic">Entrar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <h1 className="text-3xl font-black italic uppercase">Panel de <span className="text-blue-500">Control</span></h1>
          <div className="flex gap-3">
            <button onClick={() => setEditando({ evento: "", hora: "", canales: "", competicion: "", deporte: "Fútbol", fecha: new Date().toISOString().split('T')[0], destacado: null })} className="bg-blue-600 p-4 rounded-2xl font-black uppercase italic flex items-center gap-2"><Plus size={20} /> Nuevo</button>
            <button onClick={() => setAutenticado(false)} className="bg-slate-800 p-4 rounded-2xl text-slate-400"><LogOut size={20} /></button>
          </div>
        </div>

        {/* FILTROS EN ADMIN */}
        <div className="bg-slate-900/50 p-6 rounded-[32px] border border-slate-800 mb-8 space-y-4">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input type="text" placeholder="Filtrar por nombre..." className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
           </div>
           <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {deportesUnicos.map(d => (
                <button key={d} onClick={() => setFiltroDeporte(d)} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${filtroDeporte === d ? 'bg-blue-600 border-blue-500' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>{d}</button>
              ))}
           </div>
           <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {fechasUnicas.slice(0, 10).map(f => (
                <button key={f} onClick={() => setFiltroFecha(f)} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${filtroFecha === f ? 'bg-emerald-600 border-emerald-500' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>{f === "Todos" ? "Todas las Fechas" : f}</button>
              ))}
           </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-950/50 text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-800">
                <th className="p-5">Fecha/Hora</th>
                <th className="p-5">Evento</th>
                <th className="p-5">Canales</th>
                <th className="p-5 text-center">Destacado</th>
                <th className="p-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {eventosFiltrados.map((e) => (
                <tr key={e.id} className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors">
                  <td className="p-5 text-xs font-mono"><div className="text-blue-400 font-bold">{e.fecha}</div><div>{e.hora}</div></td>
                  <td className="p-5"><div className="font-bold text-sm">{e.evento}</div><div className="text-[10px] text-slate-500 uppercase">{e.competicion}</div></td>
                  <td className="p-5"><span className="text-xs text-emerald-500 italic font-black bg-emerald-500/10 px-2 py-1 rounded-md">{e.canales}</span></td>
                  <td className="p-5">
                    <div className="flex items-center justify-center bg-slate-950/50 rounded-xl p-1 w-fit mx-auto border border-slate-800">
                      <button onClick={() => actualizarDestacado(e.id, null)} className={`p-2 rounded-lg ${e.destacado === null ? 'bg-slate-700 text-white' : 'text-slate-600'}`} title="Auto"><Zap size={14} /></button>
                      <button onClick={() => actualizarDestacado(e.id, true)} className={`p-2 rounded-lg ${e.destacado === true ? 'bg-yellow-500 text-black' : 'text-slate-600'}`} title="ON"><Star size={14} fill={e.destacado === true ? "currentColor" : "none"} /></button>
                      <button onClick={() => actualizarDestacado(e.id, false)} className={`p-2 rounded-lg ${e.destacado === false ? 'bg-red-500 text-white' : 'text-slate-600'}`} title="OFF"><X size={14} /></button>
                    </div>
                  </td>
                  <td className="p-5 text-right flex justify-end gap-2">
                      <button onClick={() => setEditando(e)} className="p-2.5 bg-blue-600/10 text-blue-500 rounded-xl"><Edit3 size={18} /></button>
                      <button onClick={() => eliminarEvento(e.id)} className="p-2.5 bg-red-600/10 text-red-500 rounded-xl"><Trash2 size={18} /></button>
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
          <form onSubmit={guardarCambios} className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] max-w-lg w-full">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black italic uppercase">Editar Evento</h2>
              <button type="button" onClick={() => setEditando(null)}><X size={24} /></button>
            </div>
            <div className="grid gap-5">
              <input type="text" placeholder="Evento" className="bg-slate-950 border border-slate-800 p-4 rounded-2xl w-full outline-none" value={editando.evento} onChange={(e) => setEditando({...editando, evento: e.target.value})} required />
              <div className="grid grid-cols-2 gap-4">
                <input type="date" className="bg-slate-950 border border-slate-800 p-4 rounded-2xl outline-none" value={editando.fecha} onChange={(e) => setEditando({...editando, fecha: e.target.value})} required />
                <input type="text" placeholder="Hora" className="bg-slate-950 border border-slate-800 p-4 rounded-2xl outline-none" value={editando.hora} onChange={(e) => setEditando({...editando, hora: e.target.value})} required />
              </div>
              <input type="text" placeholder="Canales" className="bg-slate-950 border border-slate-800 p-4 rounded-2xl w-full outline-none" value={editando.canales} onChange={(e) => setEditando({...editando, canales: e.target.value})} required />
              <input type="text" placeholder="Competición" className="bg-slate-950 border border-slate-800 p-4 rounded-2xl w-full outline-none" value={editando.competicion} onChange={(e) => setEditando({...editando, competicion: e.target.value})} required />
              <button type="submit" className="bg-[#a3e635] text-black font-black p-5 rounded-2xl uppercase italic mt-4"><Check size={20} /> Guardar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
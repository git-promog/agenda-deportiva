"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Trash2, Star, Plus, Edit3, Check, X, LogIn, Zap, LogOut } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPanel() {
  const [autenticado, setAutenticado] = useState(false);
  const [password, setPassword] = useState("");
  const [eventos, setEventos] = useState<any[]>([]);
  const [editando, setEditando] = useState<any>(null);

  const login = () => {
    // CAMBIA "GUIA2024" POR TU CONTRASEÑA REAL
    if (password === "GUIA2024") setAutenticado(true);
    else alert("Contraseña incorrecta");
  };

  useEffect(() => {
    if (autenticado) cargarEventos();
  }, [autenticado]);

  async function cargarEventos() {
    const { data } = await supabase
      .from('eventos')
      .select('*')
      .order('fecha', { ascending: false })
      .order('hora', { ascending: false });
    if (data) setEventos(data);
  }

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
          <h1 className="text-2xl font-black italic uppercase mb-2">GuíaSports</h1>
          <p className="text-slate-500 text-xs uppercase tracking-widest mb-8">Panel de Administración</p>
          <input 
            type="password" 
            placeholder="Contraseña"
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 mb-4 text-center focus:border-[#a3e635] outline-none transition-all"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && login()}
          />
          <button onClick={login} className="w-full bg-[#a3e635] text-black font-black p-4 rounded-2xl uppercase italic hover:bg-[#b4f346] transition-all">Entrar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black italic uppercase leading-none">Panel de <span className="text-blue-500">Control</span></h1>
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.3em] mt-2">Gestiona los eventos de GuíaSports</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setEditando({ evento: "", hora: "", canales: "", competicion: "", deporte: "Fútbol", fecha: new Date().toISOString().split('T')[0], destacado: null })}
              className="bg-blue-600 hover:bg-blue-500 p-4 rounded-2xl font-black uppercase italic flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20"
            >
              <Plus size={20} /> Nuevo Evento
            </button>
            <button onClick={() => setAutenticado(false)} className="bg-slate-800 p-4 rounded-2xl text-slate-400 hover:text-white transition-all">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] overflow-x-auto backdrop-blur-sm">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-950/50 text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-800">
                <th className="p-5 font-black">Fecha / Hora</th>
                <th className="p-5 font-black">Evento / Liga</th>
                <th className="p-5 font-black">Canales</th>
                <th className="p-5 font-black text-center">Destacado (Híbrido)</th>
                <th className="p-5 font-black text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {eventos.map((e) => (
                <tr key={e.id} className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors">
                  <td className="p-5 text-xs font-mono">
                    <div className="text-blue-400 font-bold mb-1">{e.fecha}</div>
                    <div className="text-slate-300">{e.hora}</div>
                  </td>
                  <td className="p-5">
                    <div className="font-bold text-sm mb-1">{e.evento}</div>
                    <div className="text-[10px] text-slate-500 uppercase font-black">{e.competicion}</div>
                  </td>
                  <td className="p-5">
                    <span className="text-xs text-emerald-500 italic font-black bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/10">
                      {e.canales}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center justify-center bg-slate-950/50 rounded-xl p-1 w-fit mx-auto border border-slate-800">
                      {/* AUTO */}
                      <button onClick={() => actualizarDestacado(e.id, null)} className={`p-2 rounded-lg transition-all ${e.destacado === null ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`} title="Automático">
                        <Zap size={14} />
                      </button>
                      {/* FORZAR ON */}
                      <button onClick={() => actualizarDestacado(e.id, true)} className={`p-2 rounded-lg transition-all ${e.destacado === true ? 'bg-yellow-500 text-black shadow-lg' : 'text-slate-600 hover:text-yellow-500'}`} title="Forzar Carrusel">
                        <Star size={14} fill={e.destacado === true ? "currentColor" : "none"} />
                      </button>
                      {/* FORZAR OFF */}
                      <button onClick={() => actualizarDestacado(e.id, false)} className={`p-2 rounded-lg transition-all ${e.destacado === false ? 'bg-red-500 text-white shadow-lg' : 'text-slate-600 hover:text-red-500'}`} title="Ocultar Carrusel">
                        <X size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditando(e)} className="p-2.5 bg-blue-600/10 text-blue-500 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Edit3 size={18} /></button>
                      <button onClick={() => eliminarEvento(e.id)} className="p-2.5 bg-red-600/10 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={18} /></button>
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
          <form onSubmit={guardarCambios} className="bg-slate-900 border border-slate-800 p-8 md:p-10 rounded-[40px] max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black italic uppercase">{editando.id ? 'Editar' : 'Nuevo'} Evento</h2>
              <button type="button" onClick={() => setEditando(null)} className="text-slate-500 hover:text-white"><X size={24} /></button>
            </div>
            
            <div className="grid gap-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Nombre del Evento</label>
                <input type="text" placeholder="Ej: Real Madrid vs Barcelona" className="bg-slate-950 border border-slate-800 p-4 rounded-2xl w-full outline-none focus:border-blue-500" value={editando.evento} onChange={(e) => setEditando({...editando, evento: e.target.value})} required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Fecha</label>
                  <input type="date" className="bg-slate-950 border border-slate-800 p-4 rounded-2xl w-full outline-none focus:border-blue-500" value={editando.fecha} onChange={(e) => setEditando({...editando, fecha: e.target.value})} required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Hora</label>
                  <input type="text" placeholder="Ej: 14:00" className="bg-slate-950 border border-slate-800 p-4 rounded-2xl w-full outline-none focus:border-blue-500" value={editando.hora} onChange={(e) => setEditando({...editando, hora: e.target.value})} required />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Canales de Transmisión</label>
                <input type="text" placeholder="Ej: Canal 5, ViX+, Sky Sports" className="bg-slate-950 border border-slate-800 p-4 rounded-2xl w-full outline-none focus:border-blue-500 text-emerald-500 font-bold" value={editando.canales} onChange={(e) => setEditando({...editando, canales: e.target.value})} required />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Liga / Competición</label>
                <input type="text" placeholder="Ej: Champions League" className="bg-slate-950 border border-slate-800 p-4 rounded-2xl w-full outline-none focus:border-blue-500" value={editando.competicion} onChange={(e) => setEditando({...editando, competicion: e.target.value})} required />
              </div>
              
              <button type="submit" className="bg-[#a3e635] text-black font-black p-5 rounded-2xl uppercase italic mt-4 flex items-center justify-center gap-2 hover:bg-[#b4f346] transition-all shadow-lg shadow-lime-900/20">
                <Check size={20} /> {editando.id ? 'Guardar Cambios' : 'Crear Evento'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
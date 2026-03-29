"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Trash2, Star, Plus, Edit3, Check, X, LogIn, Zap, LogOut, Search, AlertCircle, Newspaper, CalendarDays, ImageIcon } from 'lucide-react';
import NextImage from 'next/image';

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
  const [tab, setTab] = useState<'eventos' | 'noticias'>('eventos');
  
  // Estados para Eventos
  const [eventos, setEventos] = useState<any[]>([]);
  const [editando, setEditando] = useState<any>(null);
  const [filtroDeporte, setFiltroDeporte] = useState("Todos");
  const [filtroFecha, setFiltroFecha] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  
  // Estados para Noticias
  const [noticias, setNoticias] = useState<any[]>([]);
  const [isNoticiaModalOpen, setIsNoticiaModalOpen] = useState(false);
  const [editandoNoticia, setEditandoNoticia] = useState<any>({ titulo: "", contenido: "", imagen_url: "", fecha: "" });

  const login = () => {
    if (password === "GUIA2024") setAutenticado(true);
    else alert("Contraseña incorrecta");
  };

  useEffect(() => {
    if (autenticado) {
      cargarEventos();
      cargarNoticias();
    }
  }, [autenticado]);

  async function cargarEventos() {
    const { data } = await supabase.from('eventos').select('*').order('fecha', { ascending: true }).order('hora', { ascending: true });
    if (data) setEventos(data);
  }

  async function cargarNoticias() {
    const { data } = await supabase.from('noticias').select('*').order('fecha', { ascending: false });
    if (data) setNoticias(data);
  }

  // --- LOGICA EVENTOS ---
  const deportesUnicos = ["Todos", ...new Set(eventos.map(e => e.deporte))];
  const fechasUnicas = ["Todos", ...new Set(eventos.map(e => e.fecha))];

  const eventosFiltrados = eventos.filter(e => {
    const coincideDeporte = filtroDeporte === "Todos" || e.deporte === filtroDeporte;
    const coincideFecha = filtroFecha === "Todos" || e.fecha === filtroFecha;
    const coincideBusqueda = e.evento.toLowerCase().includes(busqueda.toLowerCase());
    return coincideDeporte && coincideFecha && coincideBusqueda;
  });

  async function eliminarEvento(id: string) {
    if (confirm("¿Borrar evento?")) { await supabase.from('eventos').delete().eq('id', id); cargarEventos(); }
  }

  async function actualizarDestacado(id: string, valor: boolean | null) {
    await supabase.from('eventos').update({ destacado: valor }).eq('id', id);
    cargarEventos();
  }

  async function guardarEvento(e: React.FormEvent) {
    e.preventDefault();
    if (editando.id) await supabase.from('eventos').update(editando).eq('id', editando.id);
    else await supabase.from('eventos').insert([editando]);
    setEditando(null); cargarEventos();
  }

  // --- LOGICA NOTICIAS ---
  function abrirModalNoticia(noticia?: any) {
    if (noticia) {
      setEditandoNoticia(noticia);
    } else {
      setEditandoNoticia({ titulo: "", contenido: "", imagen_url: "", fecha: new Date().toISOString().split('T')[0] });
    }
    setIsNoticiaModalOpen(true);
  }

  function cerrarModalNoticia() {
    setIsNoticiaModalOpen(false);
    setEditandoNoticia({ titulo: "", contenido: "", imagen_url: "", fecha: "" });
  }

  async function guardarNoticia(e: React.FormEvent) {
    e.preventDefault();
    // Generar slug robusto
    const slug = editandoNoticia.titulo
      .toLowerCase()
      .trim()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quitar acentos
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    const noticiaParaSubir = { ...editandoNoticia, slug };

    let res;
    if (editandoNoticia.id) res = await supabase.from('noticias').update(noticiaParaSubir).eq('id', editandoNoticia.id);
    else res = await supabase.from('noticias').insert([noticiaParaSubir]);

    if (res.error) alert("Error: " + res.error.message);
    else { cerrarModalNoticia(); cargarNoticias(); }
  }

  async function eliminarNoticia(id: string) {
    if (confirm("¿Borrar noticia permanentemente?")) { await supabase.from('noticias').delete().eq('id', id); cargarNoticias(); }
  }

  if (!autenticado) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-white">
        <div className="max-w-md w-full bg-[#0f172a] shadow-2xl border border-slate-800 p-10 rounded-[40px] text-center">
          <NextImage src="/GuiaSports-logo.svg" alt="GuíaSports" width={180} height={60} className="mx-auto mb-8" />
          <h1 className="text-xl font-black uppercase mb-6 text-slate-300">Acceso Restringido</h1>
          <input type="password" placeholder="Contraseña de Admin" className="w-full bg-[#020617] border border-slate-800 rounded-2xl p-4 mb-6 text-center text-white outline-none focus:border-[#a3e635] shadow-inner" onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && login()} />
          <button onClick={login} className="w-full bg-[#a3e635] hover:bg-[#86c523] transition-colors text-black font-black p-4 rounded-2xl uppercase italic shadow-lg">Comenzar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER ADMIN */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <NextImage src="/GuiaSports-logo.svg" alt="GuíaSports" width={140} height={40} />
          <div className="flex bg-slate-900 overflow-hidden rounded-2xl border border-slate-800 shadow-xl">
            <button onClick={() => setTab('eventos')} className={`px-8 py-3 text-xs font-black uppercase transition-all ${tab === 'eventos' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}>Agenda</button>
            <button onClick={() => setTab('noticias')} className={`px-8 py-3 text-xs font-black uppercase transition-all ${tab === 'noticias' ? 'bg-[#a3e635] text-black' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}>Noticias (SEO)</button>
          </div>
          <button onClick={() => setAutenticado(false)} className="bg-slate-800 p-3 rounded-xl text-slate-400 hover:text-white hover:bg-red-600/80 transition-colors"><LogOut size={20} /></button>
        </div>

        {/* TAB EVENTOS */}
        {tab === 'eventos' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900/40 p-6 rounded-3xl border border-slate-800">
               <h2 className="text-xl font-black italic uppercase">Gestión de <span className="text-blue-500">Partidos</span></h2>
               <button onClick={() => setEditando({ evento: "", hora: "", canales: "", competicion: "", deporte: "Fútbol", fecha: new Date().toLocaleDateString('sv-SE'), destacado: null })} className="bg-blue-600 hover:bg-blue-500 transition-colors p-3 px-6 rounded-xl text-xs font-black uppercase italic flex items-center gap-2 shadow-lg shadow-blue-900/20"><Plus size={16}/> Añadir Evento Manual</button>
            </div>
            
            {/* FILTROS RECUPERADOS */}
            <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-[32px] border border-slate-800 mb-8 space-y-4 shadow-xl">
               <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16}/><input type="text" placeholder="Buscar torneo o equipo..." className="w-full bg-[#020617] border border-slate-800 p-4 pl-12 rounded-2xl outline-none focus:border-blue-500 transition-colors shadow-inner" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} /></div>
               <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {deportesUnicos.map(d => (
                    <button key={d} onClick={() => setFiltroDeporte(d)} className={`px-4 py-2 rounded-xl text-[10px] font-bold border transition-all whitespace-nowrap ${filtroDeporte === d ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/40' : 'bg-slate-800 border-slate-700 text-slate-500 hover:bg-slate-700'}`}>{emojis[d] || ""} {d}</button>
                  ))}
               </div>
               <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {fechasUnicas.map(f => (
                    <button key={f} onClick={() => setFiltroFecha(f)} className={`px-4 py-2 rounded-xl text-[10px] font-bold border transition-all whitespace-nowrap uppercase tracking-wider ${filtroFecha === f ? 'bg-[#a3e635] border-[#a3e635] text-black shadow-lg' : 'bg-[#020617] border-slate-800 text-slate-500 hover:bg-slate-800'}`}>{f === "Todos" ? "Todas" : f}</button>
                  ))}
               </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                  <thead className="text-[10px] uppercase text-slate-400 border-b border-slate-800 font-black bg-slate-950/80"><tr className=""><th className="p-6">Fecha/Hora</th><th className="p-6">Evento</th><th className="p-6">Canales</th><th className="p-6 text-center">Destacar</th><th className="p-6 text-right">Acciones</th></tr></thead>
                  <tbody>
                    {eventosFiltrados.map(e => (
                      <tr key={e.id} className="border-b border-slate-800/30 hover:bg-slate-800/40 transition-colors">
                        <td className="p-6 text-xs font-mono"><div className="text-blue-400 font-bold bg-blue-900/20 w-fit px-2 py-1 rounded inline-block mb-1">{e.fecha}</div><div className="text-slate-300 font-bold ml-1">{e.hora}</div></td>
                        <td className="p-6 flex items-center gap-4"><div className="bg-[#020617] border border-slate-800 w-12 h-12 flex flex-col justify-center items-center rounded-2xl shadow-inner text-2xl">{emojis[e.deporte] || "🏆"}</div><div><div className="font-bold text-sm text-white mb-1">{e.evento}</div><div className="text-[9px] uppercase text-slate-500 font-black tracking-widest">{e.competicion}</div></div></td>
                        <td className="p-6"><span className="text-[10px] text-[#a3e635] font-black italic bg-[#a3e635]/10 px-3 py-1.5 rounded-lg border border-[#a3e635]/20">{e.canales}</span></td>
                        <td className="p-6 text-center">
                          <div className="flex justify-center bg-[#020617] p-1.5 rounded-xl w-fit mx-auto border border-slate-800 shadow-inner">
                            <button onClick={() => actualizarDestacado(e.id, null)} className={`p-2 rounded-lg transition-colors ${e.destacado === null ? 'bg-slate-800 text-white shadow' : 'text-slate-600 hover:text-slate-400'}`}><Zap size={14}/></button>
                            <button onClick={() => actualizarDestacado(e.id, true)} className={`p-2 rounded-lg transition-colors ${e.destacado === true ? 'bg-yellow-500/20 text-yellow-500 shadow' : 'text-slate-600 hover:text-slate-400'}`}><Star size={14} fill={e.destacado === true ? "currentColor" : "none"}/></button>
                            <button onClick={() => actualizarDestacado(e.id, false)} className={`p-2 rounded-lg transition-colors ${e.destacado === false ? 'bg-red-500/20 text-red-500 shadow' : 'text-slate-600 hover:text-slate-400'}`}><X size={14}/></button>
                          </div>
                        </td>
                        <td className="p-6 text-right"><div className="flex justify-end gap-3"><button onClick={() => setEditando(e)} className="p-2.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 rounded-xl transition-colors"><Edit3 size={18}/></button><button onClick={() => eliminarEvento(e.id)} className="p-2.5 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-xl transition-colors"><Trash2 size={18}/></button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB NOTICIAS */}
        {tab === 'noticias' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900/40 p-6 rounded-3xl border border-slate-800 shadow-lg">
               <h2 className="text-xl font-black italic uppercase">Gestor de <span className="text-[#a3e635]">Noticias SEO</span></h2>
               <button onClick={() => abrirModalNoticia()} className="bg-[#a3e635] hover:bg-[#86c523] text-black p-3 px-6 rounded-xl text-xs font-black uppercase italic flex items-center gap-2 shadow-lg shadow-[#a3e635]/20 transition-all active:scale-95"><Plus size={16}/> Redactar Noticia</button>
            </div>
            
            {noticias.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-12 text-center text-slate-500 flex flex-col items-center">
                <Newspaper size={48} className="mb-4 opacity-50" />
                <p className="font-bold text-lg mb-2 text-slate-400">No hay noticias publicadas</p>
                <p className="text-sm">Las noticias generan URLs dinámicas que ayudan al SEO de la web.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {noticias.map(n => (
                  <div key={n.id} className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 p-6 rounded-[32px] flex flex-col justify-between shadow-xl hover:border-slate-700 transition-colors group">
                    <div>
                      <div className="flex items-center gap-2 text-[10px] text-[#a3e635] font-black uppercase tracking-widest mb-3 bg-[#a3e635]/10 w-fit px-3 py-1.5 rounded-lg">
                        <CalendarDays size={12} /> {n.fecha}
                      </div>
                      <h3 className="font-black italic uppercase text-lg leading-tight mb-4 text-white group-hover:text-blue-400 transition-colors">{n.titulo}</h3>
                      {n.imagen_url && (
                        <div className="w-full h-32 rounded-2xl overflow-hidden mb-4 border border-slate-800">
                          <img src={n.imagen_url} className="w-full h-full object-cover" alt="Portada" />
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end gap-3 border-t border-slate-800/80 pt-5 mt-2">
                      <button onClick={() => abrirModalNoticia(n)} className="p-3 bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 rounded-xl transition-colors font-bold text-xs uppercase flex items-center gap-2"><Edit3 size={14}/> Editar</button>
                      <button onClick={() => eliminarNoticia(n.id)} className="p-3 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-xl transition-colors"><Trash2 size={16}/></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL NOTICIA (CON TODOS LOS CAMPOS) */}
      {isNoticiaModalOpen && (
        <div className="fixed inset-0 bg-[#020617]/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 z-50">
          <form onSubmit={guardarNoticia} className="bg-slate-900 border border-slate-800 p-8 md:p-10 rounded-[40px] max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col relative">
            
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-800">
              <h2 className="text-2xl font-black italic uppercase flex items-center gap-3">
                <Newspaper className="text-[#a3e635]" /> 
                {editandoNoticia.id ? "Editar Noticia" : "Redactar Nueva Previa"}
              </h2>
              <button type="button" onClick={cerrarModalNoticia} className="bg-slate-800 hover:bg-slate-700 p-2 rounded-full transition-colors"><X size={20}/></button>
            </div>
            
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Fecha de Publicación</label>
                  <input type="date" className="w-full bg-[#020617] border border-slate-800 p-4 rounded-2xl outline-none text-white focus:border-blue-500 transition-colors shadow-inner font-mono" value={editandoNoticia.fecha} onChange={(e) => setEditandoNoticia({...editandoNoticia, fecha: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Enlace Imagen de Portada</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18}/>
                    <input type="text" placeholder="https://ejemplo.com/foto.jpg" className="w-full bg-[#020617] border border-slate-800 p-4 pl-12 rounded-2xl outline-none text-white focus:border-blue-500 transition-colors shadow-inner" value={editandoNoticia.imagen_url} onChange={(e) => setEditandoNoticia({...editandoNoticia, imagen_url: e.target.value})} />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#a3e635] ml-1">Título de la Previa / Artículo (Titular SEO)</label>
                <input type="text" placeholder="Ej: Dónde ver el Super Clásico: América vs Chivas..." className="w-full bg-[#020617] border border-slate-800 p-5 rounded-3xl outline-none focus:border-[#a3e635] text-white font-bold text-lg transition-colors shadow-inner" value={editandoNoticia.titulo} onChange={(e) => setEditandoNoticia({...editandoNoticia, titulo: e.target.value})} required />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Cuerpo del artículo (Puedes usar saltos de línea)</label>
                <textarea rows={12} placeholder="Escribe aquí toda la información, análisis y horarios..." className="w-full bg-[#020617] border border-slate-800 p-6 rounded-3xl outline-none focus:border-blue-500 text-sm leading-relaxed text-slate-300 transition-colors shadow-inner resize-none" value={editandoNoticia.contenido} onChange={(e) => setEditandoNoticia({...editandoNoticia, contenido: e.target.value})} required />
              </div>
              
              <div className="mt-4 pt-6 border-t border-slate-800 flex justify-end gap-4">
                <button type="button" onClick={cerrarModalNoticia} className="bg-transparent border border-slate-700 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-2xl transition-all">Cancelar</button>
                <button type="submit" className="bg-[#a3e635] hover:bg-[#86c523] text-black font-black px-10 py-4 rounded-2xl uppercase italic shadow-lg hover:shadow-[#a3e635]/20 flex items-center gap-2 transition-all">
                  <Check size={18} /> Publicar Ya
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* MODAL EVENTO */}
      {editando && (
        <div className="fixed inset-0 bg-[#020617]/95 backdrop-blur-xl flex items-center justify-center p-4 z-50">
          <form onSubmit={guardarEvento} className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-800"><h2 className="text-2xl font-black italic uppercase">Editar Evento</h2><button type="button" onClick={() => setEditando(null)} className="bg-slate-800 p-2 rounded-full hover:bg-slate-700 transition-colors"><X size={20}/></button></div>
            <div className="grid gap-5">
              <div className="space-y-1"><label className="text-[10px] text-slate-500 font-bold ml-1 uppercase">Nombre del Evento</label><input type="text" className="bg-[#020617] border border-slate-800 p-4 rounded-2xl w-full outline-none text-white focus:border-blue-500" value={editando.evento} onChange={(e) => setEditando({...editando, evento: e.target.value})} required /></div>
              
              <div className="space-y-1"><label className="text-[10px] text-slate-500 font-bold ml-1 uppercase">Deporte</label>
                <select className="bg-[#020617] border border-slate-800 p-4 rounded-2xl w-full outline-none text-white focus:border-blue-500" value={editando.deporte} onChange={(e) => setEditando({...editando, deporte: e.target.value})}>
                  {Object.keys(emojis).sort().map(d => (<option key={d} value={d}>{emojis[d]} {d}</option>))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><label className="text-[10px] text-slate-500 font-bold ml-1 uppercase">Fecha (YYYY-MM-DD)</label><input type="date" className="bg-[#020617] border border-slate-800 p-4 rounded-2xl w-full outline-none text-white focus:border-blue-500" value={editando.fecha} onChange={(e) => setEditando({...editando, fecha: e.target.value})} required /></div>
                <div className="space-y-1"><label className="text-[10px] text-slate-500 font-bold ml-1 uppercase">Hora (HH:MM)</label><input type="time" className="bg-[#020617] border border-slate-800 p-4 rounded-2xl w-full outline-none text-white focus:border-blue-500 font-mono" value={editando.hora} onChange={(e) => setEditando({...editando, hora: e.target.value})} required /></div>
              </div>
              
              <div className="space-y-1"><label className="text-[10px] text-[#a3e635] font-bold ml-1 uppercase">Canales de Transmisión</label><input type="text" className="bg-[#020617] border border-slate-800 p-4 rounded-2xl w-full outline-none text-[#a3e635] focus:border-[#a3e635] font-bold" value={editando.canales} onChange={(e) => setEditando({...editando, canales: e.target.value})} required /></div>
              <div className="space-y-1"><label className="text-[10px] text-slate-500 font-bold ml-1 uppercase">Competición / Liga</label><input type="text" className="bg-[#020617] border border-slate-800 p-4 rounded-2xl w-full outline-none text-white focus:border-blue-500" value={editando.competicion} onChange={(e) => setEditando({...editando, competicion: e.target.value})} required /></div>
              
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setEditando(null)} className="flex-1 bg-transparent border border-slate-700 text-white font-bold p-4 rounded-2xl hover:bg-slate-800 transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 bg-[#a3e635] hover:bg-[#86c523] transition-colors text-black font-black p-4 rounded-xl uppercase italic shadow-lg flex items-center justify-center gap-2"><Check size={18}/> Guardar</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
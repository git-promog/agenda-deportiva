"use client";

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Trash2, Star, Plus, Edit3, Check, X, LogIn, Zap, LogOut, Search, AlertCircle, Newspaper, CalendarDays, ImageIcon, Bot, ActivitySquare, ArrowRight } from 'lucide-react';
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

const TOP_TEAMS = ["América", "Chivas", "Real Madrid", "Barcelona", "México", "F1", "NBA", "Champions", "Cruz Azul", "Pumas", "Selección"];

export default function AdminPanel() {
  const [mounted, setMounted] = useState(false);
  const [autenticado, setAutenticado] = useState(false);
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<'eventos' | 'noticias' | 'ia'>('eventos');
  
  // Estados para Eventos
  const [eventos, setEventos] = useState<any[]>([]);
  const [editando, setEditando] = useState<any>(null);
  const [filtroDeporte, setFiltroDeporte] = useState("Todos");
  const [filtroFecha, setFiltroFecha] = useState("Todos");
  const [filtroCompeticion, setFiltroCompeticion] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  
  // Estados para Noticias
  const [noticias, setNoticias] = useState<any[]>([]);
  const [isNoticiaModalOpen, setIsNoticiaModalOpen] = useState(false);
  const [editandoNoticia, setEditandoNoticia] = useState<any>({ titulo: "", contenido: "", imagen_url: "", fecha: "" });

  // Estados para Generador IA
  const [promptIA, setPromptIA] = useState("");
  const [instruccionesIA, setInstruccionesIA] = useState("");
  const [generandoIA, setGenerandoIA] = useState(false);
  const [previewIA, setPreviewIA] = useState<any>(null);
  
  const [eventoSugeridoFiltrado, setEventoSugeridoFiltrado] = useState<any[]>([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [eventoSeleccionadoIA, setEventoSeleccionadoIA] = useState<any>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getTodayStr = () => {
    try {
      const mxDate = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Mexico_City"}));
      return mxDate.getFullYear() + "-" + String(mxDate.getMonth() + 1).padStart(2, '0') + "-" + String(mxDate.getDate()).padStart(2, '0');
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  };

  const hoyStr = getTodayStr();

  const destacadosPreview = useMemo(() => {
    return eventos.filter(e => {
      const esDeHoy = e.fecha === hoyStr;
      if (e.destacado === true) return esDeHoy;
      if (e.destacado === false) return false;
      if (e.destacado === null || e.destacado === undefined) {
        return esDeHoy && TOP_TEAMS.some(t => e.evento.toLowerCase().includes(t.toLowerCase()));
      }
      return false;
    }).slice(0, 6);
  }, [eventos, hoyStr]);

  const login = () => {
    if (password === "GUIA2024") setAutenticado(true);
    else alert("Contraseña incorrecta");
  };

  useEffect(() => {
    setMounted(true);
    if (autenticado) {
      cargarEventos();
      cargarNoticias();
    }
  }, [autenticado]);

  if (!mounted) return null;

  async function cargarEventos() {
    const { data, error } = await supabase.from('eventos').select('*').order('fecha', { ascending: true }).order('hora', { ascending: true });
    if (error) {
      console.error("Error cargando eventos:", error);
      return;
    }
    if (data) {
      console.log("Raw destacado values:", data.slice(0, 5).map(e => `id=${e.id} val="${e.destacado}" type=${typeof e.destacado}`).join(" | "));
      const normalized = data.map(e => {
        let d = e.destacado;
        if (d === true || d === 'true' || d === 'TRUE' || d === '1' || d === 1) d = true;
        else if (d === false || d === 'false' || d === 'FALSE' || d === '0' || d === 0) d = false;
        else d = null;
        return { ...e, destacado: d };
      });
      console.log("Normalized:", normalized.slice(0, 3).map(e => ({ id: e.id, destacado: e.destacado })));
      setEventos(normalized);
    }
  }

  async function cargarNoticias() {
    const { data } = await supabase.from('noticias').select('*').order('fecha', { ascending: false });
    if (data) setNoticias(data);
  }

  // --- LOGICA EVENTOS ---
  const deportesUnicos = ["Todos", ...new Set(eventos.map(e => e.deporte))];
  const fechasUnicas = ["Todos", ...new Set(eventos.map(e => e.fecha))];
  const competicionesUnicas = ["Todos", ...new Set(eventos.map(e => e.competicion).filter(Boolean))];

  const eventosFiltrados = eventos.filter(e => {
    const coincideDeporte = filtroDeporte === "Todos" || e.deporte === filtroDeporte;
    const coincideFecha = filtroFecha === "Todos" || e.fecha === filtroFecha;
    const coincideCompeticion = filtroCompeticion === "Todos" || e.competicion === filtroCompeticion;
    const coincideBusqueda = e.evento.toLowerCase().includes(busqueda.toLowerCase()) || 
                             e.competicion.toLowerCase().includes(busqueda.toLowerCase());
    return coincideDeporte && coincideFecha && coincideCompeticion && coincideBusqueda;
  });

  async function eliminarEvento(id: string) {
    if (confirm("¿Borrar evento?")) {
      const { error } = await supabase.from('eventos').delete().eq('id', id);
      if (error) showToast("Error al eliminar", "error");
      else { showToast("Evento eliminado"); cargarEventos(); }
    }
  }

  async function actualizarDestacado(id: string, valor: boolean | null) {
    console.log("Intentando actualizar:", { id, valor, tipoId: typeof id });
    const { data, error } = await supabase.from('eventos').update({ destacado: valor }).eq('id', String(id)).select();
    console.log("Respuesta Supabase:", { data, error });
    if (error) {
      showToast("Error: " + error.message, "error");
    } else if (data && data.length === 0) {
      showToast("No se encontró el evento. Revisa permisos RLS en Supabase", "error");
    } else {
      const label = valor === true ? "Destacado" : valor === false ? "No destacado" : "Modo auto";
      showToast(`${label} aplicado`);
      cargarEventos();
    }
  }

  async function aplicarDestacadoAMuchos(valor: boolean | null) {
    if (!confirm(`¿Aplicar estado a todos los ${eventosFiltrados.length} eventos visibles?`)) return;
    const ids = eventosFiltrados.map(e => e.id);
    const { error } = await supabase.from('eventos').update({ destacado: valor }).in('id', ids);
    if (error) showToast("Error al actualizar", "error");
    else { showToast(`${ids.length} eventos actualizados`); cargarEventos(); }
  }

  async function guardarEvento(e: React.FormEvent) {
    e.preventDefault();
    let error;
    if (editando.id) {
      const res = await supabase.from('eventos').update(editando).eq('id', editando.id);
      error = res.error;
    } else {
      const res = await supabase.from('eventos').insert([editando]);
      error = res.error;
    }
    if (error) showToast("Error al guardar", "error");
    else {
      showToast(editando.id ? "Evento actualizado" : "Evento creado");
      setEditando(null);
      cargarEventos();
    }
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
    const slug = editandoNoticia.titulo
      .toLowerCase()
      .trim()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    const noticiaParaSubir = { ...editandoNoticia, slug };

    let res;
    if (editandoNoticia.id) {
      res = await fetch("/api/noticias/editar", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET || "guiasports-secret-2024"}`,
        },
        body: JSON.stringify({
          id: editandoNoticia.id,
          titulo: editandoNoticia.titulo,
          contenido: editandoNoticia.contenido,
          imagen_url: editandoNoticia.imagen_url,
          fecha: editandoNoticia.fecha,
        }),
      });
      const data = await res.json();
      if (!data.success) { showToast("Error: " + (data.error || "No se pudo actualizar"), "error"); return; }
    } else {
      res = await supabase.from('noticias').insert([noticiaParaSubir]);
      if (res.error) { showToast("Error: " + res.error.message, "error"); return; }
    }

    showToast(editandoNoticia.id ? "Noticia actualizada" : "Noticia publicada");
    cerrarModalNoticia();
    cargarNoticias();
  }

  async function eliminarNoticia(id: string) {
    if (confirm("¿Borrar noticia permanentemente?")) {
      const { error } = await supabase.from('noticias').delete().eq('id', id);
      if (error) showToast("Error al eliminar", "error");
      else { showToast("Noticia eliminada"); cargarNoticias(); }
    }
  }

  // --- LOGICA GENERADOR IA ---
  const sugerirEventos = (texto: string) => {
    setPromptIA(texto);
    if (!texto) {
      setEventoSugeridoFiltrado([]);
      setMostrarSugerencias(false);
      return;
    }
    const filtrados = eventos.filter(e => 
      e.evento.toLowerCase().includes(texto.toLowerCase()) || 
      e.competicion.toLowerCase().includes(texto.toLowerCase())
    ).slice(0, 5);
    setEventoSugeridoFiltrado(filtrados);
    setMostrarSugerencias(true);
  };

  const seleccionarEventoIA = (e: any) => {
    setPromptIA(e.evento);
    setEventoSeleccionadoIA(e);
    setMostrarSugerencias(false);
  };

  async function dispararGeneracionIA() {
    if (!promptIA) return alert("Escribe el nombre del evento");
    
    setGenerandoIA(true);
    setPreviewIA(null);
    try {
      const res = await fetch("/api/noticias/generar", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET || "guiasports-secret-2024"}`,
        },
        body: JSON.stringify({ 
          evento: promptIA, 
          instrucciones: instruccionesIA,
          metadatos: eventoSeleccionadoIA 
        })
      });

      const data = await res.json();
      
      if (data.success) {
        setPreviewIA(data.preview);
      } else {
        showToast("Error IA: " + (data.error || "No se pudo generar"), "error");
      }
    } catch (e) {
      showToast("Error de conexión con el Robot", "error");
    } finally {
      setGenerandoIA(false);
    }
  }

  async function publicarPreview() {
    if (!previewIA) return;
    try {
      const res = await fetch("/api/noticias/publicar", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET || "guiasports-secret-2024"}`,
        },
        body: JSON.stringify(previewIA),
      });
      const data = await res.json();
      if (data.success) {
        showToast("¡Noticia publicada con éxito!");
        setPreviewIA(null);
        setPromptIA("");
        setInstruccionesIA("");
        setEventoSeleccionadoIA(null);
        cargarNoticias();
      } else {
        showToast("Error al publicar: " + (data.error || "Error desconocido"), "error");
      }
    } catch (e) {
      showToast("Error al publicar", "error");
    }
  }

  async function regenerarIA() {
    setPreviewIA(null);
    dispararGeneracionIA();
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
      {/* TOAST */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[9999] px-6 py-4 rounded-2xl shadow-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${toast.type === 'success' ? 'bg-[#a3e635] text-black' : 'bg-red-600 text-white'}`}>
          {toast.type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
          {toast.msg}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        
        {/* HEADER ADMIN */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <NextImage src="/GuiaSports-logo.svg" alt="GuíaSports" width={140} height={40} />
          <div className="flex bg-slate-900 overflow-hidden rounded-2xl border border-slate-800 shadow-xl flex-wrap shrink-0">
            <button onClick={() => setTab('eventos')} className={`px-4 sm:px-8 py-3 text-[10px] sm:text-xs font-black uppercase transition-all flex-1 ${tab === 'eventos' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}>Agenda</button>
            <button onClick={() => setTab('noticias')} className={`px-4 sm:px-8 py-3 text-[10px] sm:text-xs font-black uppercase transition-all flex-1 ${tab === 'noticias' ? 'bg-[#a3e635] text-black' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}>Noticias (SEO)</button>
            <button onClick={() => setTab('ia')} className={`px-4 sm:px-8 py-3 text-[10px] sm:text-xs font-black uppercase transition-all flex-1 flex items-center justify-center gap-2 ${tab === 'ia' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}><Bot size={14} className="hidden sm:block"/> Robot IA</button>
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
            
            {/* FILTROS */}
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
                {competicionesUnicas.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {competicionesUnicas.map(c => (
                      <button key={c} onClick={() => setFiltroCompeticion(c)} className={`px-4 py-2 rounded-xl text-[10px] font-bold border transition-all whitespace-nowrap ${filtroCompeticion === c ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/40' : 'bg-slate-800 border-slate-700 text-slate-500 hover:bg-slate-700'}`}>🛡️ {c}</button>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                   <button onClick={() => aplicarDestacadoAMuchos(true)} className="px-4 py-2 rounded-xl text-[10px] font-bold border transition-all whitespace-nowrap flex items-center gap-1 bg-yellow-500 border-yellow-400 text-black hover:bg-yellow-400 shadow-lg"><Star size={12} /> Destacar todos ({eventosFiltrados.length})</button>
                   <button onClick={() => aplicarDestacadoAMuchos(null)} className="px-4 py-2 rounded-xl text-[10px] font-bold border transition-all whitespace-nowrap flex items-center gap-1 bg-blue-600 border-blue-500 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/40"><Zap size={12} /> Modo Auto ({eventosFiltrados.length})</button>
                   <button onClick={() => aplicarDestacadoAMuchos(false)} className="px-4 py-2 rounded-xl text-[10px] font-bold border transition-all whitespace-nowrap flex items-center gap-1 bg-red-600 border-red-500 text-white hover:bg-red-500 shadow-lg shadow-red-900/40"><X size={12} /> Quitar todos ({eventosFiltrados.length})</button>
                </div>
            </div>

            {/* PREVIEW DESTACADOS DEL DÍA */}
            {destacadosPreview.length > 0 && (
              <div className="bg-slate-900/60 border border-yellow-500/20 rounded-[32px] p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="text-yellow-500 w-4 h-4 fill-yellow-500" />
                  <h3 className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em]">Así se verían los destacados de hoy en la portada ({destacadosPreview.length})</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {destacadosPreview.map(e => (
                    <div key={e.id} className={`p-3 rounded-xl border flex items-center gap-3 ${e.destacado === true ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-slate-800/50 border-slate-700'}`}>
                      <span className="text-xl">{emojis[e.deporte] || "🏆"}</span>
                      <div className="min-w-0 flex-1">
                        <div className="text-[9px] font-black text-slate-500 uppercase truncate">{e.competicion}</div>
                        <div className="text-xs font-bold text-white truncate">{e.evento}</div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {e.destacado === true && <span className="text-[8px] font-black text-yellow-500 bg-yellow-500/20 px-2 py-0.5 rounded">MANUAL</span>}
                        {e.destacado === null && <span className="text-[8px] font-black text-blue-400 bg-blue-600/20 px-2 py-0.5 rounded">AUTO</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                  <thead className="text-[10px] uppercase text-slate-400 border-b border-slate-800 font-black bg-slate-950/80"><tr><th className="p-6">Fecha/Hora</th><th className="p-6">Evento</th><th className="p-6">Canales</th><th className="p-6 text-center">Destacar</th><th className="p-6 text-right">Acciones</th></tr></thead>
                  <tbody>
                    {eventosFiltrados.map(e => (
                      <tr key={e.id} className="border-b border-slate-800/30 hover:bg-slate-800/40 transition-colors">
                        <td className="p-6 text-xs font-mono"><div className="text-blue-400 font-bold bg-blue-900/20 w-fit px-2 py-1 rounded inline-block mb-1">{e.fecha}</div><div className="text-slate-300 font-bold ml-1">{e.hora}</div></td>
                        <td className="p-6 flex items-center gap-4">
                          <div className="bg-[#020617] border border-slate-800 w-12 h-12 flex flex-col justify-center items-center rounded-2xl shadow-inner text-2xl">{emojis[e.deporte] || "🏆"}</div>
                          <div className="min-w-0">
                            <div className="font-bold text-sm text-white mb-1">{e.evento}</div>
                            <div className="text-[9px] uppercase text-slate-500 font-black tracking-widest">{e.competicion}</div>
                            <div className="mt-1">
                              {e.destacado === true && <span className="text-[8px] font-black text-yellow-500 bg-yellow-500/15 px-2 py-0.5 rounded border border-yellow-500/20">⭐ DESTACADO</span>}
                              {e.destacado === null && <span className="text-[8px] font-black text-blue-400 bg-blue-600/10 px-2 py-0.5 rounded border border-blue-500/20">🔄 AUTO</span>}
                              {e.destacado === false && <span className="text-[8px] font-black text-slate-600 bg-slate-800/50 px-2 py-0.5 rounded border border-slate-700/30">— Normal</span>}
                            </div>
                          </div>
                        </td>
                        <td className="p-6"><span className="text-[10px] text-[#a3e635] font-black italic bg-[#a3e635]/10 px-3 py-1.5 rounded-lg border border-[#a3e635]/20">{e.canales}</span></td>
                        <td className="p-6 text-center">
                          <div className="flex justify-center bg-[#020617] p-1.5 rounded-xl w-fit mx-auto border border-slate-800 shadow-inner">
                            <button onClick={() => actualizarDestacado(e.id, null)} className={`p-2 rounded-lg transition-colors ${e.destacado === null ? 'bg-slate-800 text-white shadow' : 'text-slate-600 hover:text-slate-400'}`} title="Modo auto"><Zap size={14}/></button>
                            <button onClick={() => actualizarDestacado(e.id, true)} className={`p-2 rounded-lg transition-colors ${e.destacado === true ? 'bg-yellow-500/20 text-yellow-500 shadow' : 'text-slate-600 hover:text-slate-400'}`} title="Destacar"><Star size={14} fill={e.destacado === true ? "currentColor" : "none"}/></button>
                            <button onClick={() => actualizarDestacado(e.id, false)} className={`p-2 rounded-lg transition-colors ${e.destacado === false ? 'bg-red-500/20 text-red-500 shadow' : 'text-slate-600 hover:text-slate-400'}`} title="No destacar"><X size={14}/></button>
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

        {/* TAB IA PROMOM */}
        {tab === 'ia' && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-8 md:p-12 mb-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
            
            <header className="mb-10 relative z-10 flex items-center gap-6">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-16 h-16 rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-900/40 shrink-0">
                <Bot className="text-white relative z-10" size={32} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white">
                  Generador <span className="text-indigo-400">IA Promom</span>
                </h1>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] md:text-xs mt-1">Automatiza la redacción SEO</p>
              </div>
            </header>

            <div className="relative z-10 space-y-6">
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Ingresa el partido que deseas destacar. La Inteligencia Artificial del equipo redactará una noticia original, optimizada para Google, 
                e insertará de inmediato la portada visual en tu base de datos.
              </p>

              <div className="relative">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Evento / Partido Objetivo (Escribe para buscar)</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={18} />
                  <input 
                    type="text" 
                    placeholder="Ej. Mex o Amé..." 
                    className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-4 pl-12 text-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-bold shadow-inner"
                    value={promptIA}
                    onChange={(e) => sugerirEventos(e.target.value)}
                    onFocus={() => promptIA && setMostrarSugerencias(true)}
                    disabled={generandoIA}
                  />
                  {eventoSeleccionadoIA && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-lg text-[9px] font-black uppercase flex items-center gap-2">
                      <Check size={10} /> Vinculado a Agenda
                    </div>
                  )}
                </div>

                {mostrarSugerencias && eventoSugeridoFiltrado.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 p-2 space-y-1">
                    {eventoSugeridoFiltrado.map(e => (
                      <button 
                        key={e.id}
                        onClick={() => seleccionarEventoIA(e)}
                        className="w-full text-left p-3 rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-4 group"
                      >
                         <span className="text-xl shrink-0">{emojis[e.deporte] || "🏆"}</span>
                         <div className="min-w-0">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-0.5 truncate">{e.competicion}</p>
                            <p className="text-sm font-bold text-slate-200 group-hover:text-white truncate">{e.evento}</p>
                            <p className="text-[9px] font-bold text-[#a3e635] italic uppercase">{e.canales}</p>
                         </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Instrucciones Especiales (Opcional)</label>
                <textarea 
                  placeholder="Ej. Mencionar que es el torneo más importante..." 
                  rows={3}
                  className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-4 text-slate-200 focus:outline-none focus:border-indigo-500 transition-all text-sm resize-none shadow-inner"
                  value={instruccionesIA}
                  onChange={(e) => setInstruccionesIA(e.target.value)}
                  disabled={generandoIA}
                ></textarea>
              </div>

              <button 
                type="button"
                className={`w-full flex items-center justify-center gap-3 ${generandoIA ? 'bg-indigo-900 cursor-not-allowed opacity-50' : 'bg-indigo-600 hover:bg-indigo-500'} text-white font-black py-5 px-8 rounded-2xl transition-all uppercase tracking-widest text-sm italic shadow-lg shadow-indigo-900/40 relative overflow-hidden group mt-4`}
                onClick={dispararGeneracionIA}
                disabled={generandoIA}
              >
                <span className="relative z-10">{generandoIA ? 'Redactando con IA...' : 'Generar Borrador'}</span>
                {!generandoIA && <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />}
                {generandoIA && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
              </button>
              <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-4">Revisa el borrador antes de publicar</p>
            </div>

            {/* VISTA PREVIA DEL BORRADOR */}
            {previewIA && (
              <div className="relative z-10 mt-10 pt-10 border-t border-slate-800">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-[#a3e635]/10 p-2 rounded-xl border border-[#a3e635]/20">
                    <Check className="text-[#a3e635]" size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase text-[#a3e635] tracking-widest">Borrador Generado</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Revisa y edita antes de publicar</p>
                  </div>
                </div>

                {previewIA.imagen_url && (
                  <div className="w-full h-48 rounded-2xl overflow-hidden mb-6 border border-slate-800">
                    <img src={previewIA.imagen_url} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#a3e635] ml-1 mb-1 block">Título (editable)</label>
                    <input 
                      type="text" 
                      className="w-full bg-[#020617] border border-slate-800 p-4 rounded-xl outline-none text-white focus:border-[#a3e635] font-bold text-lg shadow-inner"
                      value={previewIA.titulo}
                      onChange={(e) => setPreviewIA({...previewIA, titulo: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Contenido (editable)</label>
                    <textarea 
                      rows={10}
                      className="w-full bg-[#020617] border border-slate-800 p-4 rounded-xl outline-none text-slate-300 focus:border-blue-500 text-sm leading-relaxed shadow-inner resize-none"
                      value={previewIA.contenido}
                      onChange={(e) => setPreviewIA({...previewIA, contenido: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Imagen URL</label>
                    <input 
                      type="text" 
                      className="w-full bg-[#020617] border border-slate-800 p-4 rounded-xl outline-none text-slate-400 focus:border-blue-500 text-xs shadow-inner"
                      value={previewIA.imagen_url}
                      onChange={(e) => setPreviewIA({...previewIA, imagen_url: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button 
                    type="button"
                    onClick={regenerarIA}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-4 px-6 rounded-2xl transition-all uppercase tracking-widest text-xs border border-slate-700"
                  >
                    🔄 Regenerar
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      abrirModalNoticia({
                        titulo: previewIA.titulo,
                        contenido: previewIA.contenido,
                        imagen_url: previewIA.imagen_url,
                        fecha: previewIA.fecha,
                      });
                    }}
                    className="flex-1 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 font-bold py-4 px-6 rounded-2xl transition-all uppercase tracking-widest text-xs border border-blue-500/20"
                  >
                    ✏️ Editar Más
                  </button>
                  <button 
                    type="button"
                    onClick={publicarPreview}
                    className="flex-1 bg-[#a3e635] hover:bg-[#86c523] text-black font-black py-4 px-6 rounded-2xl transition-all uppercase tracking-widest text-xs shadow-lg shadow-[#a3e635]/20"
                  >
                    ✓ Publicar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL NOTICIA */}
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
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-800">
              <h2 className="text-2xl font-black italic uppercase">{editando.id ? "Editar Evento" : "Añadir Evento"}</h2>
              <button type="button" onClick={() => setEditando(null)} className="bg-slate-800 p-2 rounded-full hover:bg-slate-700 transition-colors"><X size={20}/></button>
            </div>
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

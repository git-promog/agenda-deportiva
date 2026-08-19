"use client";

import React, { useState, useRef, useEffect } from "react";
import { Filter, X, Search, Tv, RotateCcw, CalendarDays, Trophy } from "lucide-react";

interface AgendaFiltersProps {
  filtroFecha: string;
  fechas: string[];
  onFechaChange: (fecha: string) => void;
  filtroCompeticion: string;
  competiciones: string[];
  onCompeticionChange: (competicion: string) => void;
  soloTvAbierta: boolean;
  onTvAbiertaChange: (value: boolean) => void;
  activeCount: number;
  onReset: () => void;
  formatButtonFecha: (f: string) => string;
}

export default function AgendaFilters({
  filtroFecha,
  fechas,
  onFechaChange,
  filtroCompeticion,
  competiciones,
  onCompeticionChange,
  soloTvAbierta,
  onTvAbiertaChange,
  activeCount,
  onReset,
  formatButtonFecha,
}: AgendaFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [busquedaCompeticion, setBusquedaCompeticion] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  const closePanel = () => {
    setIsOpen(false);
    setBusquedaCompeticion("");
  };

  // Cerrar panel al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        closePanel();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const competicionesFiltradas = competiciones.filter((c) =>
    c.toLowerCase().includes(busquedaCompeticion.toLowerCase())
  );

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => (isOpen ? closePanel() : setIsOpen(true))}
        className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
          isOpen || activeCount > 0
            ? "bg-blue-600/20 text-blue-400 border-blue-500/40"
            : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
        }`}
        aria-expanded={isOpen}
        aria-controls="agenda-filters-panel"
      >
        <Filter size={14} />
        Filtrar
        {activeCount > 0 && (
          <span className="ml-1 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
            {activeCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          id="agenda-filters-panel"
          className="absolute top-full left-0 mt-2 w-[calc(100vw-2rem)] max-w-md bg-[#020617] border border-slate-800 rounded-2xl shadow-2xl z-50 p-4"
        >
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <Filter size={14} className="text-blue-500" /> Filtros
            </h3>
            <button
              onClick={closePanel}
              className="p-1.5 rounded-full text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Cerrar filtros"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-5">
            {/* Fecha */}
            <div>
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <CalendarDays size={12} /> Fecha
              </h4>
              <div className="flex flex-wrap gap-2">
                {fechas.map((f) => (
                  <button
                    key={f}
                    onClick={() => onFechaChange(f)}
                    className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                      filtroFecha === f
                        ? "bg-[#a3e635]/10 text-[#a3e635] border-[#a3e635]/40"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    {formatButtonFecha(f)}
                  </button>
                ))}
              </div>
            </div>

            {/* Competición */}
            {competiciones.length > 1 && (
              <div>
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Trophy size={12} /> Competición
                </h4>
                <div className="relative mb-2">
                  <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Buscar liga..."
                    value={busquedaCompeticion}
                    onChange={(e) => setBusquedaCompeticion(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="max-h-40 overflow-y-auto scrollbar-hide space-y-1">
                  {competicionesFiltradas.map((c) => (
                    <button
                      key={c}
                      onClick={() => onCompeticionChange(c)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                        filtroCompeticion === c
                          ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                          : "text-slate-400 hover:bg-slate-900"
                      }`}
                    >
                      {c === "Todos" ? "Todas las ligas" : c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TV Abierta */}
            <div>
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Tv size={12} /> Tipo de transmisión
              </h4>
              <button
                onClick={() => onTvAbiertaChange(!soloTvAbierta)}
                className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                  soloTvAbierta
                    ? "bg-white text-black border-white"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800"
                }`}
              >
                <Tv size={14} /> Solo TV Abierta
              </button>
            </div>
          </div>

          {/* Footer del panel */}
          {activeCount > 0 && (
            <div className="mt-5 pt-4 border-t border-slate-800">
              <button
                onClick={onReset}
                className="flex items-center justify-center gap-2 w-full text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-colors"
              >
                <RotateCcw size={14} /> Limpiar todo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

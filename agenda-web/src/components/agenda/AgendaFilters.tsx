"use client";

import React, { useEffect, useRef, useState } from "react";
import { CalendarDays, Filter, RotateCcw, Search, Tv, Trophy, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const FILTER_PANEL_EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

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
  const shouldReduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [busquedaCompeticion, setBusquedaCompeticion] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  const closePanel = () => {
    setIsOpen(false);
    setBusquedaCompeticion("");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) closePanel();
    };

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const competicionesFiltradas = competiciones.filter((c) =>
    c.toLowerCase().includes(busquedaCompeticion.toLowerCase())
  );

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => (isOpen ? closePanel() : setIsOpen(true))}
        className={`gs-button ${isOpen || activeCount > 0 ? "gs-button-secondary" : "gs-button-quiet"}`}
        aria-expanded={isOpen}
        aria-controls="agenda-filters-panel"
        aria-label={activeCount > 0 ? `Editar filtros, ${activeCount} activos` : "Abrir filtros"}
      >
        <Filter size={15} aria-hidden="true" />
        Filtrar
        {activeCount > 0 && <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[10px] text-white">{activeCount}</span>}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="agenda-filters-panel"
            id="agenda-filters-panel"
            role="region"
            aria-label="Filtros de agenda"
            className="gs-panel absolute left-0 top-full z-50 mt-2 w-[min(24rem,calc(100vw-2rem))] p-4"
            style={{ transformOrigin: "top left" }}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -6, scale: shouldReduceMotion ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -6, scale: shouldReduceMotion ? 1 : 0.98 }}
            transition={shouldReduceMotion ? { type: "tween", duration: 0 } : { type: "tween", duration: 0.16, ease: FILTER_PANEL_EASE }}
          >
          <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="flex items-center gap-2 text-sm font-extrabold text-white">
              <Filter size={15} className="text-blue-400" aria-hidden="true" /> Ajusta tu agenda
            </h3>
            <button type="button" onClick={closePanel} className="gs-button-icon !min-h-11 !min-w-11 !rounded-lg" aria-label="Cerrar filtros">
              <X size={16} aria-hidden="true" />
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <h4 className="mb-2 flex items-center gap-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-slate-400">
                <CalendarDays size={13} aria-hidden="true" /> Fecha
              </h4>
              <div className="flex flex-wrap gap-2">
                {fechas.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => onFechaChange(f)}
                    aria-pressed={filtroFecha === f}
                    className={`gs-chip ${filtroFecha === f ? "border-lime-400/40 bg-lime-400/10 text-lime-300" : "hover:border-slate-600 hover:text-slate-200"}`}
                  >
                    {formatButtonFecha(f)}
                  </button>
                ))}
              </div>
            </div>

            {competiciones.length > 1 && (
              <div>
                <h4 className="mb-2 flex items-center gap-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-slate-400">
                  <Trophy size={13} aria-hidden="true" /> Competición
                </h4>
                <div className="relative mb-2">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" />
                  <input
                    type="text"
                    placeholder="Buscar liga..."
                    value={busquedaCompeticion}
                    onChange={(e) => setBusquedaCompeticion(e.target.value)}
                    className="gs-field !min-h-11 !py-2 !pl-9 !text-sm"
                    aria-label="Buscar competición"
                  />
                </div>
                <div className="max-h-40 space-y-1 overflow-y-auto scrollbar-hide">
                  {competicionesFiltradas.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => onCompeticionChange(c)}
                      aria-pressed={filtroCompeticion === c}
                      className={`w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors ${filtroCompeticion === c ? "bg-blue-400/10 text-blue-300" : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"}`}
                    >
                      {c === "Todos" ? "Todas las ligas" : c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="mb-2 flex items-center gap-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-slate-400">
                <Tv size={13} aria-hidden="true" /> Tipo de transmisión
              </h4>
              <button
                type="button"
                onClick={() => onTvAbiertaChange(!soloTvAbierta)}
                aria-pressed={soloTvAbierta}
                className={`flex min-h-11 w-full items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors ${soloTvAbierta ? "border-lime-400/40 bg-lime-400/10 text-lime-300" : "border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200"}`}
              >
                <Tv size={15} aria-hidden="true" /> Solo TV abierta
              </button>
            </div>
          </div>

          {activeCount > 0 && (
            <div className="mt-5 border-t border-slate-800 pt-4">
              <button type="button" onClick={onReset} className="gs-button gs-button-quiet w-full">
                <RotateCcw size={14} aria-hidden="true" /> Limpiar todo
              </button>
            </div>
          )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import React from "react";
import { Filter, RotateCcw } from "lucide-react";

interface EmptyStateProps {
  onReset?: () => void;
}

export default function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="text-center py-16 flex flex-col items-center px-4">
      <div className="bg-slate-900 p-4 rounded-full mb-4 border border-slate-800">
        <Filter className="w-8 h-8 text-slate-600" />
      </div>
      <h3 className="text-slate-300 font-black text-sm uppercase tracking-widest mb-2">
        Sin resultados
      </h3>
      <p className="text-slate-500 text-xs max-w-xs mb-4 leading-relaxed">
        Prueba con otra palabra, equipo o canal. También puedes limpiar los filtros para ver toda la agenda.
      </p>
      {onReset && (
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-colors"
        >
          <RotateCcw size={14} /> Limpiar filtros
        </button>
      )}
    </div>
  );
}

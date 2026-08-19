"use client";

import React from "react";
import { Search, X } from "lucide-react";

interface AgendaSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function AgendaSearch({ value, onChange, placeholder = "Busca equipos, ligas o canales..." }: AgendaSearchProps) {
  return (
    <div className="relative w-full">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
        <Search size={20} />
      </div>
      <input
        id="buscar"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl py-4 pl-12 pr-11 text-base text-white placeholder-slate-500 focus:outline-none focus:border-[#a3e635] focus:ring-1 focus:ring-[#a3e635]/30 transition-all"
        aria-label="Buscar eventos deportivos"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          aria-label="Limpiar búsqueda"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

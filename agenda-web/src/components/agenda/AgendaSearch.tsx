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
    <div className="gs-home-search relative w-full">
      <div className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-blue-400" aria-hidden="true">
        <Search size={19} />
      </div>
      <input
        id="buscar"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="gs-field !min-h-[3.25rem] !border-0 !bg-transparent !py-3 !pl-11 !pr-11 text-base"
        aria-label="Buscar eventos deportivos"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="gs-button-icon absolute right-3 top-1/2 -translate-y-1/2 !min-h-9 !min-w-9 !rounded-lg"
          aria-label="Limpiar búsqueda"
        >
          <X size={15} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

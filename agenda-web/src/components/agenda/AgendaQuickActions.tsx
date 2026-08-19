"use client";

import React, { useRef } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

interface AgendaQuickActionsProps {
  deportes: string[];
  deporteActivo: string;
  onDeporteChange: (deporte: string) => void;
  onEnVivo: () => void;
  onHoy: () => void;
  emojis: Record<string, string>;
}

export default function AgendaQuickActions({
  deportes,
  deporteActivo,
  onDeporteChange,
  onEnVivo,
  onHoy,
  emojis,
}: AgendaQuickActionsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="space-y-3">
      {/* Acciones principales */}
      <div className="flex items-center gap-2">
        <button
          onClick={onEnVivo}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white rounded-xl px-4 py-3 font-black uppercase text-xs tracking-widest shadow-lg shadow-red-900/30 transition-colors"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
          </span>
          En vivo
        </button>

        <button
          onClick={onHoy}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-xl px-4 py-3 font-black uppercase text-xs tracking-widest transition-colors"
        >
          <CalendarDays size={16} className="text-[#a3e635]" /> Hoy
        </button>
      </div>

      {/* Deportes principales con scroll */}
      <div className="relative flex items-center">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 z-10 bg-[#020617]/90 border border-slate-800 p-1.5 rounded-full text-slate-400 hover:text-white transition-colors"
          aria-label="Desplazar deportes a la izquierda"
        >
          <ChevronLeft size={16} />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth w-full px-8 py-1"
        >
          {deportes.map((dep) => (
            <button
              key={dep}
              onClick={() => onDeporteChange(dep)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap border uppercase tracking-wider ${
                deporteActivo === dep
                  ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/30"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              {emojis[dep] || "🏆"} {dep}
            </button>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 z-10 bg-[#020617]/90 border border-slate-800 p-1.5 rounded-full text-slate-400 hover:text-white transition-colors"
          aria-label="Desplazar deportes a la derecha"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

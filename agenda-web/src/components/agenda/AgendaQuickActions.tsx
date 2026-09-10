"use client";

import React, { useRef } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Radio } from "lucide-react";

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
    <div className="space-y-3" role="group" aria-label="Accesos rápidos de agenda">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onEnVivo}
          className="gs-button gs-button-live"
        >
          <Radio size={15} aria-hidden="true" />
          En vivo
        </button>

        <button
          type="button"
          onClick={onHoy}
          className="gs-button gs-button-quiet"
        >
          <CalendarDays size={15} className="text-lime-400" aria-hidden="true" /> Hoy
        </button>
      </div>

      <div className="relative flex items-center" role="group" aria-label="Filtrar por deporte">
        <button
          type="button"
          onClick={() => scroll("left")}
          className="gs-button-icon absolute left-0 z-10 !min-h-11 !min-w-11 !rounded-lg bg-slate-950/95"
          aria-label="Desplazar deportes a la izquierda"
        >
          <ChevronLeft size={16} aria-hidden="true" />
        </button>

        <div
          ref={scrollRef}
          className="flex w-full gap-2 overflow-x-auto scroll-smooth px-10 py-1 scrollbar-hide"
        >
          {deportes.map((dep) => (
            <button
              key={dep}
              type="button"
              onClick={() => onDeporteChange(dep)}
              aria-pressed={deporteActivo === dep}
              className={`gs-chip whitespace-nowrap ${
                deporteActivo === dep
                  ? "gs-chip-selected"
                  : "hover:border-slate-600 hover:text-slate-200"
              }`}
            >
              {emojis[dep] || "🏆"} {dep}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scroll("right")}
          className="gs-button-icon absolute right-0 z-10 !min-h-11 !min-w-11 !rounded-lg bg-slate-950/95"
          aria-label="Desplazar deportes a la derecha"
        >
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

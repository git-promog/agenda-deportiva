"use client";

import React, { useRef } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, ListChecks, Radio } from "lucide-react";

interface AgendaQuickActionsProps {
  deportes: string[];
  deporteActivo: string;
  onDeporteChange: (deporte: string) => void;
  onEnVivo: () => void;
  onHoy: () => void;
  enVivoActivo: boolean;
  hoyActivo: boolean;
  emojis: Record<string, string>;
  filterSlot?: React.ReactNode;
}

export default function AgendaQuickActions({
  deportes,
  deporteActivo,
  onDeporteChange,
  onEnVivo,
  onHoy,
  enVivoActivo,
  hoyActivo,
  emojis,
  filterSlot,
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
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={onEnVivo}
          aria-pressed={enVivoActivo}
          className={`gs-button ${enVivoActivo ? "gs-button-live" : "gs-button-quiet !border-red-400/60 !bg-red-600/20 !text-red-100 hover:!bg-red-600/30 hover:!text-white"}`}
        >
          <Radio size={15} aria-hidden="true" />
          En vivo
        </button>

        <button
          type="button"
          onClick={onHoy}
          aria-pressed={hoyActivo}
          className={`gs-button !text-white ${hoyActivo ? "border-lime-400/40 bg-lime-400/10 text-lime-300" : "gs-button-quiet"}`}
        >
          <CalendarDays size={15} className="text-lime-400" aria-hidden="true" /> Hoy
        </button>

        {filterSlot}
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
          {deportes.map((dep) => {
            const isAll = dep === "Todos";
            const isActive = deporteActivo === dep;

            return (
              <button
                key={dep}
                type="button"
                onClick={() => onDeporteChange(dep)}
                aria-pressed={isActive}
                className={`gs-chip min-h-11 whitespace-nowrap ${
                  isActive
                    ? "gs-chip-selected"
                    : "hover:border-slate-600 hover:text-slate-200"
                }`}
              >
                {isAll ? (
                  <ListChecks size={14} className="text-blue-400" aria-hidden="true" />
                ) : (
                  <span aria-hidden="true">{emojis[dep] || "🏆"}</span>
                )}
                {dep}
              </button>
            );
          })}
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

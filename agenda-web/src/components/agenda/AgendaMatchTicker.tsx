"use client";

import React from "react";
import { Evento } from "@/types";

interface AgendaMatchTickerProps {
  eventos: Evento[];
  onEventClick: (evento: Evento) => void;
  className?: string;
}

export default function AgendaMatchTicker({
  eventos,
  onEventClick,
  className = "",
}: AgendaMatchTickerProps) {
  const items = eventos
    .filter((evento, index, array) => {
      if (!evento.evento?.trim()) return false;
      return array.findIndex((item) => item.id === evento.id) === index;
    })
    .slice(0, 10);

  if (items.length === 0) return null;

  const renderCopy = (duplicate: boolean) => (
    <div
      className="gs-marquee-copy"
      data-marquee-copy={duplicate ? "true" : undefined}
      aria-hidden={duplicate ? "true" : undefined}
    >
      {items.map((evento) => (
        <button
          key={`${duplicate ? "copy" : "main"}-${evento.id}`}
          type="button"
          tabIndex={duplicate ? -1 : undefined}
          onClick={() => onEventClick(evento)}
          className="gs-marquee-item"
          aria-label={`Ver detalles de ${evento.evento}`}
        >
          <span>{evento.evento}</span>
          <span className="gs-marquee-sep" aria-hidden="true">
            •
          </span>
        </button>
      ))}
    </div>
  );

  return (
    <div
      className={`gs-marquee ${className}`}
      role="region"
      aria-label="Enfrentamientos destacados"
    >
      <div className="gs-marquee-track">
        {renderCopy(false)}
        {renderCopy(true)}
      </div>
    </div>
  );
}

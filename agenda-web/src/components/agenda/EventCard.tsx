"use client";

import React from "react";
import SportEventCard from "@/components/SportEventCard";
import { Evento } from "@/types";

interface EventCardProps {
  evento: Evento;
  isLive: boolean;
  now: number;
  onFiltrarLiga?: (liga: string) => void;
  onClick?: () => void;
}

/**
 * Wrapper tipado sobre SportEventCard.
 * Mantiene la experiencia visual existente mientras normaliza el contrato de datos.
 */
export default function EventCard({ evento, isLive, now, onFiltrarLiga, onClick }: EventCardProps) {
  return (
    <SportEventCard
      evento={evento}
      isLive={isLive}
      now={now}
      onFiltrarLiga={onFiltrarLiga}
      onClick={onClick}
    />
  );
}

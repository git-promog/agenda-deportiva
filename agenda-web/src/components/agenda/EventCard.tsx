"use client";

import React from "react";
import SportEventCard from "@/components/SportEventCard";
import { Evento } from "@/types";

interface EventCardProps {
  evento: Evento;
  isLive: boolean;
  onFiltrarLiga?: (liga: string) => void;
  onClick?: () => void;
}

/**
 * Wrapper tipado sobre SportEventCard.
 * Mantiene la experiencia visual existente mientras normaliza el contrato de datos.
 */
export default function EventCard({ evento, isLive, onFiltrarLiga, onClick }: EventCardProps) {
  return (
    <SportEventCard
      evento={evento}
      isLive={isLive}
      onFiltrarLiga={onFiltrarLiga}
      onClick={onClick}
    />
  );
}

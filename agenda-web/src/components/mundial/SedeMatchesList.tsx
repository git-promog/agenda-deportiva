"use client";

import React, { useState } from 'react';
import WCMatchCard from './WCMatchCard';
import WCMatchModal from './WCMatchModal';
import { useFavorites } from '@/hooks/useFavorites';

interface Props {
  partidos: any[];
}

export default function SedeMatchesList({ partidos }: Props) {
  const { favorites, toggleFavorite } = useFavorites();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMatchData, setSelectedMatchData] = useState<{
    match: any;
    hora: string;
    nota: string;
  } | null>(null);

  return (
    <>
      <div className="flex flex-col gap-4">
        {partidos.map((m, i) => (
          <div key={m.id} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 100}ms` }}>
            <WCMatchCard 
              match={m} 
              tzShort="H. Local"
              onClick={() => { setSelectedMatchData({ match: m, hora: m.hora, nota: 'Hora local sede' }); setIsModalOpen(true); }}
              isFavorite={favorites.includes(m.id)}
              onToggleFavorite={(e) => { e.stopPropagation(); toggleFavorite(m.id); }}
            />
          </div>
        ))}
      </div>

      <WCMatchModal 
        match={selectedMatchData?.match ?? null} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        isFavorite={selectedMatchData ? favorites.includes(selectedMatchData.match.id) : false}
        onToggleFavorite={() => selectedMatchData && toggleFavorite(selectedMatchData.match.id)}
        horaConvertida={selectedMatchData?.hora}
        notaHora={selectedMatchData?.nota}
        tzShort="H. Local"
      />
    </>
  );
}

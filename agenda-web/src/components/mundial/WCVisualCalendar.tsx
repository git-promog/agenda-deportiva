"use client";

import React, { useRef } from 'react';
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import { MATCHES, getFlagUrl, WCMatch } from '@/data/mundialData';
import { ZoomIn, ZoomOut, Maximize, MousePointer2, Trophy, Calendar, Clock, MapPin } from 'lucide-react';

interface Props {
  onMatchClick: (match: WCMatch, hora: string, nota: string) => void;
  convertirHora: (match: any) => { hora: string; nota: string };
}

const Controls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  return (
    <div className="absolute bottom-8 right-8 z-50 flex flex-col gap-2">
      <button 
        onClick={() => zoomIn()}
        className="p-3 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl text-white hover:bg-blue-600 transition-colors shadow-2xl"
        title="Acercar"
      >
        <ZoomIn size={20} />
      </button>
      <button 
        onClick={() => zoomOut()}
        className="p-3 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl text-white hover:bg-blue-600 transition-colors shadow-2xl"
        title="Alejar"
      >
        <ZoomOut size={20} />
      </button>
      <button 
        onClick={() => resetTransform()}
        className="p-3 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl text-white hover:bg-blue-600 transition-colors shadow-2xl"
        title="Reiniciar vista"
      >
        <Maximize size={20} />
      </button>
    </div>
  );
};

export default function WCVisualCalendar({ onMatchClick, convertirHora }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Agrupar partidos por fase y grupo
  const groupAtoF = ['A', 'B', 'C', 'D', 'E', 'F'];
  const groupGtoL = ['G', 'H', 'I', 'J', 'K', 'L'];

  const getMatchesByGroup = (groupLabel: string) => 
    MATCHES.filter(m => m.grupo === groupLabel).sort((a, b) => a.fecha.localeCompare(b.fecha));

  const getKnockoutMatches = (fase: string) => {
    if (fase === 'Final') {
      return MATCHES.filter(m => m.fase === 'Final');
    }
    return MATCHES.filter(m => m.fase.toLowerCase().includes(fase.toLowerCase()));
  };

  const MiniMatchCard = ({ match }: { match: WCMatch }) => {
    const isDragging = useRef(false);
    const startPos = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
      isDragging.current = false;
      startPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = (e: React.MouseEvent) => {
      const diffX = Math.abs(e.clientX - startPos.current.x);
      const diffY = Math.abs(e.clientY - startPos.current.y);
      if (diffX > 5 || diffY > 5) {
        isDragging.current = true;
      }
    };

    const handleClick = (e: React.MouseEvent) => {
      if (isDragging.current) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      const { hora } = convertirHora(match);
      onMatchClick(match, hora, '');
    };

    const flag1 = getFlagUrl(match.equipo1);
    const flag2 = getFlagUrl(match.equipo2);
    const { hora } = convertirHora(match);

    return (
      <div 
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        className="group relative bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-xl p-2 w-[180px] hover:border-blue-500/50 hover:bg-slate-800/80 transition-all cursor-pointer shadow-lg"
      >
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between px-1">
             <span className="text-[7px] font-black text-slate-500 uppercase tracking-tighter">
               {new Date(match.fecha + 'T12:00:00').toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }).toUpperCase()} • {hora}
             </span>
             {match.id.startsWith('m') && parseInt(match.id.substring(1)) <= 104 && (
                <span className="text-[6px] font-bold text-blue-500/60">#{match.id.toUpperCase()}</span>
             )}
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full overflow-hidden border border-white/10 shrink-0">
                {flag1 ? <img src={flag1} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-800" />}
              </div>
              <span className="text-[9px] font-black uppercase text-slate-200 truncate">{match.equipo1}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full overflow-hidden border border-white/10 shrink-0">
                {flag2 ? <img src={flag2} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-800" />}
              </div>
              <span className="text-[9px] font-black uppercase text-slate-200 truncate">{match.equipo2}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const GroupBlock = ({ groupLabel }: { groupLabel: string }) => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 px-2">
        <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-blue-900/20">
          {groupLabel}
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grupo {groupLabel}</span>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {getMatchesByGroup(groupLabel).map(m => (
          <MiniMatchCard key={m.id} match={m} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-[800px] bg-slate-950 rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
      {/* Overlay de instrucciones */}
      <div className="absolute top-6 left-6 z-40 flex items-center gap-3 bg-slate-900/80 backdrop-blur-xl border border-white/10 px-4 py-2.5 rounded-2xl shadow-xl pointer-events-none">
        <MousePointer2 size={14} className="text-blue-400" />
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Arrastra para navegar • Usa el zoom</span>
      </div>

      {/* Header del Calendario en el Canvas */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center pointer-events-none">
        <img src="/GuiaSports-logo.svg" alt="GuíaSports" className="h-6 w-auto mb-2 opacity-80" />
        <h2 className="text-xl md:text-2xl font-black italic uppercase text-white tracking-tighter">
          Calendario <span className="text-yellow-500">Interactivo</span>
        </h2>
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent mt-2" />
      </div>

      <TransformWrapper
        initialScale={0.6}
        minScale={0.3}
        maxScale={2}
        centerOnInit={true}
        wheel={{ step: 0.1 }}
      >
        <TransformComponent wrapperClass="!w-full !h-full" contentClass="!p-32">
          <div className="flex items-center gap-24 min-w-max">
            
            {/* GRUPOS A - F (Izquierda) */}
            <div className="grid grid-cols-2 gap-12">
              <div className="flex flex-col gap-12">
                {['A', 'B', 'C'].map(g => <GroupBlock key={g} groupLabel={g} />)}
              </div>
              <div className="flex flex-col gap-12">
                {['D', 'E', 'F'].map(g => <GroupBlock key={g} groupLabel={g} />)}
              </div>
            </div>

            {/* FASES ELIMINATORIAS (Centro) */}
            <div className="flex items-center gap-16">
              
              {/* Dieciseisavos (Lado Izquierdo) */}
              <div className="flex flex-col justify-between gap-8 py-20">
                <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] text-center mb-4">16avos</h4>
                {getKnockoutMatches('Dieciseisavos').slice(0, 8).map(m => <MiniMatchCard key={m.id} match={m} />)}
              </div>

              {/* Octavos (Lado Izquierdo) */}
              <div className="flex flex-col justify-around gap-16 py-32">
                 <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] text-center mb-4">Octavos</h4>
                 {getKnockoutMatches('Octavos').slice(0, 4).map(m => <MiniMatchCard key={m.id} match={m} />)}
              </div>

              {/* Cuartos, Semis, Final, 3er Lugar */}
              <div className="flex flex-col items-center gap-20">
                
                <div className="flex gap-16 items-center">
                   {/* Cuartos Izq */}
                   <div className="flex flex-col gap-24">
                     <h4 className="text-[8px] font-black text-blue-500 uppercase tracking-widest text-center">Cuartos</h4>
                     {getKnockoutMatches('Cuartos').slice(0, 2).map(m => <MiniMatchCard key={m.id} match={m} />)}
                   </div>

                   {/* Semis Izq */}
                   <div className="flex flex-col gap-32">
                     <h4 className="text-[8px] font-black text-blue-500 uppercase tracking-widest text-center">Semi</h4>
                     {getKnockoutMatches('Semifinal').slice(0, 1).map(m => <MiniMatchCard key={m.id} match={m} />)}
                   </div>

                   {/* FINAL AREA */}
                   <div className="flex flex-col items-center gap-12 scale-125 px-12">
                      <div className="bg-yellow-500/20 border-2 border-yellow-500/50 p-6 rounded-[40px] shadow-2xl shadow-yellow-500/10 flex flex-col items-center gap-4">
                        <Trophy size={48} className="text-yellow-500 drop-shadow-lg" />
                        <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.4em]">Gran Final</span>
                        {getKnockoutMatches('Final').map(m => <MiniMatchCard key={m.id} match={m} />)}
                        <span className="text-[8px] font-black text-slate-400 uppercase">19 JUL • NY/NJ</span>
                      </div>
                      
                      {/* 3er Lugar */}
                      <div className="bg-slate-900/40 border border-slate-700/50 p-4 rounded-3xl flex flex-col items-center gap-2 mt-8">
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">3er Lugar</span>
                        {getKnockoutMatches('Tercer').map(m => <MiniMatchCard key={m.id} match={m} />)}
                      </div>
                   </div>

                   {/* Semis Der */}
                   <div className="flex flex-col gap-32">
                     <h4 className="text-[8px] font-black text-blue-500 uppercase tracking-widest text-center">Semi</h4>
                     {getKnockoutMatches('Semifinal').slice(1, 2).map(m => <MiniMatchCard key={m.id} match={m} />)}
                   </div>

                   {/* Cuartos Der */}
                   <div className="flex flex-col gap-24">
                     <h4 className="text-[8px] font-black text-blue-500 uppercase tracking-widest text-center">Cuartos</h4>
                     {getKnockoutMatches('Cuartos').slice(2, 4).map(m => <MiniMatchCard key={m.id} match={m} />)}
                   </div>
                </div>

              </div>

              {/* Octavos (Lado Derecho) */}
              <div className="flex flex-col justify-around gap-16 py-32">
                 <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] text-center mb-4">Octavos</h4>
                 {getKnockoutMatches('Octavos').slice(4, 8).map(m => <MiniMatchCard key={m.id} match={m} />)}
              </div>

              {/* Dieciseisavos (Lado Derecho) */}
              <div className="flex flex-col justify-between gap-8 py-20">
                <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] text-center mb-4">16avos</h4>
                {getKnockoutMatches('Dieciseisavos').slice(8, 16).map(m => <MiniMatchCard key={m.id} match={m} />)}
              </div>

            </div>

            {/* GRUPOS G - L (Derecha) */}
            <div className="grid grid-cols-2 gap-12">
              <div className="flex flex-col gap-12">
                {['G', 'H', 'I'].map(g => <GroupBlock key={g} groupLabel={g} />)}
              </div>
              <div className="flex flex-col gap-12">
                {['J', 'K', 'L'].map(g => <GroupBlock key={g} groupLabel={g} />)}
              </div>
            </div>

          </div>
        </TransformComponent>
        <Controls />
      </TransformWrapper>
    </div>
  );
}

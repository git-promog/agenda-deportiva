"use client";

import React from 'react';
import { MATCHES, getFlagUrl, WCMatch } from '@/data/mundialData';
import { Trophy } from 'lucide-react';

interface Props {
  onMatchClick: (match: WCMatch, hora: string, nota: string) => void;
  convertirHora: (match: any) => { hora: string; nota: string };
}

export default function WCBracket({ onMatchClick, convertirHora }: Props) {
  const getMatchById = (id: string) => MATCHES.find(m => m.id === id) || null;

  // Bracket flow matching the official FIFA tournament path
  const left16 = ['m73', 'm74', 'm75', 'm76', 'm83', 'm84', 'm81', 'm82'];
  const left8  = ['m89', 'm90', 'm93', 'm94'];
  const left4  = ['m97', 'm98'];
  const left2  = ['m101'];

  const right16 = ['m77', 'm78', 'm79', 'm80', 'm85', 'm86', 'm87', 'm88'];
  const right8  = ['m91', 'm92', 'm95', 'm96'];
  const right4  = ['m99', 'm100'];
  const right2  = ['m102'];

  const finalMatch = 'm104';
  const thirdMatch = 'm103';

  const BracketCard = ({ matchId }: { matchId: string }) => {
    const match = getMatchById(matchId);
    if (!match) return null;

    const flag1 = getFlagUrl(match.equipo1);
    const flag2 = getFlagUrl(match.equipo2);
    const { hora } = convertirHora(match);

    const hasPlayed = match.goles1 !== undefined && match.goles2 !== undefined;
    const isLive = false; // Add real status if needed

    // Bold the winner if the match has played
    const w1 = hasPlayed && match.goles1! > match.goles2!;
    const w2 = hasPlayed && match.goles2! > match.goles1!;

    return (
      <div 
        onClick={() => onMatchClick(match, hora, '')}
        className="group relative bg-slate-900/40 backdrop-blur-md border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/80 p-3 rounded-2xl flex flex-col gap-2.5 transition-all duration-300 cursor-pointer shadow-lg w-[180px] select-none"
      >
        {/* Match Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-1.5 px-0.5">
          <span className="text-[7px] font-black text-slate-500 uppercase tracking-wider">
            {new Date(match.fecha + 'T12:00:00').toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }).toUpperCase()} • {hora}
          </span>
          <span className="text-[6px] font-black text-blue-500/60 uppercase">#{match.id.toUpperCase()}</span>
        </div>

        {/* Teams & Scores */}
        <div className="flex flex-col gap-1.5">
          {/* Team 1 */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-4 h-4 rounded-full overflow-hidden border border-white/10 shrink-0">
                {flag1 ? <img src={flag1} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-800" />}
              </div>
              <span className={`text-[9px] uppercase truncate ${w1 ? 'font-black text-white' : hasPlayed ? 'text-slate-500 font-medium' : 'text-slate-300 font-bold'}`}>
                {match.equipo1}
              </span>
            </div>
            {hasPlayed && (
              <span className={`text-[9px] px-1.5 py-0.5 rounded border leading-none ${w1 ? 'font-black text-blue-400 bg-blue-500/10 border-blue-500/20' : 'font-medium text-slate-500 bg-slate-800/20 border-slate-800/40'}`}>
                {match.goles1}
              </span>
            )}
          </div>

          {/* Team 2 */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-4 h-4 rounded-full overflow-hidden border border-white/10 shrink-0">
                {flag2 ? <img src={flag2} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-800" />}
              </div>
              <span className={`text-[9px] uppercase truncate ${w2 ? 'font-black text-white' : hasPlayed ? 'text-slate-500 font-medium' : 'text-slate-300 font-bold'}`}>
                {match.equipo2}
              </span>
            </div>
            {hasPlayed && (
              <span className={`text-[9px] px-1.5 py-0.5 rounded border leading-none ${w2 ? 'font-black text-blue-400 bg-blue-500/10 border-blue-500/20' : 'font-medium text-slate-500 bg-slate-800/20 border-slate-800/40'}`}>
                {match.goles2}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="wc-bracket-wrapper w-full overflow-x-auto pb-12 scrollbar-hide">
      <div className="flex gap-10 min-w-[1300px] p-6 justify-center items-center">
        
        {/* LADO IZQUIERDO */}
        {/* Dieciseisavos (Izq) */}
        <div className="flex flex-col gap-6 justify-between py-10">
          <h4 className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] text-center mb-2">16avos</h4>
          {left16.map(id => <BracketCard key={id} matchId={id} />)}
        </div>

        {/* Octavos (Izq) */}
        <div className="flex flex-col gap-12 justify-around py-16">
          <h4 className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] text-center mb-2">Octavos</h4>
          {left8.map(id => <BracketCard key={id} matchId={id} />)}
        </div>

        {/* Cuartos (Izq) */}
        <div className="flex flex-col gap-24 justify-around py-24">
          <h4 className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] text-center mb-2">Cuartos</h4>
          {left4.map(id => <BracketCard key={id} matchId={id} />)}
        </div>

        {/* Semis (Izq) */}
        <div className="flex flex-col gap-32 justify-center">
          <h4 className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] text-center mb-2">Semis</h4>
          {left2.map(id => <BracketCard key={id} matchId={id} />)}
        </div>

        {/* CENTRO: GRAN FINAL & 3ER LUGAR */}
        <div className="flex flex-col gap-10 items-center px-4">
          {/* Final Area */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 p-6 rounded-[32px] shadow-2xl flex flex-col items-center gap-3">
            <Trophy size={36} className="text-yellow-500 animate-bounce" />
            <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em]">Gran Final</span>
            <BracketCard matchId={finalMatch} />
            <span className="text-[8px] font-black text-slate-500 uppercase">19 JUL • NY/NJ</span>
          </div>

          {/* 3er Lugar */}
          <div className="bg-slate-900/30 border border-slate-800 p-4 rounded-[24px] flex flex-col items-center gap-2">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">3er Lugar</span>
            <BracketCard matchId={thirdMatch} />
            <span className="text-[7px] font-black text-slate-600 uppercase">18 JUL • Miami</span>
          </div>
        </div>

        {/* LADO DERECHO */}
        {/* Semis (Der) */}
        <div className="flex flex-col gap-32 justify-center">
          <h4 className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] text-center mb-2">Semis</h4>
          {right2.map(id => <BracketCard key={id} matchId={id} />)}
        </div>

        {/* Cuartos (Der) */}
        <div className="flex flex-col gap-24 justify-around py-24">
          <h4 className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] text-center mb-2">Cuartos</h4>
          {right4.map(id => <BracketCard key={id} matchId={id} />)}
        </div>

        {/* Octavos (Der) */}
        <div className="flex flex-col gap-12 justify-around py-16">
          <h4 className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] text-center mb-2">Octavos</h4>
          {right8.map(id => <BracketCard key={id} matchId={id} />)}
        </div>

        {/* Dieciseisavos (Der) */}
        <div className="flex flex-col gap-6 justify-between py-10">
          <h4 className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] text-center mb-2">16avos</h4>
          {right16.map(id => <BracketCard key={id} matchId={id} />)}
        </div>

      </div>

      <div className="mt-8 p-6 bg-blue-600/5 border border-blue-500/10 rounded-[32px] text-center max-w-lg mx-auto">
        <p className="text-slate-400 text-xs italic">
          Haz clic en cualquier partido para ver canales de transmisión, horarios locales e información detallada de la sede.
        </p>
      </div>
    </div>
  );
}

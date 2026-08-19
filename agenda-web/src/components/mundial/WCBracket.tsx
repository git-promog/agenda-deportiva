"use client";

/* FIFA flag URLs are generated at runtime from external assets. */
/* eslint-disable @next/next/no-img-element */

import React from 'react';
import { MATCHES, getFlagUrl, WCMatch } from '@/data/mundialData';
import { Trophy } from 'lucide-react';

interface Props {
  onMatchClick: (match: WCMatch, hora: string, nota: string) => void;
  convertirHora: (match: WCMatch) => { hora: string; nota: string };
}

interface BracketCardProps {
  matchId: string;
  onMatchClick: Props['onMatchClick'];
  convertirHora: Props['convertirHora'];
}

function BracketCard({ matchId, onMatchClick, convertirHora }: BracketCardProps) {
  const match = MATCHES.find(m => m.id === matchId);
  if (!match) return null;

  const flag1 = getFlagUrl(match.equipo1);
  const flag2 = getFlagUrl(match.equipo2);
  const { hora } = convertirHora(match);
  const hasPlayed = match.goles1 !== undefined && match.goles2 !== undefined;
  const w1 = hasPlayed && match.goles1! > match.goles2!;
  const w2 = hasPlayed && match.goles2! > match.goles1!;
  const teamClass = (winner: boolean) =>
    `text-[9px] uppercase truncate ${winner ? 'font-black text-white' : hasPlayed ? 'text-slate-500 font-medium' : 'text-slate-300 font-bold'}`;
  const scoreClass = (winner: boolean) =>
    `text-[9px] px-1.5 py-0.5 rounded border leading-none ${winner ? 'font-black text-blue-400 bg-blue-500/10 border-blue-500/20' : 'font-medium text-slate-500 bg-slate-800/20 border-slate-800/40'}`;

  return (
    <div onClick={() => onMatchClick(match, hora, '')} className="group relative bg-slate-900/40 backdrop-blur-md border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/80 p-3 rounded-2xl flex flex-col gap-2.5 transition-all duration-300 cursor-pointer shadow-lg w-[180px] select-none">
      <div className="flex items-center justify-between border-b border-white/5 pb-1.5 px-0.5">
        <span className="text-[7px] font-black text-slate-500 uppercase tracking-wider">
          {new Date(match.fecha + 'T12:00:00').toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }).toUpperCase()} • {hora}
        </span>
        <span className="text-[6px] font-black text-blue-500/60 uppercase">#{match.id.toUpperCase()}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-4 h-4 rounded-full overflow-hidden border border-white/10 shrink-0">
              {flag1 ? <img src={flag1} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-800" />}
            </div>
            <span className={teamClass(w1)}>{match.equipo1}</span>
          </div>
          {hasPlayed && <span className={scoreClass(w1)}>{match.goles1}</span>}
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-4 h-4 rounded-full overflow-hidden border border-white/10 shrink-0">
              {flag2 ? <img src={flag2} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-800" />}
            </div>
            <span className={teamClass(w2)}>{match.equipo2}</span>
          </div>
          {hasPlayed && <span className={scoreClass(w2)}>{match.goles2}</span>}
        </div>
      </div>
    </div>
  );
}

export default function WCBracket({ onMatchClick, convertirHora }: Props) {
  const left16 = ['m73', 'm74', 'm75', 'm76', 'm83', 'm84', 'm81', 'm82'];
  const left8 = ['m89', 'm90', 'm93', 'm94'];
  const left4 = ['m97', 'm98'];
  const left2 = ['m101'];
  const right16 = ['m77', 'm78', 'm79', 'm80', 'm85', 'm86', 'm87', 'm88'];
  const right8 = ['m91', 'm92', 'm95', 'm96'];
  const right4 = ['m99', 'm100'];
  const right2 = ['m102'];
  const card = (id: string) => <BracketCard key={id} matchId={id} onMatchClick={onMatchClick} convertirHora={convertirHora} />;
  const round = (label: string, ids: string[], className: string) => (
    <div className={className}>
      <h4 className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] text-center mb-2">{label}</h4>
      {ids.map(card)}
    </div>
  );

  return (
    <div className="wc-bracket-wrapper w-full overflow-x-auto pb-12 scrollbar-hide">
      <div className="flex gap-10 min-w-[1300px] p-6 justify-start items-center">
        {round('16avos', left16, 'flex flex-col gap-6 justify-between py-10')}
        {round('Octavos', left8, 'flex flex-col gap-12 justify-around py-16')}
        {round('Cuartos', left4, 'flex flex-col gap-24 justify-around py-24')}
        {round('Semis', left2, 'flex flex-col gap-32 justify-center')}

        <div className="flex flex-col gap-10 items-center px-4">
          <div className="bg-yellow-500/10 border border-yellow-500/30 p-6 rounded-[32px] shadow-2xl flex flex-col items-center gap-3">
            <Trophy size={36} className="text-yellow-500 animate-bounce" />
            <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em]">Gran Final</span>
            <BracketCard matchId="m104" onMatchClick={onMatchClick} convertirHora={convertirHora} />
            <span className="text-[8px] font-black text-slate-500 uppercase">19 JUL • NY/NJ</span>
          </div>
          <div className="bg-slate-900/30 border border-slate-800 p-4 rounded-[24px] flex flex-col items-center gap-2">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">3er Lugar</span>
            <BracketCard matchId="m103" onMatchClick={onMatchClick} convertirHora={convertirHora} />
            <span className="text-[7px] font-black text-slate-600 uppercase">18 JUL • Miami</span>
          </div>
        </div>

        {round('Semis', right2, 'flex flex-col gap-32 justify-center')}
        {round('Cuartos', right4, 'flex flex-col gap-24 justify-around py-24')}
        {round('Octavos', right8, 'flex flex-col gap-12 justify-around py-16')}
        {round('16avos', right16, 'flex flex-col gap-6 justify-between py-10')}
      </div>
      <div className="mt-8 p-6 bg-blue-600/5 border border-blue-500/10 rounded-[32px] text-center max-w-lg mx-auto">
        <p className="text-slate-400 text-xs italic">Haz clic en cualquier partido para ver canales de transmisión, horarios locales e información detallada de la sede.</p>
      </div>
    </div>
  );
}

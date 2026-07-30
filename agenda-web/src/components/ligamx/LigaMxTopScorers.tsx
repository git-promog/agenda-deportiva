'use client';

import React from 'react';

export interface TopScorerRow {
  position: number;
  player_name: string;
  team_name: string;
  goals: number;
  minutes_played: number;
  scores_every_minutes: number;
}

interface Props {
  scorers: TopScorerRow[];
}

export default function LigaMxTopScorers({ scorers }: Props) {
  if (!scorers || scorers.length === 0) return null;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 mb-12 shadow-2xl backdrop-blur-md">
      <div className="mb-6">
        <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.25em]">Líderes de Goleo</span>
        <h2 className="text-2xl font-black italic uppercase tracking-tight text-white mt-1">
          Tabla de <span className="text-[#a3e635]">Goleo Individual</span>
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {scorers.map((scorer, idx) => (
          <div
            key={`${scorer.player_name}-${idx}`}
            className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-4 hover:border-blue-500/40 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-black text-blue-400 text-lg">
              {scorer.position || idx + 1}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-black italic uppercase text-sm text-white truncate leading-tight">
                {scorer.player_name}
              </h3>
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mt-0.5 truncate">
                {scorer.team_name}
              </p>
            </div>
            <div className="text-right">
              <span className="block text-xl font-black text-[#a3e635] leading-none">
                {scorer.goals}
              </span>
              <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">
                Goles
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

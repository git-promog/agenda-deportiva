'use client';

import React from 'react';

export interface StandingRow {
  position: number;
  team_name: string;
  team_slug: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
  synced_at?: string;
}

interface Props {
  standings: StandingRow[];
  syncedAt?: string;
}

export default function LigaMxStandings({ standings, syncedAt }: Props) {
  if (!standings || standings.length === 0) return null;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 mb-12 shadow-2xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <span className="text-[10px] font-black text-[#a3e635] uppercase tracking-[0.25em]">Estadísticas Oficiales</span>
          <h2 className="text-2xl font-black italic uppercase tracking-tight text-white mt-1">
            Tabla General <span className="text-blue-500">Liga MX</span>
          </h2>
        </div>
        {syncedAt && (
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50 self-start sm:self-auto">
            Act. {new Date(syncedAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
          </span>
        )}
      </div>

      {/* Leyenda Liguilla */}
      <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 mb-4 px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
          <span>Clasificación Directa (Top 6)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
          <span>Play-In (7-10)</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] font-black uppercase text-slate-500 tracking-wider">
              <th className="py-3 px-2 text-center w-10">Pos</th>
              <th className="py-3 px-3">Club</th>
              <th className="py-3 px-2 text-center">JJ</th>
              <th className="py-3 px-2 text-center hidden md:table-cell">JG</th>
              <th className="py-3 px-2 text-center hidden md:table-cell">JE</th>
              <th className="py-3 px-2 text-center hidden md:table-cell">JP</th>
              <th className="py-3 px-2 text-center hidden sm:table-cell">GF</th>
              <th className="py-3 px-2 text-center hidden sm:table-cell">GC</th>
              <th className="py-3 px-2 text-center">DIF</th>
              <th className="py-3 px-3 text-center text-white">PTS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {standings.map((row) => {
              const isDirect = row.position <= 6;
              const isPlayIn = row.position >= 7 && row.position <= 10;

              return (
                <tr
                  key={row.team_slug}
                  className="hover:bg-slate-800/30 transition-colors text-xs font-semibold text-slate-300"
                >
                  <td className="py-3 px-2 text-center font-black">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-[11px] ${
                        isDirect
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                          : isPlayIn
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'text-slate-500'
                      }`}
                    >
                      {row.position}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-white uppercase italic tracking-tight">
                    {row.team_name}
                  </td>
                  <td className="py-3 px-2 text-center text-slate-400">{row.played}</td>
                  <td className="py-3 px-2 text-center text-slate-400 hidden md:table-cell">{row.won}</td>
                  <td className="py-3 px-2 text-center text-slate-400 hidden md:table-cell">{row.drawn}</td>
                  <td className="py-3 px-2 text-center text-slate-400 hidden md:table-cell">{row.lost}</td>
                  <td className="py-3 px-2 text-center text-slate-400 hidden sm:table-cell">{row.goals_for}</td>
                  <td className="py-3 px-2 text-center text-slate-400 hidden sm:table-cell">{row.goals_against}</td>
                  <td className="py-3 px-2 text-center font-bold text-slate-300">
                    {row.goal_difference > 0 ? `+${row.goal_difference}` : row.goal_difference}
                  </td>
                  <td className="py-3 px-3 text-center font-black text-sm text-[#a3e635]">
                    {row.points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

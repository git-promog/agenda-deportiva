import React from 'react';
import { WCGroup, getFlagUrl } from '@/data/mundialData';

interface Props {
  grupo: WCGroup;
}

export default function WCGroupTable({ grupo }: Props) {
  return (
    <div className="bg-slate-900/30 backdrop-blur-md border border-white/5 rounded-[32px] overflow-hidden shadow-xl hover:border-blue-500/20 transition-all group/table">
      <div className="bg-gradient-to-r from-blue-600/10 to-transparent px-5 py-3 border-b border-white/5 flex justify-between items-center">
        <h3 className="text-[10px] font-black italic uppercase text-white tracking-[0.2em] flex items-center gap-2">
          <span className="bg-blue-600 text-white text-[9px] px-2 py-0.5 rounded-md not-italic tracking-normal shadow-lg shadow-blue-500/20">GRUPO</span>
          {grupo.nombre}
        </h3>
        <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest hidden sm:block">Avanzan 1º, 2º y los mejores 8 3º</span>
      </div>
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left text-[10px] whitespace-nowrap min-w-[380px]">
          <thead>
            <tr className="text-slate-500 uppercase font-black text-[9px] border-b border-white/5 bg-slate-950/20">
              <th className="px-4 py-3 tracking-widest">Equipo</th>
              <th className="px-2 py-3 text-center" title="Partidos Jugados">PJ</th>
              <th className="px-2 py-3 text-center" title="Ganados">G</th>
              <th className="px-2 py-3 text-center" title="Empatados">E</th>
              <th className="px-2 py-3 text-center" title="Perdidos">P</th>
              <th className="px-2 py-3 text-center" title="Goles a Favor">GF</th>
              <th className="px-2 py-3 text-center" title="Goles en Contra">GC</th>
              <th className="px-2 py-3 text-center" title="Diferencia de Goles">DG</th>
              <th className="px-4 py-3 text-center tracking-widest bg-blue-950/30 text-blue-400" title="Puntos">PTS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {grupo.equipos.map((equipo, idx) => {
              const flag = getFlagUrl(equipo.nombre);
              const pos = idx + 1;
              const dg = equipo.gf - equipo.gc;
              
              // Criterios de colores para calificación
              const directQualify = pos <= 2;
              const thirdPlace = pos === 3;
              
              let rowClass = "group transition-colors relative hover:bg-white/5";
              let posClass = "w-1.5 h-full absolute left-0 top-0 ";
              let numClass = "text-slate-600 font-black px-2";

              if (directQualify) {
                posClass += "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]";
                numClass = "text-blue-400 font-black px-2";
              } else if (thirdPlace) {
                posClass += "bg-yellow-500/50";
                numClass = "text-yellow-500 font-bold px-2";
              } else {
                posClass += "bg-transparent";
              }

              return (
                <tr key={idx} className={rowClass}>
                  <td className="relative px-2 py-3 flex items-center gap-2">
                    <div className={posClass}></div>
                    <span className={numClass}>{pos}</span>
                    {flag && <img src={flag} alt={equipo.nombre} className="w-5 h-5 rounded-full object-cover border border-white/10" />}
                    <span className={`uppercase font-black italic truncate max-w-[100px] sm:max-w-none ${directQualify ? 'text-white' : 'text-slate-300'}`}>
                      {equipo.nombre}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-center text-slate-400 font-bold">{equipo.pj}</td>
                  <td className="px-2 py-3 text-center text-slate-300">{equipo.pg}</td>
                  <td className="px-2 py-3 text-center text-slate-400">{equipo.pe}</td>
                  <td className="px-2 py-3 text-center text-slate-500">{equipo.pp}</td>
                  <td className="px-2 py-3 text-center text-slate-400">{equipo.gf}</td>
                  <td className="px-2 py-3 text-center text-slate-500">{equipo.gc}</td>
                  <td className="px-2 py-3 text-center font-bold text-slate-300">{dg > 0 ? `+${dg}` : dg}</td>
                  <td className="px-4 py-3 text-center text-blue-400 font-black bg-blue-950/10 text-xs">{equipo.pts}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

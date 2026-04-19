import React from 'react';
import { WCGroup, getFlagUrl } from '@/data/mundialData';

interface Props {
  grupo: WCGroup;
}

export default function WCGroupTable({ grupo }: Props) {
  return (
    <div className="bg-slate-900/30 backdrop-blur-md border border-white/5 rounded-[32px] overflow-hidden shadow-xl hover:border-blue-500/20 transition-all group/table">
      <div className="bg-gradient-to-r from-blue-600/10 to-transparent px-5 py-3 border-b border-white/5">
        <h3 className="text-[10px] font-black italic uppercase text-white tracking-[0.2em] flex items-center gap-2">
          <span className="bg-blue-600 text-white text-[9px] px-2 py-0.5 rounded-md not-italic tracking-normal">GRUPO</span>
          {grupo.nombre}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[10px] font-bold">
          <thead>
            <tr className="text-slate-500 uppercase tracking-widest border-b border-white/5">
              <th className="px-5 py-3">Equipo</th>
              <th className="px-2 py-3 text-center">PJ</th>
              <th className="px-2 py-3 text-center">G</th>
              <th className="px-2 py-3 text-center">PTS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {grupo.equipos.map((equipo, idx) => {
              const flag = getFlagUrl(equipo.nombre);
              return (
                <tr key={idx} className="hover:bg-blue-500/5 transition-colors group">
                  <td className="px-5 py-3 flex items-center gap-2">
                    <span className="text-slate-600 group-hover:text-blue-400 transition-colors w-2">{idx + 1}</span>
                    {flag && <img src={flag} alt={equipo.nombre} className="w-4 h-4 rounded-sm object-cover" />}
                    <span className="text-slate-200 group-hover:text-white uppercase italic truncate max-w-[80px]">{equipo.nombre}</span>
                  </td>
                  <td className="px-2 py-3 text-center text-slate-400">{equipo.pj}</td>
                  <td className="px-2 py-3 text-center text-slate-400">{equipo.pg}</td>
                  <td className="px-2 py-3 text-center text-blue-400 font-black">{equipo.pts}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

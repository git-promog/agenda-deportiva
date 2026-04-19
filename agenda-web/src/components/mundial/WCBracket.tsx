import React from 'react';

export default function WCBracket() {
  const phases = [
    { name: '16avos', count: 8 }, // Shown truncated for brevity
    { name: 'Octavos', count: 4 },
    { name: 'Cuartos', count: 2 },
    { name: 'Semis', count: 1 },
    { name: 'Final', count: 1 },
  ];

  return (
    <div className="w-full overflow-x-auto pb-8 scrollbar-hide">
      <div className="flex gap-8 min-w-[1000px] p-4">
        {phases.map((phase, pIdx) => (
          <div key={pIdx} className="flex-1 flex flex-col justify-around gap-4">
            <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-4 text-center">{phase.name}</h4>
            {Array.from({ length: phase.count }).map((_, i) => (
              <div key={i} className="relative">
                <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-2xl flex flex-col gap-2 shadow-lg">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-800/50 pb-2">
                    <span className="text-[10px] font-bold text-slate-400">TBD</span>
                    <span className="text-[10px] font-black text-blue-500">-</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-slate-400">TBD</span>
                    <span className="text-[10px] font-black text-blue-500">-</span>
                  </div>
                </div>
                {pIdx < phases.length - 1 && (
                   <div className="absolute top-1/2 -right-8 w-8 h-px bg-slate-800"></div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-8 p-6 bg-blue-600/5 border border-blue-500/10 rounded-[32px] text-center">
        <p className="text-slate-400 text-xs italic">La llave se actualizará automáticamente conforme avancen las posiciones de los grupos.</p>
      </div>
    </div>
  );
}

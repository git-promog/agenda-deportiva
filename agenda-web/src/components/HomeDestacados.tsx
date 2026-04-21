import React from 'react';
import { Star, Clock } from 'lucide-react';

interface Props {
  destacados: any[];
}

export default function HomeDestacados({ destacados }: Props) {
  if (!destacados || destacados.length === 0) return null;

  return (
    <div className="mb-12">
      <h2 className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2"><Star className="w-3 h-3 fill-yellow-500" /> Imperdibles de Hoy</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
        {destacados.map((e) => (
          <div key={e.id} className="min-w-[85vw] sm:min-w-[300px] bg-gradient-to-br from-blue-600 to-blue-900 justify-between p-[1px] rounded-3xl relative overflow-hidden group">
            <div className="bg-[#020617]/80 backdrop-blur-sm p-5 rounded-[23px] h-full flex flex-col justify-between italic text-white hover:bg-transparent transition-colors duration-500 relative z-10">
              <div>
                <div className="text-[9px] font-black text-blue-400 uppercase mb-2">{e.competicion}</div>
                <div className="text-lg font-black leading-tight mb-4 uppercase">{e.evento}</div>
              </div>
              <div className="flex justify-between items-center mt-4">
                 <div className="flex items-center gap-2 font-mono font-bold"><Clock className="w-4 h-4 text-blue-400" /> {e.hora}</div>
                 <div className="text-[10px] font-black text-[#a3e635] bg-[#a3e635]/20 px-3 py-1 rounded-lg border border-[#a3e635]/30 backdrop-blur-md">{e.canales}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

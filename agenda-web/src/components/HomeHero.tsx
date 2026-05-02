import React from 'react';
import { Tv, Clock } from 'lucide-react';
import ShareButton from '@/components/ShareButton';

const EMOJIS: { [key: string]: string } = {
  "Fútbol": "⚽️", "Básquetbol": "🏀", "Béisbol": "⚾️", "Fórmula 1": "🏎️", 
  "Motorismo": "🏍️", "Tenis": "🎾", "Fútbol Americano": "🏈", "Rugby": "🏉", 
  "Hockey": "🏒", "Combate": "🥊", "Ciclismo": "🚴", "Voleibol": "🏐", 
  "Golf": "⛳️", "Natación": "🏊", "Fútbol Sala": "👟", "Otros": "🏆"
};

interface Props {
  evento: any;
  tipo: string;
}

export default function HomeHero({ evento, tipo }: Props) {
  if (!evento) return null;

  return (
    <div className="mb-12 relative w-full h-[320px] md:h-[400px] rounded-[40px] group shadow-2xl border border-slate-800">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-[#020617] animate-pulse opacity-50"></div>
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:24px_24px]"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/80 to-transparent z-10"></div>
      <div className="absolute inset-0 z-20 flex flex-col justify-between p-8 md:p-12">
        <div className="flex justify-between items-start">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase border ${tipo === "EN VIVO AHORA" ? "bg-red-600 border-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)] animate-pulse" : "bg-blue-600/20 text-blue-400 border-blue-500/50"} backdrop-blur-md`}>
            {tipo === "EN VIVO AHORA" && <div className="w-2 h-2 bg-white rounded-full animate-ping mr-1"></div>}
            {tipo}
          </div>
          <ShareButton 
            titulo={evento.evento} 
            url={`https://www.guiasports.com/?evento=${evento.id}`} 
            variant="icon"
            className="!bg-white/10 !text-white !p-3 !rounded-full !hover:!bg-white/20"
          />
        </div>
        <div>
          <div className="text-[12px] font-black text-[#a3e635] uppercase tracking-widest mb-3 drop-shadow-lg flex items-center gap-2">
              <span className="text-2xl" suppressHydrationWarning>{EMOJIS[evento.deporte] || "🏆"}</span> {evento.competicion}
          </div>
          <h1 className="text-3xl md:text-5xl font-black italic uppercase text-white leading-none mb-6 drop-shadow-2xl">{evento.evento}</h1>
          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-[#a3e635] text-black px-6 py-3 rounded-2xl font-black text-sm uppercase italic flex items-center gap-2 shadow-[0_0_30px_rgba(163,230,53,0.3)]">
              <Tv size={18} /> {evento.canales}
            </div>
            <div className="bg-slate-900/80 border border-slate-700 backdrop-blur-md text-white px-6 py-3 rounded-2xl font-mono font-bold text-sm flex items-center gap-2">
              <Clock className="text-blue-400" size={18} /> {evento.hora}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -right-10 -bottom-10 text-[250px] md:text-[350px] opacity-[0.03] z-0 transform -rotate-12 pointer-events-none">{EMOJIS[evento.deporte] || "🏆"}</div>
    </div>
  );
}

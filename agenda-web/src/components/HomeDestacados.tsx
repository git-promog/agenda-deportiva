import React from 'react';
import { Star, Clock } from 'lucide-react';

const EMOJIS: { [key: string]: string } = {
  "Fútbol": "⚽️", "Básquetbol": "🏀", "Béisbol": "⚾️", "Fórmula 1": "🏎️", 
  "Motorismo": "🏍️", "Tenis": "🎾", "Fútbol Americano": "🏈", "Rugby": "🏉", 
  "Hockey": "🏒", "Combate": "🥊", "Ciclismo": "🚴", "Voleibol": "🏐", 
  "Golf": "⛳️", "Natación": "🏊", "Fútbol Sala": "👟", "Otros": "🏆"
};

interface Props {
  destacados: any[];
  onEventClick?: (evento: any) => void;
}

const GET_EXPERT = (deporte: string) => {
  const mapping: { [key: string]: { name: string, note: string } } = {
    "Fútbol": { name: "Ana Valeria Ruiz", note: "Clave táctica: El control del medio campo será determinante." },
    "Fórmula 1": { name: "Sergio Guerra", note: "Estrategia: El desgaste de neumáticos definirá el podio." },
    "Fútbol Americano": { name: "Ramón Ibarra", note: "Factor NFL: La defensa aérea es la prioridad hoy." },
    "Básquetbol": { name: "Paola Aguirre", note: "NBA Insight: Los tiros de larga distancia marcarán el ritmo." },
    "Boxeo": { name: "Esteban Rojas", note: "Ring Side: Se espera un combate de alto volumen de golpes." },
    "Tenis": { name: "Fernanda Guzmán", note: "Court Focus: La efectividad del primer servicio es vital." }
  };
  return mapping[deporte] || { name: "Redacción GuíaSports", note: "Cobertura completa en vivo por los canales indicados." };
};

export default function HomeDestacados({ destacados, onEventClick }: Props) {
  if (!destacados || destacados.length === 0) return null;

  return (
    <div className="mb-12">
      <h2 className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2 px-2"><Star className="w-3 h-3 fill-yellow-500" /> Imperdibles de Hoy</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
        {destacados.map((e) => (
          <div key={e.id} onClick={() => onEventClick?.(e)} className="min-w-[280px] w-[85vw] max-w-[340px] bg-gradient-to-br from-blue-600 to-blue-900 justify-between p-[1px] rounded-3xl relative overflow-hidden group flex-shrink-0 cursor-pointer">
            <div className="bg-[#020617]/80 backdrop-blur-sm p-5 rounded-[23px] h-full flex flex-col justify-between italic text-white hover:bg-transparent transition-colors duration-500 relative z-10">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[9px] font-black text-blue-400 uppercase">{e.competicion}</div>
                  <div className="text-xl opacity-80">{EMOJIS[e.deporte] || "🏆"}</div>
                </div>
                <div className="text-lg font-black leading-tight mb-2 uppercase line-clamp-2">{e.evento}</div>
              </div>
              <div className="flex justify-between items-center mt-4">
                 <div className="flex items-center gap-2 font-mono font-bold"><Clock className="w-4 h-4 text-blue-400" /> {e.hora}</div>
                 <div className="text-[10px] font-black text-[#a3e635] bg-[#a3e635]/20 px-3 py-1 rounded-lg border border-[#a3e635]/30 backdrop-blur-md">{e.canales}</div>
              </div>

              {/* EXPERT NOTE */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-blue-400">Análisis: {GET_EXPERT(e.deporte).name}</span>
                </div>
                <p className="text-[9px] text-slate-400 font-bold leading-relaxed line-clamp-1 italic">
                  "{GET_EXPERT(e.deporte).note}"
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Users, LayoutGrid, GitBranch, Trophy, ArrowRight } from 'lucide-react';

export default function WCFormat() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="py-8">
      <div className="text-center mb-12">
        <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-4">El Nuevo Formato</h2>
        <h3 className="text-3xl md:text-5xl font-black italic uppercase text-white leading-none">Más grande que nunca</h3>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Step 1: 48 Teams */}
        <motion.div variants={itemVariants} className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
            <Users size={200} />
          </div>
          <div className="bg-blue-600/20 p-6 rounded-3xl border border-blue-500/20 shrink-0">
            <span className="text-6xl font-black italic text-blue-400 leading-none">48</span>
          </div>
          <div>
            <h4 className="text-xl font-black uppercase text-white mb-2">Equipos Participantes</h4>
            <p className="text-slate-400 text-sm leading-relaxed">Por primera vez en la historia, el Mundial se expande de 32 a 48 selecciones. Esto permite una mayor representación global, dando oportunidad a más naciones de cumplir el sueño mundialista.</p>
          </div>
        </motion.div>

        {/* Step 2: 12 Groups */}
        <motion.div variants={itemVariants} className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute -left-10 -bottom-10 opacity-5 pointer-events-none">
            <LayoutGrid size={200} />
          </div>
          <div className="bg-yellow-500/20 p-6 rounded-3xl border border-yellow-500/20 shrink-0 md:order-2">
            <span className="text-6xl font-black italic text-yellow-400 leading-none">12</span>
          </div>
          <div className="md:order-1 md:text-right">
            <h4 className="text-xl font-black uppercase text-white mb-2">Grupos de 4 Equipos</h4>
            <p className="text-slate-400 text-sm leading-relaxed">Las 48 selecciones se dividirán en 12 grupos de 4 equipos cada uno. En esta fase, cada equipo jugará 3 partidos, manteniendo la esencia clásica de la fase de grupos para evitar colusiones en el último partido.</p>
          </div>
        </motion.div>

        {/* Step 3: Qualification */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-8 flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                <span className="text-green-400 font-black">1º</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                <span className="text-green-400 font-black">2º</span>
              </div>
            </div>
            <h4 className="text-lg font-black uppercase text-white mb-2">Clasificación Directa</h4>
            <p className="text-slate-400 text-xs">Los dos primeros lugares de cada uno de los 12 grupos avanzan directamente a la siguiente fase.</p>
          </div>
          
          <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-8 flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                <span className="text-orange-400 font-black">3º</span>
              </div>
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2">x 8</span>
            </div>
            <h4 className="text-lg font-black uppercase text-white mb-2">Mejores Terceros</h4>
            <p className="text-slate-400 text-xs">Los 8 mejores equipos que hayan terminado en tercer lugar en sus respectivos grupos también avanzarán.</p>
          </div>
        </motion.div>

        {/* Step 4: Knockouts */}
        <motion.div variants={itemVariants} className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-8 relative overflow-hidden text-center">
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <GitBranch size={300} />
          </div>
          <div className="relative z-10">
            <div className="inline-block bg-purple-500/20 px-6 py-2 rounded-full border border-purple-500/20 mb-6">
              <span className="text-sm font-black uppercase tracking-widest text-purple-400">Ronda de Dieciseisavos</span>
            </div>
            <h4 className="text-2xl font-black uppercase text-white mb-4">Un partido adicional</h4>
            <p className="text-slate-400 text-sm leading-relaxed max-w-2xl mx-auto mb-8">Debido al aumento de clasificados (32 equipos en total), se introduce una nueva ronda eliminatoria antes de los Octavos de Final. Esto significa que el equipo campeón tendrá que jugar 8 partidos en total (en lugar de 7).</p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <span className="bg-slate-800 px-3 py-2 rounded-xl">Dieciseisavos (32)</span>
              <ArrowRight size={14} />
              <span className="bg-slate-800 px-3 py-2 rounded-xl">Octavos (16)</span>
              <ArrowRight size={14} />
              <span className="bg-slate-800 px-3 py-2 rounded-xl">Cuartos (8)</span>
              <ArrowRight size={14} />
              <span className="bg-slate-800 px-3 py-2 rounded-xl">Semifinal (4)</span>
              <ArrowRight size={14} />
              <span className="bg-yellow-500/20 text-yellow-500 px-3 py-2 rounded-xl border border-yellow-500/30 flex items-center gap-1">
                <Trophy size={12} /> Final
              </span>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}

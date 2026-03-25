import Link from 'next/link';
import { Trophy, ArrowLeft, Users } from 'lucide-react';

export default function QuienesSomos() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans p-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-blue-500 text-xs font-black uppercase tracking-widest mb-10 hover:text-blue-400">
          <ArrowLeft size={16} /> Volver al inicio
        </Link>

        <header className="text-center mb-16">
          <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-blue-900/40">
            <Users className="text-white" size={24} />
          </div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            Sobre <span className="text-blue-500">Nosotros</span>
          </h1>
        </header>

        <div className="grid gap-8">
          <div className="bg-slate-900/30 border border-slate-800/60 p-8 rounded-3xl">
            <h2 className="text-blue-500 font-black italic uppercase mb-4 tracking-widest">Nuestra Misión</h2>
            <p className="text-slate-400 leading-relaxed italic">
              "Ayudar a los aficionados mexicanos a encontrar su pasión, sin importar en qué plataforma se transmita."
            </p>
          </div>

          <div className="space-y-6 text-slate-400 leading-relaxed px-4">
            <p>
              Agenda Deportiva MX nació de la frustración de no saber en qué canal o aplicación pasaban los partidos de nuestra liga y deportes favoritos. Con la fragmentación de los derechos de transmisión en México, decidimos crear una herramienta simple, rápida y automática.
            </p>
            <p>
              Nuestra tecnología de recolección de datos asegura que siempre tengas la información actualizada de más de 10 deportes, incluyendo Liga MX, NBA, MLB, F1 y mucho más.
            </p>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/20 p-8 rounded-3xl flex items-center gap-6">
             <Trophy className="text-blue-500 shrink-0" size={40} />
             <p className="text-xs font-bold text-blue-400 uppercase tracking-widest leading-relaxed">
               Somos la guía deportiva más rápida de México, optimizada para aficionados de verdad.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
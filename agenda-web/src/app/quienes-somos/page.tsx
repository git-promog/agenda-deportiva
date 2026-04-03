import Link from 'next/link';
import { Trophy, ArrowLeft, Users } from 'lucide-react';
import NextImage from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Quiénes Somos | GuíaSports - La Guía Deportiva de México",
  description: "Conoce la misión de GuíaSports: ayudar a los aficionados mexicanos a encontrar dónde ver sus deportes favoritos en TV y streaming.",
  alternates: {
    canonical: "https://www.guiasports.com/quienes-somos",
  },
  openGraph: {
    title: "Quiénes Somos | GuíaSports",
    description: "Conoce la misión de GuíaSports: la guía deportiva más rápida de México.",
    type: "website",
    locale: "es_MX",
    url: "https://www.guiasports.com/quienes-somos",
  },
};

export default function QuienesSomos() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans p-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-blue-500 text-xs font-black uppercase tracking-widest mb-10 hover:text-blue-400">
          <ArrowLeft size={16} /> Volver al inicio
        </Link>

        <header className="text-center mb-16">
          <div className="flex justify-center mb-12 w-full">
            <NextImage src="/GuiaSports-logo.svg" alt="GuíaSports" width={240} height={60} priority className="h-12 w-auto drop-shadow-2xl" />
          </div>

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
              &quot;Ayudar a los aficionados mexicanos a encontrar su pasión, sin importar en qué plataforma se transmita.&quot;
            </p>
          </div>

          <div className="space-y-6 text-slate-400 leading-relaxed px-4">
            <p>
              <strong className="text-white">GuíaSports</strong> nació de la necesidad y frustración de no saber en qué canal o aplicación pasaban los partidos de nuestra liga o deportes favoritos. Ante la fragmentación de los derechos de transmisión televisivos y plataformas de streaming en México, decidimos crear la herramienta definitiva: simple, rápida e intuitiva.
            </p>
            <p>
              A través de nuestra tecnología aseguramos que siempre tengas la cartelera conectada y actualizada al minuto, con coberturas para más de 10 disciplinas incluyendo Liga MX, Champions League, ligas europeas, NBA, MLB, Fórmula 1, NFL y eventos internacionales especiales.
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

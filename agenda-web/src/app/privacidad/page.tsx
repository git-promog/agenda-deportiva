import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';
import NextImage from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Política de Privacidad | GuíaSports",
  description: "Conoce cómo GuíaSports protege tu privacidad y utiliza cookies para mejorar tu experiencia. Tu información personal está segura con nosotros.",
  alternates: {
    canonical: "https://www.guiasports.com/privacidad",
  },
  openGraph: {
    title: "Política de Privacidad | GuíaSports",
    description: "Conoce cómo protegemos tu privacidad en GuíaSports.",
    type: "website",
    locale: "es_MX",
    url: "https://www.guiasports.com/privacidad",
  },
};

export default function Privacidad() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans p-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-blue-500 text-xs font-black uppercase tracking-widest mb-10 hover:text-blue-400 transition-colors">
          <ArrowLeft size={16} /> Volver al inicio
        </Link>

        <header className="mb-12">
          <div className="flex justify-start mb-10 w-full">
            <NextImage src="/GuiaSports-logo.svg" alt="GuíaSports" width={220} height={55} priority className="h-10 w-auto" />
          </div>

          <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-900/40">
            <Shield className="text-white" size={24} />
          </div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            Política de <span className="text-blue-500">Privacidad</span>
          </h1>
          <p className="text-slate-500 text-sm mt-4 font-medium uppercase tracking-widest">Última actualización: Marzo 2024</p>
        </header>

        <article className="prose prose-invert max-w-none bg-slate-900/30 border border-slate-800/60 rounded-3xl p-8 md:p-12 text-slate-400 leading-relaxed space-y-6">
          {/* TEXTO DE USO */}
          <h2 className="text-xl font-bold text-white uppercase italic">1. Información que recolectamos</h2>
          <p>
            En <strong className="text-white">GuíaSports</strong>, la privacidad de nuestros usuarios es una absoluta prioridad. No exigimos creación de perfiles, ni formularios de recolección de datos personales como correos o nombres para realizar la consulta gratuita de nuestra programación deportiva. Toda navegación es libre.
          </p>
          
          <h2 className="text-xl font-bold text-white uppercase italic">2. Uso de Cookies</h2>
          <p>
            Utilizamos cookies técnicas para mejorar la experiencia de navegación y herramientas de análisis como Google Analytics para entender el tráfico de nuestro sitio.
          </p>
          
          <h2 className="text-xl font-bold text-white uppercase italic">3. Publicidad de Terceros</h2>
          <p>
            Utilizamos servicios de publicidad de terceros (como Google AdSense) que pueden utilizar cookies para mostrar anuncios basados en tus visitas anteriores.
          </p>

          <div className="pt-10 border-t border-slate-800">
            <p className="italic text-xs">Si tienes dudas sobre esta política, puedes contactarnos en la sección correspondiente.</p>
          </div>
        </article>
      </div>
    </div>
  );
}
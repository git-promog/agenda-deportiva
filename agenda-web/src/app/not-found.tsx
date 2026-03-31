import Link from 'next/link';
import NextImage from 'next/image';
import { ArrowLeft, Search, Radio } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Página no encontrada | GuíaSports",
  description: "La página que buscas no existe. Vuelve a la agenda deportiva de GuíaSports.",
  alternates: {
    canonical: "https://www.guiasports.com/404",
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full text-center">
        <NextImage src="/GuiaSports-logo.svg" alt="GuíaSports" width={180} height={50} className="mx-auto mb-12 opacity-40" />
        
        <div className="text-[120px] md:text-[160px] font-black leading-none text-slate-800 select-none mb-4">
          404
        </div>
        
        <h1 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter mb-4">
          Página no <span className="text-blue-500">encontrada</span>
        </h1>
        
        <p className="text-slate-500 text-sm mb-10 max-w-md mx-auto">
          El contenido que buscas no existe o fue movido. Pero no te preocupes, la agenda deportiva te espera.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black py-4 px-8 rounded-2xl transition-all uppercase tracking-widest text-xs italic shadow-lg shadow-blue-900/40">
            <Radio size={16} /> Ver Agenda
          </Link>
          <Link href="/noticias" className="flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-black py-4 px-8 rounded-2xl transition-all uppercase tracking-widest text-xs">
            <Search size={16} /> Noticias
          </Link>
        </div>

        <Link href="/" className="inline-flex items-center gap-2 text-blue-500 text-[10px] font-black uppercase tracking-widest mt-12 hover:text-blue-400 transition-colors">
          <ArrowLeft size={14} /> Volver al inicio
        </Link>
      </div>
    </div>
  );
}

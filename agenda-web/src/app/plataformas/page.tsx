import Link from 'next/link';
import { Tv, ChevronRight, Info, CheckCircle2 } from 'lucide-react';
import { Metadata } from 'next';
import { PLATFORMS } from '@/data/platformsData';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: "Plataformas de Streaming Deportivo en México | GuíaSports",
  description: "Compara precios y contenido de ViX, Disney+, ESPN, Fox Sports y más. La guía definitiva para saber dónde contratar tus deportes favoritos.",
  alternates: {
    canonical: "https://www.guiasports.com/plataformas",
  },
};

export default function PlataformasPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-24">
      <div className="max-w-4xl mx-auto px-6 pt-10">
        <Breadcrumbs items={[]} current="Plataformas" />

        <header className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-600/10 p-4 rounded-2xl border border-blue-500/20 text-4xl">
              📺
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black italic uppercase leading-[0.95] tracking-tighter">
                Guía de <span className="text-blue-500">Plataformas</span>
              </h1>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
                Dónde ver deportes en México (2026)
              </p>
            </div>
          </div>
          <p className="text-slate-400 max-w-2xl leading-relaxed">
            La fragmentación de los derechos deportivos hace que sea difícil saber qué plataforma contratar. Aquí comparamos las mejores opciones para que no te pierdas ningún partido.
          </p>
        </header>

        <div className="grid gap-6">
          {PLATFORMS.map((platform) => (
            <Link 
              key={platform.id} 
              href={`/plataformas/${platform.slug}`}
              className="group relative overflow-hidden bg-slate-900/30 border border-slate-800 rounded-[32px] p-6 md:p-8 hover:border-blue-500/30 transition-all flex flex-col md:flex-row gap-6 items-center"
            >
              {/* Background Glow */}
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${platform.color} opacity-5 blur-[80px] rounded-full transform translate-x-1/2 -translate-y-1/2 group-hover:opacity-10 transition-opacity`}></div>
              
              {/* Platform Logo/Icon */}
              <div className={`w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br ${platform.color} flex items-center justify-center text-4xl shadow-2xl relative z-10 shrink-0`}>
                 <span className="font-black italic text-white drop-shadow-lg">{platform.name.charAt(0)}</span>
              </div>

              <div className="flex-1 text-center md:text-left relative z-10">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                  <h2 className="text-2xl font-black italic uppercase text-white">{platform.name}</h2>
                  <span className="bg-slate-800 text-slate-400 text-[9px] font-black uppercase px-2 py-1 rounded border border-slate-700 tracking-widest">
                    {platform.price}
                  </span>
                </div>
                
                <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">
                  {platform.description}
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {platform.keyContent.slice(0, 3).map((item, i) => (
                    <span key={i} className="text-[9px] font-black text-blue-400 bg-blue-500/5 px-3 py-1.5 rounded-full border border-blue-500/10 uppercase tracking-widest">
                      {item}
                    </span>
                  ))}
                  {platform.keyContent.length > 3 && (
                    <span className="text-[9px] font-black text-slate-500 px-3 py-1.5 rounded-full border border-slate-800 uppercase tracking-widest">
                      +{platform.keyContent.length - 3} más
                    </span>
                  )}
                </div>
              </div>

              <div className="shrink-0 relative z-10">
                 <div className="bg-slate-800 p-4 rounded-2xl group-hover:bg-blue-600 transition-colors">
                    <ChevronRight className="text-slate-500 group-hover:text-white" size={20} />
                 </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-16 p-8 bg-slate-900/50 border border-slate-800 rounded-3xl flex items-start gap-4">
          <Info className="text-blue-500 shrink-0" size={20} />
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
            GuíaSports no tiene afiliación directa con estas plataformas salvo que se indique lo contrario. Los precios y contenidos pueden cambiar según las políticas de cada proveedor.
          </p>
        </div>
      </div>
    </div>
  );
}

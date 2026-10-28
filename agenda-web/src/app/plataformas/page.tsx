import Link from 'next/link';
import { ChevronRight, Info } from 'lucide-react';
import { Metadata } from 'next';
import { PLATFORMS } from '@/data/platformsData';
import Breadcrumbs from '@/components/Breadcrumbs';
import NextImage from 'next/image';

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
        <Breadcrumbs items={[]} current="Plataformas" currentHref="/plataformas" />

        <header className="gs-hub-header">
          <div className="gs-hub-identity">
            <div className="gs-hub-icon-box" aria-hidden="true">
              📺
            </div>
            <div className="min-w-0">
              <h1 className="gs-hub-title gs-hub-title-blue">
                Guía de <strong>Plataformas</strong>
              </h1>
              <p className="gs-hub-subtitle">Dónde ver deportes en México (2026)</p>
            </div>
          </div>
          <p className="max-w-2xl leading-relaxed text-slate-400">
            La fragmentación de los derechos deportivos hace que sea difícil saber qué plataforma contratar. Aquí comparamos las mejores opciones para que no te pierdas ningún partido.
          </p>
        </header>

        <div className="grid gap-6">
          {PLATFORMS.map((platform) => (
            <Link
              key={platform.id}
              href={`/plataformas/${platform.slug}`}
              className="gs-card gs-card-interactive group flex flex-col items-center gap-6 p-6 md:flex-row md:p-8"
            >
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-slate-950/40 md:h-32 md:w-32">
                 {platform.logo ? (
                   <div className="relative flex h-full w-full items-center justify-center p-4">
                     <NextImage
                       src={platform.logo}
                       alt={platform.name}
                       fill
                       sizes="128px"
                       className="max-h-full max-w-full object-contain"
                     />
                   </div>
                 ) : (
                   <span className="text-4xl font-black text-white">{platform.name.charAt(0)}</span>
                 )}
              </div>

              <div className="min-w-0 flex-1 text-center md:text-left">
                <div className="mb-3 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                  <h2 className="text-2xl font-black text-white">{platform.name}</h2>
                  <span className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-300">
                    {platform.price}
                  </span>
                </div>

                <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-slate-400">
                  {platform.description}
                </p>

                <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                  {platform.keyContent.slice(0, 3).map((item, i) => (
                    <span key={i} className="rounded-full border border-blue-500/10 bg-blue-500/5 px-3 py-1.5 text-[10px] font-semibold text-blue-300">
                      {item}
                    </span>
                  ))}
                  {platform.keyContent.length > 3 && (
                    <span className="rounded-full border border-slate-800 px-3 py-1.5 text-[10px] font-semibold text-slate-400">
                      +{platform.keyContent.length - 3} más
                    </span>
                  )}
                </div>
              </div>

              <div className="shrink-0">
                 <div className="rounded-xl bg-slate-800 p-3 transition-colors group-hover:bg-blue-600">
                    <ChevronRight className="text-slate-400 group-hover:text-white" size={20} />
                 </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-16 flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <Info className="shrink-0 text-blue-400" size={20} />
          <p className="text-xs leading-relaxed text-slate-400">
            GuíaSports no tiene afiliación directa con estas plataformas salvo que se indique lo contrario. Los precios y contenidos pueden cambiar según las políticas de cada proveedor.
          </p>
        </div>
      </div>
    </div>
  );
}

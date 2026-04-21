import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import NextImage from 'next/image';
import { Metadata } from 'next';
import { Newspaper, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Noticias Deportivas y Dónde Ver Partidos Hoy | GuíaSports",
  description: "Lee las mejores previas, análisis y noticias deportivas de México. Fútbol, F1, MLB, NBA y más. Información actualizada sobre dónde ver deportes en vivo.",
  openGraph: {
    title: "Noticias Deportivas y Dónde Ver Partidos Hoy | GuíaSports",
    description: "Lee las mejores previas, análisis y noticias deportivas de México. Fútbol, F1, MLB, NBA y más.",
    type: "website",
    locale: "es_MX",
  },
};

const NOTICIAS_POR_PAGINA = 12;

export default async function NoticiasIndex({
  searchParams,
}: {
  searchParams: Promise<{ pagina?: string }>;
}) {
  const { pagina } = await searchParams;
  const paginaActual = Math.max(1, parseInt(pagina || "1", 10) || 1);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { count: totalNoticias } = await supabase
    .from('noticias')
    .select('*', { count: 'exact', head: true });

  const { data: noticias } = await supabase
    .from('noticias')
    .select('*')
    .order('fecha', { ascending: false })
    .range((paginaActual - 1) * NOTICIAS_POR_PAGINA, paginaActual * NOTICIAS_POR_PAGINA - 1);

  const totalPaginas = Math.ceil((totalNoticias || 0) / NOTICIAS_POR_PAGINA);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Noticias y Previas Deportivas | GuíaSports",
    "description": "Lee las mejores previas, análisis y noticias deportivas de México.",
    "url": "https://www.guiasports.com/noticias",
    "inLanguage": "es-MX",
    "publisher": {
      "@type": "Organization",
      "name": "GuíaSports",
      "url": "https://www.guiasports.com"
    },
    "itemListElement": noticias?.map((n: any, index: number) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Article",
        "headline": n.titulo,
        "datePublished": n.fecha,
        "url": `https://www.guiasports.com/noticias/${n.slug}`,
        "image": n.imagen_url || undefined,
      }
    })) || []
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-24">
        <div className="max-w-4xl mx-auto px-4 pt-10">
          <Breadcrumbs items={[]} current="Noticias" />

          <header className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-[#a3e635]/10 p-4 rounded-2xl border border-[#a3e635]/20">
                <Newspaper className="text-[#a3e635]" size={32} />
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-black italic uppercase leading-[0.95] tracking-tighter">
                  Noticias y <span className="text-[#a3e635]">Previas</span>
                </h1>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
                  Análisis, horarios y dónde ver
                </p>
              </div>
            </div>
          </header>

          {noticias && noticias.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {noticias.map((n: any, idx: number) => (
                  <Link key={n.id} href={`/noticias/${n.slug}`} className="group bg-slate-900/50 border border-slate-800/50 rounded-[32px] overflow-hidden hover:border-slate-700 hover:bg-slate-900/80 transition-all duration-300">
                    {n.imagen_url ? (
                      <div className="w-full h-44 overflow-hidden relative">
                        <NextImage
                          src={n.imagen_url}
                          alt={n.titulo}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority={idx < 2}
                          loading={idx < 2 ? undefined : "lazy"}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60"></div>
                      </div>
                    ) : (
                      <div className="w-full h-44 bg-gradient-to-br from-blue-600/20 to-blue-900/20 flex items-center justify-center border-b border-slate-800/50">
                        <Newspaper size={48} className="text-blue-500/30" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-[9px] text-[#a3e635] font-black uppercase tracking-widest mb-3">
                        <Calendar size={10} /> {n.fecha}
                      </div>
                      <h2 className="font-black italic uppercase text-base leading-tight mb-3 text-white group-hover:text-blue-400 transition-colors line-clamp-3">
                        {n.titulo}
                      </h2>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                        Leer más →
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPaginas > 1 && (
                <div className="flex justify-center items-center gap-3 mt-12 mb-8">
                  {paginaActual > 1 && (
                    <Link href={`/noticias?pagina=${paginaActual - 1}`} className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:border-slate-700 transition-colors">
                      <ChevronLeft size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Anterior</span>
                    </Link>
                  )}

                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
                      <Link
                        key={p}
                        href={`/noticias?pagina=${p}`}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-colors ${p === paginaActual ? 'bg-[#a3e635] text-black' : 'bg-slate-900 text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}
                      >
                        {p}
                      </Link>
                    ))}
                  </div>

                  {paginaActual < totalPaginas && (
                    <Link href={`/noticias?pagina=${paginaActual + 1}`} className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:border-slate-700 transition-colors">
                      <span className="text-[10px] font-black uppercase tracking-widest">Siguiente</span>
                      <ChevronRight size={16} />
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-16 text-center text-slate-500">
              <Newspaper size={64} className="mx-auto mb-6 opacity-30" />
              <p className="font-bold text-lg mb-2 text-slate-400">No hay noticias aún</p>
              <p className="text-sm">Pronto publicaremos las mejores previas deportivas.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

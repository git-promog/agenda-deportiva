import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import NextImage from 'next/image';
import { Metadata } from 'next';
import { Newspaper, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import type { Noticia } from '@/types';

export const revalidate = 3600;

const NOTICIAS_POR_PAGINA = 12;
const SITE_URL = "https://www.guiasports.com";
const NOTICIAS_URL = `${SITE_URL}/noticias`;

function getPaginaActual(pagina?: string) {
  return Math.max(1, parseInt(pagina || "1", 10) || 1);
}

function getNoticiasCanonical(paginaActual: number) {
  return paginaActual > 1 ? `${NOTICIAS_URL}?pagina=${paginaActual}` : NOTICIAS_URL;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ pagina?: string }>;
}): Promise<Metadata> {
  const { pagina } = await searchParams;
  const canonical = getNoticiasCanonical(getPaginaActual(pagina));

  return {
    title: "Noticias Deportivas y Dónde Ver Partidos Hoy | GuíaSports",
    description: "Lee las mejores previas, análisis y noticias deportivas de México. Fútbol, F1, MLB, NBA y más. Información actualizada sobre dónde ver deportes en vivo.",
    alternates: {
      canonical,
    },
    openGraph: {
      title: "Noticias Deportivas y Dónde Ver Partidos Hoy | GuíaSports",
      description: "Lee las mejores previas, análisis y noticias deportivas de México. Fútbol, F1, MLB, NBA y más.",
      type: "website",
      locale: "es_MX",
      url: canonical,
    },
  };
}

export default async function NoticiasIndex({
  searchParams,
}: {
  searchParams: Promise<{ pagina?: string }>;
}) {
  const { pagina } = await searchParams;
  const paginaActual = getPaginaActual(pagina);
  const canonical = getNoticiasCanonical(paginaActual);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { count: totalNoticias } = await supabase
    .from('noticias')
    .select('id', { count: 'estimated', head: true });

  const { data: noticias } = await supabase
    .from('noticias')
    .select('id, titulo, slug, imagen_url, fecha, autor')
    .order('fecha', { ascending: false })
    .range((paginaActual - 1) * NOTICIAS_POR_PAGINA, paginaActual * NOTICIAS_POR_PAGINA - 1);

  const totalPaginas = Math.max(
    1,
    Math.ceil((totalNoticias || 0) / NOTICIAS_POR_PAGINA),
    noticias && noticias.length === NOTICIAS_POR_PAGINA ? paginaActual + 1 : paginaActual,
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Noticias y Previas Deportivas | GuíaSports",
    "description": "Lee las mejores previas, análisis y noticias deportivas de México.",
    "url": canonical,
    "inLanguage": "es-MX",
    "publisher": {
      "@type": "Organization",
      "name": "GuíaSports",
      "url": "https://www.guiasports.com"
    },
    "itemListElement": noticias?.map((n: Noticia, index: number) => ({
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
        <div className="max-w-4xl mx-auto px-4 pt-8">
          <Breadcrumbs items={[]} current="Noticias" currentHref="/noticias" />

          <header className="gs-hub-header">
            <div className="gs-hub-identity">
              <div className="gs-hub-icon-box" aria-hidden="true">
                <Newspaper className="text-[#a3e635]" size={28} />
              </div>
              <div>
                <h1 className="gs-hub-title">
                  Noticias y <strong>Previas</strong>
                </h1>
                <p className="gs-hub-subtitle">
                  Análisis, horarios y transmisiones en vivo
                </p>
              </div>
            </div>

            <nav aria-label="Temas y deportes" className="gs-hub-quicklinks">
              <span className="gs-hub-quicklink gs-hub-quicklink-active">
                Todas las noticias
              </span>
              <Link href="/futbol" className="gs-hub-quicklink">
                ⚽️ Fútbol
              </Link>
              <Link href="/nba" className="gs-hub-quicklink">
                🏀 NBA
              </Link>
              <Link href="/mlb" className="gs-hub-quicklink">
                ⚾️ MLB
              </Link>
              <Link href="/f1" className="gs-hub-quicklink">
                🏎️ F1
              </Link>
              <Link href="/mundial-2026" className="gs-hub-quicklink">
                🏆 Mundial 2026
              </Link>
            </nav>
          </header>

          {noticias && noticias.length > 0 ? (
            <>
              {paginaActual === 1 && noticias[0] && (
                <Link
                  href={`/noticias/${noticias[0].slug}`}
                  className="gs-news-hero group"
                >
                  <div className="gs-news-hero-media">
                    {noticias[0].imagen_url ? (
                      <NextImage
                        src={noticias[0].imagen_url}
                        alt={noticias[0].titulo}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 55vw"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-700 bg-slate-900">
                        <Newspaper size={56} />
                      </div>
                    )}
                  </div>
                  <div className="gs-news-hero-body">
                    <div>
                      <div className="gs-news-meta mb-2">
                        <span className="gs-badge gs-badge-live">Destacado</span>
                        <span className="gs-news-meta-date">
                          <Calendar size={12} /> {noticias[0].fecha}
                        </span>
                        {noticias[0].autor && (
                          <span>Por: {noticias[0].autor}</span>
                        )}
                      </div>
                      <h2 className="gs-news-hero-title group-hover:text-blue-400 transition-colors">
                        {noticias[0].titulo}
                      </h2>
                    </div>
                    <div>
                      <span className="gs-button gs-button-primary">
                        Leer análisis completo →
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              <div className="gs-news-grid">
                {(paginaActual === 1 ? noticias.slice(1) : noticias).map((n: Noticia, idx: number) => (
                  <Link
                    key={n.id}
                    href={`/noticias/${n.slug}`}
                    className="gs-news-card group"
                  >
                    <div className="gs-news-card-media">
                      {n.imagen_url ? (
                        <NextImage
                          src={n.imagen_url}
                          alt={n.titulo}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          loading={paginaActual === 1 && idx < 2 ? "eager" : "lazy"}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-700 bg-slate-900">
                          <Newspaper size={40} />
                        </div>
                      )}
                    </div>
                    <div className="gs-news-card-body">
                      <div className="gs-news-meta">
                        <span className="gs-news-meta-date">
                          <Calendar size={11} /> {n.fecha}
                        </span>
                        {n.autor && <span>Por: {n.autor}</span>}
                      </div>
                      <h2 className="gs-news-title group-hover:text-blue-400 transition-colors line-clamp-3">
                        {n.titulo}
                      </h2>
                      <p className="text-[11px] font-bold text-slate-400 mt-auto uppercase tracking-wider group-hover:text-white transition-colors">
                        Leer más →
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPaginas > 1 && (
                <nav aria-label="Paginación de noticias" className="flex flex-wrap justify-center items-center gap-3 mt-12 mb-8">
                  {paginaActual > 1 && (
                    <Link
                      href={`/noticias?pagina=${paginaActual - 1}`}
                      className="gs-button gs-button-quiet"
                      aria-label="Página anterior"
                    >
                      <ChevronLeft size={16} />
                      <span>Anterior</span>
                    </Link>
                  )}

                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
                      <Link
                        key={p}
                        href={`/noticias?pagina=${p}`}
                        aria-current={p === paginaActual ? "page" : undefined}
                        className={`w-11 h-11 rounded-md flex items-center justify-center text-xs font-black transition-colors ${
                          p === paginaActual
                            ? 'bg-[var(--gs-color-lime)] text-slate-950 shadow-sm'
                            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        {p}
                      </Link>
                    ))}
                  </div>

                  {paginaActual < totalPaginas && (
                    <Link
                      href={`/noticias?pagina=${paginaActual + 1}`}
                      className="gs-button gs-button-quiet"
                      aria-label="Página siguiente"
                    >
                      <span>Siguiente</span>
                      <ChevronRight size={16} />
                    </Link>
                  )}
                </nav>
              )}
            </>
          ) : (
            <div className="gs-state">
              <Newspaper size={48} className="mx-auto mb-4 opacity-40 text-slate-500" />
              <p className="font-bold text-base mb-1 text-slate-300">No hay noticias publicadas aún</p>
              <p className="text-xs text-slate-400">Pronto publicaremos las mejores previas y análisis deportivos.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

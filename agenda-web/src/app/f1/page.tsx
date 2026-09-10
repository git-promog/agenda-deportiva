import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import NextImage from 'next/image';
import { Metadata } from 'next';
import { Calendar } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import EventListWithModal from '@/components/EventListWithModal';
import { getTodayMexicoString } from '@/lib/mexicoTime';
import { deduplicateEventos } from '@/lib/eventUrls';
import type { Evento, Noticia } from '@/types';

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Fórmula 1 en Vivo | Horarios y Dónde Ver GP Hoy en México | GuíaSports",
  description: "Dónde ver la F1 en vivo hoy en México. Horarios, carreras, prácticas y clasificaciones de Fórmula 1.",
  alternates: {
    canonical: "https://www.guiasports.com/f1",
  },
  openGraph: {
    title: "Fórmula 1 en Vivo | GuíaSports México",
    description: "Horarios y canales para ver la F1 en vivo en México.",
    type: "website",
    locale: "es_MX",
    url: "https://www.guiasports.com/f1",
  },
};

type HubNoticia = Noticia & { fecha?: string | null };

export default async function F1Hub() {
  const hoyStr = getTodayMexicoString();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [{ data: eventos }, { data: noticias }] = await Promise.all([
    supabase.from('eventos').select('*').eq('deporte', 'Fórmula 1').order('fecha', { ascending: true }).order('hora', { ascending: true }),
    supabase.from('noticias').select('*').order('created_at', { ascending: false }).limit(6),
  ]);

  const eventosF1 = deduplicateEventos((eventos ?? []) as Evento[]);
  const noticiasF1 = (noticias ?? []) as HubNoticia[];
  const proximos = eventosF1.filter((e) => e.fecha >= hoyStr);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Fórmula 1 en Vivo | Dónde Ver Carreras Hoy en México",
    "description": "Horarios y canales de TV para ver Fórmula 1 en vivo en México.",
    "url": "https://www.guiasports.com/f1",
    "inLanguage": "es-MX",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-24">
        <div className="max-w-4xl mx-auto px-4 pt-8">
          <Breadcrumbs items={[]} current="Fórmula 1" currentHref="/f1" />

          <header className="gs-hub-header">
            <div className="gs-hub-identity">
              <div className="gs-hub-icon-box" aria-hidden="true">
                🏎️
              </div>
              <div>
                <h1 className="gs-hub-title">
                  Fórmula 1 <strong>en Vivo</strong>
                </h1>
                <p className="gs-hub-subtitle">
                  Grandes Premios, prácticas, clasificaciones y canales en México
                </p>
              </div>
            </div>
          </header>

          <EventListWithModal
            eventos={proximos}
            emptyMessage="No hay sesiones de Fórmula 1 próximas registradas. Vuelve pronto para ver la cartelera actualizada."
          />

          {noticiasF1 && noticiasF1.length > 0 && (
            <section className="mt-14">
              <h2 className="gs-section-title mb-6 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" /> Últimas Noticias y Previas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {noticiasF1.map((n) => (
                  <Link
                    key={n.id}
                    href={`/noticias/${n.slug}`}
                    className="gs-news-card group"
                  >
                    {n.imagen_url ? (
                      <div className="gs-news-card-media">
                        <NextImage
                          src={n.imagen_url}
                          alt={n.titulo}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-32 bg-slate-900 border-b border-slate-800 flex items-center justify-center text-4xl">
                        🏎️
                      </div>
                    )}
                    <div className="gs-news-card-body">
                      <div className="gs-news-meta">
                        {n.fecha && (
                          <span className="gs-news-meta-date">
                            <Calendar size={11} /> {n.fecha}
                          </span>
                        )}
                      </div>
                      <h3 className="gs-news-title group-hover:text-blue-400 transition-colors line-clamp-2">
                        {n.titulo}
                      </h3>
                      <p className="text-[11px] font-bold text-slate-400 mt-auto uppercase tracking-wider group-hover:text-white transition-colors">
                        Leer previa →
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="mt-14">
            <h2 className="gs-section-title mb-4">Otros Deportes y Secciones</h2>
            <div className="gs-sports-nav">
              <Link href="/futbol" className="gs-sports-nav-item group">
                <div className="gs-sports-nav-icon">⚽️</div>
                <div className="gs-sports-nav-label">Fútbol</div>
              </Link>
              <Link href="/nba" className="gs-sports-nav-item group">
                <div className="gs-sports-nav-icon">🏀</div>
                <div className="gs-sports-nav-label">NBA</div>
              </Link>
              <Link href="/mlb" className="gs-sports-nav-item group">
                <div className="gs-sports-nav-icon">⚾️</div>
                <div className="gs-sports-nav-label">MLB</div>
              </Link>
              <Link href="/mundial-2026" className="gs-sports-nav-item group">
                <div className="gs-sports-nav-icon">🏆</div>
                <div className="gs-sports-nav-label">Mundial 2026</div>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

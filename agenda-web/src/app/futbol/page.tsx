import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import NextImage from 'next/image';
import { Metadata } from 'next';
import { Calendar } from 'lucide-react';
import { deduplicateEventos } from '@/lib/eventUrls';
import Breadcrumbs from '@/components/Breadcrumbs';
import EventListWithModal from '@/components/EventListWithModal';
import { getTodayMexicoString } from '@/lib/mexicoTime';

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Agenda de Fútbol en Vivo Hoy | México | GuíaSports",
  description: "Dónde ver fútbol en vivo hoy en México. Horarios, canales de TV y transmisiones en vivo de la Liga MX, Champions League, Premier League, LaLiga y más.",
  alternates: {
    canonical: "https://www.guiasports.com/futbol",
  },
  openGraph: {
    title: "Agenda de Fútbol en Vivo Hoy | México | GuíaSports",
    description: "Partidos de fútbol hoy en México. Liga MX, Champions League, Premier League y más en TV y Streaming.",
    type: "website",
    locale: "es_MX",
    url: "https://www.guiasports.com/futbol",
  },
};

interface Evento {
  id: string;
  fecha: string;
  hora: string;
  evento: string;
  competicion: string;
  deporte: string;
  canales: string;
}

interface Noticia {
  id: string;
  titulo: string;
  slug: string;
  fecha: string;
  imagen_url?: string;
}

export default async function FutbolHub() {
  const hoyStr = getTodayMexicoString();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [{ data: eventos }, { data: noticias }] = await Promise.all([
    supabase.from('eventos').select('*').eq('deporte', 'Fútbol').order('fecha', { ascending: true }).order('hora', { ascending: true }),
    supabase.from('noticias').select('*').order('fecha', { ascending: false }).limit(6),
  ]);

  const proximos: Evento[] = deduplicateEventos((eventos || []).filter((evento: Evento) => evento.fecha >= hoyStr));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Fútbol en Vivo | Dónde Ver Partidos Hoy en México",
    "description": "Horarios y canales de TV para ver fútbol en vivo en México.",
    "url": "https://www.guiasports.com/futbol",
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
          <Breadcrumbs items={[]} current="Fútbol" currentHref="/futbol" />

          <header className="gs-hub-header">
            <div className="gs-hub-identity">
              <div className="gs-hub-icon-box" aria-hidden="true">
                ⚽️
              </div>
              <div>
                <h1 className="gs-hub-title">
                  Fútbol <strong>en Vivo</strong>
                </h1>
                <p className="gs-hub-subtitle">
                  Partidos, canales y horarios de transmisión en México
                </p>
              </div>
            </div>

            <nav aria-label="Competiciones destacadas" className="gs-hub-quicklinks">
              <Link href="/futbol/liga-mx" className="gs-hub-quicklink">
                🇲🇽 Liga MX (Tabla y Goleo)
              </Link>
              <Link href="/futbol/champions-league" className="gs-hub-quicklink">
                ⭐ Champions League
              </Link>
              <Link href="/futbol/premier-league" className="gs-hub-quicklink">
                🦁 Premier League
              </Link>
              <Link href="/mundial-2026" className="gs-hub-quicklink">
                🏆 Archivo Mundial 2026
              </Link>
            </nav>
          </header>

          <EventListWithModal
            eventos={proximos}
            emptyMessage="No hay partidos de fútbol próximos registrados. Vuelve pronto para ver la cartelera actualizada."
          />

          {noticias && noticias.length > 0 && (
            <section className="mt-14">
              <h2 className="gs-section-title mb-6 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" /> Últimas Noticias y Previas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {noticias.map((n: Noticia) => (
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
                        ⚽️
                      </div>
                    )}
                    <div className="gs-news-card-body">
                      <div className="gs-news-meta">
                        <span className="gs-news-meta-date">
                          <Calendar size={11} /> {n.fecha}
                        </span>
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
              <Link href="/nba" className="gs-sports-nav-item group">
                <div className="gs-sports-nav-icon">🏀</div>
                <div className="gs-sports-nav-label">NBA</div>
              </Link>
              <Link href="/mlb" className="gs-sports-nav-item group">
                <div className="gs-sports-nav-icon">⚾️</div>
                <div className="gs-sports-nav-label">MLB</div>
              </Link>
              <Link href="/f1" className="gs-sports-nav-item group">
                <div className="gs-sports-nav-icon">🏎️</div>
                <div className="gs-sports-nav-label">Fórmula 1</div>
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

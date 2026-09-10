import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Metadata } from 'next';
import { ChevronRight } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import LigaMxStandings, { StandingRow } from '@/components/ligamx/LigaMxStandings';
import LigaMxTopScorers, { TopScorerRow } from '@/components/ligamx/LigaMxTopScorers';
import LigaMxSeoFaq from '@/components/ligamx/LigaMxSeoFaq';
import { LIGA_MX_FAQS } from '@/lib/ligamx-faqs';
import EventListWithModal from '@/components/EventListWithModal';
import { getTodayMexicoString } from '@/lib/mexicoTime';

const COMPETITION_HUBS = {
  'liga-mx': {
    name: 'Liga MX',
    query: 'Liga MX',
    title: 'Liga MX Apertura 2026: Tabla General, Partidos y Dónde Ver',
    description: 'Consulta la Tabla General de Liga MX Apertura 2026, resultados, próximos partidos y canales para verlos en vivo en México.',
    intro: 'Todo el Hub Liga MX: partidos, canales de transmisión, tabla general, resultados y estadísticas del Apertura 2026.',
  },
  'champions-league': {
    name: 'Champions League',
    query: 'Champions',
    title: 'Champions League en Vivo | Dónde Ver en México',
    description: 'Horarios y canales para ver la Champions League en vivo desde México. Consulta TV, streaming y próximos partidos.',
    intro: 'La guía rápida para saber en qué canal o plataforma ver la Champions League desde México.',
  },
  'premier-league': {
    name: 'Premier League',
    query: 'Premier League',
    title: 'Premier League en Vivo | Dónde Ver Partidos en México',
    description: 'Consulta horarios, canales y plataformas para ver partidos de Premier League en vivo en México.',
    intro: 'Encuentra los próximos partidos de Premier League y las opciones disponibles para verlos en México.',
  },
};

type CompetitionSlug = keyof typeof COMPETITION_HUBS;

interface Props {
  params: Promise<{ competicion: string }>;
}

interface Evento {
  id: string;
  fecha: string;
  hora: string;
  evento: string;
  competicion: string;
  deporte: string;
  canales: string;
}

interface NoticiaResumen {
  titulo: string;
  slug: string;
}

export function generateStaticParams() {
  return Object.keys(COMPETITION_HUBS).map((competicion) => ({ competicion }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { competicion } = await params;
  const hub = COMPETITION_HUBS[competicion as CompetitionSlug];

  if (!hub) {
    return {
      title: 'Competición no encontrada | GuíaSports',
    };
  }

  return {
    title: hub.title,
    description: hub.description,
    alternates: {
      canonical: `https://www.guiasports.com/futbol/${competicion}`,
    },
    openGraph: {
      title: hub.title,
      description: hub.description,
      type: 'website',
      locale: 'es_MX',
      url: `https://www.guiasports.com/futbol/${competicion}`,
    },
  };
}

export default async function CompetitionHub({ params }: Props) {
  const { competicion } = await params;
  const hub = COMPETITION_HUBS[competicion as CompetitionSlug];

  if (!hub) {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-100 p-10">
        <h1 className="text-3xl font-black uppercase italic mb-4">Competición no encontrada</h1>
        <Link href="/futbol" className="text-blue-400 font-black uppercase text-xs">Volver a fútbol</Link>
      </div>
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hoyStr = getTodayMexicoString();

  let eventos: Evento[] = [];
  let noticias: NoticiaResumen[] = [];
  let standings: StandingRow[] = [];
  let topScorers: TopScorerRow[] = [];
  let lastSyncedAt: string | undefined = undefined;

  const isLigaMx = competicion === 'liga-mx';

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    let eventosQuery = supabase
      .from('eventos')
      .select('*')
      .eq('deporte', 'Fútbol')
      .ilike('competicion', `%${hub.query}%`)
      .gte('fecha', hoyStr)
      .order('fecha', { ascending: true })
      .order('hora', { ascending: true })
      .limit(30);

    if (isLigaMx) {
      eventosQuery = eventosQuery.not('competicion', 'ilike', '%femenil%');
    }

    const [eventosRes, noticiasRes, standingsRes, scorersRes] = await Promise.all([
      eventosQuery,
      supabase
        .from('noticias')
        .select('titulo, slug, fecha')
        .ilike('titulo', `%${hub.query}%`)
        .order('fecha', { ascending: false })
        .limit(6),
      isLigaMx
        ? supabase
            .from('ligamx_standings_latest')
            .select('*')
            .eq('tournament_slug', 'apertura-2026')
            .order('position', { ascending: true })
        : Promise.resolve({ data: [] }),
      isLigaMx
        ? supabase
            .from('ligamx_top_scorers_latest')
            .select('*')
            .eq('tournament_slug', 'apertura-2026')
            .order('goals', { ascending: false })
            .limit(9)
        : Promise.resolve({ data: [] })
    ]);

    eventos = eventosRes.data || [];
    noticias = noticiasRes.data || [];
    standings = (standingsRes.data as StandingRow[]) || [];
    topScorers = (scorersRes.data as TopScorerRow[]) || [];

    if (standings.length > 0 && standings[0]?.synced_at) {
      lastSyncedAt = standings[0].synced_at;
    }
  }

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": hub.title,
      "description": hub.description,
      "url": `https://www.guiasports.com/futbol/${competicion}`,
      "inLanguage": "es-MX",
    },
    ...(isLigaMx
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": LIGA_MX_FAQS.map((faq) => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer,
              },
            })),
          },
        ]
      : []),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-24">
        <div className="max-w-4xl mx-auto px-4 pt-8">
          <Breadcrumbs
            items={[{ label: 'Fútbol', href: '/futbol' }]}
            current={hub.name}
            currentHref={`/futbol/${competicion}`}
          />

          <header className="gs-hub-header">
            <div className="flex flex-wrap items-center gap-2">
              <span className="gs-badge gs-badge-live">
                Hub {hub.name}
              </span>
              {isLigaMx && (
                <span className="gs-badge">
                  Estadísticas Oficiales Apertura 2026
                </span>
              )}
            </div>
            <div>
              <h1 className="gs-hub-title">
                {hub.name} <strong>en Vivo</strong>
              </h1>
              <p className="text-slate-300 max-w-2xl text-sm leading-relaxed mt-2">{hub.intro}</p>
            </div>

            <nav aria-label="Navegación entre competiciones" className="gs-hub-quicklinks">
              <Link href="/futbol" className="gs-hub-quicklink">
                ← Todo Fútbol
              </Link>
              {competicion !== 'liga-mx' && (
                <Link href="/futbol/liga-mx" className="gs-hub-quicklink">
                  🇲🇽 Liga MX
                </Link>
              )}
              {competicion !== 'champions-league' && (
                <Link href="/futbol/champions-league" className="gs-hub-quicklink">
                  ⭐ Champions League
                </Link>
              )}
              {competicion !== 'premier-league' && (
                <Link href="/futbol/premier-league" className="gs-hub-quicklink">
                  🦁 Premier League
                </Link>
              )}
            </nav>
          </header>

          {/* Agenda de Partidos y Canales (Prioridad 1) */}
          <section className="mb-12">
            <EventListWithModal
              eventos={eventos}
              emptyMessage="No hay partidos próximos registrados para esta competición. Revisa la agenda general para más eventos."
            />
          </section>

          {/* Bloque Tabla General (Solo Liga MX) */}
          {isLigaMx && standings.length > 0 && (
            <LigaMxStandings standings={standings} syncedAt={lastSyncedAt} />
          )}

          {/* Bloque Tabla de Goleo (Solo Liga MX) */}
          {isLigaMx && topScorers.length > 0 && (
            <LigaMxTopScorers scorers={topScorers} />
          )}

          {/* Preguntas Frecuentes SEO (Solo Liga MX) */}
          {isLigaMx && <LigaMxSeoFaq />}

          {/* Noticias y previas */}
          {noticias.length > 0 && (
            <section className="mt-14">
              <h2 className="gs-section-title mb-5">Noticias y previas de {hub.name}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {noticias.map((noticia) => (
                  <Link
                    key={noticia.slug}
                    href={`/noticias/${noticia.slug}`}
                    className="gs-news-card group"
                  >
                    <div className="gs-news-card-body">
                      <h3 className="gs-news-title group-hover:text-blue-400 transition-colors line-clamp-2">
                        {noticia.titulo}
                      </h3>
                      <p className="text-[11px] font-bold text-slate-400 mt-auto uppercase tracking-wider flex items-center gap-1 group-hover:text-white transition-colors">
                        Leer previa <ChevronRight size={12} />
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Metadata } from 'next';
import { CalendarDays, ChevronRight, Tv } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import LigaMxStandings from '@/components/ligamx/LigaMxStandings';
import LigaMxTopScorers from '@/components/ligamx/LigaMxTopScorers';
import LigaMxMatchStrip from '@/components/ligamx/LigaMxMatchStrip';
import LigaMxSeoFaq from '@/components/ligamx/LigaMxSeoFaq';
import LigaMxLastUpdated from '@/components/ligamx/LigaMxLastUpdated';

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
  canales: string;
}

interface NoticiaResumen {
  titulo: string;
  slug: string;
}

interface Standing {
  position: number;
  team_name: string;
  team_slug: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
  home_played?: number;
  home_won?: number;
  home_drawn?: number;
  home_lost?: number;
  home_goals_for?: number;
  home_goals_against?: number;
  home_goal_difference?: number;
  home_points?: number;
  away_played?: number;
  away_won?: number;
  away_drawn?: number;
  away_lost?: number;
  away_goals_for?: number;
  away_goals_against?: number;
  away_goal_difference?: number;
  away_points?: number;
  synced_at?: string;
}

interface Scorer {
  position: number;
  player_name: string;
  team_name: string;
  team_slug: string;
  goals: number;
  minutes_played?: number;
  scores_every_minutes?: number;
  nationality?: string;
  synced_at?: string;
}

interface MatchResult {
  jornada: string;
  official_match_key: string;
  home_team_name: string;
  away_team_name: string;
  home_team_slug: string;
  away_team_slug: string;
  home_score: number | null;
  away_score: number | null;
  status: string;
  match_date: string;
  match_time: string;
  stadium?: string;
  minute_by_minute_url?: string;
  report_url?: string;
  synced_at?: string;
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

function getTodayStr() {
  try {
    const mxDate = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Mexico_City' }));
    return `${mxDate.getFullYear()}-${String(mxDate.getMonth() + 1).padStart(2, '0')}-${String(mxDate.getDate()).padStart(2, '0')}`;
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

function getLatestSyncedAt(data: Array<{ synced_at?: string }>): string | undefined {
  if (!data || data.length === 0) return undefined;
  const dates = data
    .map((d) => d.synced_at)
    .filter((d): d is string => typeof d === 'string')
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  return dates[0];
}

export default async function CompetitionHub({ params }: Props) {
  const { competicion } = await params;
  const hub = COMPETITION_HUBS[competicion as CompetitionSlug];
  const isLigaMx = competicion === 'liga-mx';

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
  const hoyStr = getTodayStr();

  let eventos: Evento[] = [];
  let noticias: NoticiaResumen[] = [];
  let standings: Standing[] = [];
  let scorers: Scorer[] = [];
  let matches: MatchResult[] = [];

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const baseQueries = [
      supabase
        .from('eventos')
        .select('*')
        .eq('deporte', 'Fútbol')
        .ilike('competicion', `%${hub.query}%`)
        .gte('fecha', hoyStr)
        .order('fecha', { ascending: true })
        .order('hora', { ascending: true })
        .limit(30),
      supabase
        .from('noticias')
        .select('titulo, slug, fecha, created_at')
        .ilike('titulo', `%${hub.query}%`)
        .order('created_at', { ascending: false })
        .limit(6),
    ];

    const ligaMxQueries = isLigaMx
      ? [
          supabase
            .from('ligamx_standings_latest')
            .select('*')
            .eq('tournament_slug', 'apertura-2026')
            .order('position', { ascending: true }),
          supabase
            .from('ligamx_top_scorers_latest')
            .select('*')
            .eq('tournament_slug', 'apertura-2026')
            .order('goals', { ascending: false })
            .limit(10),
          supabase
            .from('ligamx_official_match_results')
            .select('*')
            .eq('tournament_slug', 'apertura-2026')
            .order('match_date', { ascending: true })
            .limit(20),
        ]
      : [];

    const allResults = await Promise.all([...baseQueries, ...ligaMxQueries]);

    eventos = allResults[0].data || [];
    noticias = allResults[1].data || [];

    if (isLigaMx) {
      standings = (allResults[2]?.data as Standing[]) || [];
      scorers = (allResults[3]?.data as Scorer[]) || [];
      matches = (allResults[4]?.data as MatchResult[]) || [];
    }
  }

  const latestStandingsUpdate = getLatestSyncedAt(standings);
  const latestScorersUpdate = getLatestSyncedAt(scorers);
  const latestMatchesUpdate = getLatestSyncedAt(matches);
  const overallLastUpdated = latestStandingsUpdate || latestScorersUpdate || latestMatchesUpdate;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: hub.title,
    description: hub.description,
    url: `https://www.guiasports.com/futbol/${competicion}`,
    inLanguage: 'es-MX',
    ...(isLigaMx && {
      hasPart: [
        { '@type': 'ItemList', name: 'Tabla General Liga MX', numberOfItems: standings.length },
        { '@type': 'ItemList', name: 'Goleadores Liga MX', numberOfItems: scorers.length },
        { '@type': 'SportsEvent', name: 'Resultados Oficiales Liga MX', numberOfItems: matches.length },
      ],
    }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-24">
        <div className="max-w-4xl mx-auto px-4 pt-10">
          <Breadcrumbs
            items={[{ label: 'Fútbol', href: '/futbol' }]}
            current={hub.name}
            currentHref={`/futbol/${competicion}`}
          />

          <header className="mb-10">
            <p className="text-[10px] font-black text-[#a3e635] uppercase tracking-[0.3em] mb-4">Guía evergreen</p>
            <h1 className="text-3xl md:text-5xl font-black italic uppercase leading-[0.95] tracking-tighter mb-5">
              {hub.name} <span className="text-blue-500">en Vivo</span>
            </h1>
            <p className="text-slate-400 max-w-2xl leading-relaxed">{hub.intro}</p>

            {isLigaMx && overallLastUpdated && (
              <LigaMxLastUpdated lastUpdated={overallLastUpdated} />
            )}
          </header>

          {isLigaMx && standings.length > 0 && (
            <LigaMxStandings standings={standings} tournamentSlug="apertura-2026" lastUpdated={latestStandingsUpdate} />
          )}

          {isLigaMx && scorers.length > 0 && (
            <LigaMxTopScorers scorers={scorers} tournamentSlug="apertura-2026" limit={10} lastUpdated={latestScorersUpdate} />
          )}

          {isLigaMx && matches.length > 0 && (
            <LigaMxMatchStrip matches={matches} tournamentSlug="apertura-2026" lastUpdated={latestMatchesUpdate} />
          )}

          <section className="mb-12">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-5 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-blue-500" /> Próximos partidos
            </h2>
            {eventos.length > 0 ? (
              <div className="space-y-3">
                {eventos.map((evento) => (
                  <article
                    key={evento.id}
                    className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-4"
                  >
                    <div className="text-xl font-black text-[#a3e635] min-w-[90px]">{evento.hora}</div>
                    <div className="flex-1">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
                        {evento.fecha} · {evento.competicion}
                      </p>
                      <h3 className="font-black italic uppercase text-white leading-tight">{evento.evento}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-400 bg-blue-500/5 border border-blue-500/10 px-3 py-2 rounded-xl">
                      <Tv size={12} /> {evento.canales}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-slate-500 text-sm">
                No hay partidos próximos registrados para esta competición. Revisa la agenda general para más eventos.
              </div>
            )}
          </section>

          {noticias.length > 0 && (
            <section className="mb-12">
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-5">Noticias y previas</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {noticias.map((noticia) => (
                  <Link
                    key={noticia.slug}
                    href={`/noticias/${noticia.slug}`}
                    className="bg-slate-900/30 border border-slate-800 rounded-2xl p-5 hover:border-blue-500/30 transition-colors group"
                  >
                    <h3 className="font-black italic uppercase text-sm text-slate-200 group-hover:text-white leading-tight mb-3">
                      {noticia.titulo}
                    </h3>
                    <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-1">
                      Leer previa <ChevronRight size={10} />
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {isLigaMx && <LigaMxSeoFaq />}
        </div>
      </div>
    </>
  );
}
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Metadata } from 'next';
import { CalendarDays, ChevronRight, Tv } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

const COMPETITION_HUBS = {
  'liga-mx': {
    name: 'Liga MX',
    query: 'Liga MX',
    title: 'Liga MX en Vivo | Horarios, Canales y Streaming en México',
    description: 'Consulta dónde ver partidos de Liga MX hoy en México: horarios, canales de TV, streaming y agenda actualizada.',
    intro: 'Toda la agenda de Liga MX en un solo lugar: partidos de hoy, transmisiones por TV abierta, cable y streaming para México.',
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
    const mxDate = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Mexico_City" }));
    return `${mxDate.getFullYear()}-${String(mxDate.getMonth() + 1).padStart(2, '0')}-${String(mxDate.getDate()).padStart(2, '0')}`;
  } catch {
    return new Date().toISOString().split('T')[0];
  }
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
  const hoyStr = getTodayStr();
  let eventos: Evento[] = [];
  let noticias: NoticiaResumen[] = [];

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const [eventosResult, noticiasResult] = await Promise.all([
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
    ]);

    eventos = eventosResult.data || [];
    noticias = noticiasResult.data || [];
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": hub.title,
    "description": hub.description,
    "url": `https://www.guiasports.com/futbol/${competicion}`,
    "inLanguage": "es-MX",
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

          <header className="mb-12">
            <p className="text-[10px] font-black text-[#a3e635] uppercase tracking-[0.3em] mb-4">Guía evergreen</p>
            <h1 className="text-3xl md:text-5xl font-black italic uppercase leading-[0.95] tracking-tighter mb-5">
              {hub.name} <span className="text-blue-500">en Vivo</span>
            </h1>
            <p className="text-slate-400 max-w-2xl leading-relaxed">{hub.intro}</p>
          </header>

          <section className="mb-12">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-5 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-blue-500" /> Próximos partidos
            </h2>
            {eventos.length > 0 ? (
              <div className="space-y-3">
                {eventos.map((evento) => (
                  <article key={evento.id} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="text-xl font-black text-[#a3e635] min-w-[90px]">{evento.hora}</div>
                    <div className="flex-1">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{evento.fecha} · {evento.competicion}</p>
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
            <section>
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-5">Noticias y previas</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {noticias.map((noticia) => (
                  <Link key={noticia.slug} href={`/noticias/${noticia.slug}`} className="bg-slate-900/30 border border-slate-800 rounded-2xl p-5 hover:border-blue-500/30 transition-colors group">
                    <h3 className="font-black italic uppercase text-sm text-slate-200 group-hover:text-white leading-tight mb-3">{noticia.titulo}</h3>
                    <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-1">
                      Leer previa <ChevronRight size={10} />
                    </p>
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

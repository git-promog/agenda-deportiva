import { createClient } from '@supabase/supabase-js';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, ExternalLink, Radio, Trophy, Tv } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import ShareButton from '@/components/ShareButton';
import { buildEventPath, buildEventUrl, getEventIdFromSlug } from '@/lib/eventUrls';

export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
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

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createClient(supabaseUrl, supabaseAnonKey);
}

async function getEvento(slug: string): Promise<Evento | null> {
  const id = getEventIdFromSlug(slug);
  const supabase = getSupabaseClient();
  if (!id || !supabase) return null;

  const { data } = await supabase
    .from('eventos')
    .select('id, fecha, hora, evento, competicion, deporte, canales')
    .eq('id', id)
    .maybeSingle();

  return data;
}

function formatDate(fecha: string) {
  return new Date(`${fecha}T12:00:00`).toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function getEndDateTime(evento: Evento) {
  const startDate = new Date(`${evento.fecha}T${evento.hora || '00:00'}:00-06:00`);
  if (Number.isNaN(startDate.getTime())) return `${evento.fecha}T23:59:00-06:00`;
  return new Date(startDate.getTime() + 2 * 60 * 60 * 1000).toISOString();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const evento = await getEvento(slug);

  if (!evento) {
    return {
      title: 'Evento no encontrado | GuíaSports',
      description: 'Consulta la agenda deportiva actualizada en GuíaSports.',
    };
  }

  const eventPath = buildEventPath(evento);
  const title = `${evento.evento}: horario, canal y dónde ver en México`;
  const description = `Consulta a qué hora juega ${evento.evento}, en qué canal verlo y opciones de TV o streaming en México. Competición: ${evento.competicion}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.guiasports.com${eventPath}`,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      locale: 'es_MX',
      url: `https://www.guiasports.com${eventPath}`,
      siteName: 'GuíaSports',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default async function EventoDetalle({ params }: Props) {
  const { slug } = await params;
  const evento = await getEvento(slug);

  if (!evento) notFound();

  const eventUrl = buildEventUrl(evento);
  const eventPath = buildEventPath(evento);
  const startDateTime = `${evento.fecha}T${evento.hora || '00:00'}:00-06:00`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": evento.evento,
    "description": `Dónde ver ${evento.evento} en México: horario, canal y streaming para ${evento.competicion}.`,
    "url": eventUrl,
    "startDate": startDateTime,
    "endDate": getEndDateTime(evento),
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
    "sport": evento.deporte,
    "inLanguage": "es-MX",
    "image": "https://www.guiasports.com/GuiaSports-logo.svg",
    "location": {
      "@type": "VirtualLocation",
      "name": "TV y streaming en México",
      "url": eventUrl
    },
    "organizer": {
      "@type": "Organization",
      "name": evento.competicion || "GuíaSports",
      "url": "https://www.guiasports.com"
    },
    "performer": {
      "@type": "PerformingGroup",
      "name": evento.evento
    },
    "offers": {
      "@type": "Offer",
      "url": eventUrl,
      "price": "0",
      "priceCurrency": "MXN",
      "availability": "https://schema.org/InStock",
      "validFrom": startDateTime
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-24">
        <main className="max-w-3xl mx-auto px-4 pt-10">
          <Breadcrumbs
            items={[{ label: 'Agenda', href: '/' }]}
            current={evento.evento}
            currentHref={eventPath}
          />

          <header className="mb-10">
            <div className="inline-flex items-center gap-2 text-[10px] font-black text-[#a3e635] bg-[#a3e635]/10 px-3 py-1 rounded-full border border-[#a3e635]/20 uppercase mb-6 tracking-widest">
              <Radio size={12} /> Evento deportivo
            </div>
            <h1 className="text-4xl md:text-6xl font-black italic uppercase leading-[0.95] tracking-tighter mb-6">
              {evento.evento}
            </h1>
            <p className="text-slate-400 leading-relaxed">
              Consulta horario, competición y canales confirmados para ver este evento en México.
            </p>
          </header>

          <section className="grid gap-4 mb-10">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex items-start gap-4">
              <Calendar className="text-blue-400 shrink-0 mt-1" size={20} />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Fecha</p>
                <p className="font-black text-white capitalize">{formatDate(evento.fecha)}</p>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex items-start gap-4">
              <Clock className="text-[#a3e635] shrink-0 mt-1" size={20} />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Hora en México</p>
                <p className="font-black text-white">{evento.hora}</p>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex items-start gap-4">
              <Trophy className="text-yellow-400 shrink-0 mt-1" size={20} />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Competición</p>
                <p className="font-black text-white">{evento.competicion}</p>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex items-start gap-4">
              <Tv className="text-purple-400 shrink-0 mt-1" size={20} />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Dónde ver</p>
                <p className="font-black text-white">{evento.canales}</p>
              </div>
            </div>
          </section>

          <section className="bg-blue-600/5 border border-blue-500/10 rounded-2xl p-6 mb-10">
            <h2 className="text-xl font-black italic uppercase mb-3">Resumen rápido</h2>
            <p className="text-slate-300 leading-relaxed">
              {evento.evento} se juega el {formatDate(evento.fecha)} a las {evento.hora}. La transmisión en México está marcada en GuíaSports por {evento.canales}.
            </p>
          </section>

          <div className="grid sm:grid-cols-2 gap-3">
            <Link href="/" className="flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-black py-4 px-5 rounded-2xl transition-all uppercase tracking-widest text-xs">
              Ver agenda completa
            </Link>
            <ShareButton
              titulo={evento.evento}
              url={eventUrl}
              className="w-full flex items-center justify-center gap-2 !bg-blue-600 hover:!bg-blue-500 !text-white !p-4 !rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors border border-blue-500/50"
              variant="full"
            />
          </div>

          <div className="mt-8">
            <a href={eventUrl} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-400 transition-colors">
              URL canónica del evento <ExternalLink size={12} />
            </a>
          </div>
        </main>
      </div>
    </>
  );
}

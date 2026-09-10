import { createClient } from '@supabase/supabase-js';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, ExternalLink, Info, Radio, Tv } from 'lucide-react';
import BackButton from '@/components/BackButton';
import Breadcrumbs from '@/components/Breadcrumbs';
import ShareButton from '@/components/ShareButton';
import { buildEventPath, buildEventUrl, getEventIdFromSlug } from '@/lib/eventUrls';
import { isEventLive } from '@/lib/mexicoTime';

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

type EventStatus = 'live' | 'upcoming' | 'finished';

const UNCONFIRMED_CHANNEL_PATTERN = /por\s+confirmar|por\s+definir|pendiente|sin\s+(?:confirmar|determinar)|no\s+disponible|n\/d|tbd|por\s+anunciar/i;

function getEventStatus(evento: Evento): EventStatus {
  if (isEventLive(evento.fecha, evento.hora)) return 'live';

  const start = new Date(`${evento.fecha}T${evento.hora || '00:00'}:00-06:00`);
  return Number.isNaN(start.getTime()) || start.getTime() > Date.now() ? 'upcoming' : 'finished';
}

function getStatusLabel(status: EventStatus) {
  if (status === 'live') return 'En vivo';
  if (status === 'finished') return 'Finalizado';
  return 'Próximo';
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
      canonical: `https://www.guiasports.com/evento/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
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
  const status = getEventStatus(evento);
  const statusLabel = getStatusLabel(status);
  const transmissionUnconfirmed = !evento.canales.trim() || UNCONFIRMED_CHANNEL_PATTERN.test(evento.canales);
  const channelLabel = transmissionUnconfirmed ? 'Transmisión por confirmar' : evento.canales;
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
          <BackButton fallbackHref="/" className="mb-6" />

          <Breadcrumbs
            items={[{ label: 'Agenda', href: '/' }]}
            current={evento.evento}
            currentHref={eventPath}
          />

          <header className="mb-8">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className={`gs-badge normal-case tracking-normal ${status === 'live' ? 'gs-badge-live' : status === 'finished' ? 'gs-badge-finished' : 'gs-badge-upcoming'}`}>
                {status === 'live' && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" aria-hidden="true" />}
                {statusLabel}
              </span>
              <span className="text-sm text-slate-500">{evento.deporte}</span>
            </div>
            <h1 className="mb-5 text-4xl font-black leading-[0.98] tracking-tight text-white md:text-6xl">
              {evento.evento}
            </h1>
            <p className="max-w-2xl leading-relaxed text-slate-400">
              Consulta la hora, la competición y dónde ver este evento en México.
            </p>
          </header>

          <section className="mb-8 grid gap-3">
            <div className="flex items-start gap-4 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-5">
              <Calendar className="mt-1 shrink-0 text-blue-300" size={20} />
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-blue-200/70">Fecha</p>
                <p className="font-bold capitalize text-white">{formatDate(evento.fecha)}</p>
              </div>
            </div>

            <div className={`flex items-start gap-4 rounded-2xl border p-5 ${status === 'live' ? 'border-red-400/30 bg-red-500/10' : 'border-lime-400/20 bg-lime-500/10'}`}>
              <Clock className={`mt-1 shrink-0 ${status === 'live' ? 'text-red-300' : 'text-lime-300'}`} size={20} />
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">{statusLabel} · hora en México</p>
                <p className={`text-xl font-black ${status === 'live' ? 'text-red-200' : 'text-white'}`}>{evento.hora || 'Por definir'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-slate-700/60 bg-slate-900/50 p-5">
              <Radio className="mt-1 shrink-0 text-slate-300" size={20} />
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">Competición</p>
                <p className="font-bold text-white">{evento.competicion}</p>
              </div>
            </div>

            <div className={`flex items-start gap-4 rounded-2xl border p-5 ${transmissionUnconfirmed ? 'border-slate-700/60 bg-slate-900/50' : 'border-blue-400/20 bg-blue-500/10'}`}>
              <Tv className={`mt-1 shrink-0 ${transmissionUnconfirmed ? 'text-slate-300' : 'text-blue-300'}`} size={20} />
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">Dónde verlo</p>
                <p className="font-bold text-white">{channelLabel}</p>
              </div>
            </div>
          </section>

          {transmissionUnconfirmed && (
            <p className="mb-8 flex items-start gap-2 text-sm leading-relaxed text-slate-400">
              <Info size={16} className="mt-0.5 shrink-0 text-blue-300" aria-hidden="true" />
              La señal todavía no está confirmada. Revisa la agenda antes de comenzar el evento.
            </p>
          )}

          <section className="mb-8 rounded-2xl border border-blue-500/10 bg-blue-600/5 p-6">
            <h2 className="mb-3 text-lg font-black text-white">Resumen rápido</h2>
            <p className="leading-relaxed text-slate-300">
              {evento.evento} se realiza el {formatDate(evento.fecha)} a las {evento.hora || 'una hora por definir'}. Consulta aquí su estado, competición y transmisión para México.
            </p>
          </section>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/" className="gs-button gs-button-primary w-full">
              Ver agenda completa
            </Link>
            <ShareButton
              titulo={evento.evento}
              url={eventUrl}
              className="w-full !border-blue-400/30 !bg-blue-600 !text-white hover:!bg-blue-500"
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

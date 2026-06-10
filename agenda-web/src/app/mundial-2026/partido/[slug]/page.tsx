import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, ExternalLink, MapPin, Trophy, Tv } from "lucide-react";
import BackButton from "@/components/BackButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import ShareButton from "@/components/ShareButton";
import { MATCHES, WCMatch } from "@/data/mundialData";
import {
  buildWorldCupMatchPath,
  buildWorldCupMatchUrl,
  getWorldCupMatchIdFromSlug,
} from "@/lib/worldCupUrls";

interface Props {
  params: Promise<{ slug: string }>;
}

function getMatch(slug: string) {
  const id = getWorldCupMatchIdFromSlug(slug);
  if (!id) return null;
  return MATCHES.find((match) => match.id === id) || null;
}

function getBroadcasters(match: WCMatch) {
  if (match.broadcasters) return match.broadcasters;
  if (match.equipo1 === "México" || match.equipo2 === "México") return "TUDN · Canal 5 · Azteca 7 · ViX";
  if (
    ["Argentina", "Brasil", "EE. UU.", "Alemania", "Francia", "España"].includes(match.equipo1) ||
    ["Argentina", "Brasil", "EE. UU.", "Alemania", "Francia", "España"].includes(match.equipo2)
  ) {
    return "TUDN · Canal 5 · ViX";
  }
  return "ViX (Premium)";
}

function formatDate(fecha: string) {
  return new Date(`${fecha}T12:00:00`).toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getStartDateTime(match: WCMatch) {
  return match.utc || `${match.fecha}T${match.hora}:00-06:00`;
}

function getEndDateTime(match: WCMatch) {
  const startDate = new Date(getStartDateTime(match));
  if (Number.isNaN(startDate.getTime())) return `${match.fecha}T23:59:00-06:00`;
  return new Date(startDate.getTime() + 2 * 60 * 60 * 1000).toISOString();
}

export function generateStaticParams() {
  return MATCHES.map((match) => ({
    slug: buildWorldCupMatchPath(match).split("/").pop() || match.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const match = getMatch(slug);

  if (!match) {
    return {
      title: "Partido no encontrado | Mundial 2026 | GuíaSports",
      description: "Consulta calendario, sedes y partidos del Mundial 2026 en GuíaSports.",
    };
  }

  const title = `${match.equipo1} vs ${match.equipo2}: horario, sede y dónde ver | Mundial 2026`;
  const description = `Consulta horario, sede, fase y transmisión de ${match.equipo1} vs ${match.equipo2} en el Mundial 2026.`;
  const url = buildWorldCupMatchUrl(match);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      type: "article",
      locale: "es_MX",
      url,
      siteName: "GuíaSports",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function MundialPartidoDetalle({ params }: Props) {
  const { slug } = await params;
  const match = getMatch(slug);

  if (!match) notFound();

  const matchPath = buildWorldCupMatchPath(match);
  const matchUrl = buildWorldCupMatchUrl(match);
  const broadcasters = getBroadcasters(match);
  const title = `${match.equipo1} vs ${match.equipo2}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": `${title} - Mundial 2026`,
    "description": `Horario, sede y transmisión de ${title} en el Mundial 2026.`,
    "url": matchUrl,
    "startDate": getStartDateTime(match),
    "endDate": getEndDateTime(match),
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "sport": "Fútbol",
    "inLanguage": "es-MX",
    "image": "https://www.guiasports.com/GuiaSports-logo.svg",
    "location": {
      "@type": "Place",
      "name": match.estadio,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": match.ciudad
      }
    },
    "organizer": {
      "@type": "Organization",
      "name": "FIFA World Cup 2026",
      "url": "https://www.fifa.com"
    },
    "performer": [
      {
        "@type": "SportsTeam",
        "name": match.equipo1
      },
      {
        "@type": "SportsTeam",
        "name": match.equipo2
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-24">
        <main className="max-w-3xl mx-auto px-4 pt-10">
          <BackButton fallbackHref="/mundial-2026" className="mb-6" />

          <Breadcrumbs
            items={[{ label: "Mundial 2026", href: "/mundial-2026" }]}
            current={title}
            currentHref={matchPath}
          />

          <header className="mb-10">
            <div className="inline-flex items-center gap-2 text-[10px] font-black text-blue-400 bg-blue-600/10 px-3 py-1 rounded-full border border-blue-500/20 uppercase mb-6 tracking-widest">
              <Trophy size={12} /> Partido Mundial 2026
            </div>
            <h1 className="text-4xl md:text-6xl font-black italic uppercase leading-[0.95] tracking-tighter mb-6">
              {title}
            </h1>
            <p className="text-slate-400 leading-relaxed">
              Consulta fase, fecha, sede y opciones de transmisión para este partido del Mundial 2026.
            </p>
          </header>

          <section className="grid gap-4 mb-10">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex items-start gap-4">
              <Calendar className="text-blue-400 shrink-0 mt-1" size={20} />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Fecha</p>
                <p className="font-black text-white capitalize">{formatDate(match.fecha)}</p>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex items-start gap-4">
              <Clock className="text-[#a3e635] shrink-0 mt-1" size={20} />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Hora local de sede</p>
                <p className="font-black text-white">{match.hora}</p>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex items-start gap-4">
              <Trophy className="text-yellow-400 shrink-0 mt-1" size={20} />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Fase</p>
                <p className="font-black text-white">
                  {match.fase}{match.grupo ? ` · Grupo ${match.grupo}` : ""}
                </p>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex items-start gap-4">
              <MapPin className="text-orange-400 shrink-0 mt-1" size={20} />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Sede</p>
                <p className="font-black text-white">{match.estadio}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">{match.ciudad}</p>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex items-start gap-4">
              <Tv className="text-purple-400 shrink-0 mt-1" size={20} />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Dónde ver</p>
                <p className="font-black text-white">{broadcasters}</p>
              </div>
            </div>
          </section>

          <section className="bg-blue-600/5 border border-blue-500/10 rounded-2xl p-6 mb-10">
            <h2 className="text-xl font-black italic uppercase mb-3">Resumen rápido</h2>
            <p className="text-slate-300 leading-relaxed">
              {title} se juega el {formatDate(match.fecha)} a las {match.hora} en {match.estadio}, {match.ciudad}. La transmisión marcada para México es {broadcasters}.
            </p>
          </section>

          <div className="grid sm:grid-cols-2 gap-3">
            <Link href="/mundial-2026" className="flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-black py-4 px-5 rounded-2xl transition-all uppercase tracking-widest text-xs">
              Ver hub Mundial
            </Link>
            <ShareButton
              titulo={`${title} - Mundial 2026`}
              url={matchUrl}
              className="w-full flex items-center justify-center gap-2 !bg-blue-600 hover:!bg-blue-500 !text-white !p-4 !rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors border border-blue-500/50"
              variant="full"
            />
          </div>

          <div className="mt-8">
            <a href={matchUrl} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-400 transition-colors">
              URL canónica del partido <ExternalLink size={12} />
            </a>
          </div>
        </main>
      </div>
    </>
  );
}

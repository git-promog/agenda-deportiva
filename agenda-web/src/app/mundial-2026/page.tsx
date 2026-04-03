import Link from 'next/link';
import { Metadata } from 'next';
import { Calendar, MapPin, Trophy, ChevronRight } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Mundial 2026 México | Sedes, Calendario, Horarios y Dónde Ver | GuíaSports",
  description: "Todo sobre la Copa Mundial de la FIFA 2026 en México. Sedes, estadios, calendario de partidos, horarios y dónde ver en vivo por TV y streaming.",
  alternates: {
    canonical: "https://www.guiasports.com/mundial-2026",
  },
  openGraph: {
    title: "Mundial 2026 México | Sedes, Calendario y Dónde Ver",
    description: "Todo sobre la Copa Mundial de la FIFA 2026 en México. Sedes, estadios, calendario y dónde ver en vivo.",
    type: "website",
    locale: "es_MX",
    url: "https://www.guiasports.com/mundial-2026",
  },
};

const sedes = [
  { ciudad: "Ciudad de México", estadio: "Estadio Azteca", capacidad: "87,523", partidos: "5 partidos: 3 fase de grupos, 1 dieciseisavos, 1 octavos", imagen: "🏟️" },
  { ciudad: "Monterrey", estadio: "Estadio BBVA", capacidad: "53,500", partidos: "4 partidos: fase de grupos y eliminación directa", imagen: "🏟️" },
  { ciudad: "Guadalajara", estadio: "Estadio Akron", capacidad: "49,850", partidos: "4 partidos: fase de grupos", imagen: "🏟️" },
];

const fechasClave = [
  { fecha: "11 de junio 2026", evento: "Partido inaugural — Estadio Azteca, CDMX" },
  { fecha: "11 junio - 2 julio", evento: "Fase de grupos" },
  { fecha: "3-6 de julio 2026", evento: "Octavos de final" },
  { fecha: "10-11 de julio 2026", evento: "Cuartos de final" },
  { fecha: "14-15 de julio 2026", evento: "Semifinales" },
  { fecha: "19 de julio 2026", evento: "Final — Sede en Estados Unidos" },
];

export default function Mundial2026() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "Copa Mundial de la FIFA 2026",
    "startDate": "2026-06-11",
    "endDate": "2026-07-19",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": [
      {
        "@type": "Place",
        "name": "Estadio Azteca",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Ciudad de México",
          "addressCountry": "MX"
        }
      },
      {
        "@type": "Place",
        "name": "Estadio BBVA",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Monterrey",
          "addressCountry": "MX"
        }
      },
      {
        "@type": "Place",
        "name": "Estadio Akron",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Guadalajara",
          "addressCountry": "MX"
        }
      }
    ],
    "organizer": {
      "@type": "Organization",
      "name": "FIFA",
      "url": "https://www.fifa.com"
    },
    "description": "Copa Mundial de la FIFA 2026 en México, Estados Unidos y Canadá. 48 selecciones compitiendo por la copa.",
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "url": "https://www.fifa.com/tickets",
      "price": "0",
      "priceCurrency": "USD",
      "validFrom": "2025-01-01"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-24">
        <div className="max-w-4xl mx-auto px-4 pt-10">
          <Breadcrumbs items={[]} current="Mundial 2026" />

          <header className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-700/10 p-4 rounded-2xl border border-yellow-500/20 text-5xl">
                🏆
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-black italic uppercase leading-[0.95] tracking-tighter">
                  Mundial <span className="text-yellow-500">2026</span>
                </h1>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
                  Copa Mundial de la FIFA — México
                </p>
              </div>
            </div>
          </header>

          {/* SEDE PRINCIPAL */}
          <section className="mb-12 bg-gradient-to-br from-yellow-500/10 to-yellow-700/5 border border-yellow-500/20 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500 opacity-5 blur-3xl rounded-full"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="text-yellow-500" size={20} />
                <h2 className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em]">Sede Principal</h2>
              </div>
              <h3 className="text-2xl md:text-3xl font-black italic uppercase text-white mb-2">Estadio Azteca</h3>
              <p className="text-slate-400 text-sm mb-4">Ciudad de México — Capacidad: 87,523</p>
              <p className="text-slate-300 text-sm leading-relaxed">
                El Estadio Azteca será la sede del <strong className="text-white">partido inaugural</strong> del Mundial 2026. Es el primer estadio en la historia en albergar un partido de apertura de Copa del Mundo, sumándose a su legado de haber sido sede en los mundiales de 1970 y 1986.
              </p>
            </div>
          </section>

          {/* SEDES EN MÉXICO */}
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="text-blue-500" size={18} />
              <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Sedes en México</h2>
            </div>
            <div className="space-y-4">
              {sedes.map((sede, i) => (
                <div key={i} className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 hover:border-slate-700 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl shrink-0">{sede.imagen}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-black italic uppercase text-white mb-1">{sede.estadio}</h3>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">{sede.ciudad}</p>
                      <div className="flex flex-wrap gap-4 text-[10px]">
                        <span className="text-slate-500">Capacidad: <span className="text-slate-300 font-bold">{sede.capacidad}</span></span>
                        <span className="text-slate-500">{sede.partidos}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FECHAS CLAVE */}
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="text-[#a3e635]" size={18} />
              <h2 className="text-[10px] font-black text-[#a3e635] uppercase tracking-[0.3em]">Calendario</h2>
            </div>
            <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl overflow-hidden">
              {fechasClave.map((item, i) => (
                <div key={i} className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 p-4 ${i < fechasClave.length - 1 ? 'border-b border-slate-800/50' : ''}`}>
                  <div className="sm:w-48 shrink-0">
                    <span className="text-[10px] font-black text-[#a3e635] bg-[#a3e635]/10 px-3 py-1 rounded-lg border border-[#a3e635]/20 uppercase">
                      {item.fecha}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 font-bold">{item.evento}</p>
                </div>
              ))}
            </div>
          </section>

          {/* DÓNDE VER */}
          <section className="mb-12">
            <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
              📺 Dónde Ver el Mundial 2026
            </h2>
            <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6">
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                En México, los partidos del Mundial 2026 se transmitirán por las siguientes opciones:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <h3 className="text-xs font-black uppercase text-white mb-2">TV Abierta</h3>
                  <ul className="text-slate-400 text-sm space-y-1">
                    <li>• Canal 5 (Televisa)</li>
                    <li>• Azteca 7 (TV Azteca)</li>
                    <li>• Las Estrellas</li>
                  </ul>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <h3 className="text-xs font-black uppercase text-white mb-2">Streaming</h3>
                  <ul className="text-slate-400 text-sm space-y-1">
                    <li>• ViX Premium</li>
                    <li>• Azteca Deportes (app)</li>
                    <li>• FIFA+</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ - Featured Snippet Optimization */}
          <section className="mb-12">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Preguntas Frecuentes</h2>
            <div className="space-y-4">
              <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6">
                <h3 className="text-sm font-black italic uppercase text-white mb-3">¿Cuándo es el Mundial 2026?</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  La Copa Mundial de la FIFA 2026 se llevará a cabo del <strong className="text-white">11 de junio al 19 de julio de 2026</strong>. El partido inaugural será en el Estadio Azteca de la Ciudad de México y la final se jugará en Estados Unidos.
                </p>
              </div>
              <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6">
                <h3 className="text-sm font-black italic uppercase text-white mb-3">¿En qué estadios de México se jugará?</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  México tendrá 3 sedes con un total de <strong className="text-white">13 partidos</strong>: <strong className="text-white">Estadio Azteca</strong> (5 partidos en CDMX), <strong className="text-white">Estadio BBVA</strong> (4 partidos en Monterrey) y <strong className="text-white">Estadio Akron</strong> (4 partidos en Guadalajara).
                </p>
              </div>
              <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6">
                <h3 className="text-sm font-black italic uppercase text-white mb-3">¿Cuántas selecciones participarán?</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  El Mundial 2026 será el primero con <strong className="text-white">48 selecciones</strong> (antes eran 32). Los equipos se dividirán en 12 grupos de 4 selecciones cada uno.
                </p>
              </div>
              <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6">
                <h3 className="text-sm font-black italic uppercase text-white mb-3">¿Dónde puedo ver el Mundial 2026 en México?</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  En TV abierta por <strong className="text-white">Canal 5, Azteca 7 y Las Estrellas</strong>. En streaming a través de <strong className="text-white">ViX Premium, Azteca Deportes y FIFA+</strong>. Consulta GuíaSports para horarios detallados de cada partido.
                </p>
              </div>
            </div>
          </section>

          {/* ENLACES RELACIONADOS */}
          <section className="mb-12">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Explora más</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link href="/futbol" className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl text-center hover:border-[#a3e635]/30 transition-all group">
                <div className="text-2xl mb-2">⚽️</div>
                <div className="text-[9px] font-black uppercase text-slate-400 group-hover:text-white transition-colors">Fútbol</div>
              </Link>
              <Link href="/nba" className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl text-center hover:border-blue-500/30 transition-all group">
                <div className="text-2xl mb-2">🏀</div>
                <div className="text-[9px] font-black uppercase text-slate-400 group-hover:text-white transition-colors">NBA</div>
              </Link>
              <Link href="/mlb" className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl text-center hover:border-blue-500/30 transition-all group">
                <div className="text-2xl mb-2">⚾️</div>
                <div className="text-[9px] font-black uppercase text-slate-400 group-hover:text-white transition-colors">MLB</div>
              </Link>
              <Link href="/noticias" className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl text-center hover:border-blue-500/30 transition-all group">
                <div className="text-2xl mb-2">📰</div>
                <div className="text-[9px] font-black uppercase text-slate-400 group-hover:text-white transition-colors">Noticias</div>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

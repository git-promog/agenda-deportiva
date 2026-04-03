import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import NextImage from 'next/image';
import { Metadata } from 'next';
import { Calendar, Tv, Clock } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

export const revalidate = 300;

export const metadata: Metadata = {
  title: "NBA en Vivo | Dónde Ver Partidos Hoy en México | GuíaSports",
  description: "Horarios y canales de TV para ver NBA en vivo en México. Dónde ver partidos de básquetbol hoy.",
  alternates: {
    canonical: "https://www.guiasports.com/nba",
  },
  openGraph: {
    title: "NBA en Vivo | Dónde Ver Partidos Hoy en México",
    description: "Horarios y canales de TV para ver NBA en vivo en México.",
    type: "website",
    locale: "es_MX",
    url: "https://www.guiasports.com/nba",
  },
};

const emojis: { [key: string]: string } = {
  "Fútbol": "⚽️", "Básquetbol": "🏀", "Béisbol": "⚾️", "Fórmula 1": "🏎️",
  "Motorismo": "🏍️", "Tenis": "🎾", "Fútbol Americano": "🏈", "Rugby": "🏉",
  "Hockey": "🏒", "Combate": "🥊", "Ciclismo": "🚴", "Voleibol": "🏐",
  "Golf": "⛳️", "Natación": "🏊", "Fútbol Sala": "👟", "Otros": "🏆"
};

function estaEnVivo(fecha: string, hora: string, hoyStr: string) {
  if (fecha !== hoyStr) return false;
  const ahora = new Date();
  const [h, m] = hora.split(':').map(Number);
  const horaEvento = new Date();
  horaEvento.setHours(h, m, 0);
  const dif = ahora.getTime() - horaEvento.getTime();
  return dif >= 0 && dif < (2 * 60 * 60 * 1000);
}

function getTodayStr() {
  try {
    const mxDate = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Mexico_City"}));
    return mxDate.getFullYear() + "-" + String(mxDate.getMonth() + 1).padStart(2, '0') + "-" + String(mxDate.getDate()).padStart(2, '0');
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

export default async function NbaHub() {
  const hoyStr = getTodayStr();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [{ data: eventos }, { data: noticias }] = await Promise.all([
    supabase.from('eventos').select('*').eq('deporte', 'Básquetbol').order('fecha', { ascending: true }).order('hora', { ascending: true }),
    supabase.from('noticias').select('*').order('created_at', { ascending: false }).limit(6),
  ]);

  const eventosBasket = eventos || [];
  const enVivo = eventosBasket.filter(e => estaEnVivo(e.fecha, e.hora, hoyStr));
  const proximos = eventosBasket.filter(e => e.fecha >= hoyStr);

  const eventosAgrupados = proximos.reduce((groups: any, evento: any) => {
    const f = evento.fecha;
    if (!groups[f]) groups[f] = [];
    groups[f].push(evento);
    return groups;
  }, {});

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "NBA en Vivo | Dónde Ver Partidos Hoy en México",
    "description": "Horarios y canales de TV para ver NBA en vivo en México.",
    "url": "https://www.guiasports.com/nba",
    "inLanguage": "es-MX",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-24">
        <div className="max-w-4xl mx-auto px-4 pt-10">
          <Breadcrumbs items={[]} current="NBA" />

          <header className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-[#a3e635]/10 p-4 rounded-2xl border border-[#a3e635]/20 text-5xl">
                🏀
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-black italic uppercase leading-[0.95] tracking-tighter">
                  NBA <span className="text-[#a3e635]">en Vivo</span>
                </h1>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
                  Dónde ver partidos de básquetbol hoy en México
                </p>
              </div>
            </div>
          </header>

          {enVivo.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-ping"></div>
                <h2 className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">
                  {enVivo.length} partido{enVivo.length > 1 ? 's' : ''} en vivo
                </h2>
              </div>
              <div className="space-y-3">
                {enVivo.map((evento: any) => (
                  <div key={evento.id} className="group bg-gradient-to-r from-red-600/10 to-red-900/5 border border-red-500/20 rounded-2xl p-5 hover:border-red-500/40 transition-all relative overflow-hidden">
                    <div className="absolute top-3 right-3">
                      <span className="flex items-center gap-1.5 bg-red-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                        LIVE
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="bg-[#020617] border border-slate-800 w-14 h-14 flex items-center justify-center rounded-2xl text-3xl shrink-0">
                        {emojis[evento.deporte] || "🏀"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-1">{evento.competicion}</div>
                        <h3 className="text-lg font-black italic uppercase text-white leading-tight mb-2">{evento.evento}</h3>
                        <div className="flex flex-wrap items-center gap-4">
                          <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#a3e635] bg-[#a3e635]/10 px-3 py-1 rounded-lg border border-[#a3e635]/20">
                            <Tv size={12} /> {evento.canales}
                          </span>
                          <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-400">
                            <Clock size={12} /> {evento.hora}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {Object.keys(eventosAgrupados).length > 0 ? (
            Object.keys(eventosAgrupados).sort().map((fecha) => (
              <section key={fecha} className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    {new Date(fecha + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </h2>
                  <div className="h-px w-full bg-slate-800/30"></div>
                </div>
                <div className="grid gap-3">
                  {eventosAgrupados[fecha].map((evento: any) => (
                    <div key={evento.id} className="group bg-slate-900/30 border border-slate-800/50 rounded-2xl p-4 hover:border-blue-500/30 hover:bg-slate-900/60 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex items-center gap-3 w-full">
                          <div className="flex flex-col justify-center min-w-[65px] text-blue-400 font-mono font-black text-sm md:text-xl shrink-0 border-r border-slate-800/60 pr-3">
                            {evento.hora}
                            {estaEnVivo(evento.fecha, evento.hora, hoyStr) && (
                              <div className="flex items-center gap-1 mt-1 justify-center"><div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></div><span className="text-[7px] font-black text-red-500 uppercase">LIVE</span></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[9px] font-black text-slate-500 uppercase mb-0.5 truncate">{evento.competicion}</div>
                            <h3 className="text-sm font-bold text-slate-200 leading-snug">{evento.evento}</h3>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-[#020617] px-4 py-2 rounded-xl border border-slate-800 shrink-0">
                          <Tv className="w-3 h-3 text-slate-600 shrink-0" />
                          <span className="text-[11px] font-black text-[#a3e635] italic uppercase">{evento.canales}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-16 text-center text-slate-500">
              <div className="text-6xl mb-6 opacity-30">🏀</div>
              <p className="font-bold text-lg mb-2 text-slate-400">No hay partidos de básquetbol próximamente</p>
              <p className="text-sm">Vuelve pronto para ver la cartelera actualizada.</p>
            </div>
          )}

          {noticias && noticias.length > 0 && (
            <section className="mt-12">
              <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Últimas Noticias
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {noticias.map((n: any) => (
                  <Link key={n.id} href={`/noticias/${n.slug}`} className="group bg-slate-900/50 border border-slate-800/50 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all">
                    {n.imagen_url ? (
                      <div className="w-full h-32 overflow-hidden relative">
                        <NextImage src={n.imagen_url} alt={n.titulo} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 50vw" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60"></div>
                      </div>
                    ) : (
                      <div className="w-full h-32 bg-gradient-to-br from-blue-600/20 to-blue-900/20 flex items-center justify-center border-b border-slate-800/50">
                        <div className="text-4xl">🏀</div>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-xs font-black italic uppercase text-slate-200 group-hover:text-white leading-tight line-clamp-2">{n.titulo}</h3>
                      <p className="text-[9px] text-slate-500 uppercase font-bold mt-1">{n.fecha}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="mt-12">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Otros Deportes</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link href="/futbol" className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl text-center hover:border-blue-500/30 transition-all group">
                <div className="text-3xl mb-2">⚽️</div>
                <div className="text-[10px] font-black uppercase text-slate-400 group-hover:text-white transition-colors">Fútbol</div>
              </Link>
              <Link href="/mlb" className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl text-center hover:border-blue-500/30 transition-all group">
                <div className="text-3xl mb-2">⚾️</div>
                <div className="text-[10px] font-black uppercase text-slate-400 group-hover:text-white transition-colors">MLB</div>
              </Link>
              <Link href="/f1" className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl text-center hover:border-blue-500/30 transition-all group">
                <div className="text-3xl mb-2">🏎️</div>
                <div className="text-[10px] font-black uppercase text-slate-400 group-hover:text-white transition-colors">Fórmula 1</div>
              </Link>
              <Link href="/noticias" className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl text-center hover:border-blue-500/30 transition-all group">
                <div className="text-3xl mb-2">📰</div>
                <div className="text-[10px] font-black uppercase text-slate-400 group-hover:text-white transition-colors">Noticias</div>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

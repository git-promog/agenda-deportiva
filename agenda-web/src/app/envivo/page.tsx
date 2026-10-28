import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Metadata } from 'next';
import { Radio, Clock, CalendarDays, ChevronLeft } from 'lucide-react';
import EventListWithModal from '@/components/EventListWithModal';
import { deduplicateEventos } from '@/lib/eventUrls';
import { getMexicoDate, getTodayMexicoString, isEventLive } from '@/lib/mexicoTime';
import { getServerNow } from '@/lib/serverNow';
import type { Evento } from '@/types';

export const revalidate = 600;

export const metadata: Metadata = {
  title: "En Vivo Ahora | GuíaSports - Deportes en Vivo México",
  description: "Mira qué eventos deportivos están en vivo ahora. Fútbol, F1, NBA, MLB y más en tiempo real. Dónde ver deportes en vivo en México.",
  alternates: {
    canonical: "https://www.guiasports.com/envivo",
  },
  openGraph: {
    title: "En Vivo Ahora | GuíaSports",
    description: "Eventos deportivos en vivo en este momento. Dónde ver deportes en México.",
    type: "website",
    locale: "es_MX",
    url: "https://www.guiasports.com/envivo",
  },
};

export default async function EnVivo() {
  const hoyStr = getTodayMexicoString();
  const nowMs = getServerNow();
  const nowDate = getMexicoDate(new Date(nowMs));

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: eventos } = await supabase
    .from('eventos')
    .select('id, fecha, hora, evento, competicion, deporte, canales, ajuste_manual')
    .eq('fecha', hoyStr)
    .order('fecha', { ascending: true })
    .order('hora', { ascending: true })
    .limit(200);

  const eventosAgenda = deduplicateEventos((eventos ?? []) as Evento[]);
  const eventosEnVivo = eventosAgenda.filter(e => isEventLive(e.fecha, e.hora, nowDate));

  const eventosProximos = eventosAgenda.filter(e => {
    if (e.fecha !== hoyStr) return false;
    const [h, m] = e.hora.split(':').map(Number);
    const horaEvento = new Date(nowDate);
    horaEvento.setHours(h, m, 0);
    const dif = horaEvento.getTime() - nowDate.getTime();
    return dif > 0 && dif < (60 * 60 * 1000);
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "En Vivo Ahora | GuíaSports",
    "description": "Eventos deportivos en vivo en este momento.",
    "url": "https://www.guiasports.com/envivo",
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
          <Link href="/" className="flex items-center gap-2 text-blue-500 text-[10px] font-black uppercase tracking-widest mb-8 hover:text-blue-400 group transition-colors w-fit">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Volver a la Agenda
          </Link>

          <header className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-red-600/20 p-4 rounded-2xl border border-red-500/30 relative overflow-hidden">
                <Radio className="text-red-500 relative z-10" size={32} />
                <div className="absolute inset-0 bg-red-600/10 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-black italic uppercase leading-[0.95] tracking-tighter">
                  En Vivo <span className="text-red-500">Ahora</span>
                </h1>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">
                  Eventos transmitiéndose en este momento
                </p>
              </div>
            </div>
          </header>

          {eventosEnVivo.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-ping"></div>
                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">
                  {eventosEnVivo.length} evento{eventosEnVivo.length > 1 ? 's' : ''} en vivo
                </span>
              </div>
              <EventListWithModal eventos={eventosEnVivo} now={nowMs} />
            </div>
          ) : (
            <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-12 text-center">
              <Radio size={64} className="mx-auto mb-6 text-slate-700" />
              <h2 className="text-xl font-black italic uppercase mb-3 text-slate-400">No hay eventos en vivo</h2>
              <p className="text-sm text-slate-400 mb-8">En este momento no se está transmitiendo ningún evento.</p>
            </div>
          )}

          {eventosProximos.length > 0 && (
            <div className="mt-12">
              <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Próximos a iniciar
              </h2>
              <EventListWithModal eventos={eventosProximos} now={nowMs} />
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/" className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 font-black py-4 px-8 rounded-2xl transition-all uppercase tracking-widest text-xs">
              <CalendarDays size={14} /> Ver toda la agenda
            </Link>
          </div>
        </div>

      </div>
    </>
  );
}

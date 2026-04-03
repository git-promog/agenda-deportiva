import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import NextImage from 'next/image';
import { Metadata } from 'next';
import { Radio, ArrowLeft, Tv, Clock, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const revalidate = 60;

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

export default async function EnVivo() {
  const hoyStr = getTodayStr();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: eventos } = await supabase
    .from('eventos')
    .select('*')
    .order('fecha', { ascending: true })
    .order('hora', { ascending: true });

  const eventosEnVivo = (eventos || []).filter(e => estaEnVivo(e.fecha, e.hora, hoyStr));

  const eventosProximos = (eventos || [])
    .filter(e => {
      if (e.fecha !== hoyStr) return false;
      const [h, m] = e.hora.split(':').map(Number);
      const horaEvento = new Date();
      horaEvento.setHours(h, m, 0);
      const ahora = new Date();
      const dif = horaEvento.getTime() - ahora.getTime();
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
        <Header />

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
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
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
              {eventosEnVivo.map((evento: any) => (
                <div key={evento.id} className="group bg-gradient-to-r from-red-600/10 to-red-900/5 border border-red-500/20 rounded-2xl p-5 hover:border-red-500/40 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-3 right-3">
                    <span className="flex items-center gap-1.5 bg-red-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                      LIVE
                    </span>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-[#020617] border border-slate-800 w-14 h-14 flex items-center justify-center rounded-2xl text-3xl shrink-0">
                      {emojis[evento.deporte] || "🏆"}
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
          ) : (
            <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-12 text-center">
              <Radio size={64} className="mx-auto mb-6 text-slate-700" />
              <h2 className="text-xl font-black italic uppercase mb-3 text-slate-400">No hay eventos en vivo</h2>
              <p className="text-sm text-slate-600 mb-8">En este momento no se está transmitiendo ningún evento.</p>
            </div>
          )}

          {eventosProximos.length > 0 && (
            <div className="mt-12">
              <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Próximos a iniciar
              </h2>
              <div className="space-y-3">
                {eventosProximos.map((evento: any) => (
                  <div key={`prox-${evento.id}`} className="group bg-slate-900/30 border border-slate-800/50 rounded-xl p-4 hover:border-blue-500/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="bg-[#020617] border border-slate-800 w-10 h-10 flex items-center justify-center rounded-xl text-xl shrink-0">
                        {emojis[evento.deporte] || "🏆"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{evento.competicion}</div>
                        <h3 className="text-sm font-black italic uppercase text-slate-300 leading-tight">{evento.evento}</h3>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-blue-400 shrink-0">
                        <Clock size={12} /> {evento.hora}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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

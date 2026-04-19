"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  MapPin, 
  Trophy, 
  ChevronRight, 
  LayoutGrid, 
  Table, 
  GitBranch, 
  Newspaper, 
  Info,
  Clock,
  Star
} from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { createClient } from '@supabase/supabase-js';
import { SEDES, GRUPOS, MATCHES } from '@/data/mundialData';
import WCGroupTable from '@/components/mundial/WCGroupTable';
import WCMatchCard from '@/components/mundial/WCMatchCard';
import WCBracket from '@/components/mundial/WCBracket';
import WCCountdown from '@/components/mundial/WCCountdown';

const TAB_CONFIG = [
  { id: 'overview', label: 'General', icon: LayoutGrid },
  { id: 'groups', label: 'Grupos', icon: Table },
  { id: 'schedule', label: 'Calendario', icon: Calendar },
  { id: 'bracket', label: 'Eliminatorias', icon: GitBranch },
  { id: 'venues', label: 'Sedes', icon: MapPin },
];

export default function Mundial2026() {
  const [activeTab, setActiveTab] = useState('overview');
  const [noticias, setNoticias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleMatches, setVisibleMatches] = useState(10);

  useEffect(() => {
    async function fetchWCNews() {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      
      const { data } = await supabase
        .from('noticias')
        .select('*')
        .ilike('titulo', '%#MUNDIAL2026%')
        .order('fecha', { ascending: false })
        .limit(4);
      
      if (data) setNoticias(data);
      setLoading(false);
    }
    fetchWCNews();
  }, []);

  const loadMoreMatches = () => {
    setVisibleMatches(prev => Math.min(prev + 10, MATCHES.length));
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "Copa Mundial de la FIFA 2026",
    "startDate": "2026-06-11",
    "endDate": "2026-07-19",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": SEDES.map(s => ({
      "@type": "Place",
      "name": s.estadio,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": s.ciudad,
        "addressCountry": s.pais === 'México' ? 'MX' : (s.pais === 'Canadá' ? 'CA' : 'US')
      }
    })),
    "organizer": {
      "@type": "Organization",
      "name": "FIFA",
      "url": "https://www.fifa.com"
    },
    "description": "El hub definitivo del Mundial 2026: Grupos, posiciones, calendario y sedes del torneo en México, USA y Canadá.",
    "offers": {
      "@type": "Offer",
      "url": "https://www.fifa.com/tickets",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "validFrom": "2025-01-01"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-24 relative">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-4xl mx-auto px-4 pt-10 relative z-10">
          <Breadcrumbs items={[]} current="Mundial 2026" />

          <header className="mb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 p-5 rounded-3xl shadow-2xl shadow-yellow-900/20 text-5xl">
                  🏆
                </div>
                <div>
                  <h1 className="text-4xl md:text-6xl font-black italic uppercase leading-[0.9] tracking-tighter bg-gradient-to-r from-white via-white to-slate-500 bg-clip-text text-transparent">
                    Mundial <span className="text-yellow-500">2026</span>
                  </h1>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                    México • Estados Unidos • Canadá
                  </p>
                </div>
              </div>
              <div className="flex md:flex-col items-center md:items-end gap-2 bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-4 rounded-3xl px-6">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Inicia en</span>
                <span className="text-2xl font-black italic text-white leading-none">JUN 11</span>
              </div>
            </div>
          </header>

          {/* INTERNAL NAVIGATION TABS - WRAPPER FOR STICKY STABILITY */}
          <div className="sticky top-0 z-[9999] -mx-4 px-4 bg-[#020617] backdrop-blur-3xl border-b border-white/5 mb-12 shadow-2xl">
            <nav className="flex items-center gap-2 py-5 overflow-x-auto scrollbar-hide">
              {TAB_CONFIG.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap shadow-sm ${activeTab === tab.id ? 'bg-blue-600 text-white border border-blue-400/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* MAIN CONTENT AREA */}
          <main className="min-h-[500px]">
            {activeTab === 'overview' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Countdown Timer */}
                <WCCountdown />

                {/* Featured Highlight */}
                <section className="bg-gradient-to-br from-blue-600/20 to-transparent border border-blue-500/20 rounded-[40px] p-8 md:p-12 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Trophy size={120} className="text-blue-500" />
                  </div>
                  <div className="relative z-10 max-w-xl">
                    <div className="bg-blue-600 text-[9px] font-black px-3 py-1 rounded-full w-fit uppercase mb-6 tracking-widest">Destacado</div>
                    <h2 className="text-2xl md:text-4xl font-black italic uppercase text-white mb-6 leading-tight">
                      El Estadio Azteca hará historia con el <span className="text-[#a3e635]">partido inaugural</span>
                    </h2>
                    <p className="text-slate-300 text-sm leading-relaxed mb-8">
                      Ciudad de México se convertirá en la única ciudad en el planeta en haber albergado tres partidos inaugurales de Copas del Mundo. La pasión por el fútbol regresa a su templo sagrado el 11 de junio de 2026.
                    </p>
                    <button className="bg-white text-black px-8 py-4 rounded-2xl font-black text-xs uppercase italic hover:bg-slate-200 transition-all flex items-center gap-2 shadow-xl shadow-white/10">
                      Ver detalles de la sede <ChevronRight size={16} />
                    </button>
                  </div>
                </section>

                {/* News Section */}
                {noticias.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                        <Newspaper size={14} className="text-blue-500" /> MUNDIAL: Últimas Noticias
                      </h2>
                      <Link href="/noticias" className="text-[10px] font-black text-blue-400 hover:text-blue-300 uppercase transition-colors">
                        Ver todas →
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {noticias.map((n) => (
                        <Link key={n.id} href={`/noticias/${n.slug}`} className="bg-slate-900/30 border border-slate-800/50 p-6 rounded-3xl hover:border-blue-500/30 transition-all group">
                          <span className="text-[9px] font-bold text-slate-500 block mb-3 uppercase tracking-widest">{n.fecha}</span>
                          <h3 className="text-sm font-black italic uppercase text-slate-200 group-hover:text-white leading-tight mb-2 line-clamp-2">{n.titulo}</h3>
                          <p className="text-[10px] text-slate-500 font-bold uppercase group-hover:text-blue-400 transition-colors">Leer noticia completa →</p>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                {/* FAQ Section */}
                <section>
                  <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8">Preguntas Frecuentes</h2>
                  <div className="grid gap-3">
                    {[
                      { q: "¿Cuántas selecciones juegan?", a: "Por primera vez en la historia participarán 48 selecciones, divididas en 12 grupos de 4 equipos." },
                      { q: "¿Dónde será la final?", a: "La gran final se jugará el 19 de julio de 2026 en el MetLife Stadium de New York/New Jersey (USA)." },
                      { q: "¿Cuántos partidos tendrá México?", a: "México albergará un total de 13 partidos: 10 de fase de grupos, 2 de dieciseisavos y 1 de octavos de final." }
                    ].map((faq, i) => (
                      <div key={i} className="bg-slate-900/20 border border-slate-800/50 p-6 rounded-3xl">
                        <h3 className="text-xs font-black italic uppercase text-white mb-2">{faq.q}</h3>
                        <p className="text-slate-400 text-xs leading-relaxed">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'groups' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500 pb-12">
                {GRUPOS.map(g => (
                  <WCGroupTable key={g.nombre} grupo={g} />
                ))}
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="animate-in fade-in duration-500 pb-12">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Calendario Oficial</h2>
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-lg">104 Partidos</span>
                </div>

                <div className="flex flex-col gap-3 mb-12">
                  {MATCHES.slice(0, visibleMatches).map(m => (
                    <WCMatchCard key={m.id} match={m} />
                  ))}
                </div>
                
                {visibleMatches < MATCHES.length && (
                  <div className="text-center pb-20">
                    <button 
                      onClick={loadMoreMatches}
                      className="group bg-blue-600 hover:bg-blue-500 border border-blue-400/20 px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-2xl hover:scale-105 active:scale-95"
                    >
                      Ver más partidos 
                      <span className="block text-[8px] opacity-70 mt-1 uppercase tracking-normal">Mostrando {visibleMatches} de {MATCHES.length}</span>
                    </button>
                    <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-6">Desliza para ver más</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bracket' && (
              <div className="animate-in fade-in duration-500">
                <WCBracket />
              </div>
            )}

            {activeTab === 'venues' && (
              <div className="grid gap-4 animate-in fade-in duration-500">
                {SEDES.map(s => (
                  <div key={s.id} className="bg-slate-900/30 border border-slate-800/50 rounded-[32px] overflow-hidden group hover:border-blue-500/30 transition-all">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 bg-slate-800 flex items-center justify-center text-6xl py-12 md:py-0">
                        {s.imagen}
                      </div>
                      <div className="p-8 md:w-2/3">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-2xl font-black italic uppercase text-white leading-none">{s.estadio}</h3>
                            <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest mt-2">{s.ciudad}, {s.pais}</p>
                          </div>
                          <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
                            <span className="text-[10px] font-black text-slate-400 block uppercase">Capacidad</span>
                            <span className="text-sm font-black text-white">{s.capacidad}</span>
                          </div>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">{s.detalles}</p>
                        <div className="flex items-center gap-3">
                          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                          <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest italic">Sede oficial confirmada</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>

          {/* Call to action footer linking back to Home */}
          <section className="mt-20 pt-10 border-t border-slate-800/50 text-center">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6">¿Quieres ver la agenda de hoy?</h2>
            <Link href="/" className="inline-flex items-center gap-2 bg-blue-600 px-10 py-5 rounded-2xl font-black uppercase italic text-sm hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/40">
              Ver Agenda Principal <ChevronRight size={18} />
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}

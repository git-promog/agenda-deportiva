"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import Header from '@/components/Header';
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
  Star,
  X,
  Search,
  ArrowUp,
  Radio
} from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { createClient } from '@supabase/supabase-js';
import { SEDES, GRUPOS, MATCHES, getFlagUrl } from '@/data/mundialData';
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

type WCTab = 'overview' | 'groups' | 'schedule' | 'bracket' | 'venues';

export default function Mundial2026() {
  const [activeTab, setActiveTab] = useState<WCTab>('overview');
  const [noticias, setNoticias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleMatches, setVisibleMatches] = useState(10);
  const [venueFilter, setVenueFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [timezone, setTimezone] = useState('America/Mexico_City');
  const [filtroFecha, setFiltroFecha] = useState('Todas');
  const [showGoTop, setShowGoTop] = useState(false);
  const [tabsFixed, setTabsFixed] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const [filtersFixed, setFiltersFixed] = useState(false);

  const TIMEZONES = [
    { value: 'America/Mexico_City', label: 'CDMX (UTC-6)',    short: 'CDMX' },
    { value: 'America/New_York',    label: 'Este USA (EDT)',   short: 'EDT'  },
    { value: 'America/Chicago',     label: 'Central USA (CDT)',short: 'CDT'  },
    { value: 'America/Denver',      label: 'Montaña USA (MDT)',short: 'MDT'  },
    { value: 'America/Los_Angeles', label: 'Pacífico USA (PDT)',short: 'PDT' },
    { value: 'America/Toronto',     label: 'Toronto (EDT)',    short: 'TO'   },
    { value: 'America/Vancouver',   label: 'Vancouver (PDT)', short: 'VAN'  },
    { value: 'UTC',                 label: 'UTC (Referencia)', short: 'UTC'  },
  ];

  // Offset UTC de cada estadio en verano 2026 (DST aplicado: MX sin DST, US/CA con DST)
  const STADIUM_UTC_OFFSET: Record<string, number> = {
    'Estadio Ciudad de México':               -6,
    'Estadio Guadalajara':                    -6,
    'Estadio Monterrey':                      -6,
    'Estadio de Toronto':                     -4,
    'Estadio BC Place Vancouver':             -7,
    'Estadio Nueva York/Nueva Jersey':        -4,
    'Estadio Los Angeles':                    -7,
    'Estadio Atlanta':                        -4,
    'Estadio Dallas':                         -5,
    'Estadio Houston':                        -5,
    'Estadio Miami':                          -4,
    'Estadio Boston':                         -4,
    'Estadio Filadelfia':                     -4,
    'Estadio Kansas City':                    -5,
    'Estadio de la Bahía de San Francisco':   -7,
    'Estadio de Seattle':                     -7,
  };

  /**
   * Convierte la hora de un partido a la zona horaria seleccionada.
   * - Si el partido tiene campo `utc` (sync script), lo usa directamente.
   * - Si no, construye UTC desde fecha+hora local + offset conocido de la sede.
   */
  const convertirHora = (match: { hora: string; fecha: string; estadio: string; utc?: string }) => {
    try {
      let utcDate: Date;
      if (match.utc) {
        utcDate = new Date(match.utc);
      } else {
        const offset = STADIUM_UTC_OFFSET[match.estadio] ?? -6;
        const localMs = new Date(`${match.fecha}T${match.hora}:00Z`).getTime();
        utcDate = new Date(localMs - offset * 3_600_000);
      }
      const hora = utcDate.toLocaleTimeString('es-MX', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      return { hora, nota: '' };
    } catch {
      return { hora: match.hora, nota: 'Hora local sede' };
    }
  };

  // Calcula el timestamp UTC de un partido para ordenamiento correcto
  const getUtcMs = (m: { fecha: string; hora: string; estadio: string; utc?: string }) => {
    if (m.utc) return new Date(m.utc).getTime();
    const offset = STADIUM_UTC_OFFSET[m.estadio] ?? -6;
    return new Date(`${m.fecha}T${m.hora}:00Z`).getTime() - offset * 3_600_000;
  };

  const filteredMatches = MATCHES
    .filter(m => {
      // 1. Filtro por sede
      if (venueFilter && m.estadio !== venueFilter && m.ciudad !== venueFilter) return false;
      // 2. Filtro por fecha
      if (filtroFecha !== 'Todas' && m.fecha !== filtroFecha) return false;
      // 3. Filtro de búsqueda (equipo, fase, sede, grupo)
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesQuery = 
          m.equipo1.toLowerCase().includes(q) || 
          m.equipo2.toLowerCase().includes(q) || 
          m.fase.toLowerCase().includes(q) ||
          m.estadio.toLowerCase().includes(q) ||
          (m.grupo && m.grupo.toLowerCase() === q);
        if (!matchesQuery) return false;
      }
      return true;
    })
    .sort((a, b) => getUtcMs(a) - getUtcMs(b));

  const fechasUnicas = ["Todas", ...new Set(MATCHES.map(m => m.fecha))].sort((a, b) => {
    if (a === 'Todas') return -1;
    if (b === 'Todas') return 1;
    return a.localeCompare(b);
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowGoTop(window.scrollY > 400);
      
      if (tabsRef.current) {
        // Marcamos las pestañas como fijas más pronto
        setTabsFixed(window.scrollY > 300);
      }
      
      if (filtersRef.current) {
        // Los filtros se fijan justo después de las pestañas
        setFiltersFixed(window.scrollY > 420);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Efecto para aterrizaje suave al filtrar
  useEffect(() => {
    if ((filtroFecha !== 'Todas' || searchQuery !== '' || venueFilter !== null) && filtersFixed) {
      // Si el usuario cambia un filtro y ya está en la zona de resultados,
      // lo subimos al inicio del listado (ajustado por el menú fijo)
      window.scrollTo({ top: 860, behavior: 'smooth' });
    }
  }, [filtroFecha, searchQuery, venueFilter]);

  // Helper para countdown por sede
  const getSedeCountdown = (estadio: string) => {
    const primerPartido = MATCHES.find(m => m.estadio === estadio);
    if (!primerPartido) return null;
    const start = getUtcMs(primerPartido);
    const diff = start - now.getTime();
    if (diff < 0) return 'Iniciado';
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${dias} días`;
  };

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
    setVisibleMatches(prev => Math.min(prev + 10, filteredMatches.length));
  };

  const handleVenueFilter = (venueName: string) => {
    setVenueFilter(venueName);
    setActiveTab('schedule');
    setVisibleMatches(20);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const clearFilter = () => {
    setVenueFilter(null);
    setSearchQuery('');
    setVisibleMatches(10);
  };

  const now = new Date();

  // Próximo partido (el siguiente en el futuro ordenado por UTC)
  const proximoPartido = filteredMatches.find(m => {
    const utcMs = getUtcMs(m);
    return utcMs > now.getTime();
  }) ?? null;

  // Comprobar si un partido es HOY o LIVE (±110 min = duración aprox. partido)
  const getMatchStatus = (m: { fecha: string; hora: string; estadio: string; utc?: string }) => {
    const start = getUtcMs(m);
    const diff  = now.getTime() - start;
    if (diff >= 0 && diff < 110 * 60 * 1000) return 'live';
    const todayStr = now.toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' });
    if (m.fecha === todayStr) return 'today';
    return 'none';
  };

  const FAQS = [
    { q: '¿Cuántas selecciones juegan en el Mundial 2026?', a: 'Por primera vez en la historia participarán 48 selecciones, divididas en 12 grupos de 4 equipos.' },
    { q: '¿Cuándo empieza el Mundial 2026?', a: 'El torneo arranca el 11 de junio de 2026 con el partido inaugural México vs Sudáfrica en el Estadio Ciudad de México.' },
    { q: '¿Dónde será la final del Mundial 2026?', a: 'La gran final se jugará el 19 de julio de 2026 en el MetLife Stadium de Nueva York/Nueva Jersey, USA.' },
    { q: '¿Cuántos partidos albergará México en el Mundial 2026?', a: 'México albergará 13 partidos: 10 de fase de grupos (en CDMX, Guadalajara y Monterrey), 2 dieciseisavos y 1 octavo de final.' },
    { q: '¿Cuántas sedes tiene el Mundial 2026?', a: 'Son 16 sedes en total: 3 en México (Ciudad de México, Guadalajara, Monterrey), 2 en Canadá (Vancouver, Toronto) y 11 en USA.' },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.guiasports.com" },
        { "@type": "ListItem", "position": 2, "name": "Hub del Mundial 2026", "item": "https://www.guiasports.com/mundial-2026" }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": FAQS.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "SportsEvent",
      "name": "Copa Mundial de la FIFA 2026",
      "startDate": "2026-06-11T19:00:00Z",
      "endDate": "2026-07-19T21:00:00Z",
      "eventStatus": "https://schema.org/EventScheduled",
      "location": SEDES.map(s => ({
        "@type": "Place",
        "name": s.estadio,
        "address": { "@type": "PostalAddress", "addressLocality": s.ciudad, "addressCountry": s.pais === 'México' ? 'MX' : (s.pais === 'Canadá' ? 'CA' : 'US') }
      })),
      "organizer": { "@type": "SportsOrganization", "name": "FIFA", "url": "https://www.fifa.com" },
      "description": "La Copa Mundial de la FIFA 2026 se disputará en México, Estados Unidos y Canadá con 48 selecciones y 104 partidos del 11 de junio al 19 de julio de 2026."
    },
    ...MATCHES.slice(0, 20).map(m => ({
      "@type": "SportsEvent",
      "name": `${m.fase}: ${m.equipo1} vs ${m.equipo2}`,
      "startDate": `${m.fecha}T${m.hora}:00-06:00`,
      "location": { "@type": "Place", "name": m.estadio, "address": m.ciudad },
      "sport": "Fútbol",
      "competitor": [
        { "@type": "SportsTeam", "name": m.equipo1 },
        { "@type": "SportsTeam", "name": m.equipo2 }
      ]
    }))
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-24 relative">
        <Header />
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-4xl mx-auto px-4 pt-10 relative z-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-8">
            <Link href="/" className="text-slate-600 hover:text-blue-400 transition-colors">Inicio</Link>
            <span className="text-slate-700">/</span>
            <button 
              onClick={() => { setActiveTab('overview'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`transition-colors ${activeTab === 'overview' ? 'text-slate-300 cursor-default' : 'text-slate-500 hover:text-blue-400'}`}
            >
              Mundial 2026
            </button>
            {activeTab !== 'overview' && (
              <>
                <span className="text-slate-700">/</span>
                <span className="text-slate-300">{TAB_CONFIG.find(t => t.id === activeTab)?.label}</span>
              </>
            )}
          </nav>

          <header className="mb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
              <div className="flex items-center gap-6">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-3 rounded-3xl shadow-2xl shadow-black/20 w-24 h-24 md:w-32 md:h-32 flex items-center justify-center overflow-hidden">
                  <img 
                    src="/images/mundial/Copa_Mundial_FIFA_2026-logo.webp" 
                    alt="Copa Mundial de la FIFA 2026™" 
                    className="w-full h-full object-contain transform hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div>
                  <h1 className="text-4xl md:text-6xl font-black italic uppercase leading-[0.9] tracking-tighter bg-gradient-to-r from-white via-white to-slate-500 bg-clip-text text-transparent">
                    Mundial <span className="text-yellow-500">2026</span>
                  </h1>
                  <p className="text-[10px] font-black text-white/90 uppercase tracking-widest mt-1 bg-blue-600/20 w-fit px-3 py-1 rounded-lg border border-blue-500/20">
                    Copa Mundial de la FIFA 2026™
                  </p>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                    México • Estados Unidos • Canadá
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="flex md:flex-col items-center md:items-end gap-2 bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-4 rounded-3xl px-6">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Inicia en</span>
                  <span className="text-2xl font-black italic text-white leading-none">JUN 11</span>
                </div>
              </div>
            </div>

            {/* Stat Pills */}
            <div className="flex flex-wrap gap-3">
              {[
                { valor: '48',  label: 'Selecciones', color: 'from-blue-600/20 to-blue-600/5   border-blue-500/20  text-blue-400'  },
                { valor: '104', label: 'Partidos',    color: 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/20 text-yellow-400' },
                { valor: '16',  label: 'Sedes',       color: 'from-green-600/20 to-green-600/5  border-green-500/20 text-green-400'  },
                { valor: '39',  label: 'Días',        color: 'from-purple-600/20 to-purple-600/5 border-purple-500/20 text-purple-400' },
              ].map(({ valor, label, color }) => (
                <div key={label} className={`flex items-center gap-2 bg-gradient-to-r ${color} border px-4 py-2 rounded-2xl`}>
                  <span className={`text-lg font-black italic leading-none ${color.includes('blue') ? 'text-blue-400' : color.includes('yellow') ? 'text-yellow-400' : color.includes('green') ? 'text-green-400' : 'text-purple-400'}`}>{valor}</span>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
                </div>
              ))}
            </div>
          </header>

          <div 
            ref={tabsRef}
            className={`${tabsFixed ? 'fixed top-0 left-0 right-0 z-[100] bg-[#020617]/95 backdrop-blur-3xl border-b border-white/5 shadow-2xl px-4 py-3' : 'relative mb-12'}`}
          >
            <div className="max-w-4xl mx-auto flex flex-col items-center">
              {tabsFixed && (
                <Link href="/" className="mb-2 animate-in fade-in slide-in-from-top-2 duration-500">
                  <NextImage src="/GuiaSports-logo.svg" alt="GuíaSports" width={90} height={25} className="h-5 w-auto opacity-80 hover:opacity-100 transition-opacity" />
                </Link>
              )}
              <nav className="flex items-center gap-2 py-1 overflow-x-auto scrollbar-hide w-full justify-center">
                <div className="hidden md:block mr-4 border-r border-white/10 pr-4">
                  <img src="/images/mundial/Copa_Mundial_FIFA_2026-logo.webp" alt="FIFA 2026" className="h-8 w-auto" />
                </div>
                {TAB_CONFIG.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id as WCTab); if (tabsFixed) window.scrollTo({ top: 380, behavior: 'smooth' }); }}
                    className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap shadow-sm ${activeTab === tab.id ? 'bg-blue-600 text-white border border-blue-400/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                  >
                    <tab.icon size={12} />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
          {tabsFixed && <div className="h-[80px]"></div>}

          {/* MAIN CONTENT AREA */}
          <main className="min-h-[500px]">
            {activeTab === 'overview' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Countdown Timer */}
                <WCCountdown />

                {/* Próximo Partido Widget */}
                {proximoPartido && (() => {
                  const { hora } = convertirHora(proximoPartido);
                  const tzShort = TIMEZONES.find(t => t.value === timezone)?.short ?? 'CDMX';
                  return (
                    <section
                      className="relative overflow-hidden bg-gradient-to-r from-blue-950/80 via-slate-900/60 to-slate-900/40 border border-blue-500/30 rounded-[32px] p-6 md:p-8 shadow-2xl shadow-blue-900/20 cursor-pointer hover:border-blue-400/50 transition-all group/np"
                      onClick={() => setActiveTab('schedule')}
                      aria-label="Ver en el calendario"
                    >
                      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                      <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                            <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em]">Próximo partido</span>
                          </div>
                          <div className="flex items-center gap-4 md:gap-8">
                            <div className="flex flex-col items-center gap-1">
                              {(() => { const f = getFlagUrl(proximoPartido.equipo1); return f ? <img src={f} alt={proximoPartido.equipo1} className="w-10 h-10 rounded-full object-cover border-2 border-white/10 shadow-lg" /> : <span className="text-3xl">🏳️</span>; })()}
                              <span className="text-[10px] font-black uppercase text-white">{proximoPartido.equipo1}</span>
                            </div>
                            <span className="text-xl font-black italic text-slate-600">VS</span>
                            <div className="flex flex-col items-center gap-1">
                              {(() => { const f = getFlagUrl(proximoPartido.equipo2); return f ? <img src={f} alt={proximoPartido.equipo2} className="w-10 h-10 rounded-full object-cover border-2 border-white/10 shadow-lg" /> : <span className="text-3xl">🏳️</span>; })()}
                              <span className="text-[10px] font-black uppercase text-white">{proximoPartido.equipo2}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 md:items-end">
                          <div className="flex items-center gap-2 text-slate-300 text-sm font-black">
                            <Clock size={14} className="text-blue-400" />
                            {hora} <span className="text-blue-400">{tzShort}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase">
                            <Calendar size={12} />
                            {new Date(proximoPartido.fecha + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'long', day: '2-digit', month: 'long' })}
                          </div>
                          <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase">
                            <MapPin size={12} />
                            {proximoPartido.estadio}
                          </div>
                          {proximoPartido.grupo && (
                            <span className="text-[8px] font-black bg-blue-600/20 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full uppercase tracking-widest">Grupo {proximoPartido.grupo}</span>
                          )}
                        </div>
                      </div>
                      <div className="absolute bottom-4 right-6 text-[9px] font-black text-slate-600 uppercase tracking-widest group-hover/np:text-blue-500 transition-colors">Ver en calendario →</div>
                    </section>
                  );
                })()}

                {/* Featured Highlight */}
                <section 
                  className="relative overflow-hidden group rounded-[40px] border border-blue-500/20 min-h-[420px] flex items-center cursor-pointer shadow-2xl"
                  onClick={() => setActiveTab('venues')}
                >
                  {/* Background Image Container */}
                  <div className="absolute inset-0 z-0 select-none">
                    <img 
                      src="/images/mundial/azteca.png" 
                      alt="Estadio Azteca" 
                      className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-[3000ms] ease-out opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/80 to-transparent"></div>
                  </div>

                  <div className="relative z-10 p-8 md:p-14 max-w-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-blue-600 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-blue-500/20">Destacado</div>
                      <div className="flex animate-pulse">
                        <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                      </div>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black italic uppercase text-white mb-6 leading-[0.95] tracking-tighter">
                      El Estadio Azteca hará historia con el <span className="text-yellow-500 drop-shadow-sm">partido inaugural</span>
                    </h2>
                    <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-8 font-medium drop-shadow-md">
                      Ciudad de México se convertirá en la única ciudad en el planeta en haber albergado tres partidos inaugurales de Copas del Mundo. La pasión por el fútbol regresa a su templo sagrado el 11 de junio de 2026.
                    </p>
                    <button className="group/btn bg-white text-black px-8 py-5 rounded-2xl font-black text-[10px] uppercase italic hover:bg-yellow-500 transition-all flex items-center gap-3 shadow-2xl shadow-black/40">
                      Explorar sedes oficiales 
                      <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Floating Trophy Icon - Decorative */}
                  <div className="absolute bottom-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none">
                    <Trophy size={200} className="text-white rotate-12" />
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
              <div className="pb-12">
                <div 
                  ref={filtersRef}
                  className={`${filtersFixed ? 'fixed top-[82px] md:top-[90px] left-0 right-0 z-[90] bg-[#020617]/95 backdrop-blur-xl border-b border-white/5 px-4 py-3 shadow-xl' : 'relative mb-6'}`}
                >
                  <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className={filtersFixed ? 'hidden md:block' : 'block'}>
                      <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Calendario Oficial</h2>
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-lg mt-2 inline-block">FIFA 2026™</span>
                    </div>

                    <div className="flex flex-row items-center gap-2 overflow-x-auto scrollbar-hide pb-1 md:pb-0 min-w-0">
                      {/* FILTRO DE LIMPIAR — PRIMERO EN MÓVIL SI HAY FILTROS */}
                      {(venueFilter || filtroFecha !== 'Todas' || searchQuery !== '') && (
                        <button 
                          onClick={() => { setVenueFilter(null); setFiltroFecha('Todas'); setSearchQuery(''); }}
                          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shrink-0 shadow-lg shadow-red-900/40 transition-all active:scale-95 flex items-center gap-1 mr-2"
                        >
                          <X size={12} /> Limpiar
                        </button>
                      )}

                      {/* FILTRO POR FECHA */}
                      <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-700/50 px-3 py-2 rounded-xl shrink-0">
                        <Calendar size={12} className="text-[#a3e635] shrink-0" />
                        <select
                          value={filtroFecha}
                          onChange={e => setFiltroFecha(e.target.value)}
                          className="bg-transparent text-[10px] font-black text-white uppercase outline-none cursor-pointer"
                          aria-label="Filtrar por fecha"
                        >
                          {fechasUnicas.map(f => (
                            <option key={f} value={f} className="bg-slate-900 text-white">
                              {f === 'Todas' ? '📅 Fecha' : new Date(f + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric' }).toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* SELECTOR DE ZONA HORARIA */}
                      <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-700/50 px-3 py-2 rounded-xl shrink-0" title="Zona horaria">
                        <Clock size={12} className="text-blue-400 shrink-0" />
                        <select
                          id="tz-selector"
                          value={timezone}
                          onChange={e => setTimezone(e.target.value)}
                          className="bg-transparent text-[10px] font-black text-white uppercase outline-none cursor-pointer"
                          aria-label="Seleccionar zona horaria"
                        >
                          {TIMEZONES.map(tz => (
                            <option key={tz.value} value={tz.value} className="bg-slate-900 text-white">
                              {tz.short}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* BUSCADOR AVANZADO */}
                      <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-700/50 px-3 py-2 rounded-xl min-w-[140px] md:min-w-[200px] shrink-0">
                        <Search size={12} className="text-slate-400 shrink-0" />
                        <input
                          type="text"
                          placeholder="Buscar..."
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          className="bg-transparent text-[10px] font-black text-white uppercase outline-none placeholder:text-slate-600 w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {filtersFixed && <div className="h-[80px]"></div>}

                {/* Agrupación por fecha con separadores visuales */}
                <div className="flex flex-col gap-0 mb-12 [overflow-anchor:auto]">
                  {(() => {
                    const visibles = filteredMatches.slice(0, visibleMatches);
                    // Agrupar por fecha
                    const byDate: Record<string, typeof visibles> = {};
                    visibles.forEach(m => {
                      if (!byDate[m.fecha]) byDate[m.fecha] = [];
                      byDate[m.fecha].push(m);
                    });
                    const tzShort = TIMEZONES.find(t => t.value === timezone)?.short ?? 'CDMX';
                    const todayStr = now.toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' });

                    return Object.entries(byDate).map(([fecha, partidos]) => {
                      const esHoy = fecha === todayStr;
                      const fechaLabel = new Date(fecha + 'T12:00:00').toLocaleDateString('es-MX', {
                        weekday: 'long', day: 'numeric', month: 'long'
                      });
                      return (
                        <div key={fecha} className="mb-6">
                          {/* Separador de fecha */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
                              esHoy
                                ? 'bg-green-500/10 border-green-500/30'
                                : 'bg-slate-900/40 border-slate-800/50'
                            }`}>
                              {esHoy && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
                              <span className={`text-[9px] font-black uppercase tracking-widest ${
                                esHoy ? 'text-green-400' : 'text-slate-500'
                              }`}>
                                {esHoy ? '● Hoy · ' : ''}{fechaLabel}
                              </span>
                            </div>
                            <div className="flex-1 h-px bg-slate-800/60" />
                            <span className="text-[8px] font-black text-slate-700 uppercase">{partidos.length} partido{partidos.length > 1 ? 's' : ''}</span>
                          </div>

                          {/* Partidos del día */}
                          <div className="flex flex-col gap-3">
                            {partidos.map(m => {
                              const { hora, nota } = convertirHora(m);
                              const status = getMatchStatus(m);
                              return (
                                <WCMatchCard
                                  key={m.id}
                                  match={m}
                                  horaConvertida={hora}
                                  notaHora={nota}
                                  tzShort={tzShort}
                                  matchStatus={status}
                                />
                              );
                            })}
                          </div>
                        </div>
                      );
                    });
                  })()}

                  {filteredMatches.length === 0 && (
                    <div className="text-center py-20 bg-slate-900/20 rounded-[40px] border border-dashed border-slate-800">
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">No hay partidos confirmados para esta sede aún</p>
                    </div>
                  )}
                </div>

                {visibleMatches < filteredMatches.length && (
                  <div className="text-center mt-6 pb-32">
                    <button 
                      onClick={loadMoreMatches}
                      type="button"
                      className="group bg-blue-600 hover:bg-blue-500 border border-blue-400/20 px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-2xl hover:scale-105 active:scale-95"
                    >
                      Ver más partidos 
                      <span className="block text-[8px] opacity-70 mt-1 uppercase tracking-normal">Mostrando {visibleMatches} de {MATCHES.length}</span>
                    </button>
                    <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-4">Nuevos partidos aparecerán debajo</p>
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
              <div className="grid gap-6 animate-in fade-in duration-500">
                {SEDES.map(s => {
                  const isMx = s.pais === 'México';
                  const isCa = s.pais === 'Canadá';
                  
                  const borderColor = isMx ? 'border-green-500/30 group-hover:border-green-400/50' : (isCa ? 'border-red-500/30 group-hover:border-red-400/50' : 'border-blue-500/30 group-hover:border-blue-400/50');
                  const pulseColor = isMx ? 'bg-green-500' : (isCa ? 'bg-red-500' : 'bg-blue-500');
                  const textColor = isMx ? 'text-green-400' : (isCa ? 'text-red-400' : 'text-blue-400');
                  const glowColor = isMx ? 'group-hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]' : (isCa ? 'group-hover:shadow-[0_0_30px_rgba(239,68,68,0.15)]' : 'group-hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]');

                  return (
                  <div key={s.id} className={`bg-slate-900/30 border rounded-[40px] overflow-hidden group transition-all shadow-2xl ${borderColor} ${glowColor}`}>
                    <div className="flex flex-col md:flex-row min-h-[280px]">
                      <div className="md:w-2/5 relative overflow-hidden bg-slate-800">
                        {s.imagen.startsWith('/') ? (
                          <img 
                            src={s.imagen} 
                            alt={s.estadio} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-8xl bg-gradient-to-br from-slate-800 to-slate-900">
                            {s.imagen}
                          </div>
                        )}
                        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-slate-950/20 to-slate-950/90 hidden md:block z-10`}></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 md:hidden z-10"></div>
                        <div className="absolute top-4 left-4 z-20">
                          <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border bg-slate-900/80 backdrop-blur-sm ${borderColor} ${textColor}`}>
                            {s.pais}
                          </span>
                        </div>
                      </div>
                      <div className="p-8 md:p-10 md:w-3/5 flex flex-col justify-center relative z-20 bg-slate-950/50 md:bg-transparent">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`w-2 h-2 rounded-full animate-pulse ${pulseColor}`}></span>
                              <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${textColor}`}>{s.ciudad}</p>
                            </div>
                            <h3 className="text-3xl font-black italic uppercase text-white leading-none tracking-tighter">{s.estadio}</h3>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl backdrop-blur-md hidden sm:block">
                              <span className="text-[9px] font-black text-slate-500 block uppercase tracking-widest mb-1">Capacidad</span>
                              <span className="text-lg font-black text-white italic">{s.capacidad}</span>
                            </div>
                            <div className={`px-4 py-2 rounded-xl border ${borderColor} bg-slate-900/50 flex flex-col items-center min-w-[100px]`}>
                               <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Inicia en</span>
                               <span className={`text-sm font-black italic ${textColor}`}>{getSedeCountdown(s.estadio)}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">{s.detalles}</p>
                        <div className="flex flex-wrap items-center gap-4">
                          <Link 
                            href={`/mundial-2026/${s.id}`}
                            className={`bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-700 hover:border-slate-500`}
                          >
                            Conocer Sede y Partidos
                          </Link>
                          <button 
                            onClick={() => handleVenueFilter(s.estadio)}
                            className={`bg-slate-900 text-slate-400 hover:text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-800 hover:border-white/20`}
                          >
                            Filtrar aquí
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )})}
              </div>
            )}
          </main>

          {/* Call to action footer - Optimizado para permanencia en el HUB */}
          <section className="mt-20 pt-16 border-t border-slate-800/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
               <div 
                 onClick={() => { setActiveTab('groups'); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                 className="relative overflow-hidden bg-slate-900/50 border border-slate-800 p-8 rounded-[32px] hover:border-blue-500/30 transition-all cursor-pointer group"
               >
                 <div className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity">
                    <img src="/images/mundial/Copa_Mundial_FIFA_2026-logo.webp" alt="FIFA 2026" className="w-full h-full object-contain" />
                 </div>
                 <Table className="text-blue-500 mb-4" size={32} />
                 <h3 className="text-lg font-black italic uppercase text-white mb-2">Tabla de Grupos</h3>
                 <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Consulta las 48 selecciones →</p>
               </div>
               <div 
                 onClick={() => { setActiveTab('venues'); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                 className="relative overflow-hidden bg-slate-900/50 border border-slate-800 p-8 rounded-[32px] hover:border-yellow-500/30 transition-all cursor-pointer group"
               >
                 <div className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity">
                    <img src="/images/mundial/Copa_Mundial_FIFA_2026-logo.webp" alt="FIFA 2026" className="w-full h-full object-contain" />
                 </div>
                 <MapPin className="text-yellow-500 mb-4" size={32} />
                 <h3 className="text-lg font-black italic uppercase text-white mb-2">Sedes Oficiales</h3>
                 <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Explora los estadios →</p>
               </div>
            </div>

            <div className="text-center flex flex-col items-center">
              <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-6">¿Deseas volver a la programación general?</h2>
              <Link href="/" className="inline-flex items-center gap-3 text-slate-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.2em] bg-slate-900/50 px-8 py-4 rounded-2xl border border-slate-800 hover:border-slate-600 mb-6">
                <Radio size={14} className="text-red-500" /> Ver Agenda Principal GuíaSports
              </Link>
              <NextImage src="/GuiaSports-logo.svg" alt="GuíaSports" width={100} height={30} className="h-6 w-auto opacity-30" />
            </div>
          </section>
        </div>

        {/* BOTÓN IR ARRIBA */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fixed bottom-8 right-8 p-4 bg-blue-600 text-white rounded-2xl shadow-2xl transition-all duration-300 z-[100] hover:scale-110 active:scale-95 ${showGoTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
          aria-label="Ir arriba"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      </div>
    </>
  );
}

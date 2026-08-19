"use client";

/* FIFA flag URLs are generated at runtime from external assets. */

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
  Radio
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { SEDES, GRUPOS, MATCHES, getFlagUrl } from '@/data/mundialData';
import { buildWorldCupMatchUrl } from '@/lib/worldCupUrls';
import WCGroupTable from '@/components/mundial/WCGroupTable';
import WCMatchCard from '@/components/mundial/WCMatchCard';
import WCBracket from '@/components/mundial/WCBracket';
import WCFormat from '@/components/mundial/WCFormat';
import WCMatchModal from '@/components/mundial/WCMatchModal';
import WCVisualCalendar from '@/components/mundial/WCVisualCalendar';
import { useFavorites } from '@/hooks/useFavorites';
import { Maximize2 } from 'lucide-react';
import type { Noticia } from '@/types';
import type { WCMatch } from '@/data/mundialData';
import {
  formatWorldCupDate,
  getWorldCupEndDateTime,
  getWorldCupMatchStatus,
  getWorldCupResult,
  getWorldCupStartDateTime,
  WORLD_CUP_END_DATE,
  WORLD_CUP_START_DATE,
} from '@/lib/worldCupArchive';

const VENUE_COUNTRY_CODE: Record<'México' | 'Canadá' | 'USA', string> = {
  'México': 'MX',
  'Canadá': 'CA',
  'USA': 'US',
};

function getVenueAddressCountry(estadio: string): string {
  const venue = SEDES.find((s) => s.estadio === estadio);
  return venue ? VENUE_COUNTRY_CODE[venue.pais] : 'US';
}

const TAB_CONFIG = [
  { id: 'overview', label: 'General', icon: LayoutGrid },
  { id: 'format', label: 'Formato', icon: Info },
  { id: 'groups', label: 'Grupos', icon: Table },
  { id: 'schedule', label: 'Calendario', icon: Calendar },
  { id: 'wallchart', label: 'Calendario Interactivo', icon: Maximize2 },
  { id: 'bracket', label: 'Eliminatorias', icon: GitBranch },
  { id: 'venues', label: 'Sedes', icon: MapPin },
];

type WCTab = 'overview' | 'format' | 'groups' | 'schedule' | 'bracket' | 'venues' | 'wallchart';

export default function Mundial2026() {
  const { favorites, toggleFavorite, isLoaded } = useFavorites();
  const [selectedMatchData, setSelectedMatchData] = useState<{match: WCMatch, hora: string, nota: string} | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<WCTab>('overview');
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [visibleMatches, setVisibleMatches] = useState(10);
  const [venueFilter, setVenueFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [timezone, setTimezone] = useState('America/Mexico_City');
  const [filtroFecha, setFiltroFecha] = useState('Todas');
  const [filtroFase, setFiltroFase] = useState('Todas');
  const [tabsFixed, setTabsFixed] = useState(false);
  const [tabsHeight, setTabsHeight] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const [filtersFixed, setFiltersFixed] = useState(false);
  const [filtersHeight, setFiltersHeight] = useState(0);
  const [calendarContainer, setCalendarContainer] = useState<HTMLDivElement | null>(null);

  const setCalendarRef = useCallback((node: HTMLDivElement | null) => {
    if (node) setCalendarContainer(node);
  }, []);

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
      // 0. Filtro favoritos
      if (showFavoritesOnly && !favorites.includes(m.id)) return false;
      // 1. Filtro por sede
      if (venueFilter && m.estadio !== venueFilter && m.ciudad !== venueFilter) return false;
      // 2. Filtro por fecha
      if (filtroFecha !== 'Todas' && m.fecha !== filtroFecha) return false;
      // 3. Filtro por fase
      if (filtroFase !== 'Todas') {
        if (filtroFase === 'Fase de Grupos') {
          // Los partidos de grupos tienen la propiedad `grupo` (A, B, C...L)
          if (!m.grupo) return false;
        } else if (filtroFase === 'Final') {
          // Coincidencia EXACTA para no incluir "Dieciseisavos de final" / "Cuartos de final"
          if (m.fase !== 'Final') return false;
        } else {
          // Búsqueda parcial para el resto (Octavos, Cuartos, Semifinal, Tercer, etc.)
          if (!m.fase.toLowerCase().includes(filtroFase.toLowerCase())) return false;
        }
      }
      // 4. Filtro de búsqueda (equipo, fase, sede, grupo)
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
    const updateMetrics = () => {
      const tabs = tabsRef.current;
      const filters = filtersRef.current;
      setTabsHeight(tabs?.offsetHeight || 0);
      setFiltersHeight(filters?.offsetHeight || 0);
      return {
        tabsOffsetTop: tabs?.offsetTop || 0,
        filtersOffsetTop: filters?.offsetTop || 0,
      };
    };

    let metrics = updateMetrics();

    const handleScroll = () => {
      setTabsFixed(window.scrollY >= metrics.tabsOffsetTop);
      if (activeTab === 'schedule') {
        setFiltersFixed(window.scrollY >= metrics.filtersOffsetTop);
      } else {
        setFiltersFixed(false);
      }
    };

    const handleResize = () => {
      metrics = updateMetrics();
      handleScroll();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeTab, filtersFixed]);

  // Efecto para aterrizaje suave al filtrar
  useEffect(() => {
    if ((filtroFecha !== 'Todas' || searchQuery !== '' || venueFilter !== null) && filtersFixed) {
      // Si el usuario cambia un filtro y ya está en la zona de resultados,
      // lo subimos al inicio del listado (ajustado por el menú fijo)
      window.scrollTo({ top: 860, behavior: 'smooth' });
    }
  }, [filtroFecha, searchQuery, venueFilter, filtersFixed]);

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
    setShowFavoritesOnly(false);
    setFiltroFase('Todas');
    setFiltroFecha('Todas');
    setVisibleMatches(10);
  };

  const ultimoPartido = MATCHES[MATCHES.length - 1];
  const getFirstMatchDate = (estadio: string) => {
    const firstMatch = MATCHES
      .filter(match => match.estadio === estadio)
      .sort((a, b) => getUtcMs(a) - getUtcMs(b))[0];
    return firstMatch ? formatWorldCupDate(firstMatch.fecha, { year: 'numeric' }) : 'Sin partidos';
  };

  const FAQS = [
    { q: '¿Cuántas selecciones participaron en el Mundial 2026?', a: 'Participaron 48 selecciones, divididas en 12 grupos de 4 equipos.' },
    { q: '¿Cuándo se disputó el Mundial 2026?', a: 'El torneo se disputó del 11 de junio al 19 de julio de 2026 en México, Estados Unidos y Canadá.' },
    { q: '¿Dónde se jugó la final del Mundial 2026?', a: 'La final se disputó el 19 de julio de 2026 en el Estadio Nueva York/Nueva Jersey, en Nueva Jersey, USA.' },
    { q: '¿Cuántos partidos albergó México en el Mundial 2026?', a: 'México albergó 13 partidos: 10 de fase de grupos, 2 dieciseisavos y 1 octavo de final.' },
    { q: '¿Cuántas sedes tuvo el Mundial 2026?', a: 'El torneo tuvo 16 sedes: 3 en México, 2 en Canadá y 11 en Estados Unidos.' },
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
      "name": "Copa Mundial de la FIFA 2026™",
      "startDate": WORLD_CUP_START_DATE,
      "endDate": WORLD_CUP_END_DATE,
      "eventStatus": "https://schema.org/EventCompleted",
      "image": "https://www.guiasports.com/images/mundial/Copa_Mundial_FIFA_2026-logo.webp",
      "location": SEDES.map(s => ({
        "@type": "Place",
        "name": s.estadio,
        "address": { 
          "@type": "PostalAddress", 
          "addressLocality": s.ciudad, 
          "addressCountry": s.pais === 'México' ? 'MX' : (s.pais === 'Canadá' ? 'CA' : 'US') 
        }
      })),
      "organizer": { "@type": "Organization", "name": "FIFA", "url": "https://www.fifa.com" },
      "description": "Archivo histórico de la Copa Mundial de la FIFA 2026: 48 selecciones y 104 partidos disputados del 11 de junio al 19 de julio de 2026."
    },
    ...MATCHES.slice(0, 30).map(m => {
      // Intentamos calcular una hora de fin aproximada (2 horas después)
      const startDate = new Date(getWorldCupStartDateTime(m));
      const endDate = getWorldCupEndDateTime(m);
      
      return {
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        "url": buildWorldCupMatchUrl(m),
        "name": `Mundial 2026: ${m.equipo1} vs ${m.equipo2}`,
        "description": `${m.fase} - Resultado ${getWorldCupResult(m)} en ${m.estadio}`,
        "startDate": startDate.toISOString(),
        "endDate": endDate,
        "eventStatus": "https://schema.org/EventCompleted",
        "image": "https://www.guiasports.com/images/mundial/Copa_Mundial_FIFA_2026-logo.webp",
        "location": { 
          "@type": "Place", 
          "name": m.estadio, 
          "address": {
            "@type": "PostalAddress",
            "addressLocality": m.ciudad,
            "addressCountry": getVenueAddressCountry(m.estadio)
          }
        },
        "performer": [
          { "@type": "SportsTeam", "name": m.equipo1, "image": getFlagUrl(m.equipo1) },
          { "@type": "SportsTeam", "name": m.equipo2, "image": getFlagUrl(m.equipo2) }
        ],
        ...(m.goles1 !== undefined && m.goles2 !== undefined ? {
          "homeTeam": { "@type": "SportsTeam", "name": m.equipo1 },
          "awayTeam": { "@type": "SportsTeam", "name": m.equipo2 },
        } : {}),
        "organizer": {
          "@type": "Organization",
          "name": "FIFA",
          "url": "https://www.fifa.com"
        }
      };
    })
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-24 relative overflow-x-hidden">
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

          <header className="mb-10 relative bg-slate-900/40 rounded-[40px] border border-white/5 p-8 md:p-12 overflow-hidden shadow-2xl">
            {/* Animated CSS Background & Video */}
            <div className="absolute inset-0 z-0 bg-[#020617]">
              <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60">
                <source src="/video/heromundial.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-[#020617]/70 to-[#020617]/90"></div>
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent"></div>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div className="flex items-center gap-6">
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-3 rounded-3xl shadow-2xl shadow-black/20 w-24 h-24 md:w-32 md:h-32 flex items-center justify-center overflow-hidden">
                  <NextImage
                    src="/images/mundial/Copa_Mundial_FIFA_2026-logo.webp" 
                    alt="Copa Mundial de la FIFA 2026™" 
                    fill
                    sizes="128px"
                    className="w-full h-full object-contain transform hover:scale-110 transition-transform duration-700 drop-shadow-xl"
                  />
                </div>
                <div>
                  <h1 className="text-4xl md:text-6xl font-black italic uppercase leading-[0.9] tracking-tighter bg-gradient-to-r from-white via-white to-slate-400 bg-clip-text text-transparent drop-shadow-sm">
                    Mundial <span className="text-yellow-500">2026</span>
                  </h1>
                  <p className="text-[10px] font-black text-white/90 uppercase tracking-widest mt-2 bg-blue-600/30 w-fit px-3 py-1 rounded-lg border border-blue-500/30 backdrop-blur-md">
                    Archivo histórico · Copa Mundial de la FIFA 2026™
                  </p>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    México • Estados Unidos • Canadá
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="flex md:flex-col items-center md:items-end gap-2 bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-4 rounded-3xl px-6 shadow-inner">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fechas del torneo</span>
                  <span className="text-2xl font-black italic text-white leading-none">11 JUN — 19 JUL</span>
                </div>
              </div>
            </div>

            {/* Stat Pills */}
            <div className="relative z-10 flex flex-wrap gap-3">
              {[
                { valor: '48',  label: 'Selecciones', color: 'from-blue-600/20 to-blue-600/5   border-blue-500/20  text-blue-400'  },
                { valor: '104', label: 'Partidos',    color: 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/20 text-yellow-400' },
                { valor: '16',  label: 'Sedes',       color: 'from-green-600/20 to-green-600/5  border-green-500/20 text-green-400'  },
                { valor: '39',  label: 'Días de torneo', color: 'from-purple-600/20 to-purple-600/5 border-purple-500/20 text-purple-400' },
              ].map(({ valor, label, color }) => (
                <div key={label} className={`flex items-center gap-2 bg-gradient-to-r ${color} border px-4 py-2 rounded-2xl backdrop-blur-sm`}>
                  <span className={`text-lg font-black italic leading-none ${color.includes('blue') ? 'text-blue-400' : color.includes('yellow') ? 'text-yellow-400' : color.includes('green') ? 'text-green-400' : 'text-purple-400'}`}>{valor}</span>
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{label}</span>
                </div>
              ))}
            </div>
          </header>

          <div
            ref={tabsRef}
            className={`${tabsFixed ? 'fixed top-0 left-0 right-0 z-[60] bg-[#020617]/95 backdrop-blur-3xl border-b border-white/5 shadow-2xl px-4 py-3' : 'relative mb-12'}`}
          >
            <div className="max-w-4xl mx-auto flex flex-col items-center">
              {tabsFixed && (
                <Link href="/" className="mb-2 animate-in fade-in slide-in-from-top-2 duration-500 hidden md:block">
                  <NextImage src="/GuiaSports-logo.svg" alt="GuíaSports" width={90} height={25} className="h-5 w-auto opacity-80 hover:opacity-100 transition-opacity" />
                </Link>
              )}
              <nav className="flex items-center gap-2 py-1 overflow-x-auto scrollbar-hide w-full md:justify-center">
                <div className="hidden md:block mr-4 border-r border-white/10 pr-4">
                  <NextImage src="/images/mundial/Copa_Mundial_FIFA_2026-logo.webp" alt="FIFA 2026" width={32} height={32} className="h-8 w-auto" />
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
          {tabsFixed && <div style={{ height: tabsHeight }}></div>}

          {/* MAIN CONTENT AREA */}
          <main className="min-h-[500px] overflow-x-hidden">
            {activeTab === 'overview' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Estado temporal del Hub */}
                <section className="relative overflow-hidden bg-gradient-to-r from-blue-950/80 via-slate-900/60 to-slate-900/40 border border-blue-500/30 rounded-[32px] p-6 md:p-8 shadow-2xl shadow-blue-900/20">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 rounded-full bg-slate-400" />
                        <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em]">Archivo histórico</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-black italic uppercase text-white">
                        El torneo concluyó
                      </h2>
                      <p className="text-sm text-slate-400 mt-2">
                        Último partido: {ultimoPartido.equipo1} {getWorldCupResult(ultimoPartido)} {ultimoPartido.equipo2}.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('schedule')}
                      className="shrink-0 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
                    >
                      Ver archivo de partidos
                    </button>
                  </div>
                </section>

                {/* Featured Highlight */}
                <section 
                  className="relative overflow-hidden group rounded-[40px] border border-blue-500/20 min-h-[420px] flex items-center cursor-pointer shadow-2xl"
                  onClick={() => setActiveTab('venues')}
                >
                  {/* Background Image Container */}
                  <div className="absolute inset-0 z-0 select-none">
                    <NextImage
                      src="/images/mundial/azteca.png" 
                      alt="Estadio Azteca" 
                      fill
                      sizes="100vw"
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
                      El Estadio Azteca albergó el <span className="text-yellow-500 drop-shadow-sm">partido inaugural</span>
                    </h2>
                    <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-8 font-medium drop-shadow-md">
                      Ciudad de México fue la sede del partido inaugural del torneo el 11 de junio de 2026, en un estadio con una historia única en la Copa del Mundo.
                    </p>
                    <button className="group/btn bg-white text-black px-8 py-5 rounded-2xl font-black text-[10px] uppercase italic hover:bg-yellow-500 transition-all flex items-center gap-3 shadow-2xl shadow-black/40">
                      Explorar sedes del torneo
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
                    {FAQS.map((faq) => (
                      <div key={faq.q} className="bg-slate-900/20 border border-slate-800/50 p-6 rounded-3xl">
                        <h3 className="text-xs font-black italic uppercase text-white mb-2">{faq.q}</h3>
                        <p className="text-slate-400 text-xs leading-relaxed">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'format' && (
              <div className="animate-in fade-in duration-500 pb-12">
                <WCFormat />
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
                  className={`${filtersFixed ? 'fixed top-[68px] left-0 right-0 z-[55] bg-[#020617]/95 backdrop-blur-xl border-b border-white/5 px-4 py-3 shadow-xl' : 'relative mb-6'}`}
                >
                  <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className={filtersFixed ? 'hidden md:block' : 'block'}>
                      <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Archivo de partidos</h2>
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-lg mt-2 inline-block">FIFA 2026™</span>
                    </div>

                    <div className="flex flex-row items-center gap-2 overflow-x-auto scrollbar-hide pb-1 md:pb-0 min-w-0">
                      {/* FILTRO DE LIMPIAR — PRIMERO EN MÓVIL SI HAY FILTROS */}
                      {(venueFilter || filtroFecha !== 'Todas' || filtroFase !== 'Todas' || searchQuery !== '' || showFavoritesOnly) && (
                        <button 
                          onClick={clearFilter}
                          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shrink-0 shadow-lg shadow-red-900/40 transition-all active:scale-95 flex items-center gap-1 mr-2"
                        >
                          <X size={12} /> Limpiar
                        </button>
                      )}

                      {/* FILTRO FAVORITOS */}
                      {isLoaded && favorites.length > 0 && (
                        <button
                          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shrink-0 transition-all border ${showFavoritesOnly ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' : 'bg-slate-900/80 text-slate-400 border-slate-700/50 hover:border-yellow-500/30 hover:text-yellow-400'}`}
                        >
                          <Star size={12} className={showFavoritesOnly ? "fill-yellow-500 text-yellow-500" : "text-slate-400"} />
                          Mis Favoritos
                        </button>
                      )}

                      {/* FILTRO POR FASE */}
                      <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-700/50 px-3 py-2 rounded-xl shrink-0">
                        <Trophy size={12} className="text-yellow-500 shrink-0" />
                        <select
                          value={filtroFase}
                          onChange={e => setFiltroFase(e.target.value)}
                          className="bg-transparent text-[10px] font-black text-white uppercase outline-none cursor-pointer"
                          aria-label="Filtrar por fase"
                        >
                          {['Todas', 'Fase de Grupos', 'Dieciseisavos', 'Octavos', 'Cuartos', 'Semifinal', 'Tercer', 'Final'].map(f => (
                            <option key={f} value={f} className="bg-slate-900 text-white">
                              {f === 'Todas' ? '🏆 Fase' : f}
                            </option>
                          ))}
                        </select>
                      </div>

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
                {filtersFixed && <div style={{ height: filtersHeight }}></div>}

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
                    return Object.entries(byDate).map(([fecha, partidos]) => {
                      const fechaLabel = new Date(fecha + 'T12:00:00').toLocaleDateString('es-MX', {
                        weekday: 'long', day: 'numeric', month: 'long'
                      });
                      return (
                        <div key={fecha} className="mb-6">
                          {/* Separador de fecha */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
                              'bg-slate-900/40 border-slate-800/50'
                            }`}>
                              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{fechaLabel}</span>
                            </div>
                            <div className="flex-1 h-px bg-slate-800/60" />
                            <span className="text-[8px] font-black text-slate-700 uppercase">{partidos.length} partido{partidos.length > 1 ? 's' : ''}</span>
                          </div>

                          {/* Partidos del día */}
                          <div className="flex flex-col gap-3">
                            {partidos.map(m => {
                              const { hora, nota } = convertirHora(m);
                              const status = getWorldCupMatchStatus(m);
                              return (
                                <WCMatchCard
                                  key={m.id}
                                  match={m}
                                  horaConvertida={hora}
                                  notaHora={nota}
                                  tzShort={tzShort}
                                  matchStatus={status}
                                  onClick={() => { setSelectedMatchData({ match: m, hora, nota }); setIsModalOpen(true); }}
                                  isFavorite={favorites.includes(m.id)}
                                  onToggleFavorite={(e) => { e.stopPropagation(); toggleFavorite(m.id); }}
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
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">No hay partidos registrados con estos filtros</p>
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
                    <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-4">El archivo conserva los 104 partidos del torneo</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wallchart' && (
              <div className="animate-in fade-in duration-500 pb-12">
                <WCVisualCalendar 
                  ref={setCalendarRef}
                  onMatchClick={(match, hora, nota) => { setSelectedMatchData({ match, hora, nota }); setIsModalOpen(true); }} 
                  convertirHora={convertirHora}
                />
              </div>
            )}

            {activeTab === 'bracket' && (
              <div className="animate-in fade-in duration-500">
                <WCBracket 
                  onMatchClick={(match, hora, nota) => { setSelectedMatchData({ match, hora, nota }); setIsModalOpen(true); }} 
                  convertirHora={convertirHora}
                />
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
                          <NextImage
                            src={s.imagen} 
                            alt={s.estadio} 
                            fill
                            sizes="(max-width: 768px) 100vw, 40vw"
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
                              <span className={`w-2 h-2 rounded-full ${pulseColor}`}></span>
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
                               <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Primer partido</span>
                               <span className={`text-sm font-black italic ${textColor}`}>{getFirstMatchDate(s.estadio)}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">{s.detalles}</p>
                        <div className="flex flex-wrap items-center gap-4">
                          <Link 
                            href={`/mundial-2026/${s.id}`}
                            className={`bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-700 hover:border-slate-500`}
                          >
                            Ver sede y resultados
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
               <div 
                 onClick={() => { setActiveTab('schedule'); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                 className="relative overflow-hidden bg-slate-900/50 border border-slate-800 p-8 rounded-[32px] hover:border-green-500/30 transition-all cursor-pointer group"
               >
                 <div className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity">
                    <NextImage src="/images/mundial/Copa_Mundial_FIFA_2026-logo.webp" alt="FIFA 2026" fill sizes="128px" className="w-full h-full object-contain" />
                 </div>
                 <Calendar className="text-green-500 mb-4" size={32} />
                 <h3 className="text-lg font-black italic uppercase text-white mb-2">Calendario</h3>
                 <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Ver todos los partidos →</p>
               </div>
               <div 
                 onClick={() => { setActiveTab('groups'); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                 className="relative overflow-hidden bg-slate-900/50 border border-slate-800 p-8 rounded-[32px] hover:border-blue-500/30 transition-all cursor-pointer group"
               >
                 <div className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity">
                    <NextImage src="/images/mundial/Copa_Mundial_FIFA_2026-logo.webp" alt="FIFA 2026" fill sizes="128px" className="w-full h-full object-contain" />
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
                    <NextImage src="/images/mundial/Copa_Mundial_FIFA_2026-logo.webp" alt="FIFA 2026" fill sizes="128px" className="w-full h-full object-contain" />
                 </div>
                 <MapPin className="text-yellow-500 mb-4" size={32} />
                 <h3 className="text-lg font-black italic uppercase text-white mb-2">Sedes del torneo</h3>
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

      </div>
      {isModalOpen && (
        activeTab === 'wallchart' && calendarContainer
          ? createPortal(
              <WCMatchModal
                match={selectedMatchData?.match ?? null}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                isFavorite={selectedMatchData ? favorites.includes(selectedMatchData.match.id) : false}
                onToggleFavorite={() => selectedMatchData && toggleFavorite(selectedMatchData.match.id)}
                horaConvertida={selectedMatchData?.hora}
                notaHora={selectedMatchData?.nota}
                tzShort={TIMEZONES.find(t => t.value === timezone)?.short ?? 'CDMX'}
              />,
              calendarContainer
            )
          : <WCMatchModal
              match={selectedMatchData?.match ?? null}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              isFavorite={selectedMatchData ? favorites.includes(selectedMatchData.match.id) : false}
              onToggleFavorite={() => selectedMatchData && toggleFavorite(selectedMatchData.match.id)}
              horaConvertida={selectedMatchData?.hora}
              notaHora={selectedMatchData?.nota}
              tzShort={TIMEZONES.find(t => t.value === timezone)?.short ?? 'CDMX'}
            />
      )}
    </>
  );
}

import { SEDES, MATCHES } from '@/data/mundialData';
import { notFound } from 'next/navigation';
import WCMatchCard from '@/components/mundial/WCMatchCard';
import Breadcrumbs from '@/components/Breadcrumbs';
import { MapPin, Users, Calendar } from 'lucide-react';
import Link from 'next/link';

export async function generateStaticParams() {
  return SEDES.map(s => ({
    sede_id: s.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ sede_id: string }> }) {
  const resolvedParams = await params;
  const sede = SEDES.find(s => s.id === resolvedParams.sede_id);
  if (!sede) return { title: 'Sede no encontrada' };

  return {
    title: `Partidos en el ${sede.estadio} (${sede.ciudad}) — Mundial 2026 | GuíaSports`,
    description: `Descubre todos los partidos del Mundial 2026 que se jugarán en el ${sede.estadio} de ${sede.ciudad}, ${sede.pais}. Calendario, horarios y detalles de la sede oficial de la FIFA.`,
    keywords: [
      `partidos ${sede.estadio}`,
      `Mundial 2026 en ${sede.ciudad}`,
      `${sede.estadio} Mundial 2026`,
      `sedes Mundial 2026 ${sede.pais}`
    ]
  };
}

export default async function SedePage({ params }: { params: Promise<{ sede_id: string }> }) {
  const resolvedParams = await params;
  const sede = SEDES.find(s => s.id === resolvedParams.sede_id);
  if (!sede) notFound();

  // Partidos en esta sede específica
  const partidos = MATCHES.filter(m => m.estadio === sede.estadio).sort((a, b) => {
    return new Date(`${a.fecha}T${a.hora}:00Z`).getTime() - new Date(`${b.fecha}T${b.hora}:00Z`).getTime();
  });

  const isMx = sede.pais === 'México';
  const isCa = sede.pais === 'Canadá';
  const accentColor = isMx ? 'text-green-400' : (isCa ? 'text-red-400' : 'text-blue-400');
  const bgAccent = isMx ? 'bg-green-500/10' : (isCa ? 'bg-red-500/10' : 'bg-blue-500/10');
  const borderAccent = isMx ? 'border-green-500/30' : (isCa ? 'border-red-500/30' : 'border-blue-500/30');

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "StadiumOrArena",
    "name": sede.estadio,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": sede.ciudad,
      "addressCountry": sede.pais === 'México' ? 'MX' : (sede.pais === 'Canadá' ? 'CA' : 'US')
    },
    "maximumAttendeeCapacity": sede.capacidad.replace(',', ''),
    "event": partidos.map(m => ({
      "@type": "SportsEvent",
      "name": `${m.equipo1} vs ${m.equipo2}`,
      "startDate": `${m.fecha}T${m.hora}:00`,
      "competitor": [
        { "@type": "SportsTeam", "name": m.equipo1 },
        { "@type": "SportsTeam", "name": m.equipo2 }
      ]
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-24 relative">
        <div className="max-w-4xl mx-auto px-4 pt-10">
          <Breadcrumbs 
            items={[{ label: 'Mundial 2026', href: '/mundial-2026' }]} 
            current={sede.estadio} 
          />

          <header className={`mt-8 mb-12 p-8 md:p-12 rounded-[40px] border ${borderAccent} bg-slate-900/40 relative overflow-hidden shadow-2xl`}>
            <div className={`absolute top-0 right-0 w-64 h-64 ${bgAccent} blur-[100px] rounded-full opacity-50`}></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={16} className={accentColor} />
                <span className={`text-xs font-black uppercase tracking-[0.3em] ${accentColor}`}>{sede.ciudad}, {sede.pais}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black italic uppercase text-white leading-none mb-6">
                {sede.estadio}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">
                <div className="flex items-center gap-2 bg-slate-950/50 px-4 py-2 rounded-xl border border-slate-800">
                  <Users size={16} /> Capacidad: {sede.capacidad}
                </div>
                <div className="flex items-center gap-2 bg-slate-950/50 px-4 py-2 rounded-xl border border-slate-800">
                  <Calendar size={16} /> {partidos.length} Partidos Oficiales
                </div>
              </div>

              <p className="text-lg text-slate-300 leading-relaxed max-w-2xl font-medium">
                {sede.detalles}
              </p>
            </div>
          </header>

          <main>
            <h2 className="text-2xl font-black uppercase italic mb-8 flex items-center gap-3">
              <span className={`w-3 h-8 block rounded-sm ${isMx ? 'bg-green-500' : (isCa ? 'bg-red-500' : 'bg-blue-500')}`}></span>
              Calendario de Partidos Oficiales
            </h2>

            <div className="flex flex-col gap-4">
              {partidos.map((m, i) => (
                <div key={m.id} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 100}ms` }}>
                  <WCMatchCard match={m} tzShort="H. Local" />
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link href="/mundial-2026" className="inline-block bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-colors">
                ← Volver al Hub Central
              </Link>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, CheckCircle2, Star, Tv, Info, ExternalLink, Calendar, Zap } from 'lucide-react';
import { Metadata } from 'next';
import { PLATFORMS } from '@/data/platformsData';
import Breadcrumbs from '@/components/Breadcrumbs';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PLATFORMS.map((platform) => ({
    slug: platform.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const platform = PLATFORMS.find(p => p.slug === slug);
  
  if (!platform) return { title: 'Plataforma no encontrada' };

  return {
    title: `Cómo ver deportes en ${platform.name} México | Precios y Contenido 2026`,
    description: `Consulta la guía definitiva de ${platform.name}: cuánto cuesta, qué ligas transmite y cómo contratar para ver fútbol, NBA, F1 y más en México.`,
    alternates: {
      canonical: `https://www.guiasports.com/plataformas/${slug}`,
    },
  };
}

export default async function PlatformDetail({ params }: Props) {
  const { slug } = await params;
  const platform = PLATFORMS.find(p => p.slug === slug);

  if (!platform) notFound();

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-24">
      {/* Hero Header */}
      <div className={`relative h-[50vh] min-h-[500px] flex items-center justify-center overflow-hidden border-b border-white/5 bg-gradient-to-br ${platform.color} shadow-2xl`}>
        <div className="absolute inset-0 bg-[#020617]/40 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <Link href="/plataformas" className="inline-flex items-center gap-2 text-white/60 text-[10px] font-black uppercase tracking-[0.3em] mb-12 hover:text-white transition-all hover:-translate-x-1">
            <ChevronLeft size={14} /> Todas las plataformas
          </Link>
          
          <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-[40px] flex items-center justify-center text-6xl md:text-8xl mx-auto mb-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)] transform rotate-3">
             <span className="font-black italic text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-700">{platform.name.charAt(0)}</span>
          </div>

          <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-4 text-white drop-shadow-2xl">
            {platform.name}
          </h1>
          <div className="inline-block bg-white/20 backdrop-blur-md border border-white/30 px-4 py-2 rounded-2xl text-white text-xs font-black uppercase tracking-widest italic">
            Guía de Contenido 2026
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-20">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 md:p-10 shadow-2xl">
              <h2 className="text-xl font-black italic uppercase text-white mb-6 flex items-center gap-3">
                <Info className="text-blue-500" size={24} /> Resumen de Servicio
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                {platform.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-800/50 p-6 rounded-3xl border border-white/5">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Precio Mensual</p>
                    <p className="text-xl font-black text-[#a3e635] italic">{platform.price}</p>
                 </div>
                 <div className="bg-slate-800/50 p-6 rounded-3xl border border-white/5">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Plataforma</p>
                    <p className="text-xl font-black text-white italic">Streaming</p>
                 </div>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-[40px] p-8 md:p-10">
              <h2 className="text-xl font-black italic uppercase text-white mb-8 flex items-center gap-3">
                <Star className="text-yellow-400" size={24} /> Derechos Deportivos
              </h2>
              <div className="grid gap-4">
                {platform.keyContent.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 bg-slate-800/30 p-4 rounded-2xl border border-white/5 group hover:bg-slate-800 transition-colors">
                    <CheckCircle2 className="text-blue-500 shrink-0" size={20} />
                    <span className="text-sm font-bold text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-600/5 border border-blue-500/10 rounded-[40px] p-8 md:p-10">
               <h2 className="text-xl font-black italic uppercase text-white mb-6">¿Vale la pena contratar {platform.name}?</h2>
               <p className="text-slate-400 leading-relaxed mb-6">
                 Si eres un aficionado enfocado en {platform.keyContent[0]}, esta plataforma es indispensable. Su interfaz es moderna y permite visualización en múltiples dispositivos simultáneamente. Recomendamos revisar periódicamente la agenda de GuíaSports para saber qué partidos específicos se transmitirán aquí cada semana.
               </p>
               <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold">👤</div>)}
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">+100k usuarios consultan esta guía</span>
               </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-[32px] p-8 text-slate-900 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Zap size={80} className="text-blue-600" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Suscripción Oficial</p>
               <h3 className="text-2xl font-black italic uppercase leading-none mb-6">Contratar {platform.name}</h3>
               <p className="text-sm font-bold mb-8 leading-relaxed">Suscríbete ahora para empezar a ver deportes en vivo hoy mismo.</p>
               <a 
                href={platform.ctaUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-blue-600 text-white flex items-center justify-center gap-2 py-4 rounded-2xl font-black uppercase text-xs italic shadow-lg shadow-blue-600/30 hover:scale-105 transition-all"
               >
                 Ir al sitio oficial <ExternalLink size={14} />
               </a>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6">
               <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <Calendar size={14} /> Próximos Eventos
               </h4>
               <p className="text-xs text-slate-400 font-bold uppercase leading-relaxed mb-6">
                 Consulta nuestra agenda para ver qué se transmite en {platform.name} esta semana.
               </p>
               <Link href="/?envivo=1" className="text-[10px] font-black text-white bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl block text-center uppercase hover:bg-slate-700 transition-colors">
                 Ver Agenda en Vivo
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, CheckCircle2, Star, Info, Calendar, Zap } from 'lucide-react';
import { Metadata } from 'next';
import { PLATFORMS } from '@/data/platformsData';
import Breadcrumbs from '@/components/Breadcrumbs';
import TrackedOutboundLink from '@/components/TrackedOutboundLink';
import NextImage from 'next/image';

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
      <div className="relative overflow-hidden border-b border-white/5">
        <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-15`} aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-6 py-10">
          <Breadcrumbs
            items={[{ label: 'Plataformas', href: '/plataformas' }]}
            current={platform.name}
            currentHref={`/plataformas/${platform.slug}`}
          />
          <Link href="/plataformas" className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition-colors hover:text-white">
            <ChevronLeft size={14} /> Todas las plataformas
          </Link>

          <div className="mt-8 flex flex-col items-center text-center">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50 md:h-32 md:w-32">
              {platform.logo ? (
                <div className="relative flex h-full w-full items-center justify-center p-6">
                  <NextImage
                    src={platform.logo}
                    alt={platform.name}
                    fill
                    sizes="128px"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <span className="text-5xl font-black text-white">{platform.name.charAt(0)}</span>
              )}
            </div>

            <h1 className="mt-6 text-3xl font-black tracking-tight text-white md:text-5xl">
              {platform.name}
            </h1>
            <p className="mt-3 inline-flex rounded-lg border border-blue-400/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-200">
              Guía de contenido 2026
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Main Column */}
          <div className="md:col-span-2 space-y-8">
            <div className="gs-card p-6 md:p-8">
              <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                <Info className="text-blue-500" size={24} /> Resumen de Servicio
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                {platform.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="rounded-2xl border border-white/5 bg-slate-800/40 p-5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Precio de Entrada</p>
                    <p className="text-xl font-black text-[#a3e635]">{platform.price.split(':')[1] || platform.price}</p>
                 </div>
                 <div className="rounded-2xl border border-white/5 bg-slate-800/40 p-5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Plataforma</p>
                    <p className="text-xl font-black text-white">Streaming</p>
                 </div>
              </div>
            </div>

            {/* Planes de Suscripción Detallados */}
            {platform.plans && platform.plans.length > 0 && (
              <div className="gs-card p-6 md:p-8">
                <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                  <span className="text-blue-500 text-xl font-black">💰</span> Planes de Suscripción 2026
                </h2>
                <div className="space-y-4">
                  {platform.plans.map((plan, i) => (
                    <div key={i} className="rounded-2xl border border-white/5 bg-slate-800/30 p-4 flex items-start gap-4 hover:bg-slate-800/50 transition-colors">
                      <div className="w-2.5 h-2.5 bg-[#a3e635] rounded-full mt-1.5 shrink-0 "></div>
                      <p className="text-sm text-slate-300 font-bold leading-relaxed">{plan}</p>
                    </div>
                  ))}
                </div>
                {platform.promotions && (
                  <div className="mt-6 rounded-2xl border border-blue-500/20 bg-blue-600/5 p-5">
                    <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-2 flex items-center gap-1.5">
                      <span className="text-sm">🎁</span> Promoción / Periodo de Prueba
                    </p>
                    <p className="text-sm text-slate-300 font-bold leading-relaxed">{platform.promotions}</p>
                  </div>
                )}
              </div>
            )}

            <div className="gs-card p-6 md:p-8">
              <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3">
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

            <div className="rounded-2xl border border-blue-500/20 bg-blue-600/5 p-6 md:p-8">
               <h2 className="text-xl font-black text-white mb-6">¿Vale la pena contratar {platform.name}?</h2>
               <p className="text-slate-400 leading-relaxed mb-6">
                 Si eres un aficionado enfocado en {platform.keyContent[0]}, esta plataforma es indispensable. Su interfaz es moderna y permite visualización en múltiples dispositivos simultáneamente. Recomendamos revisar periódicamente la agenda de GuíaSports para saber qué partidos específicos se transmitirán aquí cada semana.
               </p>
               <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold">👤</div>)}
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">+100k usuarios consultan esta guía</span>
               </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="gs-card relative overflow-hidden border-blue-500/30 p-6">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Zap size={80} className="text-blue-600" />
               </div>
               <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-blue-300">Suscripción Oficial</p>
               <h3 className="mb-4 text-xl font-black leading-tight text-white">Contratar {platform.name}</h3>
               <p className="mb-6 text-sm leading-relaxed text-slate-300">Suscríbete ahora para empezar a ver deportes en vivo hoy mismo.</p>
               <TrackedOutboundLink
                href={platform.ctaUrl}
                destination={platform.slug}
                label={`Contratar ${platform.name}`}
                className="gs-button gs-button-primary w-full text-xs"
               >
                 Ir al sitio oficial
               </TrackedOutboundLink>
            </div>

            <div className="gs-card p-6">
               <h4 className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-blue-300">
                 <Calendar size={14} /> Próximos Eventos
               </h4>
               <p className="mb-6 text-xs leading-relaxed text-slate-400">
                 Consulta nuestra agenda para ver qué se transmite en {platform.name} esta semana.
               </p>
               <Link href="/?envivo=1" className="gs-button gs-button-quiet w-full text-xs">
                 Ver Agenda en Vivo
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

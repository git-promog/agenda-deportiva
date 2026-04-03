import { createClient } from '@supabase/supabase-js';
import { Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import NextImage from 'next/image';
import { Metadata, ResolvingMetadata } from 'next';
import ShareButton from '@/components/ShareButton';
import AdPlacement from '@/components/AdPlacement';
import Breadcrumbs from '@/components/Breadcrumbs';
import type { JSX } from 'react';

// ISR update every 12 hours for news
export const revalidate = 43200;

interface Props {
  params: Promise<{ slug: string }>;
}

function renderArticleContent(content: string) {
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join('\n').trim();
      if (text) {
        elements.push(
          <p key={`p-${elements.length}`} className="text-slate-300 leading-relaxed mb-4">
            {text}
          </p>
        );
      }
      currentParagraph = [];
    }
  };

  const sectionHeadingPatterns = [
    /^ANÁLISIS DE GUIASPORTS/i,
    /^ALINEACIONES PROBABLES/i,
    /^DÓNDE VER/i,
    /^DÓNDE VERLO/i,
    /^CANALES Y STREAMING/i,
    /^HORARIO Y CANAL/i,
    /^CLAVES DEL PARTIDO/i,
    /^CONTEXTO/i,
    /^PREVIA/i,
    /^ESTADÍSTICAS/i,
    /^FORMACIÓN/i,
    /^CONCLUSIÓN/i,
    /^PRÓXIMO PARTIDO/i,
    /^SITUACIÓN ACTUAL/i,
    /^EL DATO/i,
    /^LA CLAVE/i,
    /^ANTECEDENTES/i,
    /^ANÁLISIS TÁCTICO/i,
    /^PROYECCIÓN/i,
    /^PREDICCIÓN/i,
    /^RESULTADOS RECIENTES/i,
    /^EN CUANTO A/i,
    /^POR ÚLTIMO/i,
    /^RECUERDA/i,
    /^NO TE PIERDAS/i,
    /^MÁS INFORMACIÓN/i,
    /^TE PUEDE INTERESAR/i,
  ];

  const isSectionHeading = (line: string): boolean => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    if (trimmed.length > 80) return false;
    if (trimmed.endsWith(':') || trimmed.endsWith('!')) {
      return sectionHeadingPatterns.some(pattern => pattern.test(trimmed));
    }
    if (trimmed === trimmed.toUpperCase() && trimmed.length > 3 && trimmed.length < 60) {
      return sectionHeadingPatterns.some(pattern => pattern.test(trimmed));
    }
    return sectionHeadingPatterns.some(pattern => pattern.test(trimmed));
  };

  const isSubHeading = (line: string): boolean => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    if (trimmed.length > 80) return false;
    const subPatterns = [
      /^TV ABIERTA/i, /^TV DE PAGA/i, /^STREAMING/i,
      /^OPCIONES GRATUITAS/i, /^OPCIONES DE PAGO/i,
      /^TRANSMISIÓN/i, /^EN VIVO/i, /^CANALES/i,
      /^PLATAFORMAS/i, /^APPS/i,
      /^LOCAL/i, /^VISITANTE/i, /^PROBABLES/i,
      /^PORTEROS/i, /^DEFENSA/i, /^MEDIOCAMPO/i, /^DELANTEROS/i,
      /^BANCA/i, /^SUPLENTES/i,
    ];
    return subPatterns.some(pattern => pattern.test(trimmed));
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      continue;
    }

    if (isSectionHeading(trimmed)) {
      flushParagraph();
      elements.push(
        <h2 key={`h2-${elements.length}`} className="text-xl md:text-2xl font-black italic uppercase text-white mt-10 mb-4 tracking-tight">
          {trimmed.replace(/:$/, '')}
        </h2>
      );
    } else if (isSubHeading(trimmed)) {
      flushParagraph();
      elements.push(
        <h3 key={`h3-${elements.length}`} className="text-lg font-black uppercase text-blue-400 mt-6 mb-3 tracking-wide">
          {trimmed.replace(/:$/, '')}
        </h3>
      );
    } else {
      currentParagraph.push(trimmed);
    }
  }

  flushParagraph();
  return elements;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: noticia } = await supabase
    .from('noticias')
    .select('titulo, contenido, imagen_url, fecha, created_at')
    .eq('slug', slug)
    .maybeSingle();

  if (!noticia) {
    return {
      title: 'Noticia no encontrada - GuíaSports',
      description: 'La noticia que buscas no existe o fue removida. Encuentra más contenido deportivo en GuíaSports.',
    };
  }

  // Get first 150 chars for description with SEO-optimized format
  const cleanDescription = noticia.contenido.substring(0, 150).replace(/\n/g, ' ') + '...';
  const seoDescription = `Horario y dónde ver en vivo ${noticia.titulo}: canales TV, streaming y plataforma. ${noticia.contenido.substring(0, 120).replace(/\n/g, ' ')}... GuíaSports México.`;
  const wordCount = noticia.contenido.split(/\s+/).length;

  return {
    title: `${noticia.titulo} | Horario y Canal TV | GuíaSports`,
    description: seoDescription,
    alternates: {
      canonical: `https://www.guiasports.com/noticias/${slug}`,
    },
    openGraph: {
      title: noticia.titulo,
      description: seoDescription,
      images: noticia.imagen_url ? [{ url: noticia.imagen_url }] : [],
      type: 'article',
      locale: 'es_MX',
      publishedTime: noticia.fecha,
      modifiedTime: noticia.created_at || noticia.fecha,
    },
    twitter: {
      card: 'summary_large_image',
      title: noticia.titulo,
      description: seoDescription,
      images: noticia.imagen_url ? [noticia.imagen_url] : [],
    },
    other: {
      'article:published_time': noticia.fecha,
      'article:modified_time': noticia.created_at || noticia.fecha,
      'article:author': 'GuíaSports Editorial',
      'article:section': 'Deportes',
    },
  };
}

export default async function NoticiaDetalle({ params }: Props) {
  const { slug } = await params;
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: noticia } = await supabase
    .from('noticias')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (!noticia) {
    const { data: noticiasRecientes } = await supabase
      .from('noticias')
      .select('titulo, slug, fecha, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    return (
      <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col items-center justify-center p-10 text-center">
        <NextImage src="/GuiaSports-logo.svg" alt="GuíaSports" width={150} height={50} className="mb-10 opacity-20" />
        <h1 className="text-3xl font-black uppercase italic mb-4">Noticia no encontrada</h1>
        <p className="text-slate-500 text-sm mb-8 max-w-md">La noticia que buscas no existe o fue removida. Pero tenemos más contenido deportivo para ti.</p>
        
        {noticiasRecientes && noticiasRecientes.length > 0 && (
          <div className="w-full max-w-lg mb-8">
            <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-4">Últimas Noticias</h2>
            <div className="space-y-3 text-left">
              {noticiasRecientes.map((n: any) => (
                <Link key={n.slug} href={`/noticias/${n.slug}`} className="block bg-slate-900/50 border border-slate-800 p-4 rounded-xl hover:border-blue-500/30 transition-all group">
                  <h3 className="text-sm font-black italic uppercase text-slate-200 group-hover:text-white leading-tight">{n.titulo}</h3>
                  <p className="text-[9px] text-slate-500 uppercase font-bold mt-1">{n.fecha}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Link href="/" className="bg-blue-600 px-8 py-4 rounded-2xl font-black uppercase text-xs hover:bg-blue-500 transition-colors">Ver Agenda</Link>
          <Link href="/noticias" className="bg-slate-900 border border-slate-800 px-8 py-4 rounded-2xl font-black uppercase text-xs hover:border-slate-700 transition-colors">Todas las Noticias</Link>
        </div>
      </div>
    );
  }

  const { data: noticiasRelacionadas } = await supabase
    .from('noticias')
    .select('titulo, slug, fecha, created_at')
    .neq('slug', slug)
    .order('created_at', { ascending: false })
    .limit(3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": noticia.titulo,
    "description": noticia.contenido.substring(0, 150).replace(/\n/g, ' ') + '...',
    "image": noticia.imagen_url ? [noticia.imagen_url] : [],
    "datePublished": noticia.fecha,
    "dateModified": noticia.created_at || noticia.fecha,
    "author": {
      "@type": "Organization",
      "name": "GuíaSports Editorial",
      "url": "https://www.guiasports.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "GuíaSports",
      "url": "https://www.guiasports.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.guiasports.com/GuiaSports-logo.svg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.guiasports.com/noticias/${noticia.slug}`
    },
    "inLanguage": "es-MX",
    "articleSection": "Deportes",
    "wordCount": noticia.contenido.split(/\s+/).length,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-20">
      <div className="max-w-3xl mx-auto px-4 pt-10">
        
        <Breadcrumbs items={[{ label: "Noticias", href: "/noticias" }]} current={noticia.titulo} />

        <header className="mb-8">
          <Link href="/noticias" className="text-[10px] font-black text-[#a3e635] bg-[#a3e635]/10 px-3 py-1 rounded-full w-fit border border-[#a3e635]/20 uppercase mb-6 italic tracking-widest inline-block hover:bg-[#a3e635]/20 transition-colors">
            Previas y Análisis
          </Link>
          
          <h1 className="text-4xl md:text-6xl font-black italic uppercase leading-[0.95] tracking-tighter mb-8">
            {noticia.titulo}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-y border-slate-800/50 py-6 mb-8">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-blue-500"/> 
              {noticia.fecha}
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-blue-500"/> 
              Lectura aprox. 4 min
            </div>
            <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>
            <div className="text-blue-400">GuíaSports Editorial</div>
          </div>
        </header>

        {/* ANUNCIO IN THE TOP */}
        <AdPlacement className="mb-10" />

        {/* --- SECCIÓN DE IMAGEN DESTACADA --- */}
        {noticia.imagen_url && (
          <div className="relative w-full h-[250px] md:h-[400px] mb-12 rounded-[40px] overflow-hidden border border-slate-800 shadow-2xl group">
            <NextImage 
              src={noticia.imagen_url} 
              alt={noticia.titulo} 
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 800px"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80 mix-blend-multiply"></div>
          </div>
        )}

        {/* CONTENIDO DEL ARTÍCULO */}
        <article className="prose prose-invert prose-lg md:prose-xl max-w-none text-slate-300 leading-relaxed mb-16">
          {renderArticleContent(noticia.contenido)}
        </article>

        {/* ARTÍCULOS RELACIONADOS */}
        {noticiasRelacionadas && noticiasRelacionadas.length > 0 && (
          <section className="mb-12">
            <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> También te puede interesar
            </h2>
            <div className="space-y-3">
              {noticiasRelacionadas.map((n: any) => (
                <Link key={n.slug} href={`/noticias/${n.slug}`} className="block bg-slate-900/30 border border-slate-800/50 p-5 rounded-2xl hover:border-blue-500/30 hover:bg-slate-900/60 transition-all group">
                  <h3 className="text-sm font-black italic uppercase text-slate-200 group-hover:text-white leading-tight mb-1">{n.titulo}</h3>
                  <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">{n.fecha} • Leer más →</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* BANNER INFERIOR Y COMPARTIR */}
        <div className="p-8 bg-gradient-to-br from-blue-600 to-blue-900 rounded-[32px] flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 opacity-20 blur-3xl rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="text-center md:text-left relative z-10">
              <h2 className="text-white font-black uppercase italic text-lg leading-none">¿Te sirvió la guía?</h2>
              <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mt-1">Ayúdanos compartiendo GuíaSports</p>
            </div>
            <div className="relative z-10 w-full md:w-auto">
              <ShareButton titulo={noticia.titulo} slug={noticia.slug} />
            </div>
        </div>
      </div>
      </div>
    </>
  );
}
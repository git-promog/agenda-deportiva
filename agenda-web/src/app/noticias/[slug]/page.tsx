import { createClient } from '@supabase/supabase-js';
import { 
  Calendar, 
  Clock, 
  Tv, 
  Info, 
  Target, 
  Activity, 
  MapPin, 
  ListChecks,
  ChevronRight,
  Sparkles
} from 'lucide-react';
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
  const headings: { id: string; text: string }[] = [];
  let currentParagraph: string[] = [];
  let currentList: JSX.Element[] = [];
  let isOrderedList = false;

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join('\n').trim();
      if (text) {
        // Look for "Label: Value" patterns to bold the label
        const formattedText = text.split('\n').map((line, idx) => {
          const colonIndex = line.indexOf(':');
          if (colonIndex > 0 && colonIndex < 40) {
            return (
              <span key={idx} className="block mb-1">
                <strong className="text-blue-400 font-bold">{line.substring(0, colonIndex + 1)}</strong>
                {line.substring(colonIndex + 1)}
              </span>
            );
          }
          return <span key={idx} className="block mb-1">{line}</span>;
        });

        elements.push(
          <div key={`p-${elements.length}`} className="text-slate-300 leading-relaxed mb-6">
            {formattedText}
          </div>
        );
      }
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (currentList.length > 0) {
      const ListTag = isOrderedList ? 'ol' : 'ul';
      elements.push(
        <ListTag key={`list-${elements.length}`} className={`mb-8 space-y-3 ${isOrderedList ? 'list-decimal ml-6' : 'list-none'}`}>
          {currentList}
        </ListTag>
      );
      currentList = [];
    }
  };

  const sectionHeadingPatterns = [
    { pattern: /^ANÁLISIS DE GUIASPORTS/i, icon: <Sparkles className="w-5 h-5 text-yellow-400" /> },
    { pattern: /^ALINEACIONES PROBABLES/i, icon: <ListChecks className="w-5 h-5 text-green-400" /> },
    { pattern: /^DÓNDE VER/i, icon: <Tv className="w-5 h-5 text-blue-400" /> },
    { pattern: /^CANALES Y STREAMING/i, icon: <Tv className="w-5 h-5 text-blue-400" /> },
    { pattern: /^HORARIO/i, icon: <Clock className="w-5 h-5 text-purple-400" /> },
    { pattern: /^CLAVES DEL PARTIDO/i, icon: <Target className="w-5 h-5 text-red-400" /> },
    { pattern: /^ESTADÍSTICAS/i, icon: <Activity className="w-5 h-5 text-orange-400" /> },
    { pattern: /^SITUACIÓN ACTUAL/i, icon: <Info className="w-5 h-5 text-cyan-400" /> },
    { pattern: /^ANTECEDENTES/i, icon: <Activity className="w-5 h-5 text-indigo-100" /> },
    { pattern: /^CONCLUSIÓN/i, icon: <ChevronRight className="w-5 h-5 text-slate-400" /> },
  ];

  const getHeadingInfo = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.length > 80) return null;
    
    // Check if it's one of our known sections
    for (const item of sectionHeadingPatterns) {
      if (item.pattern.test(trimmed)) {
        return item;
      }
    }

    // Generic heading detection: Uppercase and short
    if (trimmed === trimmed.toUpperCase() && trimmed.length > 3 && trimmed.length < 50) {
      return { pattern: null, icon: <ChevronRight className="w-5 h-5 text-blue-500" /> };
    }

    // Ends with colon and short
    if (trimmed.endsWith(':') && trimmed.length < 40) {
      return { pattern: null, icon: <ChevronRight className="w-5 h-5 text-blue-500" /> };
    }

    return null;
  };

  // First pass: collect headings for TOC
  lines.forEach((line, index) => {
    const info = getHeadingInfo(line);
    if (info) {
      const text = line.trim().replace(/:$/, '');
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      headings.push({ id, text });
    }
  });

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    // Check for list items
    const listMatch = trimmed.match(/^[-*•]\s+(.*)/) || trimmed.match(/^(\d+)[.)]\s+(.*)/);
    if (listMatch) {
      flushParagraph();
      const isOrdered = !!trimmed.match(/^\d+[.)]/);
      if (isOrdered !== isOrderedList && currentList.length > 0) {
        flushList();
      }
      isOrderedList = isOrdered;
      
      const content = listMatch[1] || listMatch[2];
      currentList.push(
        <li key={`li-${elements.length}-${currentList.length}`} className="flex items-start gap-3 group">
          {!isOrderedList && <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:bg-blue-400 transition-colors" />}
          <span className="text-slate-300 leading-relaxed">{content}</span>
        </li>
      );
      continue;
    } else if (currentList.length > 0) {
      flushList();
    }

    const headingInfo = getHeadingInfo(trimmed);
    if (headingInfo) {
      flushParagraph();
      const cleanTitle = trimmed.replace(/:$/, '');
      const id = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      // Special styling for "DÓNDE VER" or "HORARIO" as a card
      const isSpecialSection = /DÓNDE VER|HORARIO/i.test(trimmed);
      
      if (isSpecialSection) {
        elements.push(
          <div key={`special-${elements.length}`} id={id} className="scroll-mt-24 my-10 p-6 bg-gradient-to-br from-slate-900 to-[#020617] border border-blue-500/20 rounded-3xl relative overflow-hidden group hover:border-blue-500/40 transition-all shadow-xl shadow-blue-900/10">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              {headingInfo.icon}
            </div>
            <h2 className="text-xl font-black italic uppercase text-white mb-6 flex items-center gap-3">
              {headingInfo.icon}
              {cleanTitle}
            </h2>
            {/* The next lines will be part of this card until the next empty line or heading */}
            <div className="space-y-3">
              {(() => {
                const subElements = [];
                let nextIdx = i + 1;
                while (nextIdx < lines.length && lines[nextIdx].trim() && !getHeadingInfo(lines[nextIdx])) {
                  const subLine = lines[nextIdx].trim();
                  const colonIdx = subLine.indexOf(':');
                  if (colonIdx > 0) {
                    subElements.push(
                      <div key={`sub-${nextIdx}`} className="flex justify-between items-center border-b border-slate-800/50 py-3 last:border-0">
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.1em]">{subLine.substring(0, colonIdx)}</span>
                        <span className="text-sm font-black text-[#a3e635] italic">{subLine.substring(colonIdx + 1).trim()}</span>
                      </div>
                    );
                  } else {
                    subElements.push(<p key={`sub-${nextIdx}`} className="text-sm text-slate-400 py-1 leading-relaxed">{subLine}</p>);
                  }
                  nextIdx++;
                }
                i = nextIdx - 1; // Skip these lines in the main loop
                return subElements;
              })()}
            </div>
          </div>
        );
      } else {
        elements.push(
          <h2 key={`h2-${elements.length}`} id={id} className="scroll-mt-24 text-xl md:text-2xl font-black italic uppercase text-white mt-12 mb-6 tracking-tight flex items-center gap-3 border-l-4 border-blue-600 pl-4 py-1 bg-blue-600/5 rounded-r-lg group hover:bg-blue-600/10 transition-colors">
            {headingInfo.icon}
            {cleanTitle}
          </h2>
        );
      }
    } else {
      currentParagraph.push(trimmed);
    }
  }

  flushParagraph();
  flushList();

  // Insert TOC at the beginning if there are several headings
  if (headings.length > 2) {
    const toc = (
      <nav key="toc" className="mb-12 p-6 bg-slate-900/30 border border-slate-800 rounded-2xl">
        <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <ChevronRight className="w-3 h-3" /> Contenido de esta guía
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          {headings.map((h, idx) => (
            <li key={idx}>
              <a href={`#${h.id}`} className="text-xs font-bold text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                <span className="w-1 h-1 bg-slate-700 rounded-full group-hover:bg-blue-500 transition-colors" />
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
    elements.unshift(toc);
  }

  return elements;
}


export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  // Clean slug: decode, lowercase, and remove trailing slash
  const decodedSlug = decodeURIComponent(slug).toLowerCase().replace(/\/$/, "");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: noticia, error } = await supabase
    .from('noticias')
    .select('*')
    .eq('slug', decodedSlug)
    .maybeSingle();

  console.log("=== METADATA DEBUG ===");
  console.log("Raw Slug:", slug);
  console.log("Decoded Slug:", decodedSlug);
  console.log("Noticia found?:", !!noticia);
  if (error) console.log("Supabase Error:", error);

  if (!noticia) {
    return {
      title: 'Noticia no encontrada - GuíaSports',
      description: 'La noticia que buscas no existe o fue removida. Encuentra más contenido deportivo en GuíaSports.',
    };
  }

  // Get first 150 chars for description with SEO-optimized format
  const cleanDescription = noticia.contenido.substring(0, 150).replace(/\n/g, ' ') + '...';
  const seoDescription = `¿A qué hora y en qué canal ver ${noticia.titulo}? Consulta aquí la guía definitiva: canales de TV, plataformas de streaming y alineaciones probables para seguir el partido en vivo. GuíaSports te trae toda la información de última hora.`;
  
  // Extract keywords for tags
  const keywords = noticia.titulo.split(' ').filter((w: string) => w.length > 3).slice(0, 5);

  return {
    title: `En vivo: ${noticia.titulo} | Horario, Canal y Dónde Ver`,
    description: seoDescription,
    keywords: keywords.join(', '),
    alternates: {
      canonical: `https://www.guiasports.com/noticias/${decodedSlug}`,
    },
    openGraph: {
      title: `Guía TV: ${noticia.titulo}`,
      description: seoDescription,
      images: noticia.imagen_url ? [{ url: noticia.imagen_url }] : [],
      type: 'article',
      locale: 'es_MX',
      publishedTime: noticia.fecha,
      modifiedTime: noticia.created_at || noticia.fecha,
      siteName: 'GuíaSports México',
    },
    twitter: {
      card: 'summary_large_image',
      title: noticia.titulo,
      description: seoDescription,
      images: noticia.imagen_url ? [noticia.imagen_url] : [],
      site: '@guiasports',
    },
    other: {
      'article:published_time': noticia.fecha,
      'article:modified_time': noticia.created_at || noticia.fecha,
      'article:author': 'GuíaSports Editorial',
      'article:section': 'Fútbol Internacional',
      'article:tag': keywords.join(','),
    },
  };
}

export default async function NoticiaDetalle({ params }: Props) {
  const { slug } = await params;
  // Clean slug: decode, lowercase, and remove trailing slash
  const decodedSlug = decodeURIComponent(slug).toLowerCase().replace(/\/$/, "");
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: noticia } = await supabase
    .from('noticias')
    .select('*')
    .eq('slug', decodedSlug)
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
    .neq('slug', decodedSlug)
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
          
          <h1 className="text-4xl md:text-6xl font-black italic uppercase leading-[0.95] tracking-tighter mb-8 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
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
              priority={true}
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
import { createClient } from '@supabase/supabase-js';
import { 
  Calendar, 
  Clock, 
  Tv, 
  Info, 
  Target, 
  Activity, 
  ListChecks,
  ChevronRight,
  Sparkles,
  Newspaper
} from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';
import NextImage from 'next/image';
import { Metadata } from 'next';
import ShareButton from '@/components/ShareButton';
import AdPlacement from '@/components/AdPlacement';
import Breadcrumbs from '@/components/Breadcrumbs';
import AuthorBio from '@/components/AuthorBio';
import ArticleViewTracker from '@/components/ArticleViewTracker';
import { EDITORIAL_TEAM } from '@/data/teamData';
import { PLATFORMS } from '@/data/platformsData';
import type { JSX } from 'react';

// ISR update every 12 hours for news
export const revalidate = 43200;

interface Props {
  params: Promise<{ slug: string }>;
}

interface NoticiaRelacionada {
  titulo: string;
  slug: string;
  fecha: string;
  imagen_url?: string | null;
}

interface ChannelInfo {
  name: string;
  type: string;
  price: string;
  url: string;
  keywords: string[];
}

const getChannelsDb = (): ChannelInfo[] => {
  const traditional: ChannelInfo[] = [
    {
      name: "Fox Sports México",
      type: "Televisión de paga",
      price: "Incluido en cable",
      url: "https://www.foxsports.com.mx",
      keywords: ["fox sports", "fox sports 1", "fox sports 2", "fox sports 3", "fox sports premium", "foxsports"]
    },
    {
      name: "ESPN México",
      type: "Televisión de paga",
      price: "Incluido en cable",
      url: "https://www.espn.com.mx",
      keywords: ["espn", "espn 1", "espn 2", "espn 3", "espn 4", "espn+"]
    },
    {
      name: "TUDN",
      type: "Televisión de paga",
      price: "Incluido en cable",
      url: "https://www.tudn.com",
      keywords: ["tudn"]
    },
    {
      name: "Sky Sports",
      type: "Televisión satelital",
      price: "Suscripción mensual Sky",
      url: "https://www.sky.com.mx",
      keywords: ["sky sports", "skysports", "sky mx", "sky"]
    },
    {
      name: "Azteca 7",
      type: "Televisión abierta",
      price: "Gratis (Canal 7)",
      url: "https://www.tvazteca.com/aztecadeportes",
      keywords: ["azteca 7", "tv azteca", "azteca deportes", "canal 7"]
    },
    {
      name: "Canal 5",
      type: "Televisión abierta",
      price: "Gratis (Canal 5)",
      url: "https://www.televisa.com",
      keywords: ["canal 5", "televisa", "canal 5*"]
    },
    {
      name: "Las Estrellas",
      type: "Televisión abierta",
      price: "Gratis (Canal 2)",
      url: "https://www.televisa.com",
      keywords: ["las estrellas", "canal 2"]
    },
    {
      name: "Caliente TV",
      type: "Plataforma / Canal de TV",
      price: "Gratis / Incluido",
      url: "https://www.caliente.tv",
      keywords: ["caliente tv", "calientetv", "caliente"]
    }
  ];

  const digital = PLATFORMS.map(p => {
    let name = p.name;
    if (p.id === 'vix') name = "ViX Premium";
    return {
      name,
      type: "Plataforma digital",
      price: p.price.split("/")[0].trim() || p.price,
      url: p.ctaUrl,
      keywords: [p.name.toLowerCase(), p.slug.toLowerCase(), p.id.toLowerCase()]
    };
  });

  const vixFreeIndex = digital.findIndex(d => d.keywords.includes('vix'));
  if (vixFreeIndex >= 0) {
    digital[vixFreeIndex].keywords.push("vix premium");
    digital[vixFreeIndex].keywords.push("vix+");
  }

  return [...digital, ...traditional];
};

function extractMatchedChannels(content: string): ChannelInfo[] {
  const lines = content.split('\n');
  let isDondeVer = false;
  const subLines: string[] = [];

  const getHeadingInfoForExtraction = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.length > 80) return false;
    const cleanLine = trimmed.replace(/^[#\s*_-]+/, '').replace(/[#\s*_-]+$/, '').replace(/:$/, '').trim();
    const sectionHeadingPatterns = [
      /ANÁLISIS DE GUIASPORTS/i,
      /ALINEACIONES PROBABLES/i,
      /DÓNDE VER|CANALES|STREAMING|TRANSMISIÓN|TELEVISIÓN|TV|VERLO/i,
      /HORARIO/i,
      /CLAVES DEL PARTIDO/i,
      /ESTADÍSTICAS/i,
      /SITUACIÓN ACTUAL/i,
      /ANTECEDENTES/i,
      /CONCLUSIÓN/i
    ];
    for (const pattern of sectionHeadingPatterns) {
      if (pattern.test(cleanLine)) return true;
    }
    if (cleanLine === cleanLine.toUpperCase() && cleanLine.length > 3 && cleanLine.length < 50) return true;
    return false;
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    const cleanLine = trimmed.replace(/^[#\s*_-]+/, '').replace(/[#\s*_-]+$/, '').replace(/:$/, '').trim();
    if (getHeadingInfoForExtraction(trimmed)) {
      if (/DÓNDE VER|CANALES|STREAMING|TRANSMISIÓN|TELEVISIÓN|TV|VERLO/i.test(cleanLine)) {
        isDondeVer = true;
      } else {
        isDondeVer = false;
      }
      continue;
    }

    if (isDondeVer) {
      subLines.push(trimmed);
    }
  }

  const sectionText = subLines.join(" ").toLowerCase();
  const channelsDb = getChannelsDb();
  return channelsDb.filter(ch => {
    return ch.keywords.some(kw => {
      const escaped = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b|${escaped}(?=\\s|\\+|$)`, 'i');
      return regex.test(sectionText);
    });
  });
}

function extractChannelsFromContent(content: string): { tvText: string; streamText: string } {
  const lines = content.split('\n');
  let isTargetSection = false;
  const extractedLines: string[] = [];

  const sectionHeadingPatterns = [
    { pattern: /^ANÁLISIS DE GUIASPORTS/i },
    { pattern: /^ALINEACIONES PROBABLES/i },
    { pattern: /^DÓNDE VER/i },
    { pattern: /^CANALES Y STREAMING/i },
    { pattern: /^HORARIO/i },
    { pattern: /^CLAVES DEL PARTIDO/i },
    { pattern: /^ESTADÍSTICAS/i },
    { pattern: /^SITUACIÓN ACTUAL/i },
    { pattern: /^ANTECEDENTES/i },
    { pattern: /^CONCLUSIÓN/i },
  ];

  const getHeadingInfo = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.length > 80) return null;
    
    for (const item of sectionHeadingPatterns) {
      if (item.pattern.test(trimmed)) {
        return item;
      }
    }

    if (trimmed === trimmed.toUpperCase() && trimmed.length > 3 && trimmed.length < 50) {
      return { pattern: null };
    }

    if (trimmed.endsWith(':') && trimmed.length < 40) {
      return { pattern: null };
    }

    return null;
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const headingInfo = getHeadingInfo(trimmed);
    if (headingInfo) {
      const cleanTitle = trimmed.replace(/:$/, '').trim();
      const isMatch = /DÓNDE VER|CANALES|STREAMING|TRANSMISIÓN|TELEVISIÓN|TV|VERLO/i.test(cleanTitle);
      if (isMatch) {
        isTargetSection = true;
      } else {
        isTargetSection = false;
      }
      continue;
    }

    if (isTargetSection) {
      // Remove list indicators
      const cleanLine = trimmed.replace(/^[-*•\d+.)\s]+/, '').trim();
      if (cleanLine) {
        extractedLines.push(cleanLine);
      }
    }
  }

  const tvLines: string[] = [];
  const streamLines: string[] = [];

  extractedLines.forEach(line => {
    const lower = line.toLowerCase();
    const isStream = /streaming|plataforma|digital|online|app|youtube|vix/i.test(lower);
    const isTv = /tv|televisión|abierta|paga|cable|canal|señal/i.test(lower);

    if (isStream) {
      streamLines.push(line);
    } else if (isTv) {
      tvLines.push(line);
    } else {
      tvLines.push(line);
    }
  });

  const formatList = (arr: string[]): string => {
    if (arr.length === 0) return "";
    if (arr.length === 1) return arr[0];
    if (arr.length === 2) return `${arr[0]} y ${arr[1]}`;
    return `${arr.slice(0, -1).join(", ")} y ${arr[arr.length - 1]}`;
  };

  const tvText = tvLines.length > 0 
    ? formatList(tvLines) 
    : (extractedLines.length > 0 ? formatList(extractedLines.slice(0, 3)) : "los canales locales autorizados de televisión abierta o de paga");

  const streamText = streamLines.length > 0 
    ? formatList(streamLines) 
    : (extractedLines.length > 0 ? formatList(extractedLines.slice(0, 3)) : "las principales plataformas digitales de streaming deportivo");

  return { tvText, streamText };
}

function extractScheduleFromContent(content: string): string {
  const lines = content.split('\n');
  let isTargetSection = false;
  const extractedLines: string[] = [];

  const sectionHeadingPatterns = [
    { pattern: /^ANÁLISIS DE GUIASPORTS/i },
    { pattern: /^ALINEACIONES PROBABLES/i },
    { pattern: /^DÓNDE VER/i },
    { pattern: /^CANALES Y STREAMING/i },
    { pattern: /^HORARIO/i },
    { pattern: /^CLAVES DEL PARTIDO/i },
    { pattern: /^ESTADÍSTICAS/i },
    { pattern: /^SITUACIÓN ACTUAL/i },
    { pattern: /^ANTECEDENTES/i },
    { pattern: /^CONCLUSIÓN/i },
  ];

  const getHeadingInfo = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.length > 80) return null;
    
    for (const item of sectionHeadingPatterns) {
      if (item.pattern.test(trimmed)) {
        return item;
      }
    }

    if (trimmed === trimmed.toUpperCase() && trimmed.length > 3 && trimmed.length < 50) {
      return { pattern: null };
    }

    if (trimmed.endsWith(':') && trimmed.length < 40) {
      return { pattern: null };
    }

    return null;
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const headingInfo = getHeadingInfo(trimmed);
    if (headingInfo) {
      const cleanTitle = trimmed.replace(/:$/, '').trim();
      if (/HORARIO/i.test(cleanTitle)) {
        isTargetSection = true;
      } else {
        isTargetSection = false;
      }
      continue;
    }

    if (isTargetSection) {
      const cleanLine = trimmed.replace(/^[-*•\d+.)\s]+/, '').trim();
      if (cleanLine) {
        extractedLines.push(cleanLine);
      }
    }
  }

  if (extractedLines.length === 0) return "";

  // Join all extracted schedule lines into a readable string
  return extractedLines.join(". ").replace(/\.\./g, '.');
}

function getFaqs(titulo: string, fecha: string, contenido: string): { question: string; answer: string }[] {
  let eventName = titulo.split(':')[0].trim();
  eventName = eventName.replace(/horario|canal|dónde ver|en vivo|méxico/gi, '').replace(/\s+/g, ' ').trim();
  if (eventName.endsWith(' y')) {
    eventName = eventName.substring(0, eventName.length - 2).trim();
  }
  if (!eventName) eventName = "este evento deportivo";

  const { tvText, streamText } = extractChannelsFromContent(contenido);
  const scheduleText = extractScheduleFromContent(contenido);

  const scheduleAnswer = scheduleText
    ? `Según la información oficial, el horario programado para ${eventName} es: ${scheduleText}. Te sugerimos sintonizar la transmisión con unos minutos de anticipación para no perderte el silbatazo inicial y toda la cobertura del juego.`
    : `El enfrentamiento de ${eventName} está programado para disputarse el día ${fecha} en el horario estelar de la jornada deportiva en México. Te sugerimos sintonizar la transmisión con unos minutos de anticipación para no perderte el silbatazo inicial y toda la cobertura del juego.`;

  return [
    {
      question: `¿Cuándo y a qué hora es el partido de ${eventName}?`,
      answer: scheduleAnswer
    },
    {
      question: `¿En qué canal de televisión abierta o de paga transmiten ${eventName}?`,
      answer: `La transmisión por televisión de este encuentro para el territorio mexicano estará disponible a través de las señales de ${tvText}. Te sugerimos verificar la parrilla de programación local de tu proveedor de cable antes del inicio del juego para asegurar tu sintonía oficial.`
    },
    {
      question: `¿Cómo ver en vivo online y por streaming el juego de ${eventName}?`,
      answer: `Para seguir este compromiso de forma online a través de internet y streaming en México, podrás sintonizar las plataformas de ${streamText}. Asegúrate de descargar la aplicación oficial en tu teléfono o Smart TV y contar con una cuenta activa antes del silbatazo.`
    },
    {
      question: `¿Dónde puedo consultar el resultado y resumen de ${eventName}?`,
      answer: `Una vez concluido el compromiso, podrás consultar el marcador final, el resumen de las mejores jugadas y la crónica completa del encuentro de forma inmediata en GuíaSports, tu guía de referencia indispensable para todo el acontecer deportivo nacional e internacional.`
    }
  ];
}

const getArticleKeywords = (title: string) =>
  title
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 3 && !["donde", "para", "vivo", "hora", "canal", "como", "guia", "sports"].includes(word))
    .slice(0, 8);

const buildSeoDescription = (title: string, content: string) => {
  const cleanContent = content.replace(/\s+/g, " ").trim();
  const fallback = `Consulta horario, canal de TV y streaming para ver ${title} en vivo en México.`;
  return (cleanContent.length > 80 ? cleanContent : fallback).slice(0, 155);
};

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
  lines.forEach((line) => {
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
                  if (colonIdx > 0 && colonIdx < 40) {
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
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params;
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
    return {
      title: 'Noticia no encontrada - GuíaSports',
      description: 'La noticia que buscas no existe o fue removida. Encuentra más contenido deportivo en GuíaSports.',
    };
  }

  const seoDescription = buildSeoDescription(noticia.titulo, noticia.contenido);
  const keywords = getArticleKeywords(noticia.titulo);

  return {
    title: `${noticia.titulo} | Horario, Canal y Dónde Ver`,
    description: seoDescription,
    keywords: keywords.join(', '),
    alternates: {
      canonical: `https://www.guiasports.com/noticias/${decodedSlug}`,
    },
    openGraph: {
      title: `${noticia.titulo} | GuíaSports`,
      description: seoDescription,
      images: noticia.imagen_url ? [{ url: noticia.imagen_url }] : [],
      type: 'article',
      locale: 'es_MX',
      publishedTime: noticia.fecha,
      modifiedTime: noticia.fecha,
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
      'article:modified_time': noticia.fecha,
      'article:author': noticia.autor || 'Redacción GuíaSports',
      'article:section': 'Deportes',
      'article:tag': keywords.join(','),
    },
  };
}

export default async function NoticiaDetalle({ params }: Props) {
  const { slug } = await params;
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
      .select('titulo, slug, fecha')
      .order('fecha', { ascending: false })
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
              {noticiasRecientes.map((n: NoticiaRelacionada) => (
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

  const keywords = getArticleKeywords(noticia.titulo);
  const { data: noticiasCandidatas } = await supabase
    .from('noticias')
    .select('titulo, slug, fecha, imagen_url')
    .neq('slug', decodedSlug)
    .order('fecha', { ascending: false })
    .limit(12);

  const noticiasRelacionadas = (noticiasCandidatas || [])
    .map((candidata: NoticiaRelacionada) => {
      const title = candidata.titulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const score = keywords.reduce((total, keyword) => total + (title.includes(keyword) ? 1 : 0), 0);
      return { ...candidata, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // Author resolution
  const autor = EDITORIAL_TEAM.find(a => a.name === noticia.autor) || {
    id: "redaccion",
    name: noticia.autor || "Redacción GuíaSports",
    role: "Equipo Editorial",
    bio: "Especialistas en la cobertura de eventos deportivos nacionales e internacionales en México.",
    specialty: "Deportes en General",
    avatar: ""
  };

  // Channels and FAQ resolution
  const matchedChannels = extractMatchedChannels(noticia.contenido);
  const faqs = getFaqs(noticia.titulo, noticia.fecha, noticia.contenido);

  // JSON-LD NewsArticle
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": noticia.titulo,
    "description": noticia.contenido.substring(0, 150).replace(/\n/g, ' ') + '...',
    "image": noticia.imagen_url ? [noticia.imagen_url] : [],
    "datePublished": noticia.fecha,
    "dateModified": noticia.fecha,
    "author": {
      "@type": "Person",
      "name": autor.name,
      "url": `https://www.guiasports.com/autores/${autor.id}`,
      "jobTitle": autor.role,
      "worksFor": {
        "@type": "Organization",
        "name": "GuíaSports"
      }
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

  // JSON-LD FAQPage
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <ArticleViewTracker slug={noticia.slug} title={noticia.titulo} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-20">
      <div className="max-w-3xl mx-auto px-4 pt-10">
        
        <Breadcrumbs items={[{ label: "Noticias", href: "/noticias" }]} current={noticia.titulo} currentHref={`/noticias/${noticia.slug}`} />

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
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Por:</span>
              <Link href={`/autores/${autor.id}`} className="text-blue-400 hover:text-blue-300 hover:underline transition-colors font-black font-sans">
                {autor.name}
              </Link>
            </div>
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

        {/* COMPONENTE FAQ_SECTION */}
        <section className="mt-16 mb-12 border-t border-slate-800 pt-10">
          <h2 className="text-2xl md:text-3xl font-black italic uppercase text-white mb-8 flex items-center gap-3 border-l-4 border-blue-600 pl-4 py-1">
            Preguntas Frecuentes
          </h2>
          <div className="space-y-4" id="faq-accordion-container">
            {faqs.map((faq, idx) => (
              <details 
                key={idx} 
                name="faq-accordion"
                className="group bg-slate-900/30 border border-slate-800/80 rounded-3xl overflow-hidden hover:border-blue-500/20 transition-all [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer select-none">
                  <h3 className="text-sm md:text-base font-black italic uppercase text-blue-400 group-hover:text-blue-300 transition-colors pr-4">
                    ¿{faq.question.replace(/^¿|\?$/g, '').trim()}?
                  </h3>
                  <div className="shrink-0 w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 group-open:rotate-90 group-open:bg-blue-600 group-open:text-white transition-all duration-300">
                    <ChevronRight size={16} />
                  </div>
                </summary>
                <div className="px-6 pb-6 pt-2 border-t border-slate-800/50">
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
          <Script id="faq-accordion-script" strategy="afterInteractive">
            {`
              document.querySelectorAll('#faq-accordion-container details').forEach(details => {
                details.addEventListener('toggle', (e) => {
                  if (details.open) {
                    document.querySelectorAll('#faq-accordion-container details').forEach(other => {
                      if (other !== details) {
                        other.removeAttribute('open');
                      }
                    });
                  }
                });
              });
            `}
          </Script>
        </section>

        {/* AUTHOR BIO (E-E-A-T) */}
        <AuthorBio author={autor} />

        {/* ARTÍCULOS RELACIONADOS */}
        {noticiasRelacionadas && noticiasRelacionadas.length > 0 && (
          <section className="mb-12">
            <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> También te puede interesar
            </h2>
            <div className="space-y-3">
              {noticiasRelacionadas.map((n: NoticiaRelacionada & { score: number }) => (
                <Link key={n.slug} href={`/noticias/${n.slug}`} className="block bg-slate-900/30 border border-slate-800/50 p-5 rounded-2xl hover:border-blue-500/30 hover:bg-slate-900/60 transition-all group">
                  <h3 className="text-sm font-black italic uppercase text-slate-200 group-hover:text-white leading-tight mb-1">{n.titulo}</h3>
                  <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">{n.fecha} • Leer más →</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ULTIMAS NOTICIAS CAROUSEL */}
        {noticiasCandidatas && noticiasCandidatas.length > 0 && (
          <section className="my-16 border-t border-slate-800 pt-10">
            <h2 className="text-xl md:text-2xl font-black italic uppercase text-white mb-6 flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-blue-500" /> Últimas Noticias
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              {noticiasCandidatas.map((n) => (
                <Link 
                  key={n.slug} 
                  href={`/noticias/${n.slug}`}
                  className="flex-shrink-0 w-64 bg-slate-900/40 border border-slate-800/80 hover:border-blue-500/20 rounded-2xl overflow-hidden flex flex-col justify-between transition-all group hover:bg-slate-900/60"
                >
                  <div className="relative w-full h-32 bg-slate-950 overflow-hidden">
                    {n.imagen_url ? (
                      <NextImage 
                        src={n.imagen_url} 
                        alt={n.titulo}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="256px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-700">
                        <Newspaper size={24} />
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <h4 className="text-xs font-black italic uppercase text-slate-200 group-hover:text-white line-clamp-2 leading-snug mb-3">
                      {n.titulo}
                    </h4>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">
                        {n.fecha}
                      </span>
                      <span className="text-[9px] text-blue-400 font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        Leer →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* BANNER INFERIOR Y COMPARTIR */}
        <div className="p-8 bg-gradient-to-br from-blue-600 to-blue-900 rounded-[32px] flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl relative">
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

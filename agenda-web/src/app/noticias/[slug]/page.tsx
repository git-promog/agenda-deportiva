import { createClient } from '@supabase/supabase-js';
import { Calendar, ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';
import NextImage from 'next/image';
import { Metadata, ResolvingMetadata } from 'next';
import ShareButton from '@/components/ShareButton';
import AdPlacement from '@/components/AdPlacement';

// ISR update every 12 hours for news
export const revalidate = 43200;

interface Props {
  params: Promise<{ slug: string }>;
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
    .select('titulo, contenido, imagen_url')
    .eq('slug', slug)
    .maybeSingle();

  if (!noticia) {
    return {
      title: 'Noticia no encontrada - GuíaSports',
    };
  }

  // Get first 150 chars for description
  const cleanDescription = noticia.contenido.substring(0, 150).replace(/\n/g, ' ') + '...';

  return {
    title: `${noticia.titulo} | GuíaSports`,
    description: cleanDescription,
    openGraph: {
      title: noticia.titulo,
      description: cleanDescription,
      images: noticia.imagen_url ? [{ url: noticia.imagen_url }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: noticia.titulo,
      description: cleanDescription,
      images: noticia.imagen_url ? [noticia.imagen_url] : [],
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
    return (
      <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col items-center justify-center p-10 text-center">
        <NextImage src="/GuiaSports-logo.svg" alt="GuíaSports" width={150} height={50} className="mb-10 opacity-20" />
        <h1 className="text-3xl font-black uppercase italic mb-4">Noticia no encontrada</h1>
        <Link href="/" className="bg-blue-600 px-8 py-4 rounded-2xl font-black uppercase text-xs">Volver al Inicio</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-20">
      <div className="max-w-3xl mx-auto px-4 pt-10">
        
        <Link href="/" className="flex items-center gap-2 text-blue-500 text-[10px] font-black uppercase tracking-widest mb-10 hover:text-blue-400 group transition-colors">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Volver a GuíaSports
        </Link>

        <header className="mb-8">
          <div className="text-[10px] font-black text-[#a3e635] bg-[#a3e635]/10 px-3 py-1 rounded-full w-fit border border-[#a3e635]/20 uppercase mb-6 italic tracking-widest">
            Previas y Análisis
          </div>
          
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
            <img 
              src={noticia.imagen_url} 
              alt={noticia.titulo} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80 mix-blend-multiply"></div>
          </div>
        )}

        {/* CONTENIDO DEL ARTÍCULO */}
        <article className="prose prose-invert prose-lg md:prose-xl max-w-none text-slate-300 leading-relaxed mb-16 whitespace-pre-wrap">
          {noticia.contenido}
        </article>

        {/* BANNER INFERIOR Y COMPARTIR */}
        <div className="p-8 bg-gradient-to-br from-blue-600 to-blue-900 rounded-[32px] flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 opacity-20 blur-3xl rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="text-center md:text-left relative z-10">
              <h4 className="text-white font-black uppercase italic text-lg leading-none">¿Te sirvió la guía?</h4>
              <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mt-1">Ayúdanos compartiendo GuíaSports</p>
            </div>
            <div className="relative z-10 w-full md:w-auto">
              <ShareButton titulo={noticia.titulo} slug={noticia.slug} />
            </div>
        </div>
      </div>
    </div>
  );
}
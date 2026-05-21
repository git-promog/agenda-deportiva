import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Mail, Share2, Newspaper, Calendar } from 'lucide-react';
import { Metadata } from 'next';
import { EDITORIAL_TEAM } from '@/data/teamData';
import { createClient } from '@supabase/supabase-js';
import NextImage from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs';

interface Props {
  params: Promise<{ slug: string }>;
}

const REDACCION_AUTHOR = {
  id: "redaccion",
  name: "Redacción GuíaSports",
  role: "Equipo Editorial",
  bio: "Especialistas en la cobertura de eventos deportivos nacionales e internacionales en México.",
  specialty: "Deportes en General",
  avatar: ""
};

export async function generateStaticParams() {
  const params = EDITORIAL_TEAM.map((author) => ({
    slug: author.id,
  }));
  params.push({ slug: 'redaccion' });
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let author = EDITORIAL_TEAM.find(a => a.id === slug);
  if (!author && slug === 'redaccion') {
    author = REDACCION_AUTHOR;
  }
  
  if (!author) return { title: 'Autor no encontrado' };

  return {
    title: `${author.name} | Perfil Editorial GuíaSports`,
    description: `${author.bio.substring(0, 150)}... Conoce a nuestro experto en ${author.specialty}.`,
    alternates: {
      canonical: `https://www.guiasports.com/autores/${slug}`,
    },
  };
}

export default async function AuthorProfile({ params }: Props) {
  const { slug } = await params;
  let author = EDITORIAL_TEAM.find(a => a.id === slug);
  if (!author && slug === 'redaccion') {
    author = REDACCION_AUTHOR;
  }

  if (!author) notFound();

  // Fetch recent articles by this author from Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: articles } = await supabase
    .from('noticias')
    .select('titulo, slug, fecha, imagen_url')
    .eq('autor', author.name)
    .order('fecha', { ascending: false })
    .limit(6);

  // JSON-LD Schema.org
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": author.name,
    "jobTitle": author.role,
    "description": author.bio,
    "image": author.avatar ? `https://www.guiasports.com${author.avatar}` : undefined,
    "url": `https://www.guiasports.com/autores/${author.id}`,
    "worksFor": {
      "@type": "Organization",
      "name": "GuíaSports"
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-6 pt-10">
        <Breadcrumbs items={[{ label: "Quiénes Somos", href: "/quienes-somos" }]} current={author.name} currentHref={`/autores/${slug}`} />

        <div className="mt-12 mb-16">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
            {/* Avatar Section */}
            <div className="relative w-40 h-40 md:w-56 md:h-56 shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[40px] rotate-6 opacity-20 shadow-2xl"></div>
              <div className="relative w-full h-full bg-slate-900 rounded-[40px] overflow-hidden border border-slate-800 shadow-2xl">
                {author.avatar ? (
                  <NextImage 
                    src={author.avatar} 
                    alt={author.name} 
                    fill 
                    className="object-cover"
                    sizes="(max-width: 768px) 160px, 224px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl font-black text-slate-700">
                    {author.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                <h1 className="text-3xl md:text-5xl font-black italic uppercase leading-none text-white tracking-tighter">
                  {author.name}
                </h1>
                <span className="bg-blue-600/10 text-blue-400 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-blue-500/20 flex items-center gap-1.5 shadow-lg">
                  <ShieldCheck size={12} /> Verificado
                </span>
              </div>

              <div className="space-y-4 mb-8">
                <p className="text-blue-500 font-black uppercase tracking-[0.2em] text-xs">
                  {author.role}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-500">
                   <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                     <span className="text-blue-600 text-lg">🎯</span> {author.specialty}
                   </div>
                </div>
              </div>

              <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-2xl">
                {author.bio}
              </p>

              <div className="flex items-center justify-center md:justify-start gap-4">
                 <button className="bg-slate-900 hover:bg-slate-800 p-4 rounded-2xl border border-slate-800 text-slate-400 hover:text-white transition-all">
                    <Share2 size={20} />
                 </button>
                 <button className="bg-slate-900 hover:bg-slate-800 p-4 rounded-2xl border border-slate-800 text-slate-400 hover:text-white transition-all">
                    <Mail size={20} />
                 </button>
                 <div className="h-10 w-px bg-slate-800 mx-2"></div>
                 <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    GuíaSports Editorial Board
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* RECENT ARTICLES */}
        <section className="mt-24">
          <div className="flex items-center justify-between mb-10 border-b border-slate-800 pb-6">
            <h2 className="text-xl md:text-2xl font-black italic uppercase text-white flex items-center gap-3">
              <Newspaper className="text-blue-500" /> Artículos Recientes
            </h2>
            <div className="hidden md:block h-px flex-1 bg-slate-800 mx-8"></div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Escritos por {author.name.split(' ')[0]}</span>
          </div>

          {articles && articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <Link 
                  key={article.slug} 
                  href={`/noticias/${article.slug}`}
                  className="group bg-slate-900/30 border border-slate-800/50 rounded-3xl overflow-hidden hover:border-blue-500/30 hover:bg-slate-900/60 transition-all shadow-xl"
                >
                  <div className="flex gap-4 p-5">
                    <div className="w-24 h-24 shrink-0 rounded-2xl overflow-hidden border border-white/5 relative">
                      {article.imagen_url ? (
                        <NextImage src={article.imagen_url} alt={article.titulo} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-slate-800 flex items-center justify-center text-2xl">📰</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex items-center gap-2 text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">
                        <Calendar size={10} /> {article.fecha}
                      </div>
                      <h3 className="text-sm md:text-base font-black italic uppercase text-slate-200 group-hover:text-white leading-tight line-clamp-2">
                        {article.titulo}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-slate-900/30 border border-slate-800 border-dashed rounded-[32px] p-16 text-center">
               <p className="text-slate-500 font-bold italic">Aún no hay artículos publicados para este autor.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

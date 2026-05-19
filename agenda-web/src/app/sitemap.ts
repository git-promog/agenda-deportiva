import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { SEDES } from '@/data/mundialData';
import { PLATFORMS } from '@/data/platformsData';
import { EDITORIAL_TEAM } from '@/data/teamData';

const SITE_URL = 'https://www.guiasports.com';
const STATIC_LAST_MODIFIED = new Date('2026-04-25');
const getFreshDate = () => new Date();
const COMPETITION_HUBS = ['liga-mx', 'champions-league', 'premier-league'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let noticiasUrls: MetadataRoute.Sitemap = [];
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    try {
      const { data: noticias, error } = await supabase
        .from('noticias')
        .select('slug, fecha')
        .order('fecha', { ascending: false })
        .limit(5000);

      if (error) {
        console.error("Error fetching noticias for sitemap:", error);
      } else if (noticias) {
        noticiasUrls = noticias
          .filter((noticia) => noticia.slug)
          .map((noticia) => ({
            url: `${SITE_URL}/noticias/${noticia.slug}`,
            lastModified: noticia.fecha ? new Date(noticia.fecha) : STATIC_LAST_MODIFIED,
            changeFrequency: 'weekly' as const,
            priority: 0.7,
          }));
      }
    } catch (err) {
      console.error("Unexpected error in sitemap generation:", err);
    }
  } else {
    console.warn("Supabase env vars missing: sitemap generated without dynamic article URLs.");
  }

  return [
    {
      url: SITE_URL,
      lastModified: getFreshDate(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/noticias`,
      lastModified: getFreshDate(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/quienes-somos`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacidad`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/contacto`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/envivo`,
      lastModified: getFreshDate(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/futbol`,
      lastModified: getFreshDate(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...COMPETITION_HUBS.map((slug) => ({
      url: `${SITE_URL}/futbol/${slug}`,
      lastModified: getFreshDate(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
    {
      url: `${SITE_URL}/nba`,
      lastModified: getFreshDate(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/mlb`,
      lastModified: getFreshDate(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/f1`,
      lastModified: getFreshDate(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/mundial-2026`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...SEDES.map(s => ({
      url: `${SITE_URL}/mundial-2026/${s.id}`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    {
      url: `${SITE_URL}/plataformas`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...PLATFORMS.map(p => ({
      url: `${SITE_URL}/plataformas/${p.slug}`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...EDITORIAL_TEAM.map((author) => ({
      url: `${SITE_URL}/team/${author.id}`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...noticiasUrls,
  ];
}

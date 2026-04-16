import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  let noticiasUrls: MetadataRoute.Sitemap = [];
  
  try {
    const { data: noticias, error } = await supabase
      .from('noticias')
      .select('slug, created_at')
      .order('created_at', { ascending: false })
      .limit(1000); // Limit to latest 1000 for safety

    if (error) {
      console.error("Error fetching noticias for sitemap:", error);
    } else if (noticias) {
      noticiasUrls = noticias
        .filter(n => n.slug) // Ensure slug exists
        .map((noticia) => ({
          url: `https://www.guiasports.com/noticias/${noticia.slug}`,
          lastModified: noticia.created_at ? new Date(noticia.created_at) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }));
    }
  } catch (err) {
    console.error("Unexpected error in sitemap generation:", err);
  }

  return [
    {
      url: 'https://www.guiasports.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://www.guiasports.com/noticias',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://www.guiasports.com/quienes-somos',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://www.guiasports.com/privacidad',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: 'https://www.guiasports.com/contacto',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://www.guiasports.com/envivo',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://www.guiasports.com/futbol',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://www.guiasports.com/nba',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://www.guiasports.com/mlb',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://www.guiasports.com/f1',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://www.guiasports.com/mundial-2026',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...noticiasUrls,
  ];
}

import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: noticias } = await supabase
    .from('noticias')
    .select('slug, created_at')
    .order('created_at', { ascending: false });

  const noticiasUrls: MetadataRoute.Sitemap = noticias
    ? noticias.map((noticia) => ({
        url: `https://www.guiasports.com/noticias/${noticia.slug}`,
        lastModified: noticia.created_at || new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }))
    : [];

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
      url: 'https://www.guiasports.com/quienes_somos',
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
    ...noticiasUrls,
  ];
}

import { createClient } from '@supabase/supabase-js';
import type { Noticia } from '@/types';
import MundialClient from './MundialClient';

export const revalidate = 600;

export default async function Mundial2026Page() {
  let noticias: Noticia[] = [];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data } = await supabase
      .from('noticias')
      .select('id, titulo, slug, fecha')
      .ilike('titulo', '%#MUNDIAL2026%')
      .order('fecha', { ascending: false })
      .limit(4);

    noticias = (data ?? []) as Noticia[];
  }

  return <MundialClient noticias={noticias} />;
}

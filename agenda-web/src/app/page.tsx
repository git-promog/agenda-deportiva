import { createClient } from '@supabase/supabase-js';
import HomeClient from '@/components/HomeClient';
import { Metadata } from 'next';

// ISR every 5 minutes (300 seconds) to balance freshness with performance
export const revalidate = 300; 

export const metadata: Metadata = {
  title: "GuíaSports - Agenda Deportiva y Dónde Ver Deportes Hoy en México",
  description: "Encuentra en qué canal de TV y plataformas de streaming ver fútbol, F1, MLB, NBA y más eventos deportivos en vivo desde México. La mejor guía deportiva.",
  openGraph: {
    title: "GuíaSports - Dónde ver deportes en México",
    description: "La agenda deportiva más completa de México. Televisión abierta, de paga y streaming.",
    type: "website",
    locale: "es_MX"
  }
};

export default async function Home() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  let eventos = [];
  let noticias = [];
  let ultimaAct = "Recargando...";

  try {
    // 1. Cargar Partidos (todos)
    const { data: evData } = await supabase
      .from('eventos')
      .select('*')
      .order('fecha', { ascending: true })
      .order('hora', { ascending: true });
    
    // 2. Cargar Noticias (Últimas 2 para la portada)
    const { data: notData } = await supabase
      .from('noticias')
      .select('*')
      .order('fecha', { ascending: false })
      .limit(2);
    
    // 3. Cargar Status
    const { data: stData } = await supabase
      .from('status')
      .select('valor')
      .eq('nombre', 'ultima_actualizacion')
      .maybeSingle();

    if (evData) eventos = evData;
    if (notData) noticias = notData;
    if (stData) ultimaAct = stData.valor;
  } catch (err) {
    console.error("Error cargando datos en servidor:", err);
  }

  return (
    <HomeClient 
      initialEventos={eventos} 
      initialNoticias={noticias} 
      initialUltimaAct={ultimaAct} 
    />
  );
}
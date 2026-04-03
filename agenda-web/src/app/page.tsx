import { createClient } from '@supabase/supabase-js';
import HomeClient from '@/components/HomeClient';
import { Metadata } from 'next';

// ISR every 5 minutes (300 seconds) to balance freshness with performance
export const revalidate = 300; 

export const metadata: Metadata = {
  title: "GuíaSports | Dónde Ver Fútbol, NBA, MLB, F1 en Vivo por TV y Streaming México",
  description: "¿Dónde ver el partido hoy? GuíaSports te dice en qué canal TV y streaming (ViX, ESPN, Disney+) transmiten fútbol, NBA, MLB, F1 en vivo en México.",
  alternates: {
    canonical: "https://www.guiasports.com",
  },
  openGraph: {
    title: "GuíaSports - Dónde ver deportes en México",
    description: "La agenda deportiva más completa de México. Televisión abierta, de paga y streaming.",
    type: "website",
    locale: "es_MX",
    url: "https://www.guiasports.com",
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

  const calculateEndDate = (e: any) => {
    if (!e.hora) return '23:59';
    const [h, m] = e.hora.split(':').map(Number);
    const fin = new Date();
    fin.setHours(h + 2, m, 0);
    return String(fin.getHours()).padStart(2, '0') + ':' + String(fin.getMinutes()).padStart(2, '0');
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": eventos.slice(0, 50).map((e: any, index: number) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "SportsEvent",
        "name": e.evento,
        "startDate": `${e.fecha}T${e.hora}:00-06:00`,
        "endDate": `${e.fecha}T${calculateEndDate(e)}:00-06:00`,
        "eventStatus": "https://schema.org/EventScheduled",
        "sport": e.deporte,
        "description": `Transmisión de ${e.competicion}: ${e.evento} en vivo por ${e.canales}.`,
        "organizer": {
          "@type": "Organization",
          "name": e.competicion
        },
        "performer": {
          "@type": "PerformingGroup",
          "name": e.evento
        },
        "location": {
          "@type": "Place",
          "name": "Televisión y Streaming México",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "México"
          }
        },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "MXN",
          "availability": "https://schema.org/AvailableInGeneral",
          "validFrom": e.fecha,
          "url": "https://www.guiasports.com"
        }
      }
    }))
  };

  return (
    <>
      <h1 className="sr-only">GuíaSports | Dónde Ver Fútbol, NBA, MLB, F1 en Vivo por TV y Streaming México</h1>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient 
        initialEventos={eventos} 
        initialNoticias={noticias} 
        initialUltimaAct={ultimaAct} 
      />
    </>
  );
}
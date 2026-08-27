import { createClient } from '@supabase/supabase-js';
import HomeClient from '@/components/HomeClient';
import { Metadata } from 'next';
import { getTodayMexicoString, getDateRangeMexico } from '@/lib/mexicoTime';
import { buildEventUrl, deduplicateEventos } from '@/lib/eventUrls';

// ISR every 5 minutes (300 seconds) to balance freshness with performance
export const revalidate = 300; 

export const metadata: Metadata = {
  title: "GuíaSports | Agenda Deportiva Hoy en TV y Streaming",
  description: "¿Dónde ver el partido hoy? GuíaSports te dice en qué canal TV y streaming transmiten fútbol, NBA, F1 en vivo en México.",
  alternates: {
    canonical: "https://www.guiasports.com",
  },
  openGraph: {
    title: "GuíaSports | Agenda Deportiva Hoy en TV y Streaming",
    description: "La agenda deportiva más completa de México. Televisión abierta, de paga y streaming.",
    type: "website",
    locale: "es_MX",
    url: "https://www.guiasports.com",
  }
};

type HomeEvento = {
  id: string;
  fecha: string;
  hora: string;
  evento: string;
  competicion: string;
  deporte: string;
  canales: string;
  destacado?: boolean | null;
  [key: string]: unknown;
};

export default async function Home() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  let eventos: HomeEvento[] = [];
  let noticias = [];
  let ultimaAct = "Recargando...";

  // Ventana de agenda en home: hoy + 3 días (4 días totales)
  const hoyStr = getTodayMexicoString();
  const dateRange = getDateRangeMexico(4);
  const maxDateStr = dateRange[dateRange.length - 1];

  try {
    // 1. Cargar Partidos (solo ventana activa: hoy + 3 días)
    const { data: evData } = await supabase
      .from('eventos')
      .select('*')
      .gte('fecha', hoyStr)
      .lte('fecha', maxDateStr)
      .order('fecha', { ascending: true })
      .order('hora', { ascending: true });
    
    // 2. Cargar Noticias (Últimas 2 para la portada)
    const { data: notData } = await supabase
      .from('noticias')
      .select('*')
      .order('fecha', { ascending: false })
      .limit(5);
    
    // 3. Cargar Status
    const { data: stData } = await supabase
      .from('status')
      .select('valor')
      .eq('nombre', 'ultima_actualizacion')
      .maybeSingle();

    if (evData) {
      const mapped = evData.map((e) => ({
        ...e,
        id: String(e.id),
        fecha: e.fecha || "",
        hora: e.hora || "00:00",
        evento: e.evento || "Evento por confirmar",
        competicion: e.competicion || "Deportes",
        deporte: e.deporte || "Otros",
        canales: e.canales || "Por confirmar",
      }));
      eventos = deduplicateEventos(mapped);
    }
    if (notData) noticias = notData;
    if (stData) ultimaAct = stData.valor;
  } catch (err) {
    console.error("Error cargando datos en servidor:", err);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": eventos.slice(0, 50).map((e, index: number) => {
      const startDateTime = `${e.fecha}T${e.hora || '00:00'}:00-06:00`;
      const endDate = new Date(startDateTime);
      const eventUrl = buildEventUrl(e);

      return {
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "SportsEvent",
          "name": e.evento,
          "description": `Transmisión de ${e.competicion}: ${e.evento} en ${e.canales}.`,
          "url": eventUrl,
          "startDate": startDateTime,
          "endDate": !Number.isNaN(endDate.getTime())
            ? new Date(endDate.getTime() + 2 * 60 * 60 * 1000).toISOString()
            : `${e.fecha}T23:59:00-06:00`,
          "eventStatus": "https://schema.org/EventScheduled",
          "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
          "sport": e.deporte,
          "inLanguage": "es-MX",
          "location": {
            "@type": "VirtualLocation",
            "name": "TV y streaming en México",
            "url": eventUrl
          },
          "organizer": {
            "@type": "Organization",
            "name": e.competicion || "GuíaSports",
            "url": "https://www.guiasports.com"
          },
          "performer": {
            "@type": "PerformingGroup",
            "name": e.evento
          },
          "offers": {
            "@type": "Offer",
            "url": eventUrl,
            "price": "0",
            "priceCurrency": "MXN",
            "availability": "https://schema.org/InStock",
            "validFrom": startDateTime
          }
        }
      };
    })
  };

  return (
    <>
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

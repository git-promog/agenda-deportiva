export interface Platform {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description: string;
  price: string;
  keyContent: string[];
  ctaUrl: string;
  color: string;
  plans?: string[];
  promotions?: string;
}

export const PLATFORMS: Platform[] = [
  {
    id: "vix",
    name: "ViX",
    slug: "vix",
    logo: "/images/platforms/vix-logo.webp",
    description: "La casa del fútbol mexicano. Transmite la gran mayoría de la Liga MX (América, Cruz Azul, Pumas, Monterrey, Toluca, etc.) y será la plataforma principal del Mundial de la FIFA 2026, con la transmisión de los 104 partidos (72 de ellos de forma exclusiva en digital).",
    price: "Gratis / Premium: $149 MXN/mes",
    keyContent: ["Liga MX (Gran mayoría de equipos)", "Mundial FIFA 2026 (104 partidos, 72 exclusivos)", "Fútbol Femenil", "UEFA Champions League"],
    ctaUrl: "https://vix.com",
    color: "from-orange-500 to-red-600",
    plans: [
      "ViX Free: Gratis (con anuncios, noticias y resúmenes)",
      "ViX Premium: $149 MXN al mes o $1,399 MXN anuales"
    ],
    promotions: "Suele ofrecer periodos de prueba gratuitos de 7 a 30 días en distintas campañas."
  },
  {
    id: "disney-plus",
    name: "Disney+",
    slug: "disney-plus",
    logo: "/images/platforms/disney-plus-logo.webp",
    description: "A través de ESPN, cuenta con un catálogo deportivo colosal en México que incluye la Serie A de Italia, Eredivisie, MLB, NBA, Grand Slams de tenis, el Monday Night Football de la NFL y los partidos de local del Atlético de San Luis en la Liga MX.",
    price: "Desde $149 hasta $339 MXN/mes",
    keyContent: ["Serie A / Eredivisie", "MLB / NBA / NFL (Monday Night)", "Atlético de San Luis (Local)", "Grand Slams de Tenis"],
    ctaUrl: "https://www.disneyplus.com",
    color: "from-blue-600 to-blue-900",
    plans: [
      "Estándar con anuncios: $149 MXN al mes",
      "Estándar sin anuncios: $249 MXN al mes",
      "Premium (4K y eventos exclusivos): $339 MXN al mes (a partir del 15 de mayo de 2026)"
    ]
  },
  {
    id: "amazon-prime",
    name: "Amazon Prime Video",
    slug: "prime-video",
    logo: "/images/platforms/prime-video-logo.webp",
    description: "Tiene en exclusiva los derechos digitales para los partidos de local de las Chivas del Guadalajara en 4K, además de selectos partidos de la NBA. Es una excelente centralizadora que permite suscribirse a canales adicionales.",
    price: "Desde $99 MXN/mes",
    keyContent: ["Chivas (Local en 4K)", "NBA (Partidos selectos)", "Suscripciones de terceros (Fox One)"],
    ctaUrl: "https://www.primevideo.com",
    color: "from-sky-400 to-sky-600",
    plans: [
      "Con anuncios: $99 MXN al mes",
      "Sin anuncios: $149 MXN al mes o plan anual de $899 MXN"
    ],
    promotions: "Permite agregar suscripciones de terceros directamente en la plataforma, como el canal Fox One por $175 MXN mensuales adicionales."
  },
  {
    id: "fox-one",
    name: "Fox One",
    slug: "fox-one",
    logo: "/images/platforms/fox-one-logo.webp",
    description: "La nueva gran opción que unifica derechos de Caliente TV y Fox Sports México. Agrupa los derechos de 9 equipos de la Liga MX varonil (incluyendo León, Pachuca, Tigres, FC Juárez), 10 de la Liga MX Femenil, la Premier League, la mitad de los partidos de la UEFA Champions League (los de los miércoles), la Ligue 1 de Francia, la FA Cup y el béisbol nacional (LMB y LMP).",
    price: "$175 MXN/mes",
    keyContent: ["9 Equipos Liga MX Varonil & 10 Femenil", "UEFA Champions League (Miércoles)", "Premier League / Ligue 1", "Ligas Mexicanas de Béisbol (LMB y LMP)"],
    ctaUrl: "https://www.primevideo.com/offers/nonprime/foxone",
    color: "from-blue-800 to-slate-900",
    plans: [
      "Suscripción Mensual: $175 MXN al mes (disponible vía Prime Video, Claro Video o como app independiente)"
    ],
    promotions: "No ofrece periodo de prueba gratuito; el cobro se realiza al activar la suscripción."
  },
  {
    id: "max",
    name: "Max",
    slug: "max",
    logo: "/images/platforms/max-logo.webp",
    description: "La plataforma de Warner Bros. Discovery que comparte los derechos de transmisión de la UEFA Champions League junto con Fox One, ofreciendo transmisiones con calidad de producción premium.",
    price: "Desde $149 hasta $299 MXN/mes",
    keyContent: ["UEFA Champions League", "Max Originals", "Calidad 4K UHD"],
    ctaUrl: "https://www.max.com",
    color: "from-indigo-600 to-blue-800",
    plans: [
      "Básico con anuncios: $149 MXN al mes",
      "Estándar: $239 MXN al mes",
      "Platino (calidad 4K UHD): $299 MXN al mes"
    ]
  },
  {
    id: "paramount-plus",
    name: "Paramount+",
    slug: "paramount-plus",
    logo: "/images/platforms/paramount-logo.webp",
    description: "Mantiene los prestigiosos derechos de la Copa Libertadores y la Copa Sudamericana en México. Además, a partir de 2026, se convierte en la casa exclusiva de la UFC para territorio nacional.",
    price: "Desde $99 hasta $179 MXN/mes",
    keyContent: ["UFC (Derechos exclusivos desde 2026)", "Copa Libertadores", "Copa Sudamericana"],
    ctaUrl: "https://www.paramountplus.com",
    color: "from-sky-500 to-blue-600",
    plans: [
      "Básico Móvil: $99 MXN al mes o $889 MXN al año",
      "Estándar: $129 MXN al mes o $1,159 MXN al año",
      "Premium (4K): $179 MXN al mes o $1,609 MXN al año"
    ]
  },
  {
    id: "netflix",
    name: "Netflix",
    slug: "netflix",
    logo: "/images/platforms/netflix-logo.webp",
    description: "El gigante del streaming incursiona con fuerza en los deportes en vivo con WWE Raw en exclusiva, partidos navideños de la NFL, juegos selectos de la MLB, el GP de Canadá de la F1 y macroeventos de boxeo y MMA.",
    price: "Desde $139 hasta $369 MXN/mes",
    keyContent: ["WWE Raw (Exclusivo)", "NFL (Juegos Navideños)", "MLB (Partidos selectos)", "F1 GP de Canadá", "Macroeventos de Boxeo & MMA (ej. Tyson vs Paul)"],
    ctaUrl: "https://www.netflix.com",
    color: "from-red-600 to-black",
    plans: [
      "Estándar con anuncios: $139 MXN al mes",
      "Estándar: $269 MXN al mes",
      "Premium (4K UHD): $369 MXN al mes"
    ]
  },
  {
    id: "dazn",
    name: "DAZN",
    slug: "dazn",
    logo: "/images/platforms/dazn-logo.webp",
    description: "La plataforma líder mundial de streaming deportivo es la casa exclusiva del NFL Game Pass fuera de Estados Unidos, además de ser el destino predilecto para Boxeo de nivel mundial, MMA y la UEFA Women's Champions League.",
    price: "Desde $199 MXN/mes",
    keyContent: ["NFL Game Pass", "Boxeo de Campeonato Mundial", "MMA", "UEFA Women's Champions League"],
    ctaUrl: "https://www.dazn.com",
    color: "from-yellow-400 to-yellow-600",
    plans: [
      "Plan mensual flexible: $250 MXN al mes",
      "Plan anual (pago mensual): $199 MXN al mes",
      "NFL Season Pro: $350 USD por temporada"
    ]
  },
  {
    id: "apple-tv",
    name: "Apple TV+",
    slug: "apple-tv",
    logo: "/images/platforms/apple-tv-logo.webp",
    description: "Transmite de manera global y exclusiva todos los partidos de la Major League Soccer a través de MLS Season Pass, además de la emocionante Leagues Cup.",
    price: "$169 MXN/mes",
    keyContent: ["MLS Season Pass", "Leagues Cup", "Series y Películas Exclusivas"],
    ctaUrl: "https://www.apple.com/apple-tv-plus/",
    color: "from-slate-700 to-slate-900",
    plans: [
      "Suscripción Mensual Apple TV+: $169 MXN al mes"
    ]
  },
  {
    id: "f1-tv",
    name: "F1 TV",
    slug: "f1-tv",
    logo: "/images/platforms/f1-tv-logo.webp",
    description: "La plataforma definitiva para los amantes del deporte motor. Ofrece todas las sesiones de la Fórmula 1, Fórmula 2 y Fórmula 3 en vivo con cámaras on-board y telemetría en tiempo real.",
    price: "Desde $64 hasta $210 MXN/mes",
    keyContent: ["Fórmula 1 en vivo", "Fórmula 2 & Fórmula 3", "Cámaras On-board", "Radio de Equipos & Telemetría"],
    ctaUrl: "https://f1tv.formula1.com",
    color: "from-red-500 to-red-800",
    plans: [
      "F1 TV Access (repeticiones y telemetría): $64 MXN al mes o $549 MXN anuales",
      "F1 TV Pro (transmisiones en vivo): $129 MXN al mes o $999 MXN anuales",
      "F1 TV Premium (en vivo, vistas múltiples y 4K): $210 MXN al mes o $1,600 MXN anuales"
    ]
  },
  {
    id: "pluto-tv",
    name: "Pluto TV",
    slug: "pluto-tv",
    logo: "/images/platforms/pluto-tv-logo.webp",
    description: "Plataforma de televisión por internet totalmente gratuita que emite partidos en vivo de la Copa Libertadores y la Copa Sudamericana sin necesidad de registro.",
    price: "Gratuito (con anuncios)",
    keyContent: ["Copa Libertadores en vivo", "Copa Sudamericana en vivo", "Canales de TV Temáticos 24/7"],
    ctaUrl: "https://pluto.tv",
    color: "from-yellow-400 via-orange-500 to-pink-600",
    plans: [
      "Plan Único: Gratis al 100% financiado con publicidad"
    ]
  },
  {
    id: "claro-sports",
    name: "Claro Sports",
    slug: "claro-sports",
    logo: "/images/platforms/claro-sports-logo.webp",
    description: "La señal multiplataforma líder en deportes que posee los derechos oficiales para emitir los Juegos Olímpicos de Milano Cortina 2026, Los Ángeles 2028, Alpes Franceses 2030 y Brisbane 2032 sin costo.",
    price: "Gratuito / Incluido en TV de paga",
    keyContent: ["Juegos Olímpicos (2026, 2028, 2030, 2032)", "Copa del Mundo de Equitación", "Automovilismo y Fútbol Selecto"],
    ctaUrl: "https://www.youtube.com/@clarosports",
    color: "from-red-500 to-orange-600",
    plans: [
      "YouTube Claro Sports: Transmisión en vivo sin costo",
      "Claro Video: Incluido para clientes Infinitum y Telcel",
      "Canales de TV de paga: Incluido en los principales sistemas de cable"
    ]
  }
];

export type TipoCanal = "tv_abierta" | "tv_paga" | "streaming";

export interface Canal {
  id: string;
  nombre: string;
  aliases: string[];
  tipo: TipoCanal;
  plataforma?: string;
  badgeColor?: string;
}

export const CANALES_CATALOGO: Canal[] = [
  // TV Abierta México
  {
    id: "canal-5",
    nombre: "Canal 5",
    aliases: ["canal 5", "el 5", "5*", "canal5", "el5"],
    tipo: "tv_abierta",
    plataforma: "TelevisaUnivision",
    badgeColor: "bg-green-600/20 text-green-400 border-green-500/30",
  },
  {
    id: "azteca-7",
    nombre: "Azteca 7",
    aliases: ["azteca 7", "tv azteca 7", "azteca7", "7"],
    tipo: "tv_abierta",
    plataforma: "TV Azteca",
    badgeColor: "bg-emerald-600/20 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "las-estrellas",
    nombre: "Las Estrellas",
    aliases: ["las estrellas", "canal 2", "canal de las estrellas", "estrellas"],
    tipo: "tv_abierta",
    plataforma: "TelevisaUnivision",
    badgeColor: "bg-amber-600/20 text-amber-400 border-amber-500/30",
  },
  {
    id: "nu9ve",
    nombre: "Nu9ve",
    aliases: ["nu9ve", "canal 9", "el 9", "galavision", "canal9"],
    tipo: "tv_abierta",
    plataforma: "TelevisaUnivision",
    badgeColor: "bg-purple-600/20 text-purple-400 border-purple-500/30",
  },
  {
    id: "imagen-tv",
    nombre: "Imagen TV",
    aliases: ["imagen tv", "imagen televisión", "imagen television", "imagen", "canal 3"],
    tipo: "tv_abierta",
    plataforma: "Grupo Imagen",
    badgeColor: "bg-cyan-600/20 text-cyan-400 border-cyan-500/30",
  },
  {
    id: "azteca-uno",
    nombre: "Azteca Uno",
    aliases: ["azteca uno", "azteca 1", "canal 1"],
    tipo: "tv_abierta",
    plataforma: "TV Azteca",
    badgeColor: "bg-red-600/20 text-red-400 border-red-500/30",
  },

  // TV de Paga
  {
    id: "espn",
    nombre: "ESPN",
    aliases: ["espn", "espn 2", "espn 3", "espn 4", "espn extra", "espn premium", "espn2", "espn3"],
    tipo: "tv_paga",
    plataforma: "Disney",
    badgeColor: "bg-red-900/30 text-red-400 border-red-500/30",
  },
  {
    id: "fox-sports",
    nombre: "Fox Sports",
    aliases: ["fox sports", "fox sports 2", "fox sports 3", "fox sports premium", "fox sports 1"],
    tipo: "tv_paga",
    plataforma: "Grupo Lauman",
    badgeColor: "bg-blue-900/30 text-blue-400 border-blue-500/30",
  },
  {
    id: "tudn",
    nombre: "TUDN",
    aliases: ["tudn"],
    tipo: "tv_paga",
    plataforma: "TelevisaUnivision",
    badgeColor: "bg-green-900/30 text-green-400 border-green-500/30",
  },
  {
    id: "claro-sports",
    nombre: "Claro Sports",
    aliases: ["claro sports", "marca claro", "claro"],
    tipo: "tv_paga",
    plataforma: "América Móvil",
    badgeColor: "bg-orange-900/30 text-orange-400 border-orange-500/30",
  },
  {
    id: "hi-sports",
    nombre: "Hi Sports",
    aliases: ["hi sports", "hisports"],
    tipo: "tv_paga",
    plataforma: "Hi Sports",
    badgeColor: "bg-teal-900/30 text-teal-400 border-teal-500/30",
  },
  {
    id: "afizzionados",
    nombre: "Afizzionados",
    aliases: ["afizzionados"],
    tipo: "tv_paga",
    plataforma: "IZZI",
    badgeColor: "bg-pink-900/30 text-pink-400 border-pink-500/30",
  },
  {
    id: "sky-sports",
    nombre: "Sky Sports",
    aliases: ["sky sports", "sky", "veta sports"],
    tipo: "tv_paga",
    plataforma: "SKY",
    badgeColor: "bg-sky-900/30 text-sky-400 border-sky-500/30",
  },

  // Streaming
  {
    id: "vix",
    nombre: "ViX",
    aliases: ["vix", "vix premium", "vix+", "vix gratis"],
    tipo: "streaming",
    plataforma: "TelevisaUnivision",
    badgeColor: "bg-orange-600/20 text-orange-400 border-orange-500/30",
  },
  {
    id: "apple-tv",
    nombre: "Apple TV",
    aliases: ["apple tv", "apple tv+", "mls season pass", "appletv"],
    tipo: "streaming",
    plataforma: "Apple",
    badgeColor: "bg-slate-700/50 text-slate-200 border-slate-500/30",
  },
  {
    id: "disney-plus",
    nombre: "Disney+",
    aliases: ["disney+", "disney plus", "star+", "star plus", "disney"],
    tipo: "streaming",
    plataforma: "Disney",
    badgeColor: "bg-indigo-900/30 text-indigo-400 border-indigo-500/30",
  },
  {
    id: "max",
    nombre: "Max",
    aliases: ["max", "hbo max", "tnt sports", "hbo"],
    tipo: "streaming",
    plataforma: "Warner Bros. Discovery",
    badgeColor: "bg-blue-600/20 text-blue-300 border-blue-500/30",
  },
  {
    id: "prime-video",
    nombre: "Prime Video",
    aliases: ["prime video", "amazon prime", "amazon prime video", "prime"],
    tipo: "streaming",
    plataforma: "Amazon",
    badgeColor: "bg-sky-600/20 text-sky-300 border-sky-500/30",
  },
  {
    id: "youtube",
    nombre: "YouTube",
    aliases: ["youtube", "youtube live"],
    tipo: "streaming",
    plataforma: "Google",
    badgeColor: "bg-red-600/20 text-red-400 border-red-500/30",
  },
  {
    id: "nfl-game-pass",
    nombre: "NFL Game Pass",
    aliases: ["nfl game pass", "dazn nfl", "game pass"],
    tipo: "streaming",
    plataforma: "DAZN",
    badgeColor: "bg-yellow-900/30 text-yellow-400 border-yellow-500/30",
  },
  {
    id: "nba-league-pass",
    nombre: "NBA League Pass",
    aliases: ["nba league pass", "nba pass"],
    tipo: "streaming",
    plataforma: "NBA",
    badgeColor: "bg-blue-900/30 text-blue-400 border-blue-500/30",
  },
  {
    id: "f1-tv",
    nombre: "F1 TV Pro",
    aliases: ["f1 tv", "f1 tv pro"],
    tipo: "streaming",
    plataforma: "Formula 1",
    badgeColor: "bg-red-900/30 text-red-500 border-red-500/30",
  },
];

/**
 * Normaliza una cadena de texto para comparación.
 */
function cleanText(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * Retorna todos los canales catalogados.
 */
export function getAllChannels(): Canal[] {
  return CANALES_CATALOGO;
}

/**
 * Evalúa si una cadena de texto de canales incluye al menos un canal de TV Abierta.
 */
export function isTvAbierta(canalesStr: string | null | undefined): boolean {
  if (!canalesStr) return false;
  const cleaned = cleanText(canalesStr);
  const tvAbiertaCanales = CANALES_CATALOGO.filter((c) => c.tipo === "tv_abierta");
  return tvAbiertaCanales.some((canal) =>
    canal.aliases.some((alias) => cleaned.includes(cleanText(alias)))
  );
}

/**
 * Encuentra todas las coincidencias del catálogo de canales en una cadena de canales.
 */
export function matchChannels(canalesStr: string | null | undefined): Canal[] {
  if (!canalesStr) return [];
  const cleaned = cleanText(canalesStr);
  const result: Canal[] = [];

  for (const canal of CANALES_CATALOGO) {
    if (canal.aliases.some((alias) => cleaned.includes(cleanText(alias)))) {
      result.push(canal);
    }
  }
  return result;
}

/**
 * Obtiene los tipos de transmisión presentes en el texto de canales (tv_abierta, tv_paga, streaming).
 */
export function getChannelTypes(canalesStr: string | null | undefined): Set<TipoCanal> {
  const matched = matchChannels(canalesStr);
  const types = new Set<TipoCanal>();
  matched.forEach((c) => types.add(c.tipo));
  return types;
}

/**
 * Obtiene las plataformas o cadenas asociadas a los canales del evento.
 */
export function getPlatformsForEvent(canalesStr: string | null | undefined): string[] {
  const matched = matchChannels(canalesStr);
  const platforms = new Set<string>();
  matched.forEach((c) => {
    if (c.plataforma) platforms.add(c.plataforma);
  });
  return Array.from(platforms);
}

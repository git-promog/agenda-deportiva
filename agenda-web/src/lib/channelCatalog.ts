export type TipoCanal = "tv_abierta" | "tv_paga" | "streaming";

export interface Canal {
  id: string;
  nombre: string;
  aliases: string[];
  tipo: TipoCanal;
  plataforma?: string;
  badgeColor?: string;
  logo?: string;
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

/**
 * Ruta pública única de los iconos cuadrados de canales y plataformas.
 */
export const CHANNEL_ICON_PATH = "/images/channels";

/**
 * Archivos realmente presentes en `agenda-web/public/images/channels/`.
 * Cualquier alias sólo produce un logo si su archivo está en esta lista,
 * evitando rutas 404 para canales reservados que aún no se han cargado.
 */
export const CHANNEL_ICON_FILES = [
  "1baseball-network.webp",
  "adrenalina-sports.webp",
  "afizzionados.webp",
  "antel-tv-internacional.webp",
  "apple-tv.webp",
  "atp-tennis-tv.webp",
  "aym-sports.webp",
  "azteca-7.webp",
  "azteca-deportes-network.webp",
  "azteca-uno.webp",
  "beisbolplay.webp",
  "caliente-tv.webp",
  "canal-22.webp",
  "canal-5.webp",
  "canal-6.webp",
  "canal-once.webp",
  "chivas-tv.webp",
  "claro-sports.webp",
  "claro-video.webp",
  "courtside-1891.webp",
  "dazn.webp",
  "disney-plus-premium.webp",
  "disney-plus.webp",
  "dsports.webp",
  "espn-1.webp",
  "espn-2.webp",
  "espn-3.webp",
  "espn-4.webp",
  "espn.webp",
  "euroleague-tv.webp",
  "f1-tv-pro.webp",
  "facebook-live.webp",
  "fanatiz.webp",
  "fifa-plus.webp",
  "fox-one.webp",
  "fox-plus.webp",
  "fox-sports-2.webp",
  "fox-sports-3.webp",
  "fox-sports-premium.webp",
  "fox-sports.webp",
  "fox.webp",
  "futv.webp",
  "globo-internacional.webp",
  "golf-channel.webp",
  "goltv.webp",
  "hbo-max.webp",
  "hi-sports.webp",
  "imagen-tv.webp",
  "las-estrellas.webp",
  "laytime-tv.webp",
  "lmb-tv.webp",
  "lpf-play.webp",
  "megasports.webp",
  "mlb-network.webp",
  "mlb-tv.webp",
  "mls-season-pass.webp",
  "motogp-videopass.webp",
  "nacion-deportes-2.webp",
  "nacion-deportes-3.webp",
  "nacion-deportes-premium.webp",
  "nacion-deportes.webp",
  "nba-league-pass.webp",
  "nba-tv.webp",
  "netflix.webp",
  "nfl-game-pass.webp",
  "nfl-network.webp",
  "nhl-tv.webp",
  "nu9ve.webp",
  "onefootball.webp",
  "paramount-plus.webp",
  "pluto-tv.webp",
  "prime-video.webp",
  "px-sports.webp",
  "rally-tv.webp",
  "rcn-nuestra-tele.webp",
  "sky-sports.webp",
  "space.webp",
  "telemundo.webp",
  "tennis-tv.webp",
  "tigo-sports.webp",
  "tnt-sports.webp",
  "tnt.webp",
  "tubi.webp",
  "tudn.webp",
  "tvc-deportes-2.webp",
  "tvc-deportes.webp",
  "twitch.webp",
  "tyc-sports-internacional.webp",
  "uefa-tv.webp",
  "ufc-fight-pass.webp",
  "univision.webp",
  "vix.webp",
  "win-sports-plus.webp",
  "wta-tv.webp",
  "youtube.webp",
] as const;

export type ChannelIconFile = (typeof CHANNEL_ICON_FILES)[number];

const CHANNEL_ICON_FILE_SET = new Set<string>(CHANNEL_ICON_FILES);

interface ChannelIconEntry {
  id: string;
  nombre: string;
  tipo: TipoCanal;
  file: ChannelIconFile;
  aliases: string[];
}

const CHANNEL_ICON_ENTRIES: ChannelIconEntry[] = [
  {
    id: "1baseball-network",
    nombre: "1Baseball Network",
    tipo: "tv_paga",
    file: "1baseball-network.webp",
    aliases: ["1Baseball", "1 Baseball Network"],
  },
  {
    id: "adrenalina-sports",
    nombre: "Adrenalina Sports",
    tipo: "streaming",
    file: "adrenalina-sports.webp",
    aliases: [],
  },
  {
    id: "afizzionados",
    nombre: "Afizzionados",
    tipo: "tv_paga",
    file: "afizzionados.webp",
    aliases: [],
  },
  {
    id: "antel-tv-internacional",
    nombre: "Antel TV Internacional",
    tipo: "tv_paga",
    file: "antel-tv-internacional.webp",
    aliases: ["Antel TV"],
  },
  {
    id: "apple-tv",
    nombre: "Apple TV",
    tipo: "streaming",
    file: "apple-tv.webp",
    aliases: ["Apple TV+", "Apple TV Plus", "AppleTV"],
  },
  {
    id: "atp-tennis-tv",
    nombre: "ATP Tennis TV",
    tipo: "streaming",
    file: "atp-tennis-tv.webp",
    aliases: ["ATPTennis.TV", "ATP Tennis"],
  },
  {
    id: "aym-sports",
    nombre: "AYM Sports",
    tipo: "tv_paga",
    file: "aym-sports.webp",
    aliases: ["AyM Sports"],
  },
  {
    id: "azteca-7",
    nombre: "Azteca 7",
    tipo: "tv_abierta",
    file: "azteca-7.webp",
    aliases: ["TV Azteca 7", "Azteca7", "7"],
  },
  {
    id: "azteca-deportes-network",
    nombre: "Azteca Deportes Network",
    tipo: "tv_paga",
    file: "azteca-deportes-network.webp",
    aliases: ["Azteca Deportes", "aztecadeportes.com"],
  },
  {
    id: "azteca-uno",
    nombre: "Azteca Uno",
    tipo: "tv_abierta",
    file: "azteca-uno.webp",
    aliases: ["Azteca 1", "Canal 1"],
  },
  {
    id: "beisbolplay",
    nombre: "BeisbolPlay",
    tipo: "streaming",
    file: "beisbolplay.webp",
    aliases: ["BéisbolPlay"],
  },
  {
    id: "caliente-tv",
    nombre: "Caliente TV",
    tipo: "tv_paga",
    file: "caliente-tv.webp",
    aliases: ["Caliente.mx TV", "Caliente"],
  },
  {
    id: "canal-22",
    nombre: "Canal 22",
    tipo: "tv_abierta",
    file: "canal-22.webp",
    aliases: [],
  },
  {
    id: "canal-5",
    nombre: "Canal 5",
    tipo: "tv_abierta",
    file: "canal-5.webp",
    aliases: ["El 5", "5*", "Canal 5*", "Canal5"],
  },
  {
    id: "canal-6",
    nombre: "Canal 6",
    tipo: "tv_abierta",
    file: "canal-6.webp",
    aliases: ["Multimedios"],
  },
  {
    id: "canal-once",
    nombre: "Canal Once",
    tipo: "tv_abierta",
    file: "canal-once.webp",
    aliases: ["Once TV", "Canal 11"],
  },
  {
    id: "chivas-tv",
    nombre: "Chivas TV",
    tipo: "streaming",
    file: "chivas-tv.webp",
    aliases: [],
  },
  {
    id: "claro-sports",
    nombre: "Claro Sports",
    tipo: "tv_paga",
    file: "claro-sports.webp",
    aliases: ["Marca Claro", "Claro Sports YouTube", "Claro"],
  },
  {
    id: "claro-video",
    nombre: "Claro Video",
    tipo: "streaming",
    file: "claro-video.webp",
    aliases: [],
  },
  {
    id: "courtside-1891",
    nombre: "Courtside 1891",
    tipo: "streaming",
    file: "courtside-1891.webp",
    aliases: [],
  },
  {
    id: "dazn",
    nombre: "DAZN",
    tipo: "streaming",
    file: "dazn.webp",
    aliases: ["DAZN App"],
  },
  {
    id: "disney-plus-premium",
    nombre: "Disney+ Premium",
    tipo: "streaming",
    file: "disney-plus-premium.webp",
    aliases: ["Disney Plus Premium", "Disney Premium"],
  },
  {
    id: "disney-plus",
    nombre: "Disney+",
    tipo: "streaming",
    file: "disney-plus.webp",
    aliases: ["Disney Plus", "Disney", "Star+", "Star Plus"],
  },
  {
    id: "dsports",
    nombre: "DSports",
    tipo: "tv_paga",
    file: "dsports.webp",
    aliases: ["D Sports", "DirecTV Sports"],
  },
  {
    id: "espn-1",
    nombre: "ESPN 1",
    tipo: "tv_paga",
    file: "espn-1.webp",
    aliases: ["ESPN1"],
  },
  {
    id: "espn-2",
    nombre: "ESPN 2",
    tipo: "tv_paga",
    file: "espn-2.webp",
    aliases: ["ESPN2"],
  },
  {
    id: "espn-3",
    nombre: "ESPN 3",
    tipo: "tv_paga",
    file: "espn-3.webp",
    aliases: ["ESPN3"],
  },
  {
    id: "espn-4",
    nombre: "ESPN 4",
    tipo: "tv_paga",
    file: "espn-4.webp",
    aliases: ["ESPN4"],
  },
  {
    id: "espn",
    nombre: "ESPN",
    tipo: "tv_paga",
    file: "espn.webp",
    aliases: ["ESPN México"],
  },
  {
    id: "euroleague-tv",
    nombre: "EuroLeague TV",
    tipo: "streaming",
    file: "euroleague-tv.webp",
    aliases: ["Euroleague TV", "Euroleague"],
  },
  {
    id: "f1-tv-pro",
    nombre: "F1 TV Pro",
    tipo: "streaming",
    file: "f1-tv-pro.webp",
    aliases: ["F1 TV", "F1 TV Premium", "F1TV"],
  },
  {
    id: "facebook-live",
    nombre: "Facebook Live",
    tipo: "streaming",
    file: "facebook-live.webp",
    aliases: ["* Facebook", "Facebook"],
  },
  {
    id: "fanatiz",
    nombre: "Fanatiz",
    tipo: "streaming",
    file: "fanatiz.webp",
    aliases: ["Fanatiz México"],
  },
  {
    id: "fifa-plus",
    nombre: "FIFA+",
    tipo: "streaming",
    file: "fifa-plus.webp",
    aliases: ["FIFA Plus"],
  },
  {
    id: "fox-one",
    nombre: "Fox One",
    tipo: "streaming",
    file: "fox-one.webp",
    aliases: ["FOX ONE", "FOXOne"],
  },
  {
    id: "fox-plus",
    nombre: "FOX+",
    tipo: "streaming",
    file: "fox-plus.webp",
    aliases: ["Fox+", "Fox Plus", "FOX Plus"],
  },
  {
    id: "fox-sports-2",
    nombre: "Fox Sports 2",
    tipo: "tv_paga",
    file: "fox-sports-2.webp",
    aliases: ["FS2"],
  },
  {
    id: "fox-sports-3",
    nombre: "Fox Sports 3",
    tipo: "tv_paga",
    file: "fox-sports-3.webp",
    aliases: ["FS3"],
  },
  {
    id: "fox-sports-premium",
    nombre: "Fox Sports Premium",
    tipo: "tv_paga",
    file: "fox-sports-premium.webp",
    aliases: ["FOX Sports Premium", "FS Premium"],
  },
  {
    id: "fox-sports",
    nombre: "Fox Sports",
    tipo: "tv_paga",
    file: "fox-sports.webp",
    aliases: ["Fox Sports 1", "FS1"],
  },
  {
    id: "fox",
    nombre: "FOX",
    tipo: "tv_paga",
    file: "fox.webp",
    aliases: ["Canal FOX", "FOX México"],
  },
  {
    id: "futv",
    nombre: "FUTV",
    tipo: "streaming",
    file: "futv.webp",
    aliases: [],
  },
  {
    id: "globo-internacional",
    nombre: "Globo Internacional",
    tipo: "tv_paga",
    file: "globo-internacional.webp",
    aliases: ["TV Globo Internacional"],
  },
  {
    id: "golf-channel",
    nombre: "Golf Channel",
    tipo: "tv_paga",
    file: "golf-channel.webp",
    aliases: [],
  },
  {
    id: "goltv",
    nombre: "GolTV",
    tipo: "tv_paga",
    file: "goltv.webp",
    aliases: ["Gol TV"],
  },
  {
    id: "hbo-max",
    nombre: "HBO Max",
    tipo: "streaming",
    file: "hbo-max.webp",
    aliases: ["Max", "HBO"],
  },
  {
    id: "hi-sports",
    nombre: "Hi Sports",
    tipo: "tv_paga",
    file: "hi-sports.webp",
    aliases: ["HiSports"],
  },
  {
    id: "imagen-tv",
    nombre: "Imagen TV",
    tipo: "tv_abierta",
    file: "imagen-tv.webp",
    aliases: ["Imagen Televisión", "Imagen Television", "Imagen", "Canal 3"],
  },
  {
    id: "las-estrellas",
    nombre: "Las Estrellas",
    tipo: "tv_abierta",
    file: "las-estrellas.webp",
    aliases: ["Canal 2", "Canal de las Estrellas", "Estrellas"],
  },
  {
    id: "laytime-tv",
    nombre: "Laytime TV",
    tipo: "streaming",
    file: "laytime-tv.webp",
    aliases: ["Laytime"],
  },
  {
    id: "lmb-tv",
    nombre: "LMB TV",
    tipo: "streaming",
    file: "lmb-tv.webp",
    aliases: ["LMB.TV", "Jonrón.TV", "Jonron TV", "Jonrón TV"],
  },
  {
    id: "lpf-play",
    nombre: "LPF Play",
    tipo: "streaming",
    file: "lpf-play.webp",
    aliases: [],
  },
  {
    id: "megasports",
    nombre: "MegaSports",
    tipo: "tv_paga",
    file: "megasports.webp",
    aliases: ["Mega Sports", "Megacable Sports"],
  },
  {
    id: "mlb-network",
    nombre: "MLB Network",
    tipo: "tv_paga",
    file: "mlb-network.webp",
    aliases: [],
  },
  {
    id: "mlb-tv",
    nombre: "MLB.TV",
    tipo: "streaming",
    file: "mlb-tv.webp",
    aliases: ["MLB TV"],
  },
  {
    id: "mls-season-pass",
    nombre: "MLS Season Pass",
    tipo: "streaming",
    file: "mls-season-pass.webp",
    aliases: [],
  },
  {
    id: "motogp-videopass",
    nombre: "MotoGP VideoPass",
    tipo: "streaming",
    file: "motogp-videopass.webp",
    aliases: ["VideoPass", "MotoGP TV"],
  },
  {
    id: "nacion-deportes-2",
    nombre: "Nación Deportes 2",
    tipo: "tv_paga",
    file: "nacion-deportes-2.webp",
    aliases: ["Nacion Deportes 2"],
  },
  {
    id: "nacion-deportes-3",
    nombre: "Nación Deportes 3",
    tipo: "tv_paga",
    file: "nacion-deportes-3.webp",
    aliases: ["Nacion Deportes 3"],
  },
  {
    id: "nacion-deportes-premium",
    nombre: "Nación Deportes Premium",
    tipo: "tv_paga",
    file: "nacion-deportes-premium.webp",
    aliases: ["Nacion Deportes Premium"],
  },
  {
    id: "nacion-deportes",
    nombre: "Nación Deportes",
    tipo: "tv_paga",
    file: "nacion-deportes.webp",
    aliases: ["Nacion Deportes", "Nación Deportes 1", "Nacion Deportes 1"],
  },
  {
    id: "nba-league-pass",
    nombre: "NBA League Pass",
    tipo: "streaming",
    file: "nba-league-pass.webp",
    aliases: ["NBA Pass"],
  },
  {
    id: "nba-tv",
    nombre: "NBA TV",
    tipo: "tv_paga",
    file: "nba-tv.webp",
    aliases: ["NBATV"],
  },
  {
    id: "netflix",
    nombre: "Netflix",
    tipo: "streaming",
    file: "netflix.webp",
    aliases: [],
  },
  {
    id: "nfl-game-pass",
    nombre: "NFL Game Pass",
    tipo: "streaming",
    file: "nfl-game-pass.webp",
    aliases: ["DAZN NFL", "Game Pass"],
  },
  {
    id: "nfl-network",
    nombre: "NFL Network",
    tipo: "tv_paga",
    file: "nfl-network.webp",
    aliases: [],
  },
  {
    id: "nhl-tv",
    nombre: "NHL TV",
    tipo: "tv_paga",
    file: "nhl-tv.webp",
    aliases: ["NHL.TV", "NHL Network"],
  },
  {
    id: "nu9ve",
    nombre: "Nu9ve",
    tipo: "tv_abierta",
    file: "nu9ve.webp",
    aliases: ["Canal 9", "El 9", "Galavisión", "Galavision", "Canal9"],
  },
  {
    id: "onefootball",
    nombre: "OneFootball",
    tipo: "streaming",
    file: "onefootball.webp",
    aliases: [],
  },
  {
    id: "paramount-plus",
    nombre: "Paramount+",
    tipo: "streaming",
    file: "paramount-plus.webp",
    aliases: ["Paramount Plus", "Paramount"],
  },
  {
    id: "pluto-tv",
    nombre: "Pluto TV",
    tipo: "streaming",
    file: "pluto-tv.webp",
    aliases: ["PlutoTV"],
  },
  {
    id: "prime-video",
    nombre: "Prime Video",
    tipo: "streaming",
    file: "prime-video.webp",
    aliases: ["Amazon Prime Video", "Amazon Prime", "Prime"],
  },
  {
    id: "px-sports",
    nombre: "PX Sports",
    tipo: "streaming",
    file: "px-sports.webp",
    aliases: [],
  },
  {
    id: "rally-tv",
    nombre: "Rally TV",
    tipo: "streaming",
    file: "rally-tv.webp",
    aliases: [],
  },
  {
    id: "rcn-nuestra-tele",
    nombre: "RCN Nuestra Tele",
    tipo: "tv_paga",
    file: "rcn-nuestra-tele.webp",
    aliases: ["Nuestra Tele", "RCN Internacional"],
  },
  {
    id: "sky-sports",
    nombre: "Sky Sports",
    tipo: "tv_paga",
    file: "sky-sports.webp",
    aliases: ["SKY Sports", "Sky+", "Sky"],
  },
  {
    id: "space",
    nombre: "Space",
    tipo: "tv_paga",
    file: "space.webp",
    aliases: [],
  },
  {
    id: "telemundo",
    nombre: "Telemundo",
    tipo: "tv_abierta",
    file: "telemundo.webp",
    aliases: [],
  },
  {
    id: "tennis-tv",
    nombre: "Tennis TV",
    tipo: "streaming",
    file: "tennis-tv.webp",
    aliases: ["TennisTV", "Tennis.TV"],
  },
  {
    id: "tigo-sports",
    nombre: "Tigo Sports",
    tipo: "tv_paga",
    file: "tigo-sports.webp",
    aliases: [],
  },
  {
    id: "tnt-sports",
    nombre: "TNT Sports",
    tipo: "tv_paga",
    file: "tnt-sports.webp",
    aliases: ["TNT Sports México", "TNT Sports Mexico"],
  },
  {
    id: "tnt",
    nombre: "TNT",
    tipo: "tv_paga",
    file: "tnt.webp",
    aliases: [],
  },
  {
    id: "tubi",
    nombre: "Tubi",
    tipo: "streaming",
    file: "tubi.webp",
    aliases: ["Tubi TV"],
  },
  {
    id: "tudn",
    nombre: "TUDN",
    tipo: "tv_paga",
    file: "tudn.webp",
    aliases: ["TUDN México", "TUDN Mexico", "TUDN En Vivo"],
  },
  {
    id: "tvc-deportes-2",
    nombre: "TVC Deportes 2",
    tipo: "tv_paga",
    file: "tvc-deportes-2.webp",
    aliases: [],
  },
  {
    id: "tvc-deportes",
    nombre: "TVC Deportes",
    tipo: "tv_paga",
    file: "tvc-deportes.webp",
    aliases: ["TVC Deportes 1"],
  },
  {
    id: "twitch",
    nombre: "Twitch",
    tipo: "streaming",
    file: "twitch.webp",
    aliases: ["* Twitch"],
  },
  {
    id: "tyc-sports-internacional",
    nombre: "TyC Sports Internacional",
    tipo: "tv_paga",
    file: "tyc-sports-internacional.webp",
    aliases: ["TyC Sports"],
  },
  {
    id: "uefa-tv",
    nombre: "UEFA.tv",
    tipo: "streaming",
    file: "uefa-tv.webp",
    aliases: ["UEFA TV", "UEFA"],
  },
  {
    id: "ufc-fight-pass",
    nombre: "UFC Fight Pass",
    tipo: "streaming",
    file: "ufc-fight-pass.webp",
    aliases: [],
  },
  {
    id: "univision",
    nombre: "Univision",
    tipo: "tv_abierta",
    file: "univision.webp",
    aliases: ["Univisión"],
  },
  {
    id: "vix",
    nombre: "ViX",
    tipo: "streaming",
    file: "vix.webp",
    aliases: ["ViX+", "ViX Gratis", "ViX Premium", "ViX Premium+"],
  },
  {
    id: "win-sports-plus",
    nombre: "Win Sports+",
    tipo: "tv_paga",
    file: "win-sports-plus.webp",
    aliases: ["Win Sports Plus", "Win Sports"],
  },
  {
    id: "wta-tv",
    nombre: "WTA TV",
    tipo: "streaming",
    file: "wta-tv.webp",
    aliases: ["WTA Unlocked"],
  },
  {
    id: "youtube",
    nombre: "YouTube",
    tipo: "streaming",
    file: "youtube.webp",
    aliases: ["* YouTube", "YouTube Live"],
  },
];

const CATALOG_LOGO_FILES: Record<string, string> = {
  "canal-5": "canal-5.webp",
  "azteca-7": "azteca-7.webp",
  "las-estrellas": "las-estrellas.webp",
  "nu9ve": "nu9ve.webp",
  "imagen-tv": "imagen-tv.webp",
  "azteca-uno": "azteca-uno.webp",
  espn: "espn.webp",
  "fox-sports": "fox-sports.webp",
  tudn: "tudn.webp",
  "claro-sports": "claro-sports.webp",
  "hi-sports": "hi-sports.webp",
  afizzionados: "afizzionados.webp",
  "sky-sports": "sky-sports.webp",
  vix: "vix.webp",
  "apple-tv": "apple-tv.webp",
  "disney-plus": "disney-plus.webp",
  max: "hbo-max.webp",
  "prime-video": "prime-video.webp",
  youtube: "youtube.webp",
  "nfl-game-pass": "nfl-game-pass.webp",
  "nba-league-pass": "nba-league-pass.webp",
  "f1-tv": "f1-tv-pro.webp",
};

for (const canal of CANALES_CATALOGO) {
  const file = CATALOG_LOGO_FILES[canal.id];
  if (file && CHANNEL_ICON_FILE_SET.has(file)) {
    canal.logo = `${CHANNEL_ICON_PATH}/${file}`;
  }
}

export interface CanalDisplay {
  id: string;
  nombre: string;
  tipo?: TipoCanal;
  logo?: string;
  unconfirmed?: boolean;
}

const UNCONFIRMED_CHANNELS_PATTERN =
  /por\s*(?:confirmar|definir|anunciar)|sin\s*(?:confirmar|definir|determinar)|pendiente|\btbd\b|\bn\/?d\b/i;

const UNCONFIRMED_DISPLAY: CanalDisplay = {
  id: "por-confirmar",
  nombre: "Por confirmar",
  unconfirmed: true,
};

/**
 * Normaliza un nombre de canal para comparación exacta: minúsculas, sin
 * diacríticos, `+` como `plus` y sin espacios ni puntuación.
 */
function normalizeChannelName(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\+/g, "plus")
    .replace(/[^a-z0-9]+/g, "");
}

function formatChannelLabel(raw: string): string {
  return raw
    .replace(/^\s*\*+\s*/, "")
    .replace(/\s*\*+\s*$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

const CHANNEL_ALIAS_INDEX = new Map<string, ChannelIconEntry>();

for (const entry of CHANNEL_ICON_ENTRIES) {
  for (const name of [entry.nombre, ...entry.aliases]) {
    const key = normalizeChannelName(name);
    if (key && !CHANNEL_ALIAS_INDEX.has(key)) {
      CHANNEL_ALIAS_INDEX.set(key, entry);
    }
  }
}

/**
 * Resuelve una cadena de canales del scraper en datos listos para renderizar.
 * Sólo devuelve `logo` cuando el archivo existe realmente en disco; en caso
 * contrario entrega la etiqueta limpia para el fallback de texto.
 */
export function resolveChannelsForDisplay(
  canalesStr: string | null | undefined
): CanalDisplay[] {
  if (!canalesStr || !canalesStr.trim()) return [UNCONFIRMED_DISPLAY];

  const rawChannels = canalesStr
    .split(/\s*[,·]\s*/)
    .map((channel) => channel.trim())
    .filter(Boolean);

  const displays: CanalDisplay[] = [];
  const seen = new Set<string>();

  for (const raw of rawChannels) {
    if (UNCONFIRMED_CHANNELS_PATTERN.test(raw)) continue;

    const key = normalizeChannelName(raw);
    if (!key) continue;

    const entry = CHANNEL_ALIAS_INDEX.get(key);
    const id = entry?.id ?? key;
    if (seen.has(id)) continue;
    seen.add(id);

    if (entry) {
      displays.push({
        id: entry.id,
        nombre: entry.nombre,
        tipo: entry.tipo,
        logo: `${CHANNEL_ICON_PATH}/${entry.file}`,
      });
    } else {
      displays.push({
        id,
        nombre: formatChannelLabel(raw),
      });
    }
  }

  return displays.length > 0 ? displays : [UNCONFIRMED_DISPLAY];
}

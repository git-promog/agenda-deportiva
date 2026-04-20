export interface WCVenue {
  id: string;
  ciudad: string;
  pais: 'México' | 'Canadá' | 'USA';
  estadio: string;
  capacidad: string;
  imagen: string;
  detalles: string;
}

export interface WCMatch {
  id: string;
  fecha: string;
  hora: string;
  estadio: string;
  ciudad: string;
  equipo1: string;
  equipo2: string;
  fase: string;
  grupo?: string;
  broadcasters?: string;
}

// Códigos de banderas — fuente: flagcdn.com
export const COUNTRY_CODES: Record<string, string> = {
  'México': 'mx', 'Sudáfrica': 'za', 'República de Corea': 'kr', 'Chequia': 'cz',
  'Canadá': 'ca', 'Bosnia y Herzegovina': 'ba', 'Catar': 'qa', 'Suiza': 'ch',
  'Brasil': 'br', 'Marruecos': 'ma', 'Haití': 'ht', 'Escocia': 'gb-sct',
  'EE. UU.': 'us', 'Paraguay': 'py', 'Australia': 'au', 'Turquía': 'tr',
  'Alemania': 'de', 'Curazao': 'cw', 'Costa de Marfil': 'ci', 'Ecuador': 'ec',
  'Países Bajos': 'nl', 'Japón': 'jp', 'Suecia': 'se', 'Túnez': 'tn',
  'Bélgica': 'be', 'Egipto': 'eg', 'RI de Irán': 'ir', 'Nueva Zelanda': 'nz',
  'España': 'es', 'Islas de Cabo Verde': 'cv', 'Uruguay': 'uy', 'Arabia Saudí': 'sa',
  'Francia': 'fr', 'Senegal': 'sn', 'Irak': 'iq', 'Noruega': 'no',
  'Argentina': 'ar', 'Argelia': 'dz', 'Austria': 'at', 'Jordania': 'jo',
  'Portugal': 'pt', 'RD Congo': 'cd', 'Uzbekistán': 'uz', 'Colombia': 'co',
  'Inglaterra': 'gb-eng', 'Croacia': 'hr', 'Ghana': 'gh', 'Panamá': 'pa'
};

export const getFlagUrl = (countryName: string) => {
  const code = COUNTRY_CODES[countryName];
  if (!code) return null;
  return `https://flagcdn.com/w80/${code}.png`;
};

export interface WCGroup {
  nombre: string;
  equipos: { nombre: string; pts: number; pj: number; pg: number; pe: number; pp: number; gf: number; gc: number }[];
}

// 16 Sedes — nombres exactos según la API oficial de la FIFA
export const SEDES: WCVenue[] = [
  // MÉXICO
  { id: 'azteca',      ciudad: 'Ciudad de México', pais: 'México', estadio: 'Estadio Ciudad de México',           capacidad: '87,523', imagen: '/images/mundial/azteca.webp',   detalles: 'Históricamente conocido como Estadio Azteca. Sede del partido inaugural.' },
  { id: 'guadalajara', ciudad: 'Guadalajara',       pais: 'México', estadio: 'Estadio Guadalajara',                capacidad: '49,850', imagen: '/images/mundial/akron.webp',    detalles: 'Estadio Akron. Sede de partidos de grupos y 1 Dieciseisavo.' },
  { id: 'monterrey',   ciudad: 'Monterrey',          pais: 'México', estadio: 'Estadio Monterrey',                  capacidad: '53,500', imagen: '/images/mundial/bbva.webp',     detalles: 'Estadio BBVA. Sede de partidos de grupos y 1 Dieciseisavo.' },
  // CANADÁ
  { id: 'vancouver',   ciudad: 'Vancouver',          pais: 'Canadá', estadio: 'Estadio BC Place Vancouver',         capacidad: '54,500', imagen: '/images/mundial/vancouver.webp', detalles: 'Sede del debut de Canadá y de 1 Dieciseisavo.' },
  { id: 'toronto',     ciudad: 'Toronto',            pais: 'Canadá', estadio: 'Estadio de Toronto',                 capacidad: '45,736', imagen: '/images/mundial/toronto.webp',  detalles: 'BMO Field. Sede de partidos de grupos y 1 Dieciseisavo.' },
  // USA
  { id: 'nynj',        ciudad: 'Nueva York',          pais: 'USA',    estadio: 'Estadio Nueva York/Nueva Jersey',   capacidad: '82,500', imagen: '/images/mundial/metlife.webp',  detalles: 'MetLife Stadium. Sede de la Gran Final (19 de julio).' },
  { id: 'la',          ciudad: 'Los Ángeles',         pais: 'USA',    estadio: 'Estadio Los Angeles',               capacidad: '70,240', imagen: '/images/mundial/sofi.webp',     detalles: 'SoFi Stadium. Sede del debut de EE. UU.' },
  { id: 'atlanta',     ciudad: 'Atlanta',             pais: 'USA',    estadio: 'Estadio Atlanta',                   capacidad: '71,000', imagen: '/images/mundial/mercedes.webp', detalles: 'Mercedes-Benz Stadium. Sede de la Semifinal 2.' },
  { id: 'dallas',      ciudad: 'Dallas',              pais: 'USA',    estadio: 'Estadio Dallas',                    capacidad: '80,000', imagen: '/images/mundial/att.webp',      detalles: 'AT&T Stadium. Sede con más partidos (9). Semis 1 y 3er lugar.' },
  { id: 'houston',     ciudad: 'Houston',             pais: 'USA',    estadio: 'Estadio Houston',                   capacidad: '72,220', imagen: '/images/mundial/nrg.webp',      detalles: 'NRG Stadium. Sede de grupos y eliminatorias.' },
  { id: 'miami',       ciudad: 'Miami',               pais: 'USA',    estadio: 'Estadio Miami',                     capacidad: '64,767', imagen: '/images/mundial/hardrock.webp', detalles: 'Hard Rock Stadium. Sede del Tercer Lugar (18 de julio).' },
  { id: 'boston',      ciudad: 'Boston',              pais: 'USA',    estadio: 'Estadio Boston',                    capacidad: '65,878', imagen: '/images/mundial/gillette.webp', detalles: 'Gillette Stadium. Sede de grupos y eliminatorias.' },
  { id: 'philadelphia',ciudad: 'Filadelfia',          pais: 'USA',    estadio: 'Estadio Filadelfia',                capacidad: '69,796', imagen: '/images/mundial/lincoln.webp',  detalles: 'Lincoln Financial Field. Sede de grupos y eliminatorias.' },
  { id: 'kansas',      ciudad: 'Kansas City',         pais: 'USA',    estadio: 'Estadio Kansas City',               capacidad: '76,416', imagen: '/images/mundial/arrowhead.webp',detalles: 'Arrowhead Stadium. Sede de grupos y eliminatorias.' },
  { id: 'sf',          ciudad: 'San Francisco',       pais: 'USA',    estadio: 'Estadio de la Bahía de San Francisco', capacidad: '68,500', imagen: '/images/mundial/levis.webp', detalles: 'Levi\'s Stadium. Sede de grupos y 1 Dieciseisavo.' },
  { id: 'seattle',     ciudad: 'Seattle',             pais: 'USA',    estadio: 'Estadio de Seattle',                capacidad: '69,000', imagen: '/images/mundial/lumen.webp',    detalles: 'Lumen Field. Sede de grupos y eliminatorias.' },
];

// 12 Grupos — datos verificados de la API oficial
export const GRUPOS: WCGroup[] = [
  { nombre: 'A', equipos: [{ nombre: 'México',               pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 },{ nombre: 'Sudáfrica',          pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 },{ nombre: 'República de Corea', pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 },{ nombre: 'Chequia',            pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 }] },
  { nombre: 'B', equipos: [{ nombre: 'Canadá',               pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 },{ nombre: 'Bosnia y Herzegovina',pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 },{ nombre: 'Catar',              pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 },{ nombre: 'Suiza',              pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 }] },
  { nombre: 'C', equipos: [{ nombre: 'Brasil',               pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 },{ nombre: 'Marruecos',          pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 },{ nombre: 'Haití',              pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 },{ nombre: 'Escocia',            pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 }] },
  { nombre: 'D', equipos: [{ nombre: 'EE. UU.',              pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 },{ nombre: 'Paraguay',           pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 },{ nombre: 'Australia',          pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 },{ nombre: 'Turquía',            pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 }] },
  { nombre: 'E', equipos: [{ nombre: 'Alemania',             pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 },{ nombre: 'Curazao',            pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 },{ nombre: 'Costa de Marfil',    pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 },{ nombre: 'Ecuador',            pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 }] },
  { nombre: 'F', equipos: [{ nombre: 'Países Bajos',         pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 },{ nombre: 'Japón',              pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 },{ nombre: 'Suecia',             pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 },{ nombre: 'Túnez',              pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 }] },
  { nombre: 'G', equipos: [{ nombre: 'Bélgica',              pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 },{ nombre: 'Egipto',             pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 },{ nombre: 'RI de Irán',         pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 },{ nombre: 'Nueva Zelanda',      pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 }] },
  { nombre: 'H', equipos: [{ nombre: 'España',               pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 },{ nombre: 'Islas de Cabo Verde', pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 },{ nombre: 'Arabia Saudí',       pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 },{ nombre: 'Uruguay',            pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 }] },
  { nombre: 'I', equipos: [{ nombre: 'Francia',              pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 },{ nombre: 'Senegal',            pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 },{ nombre: 'Irak',               pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 },{ nombre: 'Noruega',            pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 }] },
  { nombre: 'J', equipos: [{ nombre: 'Argentina',            pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 },{ nombre: 'Argelia',            pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 },{ nombre: 'Austria',            pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 },{ nombre: 'Jordania',           pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 }] },
  { nombre: 'K', equipos: [{ nombre: 'Portugal',             pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 },{ nombre: 'RD Congo',           pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 },{ nombre: 'Uzbekistán',         pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 },{ nombre: 'Colombia',           pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 }] },
  { nombre: 'L', equipos: [{ nombre: 'Inglaterra',           pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 },{ nombre: 'Croacia',            pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 },{ nombre: 'Ghana',              pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 },{ nombre: 'Panamá',             pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0 }] },
];

// 104 Partidos — extraídos directamente de api.fifa.com (idSeason=285023)
// Horarios en hora local de la sede. Nombres de estadios = API oficial FIFA.
export const MATCHES: WCMatch[] = [
  // ── FASE DE GRUPOS · JORNADA 1 ──────────────────────────────────────────
  { id:'m1',  fecha:'2026-06-11', hora:'13:00', estadio:'Estadio Ciudad de México',           ciudad:'Ciudad de México', equipo1:'México',            equipo2:'Sudáfrica',          fase:'Primera fase', grupo:'A' },
  { id:'m2',  fecha:'2026-06-11', hora:'20:00', estadio:'Estadio Guadalajara',                ciudad:'Guadalajara',      equipo1:'República de Corea', equipo2:'Chequia',            fase:'Primera fase', grupo:'A' },
  { id:'m3',  fecha:'2026-06-12', hora:'15:00', estadio:'Estadio de Toronto',                 ciudad:'Toronto',          equipo1:'Canadá',             equipo2:'Bosnia y Herzegovina',fase:'Primera fase', grupo:'B' },
  { id:'m4',  fecha:'2026-06-12', hora:'18:00', estadio:'Estadio Los Angeles',                ciudad:'Los Ángeles',      equipo1:'EE. UU.',            equipo2:'Paraguay',           fase:'Primera fase', grupo:'D' },
  { id:'m5',  fecha:'2026-06-13', hora:'21:00', estadio:'Estadio Boston',                     ciudad:'Boston',           equipo1:'Haití',              equipo2:'Escocia',            fase:'Primera fase', grupo:'C' },
  { id:'m6',  fecha:'2026-06-13', hora:'21:00', estadio:'Estadio BC Place Vancouver',         ciudad:'Vancouver',        equipo1:'Australia',          equipo2:'Turquía',            fase:'Primera fase', grupo:'D' },
  { id:'m7',  fecha:'2026-06-13', hora:'18:00', estadio:'Estadio Nueva York/Nueva Jersey',    ciudad:'Nueva York',       equipo1:'Brasil',             equipo2:'Marruecos',          fase:'Primera fase', grupo:'C' },
  { id:'m8',  fecha:'2026-06-13', hora:'12:00', estadio:'Estadio de la Bahía de San Francisco',ciudad:'San Francisco',   equipo1:'Catar',              equipo2:'Suiza',              fase:'Primera fase', grupo:'B' },
  { id:'m9',  fecha:'2026-06-14', hora:'19:00', estadio:'Estadio Filadelfia',                 ciudad:'Filadelfia',       equipo1:'Costa de Marfil',    equipo2:'Ecuador',            fase:'Primera fase', grupo:'E' },
  { id:'m10', fecha:'2026-06-14', hora:'12:00', estadio:'Estadio Houston',                    ciudad:'Houston',          equipo1:'Alemania',           equipo2:'Curazao',            fase:'Primera fase', grupo:'E' },
  { id:'m11', fecha:'2026-06-14', hora:'15:00', estadio:'Estadio Dallas',                     ciudad:'Dallas',           equipo1:'Países Bajos',       equipo2:'Japón',              fase:'Primera fase', grupo:'F' },
  { id:'m12', fecha:'2026-06-14', hora:'20:00', estadio:'Estadio Monterrey',                  ciudad:'Monterrey',        equipo1:'Suecia',             equipo2:'Túnez',              fase:'Primera fase', grupo:'F' },
  { id:'m13', fecha:'2026-06-15', hora:'18:00', estadio:'Estadio Miami',                      ciudad:'Miami',            equipo1:'Arabia Saudí',       equipo2:'Uruguay',            fase:'Primera fase', grupo:'H' },
  { id:'m14', fecha:'2026-06-15', hora:'12:00', estadio:'Estadio Atlanta',                    ciudad:'Atlanta',          equipo1:'España',             equipo2:'Islas de Cabo Verde',fase:'Primera fase', grupo:'H' },
  { id:'m15', fecha:'2026-06-15', hora:'18:00', estadio:'Estadio Los Angeles',                ciudad:'Los Ángeles',      equipo1:'RI de Irán',         equipo2:'Nueva Zelanda',      fase:'Primera fase', grupo:'G' },
  { id:'m16', fecha:'2026-06-15', hora:'12:00', estadio:'Estadio de Seattle',                 ciudad:'Seattle',          equipo1:'Bélgica',            equipo2:'Egipto',             fase:'Primera fase', grupo:'G' },
  { id:'m17', fecha:'2026-06-16', hora:'15:00', estadio:'Estadio Nueva York/Nueva Jersey',    ciudad:'Nueva York',       equipo1:'Francia',            equipo2:'Senegal',            fase:'Primera fase', grupo:'I' },
  { id:'m18', fecha:'2026-06-16', hora:'18:00', estadio:'Estadio Boston',                     ciudad:'Boston',           equipo1:'Irak',               equipo2:'Noruega',            fase:'Primera fase', grupo:'I' },
  { id:'m19', fecha:'2026-06-16', hora:'20:00', estadio:'Estadio Kansas City',                ciudad:'Kansas City',      equipo1:'Argentina',          equipo2:'Argelia',            fase:'Primera fase', grupo:'J' },
  { id:'m20', fecha:'2026-06-16', hora:'21:00', estadio:'Estadio de la Bahía de San Francisco',ciudad:'San Francisco',   equipo1:'Austria',            equipo2:'Jordania',           fase:'Primera fase', grupo:'J' },
  { id:'m21', fecha:'2026-06-17', hora:'19:00', estadio:'Estadio de Toronto',                 ciudad:'Toronto',          equipo1:'Ghana',              equipo2:'Panamá',             fase:'Primera fase', grupo:'L' },
  { id:'m22', fecha:'2026-06-17', hora:'15:00', estadio:'Estadio Dallas',                     ciudad:'Dallas',           equipo1:'Inglaterra',         equipo2:'Croacia',            fase:'Primera fase', grupo:'L' },
  { id:'m23', fecha:'2026-06-17', hora:'12:00', estadio:'Estadio Houston',                    ciudad:'Houston',          equipo1:'Portugal',           equipo2:'RD Congo',           fase:'Primera fase', grupo:'K' },
  { id:'m24', fecha:'2026-06-17', hora:'20:00', estadio:'Estadio Ciudad de México',           ciudad:'Ciudad de México', equipo1:'Uzbekistán',         equipo2:'Colombia',           fase:'Primera fase', grupo:'K' },

  // ── FASE DE GRUPOS · JORNADA 2 ──────────────────────────────────────────
  { id:'m25', fecha:'2026-06-18', hora:'12:00', estadio:'Estadio Atlanta',                    ciudad:'Atlanta',          equipo1:'Chequia',            equipo2:'Sudáfrica',          fase:'Primera fase', grupo:'A' },
  { id:'m26', fecha:'2026-06-18', hora:'12:00', estadio:'Estadio Los Angeles',                ciudad:'Los Ángeles',      equipo1:'Suiza',              equipo2:'Bosnia y Herzegovina',fase:'Primera fase', grupo:'B' },
  { id:'m27', fecha:'2026-06-18', hora:'15:00', estadio:'Estadio BC Place Vancouver',         ciudad:'Vancouver',        equipo1:'Canadá',             equipo2:'Catar',              fase:'Primera fase', grupo:'B' },
  { id:'m28', fecha:'2026-06-18', hora:'19:00', estadio:'Estadio Guadalajara',                ciudad:'Guadalajara',      equipo1:'México',             equipo2:'República de Corea', fase:'Primera fase', grupo:'A' },
  { id:'m29', fecha:'2026-06-19', hora:'20:30', estadio:'Estadio Filadelfia',                 ciudad:'Filadelfia',       equipo1:'Brasil',             equipo2:'Haití',              fase:'Primera fase', grupo:'C' },
  { id:'m30', fecha:'2026-06-19', hora:'18:00', estadio:'Estadio Boston',                     ciudad:'Boston',           equipo1:'Escocia',            equipo2:'Marruecos',          fase:'Primera fase', grupo:'C' },
  { id:'m31', fecha:'2026-06-19', hora:'20:00', estadio:'Estadio de la Bahía de San Francisco',ciudad:'San Francisco',   equipo1:'Turquía',            equipo2:'Paraguay',           fase:'Primera fase', grupo:'D' },
  { id:'m32', fecha:'2026-06-19', hora:'12:00', estadio:'Estadio de Seattle',                 ciudad:'Seattle',          equipo1:'EE. UU.',            equipo2:'Australia',          fase:'Primera fase', grupo:'D' },
  { id:'m33', fecha:'2026-06-20', hora:'16:00', estadio:'Estadio de Toronto',                 ciudad:'Toronto',          equipo1:'Alemania',           equipo2:'Costa de Marfil',    fase:'Primera fase', grupo:'E' },
  { id:'m34', fecha:'2026-06-20', hora:'19:00', estadio:'Estadio Kansas City',                ciudad:'Kansas City',      equipo1:'Ecuador',            equipo2:'Curazao',            fase:'Primera fase', grupo:'E' },
  { id:'m35', fecha:'2026-06-20', hora:'12:00', estadio:'Estadio Houston',                    ciudad:'Houston',          equipo1:'Países Bajos',       equipo2:'Suecia',             fase:'Primera fase', grupo:'F' },
  { id:'m36', fecha:'2026-06-20', hora:'22:00', estadio:'Estadio Monterrey',                  ciudad:'Monterrey',        equipo1:'Túnez',              equipo2:'Japón',              fase:'Primera fase', grupo:'F' },
  { id:'m37', fecha:'2026-06-21', hora:'18:00', estadio:'Estadio Miami',                      ciudad:'Miami',            equipo1:'Uruguay',            equipo2:'Islas de Cabo Verde',fase:'Primera fase', grupo:'H' },
  { id:'m38', fecha:'2026-06-21', hora:'12:00', estadio:'Estadio Atlanta',                    ciudad:'Atlanta',          equipo1:'España',             equipo2:'Arabia Saudí',       fase:'Primera fase', grupo:'H' },
  { id:'m39', fecha:'2026-06-21', hora:'12:00', estadio:'Estadio Los Angeles',                ciudad:'Los Ángeles',      equipo1:'Bélgica',            equipo2:'RI de Irán',         fase:'Primera fase', grupo:'G' },
  { id:'m40', fecha:'2026-06-21', hora:'18:00', estadio:'Estadio BC Place Vancouver',         ciudad:'Vancouver',        equipo1:'Nueva Zelanda',      equipo2:'Egipto',             fase:'Primera fase', grupo:'G' },
  { id:'m41', fecha:'2026-06-22', hora:'20:00', estadio:'Estadio Nueva York/Nueva Jersey',    ciudad:'Nueva York',       equipo1:'Noruega',            equipo2:'Senegal',            fase:'Primera fase', grupo:'I' },
  { id:'m42', fecha:'2026-06-22', hora:'17:00', estadio:'Estadio Filadelfia',                 ciudad:'Filadelfia',       equipo1:'Francia',            equipo2:'Irak',               fase:'Primera fase', grupo:'I' },
  { id:'m43', fecha:'2026-06-22', hora:'12:00', estadio:'Estadio Dallas',                     ciudad:'Dallas',           equipo1:'Argentina',          equipo2:'Austria',            fase:'Primera fase', grupo:'J' },
  { id:'m44', fecha:'2026-06-22', hora:'20:00', estadio:'Estadio de la Bahía de San Francisco',ciudad:'San Francisco',   equipo1:'Jordania',           equipo2:'Argelia',            fase:'Primera fase', grupo:'J' },
  { id:'m45', fecha:'2026-06-23', hora:'16:00', estadio:'Estadio Boston',                     ciudad:'Boston',           equipo1:'Inglaterra',         equipo2:'Ghana',              fase:'Primera fase', grupo:'L' },
  { id:'m46', fecha:'2026-06-23', hora:'19:00', estadio:'Estadio de Toronto',                 ciudad:'Toronto',          equipo1:'Panamá',             equipo2:'Croacia',            fase:'Primera fase', grupo:'L' },
  { id:'m47', fecha:'2026-06-23', hora:'12:00', estadio:'Estadio Houston',                    ciudad:'Houston',          equipo1:'Portugal',           equipo2:'Uzbekistán',         fase:'Primera fase', grupo:'K' },
  { id:'m48', fecha:'2026-06-23', hora:'20:00', estadio:'Estadio Guadalajara',                ciudad:'Guadalajara',      equipo1:'Colombia',           equipo2:'RD Congo',           fase:'Primera fase', grupo:'K' },

  // ── FASE DE GRUPOS · JORNADA 3 ──────────────────────────────────────────
  { id:'m49', fecha:'2026-06-24', hora:'18:00', estadio:'Estadio Miami',                      ciudad:'Miami',            equipo1:'Escocia',            equipo2:'Brasil',             fase:'Primera fase', grupo:'C' },
  { id:'m50', fecha:'2026-06-24', hora:'18:00', estadio:'Estadio Atlanta',                    ciudad:'Atlanta',          equipo1:'Marruecos',          equipo2:'Haití',              fase:'Primera fase', grupo:'C' },
  { id:'m51', fecha:'2026-06-24', hora:'12:00', estadio:'Estadio BC Place Vancouver',         ciudad:'Vancouver',        equipo1:'Suiza',              equipo2:'Canadá',             fase:'Primera fase', grupo:'B' },
  { id:'m52', fecha:'2026-06-24', hora:'12:00', estadio:'Estadio de Seattle',                 ciudad:'Seattle',          equipo1:'Bosnia y Herzegovina',equipo2:'Catar',             fase:'Primera fase', grupo:'B' },
  { id:'m53', fecha:'2026-06-24', hora:'19:00', estadio:'Estadio Ciudad de México',           ciudad:'Ciudad de México', equipo1:'Chequia',            equipo2:'México',             fase:'Primera fase', grupo:'A' },
  { id:'m54', fecha:'2026-06-24', hora:'19:00', estadio:'Estadio Monterrey',                  ciudad:'Monterrey',        equipo1:'Sudáfrica',          equipo2:'República de Corea', fase:'Primera fase', grupo:'A' },
  { id:'m55', fecha:'2026-06-25', hora:'16:00', estadio:'Estadio Filadelfia',                 ciudad:'Filadelfia',       equipo1:'Curazao',            equipo2:'Costa de Marfil',    fase:'Primera fase', grupo:'E' },
  { id:'m56', fecha:'2026-06-25', hora:'16:00', estadio:'Estadio Nueva York/Nueva Jersey',    ciudad:'Nueva York',       equipo1:'Ecuador',            equipo2:'Alemania',           fase:'Primera fase', grupo:'E' },
  { id:'m57', fecha:'2026-06-25', hora:'18:00', estadio:'Estadio Dallas',                     ciudad:'Dallas',           equipo1:'Japón',              equipo2:'Suecia',             fase:'Primera fase', grupo:'F' },
  { id:'m58', fecha:'2026-06-25', hora:'18:00', estadio:'Estadio Kansas City',                ciudad:'Kansas City',      equipo1:'Túnez',              equipo2:'Países Bajos',       fase:'Primera fase', grupo:'F' },
  { id:'m59', fecha:'2026-06-25', hora:'19:00', estadio:'Estadio Los Angeles',                ciudad:'Los Ángeles',      equipo1:'Turquía',            equipo2:'EE. UU.',            fase:'Primera fase', grupo:'D' },
  { id:'m60', fecha:'2026-06-25', hora:'19:00', estadio:'Estadio de la Bahía de San Francisco',ciudad:'San Francisco',   equipo1:'Paraguay',           equipo2:'Australia',          fase:'Primera fase', grupo:'D' },
  { id:'m61', fecha:'2026-06-26', hora:'15:00', estadio:'Estadio Boston',                     ciudad:'Boston',           equipo1:'Noruega',            equipo2:'Francia',            fase:'Primera fase', grupo:'I' },
  { id:'m62', fecha:'2026-06-26', hora:'15:00', estadio:'Estadio de Toronto',                 ciudad:'Toronto',          equipo1:'Senegal',            equipo2:'Irak',               fase:'Primera fase', grupo:'I' },
  { id:'m63', fecha:'2026-06-26', hora:'20:00', estadio:'Estadio de Seattle',                 ciudad:'Seattle',          equipo1:'Egipto',             equipo2:'RI de Irán',         fase:'Primera fase', grupo:'G' },
  { id:'m64', fecha:'2026-06-26', hora:'20:00', estadio:'Estadio BC Place Vancouver',         ciudad:'Vancouver',        equipo1:'Nueva Zelanda',      equipo2:'Bélgica',            fase:'Primera fase', grupo:'G' },
  { id:'m65', fecha:'2026-06-26', hora:'19:00', estadio:'Estadio Houston',                    ciudad:'Houston',          equipo1:'Islas de Cabo Verde', equipo2:'Arabia Saudí',      fase:'Primera fase', grupo:'H' },
  { id:'m66', fecha:'2026-06-26', hora:'18:00', estadio:'Estadio Guadalajara',                ciudad:'Guadalajara',      equipo1:'Uruguay',            equipo2:'España',             fase:'Primera fase', grupo:'H' },
  { id:'m67', fecha:'2026-06-27', hora:'17:00', estadio:'Estadio Nueva York/Nueva Jersey',    ciudad:'Nueva York',       equipo1:'Panamá',             equipo2:'Inglaterra',         fase:'Primera fase', grupo:'L' },
  { id:'m68', fecha:'2026-06-27', hora:'17:00', estadio:'Estadio Filadelfia',                 ciudad:'Filadelfia',       equipo1:'Croacia',            equipo2:'Ghana',              fase:'Primera fase', grupo:'L' },
  { id:'m69', fecha:'2026-06-27', hora:'21:00', estadio:'Estadio Kansas City',                ciudad:'Kansas City',      equipo1:'Argelia',            equipo2:'Austria',            fase:'Primera fase', grupo:'J' },
  { id:'m70', fecha:'2026-06-27', hora:'21:00', estadio:'Estadio Dallas',                     ciudad:'Dallas',           equipo1:'Jordania',           equipo2:'Argentina',          fase:'Primera fase', grupo:'J' },
  { id:'m71', fecha:'2026-06-27', hora:'19:30', estadio:'Estadio Miami',                      ciudad:'Miami',            equipo1:'Colombia',           equipo2:'Portugal',           fase:'Primera fase', grupo:'K' },
  { id:'m72', fecha:'2026-06-27', hora:'19:30', estadio:'Estadio Atlanta',                    ciudad:'Atlanta',          equipo1:'RD Congo',           equipo2:'Uzbekistán',         fase:'Primera fase', grupo:'K' },

  // ── DIECISEISAVOS DE FINAL ───────────────────────────────────────────────
  { id:'m73', fecha:'2026-06-28', hora:'12:00', estadio:'Estadio Los Angeles',                ciudad:'Los Ángeles',      equipo1:'2° Grupo A',         equipo2:'2° Grupo B',         fase:'Dieciseisavos de final' },
  { id:'m74', fecha:'2026-06-29', hora:'16:30', estadio:'Estadio Boston',                     ciudad:'Boston',           equipo1:'1° Grupo E',         equipo2:'3° ABC/D/F',         fase:'Dieciseisavos de final' },
  { id:'m75', fecha:'2026-06-29', hora:'19:00', estadio:'Estadio Monterrey',                  ciudad:'Monterrey',        equipo1:'1° Grupo F',         equipo2:'2° Grupo C',         fase:'Dieciseisavos de final' },
  { id:'m76', fecha:'2026-06-29', hora:'12:00', estadio:'Estadio Houston',                    ciudad:'Houston',          equipo1:'1° Grupo C',         equipo2:'2° Grupo F',         fase:'Dieciseisavos de final' },
  { id:'m77', fecha:'2026-06-30', hora:'17:00', estadio:'Estadio Nueva York/Nueva Jersey',    ciudad:'Nueva York',       equipo1:'1° Grupo I',         equipo2:'3° C/D/F/G/H',      fase:'Dieciseisavos de final' },
  { id:'m78', fecha:'2026-06-30', hora:'12:00', estadio:'Estadio Dallas',                     ciudad:'Dallas',           equipo1:'2° Grupo E',         equipo2:'2° Grupo I',         fase:'Dieciseisavos de final' },
  { id:'m79', fecha:'2026-06-30', hora:'19:00', estadio:'Estadio Ciudad de México',           ciudad:'Ciudad de México', equipo1:'1° Grupo A',         equipo2:'3° C/E/F/H/I',      fase:'Dieciseisavos de final' },
  { id:'m80', fecha:'2026-07-01', hora:'12:00', estadio:'Estadio Atlanta',                    ciudad:'Atlanta',          equipo1:'1° Grupo L',         equipo2:'3° E/H/I/J/K',      fase:'Dieciseisavos de final' },
  { id:'m81', fecha:'2026-07-01', hora:'17:00', estadio:'Estadio de la Bahía de San Francisco',ciudad:'San Francisco',   equipo1:'1° Grupo D',         equipo2:'3° B/E/F/I/J',      fase:'Dieciseisavos de final' },
  { id:'m82', fecha:'2026-07-01', hora:'13:00', estadio:'Estadio de Seattle',                 ciudad:'Seattle',          equipo1:'1° Grupo G',         equipo2:'3° A/E/H/I/J',      fase:'Dieciseisavos de final' },
  { id:'m83', fecha:'2026-07-02', hora:'19:00', estadio:'Estadio de Toronto',                 ciudad:'Toronto',          equipo1:'2° Grupo K',         equipo2:'2° Grupo L',         fase:'Dieciseisavos de final' },
  { id:'m84', fecha:'2026-07-02', hora:'12:00', estadio:'Estadio Los Angeles',                ciudad:'Los Ángeles',      equipo1:'1° Grupo H',         equipo2:'2° Grupo J',         fase:'Dieciseisavos de final' },
  { id:'m85', fecha:'2026-07-02', hora:'20:00', estadio:'Estadio BC Place Vancouver',         ciudad:'Vancouver',        equipo1:'1° Grupo B',         equipo2:'3° E/F/G/I/J',      fase:'Dieciseisavos de final' },
  { id:'m86', fecha:'2026-07-03', hora:'18:00', estadio:'Estadio Miami',                      ciudad:'Miami',            equipo1:'1° Grupo J',         equipo2:'2° Grupo H',         fase:'Dieciseisavos de final' },
  { id:'m87', fecha:'2026-07-03', hora:'20:30', estadio:'Estadio Kansas City',                ciudad:'Kansas City',      equipo1:'1° Grupo K',         equipo2:'3° D/E/I/J/L',      fase:'Dieciseisavos de final' },
  { id:'m88', fecha:'2026-07-03', hora:'13:00', estadio:'Estadio Dallas',                     ciudad:'Dallas',           equipo1:'2° Grupo D',         equipo2:'2° Grupo G',         fase:'Dieciseisavos de final' },

  // ── OCTAVOS DE FINAL ────────────────────────────────────────────────────
  { id:'m89', fecha:'2026-07-04', hora:'17:00', estadio:'Estadio Filadelfia',                 ciudad:'Filadelfia',       equipo1:'Ganador M74',        equipo2:'Ganador M77',        fase:'Octavos de final' },
  { id:'m90', fecha:'2026-07-04', hora:'12:00', estadio:'Estadio Houston',                    ciudad:'Houston',          equipo1:'Ganador M73',        equipo2:'Ganador M75',        fase:'Octavos de final' },
  { id:'m91', fecha:'2026-07-05', hora:'16:00', estadio:'Estadio Nueva York/Nueva Jersey',    ciudad:'Nueva York',       equipo1:'Ganador M76',        equipo2:'Ganador M78',        fase:'Octavos de final' },
  { id:'m92', fecha:'2026-07-05', hora:'18:00', estadio:'Estadio Ciudad de México',           ciudad:'Ciudad de México', equipo1:'Ganador M79',        equipo2:'Ganador M80',        fase:'Octavos de final' },
  { id:'m93', fecha:'2026-07-06', hora:'14:00', estadio:'Estadio Dallas',                     ciudad:'Dallas',           equipo1:'Ganador M83',        equipo2:'Ganador M84',        fase:'Octavos de final' },
  { id:'m94', fecha:'2026-07-06', hora:'17:00', estadio:'Estadio de Seattle',                 ciudad:'Seattle',          equipo1:'Ganador M81',        equipo2:'Ganador M82',        fase:'Octavos de final' },
  { id:'m95', fecha:'2026-07-07', hora:'12:00', estadio:'Estadio Atlanta',                    ciudad:'Atlanta',          equipo1:'Ganador M86',        equipo2:'Ganador M88',        fase:'Octavos de final' },
  { id:'m96', fecha:'2026-07-07', hora:'13:00', estadio:'Estadio BC Place Vancouver',         ciudad:'Vancouver',        equipo1:'Ganador M85',        equipo2:'Ganador M87',        fase:'Octavos de final' },

  // ── CUARTOS DE FINAL ────────────────────────────────────────────────────
  { id:'m97',  fecha:'2026-07-09', hora:'16:00', estadio:'Estadio Boston',                    ciudad:'Boston',           equipo1:'Ganador M89',        equipo2:'Ganador M90',        fase:'Cuartos de final' },
  { id:'m98',  fecha:'2026-07-10', hora:'12:00', estadio:'Estadio Los Angeles',               ciudad:'Los Ángeles',      equipo1:'Ganador M93',        equipo2:'Ganador M94',        fase:'Cuartos de final' },
  { id:'m99',  fecha:'2026-07-11', hora:'17:00', estadio:'Estadio Miami',                     ciudad:'Miami',            equipo1:'Ganador M91',        equipo2:'Ganador M92',        fase:'Cuartos de final' },
  { id:'m100', fecha:'2026-07-11', hora:'20:00', estadio:'Estadio Kansas City',               ciudad:'Kansas City',      equipo1:'Ganador M95',        equipo2:'Ganador M96',        fase:'Cuartos de final' },

  // ── SEMIFINALES ─────────────────────────────────────────────────────────
  { id:'m101', fecha:'2026-07-14', hora:'14:00', estadio:'Estadio Dallas',                    ciudad:'Dallas',           equipo1:'Ganador M97',        equipo2:'Ganador M98',        fase:'Semifinal' },
  { id:'m102', fecha:'2026-07-15', hora:'15:00', estadio:'Estadio Atlanta',                   ciudad:'Atlanta',          equipo1:'Ganador M99',        equipo2:'Ganador M100',       fase:'Semifinal' },

  // ── TERCER LUGAR & FINAL ────────────────────────────────────────────────
  { id:'m103', fecha:'2026-07-18', hora:'17:00', estadio:'Estadio Miami',                     ciudad:'Miami',            equipo1:'Perdedor M101',      equipo2:'Perdedor M102',      fase:'Partido por el tercer puesto' },
  { id:'m104', fecha:'2026-07-19', hora:'15:00', estadio:'Estadio Nueva York/Nueva Jersey',   ciudad:'Nueva York',       equipo1:'Ganador M101',       equipo2:'Ganador M102',       fase:'Final' },
];

// ╔═══════════════════════════════════════════════════════════════╗
// ║  AUTO-GENERADO por scripts/sync-fifa.mjs                      ║
// ║  ⚠️  NO edites este archivo directamente.                      ║
// ║  Para agregar transmisiones → scripts/broadcasters-overrides.json ║
// ║  Para regenerar → npm run sync-fifa                            ║
// ╚═══════════════════════════════════════════════════════════════╝

export interface WCVenue {
  id: string;
  ciudad: string;
  pais: 'México' | 'Canadá' | 'USA';
  estadio: string;
  capacidad: string;
  imagen: string;
  detalles: string;
  utcOffset: number; // Diferencia respecto a UTC en verano 2026
}

export interface WCMatch {
  id: string;
  fecha: string;
  hora: string;       // Hora local de la sede
  utc?: string;       // Hora UTC (ISO 8601) — para conversión de zona horaria
  estadio: string;
  ciudad: string;
  equipo1: string;
  equipo2: string;
  fase: string;
  grupo?: string;
  broadcasters?: string;
  streaming?: string;
  broadcastNotes?: string;
  broadcastConfirmed?: boolean;
}

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
  'Inglaterra': 'gb-eng', 'Croacia': 'hr', 'Ghana': 'gh', 'Panamá': 'pa',
};

export const getFlagUrl = (countryName: string) => {
  const code = COUNTRY_CODES[countryName];
  return code ? `https://flagcdn.com/w80/${code}.png` : null;
};

export interface WCGroup {
  nombre: string;
  equipos: { nombre: string; pts: number; pj: number; pg: number; pe: number; pp: number; gf: number; gc: number }[];
}

export const SEDES: WCVenue[] = [
  { id:'azteca',       ciudad:'Ciudad de México', pais:'México', estadio:'Estadio Ciudad de México',            capacidad:'87,523', utcOffset:-6, imagen:'/images/mundial/azteca.webp',    detalles:'Históricamente conocido como Estadio Azteca. Sede del partido inaugural.' },
  { id:'guadalajara',  ciudad:'Guadalajara',       pais:'México', estadio:'Estadio Guadalajara',                 capacidad:'49,850', utcOffset:-6, imagen:'/images/mundial/akron.webp',     detalles:'Estadio Akron. Sede de grupos y 1 Dieciseisavo.' },
  { id:'monterrey',    ciudad:'Monterrey',          pais:'México', estadio:'Estadio Monterrey',                   capacidad:'53,500', utcOffset:-6, imagen:'/images/mundial/bbva.webp',      detalles:'Estadio BBVA. Sede de grupos y 1 Dieciseisavo.' },
  { id:'vancouver',    ciudad:'Vancouver',          pais:'Canadá', estadio:'Estadio BC Place Vancouver',          capacidad:'54,500', utcOffset:-7, imagen:'/images/mundial/vancouver.webp',  detalles:'Sede del debut de Canadá y de 1 Dieciseisavo.' },
  { id:'toronto',      ciudad:'Toronto',            pais:'Canadá', estadio:'Estadio de Toronto',                  capacidad:'45,736', utcOffset:-4, imagen:'/images/mundial/toronto.webp',   detalles:'BMO Field. Sede de grupos y 1 Dieciseisavo.' },
  { id:'nynj',         ciudad:'Nueva York',          pais:'USA',    estadio:'Estadio Nueva York/Nueva Jersey',    capacidad:'82,500', utcOffset:-4, imagen:'/images/mundial/metlife.webp',   detalles:'MetLife Stadium. Sede de la Gran Final (19 jul).' },
  { id:'la',           ciudad:'Los Ángeles',         pais:'USA',    estadio:'Estadio Los Angeles',                capacidad:'70,240', utcOffset:-7, imagen:'/images/mundial/sofi.webp',      detalles:'SoFi Stadium. Sede del debut de EE. UU.' },
  { id:'atlanta',      ciudad:'Atlanta',             pais:'USA',    estadio:'Estadio Atlanta',                    capacidad:'71,000', utcOffset:-4, imagen:'/images/mundial/mercedes.webp',  detalles:'Mercedes-Benz Stadium. Semifinal 2 (15 jul).' },
  { id:'dallas',       ciudad:'Dallas',              pais:'USA',    estadio:'Estadio Dallas',                     capacidad:'80,000', utcOffset:-5, imagen:'/images/mundial/att.webp',       detalles:'AT&T Stadium. Sede con más partidos (9). Semifinal 1 (14 jul).' },
  { id:'houston',      ciudad:'Houston',             pais:'USA',    estadio:'Estadio Houston',                    capacidad:'72,220', utcOffset:-5, imagen:'/images/mundial/nrg.webp',       detalles:'NRG Stadium. Sede de grupos y eliminatorias.' },
  { id:'miami',        ciudad:'Miami',               pais:'USA',    estadio:'Estadio Miami',                      capacidad:'64,767', utcOffset:-4, imagen:'/images/mundial/hardrock.webp',  detalles:'Hard Rock Stadium. Tercer Lugar (18 jul).' },
  { id:'boston',       ciudad:'Boston',              pais:'USA',    estadio:'Estadio Boston',                     capacidad:'65,878', utcOffset:-4, imagen:'/images/mundial/gillette.webp',  detalles:'Gillette Stadium. Sede de grupos y eliminatorias.' },
  { id:'philadelphia', ciudad:'Filadelfia',          pais:'USA',    estadio:'Estadio Filadelfia',                 capacidad:'69,796', utcOffset:-4, imagen:'/images/mundial/lincoln.webp',   detalles:'Lincoln Financial Field. Sede de grupos y eliminatorias.' },
  { id:'kansas',       ciudad:'Kansas City',         pais:'USA',    estadio:'Estadio Kansas City',                capacidad:'76,416', utcOffset:-5, imagen:'/images/mundial/arrowhead.webp', detalles:'Arrowhead Stadium. Sede de grupos y eliminatorias.' },
  { id:'sf',           ciudad:'San Francisco',       pais:'USA',    estadio:'Estadio de la Bahía de San Francisco', capacidad:'68,500', utcOffset:-7, imagen:'/images/mundial/levis.webp',  detalles:"Levi's Stadium. Sede de grupos y 1 Dieciseisavo." },
  { id:'seattle',      ciudad:'Seattle',             pais:'USA',    estadio:'Estadio de Seattle',                 capacidad:'69,000', utcOffset:-7, imagen:'/images/mundial/lumen.webp',     detalles:'Lumen Field. Sede de grupos y eliminatorias.' },
];

export const GRUPOS: WCGroup[] = [
  { nombre:'A', equipos:[{nombre:'México',pj:3,pg:3,pe:0,pp:0,gf:6,gc:0,pts:9},{nombre:'Sudáfrica',pj:3,pg:1,pe:1,pp:1,gf:2,gc:3,pts:4},{nombre:'República de Corea',pj:3,pg:1,pe:0,pp:2,gf:2,gc:3,pts:3},{nombre:'Chequia',pj:3,pg:0,pe:1,pp:2,gf:2,gc:6,pts:1}] },
  { nombre:'B', equipos:[{nombre:'Suiza',pj:3,pg:2,pe:1,pp:0,gf:7,gc:3,pts:7},{nombre:'Canadá',pj:3,pg:1,pe:1,pp:1,gf:8,gc:3,pts:4},{nombre:'Bosnia y Herzegovina',pj:3,pg:1,pe:1,pp:1,gf:5,gc:6,pts:4},{nombre:'Catar',pj:3,pg:0,pe:1,pp:2,gf:2,gc:10,pts:1}] },
  { nombre:'C', equipos:[{nombre:'Brasil',pj:3,pg:2,pe:1,pp:0,gf:7,gc:1,pts:7},{nombre:'Marruecos',pj:3,pg:2,pe:1,pp:0,gf:6,gc:3,pts:7},{nombre:'Escocia',pj:3,pg:1,pe:0,pp:2,gf:1,gc:4,pts:3},{nombre:'Haití',pj:3,pg:0,pe:0,pp:3,gf:2,gc:8,pts:0}] },
  { nombre:'D', equipos:[{nombre:'EE. UU.',pj:3,pg:2,pe:1,pp:0,gf:7,gc:2,pts:7},{nombre:'Australia',pj:3,pg:1,pe:1,pp:1,gf:2,gc:2,pts:4},{nombre:'Paraguay',pj:3,pg:1,pe:1,pp:1,gf:2,gc:4,pts:4},{nombre:'Turquía',pj:3,pg:0,pe:1,pp:2,gf:1,gc:4,pts:1}] },
  { nombre:'E', equipos:[{nombre:'Alemania',pj:3,pg:2,pe:0,pp:1,gf:10,gc:4,pts:6},{nombre:'Costa de Marfil',pj:3,pg:2,pe:0,pp:1,gf:4,gc:2,pts:6},{nombre:'Ecuador',pj:3,pg:1,pe:1,pp:1,gf:2,gc:2,pts:4},{nombre:'Curazao',pj:3,pg:0,pe:1,pp:2,gf:1,gc:9,pts:1}] },
  { nombre:'F', equipos:[{nombre:'Países Bajos',pj:3,pg:2,pe:1,pp:0,gf:10,gc:4,pts:7},{nombre:'Japón',pj:3,pg:1,pe:2,pp:0,gf:7,gc:3,pts:5},{nombre:'Suecia',pj:3,pg:1,pe:1,pp:1,gf:7,gc:7,pts:4},{nombre:'Túnez',pj:3,pg:0,pe:0,pp:3,gf:2,gc:12,pts:0}] },
  { nombre:'G', equipos:[{nombre:'Egipto',pj:2,pg:1,pe:1,pp:0,gf:4,gc:2,pts:4},{nombre:'RI de Irán',pj:2,pg:0,pe:2,pp:0,gf:2,gc:2,pts:2},{nombre:'Bélgica',pj:2,pg:0,pe:2,pp:0,gf:1,gc:1,pts:2},{nombre:'Nueva Zelanda',pj:2,pg:0,pe:1,pp:1,gf:3,gc:5,pts:1}] },
  { nombre:'H', equipos:[{nombre:'España',pj:2,pg:1,pe:1,pp:0,gf:4,gc:0,pts:4},{nombre:'Uruguay',pj:2,pg:0,pe:2,pp:0,gf:3,gc:3,pts:2},{nombre:'Islas de Cabo Verde',pj:2,pg:0,pe:2,pp:0,gf:2,gc:2,pts:2},{nombre:'Arabia Saudí',pj:2,pg:0,pe:1,pp:1,gf:1,gc:5,pts:1}] },
  { nombre:'I', equipos:[{nombre:'Francia',pj:2,pg:2,pe:0,pp:0,gf:6,gc:1,pts:6},{nombre:'Noruega',pj:2,pg:2,pe:0,pp:0,gf:7,gc:3,pts:6},{nombre:'Senegal',pj:2,pg:0,pe:0,pp:2,gf:3,gc:6,pts:0},{nombre:'Irak',pj:2,pg:0,pe:0,pp:2,gf:1,gc:7,pts:0}] },
  { nombre:'J', equipos:[{nombre:'Argentina',pj:2,pg:2,pe:0,pp:0,gf:5,gc:0,pts:6},{nombre:'Austria',pj:2,pg:1,pe:0,pp:1,gf:3,gc:3,pts:3},{nombre:'Argelia',pj:2,pg:1,pe:0,pp:1,gf:2,gc:4,pts:3},{nombre:'Jordania',pj:2,pg:0,pe:0,pp:2,gf:2,gc:5,pts:0}] },
  { nombre:'K', equipos:[{nombre:'Colombia',pj:2,pg:2,pe:0,pp:0,gf:4,gc:1,pts:6},{nombre:'Portugal',pj:2,pg:1,pe:1,pp:0,gf:6,gc:1,pts:4},{nombre:'RD Congo',pj:2,pg:0,pe:1,pp:1,gf:1,gc:2,pts:1},{nombre:'Uzbekistán',pj:2,pg:0,pe:0,pp:2,gf:1,gc:8,pts:0}] },
  { nombre:'L', equipos:[{nombre:'Inglaterra',pj:2,pg:1,pe:1,pp:0,gf:4,gc:2,pts:4},{nombre:'Ghana',pj:2,pg:1,pe:1,pp:0,gf:1,gc:0,pts:4},{nombre:'Croacia',pj:2,pg:1,pe:0,pp:1,gf:3,gc:4,pts:3},{nombre:'Panamá',pj:2,pg:0,pe:0,pp:2,gf:0,gc:2,pts:0}] },
];

// Generado automáticamente — 2026-06-26T02:11:53.487Z
export const MATCHES: WCMatch[] = [
  { id:'m1', fecha:'2026-06-11', hora:'13:00', utc:'2026-06-11T19:00:00Z', estadio:'Estadio Ciudad de México', ciudad:'Ciudad de México', equipo1:'México', equipo2:'Sudáfrica', fase:'Primera fase', grupo:'A', broadcasters:'TUDN · Canal 5 · Azteca 7 · ViX', streaming:'https://vix.com', broadcastNotes:'Partido inaugural - Confirmado Televisa Deportes', broadcastConfirmed:true },
  { id:'m2', fecha:'2026-06-11', hora:'20:00', utc:'2026-06-12T02:00:00Z', estadio:'Estadio Guadalajara', ciudad:'Guadalajara', equipo1:'República de Corea', equipo2:'Chequia', fase:'Primera fase', grupo:'A', broadcasters:'TUDN · Canal 5 · Azteca 7 · ViX', streaming:'https://vix.com', broadcastConfirmed:true },
  { id:'m3', fecha:'2026-06-12', hora:'15:00', utc:'2026-06-12T19:00:00Z', estadio:'Estadio de Toronto', ciudad:'Toronto', equipo1:'Canadá', equipo2:'Bosnia y Herzegovina', fase:'Primera fase', grupo:'B', broadcasters:'TSN · TVA Sports', broadcastConfirmed:true },
  { id:'m4', fecha:'2026-06-12', hora:'18:00', utc:'2026-06-13T01:00:00Z', estadio:'Estadio Los Angeles', ciudad:'Los Ángeles', equipo1:'EE. UU.', equipo2:'Paraguay', fase:'Primera fase', grupo:'D', broadcasters:'Telemundo · Fox Sports · ViX', broadcastConfirmed:true },
  { id:'m5', fecha:'2026-06-13', hora:'21:00', utc:'2026-06-14T01:00:00Z', estadio:'Estadio Boston', ciudad:'Boston', equipo1:'Haití', equipo2:'Escocia', fase:'Primera fase', grupo:'C', broadcasters:'TUDN · Canal 5', streaming:'https://vix.com/mexico', broadcastNotes:'Partido de grupos - Confirmado', broadcastConfirmed:true },
  { id:'m6', fecha:'2026-06-13', hora:'21:00', utc:'2026-06-14T04:00:00Z', estadio:'Estadio BC Place Vancouver', ciudad:'Vancouver', equipo1:'Australia', equipo2:'Turquía', fase:'Primera fase', grupo:'D' },
  { id:'m7', fecha:'2026-06-13', hora:'18:00', utc:'2026-06-13T22:00:00Z', estadio:'Estadio Nueva York/Nueva Jersey', ciudad:'Nueva Jersey', equipo1:'Brasil', equipo2:'Marruecos', fase:'Primera fase', grupo:'C' },
  { id:'m8', fecha:'2026-06-13', hora:'12:00', utc:'2026-06-13T19:00:00Z', estadio:'Estadio de la Bahía de San Francisco', ciudad:'Área de la Bahía de San Francisco', equipo1:'Catar', equipo2:'Suiza', fase:'Primera fase', grupo:'B' },
  { id:'m9', fecha:'2026-06-14', hora:'19:00', utc:'2026-06-14T23:00:00Z', estadio:'Estadio Filadelfia', ciudad:'Filadelfia', equipo1:'Costa de Marfil', equipo2:'Ecuador', fase:'Primera fase', grupo:'E' },
  { id:'m10', fecha:'2026-06-14', hora:'12:00', utc:'2026-06-14T17:00:00Z', estadio:'Estadio Houston', ciudad:'Houston', equipo1:'Alemania', equipo2:'Curazao', fase:'Primera fase', grupo:'E' },
  { id:'m11', fecha:'2026-06-14', hora:'15:00', utc:'2026-06-14T20:00:00Z', estadio:'Estadio Dallas', ciudad:'Dallas', equipo1:'Países Bajos', equipo2:'Japón', fase:'Primera fase', grupo:'F' },
  { id:'m12', fecha:'2026-06-14', hora:'20:00', utc:'2026-06-15T02:00:00Z', estadio:'Estadio Monterrey', ciudad:'Monterrey', equipo1:'Suecia', equipo2:'Túnez', fase:'Primera fase', grupo:'F' },
  { id:'m13', fecha:'2026-06-15', hora:'18:00', utc:'2026-06-15T22:00:00Z', estadio:'Estadio Miami', ciudad:'Miami', equipo1:'Arabia Saudí', equipo2:'Uruguay', fase:'Primera fase', grupo:'H' },
  { id:'m14', fecha:'2026-06-15', hora:'12:00', utc:'2026-06-15T16:00:00Z', estadio:'Estadio Atlanta', ciudad:'Atlanta', equipo1:'España', equipo2:'Islas de Cabo Verde', fase:'Primera fase', grupo:'H' },
  { id:'m15', fecha:'2026-06-15', hora:'18:00', utc:'2026-06-16T01:00:00Z', estadio:'Estadio Los Angeles', ciudad:'Los Ángeles', equipo1:'RI de Irán', equipo2:'Nueva Zelanda', fase:'Primera fase', grupo:'G' },
  { id:'m16', fecha:'2026-06-15', hora:'12:00', utc:'2026-06-15T19:00:00Z', estadio:'Estadio de Seattle', ciudad:'Seattle', equipo1:'Bélgica', equipo2:'Egipto', fase:'Primera fase', grupo:'G' },
  { id:'m17', fecha:'2026-06-16', hora:'15:00', utc:'2026-06-16T19:00:00Z', estadio:'Estadio Nueva York/Nueva Jersey', ciudad:'Nueva Jersey', equipo1:'Francia', equipo2:'Senegal', fase:'Primera fase', grupo:'I' },
  { id:'m18', fecha:'2026-06-16', hora:'18:00', utc:'2026-06-16T22:00:00Z', estadio:'Estadio Boston', ciudad:'Boston', equipo1:'Irak', equipo2:'Noruega', fase:'Primera fase', grupo:'I' },
  { id:'m19', fecha:'2026-06-16', hora:'20:00', utc:'2026-06-17T01:00:00Z', estadio:'Estadio Kansas City', ciudad:'Kansas City', equipo1:'Argentina', equipo2:'Argelia', fase:'Primera fase', grupo:'J' },
  { id:'m20', fecha:'2026-06-16', hora:'21:00', utc:'2026-06-17T04:00:00Z', estadio:'Estadio de la Bahía de San Francisco', ciudad:'Área de la Bahía de San Francisco', equipo1:'Austria', equipo2:'Jordania', fase:'Primera fase', grupo:'J' },
  { id:'m21', fecha:'2026-06-17', hora:'19:00', utc:'2026-06-17T23:00:00Z', estadio:'Estadio de Toronto', ciudad:'Toronto', equipo1:'Ghana', equipo2:'Panamá', fase:'Primera fase', grupo:'L' },
  { id:'m22', fecha:'2026-06-17', hora:'15:00', utc:'2026-06-17T20:00:00Z', estadio:'Estadio Dallas', ciudad:'Dallas', equipo1:'Inglaterra', equipo2:'Croacia', fase:'Primera fase', grupo:'L' },
  { id:'m23', fecha:'2026-06-17', hora:'12:00', utc:'2026-06-17T17:00:00Z', estadio:'Estadio Houston', ciudad:'Houston', equipo1:'Portugal', equipo2:'RD Congo', fase:'Primera fase', grupo:'K' },
  { id:'m24', fecha:'2026-06-17', hora:'20:00', utc:'2026-06-18T02:00:00Z', estadio:'Estadio Ciudad de México', ciudad:'Ciudad de México', equipo1:'Uzbekistán', equipo2:'Colombia', fase:'Primera fase', grupo:'K' },
  { id:'m25', fecha:'2026-06-18', hora:'12:00', utc:'2026-06-18T16:00:00Z', estadio:'Estadio Atlanta', ciudad:'Atlanta', equipo1:'Chequia', equipo2:'Sudáfrica', fase:'Primera fase', grupo:'A' },
  { id:'m26', fecha:'2026-06-18', hora:'12:00', utc:'2026-06-18T19:00:00Z', estadio:'Estadio Los Angeles', ciudad:'Los Ángeles', equipo1:'Suiza', equipo2:'Bosnia y Herzegovina', fase:'Primera fase', grupo:'B' },
  { id:'m27', fecha:'2026-06-18', hora:'15:00', utc:'2026-06-18T22:00:00Z', estadio:'Estadio BC Place Vancouver', ciudad:'Vancouver', equipo1:'Canadá', equipo2:'Catar', fase:'Primera fase', grupo:'B' },
  { id:'m28', fecha:'2026-06-18', hora:'19:00', utc:'2026-06-19T01:00:00Z', estadio:'Estadio Guadalajara', ciudad:'Guadalajara', equipo1:'México', equipo2:'República de Corea', fase:'Primera fase', grupo:'A' },
  { id:'m29', fecha:'2026-06-19', hora:'20:30', utc:'2026-06-20T00:30:00Z', estadio:'Estadio Filadelfia', ciudad:'Filadelfia', equipo1:'Brasil', equipo2:'Haití', fase:'Primera fase', grupo:'C' },
  { id:'m30', fecha:'2026-06-19', hora:'18:00', utc:'2026-06-19T22:00:00Z', estadio:'Estadio Boston', ciudad:'Boston', equipo1:'Escocia', equipo2:'Marruecos', fase:'Primera fase', grupo:'C' },
  { id:'m31', fecha:'2026-06-19', hora:'20:00', utc:'2026-06-20T03:00:00Z', estadio:'Estadio de la Bahía de San Francisco', ciudad:'Área de la Bahía de San Francisco', equipo1:'Turquía', equipo2:'Paraguay', fase:'Primera fase', grupo:'D' },
  { id:'m32', fecha:'2026-06-19', hora:'12:00', utc:'2026-06-19T19:00:00Z', estadio:'Estadio de Seattle', ciudad:'Seattle', equipo1:'EE. UU.', equipo2:'Australia', fase:'Primera fase', grupo:'D' },
  { id:'m33', fecha:'2026-06-20', hora:'16:00', utc:'2026-06-20T20:00:00Z', estadio:'Estadio de Toronto', ciudad:'Toronto', equipo1:'Alemania', equipo2:'Costa de Marfil', fase:'Primera fase', grupo:'E' },
  { id:'m34', fecha:'2026-06-20', hora:'19:00', utc:'2026-06-21T00:00:00Z', estadio:'Estadio Kansas City', ciudad:'Kansas City', equipo1:'Ecuador', equipo2:'Curazao', fase:'Primera fase', grupo:'E' },
  { id:'m35', fecha:'2026-06-20', hora:'12:00', utc:'2026-06-20T17:00:00Z', estadio:'Estadio Houston', ciudad:'Houston', equipo1:'Países Bajos', equipo2:'Suecia', fase:'Primera fase', grupo:'F' },
  { id:'m36', fecha:'2026-06-20', hora:'22:00', utc:'2026-06-21T04:00:00Z', estadio:'Estadio Monterrey', ciudad:'Monterrey', equipo1:'Túnez', equipo2:'Japón', fase:'Primera fase', grupo:'F' },
  { id:'m37', fecha:'2026-06-21', hora:'18:00', utc:'2026-06-21T22:00:00Z', estadio:'Estadio Miami', ciudad:'Miami', equipo1:'Uruguay', equipo2:'Islas de Cabo Verde', fase:'Primera fase', grupo:'H' },
  { id:'m38', fecha:'2026-06-21', hora:'12:00', utc:'2026-06-21T16:00:00Z', estadio:'Estadio Atlanta', ciudad:'Atlanta', equipo1:'España', equipo2:'Arabia Saudí', fase:'Primera fase', grupo:'H' },
  { id:'m39', fecha:'2026-06-21', hora:'12:00', utc:'2026-06-21T19:00:00Z', estadio:'Estadio Los Angeles', ciudad:'Los Ángeles', equipo1:'Bélgica', equipo2:'RI de Irán', fase:'Primera fase', grupo:'G' },
  { id:'m40', fecha:'2026-06-21', hora:'18:00', utc:'2026-06-22T01:00:00Z', estadio:'Estadio BC Place Vancouver', ciudad:'Vancouver', equipo1:'Nueva Zelanda', equipo2:'Egipto', fase:'Primera fase', grupo:'G' },
  { id:'m41', fecha:'2026-06-22', hora:'20:00', utc:'2026-06-23T00:00:00Z', estadio:'Estadio Nueva York/Nueva Jersey', ciudad:'Nueva Jersey', equipo1:'Noruega', equipo2:'Senegal', fase:'Primera fase', grupo:'I' },
  { id:'m42', fecha:'2026-06-22', hora:'17:00', utc:'2026-06-22T21:00:00Z', estadio:'Estadio Filadelfia', ciudad:'Filadelfia', equipo1:'Francia', equipo2:'Irak', fase:'Primera fase', grupo:'I' },
  { id:'m43', fecha:'2026-06-22', hora:'12:00', utc:'2026-06-22T17:00:00Z', estadio:'Estadio Dallas', ciudad:'Dallas', equipo1:'Argentina', equipo2:'Austria', fase:'Primera fase', grupo:'J' },
  { id:'m44', fecha:'2026-06-22', hora:'20:00', utc:'2026-06-23T03:00:00Z', estadio:'Estadio de la Bahía de San Francisco', ciudad:'Área de la Bahía de San Francisco', equipo1:'Jordania', equipo2:'Argelia', fase:'Primera fase', grupo:'J' },
  { id:'m45', fecha:'2026-06-23', hora:'16:00', utc:'2026-06-23T20:00:00Z', estadio:'Estadio Boston', ciudad:'Boston', equipo1:'Inglaterra', equipo2:'Ghana', fase:'Primera fase', grupo:'L' },
  { id:'m46', fecha:'2026-06-23', hora:'19:00', utc:'2026-06-23T23:00:00Z', estadio:'Estadio de Toronto', ciudad:'Toronto', equipo1:'Panamá', equipo2:'Croacia', fase:'Primera fase', grupo:'L' },
  { id:'m47', fecha:'2026-06-23', hora:'12:00', utc:'2026-06-23T17:00:00Z', estadio:'Estadio Houston', ciudad:'Houston', equipo1:'Portugal', equipo2:'Uzbekistán', fase:'Primera fase', grupo:'K' },
  { id:'m48', fecha:'2026-06-23', hora:'20:00', utc:'2026-06-24T02:00:00Z', estadio:'Estadio Guadalajara', ciudad:'Guadalajara', equipo1:'Colombia', equipo2:'RD Congo', fase:'Primera fase', grupo:'K' },
  { id:'m49', fecha:'2026-06-24', hora:'18:00', utc:'2026-06-24T22:00:00Z', estadio:'Estadio Miami', ciudad:'Miami', equipo1:'Escocia', equipo2:'Brasil', fase:'Primera fase', grupo:'C' },
  { id:'m50', fecha:'2026-06-24', hora:'18:00', utc:'2026-06-24T22:00:00Z', estadio:'Estadio Atlanta', ciudad:'Atlanta', equipo1:'Marruecos', equipo2:'Haití', fase:'Primera fase', grupo:'C' },
  { id:'m51', fecha:'2026-06-24', hora:'12:00', utc:'2026-06-24T19:00:00Z', estadio:'Estadio BC Place Vancouver', ciudad:'Vancouver', equipo1:'Suiza', equipo2:'Canadá', fase:'Primera fase', grupo:'B' },
  { id:'m52', fecha:'2026-06-24', hora:'12:00', utc:'2026-06-24T19:00:00Z', estadio:'Estadio de Seattle', ciudad:'Seattle', equipo1:'Bosnia y Herzegovina', equipo2:'Catar', fase:'Primera fase', grupo:'B' },
  { id:'m53', fecha:'2026-06-24', hora:'19:00', utc:'2026-06-25T01:00:00Z', estadio:'Estadio Ciudad de México', ciudad:'Ciudad de México', equipo1:'Chequia', equipo2:'México', fase:'Primera fase', grupo:'A', broadcasters:'TUDN · Canal 5 · Azteca 7 · ViX', streaming:'https://vix.com', broadcastConfirmed:true },
  { id:'m54', fecha:'2026-06-24', hora:'19:00', utc:'2026-06-25T01:00:00Z', estadio:'Estadio Monterrey', ciudad:'Monterrey', equipo1:'Sudáfrica', equipo2:'República de Corea', fase:'Primera fase', grupo:'A', broadcasters:'TUDN · Canal 5 · Azteca 7 · ViX', streaming:'https://vix.com', broadcastConfirmed:true },
  { id:'m55', fecha:'2026-06-25', hora:'16:00', utc:'2026-06-25T20:00:00Z', estadio:'Estadio Filadelfia', ciudad:'Filadelfia', equipo1:'Curazao', equipo2:'Costa de Marfil', fase:'Primera fase', grupo:'E' },
  { id:'m56', fecha:'2026-06-25', hora:'16:00', utc:'2026-06-25T20:00:00Z', estadio:'Estadio Nueva York/Nueva Jersey', ciudad:'Nueva Jersey', equipo1:'Ecuador', equipo2:'Alemania', fase:'Primera fase', grupo:'E' },
  { id:'m57', fecha:'2026-06-25', hora:'18:00', utc:'2026-06-25T23:00:00Z', estadio:'Estadio Dallas', ciudad:'Dallas', equipo1:'Japón', equipo2:'Suecia', fase:'Primera fase', grupo:'F' },
  { id:'m58', fecha:'2026-06-25', hora:'18:00', utc:'2026-06-25T23:00:00Z', estadio:'Estadio Kansas City', ciudad:'Kansas City', equipo1:'Túnez', equipo2:'Países Bajos', fase:'Primera fase', grupo:'F' },
  { id:'m59', fecha:'2026-06-25', hora:'19:00', utc:'2026-06-26T02:00:00Z', estadio:'Estadio Los Angeles', ciudad:'Los Ángeles', equipo1:'Turquía', equipo2:'EE. UU.', fase:'Primera fase', grupo:'D' },
  { id:'m60', fecha:'2026-06-25', hora:'19:00', utc:'2026-06-26T02:00:00Z', estadio:'Estadio de la Bahía de San Francisco', ciudad:'Área de la Bahía de San Francisco', equipo1:'Paraguay', equipo2:'Australia', fase:'Primera fase', grupo:'D' },
  { id:'m61', fecha:'2026-06-26', hora:'15:00', utc:'2026-06-26T19:00:00Z', estadio:'Estadio Boston', ciudad:'Boston', equipo1:'Noruega', equipo2:'Francia', fase:'Primera fase', grupo:'I' },
  { id:'m62', fecha:'2026-06-26', hora:'15:00', utc:'2026-06-26T19:00:00Z', estadio:'Estadio de Toronto', ciudad:'Toronto', equipo1:'Senegal', equipo2:'Irak', fase:'Primera fase', grupo:'I' },
  { id:'m63', fecha:'2026-06-26', hora:'20:00', utc:'2026-06-27T03:00:00Z', estadio:'Estadio de Seattle', ciudad:'Seattle', equipo1:'Egipto', equipo2:'RI de Irán', fase:'Primera fase', grupo:'G' },
  { id:'m64', fecha:'2026-06-26', hora:'20:00', utc:'2026-06-27T03:00:00Z', estadio:'Estadio BC Place Vancouver', ciudad:'Vancouver', equipo1:'Nueva Zelanda', equipo2:'Bélgica', fase:'Primera fase', grupo:'G' },
  { id:'m65', fecha:'2026-06-26', hora:'19:00', utc:'2026-06-27T00:00:00Z', estadio:'Estadio Houston', ciudad:'Houston', equipo1:'Islas de Cabo Verde', equipo2:'Arabia Saudí', fase:'Primera fase', grupo:'H' },
  { id:'m66', fecha:'2026-06-26', hora:'18:00', utc:'2026-06-27T00:00:00Z', estadio:'Estadio Guadalajara', ciudad:'Guadalajara', equipo1:'Uruguay', equipo2:'España', fase:'Primera fase', grupo:'H' },
  { id:'m67', fecha:'2026-06-27', hora:'17:00', utc:'2026-06-27T21:00:00Z', estadio:'Estadio Nueva York/Nueva Jersey', ciudad:'Nueva Jersey', equipo1:'Panamá', equipo2:'Inglaterra', fase:'Primera fase', grupo:'L' },
  { id:'m68', fecha:'2026-06-27', hora:'17:00', utc:'2026-06-27T21:00:00Z', estadio:'Estadio Filadelfia', ciudad:'Filadelfia', equipo1:'Croacia', equipo2:'Ghana', fase:'Primera fase', grupo:'L' },
  { id:'m69', fecha:'2026-06-27', hora:'21:00', utc:'2026-06-28T02:00:00Z', estadio:'Estadio Kansas City', ciudad:'Kansas City', equipo1:'Argelia', equipo2:'Austria', fase:'Primera fase', grupo:'J' },
  { id:'m70', fecha:'2026-06-27', hora:'21:00', utc:'2026-06-28T02:00:00Z', estadio:'Estadio Dallas', ciudad:'Dallas', equipo1:'Jordania', equipo2:'Argentina', fase:'Primera fase', grupo:'J' },
  { id:'m71', fecha:'2026-06-27', hora:'19:30', utc:'2026-06-27T23:30:00Z', estadio:'Estadio Miami', ciudad:'Miami', equipo1:'Colombia', equipo2:'Portugal', fase:'Primera fase', grupo:'K' },
  { id:'m72', fecha:'2026-06-27', hora:'19:30', utc:'2026-06-27T23:30:00Z', estadio:'Estadio Atlanta', ciudad:'Atlanta', equipo1:'RD Congo', equipo2:'Uzbekistán', fase:'Primera fase', grupo:'K' },
  { id:'m73', fecha:'2026-06-28', hora:'12:00', utc:'2026-06-28T19:00:00Z', estadio:'Estadio Los Angeles', ciudad:'Los Ángeles', equipo1:'Sudáfrica', equipo2:'Canadá', fase:'Dieciseisavos de final' },
  { id:'m74', fecha:'2026-06-29', hora:'16:30', utc:'2026-06-29T20:30:00Z', estadio:'Estadio Boston', ciudad:'Boston', equipo1:'Alemania', equipo2:'3ABCDF', fase:'Dieciseisavos de final' },
  { id:'m75', fecha:'2026-06-29', hora:'19:00', utc:'2026-06-30T01:00:00Z', estadio:'Estadio Monterrey', ciudad:'Monterrey', equipo1:'Países Bajos', equipo2:'Marruecos', fase:'Dieciseisavos de final' },
  { id:'m76', fecha:'2026-06-29', hora:'12:00', utc:'2026-06-29T17:00:00Z', estadio:'Estadio Houston', ciudad:'Houston', equipo1:'Brasil', equipo2:'Japón', fase:'Dieciseisavos de final' },
  { id:'m77', fecha:'2026-06-30', hora:'17:00', utc:'2026-06-30T21:00:00Z', estadio:'Estadio Nueva York/Nueva Jersey', ciudad:'Nueva Jersey', equipo1:'1I', equipo2:'3CDFGH', fase:'Dieciseisavos de final' },
  { id:'m78', fecha:'2026-06-30', hora:'12:00', utc:'2026-06-30T17:00:00Z', estadio:'Estadio Dallas', ciudad:'Dallas', equipo1:'Costa de Marfil', equipo2:'2I', fase:'Dieciseisavos de final' },
  { id:'m79', fecha:'2026-06-30', hora:'19:00', utc:'2026-07-01T01:00:00Z', estadio:'Estadio Ciudad de México', ciudad:'Ciudad de México', equipo1:'México', equipo2:'3CEFHI', fase:'Dieciseisavos de final' },
  { id:'m80', fecha:'2026-07-01', hora:'12:00', utc:'2026-07-01T16:00:00Z', estadio:'Estadio Atlanta', ciudad:'Atlanta', equipo1:'1L', equipo2:'3EHIJK', fase:'Dieciseisavos de final' },
  { id:'m81', fecha:'2026-07-01', hora:'17:00', utc:'2026-07-02T00:00:00Z', estadio:'Estadio de la Bahía de San Francisco', ciudad:'Área de la Bahía de San Francisco', equipo1:'EE. UU.', equipo2:'Bosnia y Herzegovina', fase:'Dieciseisavos de final' },
  { id:'m82', fecha:'2026-07-01', hora:'13:00', utc:'2026-07-01T20:00:00Z', estadio:'Estadio de Seattle', ciudad:'Seattle', equipo1:'1G', equipo2:'3AEHIJ', fase:'Dieciseisavos de final' },
  { id:'m83', fecha:'2026-07-02', hora:'19:00', utc:'2026-07-02T23:00:00Z', estadio:'Estadio de Toronto', ciudad:'Toronto', equipo1:'2K', equipo2:'2L', fase:'Dieciseisavos de final' },
  { id:'m84', fecha:'2026-07-02', hora:'12:00', utc:'2026-07-02T19:00:00Z', estadio:'Estadio Los Angeles', ciudad:'Los Ángeles', equipo1:'1H', equipo2:'2J', fase:'Dieciseisavos de final' },
  { id:'m85', fecha:'2026-07-02', hora:'20:00', utc:'2026-07-03T03:00:00Z', estadio:'Estadio BC Place Vancouver', ciudad:'Vancouver', equipo1:'Suiza', equipo2:'3EFGIJ', fase:'Dieciseisavos de final' },
  { id:'m86', fecha:'2026-07-03', hora:'18:00', utc:'2026-07-03T22:00:00Z', estadio:'Estadio Miami', ciudad:'Miami', equipo1:'Argentina', equipo2:'2H', fase:'Dieciseisavos de final' },
  { id:'m87', fecha:'2026-07-03', hora:'20:30', utc:'2026-07-04T01:30:00Z', estadio:'Estadio Kansas City', ciudad:'Kansas City', equipo1:'1K', equipo2:'3DEIJL', fase:'Dieciseisavos de final' },
  { id:'m88', fecha:'2026-07-03', hora:'13:00', utc:'2026-07-03T18:00:00Z', estadio:'Estadio Dallas', ciudad:'Dallas', equipo1:'2D', equipo2:'2G', fase:'Dieciseisavos de final' },
  { id:'m89', fecha:'2026-07-04', hora:'17:00', utc:'2026-07-04T21:00:00Z', estadio:'Estadio Filadelfia', ciudad:'Filadelfia', equipo1:'W74', equipo2:'W77', fase:'Octavos de final' },
  { id:'m90', fecha:'2026-07-04', hora:'12:00', utc:'2026-07-04T17:00:00Z', estadio:'Estadio Houston', ciudad:'Houston', equipo1:'W73', equipo2:'W75', fase:'Octavos de final' },
  { id:'m91', fecha:'2026-07-05', hora:'16:00', utc:'2026-07-05T20:00:00Z', estadio:'Estadio Nueva York/Nueva Jersey', ciudad:'Nueva Jersey', equipo1:'W76', equipo2:'W78', fase:'Octavos de final' },
  { id:'m92', fecha:'2026-07-05', hora:'18:00', utc:'2026-07-06T00:00:00Z', estadio:'Estadio Ciudad de México', ciudad:'Ciudad de México', equipo1:'W79', equipo2:'W80', fase:'Octavos de final' },
  { id:'m93', fecha:'2026-07-06', hora:'14:00', utc:'2026-07-06T19:00:00Z', estadio:'Estadio Dallas', ciudad:'Dallas', equipo1:'W83', equipo2:'W84', fase:'Octavos de final' },
  { id:'m94', fecha:'2026-07-06', hora:'17:00', utc:'2026-07-07T00:00:00Z', estadio:'Estadio de Seattle', ciudad:'Seattle', equipo1:'W81', equipo2:'W82', fase:'Octavos de final' },
  { id:'m95', fecha:'2026-07-07', hora:'12:00', utc:'2026-07-07T16:00:00Z', estadio:'Estadio Atlanta', ciudad:'Atlanta', equipo1:'W86', equipo2:'W88', fase:'Octavos de final' },
  { id:'m96', fecha:'2026-07-07', hora:'13:00', utc:'2026-07-07T20:00:00Z', estadio:'Estadio BC Place Vancouver', ciudad:'Vancouver', equipo1:'W85', equipo2:'W87', fase:'Octavos de final' },
  { id:'m97', fecha:'2026-07-09', hora:'16:00', utc:'2026-07-09T20:00:00Z', estadio:'Estadio Boston', ciudad:'Boston', equipo1:'W89', equipo2:'W90', fase:'Cuartos de final' },
  { id:'m98', fecha:'2026-07-10', hora:'12:00', utc:'2026-07-10T19:00:00Z', estadio:'Estadio Los Angeles', ciudad:'Los Ángeles', equipo1:'W93', equipo2:'W94', fase:'Cuartos de final' },
  { id:'m99', fecha:'2026-07-11', hora:'17:00', utc:'2026-07-11T21:00:00Z', estadio:'Estadio Miami', ciudad:'Miami', equipo1:'W91', equipo2:'W92', fase:'Cuartos de final' },
  { id:'m100', fecha:'2026-07-11', hora:'20:00', utc:'2026-07-12T01:00:00Z', estadio:'Estadio Kansas City', ciudad:'Kansas City', equipo1:'W95', equipo2:'W96', fase:'Cuartos de final' },
  { id:'m101', fecha:'2026-07-14', hora:'14:00', utc:'2026-07-14T19:00:00Z', estadio:'Estadio Dallas', ciudad:'Dallas', equipo1:'W97', equipo2:'W98', fase:'Semifinal' },
  { id:'m102', fecha:'2026-07-15', hora:'15:00', utc:'2026-07-15T19:00:00Z', estadio:'Estadio Atlanta', ciudad:'Atlanta', equipo1:'W99', equipo2:'W100', fase:'Semifinal' },
  { id:'m103', fecha:'2026-07-18', hora:'17:00', utc:'2026-07-18T21:00:00Z', estadio:'Estadio Miami', ciudad:'Miami', equipo1:'RU101', equipo2:'RU102', fase:'Partido por el tercer puesto' },
  { id:'m104', fecha:'2026-07-19', hora:'15:00', utc:'2026-07-19T19:00:00Z', estadio:'Estadio Nueva York/Nueva Jersey', ciudad:'Nueva Jersey', equipo1:'W101', equipo2:'W102', fase:'Final', broadcasters:'TUDN · Canal 5 · Azteca 7 · ViX · Telemundo · Fox Sports', streaming:'https://vix.com', broadcastNotes:'Gran Final', broadcastConfirmed:true },
];

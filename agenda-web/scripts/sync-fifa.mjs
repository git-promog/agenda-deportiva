#!/usr/bin/env node
/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  SYNC FIFA 2026 — Script de sincronización con la API oficial   ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║  Uso:  npm run sync-fifa                                         ║
 * ║                                                                  ║
 * ║  Este script:                                                    ║
 * ║  1. Descarga los 104 partidos de api.fifa.com                    ║
 * ║  2. Lee los overrides manuales de broadcasters-overrides.json    ║
 * ║  3. Regenera src/data/mundialData.ts con datos oficiales         ║
 * ║                                                                  ║
 * ║  ⚠️  NUNCA sobreescribe broadcasters-overrides.json              ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const ROOT       = join(__dirname, '..');

// ── Config ────────────────────────────────────────────────────────────────
const FIFA_API_URL =
  'https://api.fifa.com/api/v3/calendar/matches?language=es&count=500&idSeason=285023';

const OVERRIDES_PATH = join(__dirname, 'broadcasters-overrides.json');
const OUTPUT_PATH    = join(ROOT, 'src/data/mundialData.ts');

// ── UTC offsets por estadio en verano 2026 (DST aplicado) ────────────────
// México (sin DST): UTC-6 | US Eastern-verano: UTC-4 | US Central-verano: UTC-5
// US Mountain-verano: UTC-6 | US Pacific-verano: UTC-7 | Canadá Eastern-verano: UTC-4
const STADIUM_UTC_OFFSETS = {
  'Estadio Ciudad de México':              -6,
  'Estadio Guadalajara':                   -6,
  'Estadio Monterrey':                     -6,
  'Estadio de Toronto':                    -4,
  'Estadio BC Place Vancouver':            -7,
  'Estadio Nueva York/Nueva Jersey':       -4,
  'Estadio Los Angeles':                   -7,
  'Estadio Atlanta':                       -4,
  'Estadio Dallas':                        -5,
  'Estadio Houston':                       -5,
  'Estadio Miami':                         -4,
  'Estadio Boston':                        -4,
  'Estadio Filadelfia':                    -4,
  'Estadio Kansas City':                   -5,
  'Estadio de la Bahía de San Francisco':  -7,
  'Estadio de Seattle':                    -7,
};

// ── Helpers ───────────────────────────────────────────────────────────────
function getField(arr, fallback = '') {
  return arr && arr.length > 0 ? arr[0].Description : fallback;
}

function getScore(val) {
  if (val === null || val === undefined) return null;
  if (typeof val === 'number') return val;
  if (typeof val === 'string') return parseInt(val, 10) || null;
  if (Array.isArray(val) && val.length > 0) return parseInt(val[0].Description, 10) || null;
  return null;
}

function buildMatchId(num) {
  return `m${num}`;
}

/**
 * Convierte LocalDate de la API (hora local de la sede) a UTC ISO.
 * La API ya nos da LocalDate en la hora local, así que calculamos UTC
 * usando el offset conocido de cada estadio.
 */
function localToUtc(localDateStr, stadiumName) {
  if (!localDateStr) return null;
  const offset = STADIUM_UTC_OFFSETS[stadiumName] ?? -6;
  const localMs = new Date(localDateStr).getTime();
  // LocalDate viene con timezone naive — interpretamos como UTC en la fecha
  // y aplicamos el offset inverso para obtener UTC real
  const utcMs = localMs - offset * 3600 * 1000;
  return new Date(utcMs).toISOString();
}

function faseLabel(stageName) {
  const map = {
    'Primera fase':            'Primera fase',
    'Dieciseisavos de final':  'Dieciseisavos de final',
    'Octavos de final':        'Octavos de final',
    'Cuartos de final':        'Cuartos de final',
    'Semifinal':               'Semifinal',
    'Partido por el tercer puesto': 'Partido por el tercer puesto',
    'Final':                   'Final',
  };
  return map[stageName] || stageName;
}

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {
  console.log('📡  Conectando a la API oficial de la FIFA...');
  
  const res  = await fetch(FIFA_API_URL);
  const data = await res.json();
  const results = data.Results || [];
  
  console.log(`✅  Partidos recibidos: ${results.length}`);

  // Leer overrides manuales (nunca se tocan)
  let overrides = {};
  try {
    overrides = JSON.parse(readFileSync(OVERRIDES_PATH, 'utf8'));
    console.log(`📋  Overrides cargados (${Object.keys(overrides).length - 1} partidos con datos manuales)`);
  } catch {
    console.warn('⚠️  No se encontró broadcasters-overrides.json — se usarán campos vacíos.');
  }

  // Ordenar por número de partido
  results.sort((a, b) => (a.MatchNumber || 0) - (b.MatchNumber || 0));

  // Construir array de partidos
  const matchLines = results.map(m => {
    const num        = m.MatchNumber;
    const id         = buildMatchId(num);
    const localDate  = m.LocalDate || '';
    const dateOnly   = localDate.slice(0, 10);
    const timeOnly   = localDate.length > 15 ? localDate.slice(11, 16) : '00:00';
    const utcIso     = m.Date || null;  // UTC from API

    const stadium   = getField(m.Stadium?.Name,     'Por confirmar');
    const city      = getField(m.Stadium?.CityName, 'Por confirmar');
    const stageName = getField(m.StageName,         '');
    const groupName = getField(m.GroupName,         '');
    const fase      = faseLabel(stageName);

    const homeTeam  = getField(m.Home?.TeamName,    '');
    const awayTeam  = getField(m.Away?.TeamName,    '');
    const phA       = m.PlaceHolderA || 'TBD';
    const phB       = m.PlaceHolderB || 'TBD';
    const equipo1   = homeTeam || phA;
    const equipo2   = awayTeam || phB;

    const goles1 = getScore(m.Home?.Score);
    const goles2 = getScore(m.Away?.Score);

    const ov = overrides[id] || {};
    const broadcasters = ov.broadcasters ? `'${ov.broadcasters.replace(/'/g, "\\'")}'` : 'undefined';
    const streaming = ov.streaming ? `'${ov.streaming.replace(/'/g, "\\'")}'` : 'undefined';
    const broadcastNotes = ov.notes ? `'${ov.notes.replace(/'/g, "\\'")}'` : 'undefined';
    const broadcastConfirmed = ov.confirmed === true;

    const grupoField = groupName ? `, grupo:'${groupName.replace('Grupo ', '')}'` : '';
    const bcField    = ov.broadcasters ? `, broadcasters:${broadcasters}` : '';
    const stField    = ov.streaming ? `, streaming:${streaming}` : '';
    const ntField    = ov.notes ? `, broadcastNotes:${broadcastNotes}` : '';
    const cfField    = broadcastConfirmed ? `, broadcastConfirmed:true` : '';
    const utcField   = utcIso ? `, utc:'${utcIso}'` : '';
    const goles1Field = goles1 !== null ? `, goles1:${goles1}` : '';
    const goles2Field = goles2 !== null ? `, goles2:${goles2}` : '';

    return `  { id:'${id}', fecha:'${dateOnly}', hora:'${timeOnly}'${utcField}, estadio:'${stadium}', ciudad:'${city}', equipo1:'${equipo1.replace(/'/g, "\\'")}', equipo2:'${equipo2.replace(/'/g, "\\'")}', fase:'${fase}'${grupoField}${goles1Field}${goles2Field}${bcField}${stField}${ntField}${cfField} },`;
  });

  // ── Calcular standings de grupos ────────────────────────────────────────
  function calculateGroupStandings(matches) {
    const groupOrder = ['A','B','C','D','E','F','G','H','I','J','K','L'];
    const baseTeams = {
      'A': ['México', 'Sudáfrica', 'República de Corea', 'Chequia'],
      'B': ['Canadá', 'Bosnia y Herzegovina', 'Catar', 'Suiza'],
      'C': ['Brasil', 'Marruecos', 'Haití', 'Escocia'],
      'D': ['EE. UU.', 'Paraguay', 'Australia', 'Turquía'],
      'E': ['Alemania', 'Curazao', 'Costa de Marfil', 'Ecuador'],
      'F': ['Países Bajos', 'Japón', 'Suecia', 'Túnez'],
      'G': ['Bélgica', 'Egipto', 'RI de Irán', 'Nueva Zelanda'],
      'H': ['España', 'Islas de Cabo Verde', 'Arabia Saudí', 'Uruguay'],
      'I': ['Francia', 'Senegal', 'Irak', 'Noruega'],
      'J': ['Argentina', 'Argelia', 'Austria', 'Jordania'],
      'K': ['Portugal', 'RD Congo', 'Uzbekistán', 'Colombia'],
      'L': ['Inglaterra', 'Croacia', 'Ghana', 'Panamá'],
    };

    return groupOrder.map(g => {
      const teams = baseTeams[g] || [];
      const teamStats = teams.map(nombre => {
        const teamMatches = matches.filter(m => 
          m.grupo === g && 
          (m.equipo1 === nombre || m.equipo2 === nombre) && 
          m.goles1 !== null && m.goles2 !== null
        );

        let pj = 0, pg = 0, pe = 0, pp = 0, gf = 0, gc = 0, pts = 0;

        for (const m of teamMatches) {
          const isHome = m.equipo1 === nombre;
          const gfMatch = isHome ? m.goles1 : m.goles2;
          const gcMatch = isHome ? m.goles2 : m.goles1;

          pj++;
          gf += gfMatch;
          gc += gcMatch;

          if (gfMatch > gcMatch) { pg++; pts += 3; }
          else if (gfMatch === gcMatch) { pe++; pts += 1; }
          else { pp++; }
        }

        return { nombre, pj, pg, pe, pp, gf, gc, pts };
      });

      teamStats.sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        const dgA = a.gf - a.gc;
        const dgB = b.gf - b.gc;
        if (dgB !== dgA) return dgB - dgA;
        if (b.gf !== a.gf) return b.gf - a.gf;
        return 0;
      });

      return { nombre: g, equipos: teamStats };
    });
  }

  // Construir objeto de matches con goles para el cálculo
  const matchesWithScores = results.map(m => {
    const num = m.MatchNumber;
    const groupName = getField(m.GroupName, '');
    const homeTeam = getField(m.Home?.TeamName, '');
    const awayTeam = getField(m.Away?.TeamName, '');
    const phA = m.PlaceHolderA || 'TBD';
    const phB = m.PlaceHolderB || 'TBD';
    const equipo1 = homeTeam || phA;
    const equipo2 = awayTeam || phB;
    const goles1 = getScore(m.Home?.Score);
    const goles2 = getScore(m.Away?.Score);
    const stageName = getField(m.StageName, '');
    const fase = faseLabel(stageName);

    return {
      id: buildMatchId(num),
      grupo: groupName ? groupName.replace('Grupo ', '') : undefined,
      equipo1,
      equipo2,
      goles1,
      goles2,
      fase,
    };
  });

  const gruposCalculados = calculateGroupStandings(matchesWithScores);

  // Generar string del array GRUPOS
  const gruposLines = gruposCalculados.map(g => {
    const equiposStr = g.equipos.map(e => 
      `{nombre:'${e.nombre}',pj:${e.pj},pg:${e.pg},pe:${e.pe},pp:${e.pp},gf:${e.gf},gc:${e.gc},pts:${e.pts}}`
    ).join(',');
    return `  { nombre:'${g.nombre}', equipos:[${equiposStr}] },`;
  });

  const gruposTs = `export const GRUPOS: WCGroup[] = [
${gruposLines.join('\n')}
];`;

  // ── Construir el archivo ──────────────────────────────────────────────
  const ts = `// ╔═══════════════════════════════════════════════════════════════╗
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
  goles1?: number;
  goles2?: number;
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
  return code ? \`https://flagcdn.com/w80/\${code}.png\` : null;
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

${gruposTs}

// Generado automáticamente — ${new Date().toISOString()}
export const MATCHES: WCMatch[] = [
${matchLines.join('\n')}
];
`;

  writeFileSync(OUTPUT_PATH, ts, 'utf8');
  console.log(`\n🎉  mundialData.ts actualizado con ${results.length} partidos reales.`);
  console.log(`📁  Archivo: ${OUTPUT_PATH}`);
  console.log(`📋  Overrides manuales preservados: ${Object.keys(overrides).filter(k => k !== '_README').length} partidos`);
}

main().catch(err => {
  console.error('❌  Error al sincronizar:', err);
  process.exit(1);
});

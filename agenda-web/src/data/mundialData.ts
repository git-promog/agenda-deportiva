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
}

export interface WCGroup {
  nombre: string;
  equipos: { nombre: string; pts: number; pj: number; pg: number; pe: number; pp: number; gf: number; gc: number }[];
}

export const SEDES: WCVenue[] = [
  { id: 'azteca', ciudad: 'Ciudad de México', pais: 'México', estadio: 'Estadio Azteca', capacidad: '87,523', imagen: '🏟️', detalles: 'Sede del partido inaugural (11 de junio).' },
  { id: 'akron', ciudad: 'Guadalajara', pais: 'México', estadio: 'Estadio Akron', capacidad: '49,850', imagen: '🏟️', detalles: 'Sede de fase de grupos.' },
  { id: 'bbva', ciudad: 'Monterrey', pais: 'México', estadio: 'Estadio BBVA', capacidad: '53,500', imagen: '🏟️', detalles: 'Sede de fase de grupos y dieciseisavos.' },
  { id: 'metlife', ciudad: 'New York/NJ', pais: 'USA', estadio: 'MetLife Stadium', capacidad: '82,500', imagen: '🏟️', detalles: 'Sede de la Gran Final (19 de julio).' },
  { id: 'sofi', ciudad: 'Los Ángeles', pais: 'USA', estadio: 'SoFi Stadium', capacidad: '70,240', imagen: '🏟️', detalles: 'Primer partido de USA (12 de junio).' },
  { id: 'mercedes', ciudad: 'Atlanta', pais: 'USA', estadio: 'Mercedes-Benz Stadium', capacidad: '71,000', imagen: '🏟️', detalles: 'Sede de semifinales.' },
  { id: 'nrg', ciudad: 'Houston', pais: 'USA', estadio: 'NRG Stadium', capacidad: '72,220', imagen: '🏟️', detalles: 'Sede de cuartos de final.' },
  { id: 'hardrock', ciudad: 'Miami', pais: 'USA', estadio: 'Hard Rock Stadium', capacidad: '64,767', imagen: '🏟️', detalles: 'Sede del partido por el tercer lugar.' },
  { id: 'vancouver', ciudad: 'Vancouver', pais: 'Canadá', estadio: 'BC Place', capacidad: '54,500', imagen: '🏟️', detalles: 'Sede de fase de grupos.' },
  { id: 'toronto', ciudad: 'Toronto', pais: 'Canadá', estadio: 'BMO Field', capacidad: '45,736', imagen: '🏟️', detalles: 'Primer partido de Canadá (12 de junio).' },
];

export const GRUPOS: WCGroup[] = [
  { nombre: 'A', equipos: [{ nombre: 'México', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }, { nombre: 'Sudáfrica', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }, { nombre: 'R. de Corea', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }, { nombre: 'Chequia', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }] },
  { nombre: 'B', equipos: [{ nombre: 'Canadá', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }, { nombre: 'Bosnia', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }, { nombre: 'Catar', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }, { nombre: 'Suiza', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }] },
  { nombre: 'C', equipos: [{ nombre: 'Brasil', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }, { nombre: 'Marruecos', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }, { nombre: 'Haití', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }, { nombre: 'Escocia', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }] },
  { nombre: 'D', equipos: [{ nombre: 'USA', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }, { nombre: 'Paraguay', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }, { nombre: 'Australia', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }, { nombre: 'Turquía', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }] },
  { nombre: 'E', equipos: [{ nombre: 'Alemania', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }, { nombre: 'Curazao', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }, { nombre: 'C. de Marfil', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }, { nombre: 'Ecuador', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }] },
  { nombre: 'F', equipos: [{ nombre: 'Países Bajos', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }, { nombre: 'Japón', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }, { nombre: 'Suecia', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }, { nombre: 'Túnez', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }] },
  { nombre: 'G', equipos: [{ nombre: 'Bélgica', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }, { nombre: 'Egipto', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }, { nombre: 'Irán', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }, { nombre: 'N. Zelanda', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }] },
  { nombre: 'H', equipos: [{ nombre: 'España', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }, { nombre: 'Cabo Verde', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }, { nombre: 'Ar. Saudí', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }, { nombre: 'Uruguay', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }] },
  { nombre: 'I', equipos: [{ nombre: 'Francia', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }, { nombre: 'Senegal', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }, { nombre: 'Irak', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }, { nombre: 'Noruega', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }] },
  { nombre: 'J', equipos: [{ nombre: 'Argentina', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }, { nombre: 'Argelia', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }, { nombre: 'Austria', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }, { nombre: 'Jordania', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }] },
  { nombre: 'K', equipos: [{ nombre: 'Portugal', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }, { nombre: 'RD Congo', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }, { nombre: 'Uzbekistán', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }, { nombre: 'Colombia', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }] },
  { nombre: 'L', equipos: [{ nombre: 'Inglaterra', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }, { nombre: 'Croacia', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }, { nombre: 'Ghana', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }, { nombre: 'Panamá', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }] },
];

export const MATCHES: WCMatch[] = [
  // FASE DE GRUPOS - RONDA 1
  { id: 'm1', fecha: '2026-06-11', hora: '13:00', estadio: 'Estadio Azteca', ciudad: 'CDMX', equipo1: 'México', equipo2: 'Sudáfrica', fase: 'Inaugural', grupo: 'A' },
  { id: 'm2', fecha: '2026-06-11', hora: '17:00', estadio: 'Estadio Akron', ciudad: 'Guadalajara', equipo1: 'R. de Corea', equipo2: 'Chequia', fase: 'Fase de Grupos', grupo: 'A' },
  { id: 'm3', fecha: '2026-06-12', hora: '18:00', estadio: 'BMO Field', ciudad: 'Toronto', equipo1: 'Canadá', equipo2: 'Bosnia', fase: 'Fase de Grupos', grupo: 'B' },
  { id: 'm4', fecha: '2026-06-12', hora: '19:00', estadio: 'SoFi Stadium', ciudad: 'Los Ángeles', equipo1: 'USA', equipo2: 'Paraguay', fase: 'Fase de Grupos', grupo: 'D' },
  { id: 'm5', fecha: '2026-06-13', hora: '13:00', estadio: 'BC Place', ciudad: 'Vancouver', equipo1: 'Catar', equipo2: 'Suiza', fase: 'Fase de Grupos', grupo: 'B' },
  { id: 'm6', fecha: '2026-06-13', hora: '16:00', estadio: 'MetLife Stadium', ciudad: 'NJ', equipo1: 'Brasil', equipo2: 'Marruecos', fase: 'Fase de Grupos', grupo: 'C' },
  { id: 'm7', fecha: '2026-06-13', hora: '19:00', estadio: 'Gillette Stadium', ciudad: 'Boston', equipo1: 'Haití', equipo2: 'Escocia', fase: 'Fase de Grupos', grupo: 'C' },
  { id: 'm8', fecha: '2026-06-13', hora: '20:00', estadio: 'Lumen Field', ciudad: 'Seattle', equipo1: 'Australia', equipo2: 'Turquía', fase: 'Fase de Grupos', grupo: 'D' },
  { id: 'm9', fecha: '2026-06-14', hora: '13:00', estadio: 'Lincoln Financial', ciudad: 'Filadelfia', equipo1: 'Alemania', equipo2: 'Curazao', fase: 'Fase de Grupos', grupo: 'E' },
  { id: 'm10', fecha: '2026-06-14', hora: '18:00', estadio: 'Estadio BBVA', ciudad: 'Monterrey', equipo1: 'C. de Marfil', equipo2: 'Ecuador', fase: 'Fase de Grupos', grupo: 'E' },
  { id: 'm11', fecha: '2026-06-14', hora: '19:00', estadio: 'NRG Stadium', ciudad: 'Houston', equipo1: 'Países Bajos', equipo2: 'Japón', fase: 'Fase de Grupos', grupo: 'F' },
  { id: 'm12', fecha: '2026-06-14', hora: '20:00', estadio: 'Levi\'s Stadium', ciudad: 'San Francisco', equipo1: 'Suecia', equipo2: 'Túnez', fase: 'Fase de Grupos', grupo: 'F' },
  { id: 'm13', fecha: '2026-06-15', hora: '13:00', estadio: 'Arrowhead Stadium', ciudad: 'Kansas', equipo1: 'Bélgica', equipo2: 'Egipto', fase: 'Fase de Grupos', grupo: 'G' },
  { id: 'm14', fecha: '2026-06-15', hora: '16:00', estadio: 'AT&T Stadium', ciudad: 'Dallas', equipo1: 'Irán', equipo2: 'N. Zelanda', fase: 'Fase de Grupos', grupo: 'G' },
  { id: 'm15', fecha: '2026-06-15', hora: '19:00', estadio: 'Mercedes-Benz', ciudad: 'Atlanta', equipo1: 'España', equipo2: 'Cabo Verde', fase: 'Fase de Grupos', grupo: 'H' },
  { id: 'm16', fecha: '2026-06-15', hora: '20:00', estadio: 'SoFi Stadium', ciudad: 'Los Ángeles', equipo1: 'Ar. Saudí', equipo2: 'Uruguay', fase: 'Fase de Grupos', grupo: 'H' },
  { id: 'm17', fecha: '2026-06-16', hora: '13:00', estadio: 'MetLife Stadium', ciudad: 'NJ', equipo1: 'Francia', equipo2: 'Senegal', fase: 'Fase de Grupos', grupo: 'I' },
  { id: 'm18', fecha: '2026-06-16', hora: '16:00', estadio: 'Lumen Field', ciudad: 'Seattle', equipo1: 'Irak', equipo2: 'Noruega', fase: 'Fase de Grupos', grupo: 'I' },
  { id: 'm19', fecha: '2026-06-16', hora: '19:00', estadio: 'Gillette Stadium', ciudad: 'Boston', equipo1: 'Argentina', equipo2: 'Argelia', fase: 'Fase de Grupos', grupo: 'J' },
  { id: 'm20', fecha: '2026-06-16', hora: '20:00', estadio: 'NRG Stadium', ciudad: 'Houston', equipo1: 'Austria', equipo2: 'Jordania', fase: 'Fase de Grupos', grupo: 'J' },
  { id: 'm21', fecha: '2026-06-17', hora: '13:00', estadio: 'BMO Field', ciudad: 'Toronto', equipo1: 'Portugal', equipo2: 'RD Congo', fase: 'Fase de Grupos', grupo: 'K' },
  { id: 'm22', fecha: '2026-06-17', hora: '16:00', estadio: 'Arrowhead Stadium', ciudad: 'Kansas', equipo1: 'Uzbekistán', equipo2: 'Colombia', fase: 'Fase de Grupos', grupo: 'K' },
  { id: 'm23', fecha: '2026-06-17', hora: '17:00', estadio: 'BC Place', ciudad: 'Vancouver', equipo1: 'Inglaterra', equipo2: 'Croacia', fase: 'Fase de Grupos', grupo: 'L' },
  { id: 'm24', fecha: '2026-06-17', hora: '19:00', estadio: 'Estadio Azteca', ciudad: 'CDMX', equipo1: 'Ghana', equipo2: 'Panamá', fase: 'Fase de Grupos', grupo: 'L' },

  // RONDA 2 Y POSTERIORES (SELECCIÓN DE CLAVES)
  { id: 'm28', fecha: '2026-06-18', hora: '19:00', estadio: 'Estadio Akron', ciudad: 'Guadalajara', equipo1: 'México', equipo2: 'R. de Corea', fase: 'Fase de Grupos', grupo: 'A' },
  { id: 'm53', fecha: '2026-06-24', hora: '19:00', estadio: 'Estadio Azteca', ciudad: 'CDMX', equipo1: 'México', equipo2: 'Chequia', fase: 'Fase de Grupos', grupo: 'A' },
  { id: 'm54', fecha: '2026-06-24', hora: '18:00', estadio: 'Estadio BBVA', ciudad: 'Monterrey', equipo1: 'TBD', equipo2: 'TBD', fase: 'Fase de Grupos' },
  { id: 'm66', fecha: '2026-06-26', hora: '18:00', estadio: 'Estadio Akron', ciudad: 'Guadalajara', equipo1: 'TBD', equipo2: 'TBD', fase: 'Fase de Grupos' },
  
  // PARTIDOS 73-104 (SIMULADOS PARA LOGICA)
  ...Array.from({ length: 32 }, (_, i) => ({
    id: `m${73 + i}`,
    fecha: i < 16 ? '2026-06-29' : (i < 24 ? '2026-07-04' : (i < 28 ? '2026-07-09' : (i < 30 ? '2026-07-14' : '2026-07-19'))),
    hora: '18:00',
    estadio: i === 31 ? 'MetLife Stadium' : 'TBD Stadium',
    ciudad: i === 31 ? 'NJ' : 'Sede TBD',
    equipo1: 'TBD',
    equipo2: 'TBD',
    fase: i < 16 ? 'Dieciseisavos' : (i < 24 ? 'Octavos' : (i < 28 ? 'Cuartos' : (i < 30 ? 'Semis' : (i === 30 ? '3er Lugar' : 'Gran Final'))))
  }))
];

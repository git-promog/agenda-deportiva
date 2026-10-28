import { Evento } from '@/types';
import { CANALES_CATALOGO, isTvAbierta, matchChannels } from './channelCatalog';

/**
 * Normaliza una cadena removiendo acentos/diacríticos y convirtiendo a minúsculas.
 */
export function normalizeSearchText(str: string | null | undefined): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Mapa de sinónimos y alias deportivos comunes en el mercado mexicano.
 */
const ALIAS_MAP: Record<string, string[]> = {
  america: ['club america', 'america vs', 'america femenil', 'aguilas del america'],
  chivas: ['guadalajara', 'chivas', 'chivas rayadas', 'rebano sagrado'],
  cruzazul: ['cruz azul', 'la maquina'],
  pumas: ['pumas', 'unam', 'pumas unam'],
  tigres: ['tigres', 'tigres uanl'],
  rayados: ['monterrey', 'rayados'],
  seleccion: ['mexico', 'seleccion mexicana', 'el tri', 'tri'],
  f1: ['formula 1', 'formula1', 'gran premio', 'gp', 'checo perez', 'checo', 'red bull'],
  nfl: ['futbol americano', 'nfl', 'super bowl', 'superbowl'],
  nba: ['basquetbol', 'nba', 'basketball'],
  mlb: ['beisbol', 'mlb', 'diablos rojos', 'liga mexicana de beisbol'],
};

const STOPWORDS = new Set([
  'a', 'al', 'algo', 'and', 'con', 'de', 'del', 'el', 'en', 'la', 'las',
  'los', 'o', 'of', 'para', 'por', 'sin', 'the', 'un', 'una', 'unas', 'unos',
  'v', 'vs', 'y',
]);

const MIN_PARTIAL_LENGTH = 3;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function containsWholeWord(text: string, term: string): boolean {
  if (!text || !term) return false;
  if (text === term) return true;
  return new RegExp(`(^|[^a-z0-9])${escapeRegExp(term)}([^a-z0-9]|$)`).test(text);
}

function matchesField(text: string, query: string, allowPartial: boolean): boolean {
  if (!text || !query) return false;
  return allowPartial ? text.includes(query) : containsWholeWord(text, query);
}

/**
 * Motor de Búsqueda Universal Deportivo con Scoring y Relevancia Inteligente.
 */
export function searchEvents(eventos: Evento[], query: string): Evento[] {
  const cleanQuery = normalizeSearchText(query);
  if (!cleanQuery) return eventos;

  const tokens = cleanQuery.split(/\s+/).filter(Boolean);
  if (tokens.every((token) => STOPWORDS.has(token))) return [];

  const allowPartial = cleanQuery.length >= MIN_PARTIAL_LENGTH;
  const isAmericaQuery = cleanQuery === 'america';

  const isAmericanFalsePositive = (value: string) =>
    isAmericaQuery && /\bamerican\b/.test(value);

  // Evaluar si la búsqueda pide "TV Abierta"
  const isTvAbiertaQuery =
    cleanQuery === 'tv abierta' ||
    cleanQuery === 'abierta' ||
    cleanQuery === 'television abierta' ||
    cleanQuery === 'canales abiertos';

  // Buscar si la consulta coincide con un canal o plataforma del catálogo
  const matchingCatalogChannels = CANALES_CATALOGO.filter((c) =>
    c.aliases.some((alias) => {
      const normalizedAlias = normalizeSearchText(alias);
      if (normalizedAlias === cleanQuery) return true;
      if (!allowPartial) return containsWholeWord(normalizedAlias, cleanQuery);
      return cleanQuery.includes(normalizedAlias) || normalizedAlias.includes(cleanQuery);
    })
  );

  const scoredEvents: { evento: Evento; score: number }[] = [];

  for (const item of eventos) {
    let score = 0;
    const titleNorm = normalizeSearchText(item.evento);
    const compNorm = normalizeSearchText(item.competicion);
    const sportNorm = normalizeSearchText(item.deporte);
    const channelsNorm = normalizeSearchText(item.canales);
    const localNorm = normalizeSearchText(item.equipo_local);
    const visitNorm = normalizeSearchText(item.equipo_visitante);
    const leagueNorm = normalizeSearchText(item.liga);

    // 1. Caso especial: Filtro implícito de TV Abierta
    if (isTvAbiertaQuery) {
      if (isTvAbierta(item.canales) || item.tv_abierta === true) {
        score += 100;
      }
    }

    // 2. Coincidencia por canal o plataforma catalogada (ej. "Apple TV", "ViX", "ESPN")
    if (matchingCatalogChannels.length > 0 && containsWholeWord(channelsNorm, cleanQuery)) {
      const eventChannels = matchChannels(item.canales);
      const hasMatchedChannel = eventChannels.some((ec) =>
        matchingCatalogChannels.some((mc) => mc.id === ec.id || mc.plataforma === ec.plataforma)
      );
      if (hasMatchedChannel) {
        score += 85;
      }
    }

    // 3. Caso especial de desambiguación para "América"
    if (cleanQuery === 'america') {
      if (titleNorm.includes('club america') || titleNorm.includes('america vs') || localNorm.includes('america') || visitNorm.includes('america')) {
        score += 100;
      } else if (titleNorm.includes('america del sud')) {
        score += 15; // Coincidencia secundaria con menor peso
      }
    }

    // 4. Coincidencia en Titulo de Evento / Equipos
    if (matchesField(titleNorm, cleanQuery, allowPartial) && !isAmericanFalsePositive(titleNorm)) {
      if (titleNorm === cleanQuery) score += 100;
      else if (titleNorm.startsWith(cleanQuery)) score += 80;
      else score += 50;
    }

    if (matchesField(localNorm, cleanQuery, allowPartial) || matchesField(visitNorm, cleanQuery, allowPartial)) {
      score += 90;
    }

    // 5. Coincidencia en Competición / Liga
    const competitionMatches =
      matchesField(compNorm, cleanQuery, allowPartial) ||
      matchesField(leagueNorm, cleanQuery, allowPartial);
    if (competitionMatches && !isAmericanFalsePositive(compNorm) && !isAmericanFalsePositive(leagueNorm)) {
      if (compNorm === cleanQuery) score += 70;
      else score += 40;
    }

    // 6. Coincidencia en Deporte
    if (matchesField(sportNorm, cleanQuery, allowPartial)) {
      score += 35;
    }

    // 7. Coincidencia en texto crudo de Canales
    if (containsWholeWord(channelsNorm, cleanQuery)) {
      score += 50;
    }

    // 8. Expansión por Alias Deportivo
    for (const [key, aliases] of Object.entries(ALIAS_MAP)) {
      const queryMatchesKey =
        cleanQuery === key ||
        (allowPartial && key.includes(cleanQuery)) ||
        aliases.some((alias) =>
          allowPartial ? alias.includes(cleanQuery) : alias === cleanQuery
        );

      if (queryMatchesKey) {
        for (const alias of aliases) {
          if (
            titleNorm.includes(alias) ||
            compNorm.includes(alias) ||
            sportNorm.includes(alias) ||
            localNorm.includes(alias) ||
            visitNorm.includes(alias)
          ) {
            score += 60;
            break;
          }
        }
      }
    }

    if (score > 0) {
      scoredEvents.push({ evento: item, score });
    }
  }

  // Ordenar por puntaje descendente
  scoredEvents.sort((a, b) => b.score - a.score);

  return scoredEvents.map((se) => se.evento);
}

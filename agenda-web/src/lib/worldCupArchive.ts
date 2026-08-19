import type { WCMatch } from '@/data/mundialData';

export const WORLD_CUP_START_DATE = '2026-06-11T19:00:00Z';
export const WORLD_CUP_END_DATE = '2026-07-19T21:00:00Z';
export const WORLD_CUP_ARCHIVE_LAST_MODIFIED = new Date('2026-08-14T12:00:00-06:00');

export type WorldCupMatchStatus = 'completed' | 'live' | 'today' | 'upcoming';

export function isWorldCupHistorical(referenceDate = new Date()) {
  return referenceDate.getTime() > new Date(WORLD_CUP_END_DATE).getTime();
}

export function getWorldCupMatchStatus(
  match: Pick<WCMatch, 'fecha' | 'hora' | 'utc'>,
  referenceDate = new Date(),
): WorldCupMatchStatus {
  if (isWorldCupHistorical(referenceDate)) return 'completed';

  const start = new Date(match.utc || `${match.fecha}T${match.hora}:00-06:00`).getTime();
  const elapsed = referenceDate.getTime() - start;
  if (elapsed >= 0 && elapsed < 110 * 60 * 1000) return 'live';

  const today = referenceDate.toLocaleDateString('en-CA', {
    timeZone: 'America/Mexico_City',
  });
  return match.fecha === today ? 'today' : start > referenceDate.getTime() ? 'upcoming' : 'completed';
}

export function getWorldCupStartDateTime(match: Pick<WCMatch, 'fecha' | 'hora' | 'utc'>) {
  return match.utc || `${match.fecha}T${match.hora}:00-06:00`;
}

export function getWorldCupEndDateTime(match: Pick<WCMatch, 'fecha' | 'hora' | 'utc'>) {
  const start = new Date(getWorldCupStartDateTime(match));
  if (Number.isNaN(start.getTime())) return `${match.fecha}T23:59:00-06:00`;
  return new Date(start.getTime() + 2 * 60 * 60 * 1000).toISOString();
}

export function getWorldCupBroadcastText(match: Pick<WCMatch, 'broadcasters'>) {
  return match.broadcasters || 'No se registró una fuente histórica de transmisión.';
}

export function getWorldCupResult(match: Pick<WCMatch, 'goles1' | 'goles2'>) {
  if (match.goles1 === undefined || match.goles2 === undefined) {
    return 'Marcador no disponible';
  }
  return `${match.goles1}–${match.goles2}`;
}

export function formatWorldCupDate(fecha: string, options: Intl.DateTimeFormatOptions = {}) {
  return new Date(`${fecha}T12:00:00`).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options,
  });
}

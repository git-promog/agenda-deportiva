/**
 * Utilidades para manejo estandarizado del tiempo y zona horaria de México (America/Mexico_City).
 */

export const MEXICO_TIMEZONE = 'America/Mexico_City';

/**
 * Obtiene la fecha actual formateada en la zona horaria de México (YYYY-MM-DD).
 */
export function getTodayMexicoString(): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: MEXICO_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(new Date());
}

/**
 * Convierte un objeto Date a una representación con la fecha de México.
 */
export function getMexicoDate(date: Date = new Date()): Date {
  const mxTimeString = date.toLocaleString('en-US', { timeZone: MEXICO_TIMEZONE });
  return new Date(mxTimeString);
}

/**
 * Comprueba si un evento está sucediendo "En Vivo" (aproximación basada en hora de inicio y duración estándar de 2 horas).
 */
export function isEventLive(fecha: string, hora: string): boolean {
  if (!fecha || !hora) return false;
  try {
    const today = getTodayMexicoString();
    if (fecha !== today) return false;

    const [hoursStr, minutesStr] = hora.split(':');
    const startHour = parseInt(hoursStr, 10);
    const startMinute = parseInt(minutesStr, 10);

    const now = getMexicoDate();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const startTotalMinutes = startHour * 60 + startMinute;
    const currentTotalMinutes = currentHour * 60 + currentMinute;
    // Consideramos "En vivo" si inició hace no más de 120 minutos y ya comenzó o está por comenzar en 5 min
    const diff = currentTotalMinutes - startTotalMinutes;
    return diff >= -5 && diff <= 125;
  } catch {
    return false;
  }
}

/**
 * Comprueba si una fecha es igual o posterior a "hoy" en hora de México.
 */
export function isUpcomingOrToday(fechaStr: string): boolean {
  if (!fechaStr) return false;
  const todayStr = getTodayMexicoString();
  return fechaStr >= todayStr;
}

/**
 * Formatea una fecha YYYY-MM-DD en español de México según el estilo solicitado.
 */
export function formatMexicoDate(
  fechaStr: string,
  style: 'short' | 'long' | 'button' = 'short'
): string {
  if (!fechaStr) return '';
  const todayStr = getTodayMexicoString();

  if (style === 'button') {
    if (fechaStr === todayStr) return '📍 Hoy';
    const dateObj = new Date(fechaStr + 'T12:00:00');
    if (isNaN(dateObj.getTime())) return fechaStr;
    return dateObj.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric' }).toUpperCase();
  }

  if (style === 'long') {
    if (fechaStr === todayStr) return 'Hoy';
    const dateObj = new Date(fechaStr + 'T12:00:00');
    if (isNaN(dateObj.getTime())) return fechaStr;
    return dateObj.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  // default 'short'
  if (fechaStr === todayStr) return 'Hoy';
  const dateObj = new Date(fechaStr + 'T12:00:00');
  if (isNaN(dateObj.getTime())) return fechaStr;
  return dateObj.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
}

/**
 * Genera un arreglo de fechas consecutivas en formato YYYY-MM-DD comenzando hoy en México.
 */
export function getDateRangeMexico(days: number = 7): string[] {
  const result: string[] = [];
  const base = getMexicoDate();
  for (let i = 0; i < days; i++) {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: MEXICO_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    result.push(formatter.format(d));
  }
  return result;
}


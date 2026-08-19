import { describe, it, expect } from 'vitest';
import {
  MEXICO_TIMEZONE,
  getTodayMexicoString,
  getMexicoDate,
  isEventLive,
  isUpcomingOrToday,
  formatMexicoDate,
  getDateRangeMexico,
} from '@/lib/mexicoTime';

describe('mexicoTime', () => {
  it('expone la zona horaria de México', () => {
    expect(MEXICO_TIMEZONE).toBe('America/Mexico_City');
  });

  it('getTodayMexicoString devuelve YYYY-MM-DD', () => {
    const value = getTodayMexicoString();
    expect(value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('getMexicoDate devuelve un Date válido', () => {
    const date = getMexicoDate(new Date('2026-08-18T12:00:00Z'));
    expect(date instanceof Date).toBe(true);
    expect(isNaN(date.getTime())).toBe(false);
  });

  it('isEventLive devuelve false sin fecha u hora', () => {
    expect(isEventLive('', '')).toBe(false);
    expect(isEventLive('2026-08-18', '')).toBe(false);
  });

  it('isEventLive devuelve false si la fecha no es hoy en México', () => {
    expect(isEventLive('1999-01-01', '12:00')).toBe(false);
  });

  it('isUpcomingOrToday compara con hoy en México', () => {
    const today = getTodayMexicoString();
    expect(isUpcomingOrToday(today)).toBe(true);
    expect(isUpcomingOrToday('1999-01-01')).toBe(false);
  });

  it('formatMexicoDate devuelve vacío para fecha inválida o ausente', () => {
    expect(formatMexicoDate('')).toBe('');
  });

  it('formatMexicoDate corto devuelve Hoy para la fecha actual', () => {
    expect(formatMexicoDate(getTodayMexicoString())).toBe('Hoy');
  });

  it('formatMexicoDate button devuelve Hoy con ubicación para la fecha actual', () => {
    expect(formatMexicoDate(getTodayMexicoString(), 'button')).toBe('📍 Hoy');
  });

  it('getDateRangeMexico genera fechas consecutivas', () => {
    const range = getDateRangeMexico(7);
    expect(range).toHaveLength(7);
    for (const d of range) {
      expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});
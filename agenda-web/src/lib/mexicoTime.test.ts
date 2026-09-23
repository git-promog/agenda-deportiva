import { describe, it, expect } from 'vitest';
import {
  MEXICO_TIMEZONE,
  getTodayMexicoString,
  getMexicoDate,
  isEventLive,
  isEventPast,
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

  it('isEventPast devuelve true si la fecha es anterior a hoy', () => {
    expect(isEventPast('1999-01-01', '12:00')).toBe(true);
  });

  it('isEventPast devuelve false si la fecha es futura', () => {
    expect(isEventPast('2099-01-01', '12:00')).toBe(false);
  });

  it('isEventPast evalúa correctamente eventos de hoy según la hora', () => {
    const today = getTodayMexicoString();
    // Simular referencia a las 20:00 (8:00 PM)
    const mockNow = new Date();
    mockNow.setHours(20, 0, 0, 0);

    // Evento de las 03:00 am (inició hace 17 horas): debe ser pasado
    expect(isEventPast(today, '03:00', mockNow)).toBe(true);

    // Evento de las 11:00 am (inició hace 9 horas): debe ser pasado
    expect(isEventPast(today, '11:00', mockNow)).toBe(true);

    // Evento de las 19:00 hrs (inició hace 60 minutos): en vivo, NO pasado
    expect(isEventPast(today, '19:00', mockNow)).toBe(false);
    expect(isEventLive(today, '19:00', mockNow)).toBe(true);

    // Evento de las 21:00 hrs (inicia en 60 minutos): próximo, NO pasado
    expect(isEventPast(today, '21:00', mockNow)).toBe(false);
    expect(isEventLive(today, '21:00', mockNow)).toBe(false);
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
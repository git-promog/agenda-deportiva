import { describe, expect, it } from 'vitest';
import type { Evento } from '@/types';
import { searchEvents } from '@/lib/eventSearch';

function makeEvent(overrides: Partial<Evento> = {}): Evento {
  return {
    id: 'default',
    fecha: '2026-08-26',
    hora: '20:00',
    evento: 'Evento de prueba',
    competicion: 'Competición de prueba',
    deporte: 'Fútbol',
    canales: 'TUDN',
    ...overrides,
  };
}

describe('searchEvents', () => {
  it('encuentra eventos disponibles en Apple TV', () => {
    const eventos = [
      makeEvent({ id: 'apple', evento: 'Partido MLS', canales: 'Apple TV+' }),
      makeEvent({ id: 'tudn', evento: 'Partido Liga MX', canales: 'TUDN' }),
    ];

    expect(searchEvents(eventos, 'Apple TV').map((evento) => evento.id)).toEqual(['apple']);
  });

  it('devuelve sólo eventos de TV abierta', () => {
    const eventos = [
      makeEvent({ id: 'canal-5', evento: 'Partido por Canal 5', canales: 'Canal 5' }),
      makeEvent({ id: 'tv-flag', evento: 'Partido con señal local', canales: 'Señal local', tv_abierta: true }),
      makeEvent({ id: 'paga', evento: 'Partido de paga', canales: 'ESPN' }),
    ];

    expect(searchEvents(eventos, 'TV abierta').map((evento) => evento.id)).toEqual(['canal-5', 'tv-flag']);
  });

  it('prioriza al Club América y no confunde American con América', () => {
    const eventos = [
      makeEvent({
        id: 'club-america',
        evento: 'América vs Cruz Azul',
        competicion: 'Liga MX',
        equipo_local: 'América',
        equipo_visitante: 'Cruz Azul',
      }),
      makeEvent({
        id: 'central-american',
        evento: 'Central American Cup',
        competicion: 'Central American Cup',
      }),
    ];

    const result = searchEvents(eventos, 'América');

    expect(result[0]?.id).toBe('club-america');
    expect(result.map((evento) => evento.id)).not.toContain('central-american');
  });

  it('encuentra eventos de Chivas por su alias', () => {
    const eventos = [
      makeEvent({ id: 'chivas', evento: 'Chivas vs Atlas', equipo_local: 'Guadalajara' }),
      makeEvent({ id: 'otro', evento: 'Pumas vs Tigres', equipo_local: 'Pumas' }),
    ];

    expect(searchEvents(eventos, 'Chivas').map((evento) => evento.id)).toEqual(['chivas']);
  });

  it('encuentra eventos de Liga MX por competición', () => {
    const eventos = [
      makeEvent({ id: 'liga-mx', evento: 'Jornada de fútbol', competicion: 'Liga MX' }),
      makeEvent({ id: 'premier', evento: 'Jornada de fútbol', competicion: 'Premier League' }),
    ];

    expect(searchEvents(eventos, 'Liga MX').map((evento) => evento.id)).toEqual(['liga-mx']);
  });
});

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import AgendaMatchTicker from './AgendaMatchTicker';
import type { Evento } from '@/types';

afterEach(cleanup);

function makeEvent(overrides: Partial<Evento> = {}): Evento {
  return {
    id: 'evento-1',
    fecha: '2026-11-16',
    hora: '20:00',
    evento: 'América vs Chivas',
    competicion: 'Liga MX',
    deporte: 'Fútbol',
    canales: 'TUDN',
    ...overrides,
  };
}

describe('AgendaMatchTicker', () => {
  it('no renderiza nada sin eventos', () => {
    const { container } = render(
      <AgendaMatchTicker eventos={[]} onEventClick={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('duplica la pista visual y deja la copia fuera del árbol accesible', () => {
    const { container } = render(
      <AgendaMatchTicker
        eventos={[makeEvent(), makeEvent({ id: 'evento-2', evento: 'Real Madrid vs Barcelona' })]}
        onEventClick={() => {}}
      />
    );

    expect(screen.getAllByRole('button')).toHaveLength(2);
    expect(screen.getAllByText('América vs Chivas')).toHaveLength(2);

    const duplicate = container.querySelector('[data-marquee-copy="true"]');
    expect(duplicate).not.toBeNull();
    expect(duplicate?.querySelectorAll('button')).toHaveLength(2);
    for (const button of duplicate?.querySelectorAll('button') ?? []) {
      expect(button.getAttribute('tabindex')).toBe('-1');
    }
  });

  it('abre el evento al hacer clic en el enfrentamiento', () => {
    const onEventClick = vi.fn();
    const evento = makeEvent();

    render(<AgendaMatchTicker eventos={[evento]} onEventClick={onEventClick} />);

    fireEvent.click(screen.getByRole('button', { name: 'Ver detalles de América vs Chivas' }));
    expect(onEventClick).toHaveBeenCalledWith(evento);
  });

  it('filtra eventos vacíos y duplicados por id', () => {
    render(
      <AgendaMatchTicker
        eventos={[
          makeEvent(),
          makeEvent(),
          makeEvent({ id: 'vacio', evento: '   ' }),
          makeEvent({ id: 'evento-2', evento: 'Dodgers vs Yankees' }),
        ]}
        onEventClick={() => {}}
      />
    );

    expect(screen.getAllByRole('button')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Ver detalles de Dodgers vs Yankees' })).toBeTruthy();
  });
});

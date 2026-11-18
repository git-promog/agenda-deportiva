import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import SportEventCard from './SportEventCard';
import type { Evento } from '@/types';

afterEach(cleanup);

const NOW = new Date('2026-11-16T12:00:00-06:00').getTime();

function makeEvent(overrides: Partial<Evento> = {}): Evento {
  return {
    id: 'evento-1',
    fecha: '2026-11-16',
    hora: '18:00',
    evento: 'Leones del Caracas vs Cardenales de Lara',
    competicion: 'LVBP',
    deporte: 'Béisbol',
    canales: 'ESPN 2',
    ...overrides,
  };
}

describe('SportEventCard', () => {
  it('muestra la cabecera compacta, iniciales reales y logos de canal', () => {
    render(<SportEventCard evento={makeEvent()} isLive now={NOW} onClick={() => {}} />);

    expect(screen.getByText('En vivo')).toBeTruthy();
    expect(screen.getByText('18:00')).toBeTruthy();
    expect(screen.getByText('LC')).toBeTruthy();
    expect(screen.getByText('CL')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'ESPN 2' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Ver detalles de Leones del Caracas vs Cardenales de Lara' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Compartir' })).toBeTruthy();
  });

  it('abre el detalle desde el botón primario y filtra por competición', () => {
    const onClick = vi.fn();
    const onFiltrarLiga = vi.fn();

    render(
      <SportEventCard
        evento={makeEvent()}
        isLive
        now={NOW}
        onClick={onClick}
        onFiltrarLiga={onFiltrarLiga}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Ver detalles de Leones del Caracas vs Cardenales de Lara' }));
    expect(onClick).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'LVBP' }));
    expect(onFiltrarLiga).toHaveBeenCalledWith('LVBP');
  });

  it('muestra título limpio para eventos generales y próximos', () => {
    render(
      <SportEventCard
        evento={makeEvent({
          id: 'evento-2',
          fecha: '2026-11-18',
          evento: 'NASCAR Cup Series',
          competicion: 'NASCAR',
          deporte: 'Motorismo',
          canales: 'Por confirmar',
        })}
        isLive={false}
        now={NOW}
        onClick={() => {}}
      />
    );

    expect(screen.getByText('NASCAR Cup Series')).toBeTruthy();
    expect(screen.getByText('Próximo')).toBeTruthy();
    expect(screen.getByText('Por confirmar')).toBeTruthy();
  });

  it('usa pastilla de texto cuando el canal no tiene archivo de imagen', () => {
    render(
      <SportEventCard
        evento={makeEvent({ canales: 'ESPN Extra' })}
        isLive
        now={NOW}
        onClick={() => {}}
      />
    );

    expect(screen.getByText('ESPN Extra')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'ESPN Extra' })).toBeNull();
  });
});

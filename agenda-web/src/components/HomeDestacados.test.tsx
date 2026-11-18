import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import HomeDestacados from './HomeDestacados';
import type { Evento } from '@/types';

afterEach(cleanup);

function makeEvent(overrides: Partial<Evento> = {}): Evento {
  return {
    id: 'destacado-1',
    fecha: '2026-11-17',
    hora: '18:00',
    evento: 'América vs Chivas',
    competicion: 'Liga MX',
    deporte: 'Fútbol',
    canales: 'ESPN 2, Disney+',
    ...overrides,
  };
}

describe('HomeDestacados', () => {
  it('muestra el texto limpio de canales y abre el evento', () => {
    const onEventClick = vi.fn();
    const evento = makeEvent();

    render(<HomeDestacados destacados={[evento]} onEventClick={onEventClick} />);

    expect(screen.getByText('ESPN 2 · Disney+')).toBeTruthy();
    expect(screen.getByText('Liga MX')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Ver detalles de América vs Chivas' }));
    expect(onEventClick).toHaveBeenCalledWith(evento);
  });

  it('usa fallback de texto para transmisión sin confirmar', () => {
    render(
      <HomeDestacados
        destacados={[makeEvent({ canales: 'Por confirmar' })]}
        onEventClick={() => {}}
      />
    );

    expect(screen.getByText('Por confirmar')).toBeTruthy();
  });

  it('no renderiza nada sin destacados', () => {
    const { container } = render(<HomeDestacados destacados={[]} />);
    expect(container.firstChild).toBeNull();
  });
});

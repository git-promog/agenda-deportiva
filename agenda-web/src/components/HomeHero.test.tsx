import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import HomeHero from './HomeHero';
import type { Evento } from '@/types';

beforeEach(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function makeEvent(overrides: Partial<Evento> = {}): Evento {
  return {
    id: 'hero-1',
    fecha: '2026-11-18',
    hora: '18:00',
    evento: 'América vs Chivas',
    competicion: 'Liga MX',
    deporte: 'Fútbol',
    canales: 'TUDN, ESPN 2',
    ...overrides,
  };
}

describe('HomeHero', () => {
  it('renderiza el enfrentamiento, contexto y cápsula de canales', () => {
    render(<HomeHero evento={makeEvent()} tipo="PARTIDO DEL DÍA" onClick={() => {}} />);

    expect(screen.getByRole('heading', { name: 'América vs Chivas' })).toBeTruthy();
    expect(screen.getByText('América')).toBeTruthy();
    expect(screen.getByText('Chivas')).toBeTruthy();
    expect(screen.getByText('vs')).toBeTruthy();
    expect(screen.getByText('Liga MX')).toBeTruthy();
    expect(screen.getByText('Cuándo')).toBeTruthy();
    expect(screen.getByText('Dónde verlo')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'TUDN' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'ESPN 2' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Compartir' })).toBeTruthy();
  });

  it('abre el detalle desde el botón primario cuadrado', () => {
    const onClick = vi.fn();
    render(<HomeHero evento={makeEvent()} tipo="PARTIDO DEL DÍA" onClick={onClick} />);

    fireEvent.click(screen.getByRole('button', { name: 'Ver detalles de América vs Chivas' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('muestra título limpio para eventos generales', () => {
    render(
      <HomeHero
        evento={makeEvent({ evento: 'NASCAR Cup Series', competicion: 'NASCAR', deporte: 'Motorismo' })}
        tipo="PARTIDO DEL DÍA"
        onClick={() => {}}
      />
    );

    expect(screen.getByRole('heading', { name: 'NASCAR Cup Series' })).toBeTruthy();
    expect(screen.getByText('NASCAR Cup Series')).toBeTruthy();
  });
});

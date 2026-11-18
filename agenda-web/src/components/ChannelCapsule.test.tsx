import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import ChannelCapsule from './ChannelCapsule';

afterEach(cleanup);

describe('ChannelCapsule', () => {
  it('muestra el nombre del canal en hover y lo oculta al salir', () => {
    render(<ChannelCapsule canales="TUDN, ESPN 2" />);

    const tudn = screen.getByRole('button', { name: 'TUDN' });
    expect(screen.queryByRole('tooltip')).toBeNull();

    fireEvent.mouseEnter(tudn);
    expect(screen.getByRole('tooltip').textContent).toBe('TUDN');

    fireEvent.mouseLeave(tudn);
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('muestra el nombre del canal al hacer clic o foco', () => {
    render(<ChannelCapsule canales="ESPN 2" />);

    const espn = screen.getByRole('button', { name: 'ESPN 2' });

    fireEvent.click(espn);
    expect(screen.getByRole('tooltip').textContent).toBe('ESPN 2');

    fireEvent.blur(espn);
    expect(screen.queryByRole('tooltip')).toBeNull();

    fireEvent.focus(espn);
    expect(screen.getByRole('tooltip').textContent).toBe('ESPN 2');
  });

  it('mantiene el fallback de texto sin tooltip para canales sin imagen', () => {
    render(<ChannelCapsule canales="ESPN Extra" />);

    expect(screen.getByText('ESPN Extra')).toBeTruthy();
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('muestra el indicador de swipe solo cuando los canales desbordan', () => {
    render(<ChannelCapsule canales="TUDN, ESPN 2, Fox Sports" />);

    const group = screen.getByRole('group', { name: 'Canales de transmisión' });
    expect(screen.queryByText('Desliza horizontalmente para ver más canales')).toBeNull();

    Object.defineProperty(group, 'scrollWidth', { configurable: true, value: 240 });
    Object.defineProperty(group, 'clientWidth', { configurable: true, value: 120 });
    Object.defineProperty(group, 'scrollLeft', { configurable: true, value: 60, writable: true });
    fireEvent.scroll(group);

    expect(screen.getByText('Desliza horizontalmente para ver más canales')).toBeTruthy();
  });
});

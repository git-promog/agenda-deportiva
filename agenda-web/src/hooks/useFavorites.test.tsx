import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act, cleanup } from '@testing-library/react';
import { useFavorites } from '@/hooks/useFavorites';

const KEY = 'wc_favorites';

function setStorage(value: string | null) {
  if (value === null) {
    window.localStorage.removeItem(KEY);
  } else {
    window.localStorage.setItem(KEY, value);
  }
}

describe('useFavorites', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('arranca vacío cuando no hay nada persistido', async () => {
    const { result } = renderHook(() => useFavorites());
    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.favorites).toEqual([]);
  });

  it('un valor no JSON en localStorage produce lista vacía segura', async () => {
    setStorage('not-json');
    const { result } = renderHook(() => useFavorites());
    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.favorites).toEqual([]);
  });

  it('descarta duplicados y valores que no son strings', async () => {
    setStorage(JSON.stringify(['m1', 'm1', 'm2', 42, null, '', 'm3']));
    const { result } = renderHook(() => useFavorites());
    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.favorites).toEqual(['m1', 'm2', 'm3']);
  });

  it('toggleFavorite añade y quita un favorito', async () => {
    const { result } = renderHook(() => useFavorites());
    await act(async () => {
      await Promise.resolve();
    });

    act(() => result.current.toggleFavorite('m7'));
    expect(result.current.favorites).toContain('m7');

    act(() => result.current.toggleFavorite('m7'));
    expect(result.current.favorites).not.toContain('m7');
  });

  it('persiste en localStorage tras completar la carga inicial', async () => {
    const { result } = renderHook(() => useFavorites());
    await act(async () => {
      await Promise.resolve();
    });

    act(() => result.current.toggleFavorite('m10'));
    await act(async () => {
      await Promise.resolve();
    });

    const persisted = JSON.parse(window.localStorage.getItem(KEY) || '[]');
    expect(persisted).toEqual(['m10']);
  });

  it('newValue === null (borrado en otra pestaña) limpia los favoritos', async () => {
    setStorage(JSON.stringify(['m1', 'm2']));
    const { result } = renderHook(() => useFavorites());
    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.favorites).toEqual(['m1', 'm2']);

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', { key: KEY, newValue: null }),
      );
    });
    expect(result.current.favorites).toEqual([]);
  });

  it('el evento storage con valores válidos sincroniza entre pestañas', async () => {
    const { result } = renderHook(() => useFavorites());
    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: KEY,
          newValue: JSON.stringify(['m4', 'm5']),
        }),
      );
    });
    expect(result.current.favorites).toEqual(['m4', 'm5']);
  });
});
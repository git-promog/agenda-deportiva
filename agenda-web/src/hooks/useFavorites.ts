import { useCallback, useEffect, useState } from 'react';

const FAVORITES_STORAGE_KEY = 'wc_favorites';

function parseFavorites(value: string | null): string[] {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return Array.from(new Set(
      parsed.filter((id): id is string => typeof id === 'string' && id.length > 0),
    ));
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load favorites from localStorage on mount.
    let initialFavorites: string[] = [];
    try {
      initialFavorites = parseFavorites(localStorage.getItem(FAVORITES_STORAGE_KEY));
    } catch (error) {
      console.error('Error loading favorites from localStorage', error);
    }

    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setFavorites(initialFavorites);
      setIsLoaded(true);
    });

    // Sync across tabs, including clearing the key in another tab.
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === FAVORITES_STORAGE_KEY) {
        setFavorites(parseFavorites(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      cancelled = true;
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage', error);
    }
  }, [favorites, isLoaded]);

  const toggleFavorite = useCallback((matchId: string) => {
    if (!matchId) return;

    setFavorites(prev => {
      const isFav = prev.includes(matchId);
      return isFav ? prev.filter(id => id !== matchId) : [...prev, matchId];
    });
  }, []);

  return { favorites, toggleFavorite, isLoaded };
}

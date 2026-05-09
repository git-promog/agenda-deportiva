import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load favorites from localStorage on mount
    try {
      const stored = localStorage.getItem('wc_favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage', error);
    }
    setIsLoaded(true);

    // Sync across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'wc_favorites' && e.newValue) {
        setFavorites(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleFavorite = (matchId: string) => {
    setFavorites(prev => {
      const isFav = prev.includes(matchId);
      const newFavs = isFav ? prev.filter(id => id !== matchId) : [...prev, matchId];
      try {
        localStorage.setItem('wc_favorites', JSON.stringify(newFavs));
      } catch (error) {
        console.error('Error saving favorites to localStorage', error);
      }
      return newFavs;
    });
  };

  return { favorites, toggleFavorite, isLoaded };
}

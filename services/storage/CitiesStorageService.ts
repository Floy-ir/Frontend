import { StorageService } from './StorageService';

// Define the shape of stored city data
interface CitiesStorageSchema {
  recentSelections: Array<{value: string, label: string}>;
  lastSearches: Array<{origin: string, destination: string, date: string}>;
  favorites: string[]; // City codes
}

// Create a singleton instance
export const citiesStorage = new StorageService<CitiesStorageSchema>('cities');

// Add at the top of CitiesStorageService.ts
const isBrowser = typeof window !== 'undefined';

// Convenience methods for common operations
export const CitiesStorageService = {
  getRecentSelections(): Array<{value: string, label: string}> {
    if (!isBrowser) return [];
    return citiesStorage.getItem('recentSelections', []);
  },

  addRecentSelection(value: string, label: string, maxItems = 3): void {
    if (!isBrowser) return;
    const current = this.getRecentSelections();
    const filtered = current.filter(item => item.value !== value);
    const updated = [{ value, label }, ...filtered].slice(0, maxItems);
    citiesStorage.setItem('recentSelections', updated);
  },

  getLastSearches(): Array<{origin: string, destination: string, date: string}> {
    if (!isBrowser) return [];
    return citiesStorage.getItem('lastSearches', []);
  },

  addLastSearch(origin: string, destination: string, date: string, maxItems = 5): void {
    if (!isBrowser) return;
    const current = this.getLastSearches();
    const search = { origin, destination, date };
    const filtered = current.filter(
      item => !(item.origin === origin && item.destination === destination)
    );
    citiesStorage.setItem('lastSearches', [search, ...filtered].slice(0, maxItems));
  },

  toggleFavorite(cityCode: string): void {
    if (!isBrowser) return;
    const favorites = citiesStorage.getItem('favorites', []);
    const index = favorites.indexOf(cityCode);
    
    if (index >= 0) {
      favorites.splice(index, 1);
    } else {
      favorites.push(cityCode);
    }
    
    citiesStorage.setItem('favorites', favorites);
  },

  getFavorites(): string[] {
    if (!isBrowser) return [];
    return citiesStorage.getItem('favorites', []);
  }
}; 
/**
 * Generic storage service that provides type-safe access to browser storage
 */
export class StorageService<T extends Record<string, any>> {
  private readonly prefix: string;
  private readonly storage: Storage | null;
  private readonly isBrowser: boolean;

  /**
   * Create a new storage service instance
   * @param namespace Namespace for keys to avoid conflicts
   * @param storageType 'local' or 'session'
   */
  constructor(namespace: string, storageType: 'local' | 'session' = 'local') {
    this.prefix = `app:${namespace}:`;
    this.isBrowser = typeof window !== 'undefined';
    this.storage = this.isBrowser 
      ? (storageType === 'local' ? localStorage : sessionStorage)
      : null;
  }

  /**
   * Get an item from storage
   * @param key Storage key
   * @param defaultValue Default value if not found
   */
  getItem<K extends keyof T>(key: K, defaultValue: T[K]): T[K] {
    try {
      if (!this.isBrowser || !this.storage) return defaultValue;
      const item = this.storage.getItem(this.prefix + String(key));
      return item ? (JSON.parse(item) as T[K]) : defaultValue;
    } catch (e) {
      console.error(`Error retrieving ${String(key)} from storage:`, e);
      return defaultValue;
    }
  }

  /**
   * Set an item in storage
   * @param key Storage key
   * @param value Value to store
   */
  setItem<K extends keyof T>(key: K, value: T[K]): void {
    try {
      if (!this.isBrowser || !this.storage) return;
      this.storage.setItem(this.prefix + String(key), JSON.stringify(value));
    } catch (e) {
      console.error(`Error storing ${String(key)} in storage:`, e);
    }
  }

  /**
   * Remove an item from storage
   * @param key Storage key
   */
  removeItem<K extends keyof T>(key: K): void {
    if (!this.isBrowser || !this.storage) return;
    this.storage.removeItem(this.prefix + String(key));
  }

  /**
   * Clear all items in this namespace
   */
  clear(): void {
    if (!this.isBrowser || !this.storage) return;
    
    // Use non-null assertion since we've already checked if storage exists
    const storageKeys = Object.keys(this.storage!);
    storageKeys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        this.storage!.removeItem(key);
      }
    });
  }
} 
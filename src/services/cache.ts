interface CacheItem<T> {
  value: T;
  timestamp: number;
}

class CacheService {
  private static instance: CacheService;
  private cache: Map<string, CacheItem<any>>;
  private readonly TTL: number = 24 * 60 * 60 * 1000; // 24 часа в миллисекундах

  private constructor() {
    this.cache = new Map();
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  public set<T>(key: string, value: T): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  public get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Проверяем не истек ли срок хранения
    if (Date.now() - item.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }

    return item.value as T;
  }

  public clear(): void {
    this.cache.clear();
  }

  // Очистка устаревших записей
  public cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.TTL) {
        this.cache.delete(key);
      }
    }
  }
}

export const cacheService = CacheService.getInstance(); 
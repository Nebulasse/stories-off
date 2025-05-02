interface RateLimit {
  count: number;
  timestamp: number;
}

class RateLimitService {
  private static instance: RateLimitService;
  private limits: Map<string, RateLimit>;
  private readonly WINDOW_MS: number = 60 * 60 * 1000; // 1 час
  private readonly MAX_REQUESTS_PER_HOUR: number = 10;

  private constructor() {
    this.limits = new Map();
  }

  public static getInstance(): RateLimitService {
    if (!RateLimitService.instance) {
      RateLimitService.instance = new RateLimitService();
    }
    return RateLimitService.instance;
  }

  public async checkLimit(userId: string | null): Promise<boolean> {
    // Авторизованные пользователи не имеют ограничений
    if (userId) {
      return true;
    }

    const now = Date.now();
    const key = userId || 'anonymous';
    const limit = this.limits.get(key);

    if (!limit) {
      // Первый запрос
      this.limits.set(key, { count: 1, timestamp: now });
      return true;
    }

    // Проверяем, не истекло ли окно
    if (now - limit.timestamp > this.WINDOW_MS) {
      // Сбрасываем счетчик
      this.limits.set(key, { count: 1, timestamp: now });
      return true;
    }

    // Проверяем лимит
    if (limit.count >= this.MAX_REQUESTS_PER_HOUR) {
      return false;
    }

    // Увеличиваем счетчик
    limit.count++;
    return true;
  }

  public getRemainingRequests(userId: string | null): number {
    const key = userId || 'anonymous';
    const limit = this.limits.get(key);

    if (!limit) {
      return this.MAX_REQUESTS_PER_HOUR;
    }

    const now = Date.now();
    if (now - limit.timestamp > this.WINDOW_MS) {
      return this.MAX_REQUESTS_PER_HOUR;
    }

    return Math.max(0, this.MAX_REQUESTS_PER_HOUR - limit.count);
  }

  public cleanup(): void {
    const now = Date.now();
    for (const [key, limit] of this.limits.entries()) {
      if (now - limit.timestamp > this.WINDOW_MS) {
        this.limits.delete(key);
      }
    }
  }
}

export const rateLimitService = RateLimitService.getInstance(); 
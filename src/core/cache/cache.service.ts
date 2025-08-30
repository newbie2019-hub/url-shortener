import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get<T>(key: string): Promise<T | null | undefined> {
    return await this.cache.get<T>(key);
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.cache.set(key, value, ttl);
  }

  async del(key: string): Promise<void> {
    await this.cache.del(key);
  }

  async reset(): Promise<void> {
    if (this.cache.stores) {
      const stores = this.cache.stores;
      await Promise.all(
        stores.map(async (store) => {
          if (
            store?.opts?.namespace === 'memory' &&
            typeof store.clear === 'function'
          ) {
            await store.clear();
          }
        }),
      );
    }
  }

  async onModuleDestroy() {
    // Ensure all stores are disconnected
    if (this.cache.stores) {
      const stores = this.cache.stores;
      await Promise.all(
        stores.map((store) => {
          if (typeof store.disconnect === 'function') {
            return store.disconnect();
          }
        }),
      );
    }
  }
}

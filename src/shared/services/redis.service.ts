import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  // Serialize and deserialize complex data types
  private serialize(value: any): string {
    return JSON.stringify(value);
  }

  private deserialize(value: string): any {
    try {
      return JSON.parse(value);
    } catch (e: any) {
      if (e.stack) this.logger.error('Error deserializing value', e.stack);
      return value; // Return as is if deserialization fails
    }
  }

  // Set a value with optional TTL
  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    try {
      await this.cacheManager.set(key, this.serialize(value), ttl);
    } catch (e: any) {
      if (e.stack) this.logger.error(`Error setting key ${key}`, e.stack);
    }
  }

  // Get a value
  async get(key: string): Promise<any> {
    try {
      const value = await this.cacheManager.get(key);
      return typeof value === 'string' && this.deserialize(value);
    } catch (e: any) {
      if (e.stack) this.logger.error(`Error getting key ${key}`, e.stack);
      return null;
    }
  }

  // Delete a value
  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
    } catch (e: any) {
      if (e.stack) this.logger.error(`Error deleting key ${key}`, e.stack);
    }
  }

  // Reset the entire cache
  async reset(): Promise<void> {
    try {
      await this.cacheManager.reset();
    } catch (e: any) {
      if (e.stack) this.logger.error('Error resetting cache', e.stack);
    }
  }

  // Bulk set multiple values
  async mset(
    pairs: { key: string; value: any; ttl?: number }[],
  ): Promise<void> {
    try {
      const promises = pairs.map((pair) =>
        this.cacheManager.set(
          pair.key,
          this.serialize(pair.value),
          pair.ttl || 3600,
        ),
      );
      await Promise.all(promises);
    } catch (e: any) {
      if (e.stack) this.logger.error('Error in mset operation', e.stack);
    }
  }

  // Bulk get multiple values
  async mget(keys: string[]): Promise<any[]> {
    try {
      const values = await Promise.all(
        keys.map((key) => this.cacheManager.get(key)),
      );
      return values.map(
        (value) => typeof value === 'string' && this.deserialize(value),
      );
    } catch (e: any) {
      if (e.stack) this.logger.error('Error in mget operation', e.stack);
      return [];
    }
  }

  // Check if a key exists
  async exists(key: string): Promise<boolean> {
    try {
      const value = await this.cacheManager.get(key);
      return value !== undefined && value !== null;
    } catch (e: any) {
      if (e.stack)
        this.logger.error(`Error checking existence of key ${key}`, e.stack);
      return false;
    }
  }
}

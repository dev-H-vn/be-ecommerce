import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
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
    } catch (error: any) {
      if (error.stack) {
        this.logger.error('Error deserializing value', error.stack);
      }

      return value; // Return as is if deserialization fails
    }
  }

  // Set a value with optional TTL
  async set(key: string, value: any, ttl = 3600): Promise<void> {
    try {
      await this.cacheManager.set(key, this.serialize(value), ttl);
    } catch (error: any) {
      if (error.stack) {
        this.logger.error(`Error setting key ${key}`, error.stack);
      }
    }
  }

  // Get a value
  async get(key: string): Promise<any> {
    try {
      const value = await this.cacheManager.get(key);

      return typeof value === 'string' && this.deserialize(value);
    } catch (error: any) {
      if (error.stack) {
        this.logger.error(`Error getting key ${key}`, error.stack);
      }

      return null;
    }
  }

  // Delete a value
  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
    } catch (error: any) {
      if (error.stack) {
        this.logger.error(`Error deleting key ${key}`, error.stack);
      }
    }
  }

  // Reset the entire cache
  async reset(): Promise<void> {
    try {
      await this.cacheManager.reset();
    } catch (error: any) {
      if (error.stack) {
        this.logger.error('Error resetting cache', error.stack);
      }
    }
  }

  // Bulk set multiple values
  async mset(
    pairs: Array<{ key: string; value: any; ttl?: number }>,
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
    } catch (error: any) {
      if (error.stack) {
        this.logger.error('Error in mset operation', error.stack);
      }
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
    } catch (error: any) {
      if (error.stack) {
        this.logger.error('Error in mget operation', error.stack);
      }

      return [];
    }
  }

  // Check if a key exists
  async exists(key: string): Promise<boolean> {
    try {
      const value = await this.cacheManager.get(key);

      return value !== undefined && value !== null;
    } catch (error: any) {
      if (error.stack) {
        this.logger.error(
          `Error checking existence of key ${key}`,
          error.stack,
        );
      }

      return false;
    }
  }
}

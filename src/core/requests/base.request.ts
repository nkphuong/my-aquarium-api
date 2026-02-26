import { omit, pick } from 'radash';

/**
 * Base Request class with Laravel-style helper methods
 */
export abstract class BaseRequest {
  /**
   * Get subset of request properties
   */
  only<K extends keyof this>(keys: K[]): Pick<this, K> {
    return pick(this, keys);
  }

  /**
   * Get all properties except specified keys
   */
  except<K extends keyof this>(keys: K[]): Omit<this, K> {
    return omit(this, keys);
  }

  /**
   * Get all properties as plain object
   */
  all(): Record<string, any> {
    return { ...this };
  }
}

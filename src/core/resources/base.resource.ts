/**
 * Base Resource class mimicking Laravel's JsonResource
 * - Wraps a domain entity or data object
 * - Provides a toJSON() method to format the output
 */
export abstract class BaseResource<T = any> {
  constructor(protected readonly resource: T) {}

  /**
   * Implement this to define the array/json representation of the resource
   */
  abstract toJSON(): Record<string, any>;

  /**
   * Create a collection of resources
   */
  static collection<T, R extends BaseResource<T>>(
    this: new (resource: T) => R,
    resources: T[],
  ): R[] {
    return resources.map((res) => new this(res));
  }
}

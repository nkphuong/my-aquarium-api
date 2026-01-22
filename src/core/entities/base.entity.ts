
/**
 * Pure domain base entity - No key mapping (Snake Case)
 * 
 * Features:
 * - fromDatabase(): Assigns data directly, converts BigInt/Decimal -> number
 * - toDatabase(): Converts back to snake_case structure (which is same)
 * - Auto-manages created_at / updated_at
 */
export abstract class BaseEntity {
    id?: number;
    created_at?: Date;
    updated_at?: Date;

    // Alias for compatibility if needed
    get createdAt() { return this.created_at; }
    set createdAt(val) { this.created_at = val; }

    get updatedAt() { return this.updated_at; }
    set updatedAt(val) { this.updated_at = val; }

    /**
     * Create entity from database row
     * NO mapping of keys (snake_case preserved)
     * Auto-convert BigInt/Decimal to number
     */
    static fromDatabase<T extends BaseEntity>(
        this: new () => T,
        data: Record<string, any>,
    ): T {
        const entity = new this();

        for (const [key, value] of Object.entries(data)) {
            // Handle BigInt → number
            if (typeof value === 'bigint') {
                (entity as any)[key] = Number(value);
            }
            // Handle Decimal → number
            else if (value !== null && typeof value === 'object' && 'toNumber' in value) {
                (entity as any)[key] = value.toNumber();
            }
            else {
                (entity as any)[key] = value;
            }
        }

        return entity;
    }

    /**
     * Convert entity to database format
     * NO mapping: Attributes match column names exactly
     */
    toDatabase(): Record<string, any> {
        const result: Record<string, any> = { ...this };

        // Ensure ID is BigInt if present
        if (result.id && typeof result.id === 'number') {
            result.id = BigInt(result.id);
        }

        // Convert foreign keys ending in _id
        for (const key of Object.keys(result)) {
            if (key.endsWith('_id') && typeof result[key] === 'number') {
                result[key] = BigInt(result[key]);
            }
        }

        return result;
    }

    /**
     * Merge data into this entity
     */
    fill(data: Partial<this>): this {
        Object.assign(this, data);
        return this;
    }

    /**
     * Check if entity exists in database
     */
    get exists(): boolean {
        return this.id !== undefined && this.id !== null;
    }

    /**
     * Laravel-style: Indicates if the model should be timestamped.
     * Set to false in child class to disable auto created_at/updated_at.
     */
    timestamps = true;

    /* ... existing methods ... */

    /**
     * Called before CREATE operation
     */
    prepareForCreate(): void {
        if (this.timestamps) {
            const now = new Date();
            this.created_at = now;
            this.updated_at = now;
        }
    }

    /**
     * Get data for UPDATE operation (excludes id and created_at)
     */
    getUpdateData(): Record<string, any> {
        if (this.timestamps) {
            this.updated_at = new Date();
        }

        const dbData = this.toDatabase();
        delete dbData.id;
        delete dbData.created_at;
        delete dbData.createdAt;
        delete dbData.updatedAt;
        return dbData;
    }

    /**
     * Convert to JSON for API response
     */
    toJSON(): Record<string, any> {
        return { ...this };
    }
}

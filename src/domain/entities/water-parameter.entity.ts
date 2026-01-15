import { BaseEntity } from './base.entity';


export class WaterParameter extends BaseEntity {
    private _tank_id: number;
    private _tested_at: Date;
    private _temperature?: number | null;
    private _ph?: number | null;
    private _ammonia?: number | null;
    private _nitrite?: number | null;
    private _nitrate?: number | null;
    private _gh?: number | null;
    private _kh?: number | null;
    private _notes?: string | null;

    constructor(
        id: number,
        tank_id: number,
        tested_at: Date,
        temperature?: number | null,
        ph?: number | null,
        ammonia?: number | null,
        nitrite?: number | null,
        nitrate?: number | null,
        gh?: number | null,
        kh?: number | null,
        notes?: string | null,
        created_at?: Date,
        updated_at?: Date,
    ) {
        super(id, created_at, updated_at);
        this._tank_id = tank_id;
        this._tested_at = tested_at;
        this._temperature = temperature;
        this._ph = ph;
        this._ammonia = ammonia;
        this._nitrite = nitrite;
        this._nitrate = nitrate;
        this._gh = gh;
        this._kh = kh;
        this._notes = notes;
    }

    get tank_id(): number {
        return this._tank_id;
    }

    get tested_at(): Date {
        return this._tested_at;
    }

    get temperature(): number | null | undefined {
        return this._temperature;
    }

    get ph(): number | null | undefined {
        return this._ph;
    }

    get ammonia(): number | null | undefined {
        return this._ammonia;
    }

    get nitrite(): number | null | undefined {
        return this._nitrite;
    }

    get nitrate(): number | null | undefined {
        return this._nitrate;
    }

    get gh(): number | null | undefined {
        return this._gh;
    }

    get kh(): number | null | undefined {
        return this._kh;
    }

    get notes(): string | null | undefined {
        return this._notes;
    }
}

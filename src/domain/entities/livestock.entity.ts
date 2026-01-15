import { BaseEntity } from './base.entity';
import { LivestockStatus, LivestockType } from '../enums/livestock.enum';

export class Livestock extends BaseEntity {
    private _tank_id?: number | null;
    private _name: string;
    private _scientific_name?: string | null;
    private _fishbase_id?: number | null;
    private _type: LivestockType;
    private _quantity: number;
    private _status: LivestockStatus;
    private _image_url?: string | null;
    private _added_date: Date;

    constructor(
        id: number,
        name: string,
        type: LivestockType,
        quantity: number,
        status: LivestockStatus,
        added_date: Date,
        tank_id?: number | null,
        scientific_name?: string | null,
        fishbase_id?: number | null,
        image_url?: string | null,
        created_at?: Date,
        updated_at?: Date,
    ) {
        super(id, created_at, updated_at);
        this._name = name;
        this._type = type;
        this._quantity = quantity;
        this._status = status;
        this._added_date = added_date;
        this._tank_id = tank_id;
        this._scientific_name = scientific_name;
        this._fishbase_id = fishbase_id;
        this._image_url = image_url;
    }

    get name(): string {
        return this._name;
    }

    get type(): LivestockType {
        return this._type;
    }

    get quantity(): number {
        return this._quantity;
    }

    get status(): LivestockStatus {
        return this._status;
    }

    get added_date(): Date {
        return this._added_date;
    }

    get tank_id(): number | null | undefined {
        return this._tank_id;
    }

    get scientific_name(): string | null | undefined {
        return this._scientific_name;
    }

    get fishbase_id(): number | null | undefined {
        return this._fishbase_id;
    }

    get image_url(): string | null | undefined {
        return this._image_url;
    }

    updateDetails(
        name?: string,
        scientificName?: string | null,
        imageUrl?: string | null,
        addedDate?: Date
    ) {
        if (name) this._name = name;
        if (scientificName !== undefined) this._scientific_name = scientificName;
        if (imageUrl !== undefined) this._image_url = imageUrl;
        if (addedDate) this._added_date = addedDate;
        this.touch();
    }

    updateQuantity(qty: number) {
        this._quantity = qty;
        this.touch();
    }

    updateStatus(status: LivestockStatus) {
        this._status = status;
        this.touch();
    }
}

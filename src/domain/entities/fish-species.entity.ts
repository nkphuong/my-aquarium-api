import { BaseEntity } from './base.entity';

export class FishSpecies extends BaseEntity {
  private _nameEn: string;
  private _nameVn: string;
  private _scientificName?: string | null;
  private _aliases: string[];
  private _imageUrl?: string | null;

  // Water Parameters
  private _tempMin: number;
  private _tempMax: number;
  private _phMin: number;
  private _phMax: number;
  private _ghMin?: number | null;
  private _ghMax?: number | null;

  // Tank Requirements
  private _minTankSize: number;
  private _sizeMax: number;
  private _bioloadLevel: number;
  private _flowPreference: string;

  // Behavior
  private _careLevel: string;
  private _temperament: string;
  private _dietType: string;

  // Flags
  private _isSchooling: boolean;
  private _minSchoolSize?: number | null;
  private _plantSafe: boolean;
  private _substrateDigger: boolean;
  private _jumper: boolean;

  // AI
  private _description: string;

  constructor(
    id: number,
    nameEn: string,
    nameVn: string,
    tempMin: number,
    tempMax: number,
    phMin: number,
    phMax: number,
    minTankSize: number,
    sizeMax: number,
    careLevel: string,
    temperament: string,
    dietType: string,
    description: string,
    scientificName?: string | null,
    aliases: string[] = [],
    imageUrl?: string | null,
    ghMin?: number | null,
    ghMax?: number | null,
    bioloadLevel: number = 5,
    flowPreference: string = 'moderate',
    isSchooling: boolean = false,
    minSchoolSize: number = 1,
    plantSafe: boolean = true,
    substrateDigger: boolean = false,
    jumper: boolean = false,
    created_at?: Date,
    updated_at?: Date,
  ) {
    super(id, created_at, updated_at);
    this._nameEn = nameEn;
    this._nameVn = nameVn;
    this._scientificName = scientificName;
    this._aliases = aliases;
    this._imageUrl = imageUrl;
    this._tempMin = tempMin;
    this._tempMax = tempMax;
    this._phMin = phMin;
    this._phMax = phMax;
    this._ghMin = ghMin;
    this._ghMax = ghMax;
    this._minTankSize = minTankSize;
    this._sizeMax = sizeMax;
    this._bioloadLevel = bioloadLevel;
    this._flowPreference = flowPreference;
    this._careLevel = careLevel;
    this._temperament = temperament;
    this._dietType = dietType;
    this._isSchooling = isSchooling;
    this._minSchoolSize = minSchoolSize;
    this._plantSafe = plantSafe;
    this._substrateDigger = substrateDigger;
    this._jumper = jumper;
    this._description = description;
  }

  // Getters
  get nameEn(): string { return this._nameEn; }
  get nameVn(): string { return this._nameVn; }
  get scientificName(): string | null | undefined { return this._scientificName; }
  get aliases(): string[] { return this._aliases; }
  get imageUrl(): string | null | undefined { return this._imageUrl; }
  get tempMin(): number { return this._tempMin; }
  get tempMax(): number { return this._tempMax; }
  get phMin(): number { return this._phMin; }
  get phMax(): number { return this._phMax; }
  get ghMin(): number | null | undefined { return this._ghMin; }
  get ghMax(): number | null | undefined { return this._ghMax; }
  get minTankSize(): number { return this._minTankSize; }
  get sizeMax(): number { return this._sizeMax; }
  get bioloadLevel(): number { return this._bioloadLevel; }
  get flowPreference(): string { return this._flowPreference; }
  get careLevel(): string { return this._careLevel; }
  get temperament(): string { return this._temperament; }
  get dietType(): string { return this._dietType; }
  get isSchooling(): boolean { return this._isSchooling; }
  get minSchoolSize(): number | null | undefined { return this._minSchoolSize; }
  get plantSafe(): boolean { return this._plantSafe; }
  get substrateDigger(): boolean { return this._substrateDigger; }
  get jumper(): boolean { return this._jumper; }
  get description(): string { return this._description; }
}

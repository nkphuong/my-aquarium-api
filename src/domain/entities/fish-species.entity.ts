import { BaseEntity } from './base.entity';
import {
  CareLevel,
  Temperament,
  DietType,
  FlowPreference,
} from '@domain/enums/fish-species.enum';

export class FishSpecies extends BaseEntity {
  // 1. IDENTITY (Định danh)
  private _nameEn: string;
  private _nameVn: string;
  private _scientificName?: string;
  private _aliases: string[];
  private _imageUrl?: string;

  // 2. WATER PARAMETERS (Thông số nước)
  private _tempMin: number;
  private _tempMax: number;
  private _phMin: number;
  private _phMax: number;
  private _ghMin?: number;
  private _ghMax?: number;

  // 3. TANK REQUIREMENTS (Yêu cầu hồ nuôi)
  private _minTankSize: number;
  private _sizeMax: number;
  private _bioloadLevel: number;
  private _flowPreference: FlowPreference;

  // 4. BEHAVIOR & COMPATIBILITY (Tập tính & tương thích)
  private _careLevel: CareLevel;
  private _temperament: Temperament;
  private _dietType: DietType;
  private _isSchooling: boolean;
  private _minSchoolSize: number;
  private _plantSafe: boolean;
  private _substrateDigger: boolean;
  private _jumper: boolean;

  // 5. AI & SEARCH (RAG)
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
    careLevel: CareLevel,
    temperament: Temperament,
    dietType: DietType,
    description: string,
    scientificName?: string,
    aliases?: string[],
    imageUrl?: string,
    ghMin?: number,
    ghMax?: number,
    bioloadLevel?: number,
    flowPreference?: FlowPreference,
    isSchooling?: boolean,
    minSchoolSize?: number,
    plantSafe?: boolean,
    substrateDigger?: boolean,
    jumper?: boolean,
    created_at?: Date,
    updated_at?: Date,
  ) {
    super(id, created_at, updated_at);

    // Identity
    this._nameEn = nameEn;
    this._nameVn = nameVn;
    this._scientificName = scientificName;
    this._aliases = aliases || [];
    this._imageUrl = imageUrl;

    // Water Parameters
    this._tempMin = tempMin;
    this._tempMax = tempMax;
    this._phMin = phMin;
    this._phMax = phMax;
    this._ghMin = ghMin;
    this._ghMax = ghMax;

    // Tank Requirements
    this._minTankSize = minTankSize;
    this._sizeMax = sizeMax;
    this._bioloadLevel = bioloadLevel ?? 5;
    this._flowPreference = flowPreference ?? FlowPreference.MODERATE;

    // Behavior & Compatibility
    this._careLevel = careLevel;
    this._temperament = temperament;
    this._dietType = dietType;
    this._isSchooling = isSchooling ?? false;
    this._minSchoolSize = minSchoolSize ?? 1;
    this._plantSafe = plantSafe ?? true;
    this._substrateDigger = substrateDigger ?? false;
    this._jumper = jumper ?? false;

    // Description
    this._description = description;
  }

  // Getters - Identity
  get nameEn(): string {
    return this._nameEn;
  }

  get nameVn(): string {
    return this._nameVn;
  }

  get scientificName(): string | undefined {
    return this._scientificName;
  }

  get aliases(): string[] {
    return [...this._aliases]; // Return copy to prevent external mutation
  }

  get imageUrl(): string | undefined {
    return this._imageUrl;
  }

  // Getters - Water Parameters
  get tempMin(): number {
    return this._tempMin;
  }

  get tempMax(): number {
    return this._tempMax;
  }

  get phMin(): number {
    return this._phMin;
  }

  get phMax(): number {
    return this._phMax;
  }

  get ghMin(): number | undefined {
    return this._ghMin;
  }

  get ghMax(): number | undefined {
    return this._ghMax;
  }

  // Getters - Tank Requirements
  get minTankSize(): number {
    return this._minTankSize;
  }

  get sizeMax(): number {
    return this._sizeMax;
  }

  get bioloadLevel(): number {
    return this._bioloadLevel;
  }

  get flowPreference(): FlowPreference {
    return this._flowPreference;
  }

  // Getters - Behavior & Compatibility
  get careLevel(): CareLevel {
    return this._careLevel;
  }

  get temperament(): Temperament {
    return this._temperament;
  }

  get dietType(): DietType {
    return this._dietType;
  }

  get isSchooling(): boolean {
    return this._isSchooling;
  }

  get minSchoolSize(): number {
    return this._minSchoolSize;
  }

  get plantSafe(): boolean {
    return this._plantSafe;
  }

  get substrateDigger(): boolean {
    return this._substrateDigger;
  }

  get jumper(): boolean {
    return this._jumper;
  }

  // Getters - Description
  get description(): string {
    return this._description;
  }

  // Business Methods - Identity
  updateIdentity(
    nameEn?: string,
    nameVn?: string,
    scientificName?: string,
    imageUrl?: string,
  ): void {
    if (nameEn !== undefined) this._nameEn = nameEn;
    if (nameVn !== undefined) this._nameVn = nameVn;
    if (scientificName !== undefined) this._scientificName = scientificName;
    if (imageUrl !== undefined) this._imageUrl = imageUrl;
    this.touch();
  }

  addAlias(alias: string): void {
    if (!this._aliases.includes(alias)) {
      this._aliases.push(alias);
      this.touch();
    }
  }

  removeAlias(alias: string): void {
    const index = this._aliases.indexOf(alias);
    if (index > -1) {
      this._aliases.splice(index, 1);
      this.touch();
    }
  }

  // Business Methods - Water Parameters
  updateWaterParameters(
    tempMin?: number,
    tempMax?: number,
    phMin?: number,
    phMax?: number,
    ghMin?: number,
    ghMax?: number,
  ): void {
    if (tempMin !== undefined) this._tempMin = tempMin;
    if (tempMax !== undefined) this._tempMax = tempMax;
    if (phMin !== undefined) this._phMin = phMin;
    if (phMax !== undefined) this._phMax = phMax;
    if (ghMin !== undefined) this._ghMin = ghMin;
    if (ghMax !== undefined) this._ghMax = ghMax;
    this.touch();
  }

  // Business Methods - Tank Requirements
  updateTankRequirements(
    minTankSize?: number,
    sizeMax?: number,
    bioloadLevel?: number,
    flowPreference?: FlowPreference,
  ): void {
    if (minTankSize !== undefined) this._minTankSize = minTankSize;
    if (sizeMax !== undefined) this._sizeMax = sizeMax;
    if (bioloadLevel !== undefined) this._bioloadLevel = bioloadLevel;
    if (flowPreference !== undefined) this._flowPreference = flowPreference;
    this.touch();
  }

  // Business Methods - Behavior & Compatibility
  updateBehavior(
    careLevel?: CareLevel,
    temperament?: Temperament,
    dietType?: DietType,
    isSchooling?: boolean,
    minSchoolSize?: number,
    plantSafe?: boolean,
    substrateDigger?: boolean,
    jumper?: boolean,
  ): void {
    if (careLevel !== undefined) this._careLevel = careLevel;
    if (temperament !== undefined) this._temperament = temperament;
    if (dietType !== undefined) this._dietType = dietType;
    if (isSchooling !== undefined) this._isSchooling = isSchooling;
    if (minSchoolSize !== undefined) this._minSchoolSize = minSchoolSize;
    if (plantSafe !== undefined) this._plantSafe = plantSafe;
    if (substrateDigger !== undefined) this._substrateDigger = substrateDigger;
    if (jumper !== undefined) this._jumper = jumper;
    this.touch();
  }

  // Business Methods - Description
  updateDescription(description: string): void {
    this._description = description;
    this.touch();
  }
}

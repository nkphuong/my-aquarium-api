import { BaseDto } from './base.dto';

export class FishDto extends BaseDto {
  name: string;
  species: string;
}

export class CreateFishDto {
  name: string;
  species: string;
}

export class UpdateFishDto {
  name?: string;
  species?: string;
}

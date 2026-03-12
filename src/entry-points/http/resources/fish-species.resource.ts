import { BaseResource } from '@core/resources/base.resource';
import { FishSpecies } from '@entities/fish-species.entity';

export class FishSpeciesResource extends BaseResource<FishSpecies> {
  toJSON(): Record<string, any> {
    return {
      id: this.resource.id,
      nameEn: this.resource.name_en,
      nameVn: this.resource.name_vn,
      scientificName: this.resource.scientific_name,
      aliases: this.resource.aliases,
      imageUrl: this.resource.image_url,
      tempMin: this.resource.temp_min,
      tempMax: this.resource.temp_max,
      phMin: this.resource.ph_min,
      phMax: this.resource.ph_max,
      ghMin: this.resource.gh_min,
      ghMax: this.resource.gh_max,
      minTankSize: this.resource.min_tank_size,
      sizeMax: this.resource.size_max,
      careLevel: this.resource.care_level,
      temperament: this.resource.temperament,
      dietType: this.resource.diet_type,
      description: this.resource.description,
      isSchooling: this.resource.is_schooling,
      plantSafe: this.resource.plant_safe,
      tankSizeMin: this.resource.min_tank_size,
      substrateDigger: this.resource.substrate_digger,
      isJumper: this.resource.jumper,
      minSchoolSize: this.resource.min_school_size,
    };
  }
}

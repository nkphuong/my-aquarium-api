import { IsNumber, IsArray, ValidateNested, Min, Max, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { Type } from 'class-transformer';

class SpeciesItemDTO {
  @IsNumber()
  id!: number;

  @IsNumber()
  @Min(1)
  @Max(50)
  quantity!: number;
}

export class CompatibilityCheckRequestDTO {
  @IsNumber()
  @Min(1)
  tank_size_liters!: number;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => SpeciesItemDTO)
  species!: SpeciesItemDTO[];
}

export interface CompatibilityPairResult {
  species_a_id: number;
  species_a_name: string;
  species_b_id: number;
  species_b_name: string;
  verdict: 'compatible' | 'risky' | 'incompatible';
  score: number;
  reasons_vn: string[];
  reasons_en: string[];
}

export interface SpeciesBreakdownItem {
  species_id: number;
  name_en: string;
  name_vn: string;
  quantity: number;
  bioload_per_fish: number;
  bioload_total: number;
  max_additional: number;
  is_schooling: boolean;
  min_school_size: number;
  schooling_warning: boolean;
}

export interface CompatibilityCheckResponseDTO {
  stocking_percent: number;
  stocking_verdict: 'ok' | 'warning' | 'overstocked';
  pairs: CompatibilityPairResult[];
  warnings: string[];
  overall_verdict: 'compatible' | 'risky' | 'incompatible';
  species_breakdown: SpeciesBreakdownItem[];
  tank_capacity: number;
  total_bioload: number;
  remaining_capacity: number;
}

export interface SpeciesListItemDTO {
  id: number;
  name_vn: string;
  name_scientific: string | null;
  name_en: string;
  image_url: string | null;
  temp_min: number;
  temp_max: number;
  ph_min: number;
  ph_max: number;
  size_max: number;
  is_schooling: boolean;
  min_school_size: number;
}

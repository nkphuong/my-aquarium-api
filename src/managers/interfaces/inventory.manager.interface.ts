import { LivestockType, LivestockStatus } from '@accessors/livestock/enums/livestock.enum';

export interface ICreateFishCommand {
    name: string;
    species: string;
    tankId?: number;
}

export interface ICreateLivestockCommand {
    tankId: number;
    name: string;
    type: LivestockType;
    scientificName?: string;
    fishbaseId?: number;
    quantity?: number;
    status?: LivestockStatus;
    imageUrl?: string;
    addedDate?: Date | string;
}

export type IUpdateLivestockCommand = Partial<ICreateLivestockCommand>;

export interface ICreateFishSpeciesCommand {
    name_vn: string;
    name_en?: string;
    scientific_name?: string;
    aliases?: string[];
    image_url?: string;
    temp_min?: number;
    temp_max?: number;
    ph_min?: number;
    ph_max?: number;
    gh_min?: number;
    gh_max?: number;
    min_tank_size?: number;
    size_max?: number;
    bioload_level?: number;
    flow_preference?: string;
    care_level?: string;
    temperament?: string;
    diet_type?: string;
    is_schooling?: boolean;
    min_school_size?: number;
    plant_safe?: boolean;
    substrate_digger?: boolean;
    jumper?: boolean;
    description?: string;
}

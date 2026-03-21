export interface ICreateTankCommand {
  name: string;
  length: number;
  width: number;
  height: number;
  volume_liters?: number;
  tank_type?: string;
  style?: string;
  description?: string;
  setup_date?: Date;
  cover_image_url?: string;
  substrate?: string;
  filter_type?: string;
}

export type IUpdateTankCommand = Partial<ICreateTankCommand>;

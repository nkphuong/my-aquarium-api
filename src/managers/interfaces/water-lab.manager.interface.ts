export interface ICreateWaterParameterCommand {
    tankId: number;
    testedAt?: Date | string;
    temperature?: number;
    ph?: number;
    ammonia?: number;
    nitrite?: number;
    nitrate?: number;
    gh?: number;
    kh?: number;
    notes?: string;
}

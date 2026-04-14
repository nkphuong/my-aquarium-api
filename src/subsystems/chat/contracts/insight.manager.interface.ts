import { AIInsight } from '../types/context.types';

export interface IInsightManager {
  getInsights(userId: number): Promise<AIInsight[]>;
}

export const INSIGHT_MANAGER = Symbol('IInsightManager');

import { UserAquariumContext } from '../types/context.types';

export interface IChatContextAccessor {
  gatherUserContext(userId: number): Promise<UserAquariumContext>;
}

export const CHAT_CONTEXT_ACCESSOR = Symbol('IChatContextAccessor');

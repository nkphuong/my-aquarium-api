import type { ITransactional } from '@core/contracts/accessor.interface';
import type { IAuthAccess } from './auth.access.interface';

export interface IAdminAccess extends IAuthAccess, ITransactional {}

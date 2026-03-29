import { Injectable } from '@nestjs/common';

/**
 * PermissionEngine - Pure business logic for permission checks
 *
 * Follows IDesign principles:
 * - NO I/O (no Accessor calls)
 * - Pure logic only
 */
@Injectable()
export class PermissionEngine {
  hasPermission(permissions: string[], required: string): boolean {
    return permissions.includes(required);
  }

  hasAnyPermission(permissions: string[], required: string[]): boolean {
    return required.some((p) => permissions.includes(p));
  }

  hasAllPermissions(permissions: string[], required: string[]): boolean {
    return required.every((p) => permissions.includes(p));
  }
}

import { Injectable } from '@nestjs/common';
import { BaseDbAccessor } from '@core/accessors/base-db.accessor';
import { AdminRoleAssignment } from '../entities/admin-role-assignment.entity';
import { Role } from '../entities/role.entity';
import type { IAdminRoleAccessor } from '../contracts/admin-role.accessor.interface';

@Injectable()
export class AdminRoleAccessor
  extends BaseDbAccessor
  implements IAdminRoleAccessor
{
  async findByAdminId(adminId: number): Promise<AdminRoleAssignment[]> {
    return this.em.find(
      AdminRoleAssignment,
      { adminId },
      { populate: ['role'] },
    );
  }

  async assign(adminId: number, roleId: number): Promise<void> {
    const existing = await this.em.findOne(AdminRoleAssignment, {
      adminId,
      role: { id: roleId },
    });
    if (existing) return;

    const role = await this.em.findOne(Role, { id: roleId });
    if (!role) return;

    const assignment = new AdminRoleAssignment();
    assignment.fill({ adminId, role } as any);
    await this.em.persist(assignment).flush();
  }

  async remove(adminId: number, roleId: number): Promise<void> {
    const assignment = await this.em.findOne(AdminRoleAssignment, {
      adminId,
      role: { id: roleId },
    });
    if (assignment) {
      await this.em.remove(assignment).flush();
    }
  }

  async removeAll(adminId: number): Promise<void> {
    const assignments = await this.em.find(AdminRoleAssignment, { adminId });
    await this.em.remove(assignments).flush();
  }
}

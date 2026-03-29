import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { AdminAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { RequiresPermission } from '../decorators/requires-permission.decorator';
import type { IAuthorizationManager } from '@subsystems/authorization/contracts/authorization.manager.interface';
import { AUTHORIZATION_MANAGER } from '@subsystems/authorization/contracts/authorization.manager.interface';

class CreateRoleDto {
  name!: string;
  slug!: string;
  description?: string;
}

class UpdateRoleDto {
  name?: string;
  description?: string;
}

class AssignPermissionsDto {
  permissionSlugs!: string[];
}

class AssignRoleDto {
  roleId!: number;
}

@UseGuards(AdminAuthGuard, PermissionGuard)
@Controller('admin/roles')
export class AdminRoleController {
  constructor(
    @Inject(AUTHORIZATION_MANAGER)
    private readonly authorizationManager: IAuthorizationManager,
  ) {}

  @RequiresPermission('manage-roles')
  @Get()
  async listRoles() {
    return this.authorizationManager.listRoles();
  }

  @RequiresPermission('manage-roles')
  @Post()
  async createRole(@Body() dto: CreateRoleDto) {
    return this.authorizationManager.createRole(dto);
  }

  @RequiresPermission('manage-roles')
  @Patch(':id')
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.authorizationManager.updateRole(id, dto);
  }

  @RequiresPermission('manage-roles')
  @Delete(':id')
  async deleteRole(@Param('id', ParseIntPipe) id: number) {
    return this.authorizationManager.deleteRole(id);
  }

  @RequiresPermission('manage-roles')
  @Post(':id/permissions')
  async assignPermissions(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignPermissionsDto,
  ) {
    return this.authorizationManager.assignPermissionsToRole(
      id,
      dto.permissionSlugs,
    );
  }

  @RequiresPermission('manage-roles')
  @Get('permissions')
  async listPermissions() {
    return this.authorizationManager.listPermissions();
  }

  @RequiresPermission('manage-roles')
  @Get('admins/:adminId')
  async getAdminRoles(@Param('adminId', ParseIntPipe) adminId: number) {
    return this.authorizationManager.getAdminRoles(adminId);
  }

  @RequiresPermission('manage-roles')
  @Post('admins/:adminId/assign')
  async assignRoleToAdmin(
    @Param('adminId', ParseIntPipe) adminId: number,
    @Body() dto: AssignRoleDto,
  ) {
    return this.authorizationManager.assignRoleToAdmin(adminId, dto.roleId);
  }

  @RequiresPermission('manage-roles')
  @Delete('admins/:adminId/roles/:roleId')
  async removeRoleFromAdmin(
    @Param('adminId', ParseIntPipe) adminId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
  ) {
    return this.authorizationManager.removeRoleFromAdmin(adminId, roleId);
  }

  @RequiresPermission('manage-roles')
  @Delete('admins/:adminId/roles')
  async removeAllRolesFromAdmin(
    @Param('adminId', ParseIntPipe) adminId: number,
  ) {
    return this.authorizationManager.removeAllRolesFromAdmin(adminId);
  }
}

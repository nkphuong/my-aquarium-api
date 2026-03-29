import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { AdminAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { RequiresPermission } from '../decorators/requires-permission.decorator';
import type { IAccountManager } from '@subsystems/membership/contracts/account.manager.interface';
import { AdminCreateUserRequestDTO } from '@subsystems/membership/dtos/admin-create-user.request.dto';
import { AdminUpdateUserRequestDTO } from '@subsystems/membership/dtos/admin-update-user.request.dto';
import { ListUsersQueryDTO } from '@subsystems/membership/dtos/list-users-query.dto';

@UseGuards(AdminAuthGuard, PermissionGuard)
@Controller('admin/users')
export class AdminUserManageController {
  constructor(
    @Inject('IAccountManager')
    private readonly accountManager: IAccountManager,
  ) {}

  @RequiresPermission('manage-users')
  @Get()
  async listUsers(@Query() query: ListUsersQueryDTO) {
    return this.accountManager.listUsers(query);
  }

  @RequiresPermission('manage-users')
  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return this.accountManager.getUser(id);
  }

  @RequiresPermission('manage-users')
  @Post()
  async createUser(@Body() dto: AdminCreateUserRequestDTO) {
    return this.accountManager.createUser(dto);
  }

  @RequiresPermission('manage-users')
  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AdminUpdateUserRequestDTO,
  ) {
    return this.accountManager.updateUser(id, dto);
  }

  @RequiresPermission('manage-users')
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.accountManager.deleteUser(id);
  }
}

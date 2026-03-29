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
import type { IPackageAdminManager } from '@subsystems/subscription/contracts/package-admin.manager.interface';
import { PACKAGE_ADMIN_MANAGER } from '@subsystems/subscription/contracts/package-admin.manager.interface';

class CreatePackageDto {
  name!: string;
  slug!: string;
  description?: string;
  sortOrder?: number;
}

class UpdatePackageDto {
  name?: string;
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
}

class SetFeaturesDto {
  features!: { featureKey: string; value: string }[];
}

@UseGuards(AdminAuthGuard, PermissionGuard)
@Controller('admin/packages')
export class AdminPackageController {
  constructor(
    @Inject(PACKAGE_ADMIN_MANAGER)
    private readonly packageAdminManager: IPackageAdminManager,
  ) {}

  @RequiresPermission('manage-packages')
  @Get()
  async listPackages() {
    return this.packageAdminManager.listPackages();
  }

  @RequiresPermission('manage-packages')
  @Post()
  async createPackage(@Body() dto: CreatePackageDto) {
    return this.packageAdminManager.createPackage(dto);
  }

  @RequiresPermission('manage-packages')
  @Patch(':id')
  async updatePackage(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePackageDto,
  ) {
    return this.packageAdminManager.updatePackage(id, dto);
  }

  @RequiresPermission('manage-packages')
  @Delete(':id')
  async deletePackage(@Param('id', ParseIntPipe) id: number) {
    return this.packageAdminManager.deletePackage(id);
  }

  @RequiresPermission('manage-packages')
  @Get(':id/features')
  async getFeatures(@Param('id', ParseIntPipe) id: number) {
    return this.packageAdminManager.getPackageFeatures(id);
  }

  @RequiresPermission('manage-packages')
  @Post(':id/features')
  async setFeatures(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SetFeaturesDto,
  ) {
    return this.packageAdminManager.setPackageFeatures(id, dto.features);
  }
}

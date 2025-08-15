import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '../../modules/auth/entities/permission.entity';
import { Role } from '../../modules/auth/entities/role.entity';
import { SeedsService } from './seeds.service';
import { Tenant } from '../../modules/tenant/entities/tenant.entity';
import { TenantModule } from '../../modules/tenant/tenant.module';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, Role, Tenant]), TenantModule],
  providers: [SeedsService],
  exports: [SeedsService],
})
export class SeedsModule {}

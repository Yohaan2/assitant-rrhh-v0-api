import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';
import { TenantController } from './tenant.controller';
import { UsersService } from '../users/users.service';
import { Role } from '../auth/entities/role.entity';
import { User } from '../users/entities/user.entity';
import { AdminApiKeyGuard } from '../../common/guards/admin-api-key.guard';
import { SeedsModule } from '../../database/seeds/seeds.module';
import { SeedsService } from '../../database/seeds/seeds.service';
import { Permission } from '../auth/entities/permission.entity';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant, User, Role, Permission])],
  providers: [
    TenantService,
    UsersService,
    AdminApiKeyGuard,
    SeedsService,
    AuthService,
    JwtService,
  ],
  controllers: [TenantController],
  exports: [TenantService],
})
export class TenantModule {}

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SeedsModule } from '../../database/seeds/seeds.module';
import { Role } from '../auth/entities/role.entity';
import { TenantModule } from '../tenant/tenant.module';
import { Tenant } from '../tenant/entities/tenant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Tenant]),
    SeedsModule,
    TenantModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '../../modules/auth/entities/permission.entity';
import { Role } from '../../modules/auth/entities/role.entity';
import { SeedsService } from './seeds.service';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, Role])],
  providers: [SeedsService],
  exports: [SeedsService],
})
export class SeedsModule {}

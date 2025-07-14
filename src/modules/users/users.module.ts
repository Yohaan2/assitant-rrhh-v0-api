import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SeedsModule } from '../../database/seeds/seeds.module';
import { Role } from '../auth/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), SeedsModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

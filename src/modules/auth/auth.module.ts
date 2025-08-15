import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SeedsModule } from '../../database/seeds/seeds.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from './entities/role.entity';
import { TenantService } from '../tenant/tenant.service';
import { TenantModule } from '../tenant/tenant.module';
import { Tenant } from '../tenant/entities/tenant.entity';
import { Permission } from './entities/permission.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy, TenantService],
  imports: [
    UsersModule,
    PassportModule,
    SeedsModule,
    TypeOrmModule.forFeature([Tenant, User, Role, Permission]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
      }),
    }),
  ],
})
export class AuthModule {}

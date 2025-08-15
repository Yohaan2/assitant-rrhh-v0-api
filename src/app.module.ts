import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './database/postgres/database.module';
import { ConfigModule } from '@nestjs/config';
import { SeedsModule } from './database/seeds/seeds.module';
import { AuthModule } from './modules/auth/auth.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { TenantMiddleware } from './common/middleware/tenant.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    UsersModule,
    SeedsModule,
    AuthModule,
    TenantModule,
  ],
})
export class AppModule {}
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(TenantMiddleware)
//       .exclude(
//         'api/admin/tenants',
//         'api/admin/tenants/*path',
//         'api/admin/tenants/bootstrap',
//       )
//       .forRoutes('*');
//   }
// }

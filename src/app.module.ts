import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './database/postgres/database.module';
import { ConfigModule } from '@nestjs/config';
import { SeedsModule } from './database/seeds/seeds.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    UsersModule,
    SeedsModule,
  ],
})
export class AppModule {}

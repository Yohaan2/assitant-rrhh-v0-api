import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('POSTGRES_HOST'),
        port: configService.getOrThrow('POSTGRES_PORT'),
        username: configService.getOrThrow('POSTGRES_USER'),
        password: configService.getOrThrow('POSTGRES_PASSWORD'),
        database: configService.getOrThrow('POSTGRES_DB'),
        entities: [join(__dirname, '../../**/*.entity.{js,ts}')],
        migrations: [join(__dirname, '../migrations/*.{js,ts}')],
        migrationsTableName: 'migrations',
        autoLoadEntities: true,
        synchronize: false,
        migrationsRun: false,
        logging: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule implements OnApplicationBootstrap {
  constructor(private dataSource: DataSource) {}

  onApplicationBootstrap() {
    if (this.dataSource.isInitialized) {
      console.log('✅ Conexión a la base de datos establecida correctamente');
    } else {
      console.error('❌ Error al conectar con la base de datos');
    }
  }
}

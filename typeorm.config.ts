import { config } from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';

config({
  path: '.env',
});

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [join(__dirname, './src/**/*.entity.{js,ts}')],
  migrations: [join(__dirname, './src/database/migrations/*.{js,ts}')],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: true,
});

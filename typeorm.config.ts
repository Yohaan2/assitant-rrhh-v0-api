import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { join } from 'path';

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
  entities: [
    join(process.cwd(), './src/modules/auth/entities/*.entity.{js,ts}'),
    join(process.cwd(), './src/modules/users/entities/*.entity.{js,ts}'),
  ],
  migrations: [
    join(process.cwd(), './src/database/migrations/tenant/*.{js,ts}'),
  ],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: true,
  // ssl: {
  //   rejectUnauthorized: false,
  // },
});

import {
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleDestroy,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { User } from '../users/entities/user.entity';
import { Role } from '../auth/entities/role.entity';
import { Permission } from '../auth/entities/permission.entity';
import { UserRole } from '../auth/entities/user-role.entity';
import { join } from 'path';

@Injectable()
export class TenantService implements OnModuleDestroy {
  private readonly connections = new Map<string, DataSource>();
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async createTenant(createTenantDto: CreateTenantDto): Promise<Tenant> {
    const { name, subdomain } = createTenantDto;

    const schemaName = `tenant_${subdomain.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    const existingTenant = await this.tenantRepository.findOne({
      where: [{ subdomain }, { schema_name: schemaName }],
    });

    if (existingTenant) {
      throw new ConflictException(
        'El subdominio o el nombre de la base de datos ya existe',
      );
    }
    const tenant = this.tenantRepository.create({
      name,
      subdomain,
      schema_name: schemaName,
    });

    await this.tenantRepository.save(tenant);

    await this.createTenantSchema(schemaName);

    await this.runMigrationsForSchema(schemaName);

    return tenant;
  }

  async createTenantSchema(schemaName: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
      console.log(`✅ Schema "${schemaName}" created successfully`);
    } catch (error) {
      console.error(`Error creating schema "${schemaName}":`, error);
    } finally {
      await queryRunner.release();
    }
  }

  async migrateTenantSchema(schemaName: string): Promise<void> {
    await this.runMigrationsForSchema(schemaName);
  }

  private async runMigrationsForSchema(schemaName: string): Promise<void> {
    const baseOptions = this.dataSource.options as PostgresConnectionOptions;
    const tenantDataSource = new DataSource({
      ...baseOptions,
      schema: schemaName,
      entities: [User, Role, Permission, UserRole],
      migrations: [
        // Ruta robusta que funciona en dev (TS) y prod (JS) y normaliza separadores en Windows
        join(__dirname, '../../database/migrations/tenant/*.{js,ts}').replace(
          /\\/g,
          '/',
        ),
      ],
      migrationsTableName: 'migrations',
    });
    await tenantDataSource.initialize();
    try {
      await tenantDataSource.runMigrations();
      console.log(`✅ Migraciones ejecutadas para el esquema "${schemaName}"`);
    } finally {
      await tenantDataSource.destroy();
    }
  }

  async getTenantConnection(tenantId: string): Promise<DataSource> {
    if (this.connections.has(tenantId)) {
      return this.connections.get(tenantId) as DataSource;
    }
    const tenant = await this.tenantRepository.findOne({
      where: { schema_name: tenantId },
    });
    if (!tenant) {
      throw new NotFoundException(`Tenant with id ${tenantId} not found`);
    }
    console.log(tenant);
    const baseOptions = this.dataSource.options as PostgresConnectionOptions;

    const connection = new DataSource({
      ...baseOptions,
      schema: tenant.schema_name,
      entities: [User, Role, Permission, UserRole],
    });
    await connection.initialize();
    this.connections.set(tenantId, connection);
    return connection;
  }

  async getTenant(tenantId: string): Promise<Tenant | null> {
    return this.tenantRepository.findOne({
      where: { schema_name: tenantId },
    });
  }

  async onModuleDestroy() {
    for (const dataSource of this.connections.values()) {
      if (dataSource.isInitialized) {
        await dataSource.destroy();
      }
    }
    this.connections.clear();
  }
}

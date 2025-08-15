import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from '../../modules/auth/entities/permission.entity';
import { Role } from '../../modules/auth/entities/role.entity';
import { DataSource, Repository } from 'typeorm';
import { permissionsData } from './permissions.seed';
import { rolesData } from './roles.seed';
import { Tenant } from '../../modules/tenant/entities/tenant.entity';
import { TenantService } from '../../modules/tenant/tenant.service';

@Injectable()
export class SeedsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    private readonly tenantService: TenantService,
  ) {}

  async seedPermissions() {
    console.log('Seeding permissions...');

    for (const permissionData of permissionsData) {
      const existing = await this.permissionRepository.findOne({
        where: {
          resource: permissionData.resource,
          action: permissionData.action,
        },
      });

      if (!existing) {
        await this.permissionRepository.save(permissionData);
      }
    }

    console.log('Permissions seeded successfully');
  }

  async seedRoles() {
    console.log('Seeding roles...');

    for (const roleData of rolesData) {
      let role = await this.roleRepository.findOne({
        where: { name: roleData.name },
        relations: ['permissions'],
      });

      if (!role) {
        role = this.roleRepository.create({
          name: roleData.name,
          description: roleData.description,
        });
      }

      // Obtener permisos
      const permissions = await this.permissionRepository.find({
        where: roleData.permissions.map((p) => {
          const [resource, action] = p.split(':');
          return { resource, action };
        }),
      });

      role.permissions = permissions;
      await this.roleRepository.save(role);
    }

    console.log('Roles seeded successfully');
  }

  async runSeeds() {
    await this.seedPermissions();
    await this.seedRoles();
  }

  // Ejecuta seeds para un tenant específico (por schema_name)
  async runSeedsForTenant(schemaName: string) {
    const tenant = await this.tenantRepository.findOne({
      where: { schema_name: schemaName, is_active: true },
    });
    if (!tenant) {
      throw new NotFoundException(`Tenant ${schemaName} no encontrado`);
    }

    const tenantDs: DataSource = await this.tenantService.getTenantConnection(
      tenant.schema_name,
    );

    const permissionRepo = tenantDs.getRepository(Permission);
    const roleRepo = tenantDs.getRepository(Role);

    // Seed permissions
    for (const permissionData of permissionsData) {
      const existing = await permissionRepo.findOne({
        where: {
          resource: permissionData.resource,
          action: permissionData.action,
        },
      });
      if (!existing) {
        await permissionRepo.save(permissionData);
      }
    }

    // Seed roles con relaciones
    for (const roleData of rolesData) {
      let role = await roleRepo.findOne({
        where: { name: roleData.name },
        relations: ['permissions'],
      });
      if (!role) {
        role = roleRepo.create({
          name: roleData.name,
          description: roleData.description,
        });
      }
      const permissions = await permissionRepo.find({
        where: roleData.permissions.map((p) => {
          const [resource, action] = p.split(':');
          return { resource, action };
        }),
      });
      role.permissions = permissions;
      await roleRepo.save(role);
    }

    return { message: `Seeds ejecutados en ${schemaName}` };
  }

  // Ejecuta seeds para todos los tenants activos
  async runSeedsForAllTenants() {
    const tenants = await this.tenantRepository.find({
      where: { is_active: true },
    });
    for (const t of tenants) {
      await this.runSeedsForTenant(t.schema_name);
    }
    return { message: `Seeds ejecutados en ${tenants.length} tenants` };
  }
}

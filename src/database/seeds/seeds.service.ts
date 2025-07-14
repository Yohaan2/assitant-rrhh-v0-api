import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from '../../modules/auth/entities/permission.entity';
import { Role } from '../../modules/auth/entities/role.entity';
import { Repository } from 'typeorm';
import { permissionsData } from './permissions.seed';
import { rolesData } from './roles.seed';

@Injectable()
export class SeedsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
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
}

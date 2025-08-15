import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { CreateUserAdminDto } from './dto/create-user-admin.dto';
import { UsersService } from '../users/users.service';
import { AdminApiKeyGuard } from '../../common/guards/admin-api-key.guard';
import { SeedsService } from '../../database/seeds/seeds.service';
import { AuthService } from '../auth/auth.service';

@UseGuards(AdminApiKeyGuard)
@Controller('admin/tenants')
export class TenantController {
  constructor(
    private readonly tenantService: TenantService,
    private readonly usersService: UsersService,
    private readonly seedsService: SeedsService,
    private readonly authService: AuthService,
  ) { }

  @Post()
  async createTenant(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantService.createTenant(createTenantDto);
  }

  @Post('bootstrap')
  async bootstrap(@Body() body: CreateUserAdminDto) {
    const { company_name, subdomain } = body;
    const schemaName = `tenant_${subdomain.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    let tenant = await this.tenantService.getTenant(schemaName);
    console.log(tenant);
    if (!tenant) {
      tenant = await this.tenantService.createTenant({
        name: company_name,
        subdomain,
      });
    }
    await this.seedsService.runSeedsForTenant(schemaName);
    const roleId = await this.authService.getRoleId(body.role, schemaName);
    if (!roleId) {
      throw new BadRequestException('Rol no encontrado');
    }
    const user = await this.usersService.create(
      {
        ...body,
        roleIds: [roleId],
      },
      schemaName,
    );

    return { tenant, user };
  }

  @Post(':schema/migrate')
  async migrate(@Param('schema') schema: string) {
    const schemaName = schema.startsWith('tenant_')
      ? schema
      : `tenant_${schema.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    await this.tenantService.migrateTenantSchema(schemaName);
    return { ok: true, schema: schemaName };
  }
}

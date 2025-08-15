import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { TenantService } from '../tenant/tenant.service';
import { Role } from './entities/role.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly tenantService: TenantService,
  ) {}

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  async getUserPermissions(email: string): Promise<string[]> {
    const user = await this.userService.findByEmail(email);

    if (!user) return [];

    const permissions = new Set<string>();

    user.roles.forEach((role) => {
      role.permissions.forEach((permission) => {
        permissions.add(`${permission.resource}:${permission.action}`);
      });
    });

    return Array.from(permissions);
  }

  async validateUserPermission(
    userId: string,
    resource: string,
    action: string,
  ): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);
    return permissions.includes(`${resource}:${action}`);
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      return null;
    }

    const isValidPassword = await this.userService.checkPassword(
      password,
      user.passwordHash,
    );

    if (!isValidPassword) {
      return null;
    }

    return user;
  }

  signIn(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(
    createUserDto: CreateUserDto,
    tenantId: string,
  ): Promise<UserResponseDto> {
    return await this.userService.create(createUserDto, tenantId);
  }

  async getRoleId(roleName: string, tenantId: string): Promise<string | null> {
    const tenant = await this.tenantService.getTenantConnection(tenantId);
    const roleRepository = tenant.getRepository(Role);
    const role = await roleRepository.findOne({
      where: { name: roleName },
    });
    return role?.id || null;
  }
}

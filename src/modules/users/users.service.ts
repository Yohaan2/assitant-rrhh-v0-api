import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../auth/entities/role.entity';
import { UserResponseDto } from './dto/user-response.dto';
import { TenantService } from '../tenant/tenant.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private readonly tenantService: TenantService,
  ) {}
  async create(createUserDto: CreateUserDto, tenantId: string) {
    try {
      const tenant = await this.tenantService.getTenantConnection(tenantId);
      const userRepository = tenant.getRepository(User);
      const roleRepository = tenant.getRepository(Role);

      const existingUser = await userRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('El correo electrónico ya está en uso');
      }

      let roles: Role[] = [];
      if (createUserDto.roleIds.length > 0) {
        roles = await this.validateAndGetRoles(
          createUserDto.roleIds,
          roleRepository,
        );
      }

      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(
        createUserDto.password,
        saltRounds,
      );
      const user = userRepository.create({
        ...createUserDto,
        passwordHash,
        roles,
      });
      await userRepository.save(user);
      return this.formatUserResponse(user);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  findAll() {
    return 'Aqui van todos los usuarios';
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return this.formatUserResponse(user);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async getUsers(tenantId: string) {
    const connection = await this.tenantService.getTenantConnection(tenantId);
    return connection.getRepository(User).find();
  }

  private async validateAndGetRoles(
    roleIds: string[],
    roleRepository: Repository<Role>,
  ): Promise<Role[]> {
    if (roleIds.length === 0) {
      return [];
    }

    const roles = await roleRepository.find({
      where: { id: In(roleIds), isActive: true },
      relations: ['permissions'],
    });

    if (roles.length !== roleIds.length) {
      const foundIds = roles.map((r) => r.id);
      const notFoundIds = roleIds.filter((id) => !foundIds.includes(id));
      throw new NotFoundException(
        `Roles no encontrados: ${notFoundIds.join(', ')}`,
      );
    }

    return roles;
  }

  private formatUserResponse(user: User): UserResponseDto {
    const permissions = new Set<string>();

    user.roles?.forEach((role) => {
      role.permissions?.forEach((permission) => {
        permissions.add(`${permission.resource}:${permission.action}`);
      });
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      isActive: user.isActive,
      createdAt: user.createdAt,
      roles:
        user.roles?.map((role) => ({
          id: role.id,
          name: role.name,
          description: role.description,
        })) || [],
      permissions: Array.from(permissions),
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
      relations: ['roles', 'roles.permissions'],
    });
  }

  async checkPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}

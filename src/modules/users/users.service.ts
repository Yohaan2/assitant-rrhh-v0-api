import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../auth/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está en uso');
    }

    let roles: Role[] = [];
    if (createUserDto.roleIds.length > 0) {
      roles = await this.validateAndGetRoles(createUserDto.roleIds);
    }

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(createUserDto.password, saltRounds);
    const user = this.userRepository.create({
      ...createUserDto,
      passwordHash,
      roles,
    });
    return this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find({
      relations: ['roles', 'roles.permissions'],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private async validateAndGetRoles(roleIds: string[]): Promise<Role[]> {
    if (roleIds.length === 0) {
      return [];
    }

    const roles = await this.roleRepository.find({
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
}

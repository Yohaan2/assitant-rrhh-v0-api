import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SeedsService } from '../../database/seeds/seeds.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly seedsService: SeedsService,
  ) {}

  @Post('create')
  create(@Req() req: Request, @Body() createUserDto: CreateUserDto) {
    const tenantId = req.headers['x-tenant-id'] as string;
    return this.usersService.create(createUserDto, tenantId);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('test')
  async getUser() {
    return this.usersService.getUsers('tenant_factory1');
  }

  @Get('seed/:schema')
  async seedForTenant(@Param('schema') schema: string) {
    return this.seedsService.runSeedsForTenant(schema);
  }

  @Get('seed-all')
  async seedAllTenants() {
    return this.seedsService.runSeedsForAllTenants();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }
}

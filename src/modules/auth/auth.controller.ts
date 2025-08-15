import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SeedsService } from '../../database/seeds/seeds.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly seedsService: SeedsService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signIn(@Req() req) {
    return this.authService.signIn(req.user);
  }

  @Post('signup')
  signUp(
    @Req() req: Request,
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    const tenantId = req.headers['x-tenant-id'] as string;
    return this.authService.signUp(createUserDto, tenantId);
  }

  @Get('me')
  getMe() {
    return { message: 'Hello World!' };
  }

  @Get('seeds')
  async getSeeds() {
    await this.seedsService.runSeeds();
    return { message: 'Seeds run successfully' };
  }
}

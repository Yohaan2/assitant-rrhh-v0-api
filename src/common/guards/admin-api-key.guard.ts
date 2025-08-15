import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AdminApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const providedKey =
      (req.headers['x-admin-key'] as string) ||
      (req.headers['x-api-key'] as string);
    const expectedKey = this.configService.get<string>('ADMIN_API_KEY');

    if (!expectedKey) {
      throw new UnauthorizedException('ADMIN_API_KEY no está configurada');
    }

    if (!providedKey || providedKey !== expectedKey) {
      throw new UnauthorizedException('Clave de administrador inválida');
    }

    return true;
  }
}

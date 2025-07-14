import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { AuthService } from '../../modules/auth/auth.service';

interface AuthenticatedRequest {
  user: {
    id: string;
    [key: string]: any;
  };
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true; // No permissions required
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      return false;
    }

    // Obtener permisos del usuario
    const userPermissions = await this.authService.getUserPermissions(user.id);

    // Verificar si el usuario tiene TODOS los permisos requeridos
    return requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );
  }
}

import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('tenant middleware');
    const tenantId = req.headers['x-tenant-id'] as string;
    if (!tenantId) throw new UnauthorizedException('No tenant provided');
    req['tenantId'] = tenantId;
    next();
  }
}

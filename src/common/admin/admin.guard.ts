import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getJWTRoles } from 'src/utils/jwt.token';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private readonly configService: ConfigService) { }

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const req = context.switchToHttp().getRequest();
    const roles = getJWTRoles(req.session.user.access_token)
    const adminRole = this.configService.get<string>('ADMIN_ROLE')
    if (adminRole) {
      const checkAdmin = roles.includes(adminRole)
      return checkAdmin
    }
    return false
  }
}

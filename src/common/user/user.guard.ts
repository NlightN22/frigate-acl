import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { verifyJWT } from '../../utils/jwt.token';

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const req = context.switchToHttp().getRequest();
    return this.isValidUser(req)
  }

  isValidUser(req: any): boolean {
    console.debug(req.session.user)
    if (req.session.user?.access_token !== undefined)  {
      const accessToken = req.session.user.access_token
      return verifyJWT(accessToken)
    }
    return false
  }
}


import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { verifyJWT } from '../../utils/jwt.token';

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const req = context.switchToHttp().getRequest();
    return this.isRequestValidUser(req)
  }

  isRequestValidUser(req: any): boolean {
    if (req.session !== undefined) {
      return this.isSessionValidUser(req.session)
    }
    // console.debug('request:', req)
    // console.debug('request session:', req.session)

    return false
  }

  isSessionValidUser(session: any): boolean {
    if (session.user?.access_token !== undefined) {
      const accessToken = session.user.access_token
      // console.debug('accessToken', accessToken)
      return verifyJWT(accessToken)
    }
    // console.debug('request user:', session.user)
    // console.debug('request access_token:', session.user?.access_token)
    return false
  }
}


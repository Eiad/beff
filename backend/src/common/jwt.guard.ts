import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { verifyJwt, type JwtPayload } from './jwt-utils';

export type { JwtPayload };

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Extract Bearer token from Authorization header
    const authHeader: string | undefined = request.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.slice(7);

    // Verify JWT signature and expiry
    let payload: JwtPayload;
    try {
      payload = verifyJwt(token, process.env.JWT_SECRET ?? 'beff-default-fallback-secret-2026');
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Confirm user still exists (catches deleted-account tokens)
    const user = this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    // Attach safe user object to request (no passwordHash)
    request.user = user;
    return true;
  }
}

import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { UsersService, SafeUser } from '../users/users.service';
import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import { signJwt } from '../common/jwt-utils';

// Pure Node.js crypto password hashing — no native dependencies, works on all serverless runtimes
function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = createHash('sha512').update(salt + password).digest('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  const candidate = createHash('sha512').update(salt + password).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(candidate, 'hex'));
  } catch {
    return false;
  }
}

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(name: string, email: string, password: string): Promise<{ token: string; user: SafeUser }> {
    if (this.usersService.findByEmail(email)) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = hashPassword(password);
    const user = this.usersService.create(name, email, passwordHash);
    const token = this.signToken(user);

    return { token, user };
  }

  async login(email: string, password: string): Promise<{ token: string; user: SafeUser }> {
    const record = this.usersService.findByEmailWithHash(email);

    // Return same 401 for unknown email OR wrong password — prevents user enumeration
    if (!record || !verifyPassword(password, record.passwordHash)) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const user = this.usersService.findById(record.id)!;
    const token = this.signToken(user);

    return { token, user };
  }

  private signToken(user: SafeUser): string {
    return signJwt(
      { sub: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET!,
    );
  }
}

import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UsersService, SafeUser } from '../users/users.service';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(name: string, email: string, password: string): Promise<{ token: string; user: SafeUser }> {
    // Check for duplicate email
    if (this.usersService.findByEmail(email)) {
      throw new ConflictException('An account with this email already exists');
    }

    // Hash password asynchronously (never use sync to avoid blocking the event loop)
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = this.usersService.create(name, email, passwordHash);
    const token = this.signToken(user);

    return { token, user };
  }

  async login(email: string, password: string): Promise<{ token: string; user: SafeUser }> {
    // Use findByEmailWithHash to get the hash for comparison
    const record = this.usersService.findByEmailWithHash(email);

    // Return same 401 for unknown email OR wrong password — prevents user enumeration
    if (!record || !(await bcrypt.compare(password, record.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const user = this.usersService.findById(record.id)!;
    const token = this.signToken(user);

    return { token, user };
  }

  private signToken(user: SafeUser): string {
    return jwt.sign(
      { sub: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' },
    );
  }
}

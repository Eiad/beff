import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto'; // Built-in Node.js — no package needed

// Internal user record — passwordHash stays inside this service
interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

// Safe user type returned to controllers — no password
export type SafeUser = Omit<UserRecord, 'passwordHash'>;

@Injectable()
export class UsersService {
  // In-memory store — intentional for MVP (data resets on server restart)
  private readonly users = new Map<string, UserRecord>();

  create(name: string, email: string, passwordHash: string): SafeUser {
    const user: UserRecord = {
      id: randomUUID(),
      name,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
    };
    this.users.set(user.id, user);
    return this.toSafe(user);
  }

  findById(id: string): SafeUser | undefined {
    const user = this.users.get(id);
    return user ? this.toSafe(user) : undefined;
  }

  // Returns full record (including hash) — only used internally by AuthService
  findByEmailWithHash(email: string): UserRecord | undefined {
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === email.toLowerCase()) return user;
    }
    return undefined;
  }

  findByEmail(email: string): SafeUser | undefined {
    const user = this.findByEmailWithHash(email);
    return user ? this.toSafe(user) : undefined;
  }

  update(id: string, name: string): SafeUser | undefined {
    const user = this.users.get(id);
    if (!user) return undefined;
    user.name = name;
    return this.toSafe(user);
  }

  delete(id: string): boolean {
    return this.users.delete(id);
  }

  // Strip passwordHash before any data leaves this service
  private toSafe(user: UserRecord): SafeUser {
    const { passwordHash: _, ...safe } = user;
    return safe;
  }
}

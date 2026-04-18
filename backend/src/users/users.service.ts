import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../database/database.service';

// Internal user record — passwordHash stays inside this service
interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
}

// Safe user type returned to controllers — no password
export type SafeUser = Omit<UserRecord, 'passwordHash'>;

@Injectable()
export class UsersService {
  // Persistent SQLite store — data survives restarts
  constructor(private readonly database: DatabaseService) {}

  create(name: string, email: string, passwordHash: string): SafeUser {
    const user: UserRecord = {
      id: randomUUID(),
      name,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
    };
    this.database.db
      .prepare(
        'INSERT INTO users (id, name, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)',
      )
      .run(user.id, user.name, user.email, user.passwordHash, user.createdAt);
    return this.toSafe(user);
  }

  findById(id: string): SafeUser | undefined {
    const row = this.database.db
      .prepare('SELECT * FROM users WHERE id = ?')
      .get(id) as UserRow | undefined;
    return row ? this.toSafe(this.rowToRecord(row)) : undefined;
  }

  // Returns full record (including hash) — only used internally by AuthService
  findByEmailWithHash(email: string): UserRecord | undefined {
    const row = this.database.db
      .prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)')
      .get(email) as UserRow | undefined;
    return row ? this.rowToRecord(row) : undefined;
  }

  findByEmail(email: string): SafeUser | undefined {
    const record = this.findByEmailWithHash(email);
    return record ? this.toSafe(record) : undefined;
  }

  update(id: string, name: string): SafeUser | undefined {
    const result = this.database.db
      .prepare('UPDATE users SET name = ? WHERE id = ?')
      .run(name, id);
    if (result.changes === 0) return undefined;
    return this.findById(id);
  }

  delete(id: string): boolean {
    const result = this.database.db.prepare('DELETE FROM users WHERE id = ?').run(id);
    return result.changes > 0;
  }

  private rowToRecord(row: UserRow): UserRecord {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      passwordHash: row.password_hash,
      createdAt: row.created_at,
    };
  }

  private toSafe(user: UserRecord): SafeUser {
    const { passwordHash: _, ...safe } = user;
    return safe;
  }
}

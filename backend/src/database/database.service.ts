import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private database: Database.Database | undefined;

  get db(): Database.Database {
    if (!this.database) {
      throw new Error('DatabaseService: db accessed before onModuleInit');
    }
    return this.database;
  }

  onModuleInit() {
    const rawPath = process.env.SQLITE_DB_PATH ?? './data/beff.sqlite';
    const isMemory = rawPath.startsWith(':');
    const dbPath = isMemory ? rawPath : resolve(rawPath);

    if (!isMemory) {
      const dir = dirname(dbPath);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    }

    this.database = new Database(dbPath);
    this.database.pragma('journal_mode = WAL');
    this.database.pragma('foreign_keys = ON');
    this.database.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_users_email_lower ON users(LOWER(email));
    `);

    this.logger.log(`DatabaseService: opened ${isMemory ? rawPath : dbPath}`);
  }

  onModuleDestroy() {
    if (this.database && this.database.open) {
      this.database.close();
      this.logger.log('DatabaseService: connection closed');
    }
  }
}

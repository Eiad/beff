import { Test, TestingModule } from '@nestjs/testing';
import { existsSync, rmSync, mkdtempSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import * as fs from 'fs';
import { DatabaseService } from './database.service';

function buildModule(dbPath: string): Promise<TestingModule> {
  process.env.SQLITE_DB_PATH = dbPath;
  return Test.createTestingModule({
    providers: [DatabaseService],
  }).compile();
}

describe('DatabaseService', () => {
  let tmpDir: string;
  const originalPath = process.env.SQLITE_DB_PATH;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'beff-db-test-'));
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
    if (originalPath) process.env.SQLITE_DB_PATH = originalPath;
    else delete process.env.SQLITE_DB_PATH;
  });

  it('opens a file DB at SQLITE_DB_PATH and creates the file', async () => {
    const dbPath = join(tmpDir, 'sub', 'deeper', 'beff.sqlite');
    const module = await buildModule(dbPath);
    const svc = module.get(DatabaseService);
    svc.onModuleInit();

    expect(existsSync(dbPath)).toBe(true);

    svc.onModuleDestroy();
    await module.close();
  });

  it('auto-creates the parent directory when missing', async () => {
    const dbPath = join(tmpDir, 'nested', 'beff.sqlite');
    const module = await buildModule(dbPath);
    const svc = module.get(DatabaseService);
    svc.onModuleInit();

    expect(existsSync(join(tmpDir, 'nested'))).toBe(true);
    svc.onModuleDestroy();
    await module.close();
  });

  it(':memory: path does not create files at the configured location', async () => {
    // tmpDir is empty and we never set SQLITE_DB_PATH to point inside it for :memory: init.
    // This test documents that :memory: stays in-process — no side effects on the filesystem.
    const before = fs.readdirSync(tmpDir);
    expect(before).toEqual([]);

    const module = await buildModule(':memory:');
    const svc = module.get(DatabaseService);
    svc.onModuleInit();

    const after = fs.readdirSync(tmpDir);
    expect(after).toEqual([]);

    svc.onModuleDestroy();
    await module.close();
  });

  it('applies journal_mode = WAL pragma (file DB only — :memory: uses "memory")', async () => {
    const dbPath = join(tmpDir, 'wal.sqlite');
    const module = await buildModule(dbPath);
    const svc = module.get(DatabaseService);
    svc.onModuleInit();

    const mode = svc.db.pragma('journal_mode', { simple: true });
    expect(mode).toBe('wal');

    svc.onModuleDestroy();
    await module.close();
  });

  it('applies foreign_keys = ON pragma', async () => {
    const dbPath = join(tmpDir, 'fk.sqlite');
    const module = await buildModule(dbPath);
    const svc = module.get(DatabaseService);
    svc.onModuleInit();

    const fk = svc.db.pragma('foreign_keys', { simple: true });
    expect(fk).toBe(1);

    svc.onModuleDestroy();
    await module.close();
  });

  it('creates the users table with expected columns', async () => {
    const module = await buildModule(':memory:');
    const svc = module.get(DatabaseService);
    svc.onModuleInit();

    const cols = svc.db.pragma('table_info(users)') as Array<{ name: string }>;
    const names = cols.map((c) => c.name).sort();
    expect(names).toEqual(['created_at', 'email', 'id', 'name', 'password_hash']);

    svc.onModuleDestroy();
    await module.close();
  });

  it('onModuleDestroy closes the DB; calling twice does not throw', async () => {
    const module = await buildModule(':memory:');
    const svc = module.get(DatabaseService);
    svc.onModuleInit();

    svc.onModuleDestroy();
    expect(() => svc.onModuleDestroy()).not.toThrow();
    await module.close();
  });

  it('onModuleDestroy is safe before onModuleInit', async () => {
    const module = await buildModule(':memory:');
    const svc = module.get(DatabaseService);
    expect(() => svc.onModuleDestroy()).not.toThrow();
    await module.close();
  });

  it('accessing db before onModuleInit throws', async () => {
    const module = await buildModule(':memory:');
    const svc = module.get(DatabaseService);
    expect(() => svc.db).toThrow(/before onModuleInit/);
    await module.close();
  });
});

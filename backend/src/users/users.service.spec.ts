process.env.SQLITE_DB_PATH = ':memory:';

import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DatabaseModule } from '../database/database.module';
import { DatabaseService } from '../database/database.service';

describe('UsersService', () => {
  let service: UsersService;
  let db: DatabaseService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [UsersService],
    }).compile();
    await module.init();
    service = module.get<UsersService>(UsersService);
    db = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(async () => {
    await module.close();
  });

  it('create() returns user without passwordHash', () => {
    const user = service.create('Alice', 'alice@test.com', 'hashed');
    expect(user.name).toBe('Alice');
    expect(user.email).toBe('alice@test.com');
    expect((user as Record<string, unknown>).passwordHash).toBeUndefined();
  });

  it('create() persists a row with snake_case columns', () => {
    const user = service.create('Snake', 'snake@test.com', 'hashed-value');
    const row = db.db.prepare('SELECT * FROM users WHERE id = ?').get(user.id) as Record<string, unknown>;
    expect(row).toMatchObject({
      id: user.id,
      name: 'Snake',
      email: 'snake@test.com',
      password_hash: 'hashed-value',
    });
    expect(typeof row.created_at).toBe('string');
    // Raw row must NOT have camelCase keys
    expect(row.passwordHash).toBeUndefined();
    expect(row.createdAt).toBeUndefined();
  });

  it('findById() returns user when it exists', () => {
    const created = service.create('Bob', 'bob@test.com', 'hashed');
    const found = service.findById(created.id);
    expect(found?.id).toBe(created.id);
    expect(found?.name).toBe('Bob');
  });

  it('findById() returns undefined for unknown id', () => {
    expect(service.findById('nonexistent-uuid')).toBeUndefined();
  });

  it('findByEmail() returns user by email (case-insensitive)', () => {
    service.create('Carol', 'carol@test.com', 'hashed');
    expect(service.findByEmail('CAROL@TEST.COM')).toBeDefined();
    expect(service.findByEmail('Carol@Test.Com')).toBeDefined();
  });

  it('findByEmail() returns undefined for unknown email', () => {
    expect(service.findByEmail('nobody@test.com')).toBeUndefined();
  });

  it('findByEmailWithHash() returns the full record including passwordHash', () => {
    const created = service.create('Hashy', 'hashy@test.com', 'my-secret-hash');
    const record = service.findByEmailWithHash('hashy@test.com');
    expect(record?.passwordHash).toBe('my-secret-hash');
    expect(record?.id).toBe(created.id);
  });

  it('update() changes the name and returns updated user', () => {
    const user = service.create('Dave', 'dave@test.com', 'hashed');
    const updated = service.update(user.id, 'David');
    expect(updated?.name).toBe('David');
    // Verify it actually persisted
    expect(service.findById(user.id)?.name).toBe('David');
  });

  it('update() returns undefined for unknown id', () => {
    expect(service.update('bogus-id', 'NewName')).toBeUndefined();
  });

  it('delete() removes user from store', () => {
    const user = service.create('Eve', 'eve@test.com', 'hashed');
    expect(service.delete(user.id)).toBe(true);
    expect(service.findById(user.id)).toBeUndefined();
  });

  it('delete() returns false for unknown id', () => {
    expect(service.delete('bogus-id')).toBe(false);
  });
});

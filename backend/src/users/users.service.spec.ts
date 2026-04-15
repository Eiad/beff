import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();
    service = module.get<UsersService>(UsersService);
  });

  it('create() returns user without passwordHash', () => {
    const user = service.create('Alice', 'alice@test.com', 'hashed');
    expect(user.name).toBe('Alice');
    expect(user.email).toBe('alice@test.com');
    expect((user as Record<string, unknown>).passwordHash).toBeUndefined();
  });

  it('findById() returns user when it exists', () => {
    const created = service.create('Bob', 'bob@test.com', 'hashed');
    const found = service.findById(created.id);
    expect(found?.id).toBe(created.id);
  });

  it('findById() returns undefined for unknown id', () => {
    expect(service.findById('nonexistent')).toBeUndefined();
  });

  it('findByEmail() returns user by email (case-insensitive)', () => {
    service.create('Carol', 'carol@test.com', 'hashed');
    expect(service.findByEmail('CAROL@TEST.COM')).toBeDefined();
  });

  it('findByEmail() returns undefined for unknown email', () => {
    expect(service.findByEmail('nobody@test.com')).toBeUndefined();
  });

  it('update() changes the name and returns updated user', () => {
    const user = service.create('Dave', 'dave@test.com', 'hashed');
    const updated = service.update(user.id, 'David');
    expect(updated?.name).toBe('David');
  });

  it('delete() removes user from store', () => {
    const user = service.create('Eve', 'eve@test.com', 'hashed');
    service.delete(user.id);
    expect(service.findById(user.id)).toBeUndefined();
  });
});

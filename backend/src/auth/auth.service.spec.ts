import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

// Set JWT_SECRET for tests
process.env.JWT_SECRET = 'test-secret';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService],
    }).compile();
    authService = module.get<AuthService>(AuthService);
  });

  describe('register()', () => {
    it('returns token and user on success', async () => {
      const result = await authService.register('Alice', 'alice@test.com', 'password123');
      expect(result.token).toBeDefined();
      expect(result.user.name).toBe('Alice');
      expect(result.user.email).toBe('alice@test.com');
      expect((result.user as Record<string, unknown>).passwordHash).toBeUndefined();
    });

    it('throws 409 on duplicate email', async () => {
      await authService.register('Alice', 'alice@test.com', 'password123');
      await expect(
        authService.register('Alice2', 'alice@test.com', 'password456'),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login()', () => {
    it('returns token and user on correct credentials', async () => {
      await authService.register('Bob', 'bob@test.com', 'mypassword');
      const result = await authService.login('bob@test.com', 'mypassword');
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe('bob@test.com');
    });

    it('throws 401 on wrong password', async () => {
      await authService.register('Carol', 'carol@test.com', 'rightpass');
      await expect(
        authService.login('carol@test.com', 'wrongpass'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws 401 on unknown email (same error — no user enumeration)', async () => {
      await expect(
        authService.login('nobody@test.com', 'anypass'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});

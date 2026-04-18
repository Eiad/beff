process.env.SQLITE_DB_PATH = ':memory:';
process.env.JWT_SECRET = 'test-secret-e2e';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  // ─── POST /auth/register ───────────────────────────────────────────────────

  describe('POST /auth/register', () => {
    it('200 + { token, user } on valid body', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ name: 'Alice', email: 'alice@test.com', password: 'password123' })
        .expect(200);

      expect(res.body.token).toBeDefined();
      expect(res.body.user.name).toBe('Alice');
      expect(res.body.user.email).toBe('alice@test.com');
      expect(res.body.user.id).toBeDefined();
      expect(res.body.user.createdAt).toBeDefined();
      expect(res.body.user.passwordHash).toBeUndefined();
    });

    it('409 on duplicate email', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ name: 'Alice', email: 'dup@test.com', password: 'password123' });

      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ name: 'Alice2', email: 'dup@test.com', password: 'password456' })
        .expect(409);
    });

    it('400 on missing name', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'noname@test.com', password: 'password123' })
        .expect(400);
    });

    it('400 on invalid email format', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ name: 'Alice', email: 'not-an-email', password: 'password123' })
        .expect(400);
    });

    it('400 on password shorter than 8 characters', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ name: 'Alice', email: 'short@test.com', password: '123' })
        .expect(400);
    });
  });

  // ─── POST /auth/login ──────────────────────────────────────────────────────

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Seed a user to login with
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ name: 'Bob', email: 'bob@test.com', password: 'mypassword' });
    });

    it('200 + { token, user } on correct credentials', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'bob@test.com', password: 'mypassword' })
        .expect(200);

      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe('bob@test.com');
      expect(res.body.user.passwordHash).toBeUndefined();
    });

    it('401 on wrong password', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'bob@test.com', password: 'wrongpass' })
        .expect(401);
    });

    it('401 on unknown email (same error — no user enumeration)', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'nobody@test.com', password: 'anypass' })
        .expect(401);
    });
  });
});

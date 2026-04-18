process.env.SQLITE_DB_PATH = ':memory:';
process.env.JWT_SECRET = 'test-secret-e2e';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('Users (e2e)', () => {
  let app: INestApplication<App>;
  let token: string;
  let userId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Register a fresh user for each test
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ name: 'Test User', email: 'testuser@test.com', password: 'password123' });

    token = res.body.token;
    userId = res.body.user.id;
  });

  afterEach(async () => {
    await app.close();
  });

  // ─── GET /users/me ─────────────────────────────────────────────────────────

  describe('GET /users/me', () => {
    it('200 with valid token', async () => {
      const res = await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.id).toBe(userId);
      expect(res.body.email).toBe('testuser@test.com');
      expect(res.body.passwordHash).toBeUndefined();
    });

    it('401 with no token', async () => {
      await request(app.getHttpServer())
        .get('/users/me')
        .expect(401);
    });

    it('401 with invalid token', async () => {
      await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', 'Bearer totally-invalid-token')
        .expect(401);
    });

    it('401 after account deleted (token still valid but user gone)', async () => {
      // Delete the user
      await request(app.getHttpServer())
        .delete('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      // Token is still valid but user is gone
      await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(401);
    });
  });

  // ─── PATCH /users/me ───────────────────────────────────────────────────────

  describe('PATCH /users/me', () => {
    it('200 + updated name', async () => {
      const res = await request(app.getHttpServer())
        .patch('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Name' })
        .expect(200);

      expect(res.body.name).toBe('Updated Name');
      expect(res.body.passwordHash).toBeUndefined();
    });

    it('400 on empty name', async () => {
      await request(app.getHttpServer())
        .patch('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: '' })
        .expect(400);
    });

    it('401 with no token', async () => {
      await request(app.getHttpServer())
        .patch('/users/me')
        .send({ name: 'New Name' })
        .expect(401);
    });
  });

  // ─── GET /users/me/export ──────────────────────────────────────────────────

  describe('GET /users/me/export', () => {
    it('200 + JSON body + Content-Disposition header + no passwordHash', async () => {
      const res = await request(app.getHttpServer())
        .get('/users/me/export')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.headers['content-disposition']).toMatch(/attachment/);
      expect(res.headers['content-disposition']).toMatch(/beff-data-export/);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.id).toBe(userId);
      expect(res.body.user.passwordHash).toBeUndefined();
      expect(res.body.exportedAt).toBeDefined();
    });

    it('401 with no token', async () => {
      await request(app.getHttpServer())
        .get('/users/me/export')
        .expect(401);
    });
  });

  // ─── DELETE /users/me ──────────────────────────────────────────────────────

  describe('DELETE /users/me', () => {
    it('204 on success', async () => {
      await request(app.getHttpServer())
        .delete('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
    });

    it('GET /users/me returns 401 after deletion', async () => {
      await request(app.getHttpServer())
        .delete('/users/me')
        .set('Authorization', `Bearer ${token}`);

      await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(401);
    });

    it('401 with no token', async () => {
      await request(app.getHttpServer())
        .delete('/users/me')
        .expect(401);
    });
  });
});

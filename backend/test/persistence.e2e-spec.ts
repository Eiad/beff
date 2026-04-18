// Phase 4 headline test: register in app1, close, boot app2 with same DB file,
// log in with the same credentials. Proves SQLite persistence across PM2-style restarts.

process.env.JWT_SECRET = 'test-secret-persistence';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { AppModule } from '../src/app.module';

async function bootApp(): Promise<INestApplication<App>> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = moduleFixture.createNestApplication<App>();
  app.enableShutdownHooks();
  await app.init();
  return app;
}

describe('Persistence (e2e)', () => {
  let tmpDir: string;
  let dbPath: string;

  beforeAll(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'beff-persistence-'));
    dbPath = join(tmpDir, `beff-${randomUUID()}.sqlite`);
    process.env.SQLITE_DB_PATH = dbPath;
  });

  afterAll(() => {
    rmSync(tmpDir, { recursive: true, force: true });
    process.env.SQLITE_DB_PATH = ':memory:';
  });

  it('user registered in app1 can log in after app1 closes and app2 boots on the same file', async () => {
    const email = `persist+${Date.now()}@test.com`;
    const password = 'password123';

    // App 1 — register
    const app1 = await bootApp();
    const registerRes = await request(app1.getHttpServer())
      .post('/auth/register')
      .send({ name: 'Persisty', email, password })
      .expect(200);

    expect(registerRes.body.token).toBeDefined();
    expect(registerRes.body.user.email).toBe(email);
    const userId = registerRes.body.user.id;

    await app1.close();

    // App 2 — same DB file, fresh process-like state
    const app2 = await bootApp();

    const loginRes = await request(app2.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(200);

    expect(loginRes.body.token).toBeDefined();
    expect(loginRes.body.user.id).toBe(userId);
    expect(loginRes.body.user.email).toBe(email);

    const meRes = await request(app2.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${loginRes.body.token}`)
      .expect(200);

    expect(meRes.body.id).toBe(userId);

    await app2.close();
  });
});

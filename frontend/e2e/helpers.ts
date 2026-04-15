import type { Page } from '@playwright/test';

// Unique email per test run to avoid duplicate conflicts across runs
export function uniqueEmail(prefix = 'user') {
  return `${prefix}+${Date.now()}@e2e.test`;
}

// Register a fresh user and land on /dashboard
export async function registerAndLogin(page: Page, name = 'E2E User') {
  const email = uniqueEmail('e2e');
  await page.goto('/register');
  await page.getByLabel('Full name').fill(name);
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel(/^password$/i).fill('testpassword1');
  await page.getByLabel(/confirm password/i).fill('testpassword1');
  await page.getByRole('button', { name: /create account/i }).click();
  await page.waitForURL('**/dashboard');
  return { email, name };
}

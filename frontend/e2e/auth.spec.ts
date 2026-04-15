import { test, expect } from '@playwright/test';
import { uniqueEmail, registerAndLogin } from './helpers';

test.describe('Auth flows', () => {
  test('register → auto-login → dashboard shows user name', async ({ page }) => {
    const { name } = await registerAndLogin(page, 'Alice Tester');
    await expect(page.getByText(`Welcome back, ${name}`)).toBeVisible();
    await expect(page.getByText('Fleet CO₂ Reduced')).toBeVisible();
  });

  test('duplicate email shows inline 409 error', async ({ page }) => {
    const email = uniqueEmail('dup');
    await page.goto('/register');
    // Register first time
    await page.getByLabel('Full name').fill('First User');
    await page.getByLabel('Email address').fill(email);
    await page.getByLabel(/^password$/i).fill('testpassword1');
    await page.getByLabel(/confirm password/i).fill('testpassword1');
    await page.getByRole('button', { name: /create account/i }).click();
    await page.waitForURL('**/dashboard');

    // Clear storage and try to register same email again
    await page.evaluate(() => localStorage.clear());
    await page.goto('/register');
    await page.getByLabel('Full name').fill('Second User');
    await page.getByLabel('Email address').fill(email);
    await page.getByLabel(/^password$/i).fill('testpassword1');
    await page.getByLabel(/confirm password/i).fill('testpassword1');
    await page.getByRole('button', { name: /create account/i }).click();

    // Stays on register page with error
    await expect(page).toHaveURL(/register/);
    await expect(page.getByRole('alert')).toContainText(/already exists/i);
  });

  test('login with correct credentials → dashboard', async ({ page }) => {
    const email = uniqueEmail('login');
    // First register
    await page.goto('/register');
    await page.getByLabel('Full name').fill('Login Tester');
    await page.getByLabel('Email address').fill(email);
    await page.getByLabel(/^password$/i).fill('testpassword1');
    await page.getByLabel(/confirm password/i).fill('testpassword1');
    await page.getByRole('button', { name: /create account/i }).click();
    await page.waitForURL('**/dashboard');

    // Logout
    await page.evaluate(() => localStorage.clear());
    await page.goto('/login');

    // Login
    await page.getByLabel('Email address').fill(email);
    await page.getByLabel('Password').fill('testpassword1');
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL('**/dashboard');
    await expect(page.getByText(/welcome back/i)).toBeVisible();
  });

  test('login with wrong password shows 401 error', async ({ page }) => {
    const email = uniqueEmail('wrongpw');
    await page.goto('/register');
    await page.getByLabel('Full name').fill('Wrong PW');
    await page.getByLabel('Email address').fill(email);
    await page.getByLabel(/^password$/i).fill('testpassword1');
    await page.getByLabel(/confirm password/i).fill('testpassword1');
    await page.getByRole('button', { name: /create account/i }).click();
    await page.waitForURL('**/dashboard');

    await page.evaluate(() => localStorage.clear());
    await page.goto('/login');
    await page.getByLabel('Email address').fill(email);
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL(/login/);
    await expect(page.getByRole('alert')).toContainText(/invalid/i);
  });

  test('refresh /dashboard while logged in → stays on dashboard', async ({ page }) => {
    await registerAndLogin(page);
    await page.reload();
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByText(/welcome back/i)).toBeVisible();
  });

  test('visit /dashboard in fresh browser (no token) → redirects to /login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/login/);
  });

  test('visit /login while logged in → redirects to /dashboard', async ({ page }) => {
    await registerAndLogin(page);
    await page.goto('/login');
    await expect(page).toHaveURL(/dashboard/);
  });
});

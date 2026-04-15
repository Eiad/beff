import { test, expect } from '@playwright/test';
import { registerAndLogin } from './helpers';

test.describe('Profile flows', () => {
  test('edit name → dashboard greeting updates', async ({ page }) => {
    await registerAndLogin(page, 'Name Before');
    await page.goto('/profile');

    // Click pencil icon to enter edit mode
    await page.getByLabel('Edit name').click();
    const input = page.getByRole('textbox');
    await input.fill('Name After');
    await page.getByLabel('Save name').click();

    // Name updates inline on profile
    await expect(page.getByText('Name After')).toBeVisible();

    // Soft-navigate to dashboard via navbar link (preserves React state — JWT still has old name)
    await page.getByRole('link', { name: 'Dashboard' }).click();
    await page.waitForURL('**/dashboard');
    await expect(page.getByText('Welcome back, Name After')).toBeVisible();
  });

  test('Escape key cancels name edit', async ({ page }) => {
    const { name } = await registerAndLogin(page, 'Cancel Test');
    await page.goto('/profile');
    await page.getByLabel('Edit name').click();
    await page.getByRole('textbox').fill('Something else');
    await page.keyboard.press('Escape');
    // Input should be gone and original name still shows
    await expect(page.getByLabel('Save name')).not.toBeVisible();
    await expect(page.getByText(name)).toBeVisible();
  });

  test('export data → file download triggered', async ({ page }) => {
    await registerAndLogin(page);
    await page.goto('/profile');

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /export/i }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/beff-data-export/);
  });

  test('delete account → modal appears → cancel → still logged in', async ({ page }) => {
    await registerAndLogin(page);
    await page.goto('/profile');

    await page.getByRole('button', { name: /delete/i }).first().click();
    await expect(page.getByText(/delete your account\?/i)).toBeVisible();
    await page.getByRole('button', { name: /cancel/i }).click();
    // Modal closed, still on profile
    await expect(page).toHaveURL(/profile/);
    await expect(page.getByText(/delete your account\?/i)).not.toBeVisible();
  });

  test('delete account → confirm → redirected to /, token gone', async ({ page }) => {
    await registerAndLogin(page);
    await page.goto('/profile');

    await page.getByRole('button', { name: /delete/i }).first().click();
    await expect(page.getByText(/delete your account\?/i)).toBeVisible();
    await page.getByRole('button', { name: /delete account/i }).click();

    // Should redirect to landing page
    await page.waitForURL('**/');
    // Token should be gone
    const token = await page.evaluate(() => localStorage.getItem('beff_auth_token'));
    expect(token).toBeNull();
  });
});

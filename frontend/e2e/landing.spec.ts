import { test, expect } from '@playwright/test';

test.describe('Landing page', () => {
  test('loads and shows hero headline', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Beff/i }).first()).toBeVisible();
    await expect(page.getByText(/greener business/i).first()).toBeVisible();
  });

  test('"Join the Waitlist" CTA navigates to /register', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /join the waitlist/i }).first().click();
    await expect(page).toHaveURL(/register/);
  });

  test('features section is present', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Carbon Intelligence')).toBeVisible();
    await expect(page.getByText('Compliance Automation')).toBeVisible();
    await expect(page.getByText('Team Engagement')).toBeVisible();
  });

  test('mobile viewport — hamburger menu opens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const hamburger = page.getByLabel(/open menu/i);
    await expect(hamburger).toBeVisible();
    await hamburger.click();
    // Mobile menu renders after the desktop nav in DOM — use last() to get the mobile menu item
    await expect(page.getByText(/join early access/i).last()).toBeVisible();
  });
});

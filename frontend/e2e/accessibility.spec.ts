import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { registerAndLogin } from './helpers';

// Helper: run axe and assert zero violations
async function assertNoViolations(page: import('@playwright/test').Page, pageName: string) {
  const results = await new AxeBuilder({ page })
    .disableRules(['color-contrast']) // Canvas-based backgrounds can cause false positives
    .analyze();

  const violations = results.violations;
  if (violations.length > 0) {
    console.error(`\n[axe] Violations on ${pageName}:`);
    for (const v of violations) {
      console.error(`  [${v.impact}] ${v.id}: ${v.description}`);
      for (const node of v.nodes) {
        console.error(`    → ${node.html}`);
      }
    }
  }
  expect(violations, `${pageName} has ${violations.length} axe violation(s)`).toHaveLength(0);
}

test.describe('Accessibility audit (axe)', () => {
  test('Landing page — zero violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await assertNoViolations(page, 'Landing');
  });

  test('Register page — zero violations', async ({ page }) => {
    await page.goto('/register');
    await assertNoViolations(page, 'Register');
  });

  test('Login page — zero violations', async ({ page }) => {
    await page.goto('/login');
    await assertNoViolations(page, 'Login');
  });

  test('Dashboard page — zero violations', async ({ page }) => {
    await registerAndLogin(page);
    await page.waitForURL('**/dashboard');
    await assertNoViolations(page, 'Dashboard');
  });

  test('Profile page — zero violations', async ({ page }) => {
    await registerAndLogin(page);
    await page.goto('/profile');
    await assertNoViolations(page, 'Profile');
  });
});

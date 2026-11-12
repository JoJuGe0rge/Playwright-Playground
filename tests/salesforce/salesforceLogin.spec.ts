import { test, expect } from '@playwright/test';
import { loginToSalesforce } from '../../auth/salesforce-auth';

test('Accounts list opens', async ({ page }) => {
  test.setTimeout(120_000); // JWT exchange + Lightning load can be slow
  await loginToSalesforce(page, '/lightning/o/Account/list');
  await page.pause(); 
  await expect(page).toHaveURL(/lightning\/o\/Account\/list/, { timeout: 30_000 });
  await expect(page).toHaveTitle(/Accounts/, { timeout: 30_000 });
  await expect(page.getByRole('grid').first()).toBeVisible({ timeout: 30_000 });
  
});
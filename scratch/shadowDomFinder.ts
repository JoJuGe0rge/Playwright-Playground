import { test, expect } from '@playwright/test';

test('shadow dom button is findable', async ({ page }) => {
  await page.goto('file://' + 'C:\\Users\\U425521\\Downloads' + '/shadow-demo.html');  // adjust path as needed
  const shadowButton = page.locator('#shadow-button');
  await expect(shadowButton).toBeVisible();
});
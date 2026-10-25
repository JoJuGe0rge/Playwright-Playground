import {expect, test} from "@playwright/test";

test('shows a mocked fruit', async ({ page }) => {
  await page.route('**/api/v1/fruits', async route => {
    const res=await route.fetch();
    const fruits=await res.json();
    fruits.push({ name: 'Sappotta', id: 21 });
    await route.fulfill({response:res, json: fruits });
  });

  await page.goto('https://demo.playwright.dev/api-mocking');
  await expect(page.getByText('Strawberry')).toBeVisible();
  await expect(page.getByText('Sappotta')).toBeVisible();
});

test('network error', async ({ page }) => {
  await page.route('**/api/v1/fruits', async route => {
    await route.abort('failed');
    });
  await page.goto('https://demo.playwright.dev/api-mocking');
  await page.pause();
});
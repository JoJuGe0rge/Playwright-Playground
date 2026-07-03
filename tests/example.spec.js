// @ts-check
import { test, expect } from '@playwright/test';

// test('has title', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });


const getCoffee = () => {
  console.log('getCoffee function called');
  await wait(3000);
  return 'Coffee is ready!';
};

const doLaundry = () => {
  console.log('doLaundry function called');
  return 'Laundry is done!';
};

const doDishes = () => {
  console.log('doDishes function called');
  return 'Dishes are done!';
};

getCoffee().then(console.log);
console.log(doLaundry());
console.log(doDishes());

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });

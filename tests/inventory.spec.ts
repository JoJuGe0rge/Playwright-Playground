import { expect } from '@playwright/test';
import { test} from '../fixtures';
import InventoryPage from '../pages/homeProducts';

test('add product to cart', async ({ authenticatedPage }) => {
  const inventoryPage = new InventoryPage(authenticatedPage);
  await inventoryPage.addToCart('Sauce Labs Backpack');
  expect(await inventoryPage.getCartCount()).toBe('1');
});

test('sort products by name', async ({ authenticatedPage }) => {
  const inventoryPage = new InventoryPage(authenticatedPage);
  await inventoryPage.sortProductsBy('Price (low to high)');
  const firstProductPrice = await inventoryPage.getNthProductPrice(0);
  console.log('First product price:', firstProductPrice);
  const secondProductPrice = await inventoryPage.getNthProductPrice(1);
  console.log('Second product price:', secondProductPrice);
  await expect(firstProductPrice).toBeLessThan(secondProductPrice);
});


test('javascript popup test', async ({ page }) => {
  page.on('dialog', async(dialog) => {
    console.log(`Dialog message: ${dialog.message()}`);
    await dialog.accept();
  });
});


test('new tab openedv test', async ({ page }) => {
  const [newPage] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('link', { name: 'Twitter' }).click()
  ]);
  await newPage.waitForLoadState();
});
import { test, expect } from '@playwright/test';
import LoginPage from '../pages/loginpage';
import InventoryPage from '../pages/homeProducts';

test('add product to cart', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('standard_user', 'secret_sauce');
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.addToCart('Sauce Labs Backpack');
  expect(await inventoryPage.getCartCount()).toBe('2');
});

test('sort products by name', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('standard_user', 'secret_sauce');
  //await page.pause();

  const inventoryPage = new InventoryPage(page);
  await inventoryPage.sortProductsBy('Price (low to high)');
  const firstProductPrice = await inventoryPage.getNthProductPrice(0);
  console.log('First product price:', firstProductPrice);
  const secondProductPrice = await inventoryPage.getNthProductPrice(1);
  console.log('Second product price:', secondProductPrice);
  await expect(firstProductPrice).toBeLessThan(secondProductPrice);
}); 
  
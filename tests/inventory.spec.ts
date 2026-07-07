import { test, expect } from '@playwright/test';
import LoginPage from '../pages/loginpage';
import InventoryPage from '../pages/homeProducts';

test('add product to cart', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('standard_user', 'secret_sauce');
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.addToCart('Sauce Labs Backpack');
  //const cartCount = await inventoryPage.getCartCount();
  //await expect(cartCount).toBe('1');
  expect(await inventoryPage.getCartCount()).toBe('2');
});


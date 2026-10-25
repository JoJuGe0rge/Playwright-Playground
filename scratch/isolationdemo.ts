import {expect } from "@playwright/test";
import { test } from "../fixtures";
import InventoryPage from "../pages/homeProducts";
import products from "../test_data/products.json" with { type: 'json' };

test('add the backpack to the cart', async ({ authenticatedPage }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    await inventoryPage.addToCart(products.backpack);
    expect(await inventoryPage.getCartCount()).toBe('1');
});


test('check that the cart badge isn’t there', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.locator('.shopping_cart_badge')).toHaveCount(0);
});


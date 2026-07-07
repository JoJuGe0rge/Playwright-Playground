import type { Page } from '@playwright/test';

class InventoryPage {
  constructor(private page: Page) {}

  async addToCart(productName: string) {
    const tile = this.page.locator('[data-test="inventory-item"]').filter({ hasText: productName });
    await tile.getByRole('button', { name: 'Add to cart' }).click();
  }

  async getCartCount() {
    return await this.page.locator('.shopping_cart_badge').innerText();
  }

  async sortProductsBy(sortOption: string) {
    const sort_Locator = this.page.locator('[data-test="product-sort-container"]');
    await sort_Locator.selectOption(sortOption);

  }

  private getTileByIndex(n: number) {
    return this.page.locator('[data-test="inventory-item"]').nth(n);
  }

  async getNthProductPrice(n: number) {
    const priceText = await this.getTileByIndex(n).locator('.inventory_item_price').innerText();
    return parseFloat(priceText.replace('$', ''));
  }


}


export { InventoryPage as default };
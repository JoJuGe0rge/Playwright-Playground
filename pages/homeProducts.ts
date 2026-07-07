import type { Page } from '@playwright/test';

class InventoryPage {
  constructor(private page: Page) {}

  async addToCart(productName: string) {
    const tile = this.page.locator('[data-test="inventory-item"]').filter({ hasText: productName });
    await tile.getByRole('button', { name: 'Add to cart' }).click();
  }

  async getCartCount() {
    return await this.page.locator('.shopping_cart_badger').innerText();
  }

}

export { InventoryPage as default };
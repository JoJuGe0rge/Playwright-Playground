import type { Page} from '@playwright/test';

class InventoryPage {
  constructor(private page: Page) {}

  async addToCart(productName: string) {
    const tile = this.page.locator('[data-test="inventory-item"]').filter({ hasText: productName });
    await tile.getByRole('button', { name: 'Add to cart' }).click();
  }
}

export { InventoryPage as default };
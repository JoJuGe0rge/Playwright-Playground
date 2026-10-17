import type { Page, Locator } from '@playwright/test';
import type { UserInfo } from '../test_data/randomUser';

class CheckoutPage {
  page: Page;
  firstNameInput: Locator;
  lastNameInput: Locator;
  postalCodeInput: Locator;
  continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
  }

  async fillShippingInfo(user: UserInfo) {
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.postalCodeInput.fill(user.postalCode);
    await this.continueButton.click();
  }
}

export default CheckoutPage;
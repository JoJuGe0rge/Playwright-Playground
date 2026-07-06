// @ts-check
import type { Page} from '@playwright/test';

class LoginPage {
  page: Page;
  userName_Locator;
  password_Locator;
  loginButton_Locator;

  constructor(page: Page) {
    this.page = page;
    this.userName_Locator = page.locator('#user-name');
    this.password_Locator = page.locator('#password');
    this.loginButton_Locator = page.getByRole('button', { name: 'Login' });
  }

  async login(username: string, password: string)
  {
    await this.page.goto('https://www.saucedemo.com/');
    await this.userName_Locator.fill(username);
    await this.password_Locator.fill(password);
    await this.loginButton_Locator.click();
  }
}


export { LoginPage as default };
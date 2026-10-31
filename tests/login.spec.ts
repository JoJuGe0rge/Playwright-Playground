import { test, expect } from '@playwright/test';
import LoginPage from '../pages/loginpage';

test.use({ storageState: { cookies: [], origins: [] } });
test('login to Swag labs', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

  console.log("user:" , process.env.SF_USERNAME);
});



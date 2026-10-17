import type { Page } from '@playwright/test';
import LoginPage from './pages/loginpage';
import { test as base } from '@playwright/test';

type MyFixtures = {
  loginPage: LoginPage;
  authenticatedPage: Page;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  authenticatedPage: async ({ page, loginPage }, use) => {
    await loginPage.login(process.env.STANDARD_USER!, process.env.STANDARD_PASSWORD!  );
    await use(page);
  },
});

export { expect } from '@playwright/test';
// import { test as setup, expect } from '@playwright/test';
// import { getSalesforceAccessToken } from '../auth/salesforce-auth';

// const authFile = '.auth/user.json';

// setup('authenticate via JWT', async ({ page }) => {
//   const { access_token, instance_url } = await getSalesforceAccessToken();
//   console.log(`JWT exchange succeeded for ${instance_url}`); // never log the token

//   const frontdoor = new URL('/secur/frontdoor.jsp', instance_url);
//   frontdoor.searchParams.set('sid', access_token);
//   frontdoor.searchParams.set('retURL', '/lightning/page/home');

//   await page.goto(frontdoor.href, { waitUntil: 'domcontentloaded' });
//   await page.waitForURL('**/lightning/**', { timeout: 60_000 });
//   await expect(page).not.toHaveURL(/login/);

//   await page.context().storageState({ path: authFile });
// });



import test,{expect} from '@playwright/test';
import loginPage from '../pages/loginpage';
import envCheck from '../utils/env';

test('log in to my page', async ({ page }) => {
    const login = new loginPage(page);
    await login.login(envCheck.requireEnv('STANDARD_USERs'), envCheck.requireEnv('STANDARD_PASSWORD'));
    await page.context().storageState({ path: 'playwright/.auth/user.json' });
    expect(page.url()).toContain('/inventory.html');
    console.log('setup completed', loginPage);
});
import { test, expect } from '@playwright/test';

var SF_URL = 'https://test.salesforce.com/';


test('navigate to home page', async ({ page }) => {
    await page.goto("https://danfossonecrm--onecrmuat.sandbox.lightning.force.com/lightning/page/home");
    console.log('Page title is: ' + await page.title());
    await page.waitForTimeout(100000);
    
    await expect(page).toHaveTitle(/Salesforce/);
} )

// test('navigate to accounts tab via app launcher', async ({ page }) => {
//     await page.goto(SF_URL);
//     console.log('Page title is: ' + await page.title());
//     await expect(page).toHaveTitle(/Salesforce/);
//     await page.getByRole('textbox', { name: 'Username' }).click();
//     await page.getByRole('textbox', { name: 'Username' }).fill('test.cpquser@danfossonecrm.com.onecrmuat');
//     await page.getByRole('button', { name: 'Log In to Sandbox' }).click();
//     await page.getByRole('textbox', { name: 'Password' }).click();
//     await page.getByRole('textbox', { name: 'Password' }).fill('Tosca@123$');
//     await page.getByRole('button', { name: 'Log In to Sandbox' }).click();

//     await page.getByRole('textbox', { name: 'Verification Code' }).fill('115598');
//     await page.getByRole('button', { name: 'Verify' }).click();
//     if(await page.getByRole('button', { name: 'App Launcher' }).toBeVisible()===true)
//       {await page.waitForTimeout(5000);}
//   await page.getByRole('combobox', { name: 'Search apps and items...' }).click();
//   await page.getByRole('button', { name: 'Search' }).click();
//   await page.getByRole('searchbox', { name: 'Search...' }).click();
//   await page.getByRole('button', { name: 'App Launcher' }).click();
//   await page.getByRole('combobox', { name: 'Search apps and items...' }).click();
//   await page.getByRole('option', { name: 'Sales', exact: true }).click();
// });

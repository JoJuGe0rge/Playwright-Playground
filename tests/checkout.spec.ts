import { test, expect } from '../fixtures';
import CheckoutPage from '../pages/checkoutpage';
import { createRandomUser } from '../test_data/randomUser';
import {faker} from '@faker-js/faker';

test('checkout with a random user', async ({ authenticatedPage }) => {
  test.step('Navigate to checkout page', async () => {
    await authenticatedPage.goto('/checkout-step-one.html');
  });

  test.step('create a random user and fill in the shipping info', async () => {
  const seed = Number(process.env.SEED) || Date.now();
  console.log('Using seed:', seed);
  await faker.seed(seed); // Set a seed for reproducibility
  const user = createRandomUser();
  console.log('Using user:', user);

  const checkoutPage = new CheckoutPage(authenticatedPage);
  await checkoutPage.fillShippingInfo(user);
  });

  test.step('Verify that the user is navigated to the next page', async () => {
    //await authenticatedPage.waitForTimeout(5000);
    await expect(authenticatedPage).toHaveURL(/checkout-step-two/);
  });
  
});
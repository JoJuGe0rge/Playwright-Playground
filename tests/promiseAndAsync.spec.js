// @ts-check
import { test, expect } from '@playwright/test';

const getCoffee = () => {
  const startTime = Date.now();
  console.log("getCoffee function called");
  return new Promise((resolve) => {
    setTimeout(() => {
      const endTime = Date.now();
      console.log("Coffee finished in: " + (endTime - startTime));
      resolve('Coffee is ready!');
    }, 5000);
  });
};

const doLaundry = () => {
  const startTime = Date.now();
  console.log("doLaundry function called");
  return new Promise((resolve) => {
    setTimeout(() => {
      const endTime = Date.now();
      console.log("Laundry finished in: " + (endTime - startTime));
      resolve('Laundry is done!');
    }, 2000);
  });
};

const doDishes = () => {
  const startTime = Date.now();
  console.log("doDishes function called");
  return new Promise((resolve) => {
    setTimeout(() => {
      const endTime = Date.now();
      console.log("Dishes finished in: " + (endTime - startTime));
      resolve('Dishes are done!');
    }, 3000);
  });
};

test('runs in Playwright', async () => {
  await getCoffee();
  await doLaundry();
  await doDishes();
  const results = await Promise.all([getCoffee(), doLaundry(), doDishes()]);
  console.log(results);
});


import test, { expect } from "@playwright/test";

test('Flaky Demo', async ({}, testInfo) => {
    console.log(`Running test: ${testInfo.title}, Retry: ${testInfo.retry}`); 
    // testInfo.retry is 0 on the first attempt, 1 on the first retry, and so on
    expect(testInfo.retry % 2).toBe(1); // This assertion fails on retries, causing the test to be flaky
});
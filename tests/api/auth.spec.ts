import { test, expect } from '@playwright/test';
import { requireEnv } from '../../utils/env';

const url='https://httpbin.org/bearer';

test('get request with no token', async ({ request }) => {
  const response = await request.get(url);
  expect(response.status(), 'GET without token').toBe(401);
});

test('get request with token', async ({ request }) => {
    const token=requireEnv('API_TOKEN')
    const response = await request.get(url, {
    headers: {Authorization: `Bearer ${token}`},
    });
    expect(response.status(), 'GET with token').toBe(200);
    const body = await response.json();
    expect(body).toBeDefined();
    console.log('isAuthenticated:',body.authenticated);
});
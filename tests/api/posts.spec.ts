import { test, expect } from '@playwright/test';

test('get a post', async ({ request }) => {
  const response = await request.get('/posts/1');
  expect(response.status(), 'GET /posts/1 should succeed').toBe(200);
  const body = await response.json();
  expect(body.id).toBe(1);
});

test('create a post', async ({ request }) => {
  const response = await request.post('/posts', {
    data: { title: 'My first post', body: 'Some randomized text', userId: 1 },
  });
  expect(response.status(), 'POST /posts should succeed').toBe(201);
  const body = await response.json();
  console.log('Created post:',body.body,'with id:', body.id);
  expect(body.title).toBe('My first post');
  expect(body.body).toBe('Some randomized text');
  expect(body.userId).toBeDefined();
});

import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import schema from '../../schemas/post.schema.json' with {type: 'json'};

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

test('match a post', async ({ request }) => {
  const response = await request.get('/posts/1');
  expect(response.status(), 'GET /posts/1 should succeed').toBe(200);
  const body = await response.json();
  expect(body).toMatchObject({
    id: expect.any(Number),
    title: expect.any(String),
    body: expect.any(String),
    userId: expect.any(Number),
  });
});

test('check against schema', async ({ request }) => {
  const response = await request.get('/posts/1');
  expect(response.status(), 'GET /posts/1 should have succeeded').toBe(200);

  const body = await response.json();

  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const valid = validate(body);
  expect(valid, JSON.stringify(validate.errors)).toBe(true);

});

test('wrong path should return 404', async ({ request }) => {
  const response = await request.get('/posts/999999');
  console.log('Response body for GET /posts/999999:', await response.json());
  expect(response.status(), 'GET /posts/999999 should return 404').toBe(404);
});

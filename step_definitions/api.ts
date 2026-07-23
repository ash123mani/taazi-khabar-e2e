import assert from 'assert';
import { Given, When, Then } from '@cucumber/cucumber';
import { World } from '../support/world';

const BE = 'http://localhost:8000';

// --- Given ---

Given('the application is running', function () {
  // Verified by BeforeAll in hooks — servers must be up
});

Given('a test user exists', function (this: World) {
  assert.ok(this.state.accessToken, 'accessToken should be set');
});

Given("I have that user's access token", function (this: World) {
  assert.ok(this.state.accessToken, 'accessToken should be set');
});

Given('I have a valid access token', function (this: World) {
  assert.ok(this.state.accessToken, 'accessToken should be set');
});

Given('an article exists in the system', function (this: World) {
  assert.ok(this.state.articleId, 'articleId should be set');
});

// --- When: Auth API ---

When('I call the backend health endpoint', async function (this: World) {
  this.state.lastResponse = await this.apiContext.get(`${BE}/api/health`);
});

When('I call the backend register API with new credentials', async function (this: World) {
  const email = `api-${Date.now()}@test.com`;
  this.state.lastResponse = await this.apiContext.post(`${BE}/api/auth/register`, {
    data: { email, password: 'Test1234!', name: 'API Tester' },
  });
  const body = await this.state.lastResponse!.json();
  this.state.testEmail = email;
  this.state.accessToken = body.access_token;
});

When('I call the backend login API with those credentials', async function (this: World) {
  this.state.lastResponse = await this.apiContext.post(`${BE}/api/auth/login`, {
    data: { email: this.state.testEmail, password: this.state.testPassword },
  });
});

When('I call the backend login API with wrong password', async function (this: World) {
  this.state.lastResponse = await this.apiContext.post(`${BE}/api/auth/login`, {
    data: { email: this.state.testEmail, password: 'wrongpassword' },
  });
});

When('I call the backend \\/me API without a token', async function (this: World) {
  this.state.lastResponse = await this.apiContext.get(`${BE}/api/auth/me`);
});

When('I call the backend \\/me API with my token', async function (this: World) {
  this.state.lastResponse = await this.apiContext.get(`${BE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${this.state.accessToken}` },
  });
});

When('I call the backend \\/me API with an invalid token', async function (this: World) {
  this.state.lastResponse = await this.apiContext.get(`${BE}/api/auth/me`, {
    headers: { Authorization: 'Bearer invalid-token' },
  });
});

When('I call the backend quizzes summary API without a token', async function (this: World) {
  this.state.lastResponse = await this.apiContext.get(`${BE}/api/quizzes/by-date`);
});

When('I call the backend quiz detail API without a token', async function (this: World) {
  this.state.lastResponse = await this.apiContext.get(`${BE}/api/quizzes/00000000-0000-0000-0000-000000000000`);
});

When('I call the backend articles API', async function (this: World) {
  this.state.lastResponse = await this.apiContext.get(`${BE}/api/articles?limit=5`);
});

When('I call the backend categories API', async function (this: World) {
  this.state.lastResponse = await this.apiContext.get(`${BE}/api/categories`);
});

// --- Then: API Assertions ---

Then('I should receive a 200 status', async function (this: World) {
  assert.ok(this.state.lastResponse);
  assert.strictEqual(this.state.lastResponse.status(), 200);
});

Then('I should receive a 200 status with status {string}', async function (this: World, expectedStatus: string) {
  assert.ok(this.state.lastResponse);
  assert.strictEqual(this.state.lastResponse.status(), 200);
  const body = await this.state.lastResponse.json();
  assert.strictEqual(body.status, expectedStatus);
});

Then('I should receive a 201 status', async function (this: World) {
  assert.ok(this.state.lastResponse);
  assert.strictEqual(this.state.lastResponse.status(), 201);
});

Then('I should receive a 401 status', async function (this: World) {
  assert.ok(this.state.lastResponse);
  assert.strictEqual(this.state.lastResponse.status(), 401);
});

Then('the response should contain an access token', async function (this: World) {
  assert.ok(this.state.lastResponse);
  const body = await this.state.lastResponse.json();
  assert.ok(body.access_token, 'access_token should be present');
});

Then('the response should contain my user email', async function (this: World) {
  assert.ok(this.state.lastResponse);
  const body = await this.state.lastResponse.json();
  assert.strictEqual(body.email, this.state.testEmail);
});

Then('the response should contain a list of articles', async function (this: World) {
  assert.ok(this.state.lastResponse);
  const body = await this.state.lastResponse.json();
  const list = Array.isArray(body) ? body : body.articles;
  assert.ok(Array.isArray(list), 'response should contain an articles array');
});

Then('the response should contain a list of categories', async function (this: World) {
  assert.ok(this.state.lastResponse);
  const body = await this.state.lastResponse.json();
  const list = Array.isArray(body) ? body : body.categories;
  assert.ok(Array.isArray(list), 'response should contain a categories array');
});

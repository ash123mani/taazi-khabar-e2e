import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { World } from '../support/world';

Given('I have a unique email address', function (this: World) {
  this.state.testEmail = `e2e-reg-${Date.now()}${Math.random().toString(36).slice(2, 6)}@test.com`;
});

Given('I have already registered an account', function (this: World) {
  // User already created in Before hook
  expect(this.state.accessToken).toBeTruthy();
});

Given('I have a registered account', function (this: World) {
  expect(this.state.accessToken).toBeTruthy();
});

Given('I am logged in', async function (this: World) {
  await this.page.goto('/login');
  await this.page.locator('#email').fill(this.state.testEmail);
  await this.page.locator('#password').fill(this.state.testPassword);
  await this.page.getByRole('button', { name: /^sign in$/i }).click();
  await this.page.waitForURL('**/');
});

When('I visit the homepage', async function (this: World) {
  await this.page.goto('/');
});

When('I visit the login page', async function (this: World) {
  await this.page.goto('/login');
});

When('I visit the registration page', async function (this: World) {
  await this.page.goto('/register');
});

When('I visit the bookmarks page', async function (this: World) {
  await this.page.goto('/bookmarks');
});

When('I fill the registration form with my details', async function (this: World) {
  await this.page.getByPlaceholder('Your full name').fill(this.state.testName);
  await this.page.getByPlaceholder('you@example.com').fill(this.state.testEmail);
  await this.page.getByPlaceholder('At least 6 characters').fill(this.state.testPassword);
});

When('I submit the registration form', async function (this: World) {
  await this.page.getByRole('button', { name: /create account/i }).click();
});

When('I try to register again with the same email', async function (this: World) {
  await this.page.goto('/register');
  await this.page.getByPlaceholder('Your full name').fill(this.state.testName);
  await this.page.getByPlaceholder('you@example.com').fill(this.state.testEmail);
  await this.page.getByPlaceholder('At least 6 characters').fill(this.state.testPassword);
  await this.page.getByRole('button', { name: /create account/i }).click();
});

When('I fill the login form with my credentials', async function (this: World) {
  await this.page.locator('#email').fill(this.state.testEmail);
  await this.page.locator('#password').fill(this.state.testPassword);
});

When('I submit the login form', async function (this: World) {
  await this.page.getByRole('button', { name: /^sign in$/i }).click();
});

Then('I should be redirected to the homepage', async function (this: World) {
  await this.page.waitForURL('**/');
  expect(this.page.url()).not.toContain('/login');
  expect(this.page.url()).not.toContain('/register');
});

Then('I should have a valid session cookie', async function (this: World) {
  const cookies = await this.page.context().cookies();
  const sessionCookie = cookies.find((c) => c.name.includes('next-auth.session-token'));
  expect(sessionCookie).toBeDefined();
});

Then('I should see a login form with email and password fields', async function (this: World) {
  await expect(this.page.locator('#email')).toBeVisible();
  await expect(this.page.locator('#password')).toBeVisible();
});

Then('I should see a registration form with name, email, and password fields', async function (this: World) {
  await expect(this.page.getByPlaceholder('Your full name')).toBeVisible();
  await expect(this.page.getByPlaceholder('you@example.com')).toBeVisible();
  await expect(this.page.getByPlaceholder('At least 6 characters')).toBeVisible();
});

Then('I should see a {string} error message', async function (this: World, message: string) {
  await expect(this.page.getByText(new RegExp(message, 'i'))).toBeVisible({ timeout: 10000 });
});

Then('I should be redirected to the login page', async function (this: World) {
  await expect(this.page).toHaveURL(/\/login/);
});

Then('I should see the site title {string}', async function (this: World, title: string) {
  await expect(this.page.locator(`text=${title}`).first()).toBeVisible();
});

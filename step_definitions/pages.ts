import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { World } from '../support/world';

// --- Navigation ---

When('I visit that article page', async function (this: World) {
  if (!this.state.articleId) throw new Error('No article ID available');
  await this.page.goto(`/article/${this.state.articleId}`);
});

When('I visit the quiz page', async function (this: World) {
  await this.page.goto('/quiz');
});

When('I visit the history page', async function (this: World) {
  await this.page.goto('/history');
});

When('I visit the analytics page', async function (this: World) {
  await this.page.goto('/analytics');
});

// --- Assertions: Homepage ---

Then('I should see the news feed', async function (this: World) {
  await expect(this.page.locator('text=Taazi Khabar').first()).toBeVisible();
});

Then('I should see at least one article card', async function (this: World) {
  await expect(this.page.locator('.newspaper-heading').first()).toBeVisible({ timeout: 10000 });
});

// --- Assertions: Article Detail ---

Then('I should see the article headline', async function (this: World) {
  await expect(this.page.locator('h1').first()).toBeVisible({ timeout: 10000 });
});

Then('I should see the article body', async function (this: World) {
  await expect(this.page.locator('p').first()).toBeVisible({ timeout: 5000 });
});

// --- Assertions: Quiz ---

Then('I should see the quiz listing', async function (this: World) {
  await expect(this.page.getByText(/Quiz/i).first()).toBeVisible({ timeout: 10000 });
});

Then('I should see the daily quiz summary', async function (this: World) {
  // Wait for the page to load and check for category/article data
  await expect(this.page.locator('text=Questions').first()).toBeVisible({ timeout: 10000 });
});

// --- Assertions: Login ---

Then('I should see the login form', async function (this: World) {
  await expect(this.page.locator('#email')).toBeVisible();
  await expect(this.page.locator('#password')).toBeVisible();
});

Then('I should see a sign-in button', async function (this: World) {
  await expect(this.page.getByRole('button', { name: /^sign in$/i })).toBeVisible();
});

// --- Assertions: Register ---

Then('I should see the registration form', async function (this: World) {
  await expect(this.page.getByPlaceholder('Your full name')).toBeVisible();
  await expect(this.page.getByPlaceholder('you@example.com')).toBeVisible();
});

Then('I should see a create account button', async function (this: World) {
  await expect(this.page.getByRole('button', { name: /create account/i })).toBeVisible();
});

// --- Assertions: Bookmarks ---

Then('I should see my bookmarks list', async function (this: World) {
  await expect(this.page.getByText(/Bookmarks/i).first()).toBeVisible({ timeout: 10000 });
});

// --- Assertions: History ---

Then('I should see my quiz history', async function (this: World) {
  await expect(this.page.getByText(/History/i).first()).toBeVisible({ timeout: 10000 });
});

// --- Assertions: Analytics ---

Then('I should see the analytics dashboard', async function (this: World) {
  await expect(this.page.getByText(/Analytics/i).first()).toBeVisible({ timeout: 10000 });
});

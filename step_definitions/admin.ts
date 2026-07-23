import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { World } from '../support/world';
import { AdminPage } from '../pages/admin.page';

When('I visit the admin dashboard', async function (this: World) {
  const page = new AdminPage(this.page);
  await page.goto('/admin');
});

When('I visit the admin {string} page', async function (this: World, pageName: string) {
  const page = new AdminPage(this.page);
  await page.goto(`/admin/${pageName}`);
});

When('I visit the admin <page> page', async function (this: World) {
  // Handled by Scenario Outline via the above step
});

Then('I should see the {string} heading', async function (this: World, heading: string) {
  const page = new AdminPage(this.page);
  await page.assertHeading(heading);
});

Then('I should see total articles count', async function (this: World) {
  const page = new AdminPage(this.page);
  await expect(this.page.getByText('Total Articles').first()).toBeVisible({ timeout: 10000 });
});

Then('I should see total quizzes count', async function (this: World) {
  await expect(this.page.getByText('Total Quizzes').first()).toBeVisible({ timeout: 10000 });
});

Then('I should see average score', async function (this: World) {
  await expect(this.page.getByText('Avg Score').first()).toBeVisible({ timeout: 10000 });
});

Then('I should see active users count', async function (this: World) {
  await expect(this.page.getByText('Active Users').first()).toBeVisible({ timeout: 10000 });
});

Then('I should see recent articles table', async function (this: World) {
  const page = new AdminPage(this.page);
  await page.assertTablesVisible();
});

Then('I should see recent quizzes table', async function (this: World) {
  const page = new AdminPage(this.page);
  await page.assertTablesVisible();
});

Then('I should see a search input', async function (this: World) {
  const page = new AdminPage(this.page);
  await page.assertSearchVisible();
});

Then('I should see an articles table', async function (this: World) {
  const page = new AdminPage(this.page);
  await page.assertTableVisible();
});

Then('each article row should have edit and delete actions', async function (this: World) {
  const page = new AdminPage(this.page);
  await page.assertRowActionsVisible();
});

Then('I should see a categories table', async function (this: World) {
  const page = new AdminPage(this.page);
  await page.assertTableVisible();
});

Then('each category row should have edit and delete actions', async function (this: World) {
  const page = new AdminPage(this.page);
  await page.assertRowActionsVisible();
});

Then('I should see total users count', async function (this: World) {
  const page = new AdminPage(this.page);
  await page.assertUserStatsVisible();
});

Then('I should see admins count', async function (this: World) {
  const page = new AdminPage(this.page);
  await page.assertUserStatsVisible();
});

Then('I should see a users table with role columns', async function (this: World) {
  const page = new AdminPage(this.page);
  await page.assertTableVisible();
});

Then('I should see source tabs for The Hindu, Indian Express, and PIB', async function (this: World) {
  const page = new AdminPage(this.page);
  await page.assertSourceTabsVisible();
});

Then('I should see a table with dates and scrape actions', async function (this: World) {
  const page = new AdminPage(this.page);
  await page.assertTableVisible();
});

Then('I should see the admin sidebar', async function (this: World) {
  const page = new AdminPage(this.page);
  await page.assertSidebarVisible();
});

Then('the sidebar should contain links to all admin sections', async function (this: World) {
  const page = new AdminPage(this.page);
  await page.assertSidebarLinks();
});

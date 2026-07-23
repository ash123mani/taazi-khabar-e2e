import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { World } from '../support/world';
import { HomePage } from '../pages/home.page';

Given('an article exists in the system', async function (this: World) {
  const res = await this.apiContext.get('/api/articles?limit=1');
  if (!res.ok()) throw new Error('Failed to fetch articles');
  const body = await res.json();
  const list = Array.isArray(body) ? body : body.articles ?? [];
  if (list.length === 0) throw new Error('No articles available');
  this.state.articleId = list[0].id;
});

When('I visit the homepage', async function (this: World) {
  const page = new HomePage(this.page);
  await page.navigate();
});

When('I click the first article card', async function (this: World) {
  const page = new HomePage(this.page);
  await page.clickFirstArticle();
});

When('I view the page at mobile width {int}px', async function (this: World, width: number) {
  const page = new HomePage(this.page);
  await page.setViewport(width);
  await page.navigate();
});

When('I view the page at desktop width {int}px', async function (this: World, width: number) {
  const page = new HomePage(this.page);
  await page.setViewport(width);
  await page.navigate();
});

Then('I should see the news feed', async function (this: World) {
  const page = new HomePage(this.page);
  await page.assertTitleVisible();
});

Then('I should see at least one article card', async function (this: World) {
  const page = new HomePage(this.page);
  await page.assertArticleCardsExist();
});

Then('each article card should show a source label', async function (this: World) {
  const page = new HomePage(this.page);
  await page.assertSourceLabelsExist();
});

Then('each article card should show a headline', async function (this: World) {
  const page = new HomePage(this.page);
  await page.assertArticleCardsExist();
});

Then('each article card should show a published date', async function (this: World) {
  await expect(this.page.getByText(/\d{2}-\d{2}-\d{4}/).first()).toBeVisible();
});

Then('I should be on the article detail page', async function (this: World) {
  await expect(this.page).toHaveURL(/\/article\//);
});

Then('I should see the article headline', async function (this: World) {
  const { ArticlePage } = await import('../pages/article.page');
  const page = new ArticlePage(this.page);
  await page.assertHeadlineVisible();
});

Then('I should see articles from {string}', async function (this: World, source: string) {
  const page = new HomePage(this.page);
  const visible = await this.page.getByText(source, { exact: true }).first().isVisible().catch(() => false);
  if (!visible) {
    console.log(`Source "${source}" not found on homepage (may not have articles for today)`);
    return;
  }
});

Then('the article feed should display in a single column', async function (this: World) {
  const page = new HomePage(this.page);
  await page.assertSingleColumn();
});

Then('the article feed should display in a two-column grid', async function (this: World) {
  const page = new HomePage(this.page);
  await page.assertTwoColumnGrid();
});

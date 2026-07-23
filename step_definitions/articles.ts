import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { World } from '../support/world';
import { ArticlePage } from '../pages/article.page';
import { BookmarksPage } from '../pages/bookmarks.page';

When('I visit that article page', async function (this: World) {
  if (!this.state.articleId) throw new Error('No article ID available');
  const page = new ArticlePage(this.page);
  await page.navigate(this.state.articleId);
});

When('I click the bookmark button', async function (this: World) {
  const page = new ArticlePage(this.page);
  await page.clickBookmark();
});

When('I click the bookmark button again', async function (this: World) {
  const page = new ArticlePage(this.page);
  await page.clickBookmark();
});

When('I unbookmark the article', async function (this: World) {
  if (!this.state.articleId || !this.state.accessToken) {
    throw new Error('Not authenticated or no article ID');
  }
  const res = await this.apiContext.post(`/api/bookmarks/${this.state.articleId}`, {
    headers: { Authorization: `Bearer ${this.state.accessToken}` },
  });
  if (!res.ok()) throw new Error('Failed to unbookmark article');
});

Given('I have bookmarked an article', async function (this: World) {
  if (!this.state.accessToken) throw new Error('Not authenticated');
  if (!this.state.articleId) throw new Error('No article ID');
  const res = await this.apiContext.post(`/api/bookmarks/${this.state.articleId}`, {
    headers: { Authorization: `Bearer ${this.state.accessToken}` },
  });
  if (!res.ok()) throw new Error('Failed to bookmark article');
});

Given('I have bookmarked the article', async function (this: World) {
  if (!this.state.articleId) throw new Error('No article ID');
  const res = await this.apiContext.post(`/api/bookmarks/${this.state.articleId}`, {
    headers: { Authorization: `Bearer ${this.state.accessToken}` },
  });
  if (!res.ok()) throw new Error('Failed to bookmark article');
});

Given('I have bookmarked {int} articles', async function (this: World, count: number) {
  if (!this.state.accessToken) throw new Error('Not authenticated');
  const res = await this.apiContext.get('/api/articles?limit=3');
  if (!res.ok()) throw new Error('Failed to fetch articles');
  const body = await res.json();
  const articles = Array.isArray(body) ? body : body.articles ?? [];

  for (let i = 0; i < Math.min(count, articles.length); i++) {
    await this.apiContext.post(`/api/bookmarks/${articles[i].id}`, {
      headers: { Authorization: `Bearer ${this.state.accessToken}` },
    });
  }
});

Then('I should see the article body', async function (this: World) {
  const page = new ArticlePage(this.page);
  await page.assertBodyVisible();
});

Then('I should see the article source', async function (this: World) {
  const page = new ArticlePage(this.page);
  await page.assertSourceVisible();
});

Then('I should see the published date', async function (this: World) {
  const page = new ArticlePage(this.page);
  await page.assertDateVisible();
});

Then('I should see a bookmark button', async function (this: World) {
  const page = new ArticlePage(this.page);
  await page.assertBookmarkButtonVisible();
});

Then('the bookmark button should indicate it is bookmarked', async function (this: World) {
  const page = new ArticlePage(this.page);
  await page.assertBookmarked();
});

Then('the bookmark button should indicate it is not bookmarked', async function (this: World) {
  const page = new ArticlePage(this.page);
  await page.assertNotBookmarked();
});

Then('the article should appear in my bookmarks', async function (this: World) {
  const page = new BookmarksPage(this.page);
  await page.navigate();
  await page.assertBookmarkItemsExist();
});

Then('the article should not appear in my bookmarks', async function (this: World) {
  const page = new BookmarksPage(this.page);
  await page.navigate();
  await page.assertEmptyState();
});

Then('I should see a message to log in to bookmark articles', async function (this: World) {
  const page = new ArticlePage(this.page);
  await page.assertLoginPromptVisible();
});

Then('I should see syllabus tags if the article has them', async function (this: World) {
  const page = new ArticlePage(this.page);
  await page.assertSyllabusTagsExist();
});

Then('the source label should have a distinct color', async function (this: World) {
  const page = new ArticlePage(this.page);
  await page.assertSourceColorCoded();
});

Then('the article should display its headline', async function (this: World) {
  const headline = this.page.locator('h1, .newspaper-heading').filter({ hasNotText: /Taazi Khabar|Clippings|Reading List/ }).first();
  await expect(headline).toBeVisible({ timeout: 10000 });
});

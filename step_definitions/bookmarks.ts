import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { World } from '../support/world';
import { BookmarksPage } from '../pages/bookmarks.page';
import { ArticlePage } from '../pages/article.page';
import { BasePage } from '../pages/base.page';

When('I visit the bookmarks page', async function (this: World) {
  const page = new BookmarksPage(this.page);
  await page.navigate();
});

Then('I should see my bookmarked article', async function (this: World) {
  const page = new BookmarksPage(this.page);
  await page.assertBookmarkItemsExist();
});

Then('I should see an empty bookmarks message', async function (this: World) {
  const page = new BookmarksPage(this.page);
  await page.assertEmptyState();
});

Then('I should see all {int} bookmarked articles', async function (this: World, count: number) {
  const page = new BookmarksPage(this.page);
  await page.assertBookmarkCount(count);
});

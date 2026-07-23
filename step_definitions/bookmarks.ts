import { When, Then } from '@cucumber/cucumber';
import { World } from '../support/world';
import { container } from '../core/container';
import { BookmarksPage } from '../pages/bookmarks.page';

function getPage(): BookmarksPage {
  return new BookmarksPage(container.getPage());
}

When('I visit the bookmarks page', async function () {
  await getPage().navigate();
});

Then('I should see my bookmarked article', async function () {
  await getPage().assertItemsExist();
});

Then('I should see an empty bookmarks message', async function () {
  await getPage().assertEmptyState();
});

Then('I should see all {int} bookmarked articles', async function (count: number) {
  await getPage().assertCount(count);
});

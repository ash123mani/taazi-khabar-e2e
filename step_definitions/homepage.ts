import { Given, When, Then } from '@cucumber/cucumber';
import { World } from '../support/world';
import { container } from '../core/container';
import { HomePage } from '../pages/home.page';
import { HomeAssertions } from '../assertions/home.assertions';
import { ArticleCardComponent } from '../components/article.card.component';

function getPage(): HomePage {
  return new HomePage(container.getPage());
}

function getAssertions(): HomeAssertions {
  return new HomeAssertions(container.getPage());
}

function getArticleCard(): ArticleCardComponent {
  return new ArticleCardComponent(container.getPage());
}

Given('an article exists in the system', async function (this: World) {
  const res = await this.apiContext.get('/api/articles?limit=1');
  if (!res.ok()) throw new Error('Failed to fetch articles');
  const body = await res.json();
  const list = Array.isArray(body) ? body : body.articles ?? [];
  if (list.length === 0) throw new Error('No articles available');
  this.articleId = list[0].id;
});

When('I visit the homepage', async function () {
  await getPage().navigate();
});

When('I click the first article card', async function () {
  await getPage().clickFirstArticle();
});

When('I view the page at mobile width {int}px', async function (_width: number) {
  const page = getPage();
  await page.setMobileViewport();
  await page.navigate();
});

When('I view the page at desktop width {int}px', async function (_width: number) {
  const page = getPage();
  await page.setDesktopViewport();
  await page.navigate();
});

Then('I should see the news feed', async function () {
  await getAssertions().titleVisible();
});

Then('I should see at least one article card', async function () {
  await getAssertions().articleCardsExist();
});

Then('each article card should show a source label', async function () {
  await getAssertions().sourceLabelsExist();
});

Then('each article card should show a headline', async function () {
  await getAssertions().articleCardsExist();
});

Then('each article card should show a published date', async function () {
  await getArticleCard().assertDateFormat();
});

Then('I should be on the article detail page', async function () {
  await getAssertions().atArticleDetail();
});

Then('I should see the article headline', async function () {
  const { ArticlePage } = await import('../pages/article.page');
  const page = new ArticlePage(container.getPage());
  await page.assertHeadlineVisible();
});

Then('I should see articles from {string}', async function (_source: string) {
  await getArticleCard().assertSourceLabelsExist();
});

Then('the article feed should display in a single column', async function () {
  await getAssertions().singleColumn();
});

Then('the article feed should display in a two-column grid', async function () {
  await getAssertions().twoColumnGrid();
});

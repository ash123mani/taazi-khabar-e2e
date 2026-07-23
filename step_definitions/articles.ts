import { Given, When, Then } from '@cucumber/cucumber';
import { World } from '../support/world';
import { container } from '../core/container';
import { ArticlePage } from '../pages/article.page';
import { ArticleCardComponent } from '../components/article.card.component';

function getPage(): ArticlePage {
  return new ArticlePage(container.getPage());
}

function getArticleCard(): ArticleCardComponent {
  return new ArticleCardComponent(container.getPage());
}

When('I visit that article page', async function (this: World) {
  if (!this.articleId) throw new Error('No article ID available');
  await getPage().navigate(this.articleId);
});

Given('I have bookmarked an article', async function (this: World) {
  if (!this.accessToken) throw new Error('Not authenticated');
  if (!this.articleId) {
    const res = await this.apiContext.get('/api/articles?limit=1');
    if (!res.ok()) throw new Error('Failed to fetch articles');
    const body = await res.json();
    const list = Array.isArray(body) ? body : body.articles ?? [];
    if (list.length === 0) throw new Error('No articles available');
    this.articleId = list[0].id;
  }
  const ok = await this.bookmarksService.toggle(this.articleId!);
  if (!ok) throw new Error('Failed to bookmark article');
});

Given('I have bookmarked {int} articles', async function (this: World, count: number) {
  if (!this.accessToken) throw new Error('Not authenticated');
  const res = await this.apiContext.get(`/api/articles?limit=${count}`);
  if (!res.ok()) throw new Error('Failed to fetch articles');
  const body = await res.json();
  const articles = Array.isArray(body) ? body : body.articles ?? [];
  let bookmarked = 0;
  for (const a of articles.slice(0, count)) {
    const ok = await this.bookmarksService.toggle(a.id);
    if (ok) bookmarked++;
  }
  if (bookmarked < count) throw new Error(`Only bookmarked ${bookmarked}/${count} articles`);
});

When('I unbookmark the article', async function (this: World) {
  if (!this.articleId || !this.accessToken) {
    throw new Error('Not authenticated or no article ID');
  }
  const ok = await this.bookmarksService.toggle(this.articleId!);
  if (!ok) throw new Error('Failed to unbookmark article');
});

Then('I should see the article body', async function () {
  await getPage().assertBodyVisible();
});

Then('I should see the article source', async function () {
  await getPage().assertSourceVisible();
});

Then('I should see the published date', async function () {
  await getPage().assertDateVisible();
});

Then('I should see syllabus tags if the article has them', async function () {
  await getPage().assertSyllabusTagsExist();
});

Then('the source label should have a distinct color', async function () {
  await getPage().assertSourceColorCoded();
});

Then('the article should display its headline', async function () {
  await getArticleCard().assertHeadlinesVisible();
});

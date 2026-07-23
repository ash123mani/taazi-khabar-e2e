import { Page, expect } from '@playwright/test';

export class ArticleCardComponent {
  constructor(private page: Page) {}

  private get container() { return this.page.locator('[style*="cursor:pointer"]').first(); }
  private get headlines() { return this.page.locator('.newspaper-heading').filter({ hasNotText: /Taazi Khabar|Clippings|Reading List/ }); }
  private get sourceLabels() { return this.page.getByText('The Hindu').or(this.page.getByText('Indian Express')).or(this.page.getByText('PIB')); }
  private get bookmarkButton() { return this.page.locator('.anticon-heart, .anticon-heart-filled').first(); }

  get firstHeadline() { return this.headlines.first(); }

  async clickFirstArticle(): Promise<void> {
    await this.container.waitFor({ state: 'visible', timeout: 15000 });
    await this.container.click();
  }

  async clickFirstBookmark(): Promise<void> {
    await this.bookmarkButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.bookmarkButton.click();
  }

  async assertHeadlinesVisible(): Promise<void> {
    await expect(this.headlines.first()).toBeVisible({ timeout: 10000 });
  }

  async assertSourceLabelsExist(): Promise<void> {
    await expect(this.sourceLabels.first()).toBeVisible({ timeout: 10000 });
  }

  async assertSourceVisible(source: string): Promise<void> {
    const el = this.page.getByText(source, { exact: true }).first();
    await expect(el).toBeVisible({ timeout: 10000 });
  }

  async assertBookmarkVisible(): Promise<void> {
    await expect(this.bookmarkButton).toBeVisible({ timeout: 5000 });
  }

  async assertDateFormat(): Promise<void> {
    await expect(this.page.getByText(/\d{2}-\d{2}-\d{4}/).first()).toBeVisible();
  }
}

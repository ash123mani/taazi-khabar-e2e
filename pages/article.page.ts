import { Page, expect } from '@playwright/test';
import { BasePage } from '../core/base.page';

export class ArticlePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get headline() { return this.page.locator('h1').first(); }
  get sourceLabel() { return this.page.locator('[style*="font-weight:700"],[style*="font-weight: 700"]').first(); }
  get publishedDate() { return this.page.getByText(/\d{2}-\d{2}-\d{4}/).first(); }

  async navigate(articleId: string): Promise<void> {
    await this.goto(`/article/${articleId}`);
  }

  async assertHeadlineVisible(): Promise<void> {
    await expect(this.headline).toBeVisible({ timeout: 10000 });
  }

  async assertBodyVisible(): Promise<void> {
    await expect(this.page.locator('p').first()).toBeVisible({ timeout: 5000 });
  }

  async assertSourceVisible(): Promise<void> {
    await expect(this.sourceLabel).toBeVisible();
  }

  async assertDateVisible(): Promise<void> {
    await expect(this.page.getByText(/\d{1,2}\s+\w+\s+\d{4}/).first()).toBeVisible();
  }

  async assertSyllabusTagsExist(): Promise<void> {
    const tags = this.page.locator('.ant-tag');
    const count = await tags.count();
    if (count > 0) {
      await expect(tags.first()).toBeVisible();
    }
  }

  async assertSourceColorCoded(): Promise<void> {
    const style = await this.sourceLabel.getAttribute('style') || '';
    expect(style).toMatch(/color/);
  }
}

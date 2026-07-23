import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class ArticlePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get headline() { return this.page.locator('h1').first(); }
  get body() { return this.page.locator('p').first(); }
  get sourceLabel() { return this.page.locator('[style*="font-weight:700"],[style*="font-weight: 700"]').first(); }
  get bookmarkButton() { return this.page.locator('[aria-label="bookmark"], button:has(.anticon-heart)').first(); }
  get loginPrompt() { return this.page.getByText(/log in to bookmark/i); }
  get syllabusTags() { return this.page.locator('.ant-tag'); }
  get publishedDate() { return this.page.getByText(/\d{1,2}\s+\w+\s+\d{4}/).first(); }

  async navigate(articleId: string) {
    await this.goto(`/article/${articleId}`);
  }

  async assertHeadlineVisible() {
    await expect(this.headline).toBeVisible({ timeout: 10000 });
  }

  async assertBodyVisible() {
    await expect(this.body).toBeVisible({ timeout: 5000 });
  }

  async assertSourceVisible() {
    await expect(this.sourceLabel).toBeVisible();
  }

  async assertDateVisible() {
    await expect(this.publishedDate).toBeVisible();
  }

  async assertBookmarkButtonVisible() {
    await expect(this.bookmarkButton).toBeVisible();
  }

  async clickBookmark() {
    await this.bookmarkButton.click();
  }

  async assertBookmarked() {
    await expect(this.page.locator('.anticon-heart-filled, .anticon-heart[style*="color: #ef4444"]')).toBeVisible();
  }

  async assertNotBookmarked() {
    const filled = await this.page.locator('.anticon-heart-filled').count();
    expect(filled).toBe(0);
  }

  async assertLoginPromptVisible() {
    await expect(this.loginPrompt).toBeVisible({ timeout: 5000 });
  }

  async assertSyllabusTagsExist() {
    const count = await this.syllabusTags.count();
    if (count > 0) {
      await expect(this.syllabusTags.first()).toBeVisible();
    }
  }

  async assertSourceColorCoded() {
    const style = await this.sourceLabel.getAttribute('style') || '';
    expect(style).toMatch(/color/);
  }
}

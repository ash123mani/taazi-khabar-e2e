import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class BookmarksPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get heading() { return this.page.getByText(/Clippings/i).first(); }
  get emptyMessage() { return this.page.getByText('No bookmarks yet').first(); }
  get articleCards() { return this.page.locator('.newspaper-heading').filter({ hasNotText: /Clippings|Reading List|Taazi Khabar/ }); }

  async navigate() {
    await this.goto('/bookmarks');
  }

  async assertHeadingVisible() {
    await expect(this.heading).toBeVisible({ timeout: 10000 });
  }

  async assertEmptyState() {
    await expect(this.emptyMessage).toBeVisible({ timeout: 10000 });
  }

  async assertBookmarkItemsExist() {
    await expect(this.articleCards.first()).toBeVisible({ timeout: 10000 });
  }

  async assertBookmarkCount(expected: number) {
    const count = await this.articleCards.count();
    expect(count).toBe(expected);
  }
}

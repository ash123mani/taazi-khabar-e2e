import { Page, expect } from '@playwright/test';
import { BasePage } from '../core/base.page';

export class BookmarksPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get heading() { return this.page.getByText(/Clippings/i).first(); }
  get emptyMessage() { return this.page.getByText('No bookmarks yet').first(); }
  get articleCards() { return this.page.locator('.newspaper-heading').filter({ hasNotText: /Clippings|Reading List|Taazi Khabar/ }); }

  async navigate(): Promise<void> {
    await this.goto('/bookmarks');
  }

  async assertEmptyState(): Promise<void> {
    await expect(this.emptyMessage).toBeVisible({ timeout: 10000 });
  }

  async assertItemsExist(): Promise<void> {
    await expect(this.articleCards.first()).toBeVisible({ timeout: 10000 });
  }

  async assertCount(expected: number): Promise<void> {
    const count = await this.articleCards.count();
    expect(count).toBe(expected);
  }
}

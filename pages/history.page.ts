import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class HistoryPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get heading() { return this.page.getByText(/History/i).first(); }
  get emptyState() { return this.page.locator('.ant-empty'); }
  get quizEntries() { return this.page.locator('[class*="ant-list-item"], tr, [style*="border-radius"]').filter({ has: this.page.locator('text=/, text=score') }); }
  get resultHeading() { return this.page.getByText('Quiz Result').first(); }
  get scoreDisplay() { return this.page.getByText(/\d+\/\d+/).first(); }
  get linkedArticles() { return this.page.getByText(/Linked Articles/i); }
  get errorMessage() { return this.page.locator('[style*="color: #ef4444"]'); }

  async navigate() {
    await this.goto('/history');
  }

  async navigateToDetail(quizId: string) {
    await this.goto(`/history/${quizId}`);
  }

  async navigateToNonExistentDetail() {
    await this.goto('/history/00000000-0000-0000-0000-000000000000');
  }

  async assertHeadingVisible() {
    await expect(this.heading).toBeVisible({ timeout: 10000 });
  }

  async assertEmptyState() {
    const empty = await this.emptyState.count();
    if (empty === 0) {
      await expect(this.page.getByText(/no/i)).toBeVisible({ timeout: 10000 });
    } else {
      await expect(this.emptyState).toBeVisible({ timeout: 10000 });
    }
  }

  async assertEntriesExist() {
    const count = await this.quizEntries.count();
    expect(count).toBeGreaterThan(0);
  }

  async clickFirstEntry() {
    await this.quizEntries.first().click();
  }

  async assertResultVisible() {
    await expect(this.resultHeading).toBeVisible({ timeout: 15000 });
  }

  async assertScoreVisible() {
    await expect(this.scoreDisplay).toBeVisible({ timeout: 10000 });
  }

  async assertLinkedArticlesVisible() {
    await expect(this.linkedArticles).toBeVisible({ timeout: 10000 });
  }

  async assertErrorVisible() {
    await expect(this.errorMessage).toBeVisible({ timeout: 10000 });
  }
}

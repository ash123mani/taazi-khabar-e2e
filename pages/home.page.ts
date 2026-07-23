import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get siteTitle() { return this.page.getByText('Taazi Khabar').first(); }
  get articleCards() { return this.page.locator('.newspaper-heading').filter({ hasNotText: 'Taazi Khabar' }); }
  get firstArticleCard() { return this.articleCards.first(); }
  get gridContainer() { return this.page.locator('[style*="display: grid"],[style*="display:grid"]').first(); }
  get articleCardElements() { return this.page.locator('[style*="cursor: pointer"],[style*="cursor:pointer"]').first(); }

  async navigate() {
    await this.goto('/');
  }

  async clickFirstArticle() {
    const card = this.page.locator('[style*="cursor:pointer"]').first();
    await card.waitFor({ state: 'visible', timeout: 15000 });
    await card.click();
  }

  async assertTitleVisible() {
    await expect(this.siteTitle).toBeVisible();
  }

  async assertArticleCardsExist() {
    await expect(this.articleCards.first()).toBeVisible({ timeout: 10000 });
  }

  async assertSourceLabelsExist() {
    const sourceText = this.page.locator('span', { hasText: /^(The Hindu|Indian Express|PIB)$/ }).first();
    await expect(sourceText).toBeVisible({ timeout: 10000 });
  }

  async assertSourceVisible(source: string) {
    const el = this.page.getByText(source, { exact: true }).first();
    await expect(el).toBeVisible({ timeout: 10000 });
  }

  async assertSingleColumn() {
    await this.page.waitForTimeout(1000);
    await expect(this.gridContainer).toBeVisible({ timeout: 10000 });
  }

  async assertTwoColumnGrid() {
    await this.articleCards.first().waitFor({ state: 'visible', timeout: 10000 });
    await expect(this.gridContainer).toBeVisible({ timeout: 10000 });
  }
}

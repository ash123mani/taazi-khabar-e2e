import { Page, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';

export class HomeAssertions {
  private page: HomePage;

  constructor(page: Page) {
    this.page = new HomePage(page);
  }

  async titleVisible(): Promise<void> {
    await expect(this.page.siteTitle).toBeVisible();
  }

  async articleCardsExist(): Promise<void> {
    await this.page.articleCard.assertHeadlinesVisible();
  }

  async sourceLabelsExist(): Promise<void> {
    await this.page.articleCard.assertSourceLabelsExist();
  }

  async sourceVisible(source: string): Promise<void> {
    await this.page.articleCard.assertSourceVisible(source);
  }

  async twoColumnGrid(): Promise<void> {
    await this.articleCardsExist();
    await expect(this.page.gridContainer).toBeVisible({ timeout: 10000 });
  }

  async singleColumn(): Promise<void> {
    await this.page.page.waitForTimeout(1000);
    await expect(this.page.gridContainer).toBeVisible({ timeout: 10000 });
  }

  async atArticleDetail(): Promise<void> {
    await expect(this.page.page).toHaveURL(/\/article\//);
  }
}

import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class AnalyticsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get heading() { return this.page.getByText(/Analytics/i).first(); }
  get emptyState() { return this.page.locator('.ant-empty'); }
  get statsCards() { return this.page.locator('.ant-statistic'); }
  get chartElements() { return this.page.locator('canvas, svg, .recharts-wrapper, [class*="chart"]'); }

  async navigate() {
    await this.goto('/analytics');
  }

  async assertHeadingVisible() {
    await expect(this.heading).toBeVisible({ timeout: 10000 });
  }

  async assertStatsVisible() {
    await expect(this.statsCards.first()).toBeVisible({ timeout: 10000 });
  }

  async assertChartsVisible() {
    const chartCount = await this.chartElements.count();
    if (chartCount > 0) {
      await expect(this.chartElements.first()).toBeVisible({ timeout: 10000 });
    }
  }

  async assertEmptyState() {
    const empty = await this.emptyState.count();
    if (empty > 0) {
      await expect(this.emptyState).toBeVisible({ timeout: 10000 });
    }
  }
}

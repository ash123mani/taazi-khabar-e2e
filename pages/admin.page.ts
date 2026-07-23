import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class AdminPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Sidebar
  get sidebar() { return this.page.locator('.ant-layout-sider'); }
  get sidebarLinks() { return this.page.locator('.ant-menu-item'); }

  // Dashboard
  get statCards() { return this.page.locator('.ant-statistic'); }
  get recentArticlesTable() { return this.page.locator('table').first(); }
  get recentQuizzesTable() { return this.page.locator('table').nth(1); }

  // Shared
  get searchInput() { return this.page.getByPlaceholder(/search/i); }
  get dataTable() { return this.page.locator('table'); }
  get editButton() { return this.page.getByText('Edit'); }
  get deleteButton() { return this.page.getByText('Delete'); }

  // Users
  get userStats() { return this.page.getByText(/total users|admins/i); }

  // Scrape
  get sourceTabs() { return this.page.locator('.ant-tabs-tab'); }
  get scrapeButtons() { return this.page.getByText('Scrape'); }

  // Summaries
  get datePicker() { return this.page.locator('.ant-picker'); }
  get generateAllButton() { return this.page.getByText(/generate all/i); }

  // Datasets / Models / Training Data
  get statusFilter() { return this.page.getByPlaceholder(/filter by status/i); }

  async assertHeading(heading: string) {
    await expect(this.page.getByText(heading).first()).toBeVisible({ timeout: 10000 });
  }

  async assertSidebarVisible() {
    await expect(this.sidebar).toBeVisible();
  }

  async assertSidebarLinks() {
    const count = await this.sidebarLinks.count();
    expect(count).toBeGreaterThanOrEqual(9);
  }

  async assertStatsVisible() {
    for (const stat of ['Total Articles', 'Total Quizzes', 'Avg Score', 'Active Users']) {
      await expect(this.page.getByText(stat).first()).toBeVisible({ timeout: 10000 });
    }
  }

  async assertTablesVisible() {
    await expect(this.recentArticlesTable).toBeVisible({ timeout: 10000 });
    await expect(this.recentQuizzesTable).toBeVisible({ timeout: 10000 });
  }

  async assertSearchVisible() {
    await expect(this.searchInput).toBeVisible({ timeout: 10000 });
  }

  async assertTableVisible() {
    await expect(this.dataTable).toBeVisible({ timeout: 10000 });
  }

  async assertRowActionsVisible() {
    const editCount = await this.editButton.count();
    const deleteCount = await this.deleteButton.count();
    expect(editCount + deleteCount).toBeGreaterThan(0);
  }

  async assertUserStatsVisible() {
    await expect(this.userStats.first()).toBeVisible({ timeout: 10000 });
  }

  async assertSourceTabsVisible() {
    const count = await this.sourceTabs.count();
    expect(count).toBeGreaterThanOrEqual(3);
  }
}

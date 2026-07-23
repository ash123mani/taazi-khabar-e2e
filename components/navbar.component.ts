import { Page, expect } from '@playwright/test';

export class Navbar {
  constructor(private page: Page) {}

  get loginButton() { return this.page.getByRole('button', { name: /login/i }).first(); }
  get logoutButton() { return this.page.getByRole('button', { name: /logout/i }).first(); }
  get mobileMenuButton() { return this.page.locator('.anticon-menu').first(); }
  get navLinks() { return this.page.locator('.ant-menu-item'); }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async clickLogout(): Promise<void> {
    await this.logoutButton.click();
  }

  async assertLoginVisible(): Promise<void> {
    await expect(this.loginButton).toBeVisible({ timeout: 5000 });
  }

  async assertLogoutVisible(): Promise<void> {
    await expect(this.logoutButton).toBeVisible({ timeout: 5000 });
  }

  async assertNavVisible(): Promise<void> {
    await expect(this.navLinks.first()).toBeVisible({ timeout: 5000 });
  }
}

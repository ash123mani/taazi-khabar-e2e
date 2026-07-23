import { Page, expect } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  async goto(url: string) {
    await this.page.goto(url, { waitUntil: 'networkidle' });
  }

  async reload() {
    await this.page.reload({ waitUntil: 'networkidle' });
  }

  async setViewport(width: number, height: number = 900) {
    await this.page.setViewportSize({ width, height });
  }

  async isLoggedIn(): Promise<boolean> {
    const cookies = await this.page.context().cookies();
    return cookies.some((c) => c.name.includes('next-auth.session-token'));
  }

  async getSessionCookie() {
    const cookies = await this.page.context().cookies();
    return cookies.find((c) => c.name.includes('next-auth.session-token'));
  }

  async assertVisible(locator: string, timeout = 5000) {
    await expect(this.page.locator(locator).first()).toBeVisible({ timeout });
  }

  async assertTextVisible(text: string, timeout = 10000) {
    await expect(this.page.getByText(text).first()).toBeVisible({ timeout });
  }

  async assertHasUrl(pattern: RegExp) {
    await expect(this.page).toHaveURL(pattern);
  }

  async waitForUrl(pattern: string) {
    await this.page.waitForURL(`**${pattern}`);
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }
}

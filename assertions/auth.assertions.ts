import { Page, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { RegisterPage } from '../pages/register.page';

export class AuthAssertions {
  constructor(private page: Page) {}

  async redirectedToHomepage(): Promise<void> {
    await this.page.waitForURL('**/');
  }

  async seeSiteTitle(): Promise<void> {
    await expect(this.page.getByText('Taazi Khabar').first()).toBeVisible();
  }

  async seeErrorMessage(msg: string): Promise<void> {
    await expect(this.page.getByText(msg).first()).toBeVisible({ timeout: 5000 });
  }

  async seeFieldValidationError(): Promise<void> {
    const loginPage = new LoginPage(this.page);
    await expect(loginPage.validationError).toBeVisible({ timeout: 5000 });
  }

  async redirectedToLogin(): Promise<void> {
    await this.page.waitForURL('**/login**');
  }

  async hasValidSession(): Promise<void> {
    const cookies = await this.page.context().cookies();
    const hasSession = cookies.some((c) => c.name.includes('next-auth.session-token'));
    expect(hasSession).toBe(true);
  }
}

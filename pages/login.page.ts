import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators
  get emailInput() { return this.page.locator('#email'); }
  get passwordInput() { return this.page.locator('#password'); }
  get signInButton() { return this.page.getByRole('button', { name: /^sign in$/i }); }
  get errorMessage() { return this.page.locator('[style*="color: #ef4444"]'); }
  get emailLabel() { return this.page.getByText('Email'); }
  get passwordLabel() { return this.page.getByText('Password'); }

  // Actions
  async navigate() {
    await this.goto('/login');
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickSignIn() {
    await this.signInButton.click();
  }

  async login(email: string, password: string) {
    await this.navigate();
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSignIn();
  }

  async assertFormVisible() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.signInButton).toBeVisible();
  }

  async assertErrorShown() {
    await expect(this.errorMessage).toBeVisible({ timeout: 10000 });
  }

  async getErrorMessageText(): Promise<string> {
    return (await this.errorMessage.textContent()) || '';
  }
}

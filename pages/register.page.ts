import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class RegisterPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get nameInput() { return this.page.getByPlaceholder('Your full name'); }
  get emailInput() { return this.page.getByPlaceholder('you@example.com'); }
  get passwordInput() { return this.page.getByPlaceholder('At least 6 characters'); }
  get createAccountButton() { return this.page.getByRole('button', { name: /create account/i }); }
  get errorMessage() { return this.page.locator('[style*="color: #ef4444"]'); }
  get nameLabel() { return this.page.getByText('Full Name'); }
  get emailLabel() { return this.page.getByText('Email'); }
  get passwordLabel() { return this.page.getByText('Password'); }
  get signInLink() { return this.page.getByText('Sign in'); }

  async navigate() {
    await this.goto('/register');
  }

  async fillName(name: string) {
    await this.nameInput.fill(name);
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickCreateAccount() {
    await this.createAccountButton.click();
  }

  async register(name: string, email: string, password: string) {
    await this.navigate();
    await this.fillName(name);
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickCreateAccount();
  }

  async assertFormVisible() {
    await expect(this.nameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
  }

  async assertErrorShown() {
    await expect(this.errorMessage).toBeVisible({ timeout: 10000 });
  }

  async assertValidationErrorShown() {
    await expect(this.page.locator('.ant-form-item-explain-error').first()).toBeVisible({ timeout: 5000 });
  }
}

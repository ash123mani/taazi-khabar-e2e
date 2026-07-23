import { Page } from '@playwright/test';
import { BasePage } from '../core/base.page';

export class RegisterPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get nameInput() { return this.page.locator('#name'); }
  get emailInput() { return this.page.locator('#email'); }
  get passwordInput() { return this.page.locator('#password'); }
  get submitButton() { return this.page.getByRole('button', { name: /^create account$/i }); }
  get errorMessage() { return this.page.locator('[style*="color: #ef4444"]').first(); }
  get validationError() { return this.page.locator('.ant-form-item-explain-error').first(); }

  async navigate(): Promise<void> {
    await this.goto('/register');
  }

  async register(name: string, email: string, password: string): Promise<void> {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}

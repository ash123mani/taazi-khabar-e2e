import { Page } from '@playwright/test';
import { BasePage } from '../core/base.page';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get emailInput() { return this.page.locator('#email'); }
  get passwordInput() { return this.page.locator('#password'); }
  get submitButton() { return this.page.getByRole('button', { name: /^sign in$/i }); }
  get errorMessage() { return this.page.locator('[style*="color: #ef4444"]').first(); }
  get validationError() { return this.page.locator('.ant-form-item-explain-error').first(); }

  async navigate(): Promise<void> {
    await this.goto('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}

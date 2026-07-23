import { Page, expect } from '@playwright/test';
import { IPageObject } from './types';

export abstract class BasePage implements IPageObject {
  constructor(public readonly page: Page) {}

  async goto(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'networkidle' });
  }

  async reload(): Promise<void> {
    await this.page.reload({ waitUntil: 'networkidle' });
  }

  async setViewport(width: number, height = 900): Promise<void> {
    await this.page.setViewportSize({ width, height });
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async waitForUrl(pattern: string): Promise<void> {
    await this.page.waitForURL(`**${pattern}`);
  }
}

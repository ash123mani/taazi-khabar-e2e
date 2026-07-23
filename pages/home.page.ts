import { Page } from '@playwright/test';
import { BasePage } from '../core/base.page';
import { ArticleCardComponent } from '../components/article.card.component';

export class HomePage extends BasePage {
  readonly articleCard: ArticleCardComponent;

  constructor(page: Page) {
    super(page);
    this.articleCard = new ArticleCardComponent(page);
  }

  get siteTitle() { return this.page.getByText('Taazi Khabar').first(); }
  get articleCards() { return this.page.locator('.newspaper-heading').filter({ hasNotText: 'Taazi Khabar' }); }
  get firstArticleCard() { return this.articleCards.first(); }
  get gridContainer() { return this.page.locator('[style*="display: grid"],[style*="display:grid"]').first(); }

  async navigate(): Promise<void> {
    await this.goto('/');
  }

  async clickFirstArticle(): Promise<void> {
    await this.articleCard.clickFirstArticle();
  }

  async setDesktopViewport(): Promise<void> {
    await this.setViewport(1280);
  }

  async setMobileViewport(): Promise<void> {
    await this.setViewport(375);
  }
}

import { setWorldConstructor, World as CucumberWorld, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from 'playwright';
import { APIRequestContext } from 'playwright';
import { container } from '../core/container';
import { AuthService } from '../services/auth.service';
import { ArticleService } from '../services/article.service';
import { BookmarkService } from '../services/bookmarks.service';

export class World extends CucumberWorld {
  public browser!: Browser;
  public context!: BrowserContext;
  public page!: Page;
  public apiContext!: APIRequestContext;
  public authService!: AuthService;
  public articleService!: ArticleService;

  public testEmail!: string;
  public testPassword!: string;
  public testName!: string;
  public accessToken: string | null = null;
  public articleId: string | null = null;

  constructor(options: IWorldOptions) {
    super(options);
  }

  initServices(): void {
    this.authService = new AuthService(this.apiContext);
    this.articleService = new ArticleService(this.apiContext);
  }

  get bookmarksService(): BookmarkService {
    if (!this.accessToken) throw new Error('No access token');
    return new BookmarkService(this.apiContext, this.accessToken);
  }

  freshEmail(): string {
    return `e2e-${Date.now()}${Math.random().toString(36).slice(2, 6)}@test.com`;
  }
}

setWorldConstructor(World);

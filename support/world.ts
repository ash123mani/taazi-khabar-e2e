import { setWorldConstructor, World as CucumberWorld, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium, APIResponse } from 'playwright';
import { APIRequestContext } from 'playwright';

export interface TestState {
  testEmail: string;
  testPassword: string;
  testName: string;
  accessToken: string | null;
  articleId: string | null;
  lastResponse: APIResponse | null;
}

export class World extends CucumberWorld {
  public browser!: Browser;
  public context!: BrowserContext;
  public page!: Page;
  public apiContext!: APIRequestContext;
  public state: TestState;

  constructor(options: IWorldOptions) {
    super(options);
    this.state = {
      testEmail: `e2e-${Date.now()}@test.com`,
      testPassword: 'Test1234!',
      testName: 'E2E Tester',
      accessToken: null,
      articleId: null,
      lastResponse: null,
    };
  }
}

setWorldConstructor(World);

import { BeforeAll, AfterAll, Before, After, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, request as playwrightRequest } from 'playwright';
import { World } from './world';
import { container } from '../core/container';

setDefaultTimeout(30000);

const BE_BASE = 'http://localhost:8000';
const FE_BASE = 'http://localhost:3000';

let apiCtx: Awaited<ReturnType<typeof playwrightRequest.newContext>>;

BeforeAll(async function () {
  apiCtx = await playwrightRequest.newContext({ baseURL: BE_BASE });
});

AfterAll(async function () {
  if (apiCtx) await apiCtx.dispose().catch(() => {});
});

Before(async function (this: World) {
  this.apiContext = apiCtx;
  this.initServices();
  this.testEmail = `e2e-${Date.now()}${Math.random().toString(36).slice(2, 6)}@test.com`;
  this.testPassword = 'Test1234!';
  this.testName = 'E2E Tester';
  this.accessToken = null;
  this.articleId = null;

  container.reset();
  const browser = await chromium.launch({
    headless: !process.env.HEADED,
    args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-gpu'],
  });
  const context = await browser.newContext({ baseURL: FE_BASE });
  const page = await context.newPage();
  container.setPage(page);
  this.browser = browser;
  this.context = context;
  this.page = page;
});

After(async function (this: World, scenario) {
  if (scenario.result?.status === Status.FAILED && this.page) {
    try {
      const screenshot = await this.page.screenshot();
      this.attach(screenshot, 'image/png');
    } catch {}
  }
  if (this.context) await this.context.close().catch(() => {});
  if (this.browser) await this.browser.close().catch(() => {});
});

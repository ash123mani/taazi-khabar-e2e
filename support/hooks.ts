import { BeforeAll, AfterAll, Before, After, Status, setDefaultTimeout } from '@cucumber/cucumber';

setDefaultTimeout(30000);
import { chromium, request as playwrightRequest } from 'playwright';
import { World } from './world';

const BE_BASE = 'http://localhost:8000';
const FE_BASE = 'http://localhost:3000';

let browser: Awaited<ReturnType<typeof chromium.launch>>;
let apiCtx: Awaited<ReturnType<typeof playwrightRequest.newContext>>;

BeforeAll(async function () {
  browser = await chromium.launch({
    headless: !process.env.HEADED,
  });
  apiCtx = await playwrightRequest.newContext({ baseURL: BE_BASE });
});

AfterAll(async function () {
  if (apiCtx) await apiCtx.dispose();
  if (browser) await browser.close();
});

Before(async function (this: World) {
  const context = await browser.newContext({ baseURL: FE_BASE });
  const page = await context.newPage();
  this.context = context;
  this.page = page;
  this.browser = browser;
  this.apiContext = apiCtx;

  // Reset per-scenario state
  this.state.accessToken = null;
  this.state.articleId = null;
  this.state.testEmail = `e2e-${Date.now()}${Math.random().toString(36).slice(2, 6)}@test.com`;

  // Register a fresh user for this scenario
  const res = await apiCtx.post('/api/auth/register', {
    data: {
      email: this.state.testEmail,
      password: this.state.testPassword,
      name: this.state.testName,
    },
  });
  if (res.status() === 201) {
    const body = await res.json();
    this.state.accessToken = body.access_token;
  }

  // Fetch an article ID for article detail tests
  const articlesRes = await apiCtx.get('/api/articles?limit=1');
  if (articlesRes.ok()) {
    const body = await articlesRes.json();
    const list = Array.isArray(body) ? body : body.articles ?? [];
    if (list.length > 0) this.state.articleId = list[0].id;
  }
});

After(async function (this: World, scenario) {
  if (scenario.result?.status === Status.FAILED && this.page) {
    try {
      const screenshot = await this.page.screenshot();
      this.attach(screenshot, 'image/png');
    } catch {}
  }
  if (this.context) await this.context.close().catch(() => {});
});

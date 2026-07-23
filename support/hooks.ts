import { BeforeAll, AfterAll, Before, After, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, request as playwrightRequest } from 'playwright';
import { World } from './world';

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

  this.state.accessToken = null;
  this.state.articleId = null;
  this.state.quizId = null;
  this.state.quizCategoryId = null;
  this.state.quizDate = null;
  this.state.testEmail = `e2e-${Date.now()}${Math.random().toString(36).slice(2, 6)}@test.com`;

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

  const articlesRes = await apiCtx.get('/api/articles?limit=1');
  if (articlesRes.ok()) {
    const body = await articlesRes.json();
    const list = Array.isArray(body) ? body : body.articles ?? [];
    if (list.length > 0) this.state.articleId = list[0].id;
  }

  const browser = await chromium.launch({
    headless: !process.env.HEADED,
    args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-gpu'],
  });
  const context = await browser.newContext({ baseURL: FE_BASE });
  const page = await context.newPage();
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

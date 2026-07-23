import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { World } from '../support/world';
import { LoginPage } from '../pages/login.page';
import { RegisterPage } from '../pages/register.page';
import { BasePage } from '../pages/base.page';

let loginPage: LoginPage;
let registerPage: RegisterPage;

Given('I choose a unique email', function (this: World) {
  this.state.testEmail = `e2e-${Date.now()}${Math.random().toString(36).slice(2, 6)}@test.com`;
});

Given('a user with email {string} already exists', async function (this: World, email: string) {
  const res = await this.apiContext.post('/api/auth/register', {
    data: { email, password: 'Secure123!', name: 'Pre-registered User' },
  });
  // 201 = created, 409/400 = already exists (from previous runs)
  if (res.status() !== 201 && res.status() !== 409 && res.status() !== 400) {
    throw new Error(`Failed to pre-register user: ${res.status()}`);
  }
});

Given('I am logged in', async function (this: World) {
  loginPage = new LoginPage(this.page);
  await loginPage.login(this.state.testEmail, this.state.testPassword);
  await loginPage.waitForUrl('/');
});

When('I register with name {string}, email {string}, and password {string}',
  async function (this: World, name: string, email: string, password: string) {
    const resolvedEmail = email === '<email>' ? this.state.testEmail : email;
    registerPage = new RegisterPage(this.page);
    await registerPage.register(name, resolvedEmail, password);
  });

When('I attempt to register with name {string}, email {string}, and password {string}',
  async function (this: World, name: string, email: string, password: string) {
    registerPage = new RegisterPage(this.page);
    await registerPage.navigate();
    if (name) await registerPage.fillName(name);
    if (email) await registerPage.fillEmail(email);
    if (password) await registerPage.fillPassword(password);
    await registerPage.clickCreateAccount();
  });

When('I log in with email {string} and password {string}',
  async function (this: World, email: string, password: string) {
    loginPage = new LoginPage(this.page);
    await loginPage.login(email, password);
  });

When('I attempt to log in with email {string} and password {string}',
  async function (this: World, email: string, password: string) {
    loginPage = new LoginPage(this.page);
    await loginPage.navigate();
    if (email) await loginPage.fillEmail(email);
    if (password) await loginPage.fillPassword(password);
    await loginPage.clickSignIn();
  });

When('I log out', async function (this: World) {
  await this.page.goto('/login');
  const avatar = this.page.locator('.ant-avatar');
  if (await avatar.isVisible().catch(() => false)) {
    await avatar.click();
    await this.page.getByText('Logout').click();
  }
});

When('I navigate to the homepage', async function (this: World) {
  await this.page.goto('/');
});

When('I navigate to the quiz page', async function (this: World) {
  await this.page.goto('/quiz');
});

When('I reload the page', async function (this: World) {
  await this.page.reload({ waitUntil: 'networkidle' });
});

When('I visit the {string} page', async function (this: World, route: string) {
  await this.page.goto(`/${route}`);
});

When('I visit the bookmarks page without being logged in', async function (this: World) {
  await this.page.goto('/bookmarks');
});

When('I log in with valid credentials', async function (this: World) {
  loginPage = new LoginPage(this.page);
  await loginPage.fillEmail(this.state.testEmail);
  await loginPage.fillPassword(this.state.testPassword);
  await loginPage.clickSignIn();
});

Then('I should be redirected to the homepage', async function (this: World) {
  await this.page.waitForURL('**/');
});

Then('I should see the site title {string}', async function (this: World, title: string) {
  await expect(this.page.getByText(title).first()).toBeVisible();
});

Then('I should have a valid session', async function (this: World) {
  const loginPg = new LoginPage(this.page);
  const cookie = await loginPg.getSessionCookie();
  if (!cookie) throw new Error('No session cookie found');
});

Then('I should see an error message {string}', async function (this: World, message: string) {
  const page = loginPage || registerPage;
  await page.assertTextVisible(message, 10000);
});

Then('I should see a field validation error', async function (this: World) {
  await expect(this.page.locator('.ant-form-item-explain-error').first()).toBeVisible({ timeout: 5000 });
});

Then('I should still be logged in', async function (this: World) {
  const base = new BasePage(this.page);
  const loggedIn = await base.isLoggedIn();
  if (!loggedIn) throw new Error('Expected to be logged in');
});

Then('I should see my session cookie', async function (this: World) {
  const base = new BasePage(this.page);
  const cookie = await base.getSessionCookie();
  if (!cookie) throw new Error('No session cookie');
});

Then('I should not have a session', async function (this: World) {
  const base = new BasePage(this.page);
  const loggedIn = await base.isLoggedIn();
  if (loggedIn) throw new Error('Expected no session');
});

Then('protected routes should redirect to login', async function (this: World) {
  for (const route of ['/bookmarks', '/history', '/analytics']) {
    await this.page.goto(route);
    await expect(this.page).toHaveURL(/\/login/);
  }
});

Then('I should be redirected to the login page', async function () {
  await expect(this.page).toHaveURL(/\/login/);
});

Then('the login URL should contain a callback to {string}',
  async function (this: World, route: string) {
    const url = this.page.url();
    if (!url.includes(encodeURIComponent(route))) {
      throw new Error(`Expected callbackUrl to contain "${route}", got "${url}"`);
    }
  });

Then('the page should load successfully', async function (this: World) {
  await this.page.waitForLoadState('networkidle');
  const title = await this.page.title();
  if (!title) throw new Error('Page did not load');
});

Then('I should be redirected back to the bookmarks page', async function () {
  await expect(this.page).toHaveURL(/\/bookmarks/);
});

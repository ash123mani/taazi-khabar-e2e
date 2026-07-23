import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { World } from '../support/world';
import { container } from '../core/container';
import { RegisterPage } from '../pages/register.page';
import { LoginPage } from '../pages/login.page';
import { AuthAssertions } from '../assertions/auth.assertions';
import { Navbar } from '../components/navbar.component';

function getRegisterPage(): RegisterPage {
  return new RegisterPage(container.getPage());
}

function getLoginPage(): LoginPage {
  return new LoginPage(container.getPage());
}

function getAssertions(): AuthAssertions {
  return new AuthAssertions(container.getPage());
}

function getNavbar(): Navbar {
  return new Navbar(container.getPage());
}

Given('I choose a unique email', async function (this: World) {
  this.testEmail = this.freshEmail();
});

Given('a user with email {string} already exists', async function (this: World, email: string) {
  const res = await this.apiContext.post('/api/auth/register', {
    data: { email, password: 'Secure123!', name: 'Pre-registered User' },
  });
  if (res.status() !== 201 && res.status() !== 409 && res.status() !== 400) {
    throw new Error(`Failed to pre-register user: ${res.status()}`);
  }
});

Given('I am logged in', async function (this: World) {
  if (this.accessToken) return;
  this.testEmail = this.freshEmail();
  const result = await this.authService.register(this.testEmail, this.testPassword, this.testName);
  if (!result) throw new Error('Failed to register user for login');
  this.accessToken = result.accessToken;
  const loginPage = getLoginPage();
  await loginPage.navigate();
  await loginPage.login(this.testEmail, this.testPassword);
  await this.page.waitForURL('**/');
});

Given('there is a registered user', async function (this: World) {
  if (!this.accessToken) {
    const result = await this.authService.register(
      this.testEmail, this.testPassword, this.testName
    );
    if (result) this.accessToken = result.accessToken;
  }
});

When('I register with name {string}, email {string}, and password {string}',
  async function (this: World, name: string, email: string, password: string) {
    const resolvedEmail = email === '<email>' ? this.testEmail : email;
    const page = getRegisterPage();
    await page.navigate();
    await page.register(name, resolvedEmail, password);
  }
);

When('I attempt to register with name {string}, email {string}, and password {string}',
  async function (this: World, name: string, email: string, password: string) {
    const resolvedEmail = email === '<email>' ? this.testEmail : email;
    const page = getRegisterPage();
    await page.navigate();
    await page.register(name, resolvedEmail, password);
  }
);

When('I log in with email {string} and password {string}',
  async function (this: World, email: string, password: string) {
    const page = getLoginPage();
    await page.navigate();
    await page.login(email, password);
  }
);

When('I attempt to log in with email {string} and password {string}',
  async function (this: World, email: string, password: string) {
    const page = getLoginPage();
    await page.navigate();
    await page.login(email, password);
  }
);

When('I log in with my registered credentials', async function (this: World) {
  const page = getLoginPage();
  await page.navigate();
  await page.login(this.testEmail, this.testPassword);
});

When('I log out', async function (this: World) {
  const navbar = getNavbar();
  if (await navbar.logoutButton.isVisible()) {
    await navbar.clickLogout();
  }
});

When('I visit a protected page', async function (this: World) {
  const page = getLoginPage();
  await page.goto('/bookmarks');
});

Then('I should be redirected to the homepage', async function () {
  await getAssertions().redirectedToHomepage();
});

Then('I should see the site title {string}', async function (_title: string) {
  await getAssertions().seeSiteTitle();
});

Then('I should have a valid session', async function () {
  await getAssertions().hasValidSession();
});

Then('I should see an error message {string}', async function (msg: string) {
  await getAssertions().seeErrorMessage(msg);
});

Then('I should see a field validation error', async function () {
  await getAssertions().seeFieldValidationError();
});

Then('I should be redirected to the login page', async function () {
  await getAssertions().redirectedToLogin();
});

Then('the login URL should contain a callback to {string}',
  async function (this: World, callbackPath: string) {
    await expect(this.page).toHaveURL(new RegExp(`callbackUrl=/${callbackPath}`));
  }
);

Then('my email should be remembered', async function (this: World) {
  const page = getLoginPage();
  await expect(page.emailInput).toHaveValue(this.testEmail);
});

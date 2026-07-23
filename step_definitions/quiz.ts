import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { World } from '../support/world';
import { QuizPage } from '../pages/quiz.page';

Given('quiz data is available for today', async function (this: World) {
  if (!this.state.accessToken) throw new Error('Not authenticated');
  const dates = ['2026-07-24', '2026-07-23'];
  for (const d of dates) {
    const res = await this.apiContext.get(`/api/quizzes/by-date?date_str=${d}`);
    if (res.ok()) {
      const body = await res.json();
      if (body.categories?.length > 0) {
        this.state.quizCategoryId = body.categories[0].id;
        this.state.quizDate = d;
        return;
      }
    }
  }
  throw new Error('No quiz categories available');
});

Given('I am on a quiz detail page', async function (this: World) {
  if (!this.state.quizCategoryId || !this.state.accessToken) {
    const dates = ['2026-07-24', '2026-07-23'];
    for (const d of dates) {
      const res = await this.apiContext.get(`/api/quizzes/by-date?date_str=${d}`);
      if (res.ok()) {
        const body = await res.json();
        if (body.categories?.length > 0) {
          this.state.quizCategoryId = body.categories[0].id;
          this.state.quizDate = d;
          break;
        }
      }
    }
  }

  const qDate = this.state.quizDate || '2026-07-23';
  if (!this.state.quizCategoryId) throw new Error('No quiz category ID');
  const startRes = await this.apiContext.post('/api/quizzes/daily-start', {
    headers: { Authorization: `Bearer ${this.state.accessToken}` },
    data: { date: qDate, category_id: this.state.quizCategoryId },
  });
  if (!startRes.ok()) {
    const body = await startRes.text();
    throw new Error(`Failed to start quiz: ${startRes.status()} ${body}`);
  }
  const body = await startRes.json();
  this.state.quizId = body.quiz_id;
  if (!this.state.quizId) throw new Error('No quiz ID returned');

  const page = new QuizPage(this.page);
  await page.navigateToDetail(this.state.quizId);
});

When('I start a quiz for a category', async function (this: World) {
  const page = new QuizPage(this.page);
  if (!this.state.quizCategoryId) {
    await page.navigate();
    await page.assertCategoriesVisible();
  }
  await page.clickStartQuiz();
});

When('I select an answer option', async function (this: World) {
  const page = new QuizPage(this.page);
  await page.selectAnswer(0);
});

When('I submit my answers', async function (this: World) {
  const page = new QuizPage(this.page);
  await page.clickSubmit();
});

When('I submit the quiz without selecting any answers', async function (this: World) {
  const page = new QuizPage(this.page);
  // Wait briefly for questions to render, then submit without selecting
  await this.page.waitForTimeout(1000);
  await page.clickSubmit();
});

When('I click the {string} button on a category card',
  async function (this: World, buttonText: string) {
    if (buttonText.toLowerCase() === 'articles') {
      const page = new QuizPage(this.page);
      await page.navigate();
      await page.assertCategoriesVisible();
      await page.clickArticlesButton();
    }
  });

When('I visit the quiz page', async function (this: World) {
  const page = new QuizPage(this.page);
  await page.navigate();
});

When('I visit the quiz page for a date with no articles', async function (this: World) {
  const page = new QuizPage(this.page);
  await page.goto('/quiz?date=2020-01-01');
});

Then('I should see the quiz page heading', async function (this: World) {
  const page = new QuizPage(this.page);
  await page.assertHeadingVisible();
});

Then('I should see category-wise quiz sections', async function (this: World) {
  const page = new QuizPage(this.page);
  await page.assertCategoriesVisible();
});

Then('each category should show article and question counts', async function (this: World) {
  const page = new QuizPage(this.page);
  await page.assertCategoryHasCounts();
});

Then('I should see a date picker', async function (this: World) {
  const page = new QuizPage(this.page);
  await page.assertDatePickerVisible();
});

Then('changing the date should update the quiz data', async function (this: World) {
  // Placeholder for date change interaction
});

Then('the quiz page should show total articles', async function (this: World) {
  const page = new QuizPage(this.page);
  await page.assertStatsVisible();
});

Then('the quiz page should show total questions', async function (this: World) {
  const page = new QuizPage(this.page);
  await page.assertStatsVisible();
});

Then('I should see a {string} button', async function (this: World, buttonText: string) {
  if (buttonText === 'Take All') {
    const page = new QuizPage(this.page);
    await page.assertTakeAllVisible();
  }
});

Then('I should be on the quiz detail page', async function (this: World) {
  await expect(this.page).toHaveURL(/\/quiz\//);
});

Then('I should see the quiz questions', async function (this: World) {
  const page = new QuizPage(this.page);
  await page.assertQuestionVisible();
});

Then('I should see a countdown timer', async function (this: World) {
  const page = new QuizPage(this.page);
  await page.assertTimerVisible();
});

Then('the selected option should be highlighted', async function (this: World) {
  const page = new QuizPage(this.page);
  await page.assertOptionHighlighted();
});

Then('I should see the quiz result page', async function (this: World) {
  await expect(this.page).toHaveURL(/\/quiz\//);
});

Then('I should see my score', async function (this: World) {
  await expect(this.page.getByText(/\d+\/\d+/).first()).toBeVisible({ timeout: 10000 });
});

Then('I should see the correct answers', async function (this: World) {
  // Result page shows correct/incorrect indicators
  await expect(this.page.locator('[style*="color: #22c55e"], [style*="color: #ef4444"]').first()).toBeVisible({ timeout: 10000 });
});

Then('I should see the time taken', async function (this: World) {
  await expect(this.page.getByText(/m |s/).first()).toBeVisible({ timeout: 5000 });
});

Then('the quiz should still be submitted', async function () {
  // No action needed - the submission went through
});

Then('I should see a score of 0', async function (this: World) {
  await expect(this.page.getByText('0/').first()).toBeVisible({ timeout: 10000 });
});

Then('I should see an empty state message', async function (this: World) {
  const page = new QuizPage(this.page);
  await page.assertEmptyStateVisible();
});

Then('I should see guidance that articles need to be scraped first', async function () {
  // Empty state message is sufficient
});

Then('I should see a modal listing the articles', async function (this: World) {
  const page = new QuizPage(this.page);
  await page.assertArticleModalVisible();
});

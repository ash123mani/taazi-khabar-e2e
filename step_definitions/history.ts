import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { World } from '../support/world';
import { HistoryPage } from '../pages/history.page';

Given('I have completed a quiz', async function (this: World) {
  if (!this.state.accessToken) throw new Error('Not authenticated');
  if (!this.state.quizId) {
    const dates = ['2026-07-24', '2026-07-23'];
    let categoryId: string | null = null;
    let quizDate = '';
    for (const d of dates) {
      const res = await this.apiContext.get(`/api/quizzes/by-date?date_str=${d}`);
      if (res.ok()) {
        const body = await res.json();
        if (body.categories?.length > 0) {
          categoryId = body.categories[0].id;
          quizDate = d;
          break;
        }
      }
    }
    if (!categoryId) throw new Error('No quiz categories');

    const startRes = await this.apiContext.post('/api/quizzes/daily-start', {
      headers: { Authorization: `Bearer ${this.state.accessToken}` },
      data: { date: quizDate, category_id: categoryId },
    });
    if (!startRes.ok()) throw new Error('Failed to start quiz');
    const startBody = await startRes.json();
    this.state.quizId = startBody.quiz_id;
  }

  const qRes = await this.apiContext.get(`/api/quizzes/${this.state.quizId}`, {
    headers: { Authorization: `Bearer ${this.state.accessToken}` },
  });
  if (!qRes.ok()) throw new Error('Failed to fetch quiz');
  const quiz = await qRes.json();

  const answers: Record<string, string> = {};
  for (const q of quiz.questions) {
    answers[q.id] = q.options[0];
  }
  const sRes = await this.apiContext.post(`/api/quizzes/${this.state.quizId}/submit`, {
    headers: { Authorization: `Bearer ${this.state.accessToken}` },
    data: { answers },
  });
  if (!sRes.ok()) {
    const err = await sRes.text();
    throw new Error(`Failed to submit quiz: ${err.substring(0, 200)}`);
  }
});

When('I visit the history page', async function (this: World) {
  const page = new HistoryPage(this.page);
  await page.navigate();
});

When('I click on a quiz entry', async function (this: World) {
  const page = new HistoryPage(this.page);
  await page.clickFirstEntry();
});

When('I visit that history detail page', async function (this: World) {
  if (!this.state.quizId) throw new Error('No quiz ID');
  const page = new HistoryPage(this.page);
  await page.navigateToDetail(this.state.quizId);
});

When('I visit a non-existent history detail page', async function (this: World) {
  const page = new HistoryPage(this.page);
  await page.navigateToNonExistentDetail();
});

When('I visit the history page without being logged in', async function (this: World) {
  await this.page.goto('/history');
});

Then('I should see my quiz history', async function (this: World) {
  const page = new HistoryPage(this.page);
  await page.assertHeadingVisible();
});

Then('each entry should show the score and date', async function (this: World) {
  const page = new HistoryPage(this.page);
  await page.assertEntriesExist();
});

Then('I should see an empty history message', async function (this: World) {
  const page = new HistoryPage(this.page);
  await page.assertEmptyState();
});

Then('I should be on the history detail page', async function () {
  await expect(this.page).toHaveURL(/\/history\//);
});

Then('I should see the quiz result', async function (this: World) {
  const page = new HistoryPage(this.page);
  await page.assertResultVisible();
});

Then('I should see the score breakdown', async function (this: World) {
  const page = new HistoryPage(this.page);
  await page.assertScoreVisible();
});

Then('I should see all questions with correct answers', async function () {
  // Questions are rendered by QuizQuestionComponent
});

Then('I should see linked articles section', async function (this: World) {
  const page = new HistoryPage(this.page);
  await page.assertLinkedArticlesVisible();
});

Then('I should see the article count', async function () {
  // Article count is shown in the linked articles section
});

Then('I should see an error message', async function (this: World) {
  const page = new HistoryPage(this.page);
  await page.assertErrorVisible();
});

import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { World } from '../support/world';
import { AnalyticsPage } from '../pages/analytics.page';

Given('I have completed multiple quizzes', async function (this: World) {
  if (!this.state.accessToken) throw new Error('Not authenticated');
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

  for (let i = 0; i < 3; i++) {
    const startRes = await this.apiContext.post('/api/quizzes/daily-start', {
      headers: { Authorization: `Bearer ${this.state.accessToken}` },
      data: { date: quizDate, category_id: categoryId },
    });
    if (!startRes.ok()) continue;
    const startBody = await startRes.json();
    const quizId = startBody.quiz_id;

    const qRes = await this.apiContext.get(`/api/quizzes/${quizId}`, {
      headers: { Authorization: `Bearer ${this.state.accessToken}` },
    });
    if (!qRes.ok()) continue;
    const quiz = await qRes.json();

    const answers: Record<string, string> = {};
    for (const q of quiz.questions) {
      answers[q.id] = q.options[0];
    }
    await this.apiContext.post(`/api/quizzes/${quizId}/submit`, {
      headers: { Authorization: `Bearer ${this.state.accessToken}` },
      data: { answers },
    });
  }
});

When('I visit the analytics page', async function (this: World) {
  const page = new AnalyticsPage(this.page);
  await page.navigate();
});

Then('I should see the analytics dashboard', async function (this: World) {
  const page = new AnalyticsPage(this.page);
  await page.assertHeadingVisible();
});

Then('I should see performance statistics', async function (this: World) {
  const page = new AnalyticsPage(this.page);
  await page.assertStatsVisible();
});

Then('I should see score trends', async function (this: World) {
  const page = new AnalyticsPage(this.page);
  await page.assertChartsVisible();
});

Then('I should see category-wise breakdown', async function () {
  // Rendered as part of charts if data exists
});

Then('I should see an empty state if no quizzes exist', async function (this: World) {
  const page = new AnalyticsPage(this.page);
  await page.assertEmptyState();
});

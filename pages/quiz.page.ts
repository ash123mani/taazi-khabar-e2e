import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class QuizPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get heading() { return this.page.getByText(/Quiz/i).first(); }
  get datePicker() { return this.page.locator('.ant-picker'); }
  get statsArticles() { return this.page.getByText('Articles').first(); }
  get statsQuestions() { return this.page.getByText('Questions').first(); }
  get takeAllButton() { return this.page.getByText('Take All'); }
  get categoryCards() { return this.page.locator('[style*="border-radius: 12"]').filter({ hasText: /articles|questions/i }); }
  get categorySections() { return this.page.getByText(/Category-wise Quiz/i); }
  get emptyState() { return this.page.locator('.ant-empty'); }
  get startQuizButton() { return this.page.getByText('Start Quiz'); }
  get articlesButton() { return this.page.getByText('Articles'); }
  get articleModal() { return this.page.locator('.ant-modal'); }
  get questionOptions() { return this.page.locator('[style*="border-radius: 8"]'); }
  get submitButton() { return this.page.getByText(/submit/i); }
  get timer() { return this.page.getByText(/\d+m \d+s|timer/i); }
  get options() { return this.page.locator('[style*="border: 1px solid var(--color-border)"]').filter({ has: this.page.locator('[style*="border-radius: 50%"]') }); }

  async navigate() {
    await this.goto('/quiz');
  }

  async navigateToDetail(quizId: string) {
    await this.goto(`/quiz/${quizId}`);
  }

  async assertHeadingVisible() {
    await expect(this.heading).toBeVisible({ timeout: 10000 });
  }

  async assertCategoriesVisible() {
    await expect(this.categorySections).toBeVisible({ timeout: 10000 });
  }

  async assertCategoryHasCounts() {
    const count = await this.categoryCards.count();
    expect(count).toBeGreaterThan(0);
  }

  async assertDatePickerVisible() {
    await expect(this.datePicker).toBeVisible();
  }

  async assertStatsVisible() {
    await expect(this.statsArticles).toBeVisible();
    await expect(this.statsQuestions).toBeVisible();
  }

  async assertTakeAllVisible() {
    await expect(this.takeAllButton).toBeVisible();
  }

  async assertEmptyStateVisible() {
    await expect(this.emptyState).toBeVisible({ timeout: 10000 });
  }

  async clickStartQuiz() {
    await this.startQuizButton.first().click();
  }

  async clickArticlesButton() {
    await this.articlesButton.first().click();
  }

  async assertArticleModalVisible() {
    await expect(this.articleModal).toBeVisible({ timeout: 5000 });
  }

  async assertQuestionVisible() {
    await expect(this.options.first()).toBeVisible({ timeout: 15000 });
  }

  async assertTimerVisible() {
    await expect(this.timer).toBeVisible({ timeout: 15000 });
  }

  async selectAnswer(index: number = 0) {
    await this.options.nth(index).click();
  }

  async assertOptionHighlighted() {
    await expect(this.page.locator('[style*="background"]').first()).toBeVisible();
  }

  async clickSubmit() {
    await this.submitButton.click();
  }
}

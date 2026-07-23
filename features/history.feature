Feature: Quiz History
  As an authenticated user of Taazi Khabar
  I want to review my past quiz attempts
  So that I can track my progress and learn from mistakes

  Background:
    Given the application is running

  @history @positive @auth
  Scenario: History page shows completed quizzes
    Given I am logged in
    And I have completed a quiz
    When I visit the history page
    Then I should see my quiz history
    And each entry should show the score and date

  @history @positive @auth
  Scenario: History page shows empty state for new users
    Given I am logged in
    When I visit the history page
    Then I should see an empty history message

  @history @positive @auth
  Scenario: Clicking a history entry opens detail
    Given I am logged in
    And I have completed a quiz
    When I visit the history page
    And I click on a quiz entry
    Then I should be on the history detail page
    And I should see the quiz result
    And I should see the score breakdown
    And I should see all questions with correct answers

  @history @negative
  Scenario: History page redirects unauthenticated users
    When I visit the history page
    Then I should be redirected to the login page
    And the login URL should contain a callback to "history"

  @history @positive @auth
  Scenario: History detail shows linked articles
    Given I am logged in
    And I have completed a quiz
    When I visit that history detail page
    Then I should see linked articles section
    And I should see the article count

  @history @negative @auth
  Scenario: Accessing history detail for non-existent quiz shows error
    Given I am logged in
    When I visit a non-existent history detail page
    Then I should see an error message "Failed to load quiz details"

  @history @negative
  Scenario: History detail redirects unauthenticated users
    When I visit the history page without being logged in
    Then I should be redirected to the login page

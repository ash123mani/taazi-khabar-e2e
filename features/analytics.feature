Feature: Analytics
  As an authenticated user of Taazi Khabar
  I want to view my quiz performance analytics
  So that I can track my preparation progress

  Background:
    Given the application is running

  @analytics @positive @auth
  Scenario: Analytics dashboard loads with stats
    Given I am logged in
    When I visit the analytics page
    Then I should see the analytics dashboard
    And I should see performance statistics

  @analytics @positive @auth
  Scenario: Analytics shows quiz performance over time
    Given I am logged in
    And I have completed multiple quizzes
    When I visit the analytics page
    Then I should see score trends
    And I should see category-wise breakdown

  @analytics @positive @auth
  Scenario: Analytics shows empty state for new users
    Given I am logged in
    When I visit the analytics page
    Then I should see an empty state if no quizzes exist

  @analytics @negative
  Scenario: Analytics page redirects unauthenticated users
    When I visit the analytics page
    Then I should be redirected to the login page
    And the login URL should contain a callback to "analytics"

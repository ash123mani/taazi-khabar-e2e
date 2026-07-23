Feature: Admin
  As an authenticated user of Taazi Khabar
  I want to manage articles, categories, users, and other admin functions
  So that I can maintain the application

  Background:
    Given the application is running

  @admin @positive @auth
  Scenario: Admin dashboard displays statistics
    Given I am logged in
    When I visit the admin dashboard
    Then I should see the "Dashboard" heading
    And I should see total articles count
    And I should see total quizzes count
    And I should see average score
    And I should see active users count
    And I should see recent articles table
    And I should see recent quizzes table

  @admin @positive @auth
  Scenario Outline: Admin <page> page loads with correct heading
    Given I am logged in
    When I visit the admin <page> page
    Then I should see the "<heading>" heading

    Examples:
      | page           | heading           |
      | articles       | Article Management |
      | categories     | Category Management |
      | datasets       | Datasets           |
      | models         | Model Registry     |
      | scrape         | Scrape by Date     |
      | summaries      | Summaries          |
      | training-data  | Training Data      |
      | users          | User Management    |

  @admin @positive @auth
  Scenario: Article management page has search and table
    Given I am logged in
    When I visit the admin articles page
    Then I should see a search input
    And I should see an articles table
    And each article row should have edit and delete actions

  @admin @positive @auth
  Scenario: Category management page has search and table
    Given I am logged in
    When I visit the admin categories page
    Then I should see a search input
    And I should see a categories table
    And each category row should have edit and delete actions

  @admin @positive @auth
  Scenario: User management shows user stats and table
    Given I am logged in
    When I visit the admin users page
    Then I should see total users count
    And I should see admins count
    And I should see a users table with role columns

  @admin @positive @auth
  Scenario: Scrape page shows source tabs and date table
    Given I am logged in
    When I visit the admin scrape page
    Then I should see source tabs for The Hindu, Indian Express, and PIB
    And I should see a table with dates and scrape actions

  @admin @positive @auth
  Scenario: Admin sidebar navigation works
    Given I am logged in
    When I visit the admin dashboard
    Then I should see the admin sidebar
    And the sidebar should contain links to all admin sections

  @admin @negative
  Scenario: Admin pages redirect unauthenticated users
    When I visit the admin dashboard
    Then I should be redirected to the login page

Feature: Quiz
  As a user of Taazi Khabar
  I want to take daily quizzes on current affairs
  So that I can test and improve my UPSC preparation

  Background:
    Given the application is running

  @quiz @positive @public
  Scenario: Quiz listing page shows daily summary
    When I visit the quiz page
    Then I should see the quiz page heading
    And I should see category-wise quiz sections
    And each category should show article and question counts

  @quiz @positive @public
  Scenario: Quiz listing shows date picker
    When I visit the quiz page
    Then I should see a date picker
    And changing the date should update the quiz data

  @quiz @positive @public
  Scenario: Quiz listing shows stats row
    When I visit the quiz page
    Then the quiz page should show total articles
    And the quiz page should show total questions
    And I should see a "Take All" button

  @quiz @positive @auth
  Scenario: Authenticated user can start a category quiz
    Given I am logged in
    And quiz data is available for today
    When I start a quiz for a category
    Then I should be on the quiz detail page
    And I should see the quiz questions
    And I should see a countdown timer

  @quiz @negative @auth
  Scenario: Starting a quiz without being logged in shows error
    When quiz data is available for today
    And I start a quiz for a category
    Then I should be redirected to the login page

  @quiz @positive @auth
  Scenario: User can answer a question and see option highlighted
    Given I am on a quiz detail page
    When I select an answer option
    Then the selected option should be highlighted

  @quiz @positive @auth
  Scenario: User can submit quiz and see results
    Given I am on a quiz detail page
    When I submit my answers
    Then I should see the quiz result page
    And I should see my score
    And I should see the correct answers
    And I should see the time taken

  @quiz @negative @auth
  Scenario: Submitting without selecting any answer
    Given I am on a quiz detail page
    When I submit the quiz without selecting any answers
    Then the quiz should still be submitted
    And I should see a score of 0

  @quiz @positive @public
  Scenario: Empty state for dates with no quizzes
    When I visit the quiz page for a date with no articles
    Then I should see an empty state message
    And I should see guidance that articles need to be scraped first

  @quiz @positive @auth
  Scenario: Category card shows articles modal
    Given I am logged in
    And quiz data is available for today
    When I click the "Articles" button on a category card
    Then I should see a modal listing the articles

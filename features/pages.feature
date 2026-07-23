Feature: Non-Admin Pages
  As a user of Taazi Khabar
  I want all pages to load correctly
  So that I can browse content seamlessly

  Background:
    Given the application is running

  @public
  Scenario: Homepage loads with news articles
    When I visit the homepage
    Then I should see the news feed
    And I should see at least one article card

  @public
  Scenario: Article detail page loads
    Given an article exists in the system
    When I visit that article page
    Then I should see the article headline
    And I should see the article body

  @public
  Scenario: Quiz listing page loads
    When I visit the quiz page
    Then I should see the quiz listing
    And I should see the daily quiz summary

  @public
  Scenario: Login page loads
    When I visit the login page
    Then I should see the login form
    And I should see a sign-in button

  @public
  Scenario: Register page loads
    When I visit the registration page
    Then I should see the registration form
    And I should see a create account button

  @protected
  Scenario: Bookmarks page loads when authenticated
    Given I am logged in
    When I visit the bookmarks page
    Then I should see my bookmarks list

  @protected
  Scenario: History page loads when authenticated
    Given I am logged in
    When I visit the history page
    Then I should see my quiz history

  @protected
  Scenario: Analytics page loads when authenticated
    Given I am logged in
    When I visit the analytics page
    Then I should see the analytics dashboard

  @unauthenticated @middleware
  Scenario: Bookmarks page redirects when not authenticated
    When I visit the bookmarks page
    Then I should be redirected to the login page

  @unauthenticated @middleware
  Scenario: History page redirects when not authenticated
    When I visit the history page
    Then I should be redirected to the login page

  @unauthenticated @middleware
  Scenario: Analytics page redirects when not authenticated
    When I visit the analytics page
    Then I should be redirected to the login page

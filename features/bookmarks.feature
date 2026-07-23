Feature: Bookmarks
  As an authenticated user of Taazi Khabar
  I want to bookmark articles for later reading
  So that I can curate my own reading list

  Background:
    Given the application is running

  @bookmark @positive @auth
  Scenario: Bookmarks page shows bookmarked articles
    Given I am logged in
    And I have bookmarked an article
    When I visit the bookmarks page
    Then I should see my bookmarked article
    And the article should display its headline

  @bookmark @positive @auth
  Scenario: Bookmarks page shows empty state for new users
    Given I am logged in
    When I visit the bookmarks page
    Then I should see an empty bookmarks message

  @bookmark @positive @auth
  Scenario: Unbookmarking an article removes it from bookmarks
    Given I am logged in
    And I have bookmarked an article
    When I unbookmark the article
    And I visit the bookmarks page
    Then I should see an empty bookmarks message

  @bookmark @negative
  Scenario: Bookmarks page redirects unauthenticated users
    When I visit the bookmarks page
    Then I should be redirected to the login page
    And the login URL should contain a callback to "bookmarks"

  @bookmark @positive @auth
  Scenario: Multiple bookmarked articles appear as a list
    Given I am logged in
    And I have bookmarked 3 articles
    When I visit the bookmarks page
    Then I should see all 3 bookmarked articles

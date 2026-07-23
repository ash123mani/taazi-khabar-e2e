Feature: Homepage News Feed
  As a visitor to Taazi Khabar
  I want to see the latest news articles aggregated from multiple sources
  So that I can stay informed about current affairs

  Background:
    Given the application is running

  @homepage @positive
  Scenario: Homepage loads with article feed
    When I visit the homepage
    Then I should see the site title "Taazi Khabar"
    And I should see the news feed
    And I should see at least one article card

  @homepage @positive
  Scenario: Article cards display source, headline, and date
    When I visit the homepage
    Then each article card should show a source label
    And each article card should show a headline
    And each article card should show a published date

  @homepage @positive
  Scenario: Clicking an article card navigates to article detail
    When I visit the homepage
    And I click the first article card
    Then I should be on the article detail page
    And I should see the article headline

  @homepage @positive @mobile
  Scenario: Homepage adapts to mobile layout
    When I view the page at mobile width 375px
    Then the article feed should display in a single column

  @homepage @positive @desktop
  Scenario: Homepage adapts to desktop layout
    When I view the page at desktop width 1280px
    Then the article feed should display in a two-column grid

  @homepage @positive
  Scenario: Articles from multiple sources are displayed
    When I visit the homepage
    Then I should see articles from "The Hindu"
    And I should see articles from "Indian Express"
    And I should see articles from "PIB"

Feature: Article Detail
  As a user of Taazi Khabar
  I want to read full article details
  So that I can stay informed

  Background:
    Given the application is running
    Given an article exists in the system

  @article @positive
  Scenario: Article detail page displays full content
    When I visit that article page
    Then I should see the article headline
    And I should see the article body
    And I should see the article source
    And I should see the published date

  @article @positive
  Scenario: Article shows syllabus tags when available
    When I visit that article page
    Then I should see syllabus tags if the article has them

  @article @positive
  Scenario: Article source is color-coded
    When I visit that article page
    Then the source label should have a distinct color

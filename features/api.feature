Feature: Backend API
  As a developer
  I want the backend API to respond correctly
  So that the frontend can rely on it

  Background:
    Given the application is running

  @api
  Scenario: Health check returns ok
    When I call the backend health endpoint
    Then I should receive a 200 status with status "ok"

  @api
  Scenario: Register API creates user and returns token
    When I call the backend register API with new credentials
    Then I should receive a 201 status
    And the response should contain an access token

  @api
  Scenario: Login API returns token for valid credentials
    Given a test user exists
    When I call the backend login API with those credentials
    Then I should receive a 200 status
    And the response should contain an access token

  @api
  Scenario: Login API rejects invalid credentials
    When I call the backend login API with wrong password
    Then I should receive a 401 status

  @api
  Scenario: /me endpoint rejects requests without token
    When I call the backend /me API without a token
    Then I should receive a 401 status

  @api
  Scenario: /me endpoint accepts valid token
    Given a test user exists
    And I have that user's access token
    When I call the backend /me API with my token
    Then I should receive a 200 status
    And the response should contain my user email

  @api
  Scenario: /me endpoint rejects invalid token
    When I call the backend /me API with an invalid token
    Then I should receive a 401 status

  @api
  Scenario: Optional auth API works without authentication
    When I call the backend quizzes summary API without a token
    Then I should receive a 200 status

  @api
  Scenario: Protected quiz API rejects unauthenticated requests
    When I call the backend quiz detail API without a token
    Then I should receive a 401 status

  @api
  Scenario: Articles list API returns articles
    When I call the backend articles API
    Then I should receive a 200 status
    And the response should contain a list of articles

  @api
  Scenario: Categories API returns categories
    When I call the backend categories API
    Then I should receive a 200 status
    And the response should contain a list of categories

Feature: Authentication
  As a user of Taazi Khabar
  I want to register, log in, and manage my session
  So that I can access personalized content

  @unauthenticated
  Scenario: User visits homepage
    When I visit the homepage
    Then I should see the site title "Taazi Khabar"

  @unauthenticated
  Scenario: Login page has form fields
    When I visit the login page
    Then I should see a login form with email and password fields

  @unauthenticated
  Scenario: Register page has form fields
    When I visit the registration page
    Then I should see a registration form with name, email, and password fields

  @unauthenticated @middleware
  Scenario: Protected route redirects to login
    When I visit the bookmarks page
    Then I should be redirected to the login page

  @registration
  Scenario: Register a new account with auto-login
    Given I have a unique email address
    When I visit the registration page
    And I fill the registration form with my details
    And I submit the registration form
    Then I should be redirected to the homepage
    And I should have a valid session cookie

  @registration
  Scenario: Duplicate registration shows error
    Given I have already registered an account
    When I visit the registration page
    And I try to register again with the same email
    Then I should see a "already registered" error message

  @login
  Scenario: Log in with existing credentials
    Given I have a registered account
    When I visit the login page
    And I fill the login form with my credentials
    And I submit the login form
    Then I should be redirected to the homepage
    And I should have a valid session cookie

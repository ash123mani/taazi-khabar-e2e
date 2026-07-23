Feature: Authentication
  As a visitor to Taazi Khabar
  I want to register, log in, and manage my session
  So that I can access personalized content like bookmarks, quizzes, and analytics

  Background:
    Given the application is running

  # ───────── Registration ─────────

  @registration @positive
  Scenario: Register with valid credentials and auto-login
    Given I choose a unique email
    When I register with name "E2E User", email "<email>", and password "Secure123!"
    Then I should be redirected to the homepage
    And I should see the site title "Taazi Khabar"
    And I should have a valid session

  @registration @negative
  Scenario: Register with an already registered email
    Given a user with email "duplicate@test.com" already exists
    When I attempt to register with name "E2E User", email "duplicate@test.com", and password "Secure123!"
    Then I should see an error message "already registered"

  @registration @negative @validation
  Scenario Outline: Register with invalid input shows validation error
    When I attempt to register with name "<name>", email "<email>", and password "<password>"
    Then I should see a field validation error

    Examples:
      | name      | email              | password   |
      |           | user@test.com      | Secure123! |
      | E2E User  | invalid-email      | Secure123! |
      | E2E User  | user@test.com      | 123       |
      | E2E User  |                    | Secure123! |

  # ───────── Login ─────────

  @login @positive
  Scenario: Login with valid credentials
    Given a user with email "login-test@test.com" already exists
    When I log in with email "login-test@test.com" and password "Secure123!"
    Then I should be redirected to the homepage
    And I should see the site title "Taazi Khabar"
    And I should have a valid session

  @login @negative
  Scenario: Login with wrong password shows error
    Given a user with email "wrong-pw@test.com" already exists
    When I attempt to log in with email "wrong-pw@test.com" and password "WrongPassword1"
    Then I should see an error message "Invalid email or password"

  @login @negative
  Scenario: Login with non-existent email shows error
    When I attempt to log in with email "nonexistent@test.com" and password "Secure123!"
    Then I should see an error message "Invalid email or password"

  @login @negative @validation
  Scenario Outline: Login with empty fields shows validation
    When I attempt to log in with email "<email>" and password "<password>"
    Then I should see a field validation error

    Examples:
      | email              | password |
      |                    | Secure123! |
      | user@test.com      |          |

  # ───────── Session ─────────

  @session @positive
  Scenario: Session persists after navigating between pages
    Given I am logged in
    When I navigate to the homepage
    And I navigate to the quiz page
    Then I should still be logged in
    And I should see my session cookie

  @session @positive
  Scenario: Session persists after page reload
    Given I am logged in
    When I reload the page
    Then I should still be logged in

  # ───────── Logout ─────────

  @logout @positive
  Scenario: Logout clears session and redirects to homepage
    Given I am logged in
    When I log out
    Then I should be redirected to the homepage
    And I should not have a session
    And protected routes should redirect to login

  # ───────── Protected Routes ─────────

  @protected @negative
  Scenario Outline: Protected route <route> redirects unauthenticated users to login
    When I visit the "<route>" page
    Then I should be redirected to the login page
    And the login URL should contain a callback to "<route>"

    Examples:
      | route      |
      | bookmarks  |
      | history    |
      | analytics  |
      | admin      |

  @protected @positive
  Scenario: Authenticated users can access protected routes
    Given I am logged in
    When I visit the "<route>" page
    Then the page should load successfully

    Examples:
      | route      |
      | bookmarks  |
      | history    |
      | analytics  |

  @protected @positive
  Scenario: Callback URL redirects to original page after login
    When I visit the bookmarks page without being logged in
    Then I should be redirected to the login page
    When I log in with valid credentials
    Then I should be redirected back to the bookmarks page

Feature: Horizon Aid theme - The site renders through the theme without errors
      As a site visitor
      I want every public page rendered by the Horizon Aid theme to load cleanly
      So that a theme regression (a broken hook, template or library) is caught in CI.

  # The CI job installs the site from the Horizon Aid site template recipe, which
  # sets this theme as the default. Every scenario runs against pages the
  # recipe ships, so a template or preprocess error that breaks a page fails
  # its own named row.

  @check @theme
  Scenario: The front page renders with the theme's landmarks
    Given I am an anonymous user
     When I go to "/"
      And I wait until the page is loaded
     Then I should not see "The website encountered an unexpected error"
      And "header[role='banner']" should be visible
      And "footer" should be visible

  @check @theme
  Scenario: The main navigation renders as a Bootstrap navbar
    Given I am an anonymous user
     When I go to "/"
      And I wait until the page is loaded
     Then ".navbar" should be visible
      And ".navbar-nav" should be attached
      And ".navbar-nav .nav-link" should be visible

  @check @theme
  Scenario: An interior page renders through the same theme
    Given I am an anonymous user
     When I go to "/about"
      And I wait until the page is loaded
     Then I should not see "The website encountered an unexpected error"
      And "header[role='banner']" should be visible
      And ".navbar" should be visible

  # The login route renders through a minimal layout without the site footer,
  # so only the form itself is asserted here.
  @check @theme
  Scenario: The login page renders through the theme
    Given I am an anonymous user
     When I go to "/user/login"
      And I wait until the page is loaded
     Then "#edit-name" should be visible
      And "#edit-pass" should be visible

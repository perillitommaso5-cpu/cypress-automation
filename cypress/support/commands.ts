// Custom Cypress commands

/**
 * cy.login(username, password)
 * Performs a full UI login.
 */
Cypress.Commands.add('login', (username: string, password: string) => {
  cy.visit('/');
  cy.get('#user-name').type(username);
  cy.get('#password').type(password);
  cy.get('#login-button').click();
  cy.url().should('include', '/inventory');
});

/**
 * cy.loginBySession(username, password)
 * Fast login using cy.session() — caches authenticated cookies/localStorage.
 * validate() checks the URL instead of localStorage to avoid Cypress context issues.
 * After this command the browser is already on /inventory.
 */
Cypress.Commands.add('loginBySession', (username: string, password: string) => {
  cy.session(
    [username, password],
    () => {
      cy.visit('/');
      cy.get('#user-name').type(username);
      cy.get('#password').type(password);
      cy.get('#login-button').click();
      cy.url().should('include', '/inventory');
    },
    {
      validate() {
        // Visit '/' — SauceDemo redirects to /inventory if session is valid,
        // stays on login page if not. This is the only reliable check.
        cy.visit('/');
        cy.url().should('include', '/inventory');
      },
      cacheAcrossSpecs: false,
    }
  );
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(username: string, password: string): Chainable<void>;
      loginBySession(username: string, password: string): Chainable<void>;
    }
  }
}

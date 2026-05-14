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
});

/**
 * cy.loginBySession(username, password)
 * Fast login using cy.session() — caches the authenticated state
 * and replays it across tests without re-executing the UI flow.
 */
Cypress.Commands.add('loginBySession', (username: string, password: string) => {
  cy.session([username, password], () => {
    cy.visit('/');
    cy.get('#user-name').type(username);
    cy.get('#password').type(password);
    cy.get('#login-button').click();
    cy.url().should('include', '/inventory');
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(username: string, password: string): Chainable<void>;
      loginBySession(username: string, password: string): Chainable<void>;
    }
  }
}

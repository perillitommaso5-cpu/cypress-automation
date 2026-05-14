// Custom Cypress commands

/**
 * cy.login(username, password)
 * Performs a full login via UI.
 */
Cypress.Commands.add('login', (username: string, password: string) => {
  cy.visit('/');
  cy.get('#user-name').type(username);
  cy.get('#password').type(password);
  cy.get('#login-button').click();
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(username: string, password: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (username: string, password: string) => {
  cy.visit('/');
  cy.get('#user-name').type(username);
  cy.get('#password').type(password);
  cy.get('#login-button').click();
  cy.url().should('include', '/inventory');
});

/**
 * cy.loginBySession() — esegue il login UI una volta sola per spec file.
 *
 * Perché serve cy.reload():
 * cy.session() ripristina il localStorage DOPO che cy.visit('/') ha già
 * caricato la pagina. SauceDemo legge session-username al mount dell'app —
 * se il localStorage arriva tardi, non fa il redirect. Il reload forza
 * SauceDemo a rileggere il localStorage già popolato da Cypress.
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
    }
  );
  cy.visit('/');
  cy.reload();
  cy.url().should('include', '/inventory');
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(username: string, password: string): Chainable<void>;
      loginBySession(username: string, password: string): Chainable<void>;
    }
  }
}

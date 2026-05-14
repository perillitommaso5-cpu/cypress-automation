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
 * Fast login using cy.session() — caches authenticated cookies.
 * validate() confirms the session is still valid before reusing it.
 * After calling this, use cy.visit('/') or navigate via UI — not cy.visit('/inventory').
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
        // SauceDemo persiste la sessione via localStorage
        cy.wrap(window.localStorage.getItem('session-username')).should('not.be.null');
      },
      cacheAcrossSpecs: false,
    }
  );
  // Dopo cy.session() naviga sempre da '/' — SauceDemo non serve route dirette
  cy.visit('/');
  cy.url().then((url) => {
    // Se session valida, SauceDemo fa redirect automatico a /inventory
    if (!url.includes('/inventory')) {
      cy.get('#user-name').type(username);
      cy.get('#password').type(password);
      cy.get('#login-button').click();
      cy.url().should('include', '/inventory');
    }
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

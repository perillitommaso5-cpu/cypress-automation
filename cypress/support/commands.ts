Cypress.Commands.add('login', (username: string, password: string) => {
  cy.visit('/');
  cy.get('#user-name').type(username);
  cy.get('#password').type(password);
  cy.get('#login-button').click();
  cy.url().should('include', '/inventory');
});

/**
 * cy.loginBySession() — esegue il login UI una volta sola per spec file.
 * cy.session() ripristina localStorage + cookies tra i test senza rieseguire il flusso.
 * Dopo questa chiamata il browser è su / e SauceDemo fa il redirect a /inventory.
 * NON usare cy.visit('/inventory') dopo — non è una route servita dal server.
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
    // Nessun validate() — SauceDemo non invalida la sessione durante la suite.
    // Il setup viene eseguito una volta sola; il ripristino avviene tramite
    // localStorage snapshot che cy.session() salva automaticamente.
  );
  // Dopo il ripristino della sessione naviga a / per triggerare il redirect.
  cy.visit('/');
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(username: string, password: string): Chainable<void>;
      loginBySession(username: string, password: string): Chainable<void>;
    }
  }
}

import LoginPage from '../pages/LoginPage';
import InventoryPage from '../pages/InventoryPage';

/**
 * Session & Auth Guard Tests
 * Verifica il comportamento dell'app relativamente alla gestione
 * della sessione: persistenza, invalidazione e protezione delle route.
 */
describe('Session & Auth Guard', () => {

  context('Persistenza sessione', () => {
    it('ricaricare la pagina da autenticato mantiene la sessione', () => {
      cy.fixture('users').then((users) => {
        LoginPage.login(users.standard.username, users.standard.password);
        InventoryPage.assertLoaded();
        cy.reload();
        // Dopo reload l'utente deve rimanere autenticato
        InventoryPage.assertLoaded();
      });
    });

    it('il localStorage contiene il token di sessione dopo il login', () => {
      cy.fixture('users').then((users) => {
        LoginPage.login(users.standard.username, users.standard.password);
        InventoryPage.assertLoaded();
        cy.getAllLocalStorage().then((storage) => {
          const siteStorage = storage[Cypress.config('baseUrl') as string];
          expect(siteStorage).to.have.property('session-username');
        });
      });
    });

    it('dopo logout il localStorage non contiene la sessione', () => {
      cy.fixture('users').then((users) => {
        LoginPage.login(users.standard.username, users.standard.password);
        InventoryPage.assertLoaded();
        LoginPage.logout();
        cy.getAllLocalStorage().then((storage) => {
          const siteStorage = storage[Cypress.config('baseUrl') as string] ?? {};
          expect(siteStorage).to.not.have.property('session-username');
        });
      });
    });
  });

  context('Auth Guard — protezione route', () => {
    it('accesso diretto a /inventory senza login fa redirect alla login page', () => {
      // Nessun login — visita diretta alla route protetta
      cy.visit('/inventory');
      cy.url().should('not.include', '/inventory');
      cy.get('#login-button').should('be.visible');
    });

    it('accesso diretto a /cart senza login fa redirect alla login page', () => {
      cy.visit('/cart');
      cy.url().should('not.include', '/cart');
      cy.get('#login-button').should('be.visible');
    });

    it('accesso diretto a /checkout-step-one senza login fa redirect alla login page', () => {
      cy.visit('/checkout-step-one');
      cy.url().should('not.include', '/checkout');
      cy.get('#login-button').should('be.visible');
    });
  });

  context('cy.session() — login cachato', () => {
    it('cy.loginBySession riusa la sessione senza re-eseguire il flusso UI', () => {
      cy.fixture('users').then((users) => {
        cy.loginBySession(users.standard.username, users.standard.password);
        cy.visit('/inventory');
        InventoryPage.assertLoaded();
      });
    });
  });

});

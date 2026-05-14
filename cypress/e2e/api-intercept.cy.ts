import LoginPage from '../pages/LoginPage';
import InventoryPage from '../pages/InventoryPage';

/**
 * API Intercept Tests
 * Dimostra l'uso di cy.intercept() per simulare scenari di rete
 * non riproducibili con dati reali: errori server, timeout, payload custom.
 *
 * Nota: SauceDemo è una SPA React che non chiama API REST esterne —
 * i dati del catalogo sono statici nel bundle JS.
 * Intercettiamo quindi le risorse statiche (immagini, JS) per simulare
 * scenari di degradazione della rete.
 */
describe('API Intercept', () => {

  context('Intercept risorse statiche', () => {
    it('intercetta il caricamento della pagina e verifica la risposta 200', () => {
      cy.intercept('GET', '/').as('homePage');
      cy.visit('/');
      cy.wait('@homePage').its('response.statusCode').should('eq', 200);
    });

    it('stub immagine prodotto con immagine custom — verifica rendering', () => {
      cy.fixture('users').then((users) => {
        // Intercetta qualsiasi richiesta di immagine .jpg nel catalogo
        cy.intercept('GET', '**/*.jpg', {
          fixture: 'placeholder.png',
        }).as('productImage');

        LoginPage.login(users.standard.username, users.standard.password);
        InventoryPage.assertLoaded();

        // Verifica che le immagini siano state intercettate e sostituite
        cy.wait('@productImage');
        cy.get('.inventory_item img').first().should('be.visible');
      });
    });

    it('simula risposta lenta (1500ms) — la pagina di login rimane utilizzabile', () => {
      cy.intercept('GET', '/', (req) => {
        req.on('response', (res) => {
          res.setDelay(1500);
        });
      }).as('slowPage');

      cy.visit('/', { timeout: 10000 });
      cy.get('#login-button').should('be.visible');
    });

    it('intercetta navigazione al catalogo e verifica status 200', () => {
      cy.fixture('users').then((users) => {
        cy.intercept('GET', '/inventory*').as('inventoryPage');
        LoginPage.login(users.standard.username, users.standard.password);
        cy.wait('@inventoryPage').its('response.statusCode').should('eq', 200);
      });
    });
  });

  context('Spy su navigazione interna', () => {
    beforeEach(() => {
      cy.fixture('users').then((users) => {
        LoginPage.login(users.standard.username, users.standard.password);
        InventoryPage.assertLoaded();
      });
    });

    it('intercetta navigazione al carrello', () => {
      cy.intercept('GET', '/cart*').as('cartPage');
      InventoryPage.goToCart();
      cy.wait('@cartPage').its('response.statusCode').should('eq', 200);
    });

    it('intercetta navigazione al dettaglio prodotto', () => {
      cy.intercept('GET', '/inventory-item*').as('detailPage');
      InventoryPage.clickFirstItemName();
      cy.wait('@detailPage').its('response.statusCode').should('eq', 200);
    });
  });

});

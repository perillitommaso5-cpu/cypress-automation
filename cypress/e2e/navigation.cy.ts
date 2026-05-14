import LoginPage from '../pages/LoginPage';
import InventoryPage from '../pages/InventoryPage';

describe('Navigation & UX', () => {

  beforeEach(() => {
    cy.fixture('users').then((users) => {
      LoginPage.login(users.standard.username, users.standard.password);
      InventoryPage.assertLoaded();
    });
  });

  // ─── Hamburger menu

  context('Hamburger menu', () => {
    it('menu si apre al click', () => {
      cy.get('#react-burger-menu-btn').click();
      cy.get('.bm-menu-wrap').should('be.visible');
    });

    it('menu si chiude con il bottone X', () => {
      cy.get('#react-burger-menu-btn').click();
      cy.get('#react-burger-cross-btn').click();
      cy.get('.bm-menu-wrap').should('not.be.visible');
    });

    it('"About" reindirizza al sito Sauce Labs (nuova tab o redirect)', () => {
      cy.get('#react-burger-menu-btn').click();
      cy.get('#about_sidebar_link').should('have.attr', 'href').and('include', 'saucelabs.com');
    });

    it('logout dal menu reindirizza alla login page', () => {
      LoginPage.logout();
      cy.url().should('eq', Cypress.config('baseUrl') + '/');
    });
  });

  // ─── Reset App State

  context('Reset App State', () => {
    it('reset svuota il carrello', () => {
      InventoryPage.addAllItemsToCart();
      InventoryPage.getCartBadge().should('exist');
      cy.get('#react-burger-menu-btn').click();
      cy.get('#reset_sidebar_link').click();
      cy.get('#react-burger-cross-btn').click();
      InventoryPage.cartBadgeShouldNotExist();
    });

    it('reset riporta tutti i bottoni ad "Add to cart"', () => {
      InventoryPage.addAllItemsToCart();
      cy.get('#react-burger-menu-btn').click();
      cy.get('#reset_sidebar_link').click();
      cy.get('#react-burger-cross-btn').click();
      cy.get('[data-test^="add-to-cart"]').should('have.length', 6);
    });
  });

});

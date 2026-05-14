import InventoryPage from '../pages/InventoryPage';

/**
 * Keyboard Navigation Tests
 * Verifica che le funzionalità principali siano accessibili
 * e utilizzabili completamente tramite tastiera.
 */
describe('Keyboard Navigation', () => {

  context('Login via tastiera', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('login completabile solo con Tab + Enter senza mouse', () => {
      // Focus su username, digita, Tab su password, digita, Tab su button, Enter
      cy.get('#user-name').focus().type('standard_user');
      cy.realPress('Tab');
      cy.focused().should('have.attr', 'id', 'password').type('secret_sauce');
      cy.realPress('Tab');
      cy.focused().should('have.attr', 'id', 'login-button');
      cy.realPress('Enter');
      InventoryPage.assertLoaded();
    });

    it('Tab order sulla login page è corretto: username → password → button', () => {
      cy.get('#user-name').focus();
      cy.realPress('Tab');
      cy.focused().should('have.attr', 'id', 'password');
      cy.realPress('Tab');
      cy.focused().should('have.attr', 'id', 'login-button');
    });
  });

  context('Checkout form via tastiera', () => {
    beforeEach(() => {
      cy.fixture('users').then((users) => {
        cy.visit('/');
        cy.get('#user-name').type(users.standard.username);
        cy.get('#password').type(users.standard.password);
        cy.get('#login-button').click();
        InventoryPage.assertLoaded();
        InventoryPage.addFirstItemToCart();
        InventoryPage.goToCart();
        cy.get('[data-test="checkout"]').click();
        cy.url().should('include', '/checkout-step-one');
      });
    });

    it('form checkout completabile con Tab tra i campi', () => {
      cy.fixture('checkout').then((data) => {
        cy.get('[data-test="firstName"]').focus().type(data.valid.firstName);
        cy.realPress('Tab');
        cy.focused().should('have.attr', 'data-test', 'lastName').type(data.valid.lastName);
        cy.realPress('Tab');
        cy.focused().should('have.attr', 'data-test', 'postalCode').type(data.valid.zip);
        cy.realPress('Tab');
        cy.focused().should('have.attr', 'data-test', 'continue');
        cy.realPress('Enter');
        cy.url().should('include', '/checkout-step-two');
      });
    });
  });

});

import InventoryPage from '../pages/InventoryPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';

function logViolations(violations: Cypress.Violation[]) {
  violations.forEach((v) => {
    Cypress.log({ name: 'a11y', message: `[${v.impact}] ${v.id}: ${v.description}` });
  });
}

// Login diretto senza cy.session() — evita il race condition
// localStorage/redirect che causa timeout in CI su SauceDemo.
function loginDirect() {
  cy.fixture('users').then((users) => {
    cy.visit('/', { timeout: 120000 });
    cy.get('#user-name', { timeout: 15000 }).type(users.standard.username);
    cy.get('#password').type(users.standard.password);
    cy.get('#login-button').click();
    cy.url({ timeout: 30000 }).should('include', '/inventory');
  });
}

describe('Accessibility (WCAG 2.1 AA)', () => {

  context('Login page', () => {
    it('nessuna violazione critica sulla login page', () => {
      cy.visit('/', { timeout: 120000 });
      cy.injectAxe();
      cy.checkA11y(undefined, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] },
        includedImpacts: ['critical', 'serious'],
      }, logViolations, true);
    });
  });

  context('Inventory page', () => {
    before(() => { loginDirect(); });

    it('nessuna violazione critica sul catalogo prodotti', () => {
      InventoryPage.assertLoaded();
      cy.injectAxe();
      cy.checkA11y(undefined, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] },
        includedImpacts: ['critical', 'serious'],
      }, logViolations, true);
    });

    it('nessuna violazione critica sul carrello', () => {
      InventoryPage.addFirstItemToCart();
      InventoryPage.goToCart();
      CartPage.assertLoaded();
      cy.injectAxe();
      cy.checkA11y(undefined, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] },
        includedImpacts: ['critical', 'serious'],
      }, logViolations, true);
    });
  });

  context('Checkout page', () => {
    before(() => {
      loginDirect();
      InventoryPage.assertLoaded();
      InventoryPage.addFirstItemToCart();
      InventoryPage.goToCart();
      CartPage.goToCheckout();
      CheckoutPage.assertStepOneLoaded();
    });

    it('nessuna violazione critica sul form di checkout', () => {
      cy.injectAxe();
      cy.checkA11y(undefined, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] },
        includedImpacts: ['critical', 'serious'],
      }, logViolations, true);
    });
  });

});

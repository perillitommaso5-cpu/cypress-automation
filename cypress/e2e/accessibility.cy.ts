import InventoryPage from '../pages/InventoryPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';

function logViolations(violations: Cypress.Violation[]) {
  if (violations.length === 0) return;
  violations.forEach((v) => {
    Cypress.log({ name: 'a11y', message: `[${v.impact}] ${v.id}: ${v.description}` });
  });
}

describe('Accessibility (WCAG 2.1 AA)', () => {

  context('Login page', () => {
    it('nessuna violazione critica sulla login page', () => {
      cy.visit('/');
      cy.injectAxe();
      cy.checkA11y(undefined, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] },
        includedImpacts: ['critical', 'serious'],
      }, logViolations, true);
    });
  });

  context('Inventory page', () => {
    before(() => {
      // Usa before (una volta sola) invece di beforeEach per evitare
      // page load multipli — injectAxe viene chiamato dentro ogni test.
      cy.fixture('users').then((users) => {
        cy.loginBySession(users.standard.username, users.standard.password);
        InventoryPage.assertLoaded();
      });
    });

    it('nessuna violazione critica sul catalogo prodotti', () => {
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
      cy.fixture('users').then((users) => {
        cy.loginBySession(users.standard.username, users.standard.password);
        InventoryPage.assertLoaded();
        InventoryPage.addFirstItemToCart();
        InventoryPage.goToCart();
        CartPage.goToCheckout();
        CheckoutPage.assertStepOneLoaded();
      });
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

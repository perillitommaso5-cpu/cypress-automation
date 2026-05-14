import LoginPage from '../pages/LoginPage';
import InventoryPage from '../pages/InventoryPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';

/**
 * Accessibility Tests — cypress-axe
 * Esegue audit WCAG 2.1 AA sulle pagine principali.
 * Ogni violazione viene loggata con descrizione e impatto.
 */

// Helper per loggare le violazioni in modo leggibile nel runner
function logViolations(violations: Cypress.Violation[]) {
  if (violations.length === 0) return;
  cy.task('log', `${violations.length} accessibility violation(s) detected`);
  violations.forEach((v) => {
    cy.task('log', `[${v.impact}] ${v.id}: ${v.description}`);
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
    beforeEach(() => {
      cy.fixture('users').then((users) => {
        LoginPage.login(users.standard.username, users.standard.password);
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
    beforeEach(() => {
      cy.fixture('users').then((users) => {
        LoginPage.login(users.standard.username, users.standard.password);
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

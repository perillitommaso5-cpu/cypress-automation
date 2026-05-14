import InventoryPage from '../pages/InventoryPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';

describe('Checkout', () => {

  beforeEach(() => {
    cy.fixture('users').then((users) => {
      cy.loginBySession(users.standard.username, users.standard.password);
      cy.visit('/inventory');
      InventoryPage.assertLoaded();
      InventoryPage.addFirstItemToCart();
      InventoryPage.goToCart();
      CartPage.goToCheckout();
      CheckoutPage.assertStepOneLoaded();
    });
  });

  context('Validazione form', () => {
    it('tutti i campi vuoti — errore "First Name is required"', () => {
      CheckoutPage.continue();
      CheckoutPage.getErrorMessage()
        .should('be.visible')
        .and('contain', 'First Name is required');
    });

    it('solo first name mancante — errore "First Name is required"', () => {
      cy.fixture('checkout').then((data) => {
        CheckoutPage.fillForm('', data.valid.lastName, data.valid.zip);
        CheckoutPage.continue();
        CheckoutPage.getErrorMessage().should('contain', 'First Name is required');
      });
    });

    it('solo last name mancante — errore "Last Name is required"', () => {
      cy.fixture('checkout').then((data) => {
        CheckoutPage.fillForm(data.valid.firstName, '', data.valid.zip);
        CheckoutPage.continue();
        CheckoutPage.getErrorMessage().should('contain', 'Last Name is required');
      });
    });

    it('solo zip mancante — errore "Postal Code is required"', () => {
      cy.fixture('checkout').then((data) => {
        CheckoutPage.fillForm(data.valid.firstName, data.valid.lastName, '');
        CheckoutPage.continue();
        CheckoutPage.getErrorMessage().should('contain', 'Postal Code is required');
      });
    });
  });

  context('Flusso completo', () => {
    it('dati validi — avanza allo step 2 con riepilogo ordine', () => {
      cy.fixture('checkout').then((data) => {
        CheckoutPage.fillForm(data.valid.firstName, data.valid.lastName, data.valid.zip);
        CheckoutPage.continue();
        CheckoutPage.assertStepTwoLoaded();
        CheckoutPage.getSummaryItems().should('have.length.gte', 1);
      });
    });

    it('il totale corrisponde a subtotale + tasse', () => {
      cy.fixture('checkout').then((data) => {
        CheckoutPage.fillForm(data.valid.firstName, data.valid.lastName, data.valid.zip);
        CheckoutPage.continue();
        CheckoutPage.assertStepTwoLoaded();
        CheckoutPage.assertTotalMatchesSubtotalPlusTax();
      });
    });

    it('finish — pagina di conferma ordine', () => {
      cy.fixture('checkout').then((data) => {
        CheckoutPage.fillForm(data.valid.firstName, data.valid.lastName, data.valid.zip);
        CheckoutPage.continue();
        CheckoutPage.finish();
        CheckoutPage.assertCompleteLoaded();
        cy.get('.complete-header').should('contain', 'Thank you');
      });
    });

    it('"Back Home" dalla conferma riporta al catalogo', () => {
      cy.fixture('checkout').then((data) => {
        CheckoutPage.fillForm(data.valid.firstName, data.valid.lastName, data.valid.zip);
        CheckoutPage.continue();
        CheckoutPage.finish();
        CheckoutPage.backToProducts();
        InventoryPage.assertLoaded();
      });
    });
  });

  context('Cancel', () => {
    it('cancel dallo step 1 riporta al carrello', () => {
      CheckoutPage.cancel();
      CartPage.assertLoaded();
    });

    it('cancel dallo step 2 riporta al catalogo', () => {
      cy.fixture('checkout').then((data) => {
        CheckoutPage.fillForm(data.valid.firstName, data.valid.lastName, data.valid.zip);
        CheckoutPage.continue();
        CheckoutPage.cancel();
        InventoryPage.assertLoaded();
      });
    });
  });

});

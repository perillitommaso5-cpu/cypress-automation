import LoginPage from '../pages/LoginPage';
import InventoryPage from '../pages/InventoryPage';
import CartPage from '../pages/CartPage';

describe('Cart', () => {

  beforeEach(() => {
    cy.fixture('users').then((users) => {
      cy.loginBySession(users.standard.username, users.standard.password);
      cy.visit('/inventory');
      InventoryPage.assertLoaded();
    });
  });

  context('Aggiunta prodotti', () => {
    it('un prodotto aggiunto appare nel carrello', () => {
      InventoryPage.addFirstItemToCart();
      InventoryPage.goToCart();
      CartPage.assertLoaded();
      CartPage.assertItemCount(1);
    });

    it('il nome del prodotto nel carrello corrisponde a quello nel catalogo', () => {
      InventoryPage.getItemNames().first().invoke('text').then((name) => {
        InventoryPage.addFirstItemToCart();
        InventoryPage.goToCart();
        CartPage.getItemNames().first().should('have.text', name);
      });
    });

    it('più prodotti aggiunti compaiono tutti nel carrello', () => {
      InventoryPage.addAllItemsToCart();
      InventoryPage.goToCart();
      CartPage.assertItemCount(6);
    });
  });

  context('Rimozione prodotti', () => {
    it('rimuovere un prodotto dal carrello aggiorna la lista', () => {
      InventoryPage.addAllItemsToCart();
      InventoryPage.goToCart();
      CartPage.removeFirstItem();
      CartPage.assertItemCount(5);
    });

    it('rimuovere tutti i prodotti svuota il carrello', () => {
      InventoryPage.addAllItemsToCart();
      InventoryPage.goToCart();
      CartPage.removeAllItems();
      CartPage.assertEmpty();
    });
  });

  context('Navigazione', () => {
    it('"Continue Shopping" riporta al catalogo', () => {
      InventoryPage.addFirstItemToCart();
      InventoryPage.goToCart();
      CartPage.continueShopping();
      InventoryPage.assertLoaded();
    });

    it('"Checkout" apre la pagina di checkout', () => {
      InventoryPage.addFirstItemToCart();
      InventoryPage.goToCart();
      CartPage.goToCheckout();
      cy.url().should('include', '/checkout-step-one');
    });

    it('carrello vuoto — il badge non è visibile', () => {
      InventoryPage.goToCart();
      CartPage.assertEmpty();
    });
  });

});

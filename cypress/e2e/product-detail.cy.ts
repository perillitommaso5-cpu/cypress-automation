import LoginPage from '../pages/LoginPage';
import InventoryPage from '../pages/InventoryPage';
import ProductDetailPage from '../pages/ProductDetailPage';

describe('Product Detail', () => {

  beforeEach(() => {
    cy.fixture('users').then((users) => {
      LoginPage.login(users.standard.username, users.standard.password);
      InventoryPage.assertLoaded();
    });
  });

  // ─── Contenuto

  context('Contenuto', () => {
    it('nome prodotto nel dettaglio corrisponde a quello nel catalogo', () => {
      InventoryPage.getItemNames().first().invoke('text').then((name) => {
        InventoryPage.clickFirstItemName();
        ProductDetailPage.assertLoaded();
        ProductDetailPage.getName().should('eq', name);
      });
    });

    it('descrizione, prezzo e immagine sono visibili', () => {
      InventoryPage.clickFirstItemName();
      ProductDetailPage.getDescription().should('not.be.empty');
      ProductDetailPage.getPrice().should('not.be.empty');
      ProductDetailPage.getImage().should('be.visible');
    });
  });

  // ─── Carrello

  context('Carrello', () => {
    it('aggiunta al carrello dalla detail page — badge mostra 1', () => {
      InventoryPage.clickFirstItemName();
      ProductDetailPage.assertLoaded();
      ProductDetailPage.addToCart();
      ProductDetailPage.getCartBadgeCount().should('eq', '1');
    });

    it('dopo aggiunta il bottone diventa "Remove"', () => {
      InventoryPage.clickFirstItemName();
      ProductDetailPage.addToCart();
      ProductDetailPage.removeBtnShouldExist();
    });

    it('rimozione dalla detail page — badge scompare', () => {
      InventoryPage.clickFirstItemName();
      ProductDetailPage.addToCart();
      ProductDetailPage.removeFromCart();
      cy.get('.shopping_cart_badge').should('not.exist');
    });
  });

  // ─── Navigazione

  context('Navigazione', () => {
    it('"Back to products" riporta al catalogo', () => {
      InventoryPage.clickFirstItemName();
      ProductDetailPage.backToInventory();
      InventoryPage.assertLoaded();
    });
  });

});

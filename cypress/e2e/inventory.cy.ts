import LoginPage from '../pages/LoginPage';
import InventoryPage from '../pages/InventoryPage';

describe('Inventory', () => {
  beforeEach(() => {
    cy.fixture('users').then((users) => {
      LoginPage.login(users.standard.username, users.standard.password);
    });
  });

  it('mostra la lista dei prodotti', () => {
    InventoryPage.assertLoaded();
    InventoryPage.getItems().should('have.length', 6);
  });

  it('aggiunge un prodotto al carrello', () => {
    InventoryPage.addFirstItemToCart();
    InventoryPage.getCartBadgeCount().should('eq', '1');
  });

  it('ordina i prodotti per prezzo crescente', () => {
    InventoryPage.sortBy('lohi');
    cy.get('.inventory_item_price').then(($prices) => {
      const prices = [...$prices].map((el) =>
        parseFloat(el.innerText.replace('$', ''))
      );
      const sorted = [...prices].sort((a, b) => a - b);
      expect(prices).to.deep.equal(sorted);
    });
  });
});

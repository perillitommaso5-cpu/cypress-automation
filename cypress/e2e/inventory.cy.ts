import InventoryPage from '../pages/InventoryPage';

describe('Inventory', () => {

  beforeEach(() => {
    cy.fixture('users').then((users) => {
      cy.loginBySession(users.standard.username, users.standard.password);
      InventoryPage.assertLoaded();
    });
  });

  context('Lista prodotti', () => {
    it('mostra esattamente 6 prodotti', () => {
      InventoryPage.getItems().should('have.length', 6);
    });

    it('ogni prodotto ha nome, descrizione, prezzo e immagine', () => {
      InventoryPage.assertItemsHaveNameDescriptionPriceImage();
    });
  });

  context('Sorting', () => {
    it('ordina A → Z', () => {
      InventoryPage.sortBy('az');
      InventoryPage.getItemNames().then(($els) => {
        const names = [...$els].map((el) => el.innerText);
        expect(names).to.deep.equal([...names].sort());
      });
    });

    it('ordina Z → A', () => {
      InventoryPage.sortBy('za');
      InventoryPage.getItemNames().then(($els) => {
        const names = [...$els].map((el) => el.innerText);
        expect(names).to.deep.equal([...names].sort().reverse());
      });
    });

    it('ordina prezzo crescente (low → high)', () => {
      InventoryPage.sortBy('lohi');
      InventoryPage.getItemPrices().then(($els) => {
        const prices = [...$els].map((el) => parseFloat(el.innerText.replace('$', '')));
        expect(prices).to.deep.equal([...prices].sort((a, b) => a - b));
      });
    });

    it('ordina prezzo decrescente (high → low)', () => {
      InventoryPage.sortBy('hilo');
      InventoryPage.getItemPrices().then(($els) => {
        const prices = [...$els].map((el) => parseFloat(el.innerText.replace('$', '')));
        expect(prices).to.deep.equal([...prices].sort((a, b) => b - a));
      });
    });
  });

  context('Aggiunta al carrello', () => {
    it('aggiunge un prodotto — badge mostra 1', () => {
      InventoryPage.addFirstItemToCart();
      InventoryPage.getCartBadgeCount().should('eq', '1');
    });

    it('aggiunge tutti i prodotti — badge mostra 6', () => {
      InventoryPage.addAllItemsToCart();
      InventoryPage.getCartBadgeCount().should('eq', '6');
    });

    it('rimuove un prodotto — badge scompare', () => {
      InventoryPage.addFirstItemToCart();
      InventoryPage.removeFirstItemFromInventory();
      InventoryPage.cartBadgeShouldNotExist();
    });
  });

  context('Navigazione al dettaglio', () => {
    it('click sul nome prodotto apre la pagina di dettaglio', () => {
      InventoryPage.getItemNames().first().invoke('text').then((name) => {
        InventoryPage.clickFirstItemName();
        cy.url().should('include', '/inventory-item');
        cy.get('.inventory_details_name').should('have.text', name);
      });
    });
  });

});

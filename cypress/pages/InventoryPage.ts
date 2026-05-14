/**
 * Page Object Model — Inventory Page
 */
class InventoryPage {
  private inventoryList   = '.inventory_list';
  private inventoryItem   = '.inventory_item';
  private itemName        = '.inventory_item_name';
  private itemPrice       = '.inventory_item_price';
  private itemImg         = '.inventory_item_img img';
  private itemDesc        = '.inventory_item_desc';
  private cartBadge       = '.shopping_cart_badge';
  private cartIcon        = '.shopping_cart_link';
  private sortDropdown    = '[data-test="product-sort-container"]';
  private addToCartBtn    = '[data-test^="add-to-cart"]';
  private removeBtn       = '[data-test^="remove"]';

  assertLoaded(): void {
    cy.url().should('include', '/inventory');
    cy.get(this.inventoryList).should('be.visible');
  }

  getItems(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.inventoryItem);
  }

  getItemNames(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.itemName);
  }

  getItemPrices(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.itemPrice);
  }

  addFirstItemToCart(): void {
    cy.get(this.inventoryItem).first().find('[data-test^="add-to-cart"]').click();
  }

  addAllItemsToCart(): void {
    cy.get(this.addToCartBtn).each(($btn) => cy.wrap($btn).click());
  }

  removeFirstItemFromInventory(): void {
    cy.get(this.removeBtn).first().click();
  }

  clickFirstItemName(): void {
    cy.get(this.itemName).first().click();
  }

  getCartBadge(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.cartBadge);
  }

  getCartBadgeCount(): Cypress.Chainable<string> {
    return cy.get(this.cartBadge).invoke('text');
  }

  cartBadgeShouldNotExist(): void {
    cy.get(this.cartBadge).should('not.exist');
  }

  goToCart(): void {
    cy.get(this.cartIcon).click();
  }

  sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): void {
    cy.get(this.sortDropdown).select(option);
  }

  assertItemsHaveNameDescriptionPriceImage(): void {
    cy.get(this.inventoryItem).each(($item) => {
      cy.wrap($item).find('.inventory_item_name').should('not.be.empty');
      cy.wrap($item).find('.inventory_item_desc').should('not.be.empty');
      cy.wrap($item).find('.inventory_item_price').should('not.be.empty');
      cy.wrap($item).find('img').should('have.attr', 'src').and('not.be.empty');
    });
  }
}

export default new InventoryPage();

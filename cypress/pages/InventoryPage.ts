/**
 * Page Object Model — Inventory Page
 */
class InventoryPage {
  private inventoryList  = '.inventory_list';
  private inventoryItem  = '.inventory_item';
  private cartBadge      = '.shopping_cart_badge';
  private cartIcon       = '.shopping_cart_link';
  private sortDropdown   = '[data-test="product-sort-container"]';

  assertLoaded(): void {
    cy.url().should('include', '/inventory');
    cy.get(this.inventoryList).should('be.visible');
  }

  getItems(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.inventoryItem);
  }

  addFirstItemToCart(): void {
    cy.get('.inventory_item').first().find('button').click();
  }

  getCartBadgeCount(): Cypress.Chainable<string> {
    return cy.get(this.cartBadge).invoke('text');
  }

  goToCart(): void {
    cy.get(this.cartIcon).click();
  }

  sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): void {
    cy.get(this.sortDropdown).select(option);
  }
}

export default new InventoryPage();

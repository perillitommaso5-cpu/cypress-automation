/**
 * Page Object Model — Product Detail Page
 */
class ProductDetailPage {
  private detailContainer = '.inventory_details';
  private itemName        = '.inventory_details_name';
  private itemDesc        = '.inventory_details_desc';
  private itemPrice       = '.inventory_details_price';
  private itemImg         = '.inventory_details_img';
  private addToCartBtn    = '[data-test^="add-to-cart"]';
  private removeBtn       = '[data-test^="remove"]';
  private backBtn         = '[data-test="back-to-products"]';
  private cartBadge       = '.shopping_cart_badge';

  assertLoaded(): void {
    cy.url().should('include', '/inventory-item');
    cy.get(this.detailContainer).should('be.visible');
  }

  getName(): Cypress.Chainable<string> {
    return cy.get(this.itemName).invoke('text');
  }

  getDescription(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.itemDesc);
  }

  getPrice(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.itemPrice);
  }

  getImage(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.itemImg);
  }

  addToCart(): void {
    cy.get(this.addToCartBtn).click();
  }

  removeFromCart(): void {
    cy.get(this.removeBtn).click();
  }

  addToCartBtnShouldExist(): void {
    cy.get(this.addToCartBtn).should('be.visible');
  }

  removeBtnShouldExist(): void {
    cy.get(this.removeBtn).should('be.visible');
  }

  backToInventory(): void {
    cy.get(this.backBtn).click();
  }

  getCartBadgeCount(): Cypress.Chainable<string> {
    return cy.get(this.cartBadge).invoke('text');
  }
}

export default new ProductDetailPage();

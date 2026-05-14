/**
 * Page Object Model — Cart Page
 */
class CartPage {
  private cartContainer   = '.cart_contents_container';
  private cartItem        = '.cart_item';
  private itemName        = '.inventory_item_name';
  private itemPrice       = '.inventory_item_price';
  private removeBtn       = '[data-test^="remove"]';
  private continueBtn     = '[data-test="continue-shopping"]';
  private checkoutBtn     = '[data-test="checkout"]';
  private cartBadge       = '.shopping_cart_badge';

  assertLoaded(): void {
    cy.url().should('include', '/cart');
    cy.get(this.cartContainer).should('be.visible');
  }

  getItems(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.cartItem);
  }

  getItemNames(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.itemName);
  }

  removeFirstItem(): void {
    cy.get(this.removeBtn).first().click();
  }

  removeAllItems(): void {
    cy.get(this.removeBtn).each(($btn) => cy.wrap($btn).click());
  }

  continueShopping(): void {
    cy.get(this.continueBtn).click();
  }

  goToCheckout(): void {
    cy.get(this.checkoutBtn).click();
  }

  assertEmpty(): void {
    cy.get(this.cartItem).should('not.exist');
    cy.get(this.cartBadge).should('not.exist');
  }

  assertItemCount(count: number): void {
    cy.get(this.cartItem).should('have.length', count);
  }
}

export default new CartPage();

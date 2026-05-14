/**
 * Page Object Model — Checkout Pages (step one & two + complete)
 */
class CheckoutPage {
  // Step One
  private firstNameInput  = '[data-test="firstName"]';
  private lastNameInput   = '[data-test="lastName"]';
  private zipInput        = '[data-test="postalCode"]';
  private continueBtn     = '[data-test="continue"]';
  private cancelBtn       = '[data-test="cancel"]';
  private errorMessage    = '[data-test="error"]';

  // Step Two
  private summaryContainer = '.checkout_summary_container';
  private summaryItem      = '.cart_item';
  private subtotalLabel    = '.summary_subtotal_label';
  private taxLabel         = '.summary_tax_label';
  private totalLabel       = '.summary_total_label';
  private finishBtn        = '[data-test="finish"]';

  // Complete
  private completeHeader   = '.complete-header';
  private backHomeBtn      = '[data-test="back-to-products"]';

  assertStepOneLoaded(): void {
    cy.url().should('include', '/checkout-step-one');
  }

  assertStepTwoLoaded(): void {
    cy.url().should('include', '/checkout-step-two');
    cy.get(this.summaryContainer).should('be.visible');
  }

  assertCompleteLoaded(): void {
    cy.url().should('include', '/checkout-complete');
    cy.get(this.completeHeader).should('be.visible');
  }

  /**
   * Fills the checkout form.
   * Skips cy.type() for empty strings — passing '' leaves the field blank
   * without triggering the "cannot accept an empty string" Cypress error.
   */
  fillForm(firstName: string, lastName: string, zip: string): void {
    cy.get(this.firstNameInput).clear();
    if (firstName) cy.get(this.firstNameInput).type(firstName);

    cy.get(this.lastNameInput).clear();
    if (lastName) cy.get(this.lastNameInput).type(lastName);

    cy.get(this.zipInput).clear();
    if (zip) cy.get(this.zipInput).type(zip);
  }

  continue(): void {
    cy.get(this.continueBtn).click();
  }

  cancel(): void {
    cy.get(this.cancelBtn).click();
  }

  finish(): void {
    cy.get(this.finishBtn).click();
  }

  backToProducts(): void {
    cy.get(this.backHomeBtn).click();
  }

  getErrorMessage(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.errorMessage);
  }

  getSummaryItems(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.summaryItem);
  }

  getSubtotal(): Cypress.Chainable<string> {
    return cy.get(this.subtotalLabel).invoke('text');
  }

  getTax(): Cypress.Chainable<string> {
    return cy.get(this.taxLabel).invoke('text');
  }

  getTotal(): Cypress.Chainable<string> {
    return cy.get(this.totalLabel).invoke('text');
  }

  assertTotalMatchesSubtotalPlusTax(): void {
    cy.get(this.subtotalLabel).invoke('text').then((subtotalText) => {
      cy.get(this.taxLabel).invoke('text').then((taxText) => {
        cy.get(this.totalLabel).invoke('text').then((totalText) => {
          const subtotal = parseFloat(subtotalText.replace(/[^0-9.]/g, ''));
          const tax      = parseFloat(taxText.replace(/[^0-9.]/g, ''));
          const total    = parseFloat(totalText.replace(/[^0-9.]/g, ''));
          expect(total).to.be.closeTo(subtotal + tax, 0.01);
        });
      });
    });
  }
}

export default new CheckoutPage();

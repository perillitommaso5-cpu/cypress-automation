/**
 * Page Object Model — Login Page
 * Target: https://www.saucedemo.com
 */
class LoginPage {
  // Selectors
  private usernameInput = '#user-name';
  private passwordInput = '#password';
  private loginButton   = '#login-button';
  private errorMessage  = '[data-test="error"]';

  visit(): void {
    cy.visit('/');
  }

  fillUsername(username: string): void {
    cy.get(this.usernameInput).clear().type(username);
  }

  fillPassword(password: string): void {
    cy.get(this.passwordInput).clear().type(password);
  }

  submit(): void {
    cy.get(this.loginButton).click();
  }

  login(username: string, password: string): void {
    this.visit();
    this.fillUsername(username);
    this.fillPassword(password);
    this.submit();
  }

  getErrorMessage(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.errorMessage);
  }
}

export default new LoginPage();

/**
 * Page Object Model — Login Page
 * Target: https://www.saucedemo.com
 */
class LoginPage {
  // Selectors
  private usernameInput   = '#user-name';
  private passwordInput   = '#password';
  private loginButton     = '#login-button';
  private errorMessage    = '[data-test="error"]';
  private errorCloseBtn   = '[data-test="error-button"]';
  private hamburgerBtn    = '#react-burger-menu-btn';
  private logoutLink      = '#logout_sidebar_link';
  private menuCloseBtn    = '#react-burger-cross-btn';

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

  submitEmpty(): void {
    this.visit();
    this.submit();
  }

  submitWithUsernameOnly(username: string): void {
    this.visit();
    this.fillUsername(username);
    this.submit();
  }

  submitWithPasswordOnly(password: string): void {
    this.visit();
    this.fillPassword(password);
    this.submit();
  }

  getErrorMessage(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.errorMessage);
  }

  closeError(): void {
    cy.get(this.errorCloseBtn).click();
  }

  getPasswordInput(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.passwordInput);
  }

  getUsernameInput(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.usernameInput);
  }

  logout(): void {
    cy.get(this.hamburgerBtn).click();
    cy.get(this.logoutLink).should('be.visible').click();
  }
}

export default new LoginPage();

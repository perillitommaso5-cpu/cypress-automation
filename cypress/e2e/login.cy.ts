import LoginPage from '../pages/LoginPage';
import InventoryPage from '../pages/InventoryPage';

describe('Login', () => {
  context('Credenziali valide', () => {
    it('standard_user accede e vede il catalogo prodotti', () => {
      cy.fixture('users').then((users) => {
        LoginPage.login(users.standard.username, users.standard.password);
        InventoryPage.assertLoaded();
      });
    });
  });

  context('Credenziali non valide', () => {
    it('utente bloccato riceve messaggio di errore', () => {
      cy.fixture('users').then((users) => {
        LoginPage.login(users.locked.username, users.locked.password);
        LoginPage.getErrorMessage()
          .should('be.visible')
          .and('contain', 'locked out');
      });
    });

    it('credenziali errate mostrano errore generico', () => {
      LoginPage.login('wrong_user', 'wrong_pass');
      LoginPage.getErrorMessage()
        .should('be.visible')
        .and('contain', 'Username and password do not match');
    });
  });
});

import LoginPage from '../pages/LoginPage';
import InventoryPage from '../pages/InventoryPage';

describe('Login', () => {

  // ─── Credenziali valide ────────────────────────────────────────────────────

  context('Utenti validi', () => {
    it('standard_user accede e visualizza il catalogo', () => {
      cy.fixture('users').then((users) => {
        LoginPage.login(users.standard.username, users.standard.password);
        InventoryPage.assertLoaded();
      });
    });

    it('problem_user accede (immagini rotte, comportamento atteso)', () => {
      cy.fixture('users').then((users) => {
        LoginPage.login(users.problem.username, users.problem.password);
        InventoryPage.assertLoaded();
      });
    });

    it('performance_glitch_user accede con ritardo accettabile (< 10s)', () => {
      cy.fixture('users').then((users) => {
        LoginPage.login(
          users.performance_glitch.username,
          users.performance_glitch.password
        );
        // Timeout esteso per questo utente
        cy.url({ timeout: 10000 }).should('include', '/inventory');
      });
    });
  });

  // ─── Credenziali non valide ────────────────────────────────────────────────

  context('Credenziali non valide', () => {
    it('utente bloccato riceve messaggio "locked out"', () => {
      cy.fixture('users').then((users) => {
        LoginPage.login(users.locked.username, users.locked.password);
        LoginPage.getErrorMessage()
          .should('be.visible')
          .and('contain', 'locked out');
      });
    });

    it('username e password errati mostrano errore generico', () => {
      cy.fixture('users').then((users) => {
        LoginPage.login(users.invalid.username, users.invalid.password);
        LoginPage.getErrorMessage()
          .should('be.visible')
          .and('contain', 'Username and password do not match');
      });
    });
  });

  // ─── Validazione campi vuoti ───────────────────────────────────────────────

  context('Campi vuoti', () => {
    it('entrambi i campi vuoti — errore "Username is required"', () => {
      LoginPage.submitEmpty();
      LoginPage.getErrorMessage()
        .should('be.visible')
        .and('contain', 'Username is required');
    });

    it('solo username — errore "Password is required"', () => {
      cy.fixture('users').then((users) => {
        LoginPage.submitWithUsernameOnly(users.standard.username);
        LoginPage.getErrorMessage()
          .should('be.visible')
          .and('contain', 'Password is required');
      });
    });

    it('solo password — errore "Username is required"', () => {
      cy.fixture('users').then((users) => {
        LoginPage.submitWithPasswordOnly(users.standard.password);
        LoginPage.getErrorMessage()
          .should('be.visible')
          .and('contain', 'Username is required');
      });
    });
  });

  // ─── UX / comportamento UI ────────────────────────────────────────────────

  context('Comportamento UI', () => {
    it('il campo password ha type="password" (input mascherato)', () => {
      LoginPage.visit();
      LoginPage.getPasswordInput().should('have.attr', 'type', 'password');
    });

    it('il bottone di chiusura errore rimuove il messaggio', () => {
      LoginPage.login('wrong', 'wrong');
      LoginPage.getErrorMessage().should('be.visible');
      LoginPage.closeError();
      LoginPage.getErrorMessage().should('not.exist');
    });

    it('dopo errore i campi mantengono i valori inseriti', () => {
      cy.fixture('users').then((users) => {
        LoginPage.login(users.invalid.username, users.invalid.password);
        LoginPage.getUsernameInput().should('have.value', users.invalid.username);
      });
    });
  });

  // ─── Logout ───────────────────────────────────────────────────────────────

  context('Logout', () => {
    beforeEach(() => {
      cy.fixture('users').then((users) => {
        LoginPage.login(users.standard.username, users.standard.password);
        InventoryPage.assertLoaded();
      });
    });

    it('logout reindirizza alla login page', () => {
      LoginPage.logout();
      cy.url().should('eq', Cypress.config('baseUrl') + '/');
    });

    it('dopo logout non è possibile tornare al catalogo con il back button', () => {
      LoginPage.logout();
      cy.go('back');
      cy.url().should('not.include', '/inventory');
    });
  });

});

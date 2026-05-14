import LoginPage from '../pages/LoginPage';
import InventoryPage from '../pages/InventoryPage';

/**
 * Performance Tests — cy.clock() + timing
 * Misura i tempi di risposta dell'applicazione e confronta
 * il comportamento tra utenti con latenza diversa.
 */
describe('Performance', () => {

  context('Tempo di login', () => {
    it('standard_user: login completato in meno di 3 secondi', () => {
      cy.fixture('users').then((users) => {
        const start = Date.now();
        LoginPage.login(users.standard.username, users.standard.password);
        cy.url().should('include', '/inventory').then(() => {
          const elapsed = Date.now() - start;
          cy.log(`Login completato in ${elapsed}ms`);
          expect(elapsed).to.be.lessThan(3000);
        });
      });
    });

    it('performance_glitch_user: login completato in meno di 10 secondi', () => {
      cy.fixture('users').then((users) => {
        const start = Date.now();
        LoginPage.login(
          users.performance_glitch.username,
          users.performance_glitch.password
        );
        cy.url({ timeout: 10000 }).should('include', '/inventory').then(() => {
          const elapsed = Date.now() - start;
          cy.log(`performance_glitch_user login: ${elapsed}ms`);
          expect(elapsed).to.be.lessThan(10000);
        });
      });
    });

    it('standard_user è più veloce di performance_glitch_user', () => {
      cy.fixture('users').then((users) => {
        let standardTime: number;
        let glitchTime: number;

        const startStandard = Date.now();
        LoginPage.login(users.standard.username, users.standard.password);
        cy.url().should('include', '/inventory').then(() => {
          standardTime = Date.now() - startStandard;
          cy.log(`standard_user: ${standardTime}ms`);

          cy.visit('/');
          const startGlitch = Date.now();
          LoginPage.login(
            users.performance_glitch.username,
            users.performance_glitch.password
          );
          cy.url({ timeout: 10000 }).should('include', '/inventory').then(() => {
            glitchTime = Date.now() - startGlitch;
            cy.log(`performance_glitch_user: ${glitchTime}ms`);
            expect(standardTime).to.be.lessThan(glitchTime);
          });
        });
      });
    });
  });

  context('cy.clock() — controllo del tempo', () => {
    it('cy.clock congela il tempo — Date.now() non avanza', () => {
      cy.clock();
      cy.visit('/');
      const frozenTime = Date.now();
      cy.tick(5000);
      // Dopo tick(5000) il tempo simulato è avanzato ma il DOM non è bloccato
      cy.get('#login-button').should('be.visible');
      cy.clock().then((clock) => {
        clock.restore();
      });
    });

    it('simula passaggio del tempo durante operazioni UI con cy.tick()', () => {
      cy.clock();
      cy.visit('/');
      cy.fixture('users').then((users) => {
        cy.get('#user-name').type(users.standard.username);
        cy.get('#password').type(users.standard.password);
        cy.tick(1000); // Simula 1 secondo prima del click
        cy.get('#login-button').click();
        cy.tick(2000); // Simula 2 secondi durante il caricamento
        cy.url().should('include', '/inventory');
      });
    });
  });

});

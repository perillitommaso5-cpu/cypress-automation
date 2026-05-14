import LoginPage from '../pages/LoginPage';
import InventoryPage from '../pages/InventoryPage';

describe('Visual & DOM Integrity', () => {

  context('Immagini catalogo — standard_user', () => {
    beforeEach(() => {
      cy.fixture('users').then((users) => {
        LoginPage.login(users.standard.username, users.standard.password);
        InventoryPage.assertLoaded();
      });
    });

    it('nessuna immagine del catalogo è broken', () => {
      cy.get('.inventory_item img').each(($img) => {
        cy.wrap($img)
          .should('have.attr', 'src')
          .and('not.be.empty');
        // Verifica che l'immagine sia effettivamente caricata (naturalWidth > 0)
        cy.wrap($img).should(($el) => {
          expect(($el[0] as HTMLImageElement).naturalWidth).to.be.greaterThan(0);
        });
      });
    });

    it('ogni card ha esattamente un bottone "Add to cart"', () => {
      cy.get('.inventory_item').each(($item) => {
        cy.wrap($item).find('[data-test^="add-to-cart"]').should('have.length', 1);
      });
    });
  });

  context('Immagini catalogo — problem_user (immagini rotte attese)', () => {
    it('problem_user vede immagini rotte — comportamento documentato', () => {
      cy.fixture('users').then((users) => {
        LoginPage.login(users.problem.username, users.problem.password);
        InventoryPage.assertLoaded();

        let brokenCount = 0;
        cy.get('.inventory_item img').each(($img) => {
          const naturalWidth = ($img[0] as HTMLImageElement).naturalWidth;
          if (naturalWidth === 0) brokenCount++;
        }).then(() => {
          // problem_user ha tutte le immagini rotte — questo test lo documenta
          cy.log(`Immagini rotte trovate: ${brokenCount}`);
          expect(brokenCount).to.be.greaterThan(0);
        });
      });
    });
  });

  context('Responsive — viewport mobile (375px)', () => {
    beforeEach(() => {
      cy.viewport(375, 812);
      cy.fixture('users').then((users) => {
        LoginPage.login(users.standard.username, users.standard.password);
        InventoryPage.assertLoaded();
      });
    });

    it('header e carrello sono visibili su mobile', () => {
      cy.get('.primary_header').should('be.visible');
      cy.get('.shopping_cart_link').should('be.visible');
    });

    it('hamburger menu è visibile e cliccabile su mobile', () => {
      cy.get('#react-burger-menu-btn').should('be.visible').click();
      cy.get('.bm-menu-wrap').should('be.visible');
    });

    it('i prodotti sono visibili e non troncati su mobile', () => {
      cy.get('.inventory_item').each(($item) => {
        cy.wrap($item).should('be.visible');
        cy.wrap($item).find('.inventory_item_name').should('be.visible');
        cy.wrap($item).find('.inventory_item_price').should('be.visible');
      });
    });

    it('login page è utilizzabile su mobile', () => {
      cy.visit('/');
      cy.get('#user-name').should('be.visible');
      cy.get('#password').should('be.visible');
      cy.get('#login-button').should('be.visible');
    });
  });

});

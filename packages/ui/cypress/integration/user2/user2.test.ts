// @ts-ignore
import cypress from 'cypress';

const VIEWPORT_HORIZONTAL_CENTER = 500;
const VIEWPORT_VERTICAL_CENTER = 330;

describe('User 2 UI test', () => {
  it('First flow', () => {
    cy.visit('http://10.108.1.8:3000');

    cy.wait(12000);

    cy.get('.amplify-input[name=username]').clear();
    cy.get('.amplify-input[name=username]').type(
      'test-2fjv4r6ip@srv1.mail-tester.com'
    );
    cy.get('.amplify-input[name=password]').clear();
    cy.get('.amplify-input[name=password]').type('testPassword1234');

    cy.get('.amplify-button--primary').click();

    cy.wait(3000);

    cy.url().then((url) => {
      if (url.includes('/encounter')) {
        cy.get('button[type=submit]').click();
      }

      cy.wait(2500);

      cy.url().should('include', '/world');

      cy.get('.leaflet-container').click(
        VIEWPORT_HORIZONTAL_CENTER + 100,
        VIEWPORT_VERTICAL_CENTER + 100
      );

      cy.wait(2500);

      cy.get('.leaflet-container').click(
        VIEWPORT_HORIZONTAL_CENTER - 100,
        VIEWPORT_VERTICAL_CENTER + 100
      );

      cy.wait(2500);

      cy.get('.leaflet-container').click(
        VIEWPORT_HORIZONTAL_CENTER - 100,
        VIEWPORT_VERTICAL_CENTER - 100
      );

      cy.wait(2500);

      cy.get('.leaflet-container').click(
        VIEWPORT_HORIZONTAL_CENTER + 100,
        VIEWPORT_VERTICAL_CENTER - 100
      );
    });
  });
});

export {};

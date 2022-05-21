import cypress from 'cypress';

const VIEWPORT_HORIZONTAL_CENTER = 500;
const VIEWPORT_VERTICAL_CENTER = 330;

describe('General UI test', () => {
  it('First flow', () => {
    cy.visit('http://10.108.1.8:3000');

    cy.get('.amplify-input[name=username]').clear();
    cy.get('.amplify-input[name=username]').type(
      'test-r3npfzaga@srv1.mail-tester.com'
    );
    cy.get('.amplify-input[name=password]').clear();
    cy.get('.amplify-input[name=password]').type('testPassword1234');

    cy.get('.amplify-button--primary').click();

    cy.wait(3000);

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

export {};

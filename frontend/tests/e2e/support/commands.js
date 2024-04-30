Cypress.Commands.add(
    'login',
    (
        email = Cypress.env('adminEmail'),
        password = Cypress.env('adminPassword')
    ) => {
        cy.visit('/login');

        cy.get('input[name="email"]').type(email);

        cy.get('input[name="password"]').type(password);

        cy.get('[data-testid="submit"]').click();

        cy.wait(500);
    }
);

Cypress.Commands.add('logout', () => {
    cy.get('[data-testid="logout"]').click();

    cy.wait(500);
});

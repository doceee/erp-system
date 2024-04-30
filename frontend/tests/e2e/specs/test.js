// https://docs.cypress.io/api/table-of-contents
import faker from 'faker';

describe('login functionality', () => {
    it('login with VALID DATA', () => {
        cy.visit('/login');
        cy.get('input[name="email"]').type(Cypress.env('adminEmail'));
        cy.get('input[name="password"]').type(Cypress.env('adminPassword'));

        cy.get('[data-testid="submit"]').click();

        cy.wait(500);

        cy.contains('h2', 'Dashboard');
        cy.url().should('contain', '/dashboard');

        cy.logout();
    });

    it('login with INVALID DATA', () => {
        cy.visit('/login');

        cy.get('input[name="email"]').type('a');
        cy.get('input[name="password"]').type('a');

        cy.get('[data-testid="submit"]').should('be.disabled');
        cy.url().should('contain', '/login');
    });
});

describe('logout functionality', () => {
    it('logout', () => {
        cy.login();

        cy.get('[data-testid="logout"]').click();

        cy.url().should('contain', '/login');
    });
});

describe('user functionality', () => {
    let userEmail = faker.internet.email();

    beforeEach(() => {
        cy.login();
    });

    afterEach(() => {
        cy.logout();
    });

    it('adds new user with VALID DATA', () => {
        cy.get('[data-testid="new-user"]').click();

        cy.get('input[name="first-name"]').type(faker.lorem.word(6));
        cy.get('input[name="last-name"]').type(faker.lorem.word(6));
        cy.get('input[name="email"]').type(userEmail);
        cy.get('input[name="password"]').type('Password1!');

        cy.get('[data-testid="submit"]').click();

        cy.wait(500);

        cy.contains('td', userEmail);
    });

    it('should fail when EMAIL is already taken', () => {
        cy.get('[data-testid="new-user"]').click();

        cy.get('input[name="first-name"]').type(faker.lorem.word(6));
        cy.get('input[name="last-name"]').type(faker.lorem.word(6));
        cy.get('input[name="email"]').type(userEmail);
        cy.get('input[name="password"]').type('Password1!');

        cy.get('[data-testid="submit"]').click();

        cy.wait(500);

        cy.get('input[name="email"]')
            .clear()
            .blur()
            .parents('.v-input__control')
            .contains('.v-messages__message', 'Email is already registered.');

        cy.get('[data-testid="close"]').click();
    });

    it('should fail to add user with EMPTY DATA', () => {
        cy.get('[data-testid="new-user"]').click();

        cy.get('input[name="first-name"]')
            .clear()
            .blur()
            .parents('.v-input__control')
            .contains('.v-messages__message', 'First Name is required');
        cy.get('input[name="last-name"]')
            .clear()
            .blur()
            .parents('.v-input__control')
            .contains('.v-messages__message', 'Last Name is required');
        cy.get('input[name="email"]')
            .clear()
            .blur()
            .parents('.v-input__control')
            .contains('.v-messages__message', 'E-mail is required');
        cy.get('input[name="password"]')
            .clear()
            .blur()
            .parents('.v-input__control')
            .contains('.v-messages__message', 'Password is required');

        cy.get('[data-testid="submit"]').should('be.disabled');

        cy.get('[data-testid="close"]').click();
    });

    it('should fail to edit existing user when EMAIL is already taken', () => {
        cy.contains('td', '@')
            .parent()
            .within(() => {
                cy.get('[data-testid=user-edit]').click();
            });

        cy.get('input[name="email"]').clear().type('admin@demo.test');

        cy.get('[data-testid="submit"]').click();

        cy.wait(500);

        cy.get('input[name="email"]')
            .clear()
            .blur()
            .parents('.v-input__control')
            .contains('.v-messages__message', 'Email is already registered.');

        cy.get('[data-testid="close"]').click();
    });

    it('edits existing user with VALID DATA', () => {
        cy.contains('td', '@')
            .parent()
            .within(() => {
                cy.get('[data-testid=user-edit]').click();
            });

        userEmail = 'edited' + userEmail;
        cy.get('input[name="email"]').clear().type(userEmail);

        cy.get('[data-testid="submit"]').click();

        cy.wait(500);

        cy.contains(
            '.notification-content',
            'User has been successfully saved!'
        );
    });

    it('deletes existing user', () => {
        cy.contains('td', '@')
            .not(':contains("admin@demo.test")')
            .parent()
            .within(() => {
                cy.get('[data-testid=user-delete]').click();
            });

        cy.get(
            '.v-card > .v-card__actions > [data-testid=submit] > .v-btn__content'
        ).click();

        cy.wait(500);

        cy.contains(
            '.notification-content',
            'User has been successfully deleted!'
        );
    });
});

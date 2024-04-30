'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn('users', 'passwordResetToken', {
                type: Sequelize.STRING,
                defaultValue: null
            }),
            queryInterface.addColumn('users', 'passwordResetTokenExpiresAt', {
                type: Sequelize.DATE,
                defaultValue: null
            })
        ]);
    },

    async down(queryInterface) {
        return Promise.all([
            queryInterface.removeColumn('users', 'passwordResetToken'),
            queryInterface.removeColumn('users', 'passwordResetTokenExpiresAt')
        ]);
    }
};

'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn('users', 'vacationDaysTotal', {
                type: Sequelize.INTEGER,
                defaultValue: 0
            })
        ]);
    },

    async down(queryInterface) {
        return Promise.all([
            queryInterface.removeColumn('users', 'vacationDaysTotal')
        ]);
    }
};

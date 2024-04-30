'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            'role2user',
            {
                userId: {
                    primaryKey: true,
                    onDelete: 'CASCADE',
                    type: Sequelize.UUID,
                    references: {
                        model: 'users',
                        key: 'id'
                    }
                },
                roleId: {
                    primaryKey: true,
                    onDelete: 'CASCADE',
                    type: Sequelize.UUID,
                    references: {
                        model: 'roles',
                        key: 'id'
                    }
                }
            },
            {
                charset: 'utf8mb4',
                collate: 'utf8mb4_unicode_ci'
            }
        );
    },
    async down(queryInterface) {
        await queryInterface.dropTable('role2user');
    }
};

'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            'vacations',
            {
                id: {
                    primaryKey: true,
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.UUIDV4
                },
                userId: {
                    primaryKey: true,
                    type: Sequelize.UUID,
                    references: {
                        model: 'users',
                        key: 'id'
                    },
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE'
                },
                startDate: {
                    type: Sequelize.DATEONLY,
                    allowNull: false
                },
                endDate: {
                    type: Sequelize.DATEONLY,
                    allowNull: false
                },
                duration: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                isApproved: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false
                },
                createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE
                },
                updatedAt: {
                    allowNull: false,
                    type: Sequelize.DATE
                },
                deletedAt: {
                    type: Sequelize.DATE
                }
            },
            {
                charset: 'utf8mb4',
                collate: 'utf8mb4_unicode_ci'
            }
        );
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('vacations');
    }
};

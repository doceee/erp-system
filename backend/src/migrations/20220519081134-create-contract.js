'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            'contracts',
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
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
                position: {
                    type: Sequelize.STRING,
                    allowNull: false
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
                vacationDays: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                vacationDaysPerYear: {
                    type: Sequelize.INTEGER,
                    allowNull: false
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
    async down(queryInterface) {
        await queryInterface.dropTable('contracts');
    }
};

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Contract extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ User }) {
            // define association here
            Contract.belongsTo(
                User,
                {
                    as: 'user',
                    foreignKeyConstraint: true,
                    foreignKey: 'userId',
                    sourceKey: 'id',
                    constraints: true
                },
                { underscored: false }
            );
        }
    }

    if (sequelize) {
        Contract.init(
            {
                id: {
                    primaryKey: true,
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4
                },
                userId: {
                    type: DataTypes.UUID,
                    references: {
                        model: 'users',
                        key: 'id'
                    },
                    allowNull: false
                },
                position: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                startDate: {
                    type: DataTypes.DATEONLY,
                    allowNull: false
                },
                endDate: {
                    type: DataTypes.DATEONLY,
                    allowNull: false
                },
                duration: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                vacationDaysPerYear: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                vacationDays: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                }
            },
            {
                sequelize,
                timestamps: true,
                defaultScope: {
                    include: [
                        {
                            as: 'user',
                            association: 'user',
                            attributes: [
                                'fullName',
                                'firstName',
                                'lastName',
                                'id'
                            ]
                        }
                    ]
                },
                paranoid: true,
                tableName: 'contracts',
                modelName: 'Contract'
            }
        );
    }

    return Contract;
};

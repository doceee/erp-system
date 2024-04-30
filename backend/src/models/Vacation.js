'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Vacation extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ User }) {
            // define association here
            Vacation.belongsTo(
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
        Vacation.init(
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
                isApproved: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: false,
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
                modelName: 'Vacation',
                tableName: 'vacations'
            }
        );
    }

    return Vacation;
};

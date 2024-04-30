'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Role2User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate() {
            // define association here
        }
    }

    if (sequelize) {
        Role2User.init(
            {
                userId: {
                    primaryKey: true,
                    type: DataTypes.UUID,
                    references: {
                        model: 'users',
                        key: 'id'
                    }
                },
                roleId: {
                    primaryKey: true,
                    type: DataTypes.UUID,
                    references: {
                        model: 'roles',
                        key: 'id'
                    }
                }
            },
            {
                sequelize,
                freezeTableName: true,
                tableName: 'role2user',
                modelName: 'Role2User'
            }
        );
    }

    return Role2User;
};

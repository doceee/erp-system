'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Role extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ User }) {
            // define association here
            Role.belongsToMany(
                User,
                {
                    as: 'users',
                    foreignKeyConstraint: true,
                    foreignKey: 'roleId',
                    otherKey: 'userId',
                    through: 'role2user',
                    constraints: true
                },
                { underscored: false }
            );
        }
    }

    if (sequelize) {
        Role.init(
            {
                id: {
                    primaryKey: true,
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4
                },
                name: DataTypes.STRING
            },
            {
                sequelize,
                timestamps: true,
                paranoid: true,
                tableName: 'roles',
                modelName: 'Role'
            }
        );
    }

    Role.ROLE_ADMIN = 'admin';
    Role.ROLE_USER = 'user';

    return Role;
};

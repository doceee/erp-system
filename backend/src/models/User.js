'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');
const dayjs = require('dayjs');

async function hashPassword(user) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    return user.password;
}

async function destroyUserAssociations(user) {
    const contracts = await user.getContracts();
    const vacations = await user.getVacations();

    for (const contract of contracts) {
        await contract.destroy();
    }
    for (const vacation of vacations) {
        await vacation.destroy();
    }
}

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ Role, Vacation, Contract }) {
            // define association here
            User.belongsToMany(
                Role,
                {
                    as: 'roles',
                    foreignKeyConstraint: true,
                    foreignKey: 'userId',
                    otherKey: 'roleId',
                    through: 'role2user',
                    constraints: true
                },
                { underscored: false }
            );
            User.hasMany(
                Contract,
                {
                    as: 'contracts',
                    foreignKeyConstraint: true,
                    foreignKey: 'userId',
                    sourceKey: 'id',
                    constraints: true,
                    hooks: true
                },
                { underscored: false }
            );
            User.hasMany(
                Vacation,
                {
                    as: 'vacations',
                    foreignKeyConstraint: true,
                    foreignKey: 'userId',
                    sourceKey: 'id',
                    constraints: true,
                    hooks: true
                },
                { underscored: false }
            );
        }
        matchPassword(password) {
            return bcrypt.compare(password, this.password);
        }
        async isAdmin() {
            const { ROLE_ADMIN } = sequelize.models.Role;

            return (await this.getRoles()).some(
                role => role.dataValues.name === ROLE_ADMIN
            );
        }
        isPasswordResetTokenExpired() {
            return dayjs().isAfter(this.passwordResetTokenExpiresAt);
        }
    }

    if (sequelize) {
        User.init(
            {
                id: {
                    primaryKey: true,
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4
                },
                firstName: DataTypes.STRING,
                lastName: DataTypes.STRING,
                email: DataTypes.STRING,
                password: DataTypes.STRING,
                passwordResetToken: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                passwordResetTokenExpiresAt: {
                    type: DataTypes.DATE,
                    allowNull: true
                },
                birthday: DataTypes.DATEONLY,
                vacationDaysTotal: {
                    type: DataTypes.INTEGER,
                    defaultValue: 0
                },
                vacationDaysTaken: {
                    type: DataTypes.INTEGER,
                    defaultValue: 0
                },
                fullName: {
                    type: DataTypes.VIRTUAL,
                    get() {
                        return `${this.firstName} ${this.lastName}`;
                    }
                }
            },
            {
                sequelize,
                timestamps: true,
                paranoid: true,
                modelName: 'User',
                tableName: 'users',
                defaultScope: {
                    attributes: {
                        exclude: [
                            'password',
                            'passwordResetTokenExpiresAt',
                            'passwordResetToken'
                        ]
                    },
                    include: [
                        {
                            as: 'roles',
                            association: 'roles',
                            attributes: ['id', 'name'],
                            through: {
                                attributes: []
                            }
                        }
                    ]
                },
                hooks: {
                    afterDestroy: destroyUserAssociations,
                    beforeSave: async (user, options) => {
                        if (options.fields.includes('password')) {
                            await hashPassword(user);
                        }
                    }
                }
            }
        );
    }

    return User;
};

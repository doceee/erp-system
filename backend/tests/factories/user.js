const { faker } = require('@faker-js/faker');
const { User, Role } = db;

class UserFactory {
    userRole;

    static async generate(role) {
        this.userRole = await Role.create({ name: role });

        return {
            email: faker.internet.email(),
            firstName: faker.lorem.word(6),
            lastName: faker.lorem.word(6),
            password: `${faker.lorem.word(6) + '1A!'}`,
            birthday: faker.date.recent()
        };
    }

    static async create(userData) {
        const userAcc = await User.create(userData);
        await userAcc.addRole(this.userRole);

        return userAcc;
    }
}

module.exports = UserFactory;

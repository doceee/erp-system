'use strict';
const di = require('../di');
const { User, Role } = di.get('services.sequelize');
const { faker } = require('@faker-js/faker');

module.exports = {
    async up() {
        const adminRole = await Role.create({ name: 'admin' });
        const userRole = await Role.create({ name: 'user' });

        const user = await User.create({
            firstName: faker.lorem.word(6),
            lastName: faker.lorem.word(6),
            email: 'user@demo.test',
            password: 'abcdef1A!',
            birthday: faker.date.past()
        });
        const user2 = await User.create({
            firstName: faker.lorem.word(6),
            lastName: faker.lorem.word(6),
            email: 'user2@demo.test',
            password: 'abcdef1A!',
            birthday: faker.date.past()
        });
        const admin = await User.create({
            firstName: faker.lorem.word(6),
            lastName: faker.lorem.word(6),
            email: 'admin@demo.test',
            password: 'abcdef1A!',
            birthday: faker.date.past()
        });

        for (let i = 0; i < 25; i++) {
            let newUser = await User.create({
                firstName: faker.lorem.word(6),
                lastName: faker.lorem.word(6),
                email: faker.internet.email(),
                password: 'abcdef1A!',
                birthday: faker.date.past()
            });
            await newUser.addRole(userRole);
        }

        await user.addRole(userRole);
        await user2.addRole(userRole);
        await admin.addRole(adminRole);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('users', null, {});
        await queryInterface.bulkDelete('roles', null, {});
        await queryInterface.bulkDelete('role2user', null, {});
    }
};

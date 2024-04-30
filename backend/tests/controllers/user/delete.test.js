const { login } = require('../../helpers/auth');
const UserFactory = require('../../factories/user');

let user;
let user2;
let admin;
let userData;
let user2Data;
let adminData;

describe('DELETE /api/users', () => {
    beforeAll(async () => {
        userData = await UserFactory.generate('user');
        user = await UserFactory.create(userData);
        user2Data = await UserFactory.generate('user');
        user2 = await UserFactory.create(user2Data);
        adminData = await UserFactory.generate('admin');
        admin = await UserFactory.create(adminData);
    });

    it('returns NO_CONTENT as ADMIN', async () => {
        const { email, password } = adminData;
        await login({
            email,
            password
        });

        await req.delete(`/api/users/${user2.id}`).expect(204);
    });

    it('returns FORBIDDEN as LOGGED USER', async () => {
        const { email, password } = userData;
        await login({
            email,
            password
        });

        await req.delete(`/api/users/${admin.id}`).expect(403);
    });

    it('returns UNAUTHORIZED as NOT LOGGED IN', async () => {
        await req.delete(`/api/users/${admin.id}`).expect(401);
    });
});

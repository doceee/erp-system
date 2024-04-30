const { login } = require('../../helpers/auth');
const UserFactory = require('../../factories/user');
const { v4: uuidv4 } = require('uuid');

let user;
let admin;
let userData;
let adminData;

describe('GET /api/users', () => {
    beforeAll(async () => {
        userData = await UserFactory.generate('user');
        user = await UserFactory.create(userData);
        adminData = await UserFactory.generate('admin');
        admin = await UserFactory.create(adminData);
    });

    it('returns SUCCESS as ADMIN', async () => {
        const { email, password } = adminData;
        await login({
            email,
            password
        });

        await req.get(`/api/users/${user.id}`).expect(200);
    });

    it('returns NOT_FOUND as ADMIN', async () => {
        const { email, password } = adminData;
        await login({
            email,
            password
        });

        await req.get(`/api/users/${uuidv4()}`).expect(404);
    });

    it('returns FORBIDDEN as LOGGED USER', async () => {
        const { email, password } = userData;
        await login({
            email,
            password
        });

        await req.get(`/api/users/${admin.id}`).expect(403);
    });

    it('returns UNAUTHORIZED as NOT LOGGED IN', async () => {
        await req.get(`/api/users/${admin.id}`).expect(401);
    });
});

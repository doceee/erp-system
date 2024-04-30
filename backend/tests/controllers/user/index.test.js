const { login } = require('../../helpers/auth');
const UserFactory = require('../../factories/user');

let user;
let admin;
let userData;
let adminData;

describe('/users', () => {
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

        const { body } = await req.get(`/api/users`).expect(200);

        expect(body).toEqual({
            page: expect.anything(),
            limit: expect.anything(),
            count: expect.anything(),
            pages: expect.anything(),
            secondPage: expect.anything(),
            rows: expect.anything()
        });
    });

    it('returns FORBIDDEN as LOGGED USER', async () => {
        const { email, password } = userData;
        await login({
            email,
            password
        });

        await req.get(`/api/users`).expect(403);
    });

    it('returns UNAUTHORIZED as NOT LOGGED IN', async () => {
        await req.get(`/api/users`).expect(401);
    });
});

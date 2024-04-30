const UserFactory = require('../../factories/user');

let userData;
let user;

describe('POST /api/auth/logout', () => {
    beforeAll(async () => {
        userData = await UserFactory.generate('admin');
        user = await UserFactory.create(userData);
    });

    it('returns NO_CONTENT logging out as LOGGED USER', async () => {
        const { email, password } = userData;

        await req.post('/api/auth/login').send({ email, password }).expect(200);

        await req.get(`/api/users/${user.id}`).expect(200);
        await req.post('/api/auth/logout').expect(204);
        await req.get(`/api/users/${user.id}`).expect(401);
    });

    it('returns NO_CONTENT logging out as NOT LOGGED USER', async () => {
        await req.post('/api/auth/logout').expect(204);
        await req.get(`/api/users/${user.id}`).expect(401);
    });
});

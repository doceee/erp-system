const UserFactory = require('../../factories/user');

let userData;

describe('POST /api/auth/login', () => {
    beforeAll(async () => {
        userData = await UserFactory.generate('admin');
        await UserFactory.create(userData);
    });

    it('returns SUCCESS sending VALID DATA', async () => {
        const { email, password } = userData;

        const { body } = await req
            .post('/api/auth/login')
            .send({
                email,
                password
            })
            .expect(200);

        expect(body).toEqual({
            firstName: expect.anything(),
            lastName: expect.anything(),
            fullName: expect.anything(),
            email: expect.anything(),
            birthday: expect.anything(),
            deletedAt: null,
            updatedAt: expect.anything(),
            createdAt: expect.anything(),
            vacationDaysTotal: expect.anything(),
            vacationDaysTaken: expect.anything(),
            id: expect.anything(),
            roles: [
                {
                    id: expect.anything(),
                    name: 'admin'
                }
            ]
        });
    });

    it('returns BAD_REQUEST sending NO DATA', async () => {
        const { body } = await req.post('/api/auth/login').send({}).expect(400);

        expect(body).toEqual({
            errors: [
                { message: 'Email field is required.', param: 'email' },
                { message: 'Password field is required.', param: 'password' }
            ]
        });
    });

    it('returns BAD_REQUEST sending INVALID DATA', async () => {
        const { body } = await req
            .post('/api/auth/login')
            .send({
                email: 'a',
                password: 'a'
            })
            .expect(400);

        expect(body).toEqual({
            errors: [
                { message: 'Incorrect email format.', param: 'email' },
                {
                    message:
                        'Password field must contain at least 6 characters (can not exceed 70 characters).',
                    param: 'password'
                },
                {
                    message:
                        'Password should contain minimum 6 till 70 characters with at least 1 small letter, 1 capital letter, 1 integer, 1 special character.',
                    param: 'password'
                }
            ]
        });
    });

    it('returns UNAUTHORIZED sending INVALID email, VALID password', async () => {
        const { password } = userData;

        await req
            .post('/api/auth/login')
            .send({
                email: 'invalid@email.test',
                password
            })
            .expect(401);
    });

    it('returns UNAUTHORIZED sending VALID email, INVALID password', async () => {
        const { email } = userData;

        await req
            .post('/api/auth/login')
            .send({
                email,
                password: 'InvalidPassword1!'
            })
            .expect(401);
    });
});

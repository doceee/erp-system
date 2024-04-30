const { login } = require('../../helpers/auth');
const UserFactory = require('../../factories/user');

let user;
let admin;
let userData;
let adminData;

describe('POST /api/users', () => {
    beforeAll(async () => {
        userData = await UserFactory.generate('user');
        user = await UserFactory.create(userData);
        adminData = await UserFactory.generate('admin');
        admin = await UserFactory.create(adminData);
    });

    it('returns CREATED sending VALID DATA as ADMIN', async () => {
        const { email, password } = adminData;
        await login({
            email,
            password
        });
        const newUser = await UserFactory.generate('user');

        const { body } = await req.post(`/api/users`).send(newUser).expect(201);
        delete newUser.password;

        expect(body).toEqual({
            ...newUser,
            fullName: expect.anything(),
            vacationDaysTotal: expect.anything(),
            vacationDaysTaken: expect.anything(),
            birthday: expect.anything(),
            deletedAt: null,
            roles: expect.anything(),
            updatedAt: expect.anything(),
            createdAt: expect.anything(),
            id: expect.anything()
        });
    });

    it('returns BAD_REQUEST sending EMPTY DATA as ADMIN', async () => {
        const { email, password } = adminData;
        await login({
            email,
            password
        });

        const { body } = await req.post(`/api/users`).send({}).expect(400);

        expect(body).toEqual({
            errors: [
                {
                    message: 'First Name field is required.',
                    param: 'firstName'
                },
                {
                    message: 'Last Name field is required.',
                    param: 'lastName'
                },
                {
                    message: 'Birthday field is required.',
                    param: 'birthday'
                },
                {
                    message: 'Email field is required.',
                    param: 'email'
                },
                {
                    message: 'Password field is required.',
                    param: 'password'
                }
            ]
        });
    });

    it('returns BAD_REQUEST sending INVALID DATA as ADMIN', async () => {
        const { email, password } = adminData;
        await login({
            email,
            password
        });

        const { body } = await req
            .post(`/api/users`)
            .send({
                firstName: 'a',
                lastName: 'a',
                birthday: 'a',
                email: 'a',
                password: 'a'
            })
            .expect(400);

        expect(body).toEqual({
            errors: [
                {
                    message:
                        'First Name field must contain at least 3 characters (can not exceed 10 characters).',
                    param: 'firstName'
                },
                {
                    message:
                        'Last Name field must contain at least 3 characters (can not exceed 10 characters).',
                    param: 'lastName'
                },
                {
                    message: 'Incorrect date format.',
                    param: 'birthday'
                },
                {
                    message: 'Incorrect email format.',
                    param: 'email'
                },
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

    it('returns FORBIDDEN sending VALID DATA as LOGGED USER', async () => {
        const { email, password } = userData;
        await login({
            email,
            password
        });

        await req
            .post(`/api/users`)
            .send(UserFactory.generate('user'))
            .expect(403);
    });

    it('returns UNAUTHORIZED sending VALID DATA as NOT LOGGED IN', async () => {
        await req
            .post(`/api/users`)
            .send(UserFactory.generate('user'))
            .expect(401);
    });
});

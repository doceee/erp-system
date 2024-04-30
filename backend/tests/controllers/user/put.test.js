const { login } = require('../../helpers/auth');
const UserFactory = require('../../factories/user');
const { v4: uuidv4 } = require('uuid');

let user;
let user2;
let admin;
let userData;
let user2Data;
let adminData;

describe('PUT /api/users', () => {
    beforeAll(async () => {
        userData = await UserFactory.generate('user');
        user = await UserFactory.create(userData);
        user2Data = await UserFactory.generate('user');
        user2 = await UserFactory.create(user2Data);
        adminData = await UserFactory.generate('admin');
        admin = await UserFactory.create(adminData);
    });

    it('returns OK sending VALID DATA as ADMIN', async () => {
        const { email, password } = adminData;
        userData = await UserFactory.generate('user');
        await login({
            email,
            password
        });

        const { body } = await req
            .put(`/api/users/${user.id}`)
            .send(userData)
            .expect(200);
        delete userData.password;

        expect(body).toEqual({
            ...userData,
            fullName: expect.anything(),
            birthday: expect.anything(),
            roles: expect.anything(),
            deletedAt: null,
            vacationDaysTotal: expect.anything(),
            vacationDaysTaken: expect.anything(),
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

        const { body } = await req
            .put(`/api/users/${user.id}`)
            .send({})
            .expect(400);

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
            .put(`/api/users/${user.id}`)
            .send({
                firstName: 'a',
                lastName: 'a',
                birthday: 'a',
                email: 'a'
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
                }
            ]
        });
    });

    it('returns NOT_FOUND sending INVALID ID as ADMIN', async () => {
        const { email, password } = adminData;
        userData = await UserFactory.generate();
        delete userData.password;
        await login({
            email,
            password
        });

        await req.put(`/api/users/${uuidv4()}`).send(userData).expect(404);
    });

    it('returns FORBIDDEN sending VALID DATA as LOGGED USER', async () => {
        const { email, password } = user2Data;
        userData = UserFactory.generate();
        delete userData.password;
        await login({
            email,
            password
        });

        await req.put(`/api/users/${admin.id}`).send(userData).expect(403);
    });

    it('returns UNAUTHORIZED sending VALID DATA as NOT LOGGED IN', async () => {
        userData = UserFactory.generate();
        delete userData.password;

        await req.put(`/api/users/${admin.id}`).send(userData).expect(401);
    });
});

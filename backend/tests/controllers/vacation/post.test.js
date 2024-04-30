const { User, Vacation } = db;
const { login } = require('../../helpers/auth');
const UserFactory = require('../../factories/user');
const VacationFactory = require('../../factories/vacation');
const ContractFactory = require('../../factories/contract');

let user;
let user2;
let admin;
let userData;
let user2Data;
let adminData;

describe('POST /api/vacations', () => {
    beforeAll(async () => {
        userData = await UserFactory.generate('user');
        user2Data = await UserFactory.generate('user');
        user = await UserFactory.create(userData);
        user2 = await UserFactory.create(user2Data);
        adminData = await UserFactory.generate('admin');
        admin = await UserFactory.create(adminData);
        const contract1Data = ContractFactory.generate({
            userId: user.id,
            startDate: '2022-01-01'
        });
        const contract2Data = ContractFactory.generate({
            userId: user2.id,
            startDate: '2022-01-01'
        });
        await ContractFactory.create(contract1Data);
        await ContractFactory.create(contract2Data);
    });

    it('returns CREATED sending VALID DATA as ADMIN', async () => {
        const { email, password } = adminData;
        await login({
            email,
            password
        });
        const vacation1Data = VacationFactory.generate({
            userId: user.id,
            startDate: '2022-01-03',
            endDate: '2022-01-07',
            isApproved: true
        });
        const vacation2Data = VacationFactory.generate({
            userId: user.id,
            startDate: '2022-01-10',
            endDate: '2022-01-14',
            isApproved: true
        });
        const vacation1Created = await VacationFactory.create(vacation1Data);

        const { body: vacation2Created } = await req
            .post(`/api/vacations`)
            .send(vacation2Data)
            .expect(201);

        const userWithVacations = await User.findByPk(user.id);

        expect(vacation2Created).toEqual({
            ...vacation2Data,
            deletedAt: null,
            duration: expect.anything(),
            updatedAt: expect.anything(),
            createdAt: expect.anything(),
            id: expect.anything(),
            user: {
                id: expect.anything(),
                firstName: expect.anything(),
                fullName: expect.anything(),
                lastName: expect.anything(),
                roles: expect.anything()
            }
        });
        expect(userWithVacations.vacationDaysTaken).toBe(
            vacation1Created.duration + vacation2Created.duration
        );
    });

    it('returns CREATED sending VALID DATA as USER', async () => {
        const { email, password } = user2Data;
        const vacation1Data = VacationFactory.generate({
            userId: user2.id,
            startDate: '2022-01-10',
            endDate: '2022-01-14',
            isApproved: true
        });
        const vacation2Data = VacationFactory.generate({
            userId: user2.id,
            startDate: '2022-01-17',
            endDate: '2022-01-21'
        });

        await login({
            email,
            password
        });

        const vacation1Created = await VacationFactory.create(vacation1Data);

        const { body: vacation2Created } = await req
            .post(`/api/vacations`)
            .send(vacation2Data)
            .expect(201);

        const userWithVacations = await User.findByPk(user2.id);

        expect(vacation2Created).toEqual({
            ...vacation2Data,
            deletedAt: null,
            duration: expect.anything(),
            updatedAt: expect.anything(),
            createdAt: expect.anything(),
            id: expect.anything(),
            user: {
                id: expect.anything(),
                firstName: expect.anything(),
                fullName: expect.anything(),
                lastName: expect.anything(),
                roles: expect.anything()
            }
        });
        expect(userWithVacations.vacationDaysTaken).toBe(
            vacation1Created.duration
        );
    });

    it('returns INTERNAL_SERVER_ERROR WHEN vacation.create FAILED sending VALID DATA as ADMIN', async () => {
        const { email, password } = adminData;
        const vacationData = VacationFactory.generate({
            userId: user.id,
            startDate: '2022-08-03',
            endDate: '2022-08-07'
        });
        let spy = jest.spyOn(Vacation, 'create').mockImplementation(() => {
            throw new Error('UFO killed our DB');
        });

        await login({
            email,
            password
        });

        const userDataBefore = await User.findByPk(user.id);

        await req.post(`/api/vacations`).send(vacationData).expect(500);

        const userDataAfter = await User.findByPk(user.id);

        expect(userDataAfter.vacationDaysTaken).toBe(
            userDataBefore.vacationDaysTaken
        );
        spy.mockClear();
    });

    it('returns BAD_REQUEST sending EMPTY DATA as ADMIN', async () => {
        const { email, password } = adminData;

        await login({
            email,
            password
        });

        const { body } = await req.post(`/api/vacations`).send({}).expect(400);

        expect(body).toEqual({
            errors: [
                {
                    message: 'User ID is required.',
                    param: 'userId'
                },
                {
                    message: 'Start date is required.',
                    param: 'startDate'
                },
                {
                    message: 'End date is required.',
                    param: 'endDate'
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
            .post(`/api/vacations`)
            .send({
                userId: 'invalid',
                startDate: 'invalid',
                endDate: 'invalid'
            })
            .expect(400);

        expect(body).toEqual({
            errors: [
                {
                    message: 'Provided user does not exist.',
                    param: 'userId'
                },
                {
                    message: 'Invalid date type.',
                    param: 'startDate'
                },
                {
                    message: 'Invalid date type.',
                    param: 'endDate'
                }
            ]
        });
    });

    it('returns BAD_REQUEST sending INVALID DATA as USER', async () => {
        const { email, password } = userData;
        const vacationData = VacationFactory.generate({
            userId: user2.id,
            startDate: '123',
            endDate: '123'
        });

        await login({
            email,
            password
        });

        const { body } = await req
            .post(`/api/vacations`)
            .send(vacationData)
            .expect(400);

        expect(body).toEqual({
            errors: [
                {
                    message: 'Invalid user ID.',
                    param: 'userId'
                },
                {
                    message: 'Invalid date type.',
                    param: 'startDate'
                },
                {
                    message: 'Invalid date type.',
                    param: 'endDate'
                }
            ]
        });
    });

    it('returns UNAUTHORIZED sending VALID DATA as NOT LOGGED IN', async () => {
        const vacationData = VacationFactory.generate({
            userId: user2.id,
            startDate: '2022-03-10',
            endDate: '2022-03-14'
        });

        await req.post(`/api/vacations`).send(vacationData).expect(401);
    });
});

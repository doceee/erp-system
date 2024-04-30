const { Contract, User } = db;
const { login } = require('../../helpers/auth');
const UserFactory = require('../../factories/user');
const ContractFactory = require('../../factories/contract');

let user;
let admin;
let userData;
let adminData;

describe('POST /api/contracts', () => {
    beforeAll(async () => {
        userData = await UserFactory.generate('user');
        user = await UserFactory.create(userData);
        adminData = await UserFactory.generate('admin');
        admin = await UserFactory.create(adminData);
    });

    beforeEach(() => {
        jest.resetModules();
    });

    it('returns CREATED sending VALID DATA as ADMIN', async () => {
        const { email, password } = adminData;
        await login({
            email,
            password
        });
        const contract1Data = ContractFactory.generate({
            userId: user.id,
            startDate: '2035-01-01'
        });
        const contract2Data = ContractFactory.generate({
            userId: user.id,
            startDate: '2036-01-01'
        });

        const contract1Created = await ContractFactory.create(contract1Data);

        const { body: contract2Created } = await req
            .post(`/api/contracts`)
            .send(contract2Data)
            .expect(201);
        const userWithContract = await User.findByPk(user.id);

        expect(contract2Created).toEqual({
            ...contract2Data,
            deletedAt: null,
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
        expect(userWithContract.vacationDaysTotal).toBe(
            contract1Created.vacationDays + contract2Created.vacationDays
        );
    });

    it('returns INTERNAL_SERVER_ERROR WHEN contract.create FAILED sending VALID DATA as ADMIN', async () => {
        const { email, password } = adminData;
        const contractData = ContractFactory.generate({
            userId: user.id,
            startDate: '2037-01-01'
        });
        let spy = jest.spyOn(Contract, 'create').mockImplementation(() => {
            throw new Error('UFO killed our DB');
        });

        await login({
            email,
            password
        });

        const userDataBefore = await User.findByPk(user.id);

        await req.post(`/api/contracts`).send(contractData).expect(500);

        const userDataAfter = await User.findByPk(user.id);

        expect(userDataAfter.vacationDaysTotal).toBe(
            userDataBefore.vacationDaysTotal
        );
        spy.mockClear();
    });

    it('returns BAD_REQUEST sending EMPTY DATA as ADMIN', async () => {
        const { email, password } = adminData;

        await login({
            email,
            password
        });

        const { body } = await req.post(`/api/contracts`).send({}).expect(400);

        expect(body).toEqual({
            errors: [
                { message: 'User ID is required.', param: 'userId' },
                { message: 'Position field is required.', param: 'position' },
                {
                    message: 'Start date field is required.',
                    param: 'startDate'
                },
                {
                    message:
                        'This field is required if End date field is not set.',
                    param: 'duration'
                },
                {
                    message: 'Vacation Days field is required.',
                    param: 'vacationDaysPerYear'
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
            .post(`/api/contracts`)
            .send({
                userId: 'invalid',
                position: '',
                startDate: 'invalid',
                endDate: 'invalid',
                duration: 'invalid',
                vacationDaysPerYear: 'invalid'
            })
            .expect(400);

        expect(body).toEqual({
            errors: [
                { message: 'Provided user does not exist.', param: 'userId' },
                {
                    message:
                        'Position field must contain at least 3 characters (can not exceed 20 characters).',
                    param: 'position'
                },
                { message: 'Invalid date type.', param: 'startDate' },
                { message: 'Invalid date type.', param: 'endDate' },
                {
                    message:
                        'Duration field must be of type number (min 1, max 60).',
                    param: 'duration'
                },
                {
                    message:
                        'Vacation Days field must be exact number (20 or 26)',
                    param: 'vacationDaysPerYear'
                }
            ]
        });
    });

    it('returns FORBIDDEN sending VALID DATA as LOGGED USER', async () => {
        const { email, password } = userData;
        const contractData = ContractFactory.generate({
            userId: user.id,
            startDate: '2022-01-01'
        });

        await login({
            email,
            password
        });

        await req.post(`/api/contracts`).send(contractData).expect(403);
    });

    it('returns UNAUTHORIZED sending VALID DATA as NOT LOGGED IN', async () => {
        const contractData = ContractFactory.generate({
            userId: user.id,
            startDate: '2038-01-01'
        });

        await req.post(`/api/users`).send(contractData).expect(401);
    });
});

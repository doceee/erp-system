const { User, Vacation } = db;
const { login } = require('../../helpers/auth');
const UserFactory = require('../../factories/user');
const VacationFactory = require('../../factories/vacation');
const ContractFactory = require('../../factories/contract');

let user;
let admin;
let userData;
let adminData;

describe('PUT /api/vacations', () => {
    beforeAll(async () => {
        adminData = await UserFactory.generate('admin');
        admin = await UserFactory.create(adminData);
        userData = await UserFactory.generate('user');
        user = await UserFactory.create(userData);
        const contractData = ContractFactory.generate({
            userId: user.id,
            startDate: '2022-01-01'
        });
        await ContractFactory.create(contractData);
    });

    it('returns OK sending VALID DATA as ADMIN', async () => {
        const { email, password } = adminData;
        const vacation1Data = VacationFactory.generate({
            userId: user.id,
            startDate: '2022-01-03',
            endDate: '2022-01-07',
            isApproved: true
        });
        const vacation2Data = VacationFactory.generate({
            userId: user.id,
            startDate: '2022-01-10',
            endDate: '2022-01-14'
        });

        await login({
            email,
            password
        });

        const vacation1Created = await VacationFactory.create(vacation1Data);
        const vacation2Created = await VacationFactory.create(vacation2Data);

        const { body: vacation2Updated } = await req
            .put(`/api/vacations/${vacation2Created.id}`)
            .send({
                ...vacation2Data,
                startDate: '2022-05-05',
                endDate: '2022-05-05'
            })
            .expect(200);

        const userAfterUpdate = await User.findByPk(user.id);

        expect(vacation2Updated).toEqual({
            ...vacation2Data,
            startDate: '2022-05-05',
            endDate: '2022-05-05',
            duration: 1,
            deletedAt: null,
            isApproved: true,
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
        expect(userAfterUpdate.vacationDaysTaken).toBe(
            vacation1Created.duration + vacation2Updated.duration
        );
    });

    it('returns INTERNAL_SERVER_ERROR WHEN user.update FAILED sending VALID DATA as ADMIN', async () => {
        const { email, password } = adminData;
        let spy = jest.spyOn(Vacation, 'update').mockImplementation(() => {
            throw new Error('UFO killed our DB');
        });
        const vacationData = VacationFactory.generate({
            userId: user.id,
            startDate: '2022-07-03',
            endDate: '2022-07-07'
        });

        await login({
            email,
            password
        });

        const vacationCreated = await VacationFactory.create(vacationData);

        const userBeforeUpdate = await User.findByPk(user.id);

        await req
            .put(`/api/vacations/${vacationCreated.id}`)
            .send({
                ...vacationData,
                startDate: '2022-04-01',
                endDate: '2022-04-04'
            })
            .expect(500);

        const userAfterUpdate = await User.findByPk(user.id);

        expect(userAfterUpdate.vacationDaysTaken).toBe(
            userBeforeUpdate.vacationDaysTaken
        );
        spy.mockClear();
    });
});

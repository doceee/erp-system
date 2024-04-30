const { login } = require('../../helpers/auth');
const UserFactory = require('../../factories/user');
const ContractFactory = require('../../factories/contract');
const { Contract, User } = db;

let user;
let admin;
let userData;
let adminData;

describe('PUT /api/contracts', () => {
    beforeAll(async () => {
        userData = await UserFactory.generate('user');
        user = await UserFactory.create(userData);
        adminData = await UserFactory.generate('admin');
        admin = await UserFactory.create(adminData);
    });

    it('returns OK sending VALID DATA as ADMIN', async () => {
        const { email, password } = adminData;
        let contract1Data = ContractFactory.generate({
            userId: user.id,
            startDate: '2022-01-01'
        });
        let contract2Data = ContractFactory.generate({
            userId: user.id,
            startDate: '2023-01-01'
        });

        await login({
            email,
            password
        });

        let contract1 = await ContractFactory.create(contract1Data);
        let contract2 = await ContractFactory.create(contract2Data);

        const { body: contractUpdated } = await req
            .put(`/api/contracts/${contract2.id}`)
            .send({
                ...contract2Data,
                duration: 3,
                endDate: ''
            })
            .expect(200);

        const userfterUpdate = await User.findByPk(user.id);

        expect(contractUpdated).toEqual({
            ...contract2Data,
            endDate: expect.anything(),
            vacationDays: 5,
            duration: 3,
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
        expect(userfterUpdate.vacationDaysTotal).toBe(
            contractUpdated.vacationDays + contract1.vacationDays
        );
    });

    it('returns INTERNAL_SERVER_ERROR WHEN user.update FAILED sending VALID DATA as ADMIN', async () => {
        const { email, password } = adminData;
        let spy = jest.spyOn(Contract, 'update').mockImplementation(() => {
            throw new Error('UFO killed our DB');
        });
        let contractData = ContractFactory.generate({
            userId: user.id,
            startDate: '2024-01-01'
        });

        await login({
            email,
            password
        });

        let contract = await ContractFactory.create(contractData);

        const userBeforeUpdate = await User.findByPk(user.id);

        await req
            .put(`/api/contracts/${contract.id}`)
            .send({
                ...contractData,
                duration: 3
            })
            .expect(500);

        const userAfterUpdate = await User.findByPk(user.id);

        expect(userAfterUpdate.vacationDaysTotal).toBe(
            userBeforeUpdate.vacationDaysTotal
        );
        spy.mockClear();
    });
});

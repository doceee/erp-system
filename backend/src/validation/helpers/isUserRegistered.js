module.exports = async (id, di) => {
    const userRepository = di.get('repositories.user');

    const registeredUser = await userRepository.findOne({
        where: {
            id
        }
    });

    if (!registeredUser) {
        throw new Error('Provided user does not exist.');
    }
};

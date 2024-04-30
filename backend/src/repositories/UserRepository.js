const AbstractRepository = require('./AbstractRepository');

class UserRepository extends AbstractRepository {
    get model() {
        return this.db.User;
    }
}

module.exports = UserRepository;

const AbstractRepository = require('./AbstractRepository');

class UserRepository extends AbstractRepository {
    get model() {
        return this.db.Vacation;
    }
}

module.exports = UserRepository;

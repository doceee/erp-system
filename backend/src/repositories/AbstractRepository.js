class AbstractRepository {
    constructor(db) {
        this.db = db;
    }

    findAll(options = {}) {
        return this.model.findAll(options);
    }

    findAndCountAll(options = {}) {
        return this.model.findAndCountAll(options);
    }

    findOne(options = {}) {
        return this.model.findOne(options);
    }

    findById(id, options = {}) {
        return this.model.findByPk(id, options);
    }

    create(data, options = {}) {
        return this.model.create(data, options);
    }

    update(data, options = {}) {
        return this.model.update(data, options);
    }
}

module.exports = AbstractRepository;

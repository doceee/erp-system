const fs = require('fs');
const path = require('path');

class SequelizeFactory {
    static create(Sequelize, configDb) {
        const db = {};
        const { DataTypes } = Sequelize;
        const sequelize = new Sequelize(configDb.url, configDb);
        const modelsPath = path.join(__dirname, '../../models');

        fs.readdirSync(modelsPath)
            .filter(
                file =>
                    file.indexOf('.') !== 0 &&
                    file !== 'index.js' &&
                    file.slice(-3) === '.js'
            )
            .forEach(file => {
                const fileName = file.split('.')[0];
                db[fileName] = require(path.join(modelsPath, file))(
                    sequelize,
                    DataTypes
                );
            });

        Object.keys(db).forEach(modelName => {
            if (db[modelName].associate) {
                db[modelName].associate(db);
            }
        });

        db.sequelize = sequelize;

        return db;
    }
}

module.exports = SequelizeFactory;

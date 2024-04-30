const fs = require('fs');
const path = require('path');
const { DataTypes } = require('sequelize');
const basename = path.basename(__filename);

const db = {};

fs.readdirSync(__dirname)
    .filter(
        file =>
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js'
    )
    .forEach(file => {
        const fileName = file.split('.')[0];
        db[fileName] = require(path.join(__dirname, file))(null, DataTypes);
    });

module.exports = db;

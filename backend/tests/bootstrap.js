const truncateDatabase = require('./helpers/truncate');
const di = require('../src/di');
global.di = di;

module.exports = async () => {
    await truncateDatabase(di);
};

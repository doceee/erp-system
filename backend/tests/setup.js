const di = require('../src/di');
const db = di.get('services.sequelize');
const app = require('../src/index');
const req = require('supertest-session')(app);
const { logout } = require('./helpers/auth');

afterEach(() => logout());

global.di = di;
global.db = db;
global.req = req;

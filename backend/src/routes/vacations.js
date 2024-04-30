const express = require('express');
const router = express.Router();
const vacationValidation = require('../validation/vacations');
const uuidValidator = require('../validation/uuid');
const validate = require('../middleware/validation');
const isAdmin = require('../middleware/isAdmin');
const isLoggedIn = require('../middleware/isLoggedIn');

module.exports = di => {
    const indexController = di.get('controllers.vacation.indexController');
    const showController = di.get('controllers.vacation.showController');
    const storeController = di.get('controllers.vacation.storeController');
    const updateController = di.get('controllers.vacation.updateController');
    const deleteController = di.get('controllers.vacation.deleteController');

    router.get(
        '/:id',
        [isLoggedIn, isAdmin],
        [uuidValidator('id'), validate],
        (...args) => showController.invoke(...args)
    );

    router.post('/', [isLoggedIn], [vacationValidation, validate], (...args) =>
        storeController.invoke(...args)
    );

    router.put(
        '/:id',
        [isLoggedIn],
        [vacationValidation, validate],
        (...args) => updateController.invoke(...args)
    );

    router.delete('/:id', [isLoggedIn], (...args) =>
        deleteController.invoke(...args)
    );

    router.get('/', [isLoggedIn], (...args) => indexController.invoke(...args));

    return router;
};

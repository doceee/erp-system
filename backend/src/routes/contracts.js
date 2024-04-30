const express = require('express');
const router = express.Router();
const contractValidation = require('../validation/contracts');
const uuidValidator = require('../validation/uuid');
const validate = require('../middleware/validation');
const isAdmin = require('../middleware/isAdmin');
const isLoggedIn = require('../middleware/isLoggedIn');

module.exports = di => {
    const indexController = di.get('controllers.contract.indexController');
    const showController = di.get('controllers.contract.showController');
    const storeController = di.get('controllers.contract.storeController');
    const updateController = di.get('controllers.contract.updateController');
    const deleteController = di.get('controllers.contract.deleteController');

    router.get(
        '/:id',
        [isLoggedIn, isAdmin],
        [uuidValidator('id'), validate],
        (...args) => showController.invoke(...args)
    );

    router.post(
        '/',
        [isLoggedIn, isAdmin],
        [contractValidation, validate],
        (...args) => storeController.invoke(...args)
    );

    router.put(
        '/:id',
        [isLoggedIn, isAdmin],
        [contractValidation, validate],
        (...args) => updateController.invoke(...args)
    );

    router.delete(
        '/:id',
        [isLoggedIn, isAdmin],
        [uuidValidator('id'), validate],
        (...args) => deleteController.invoke(...args)
    );

    router.get('/', [isLoggedIn], (...args) => indexController.invoke(...args));

    return router;
};
